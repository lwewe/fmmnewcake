<template>
  <div class="conPage">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <van-radio-group v-model="radio" class="radio-group">
      <div class="addressBox" v-for="item in addressList" :key="item.id">
        <div class="addressItem">
          <div class="addressIcon">
            <img class="img" src="../../assets/mine/dzh.png" alt="">
          </div>
          <div class="nameInfo">
            <div>{{ item.name }}</div>
            <div class="addressDetail">{{ item.province ? item.province : "" }}
              {{ item.city ? item.city : "" }} {{ item.area ? item.area : "" }}
               {{ item.addr }}
            </div>
            <div class="phone">
              <div>{{ item.phone }}</div>
              <div class="label">{{ item.tag }}</div>
            </div>
          </div>
        </div>
        <div class="bottomBox">
          <div class="radio">
            <van-radio checked-color="#ED3036" :name="item.id" @click="changeDefault(item.id)">默认地址</van-radio>
          </div>
          <div class="rightBox">
            <div class="deleteBox" @click="deleteAdress(item.gid)">
              <div class="delete">
                <img class="img" src="../../assets/mine/sc.png" alt="">
              </div>
              <div>删除</div>
            </div>
            <div class="deleteBox" @click="exitAdress(item.id)">
              <div class="delete">
                <img class="img" src="../../assets/mine/xg.png" alt="">
              </div>
              <div>编辑</div>
            </div>
          </div>
        </div>
      </div>
    </van-radio-group>
    <!--    添加新地址-->
    <div class="addNewAddress">
      <div class="btn" @click="toAddAddress">添加新地址</div>
    </div>
  </div>
</template>
<script>
import {delscaddress, getScaddress, mrscaddress} from "@/api/cakeAddress";

export default {
  name: "AddressManagement",
  data() {
    return {
      radio: "",
      addressList: [],
      change:null,
      loadingflag:true
    }
  },
  methods: {
    toAddAddress() {
      if(this.change==0){
        this.$router.push({path:"/cakeExitAdress",query:{change:this.change,length:this.addressList.length}})
      }else{
        this.$router.push("/cakeExitAdress")
      }
    },
    getScaddressList() {
      getScaddress().then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.addressList = res.data.address_list
          if(this.addressList.length>0){
            if(this.addressList.filter(item => item.is_default == 1).length>0){
              this.radio = this.addressList.filter(item => item.is_default == 1)[0].id
            }
          }
        }
      })
    },
    // 修改默认地址
    changeDefault(id) {
      mrscaddress({
        id
      }).then(res => {
        if (res.code == 200) {
          this.$toast(res.data)
          this.getScaddressList()
          if(this.change==0){
            this.$router.go(-1)
          }
        }
      })
    },
    // 删除地址
    deleteAdress(id) {
      this.$dialog.confirm({
        message: '是否要删除该地址？',
        confirmButtonColor: 'red'
      }).then(() => {
        delscaddress({
          gid:id
        }).then(res => {
          if (res.code == 200) {
            this.$toast(res.data)
            this.getScaddressList()
          }else{
            this.$toast(res.data)
          }
        })
      }).catch(() => {
      })
    },
    //   编辑地址
    exitAdress(id) {
      this.$router.push({path: "/cakeExitAdress", query: {id}})
    }
  },
  created() {
    this.getScaddressList()
    this.change = this.$route.query.change
  }
}
</script>

<style scoped lang="less">
.conPage {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 10px;
  background-color: #F0F0F0;
  padding-bottom: 75px;
}

.radio-group {
  margin-top: -10px;
}

.addressBox {
  background-color: white;
  padding: 15px 10px;
  border-radius: 10px;
  margin-top: 10px;

  .addressItem {
    display: flex;
    align-items: center;
    gap: 5px;

    .addressIcon {
      width: 17px;
    }
  }

  .delete {
    width: 14px;
    padding-top: 3px;
  }

  .deleteBox {
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .rightBox {
    display: flex;
    align-items: center;
    gap: 15px;
    color: #6E6E6E;
  }

  .bottomBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #F0F0F0;
    padding-top: 10px;
  }

  .radio {
    font-weight: bold;
    font-size: 15px;
  }

  /deep/ .van-radio__icon .van-icon {
    width: 18px;
    height: 18px;
    font-size: 12px;
    line-height: 18px;
  }

  .nameInfo {
    width: 93%;
    padding-bottom: 10px;

    .addressDetail {
      color: #707070;
      font-size: 15px;
      margin-top: 8px;
      line-height: 22px;
    }

    .phone {
      color: #707070;
      font-size: 13px;
      margin-top: 6px;
      display: flex;
      align-items: center;
      gap: 10px;

      .label {
        background-color: #238DED;
        color: white;
        padding: 0px 10px;
        font-size: 12px;
      }
    }
  }

}

.addNewAddress {
  background-color: white;
  position: fixed;
  width: 100%;
  left: 0px;
  bottom: 0;
  box-sizing: border-box;
  padding: 13px 15px;

  .btn {
    background-image: linear-gradient(to right, #F28F8E, #DC4F4E);
    color: white;
    border-radius: 30px;
    text-align: center;
    height: 39px;
    line-height: 39px;
    font-size: 17px;
  }
}

</style>