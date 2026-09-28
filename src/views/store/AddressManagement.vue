<template>
  <div class="conPage">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>
    <NProgress v-if="loadingflag" />
    <!--    <loading></loading>-->
    <!--    <van-radio-group v-model="radio" class="radio-group">-->
    <div class="addressBox" v-for="(item, index) in addresslist" :key="index" @click="goproductlist(item)">
      <div class="addressItem">
        
        <div class="nameInfo">
          
          <div class="addressDetail">{{ item.addr + item.number || item.address + item.detail }}</div>
         <div style="display: flex;justify-content: space-between;font-size: 13px;">
            <!-- <p style="width: 70px;">

              <span v-if="item.sex=='1'" style="float: left;">先生</span>
            </p> -->
            <span>{{ item.contact || item.receiver }}  <span class="phone">{{ item.phone || item.mobile }}</span></span>

            
          </div>
        </div>
        <div class="addressIcon">
          <!-- <img class="img" src="../../assets/mine/dzh.png" alt=""> -->
          <img style="width: 22px;margin-right: 15px;height: 25px;" src="../../assets/backimage/goselect.png" alt=""></img>
        </div>
      </div>
      <div class="bottomBox">
        <!--          <div class="radio">-->
        <!--            <van-radio checked-color="#ED3036" :name="index || 0">默认地址</van-radio>-->
        <!--          </div>-->
        <div class="rightBox">
          <div class="deleteBox" @click.stop="deleaddress(item.address_id)">
            <div class="delete">
              <img class="img" src="../../assets/mine/sc.png" alt="">
            </div>
            <div>删除</div>
          </div>
          <div class="deleteBox" @click.stop="changeaddress(item)">
            <div class="delete">
              <img class="img" src="../../assets/mine/xg.png" alt="">
            </div>
            <div>编辑</div>
          </div>
        </div>
      </div>
    </div>

    <!--    </van-radio-group>-->
    <!--    添加新地址-->
    <div class="addNewAddress">
      <div class="btn" @click="toAddAddress">添加配送地址</div>
    </div>
  </div>
</template>
<script>
import { getMDLProductList, getKFCProductList, getBSKProductList, getMDLVerify, getKFCVerify } from "@/api/store";
import { delscaddress } from "@/api/cakeAddress";
import { getAddressDelete, getAddressList } from "@/api/service";
import { getShopsList } from "@/api/newOrder";
import { getAddressDeletes, getAddressLists } from "@/api/address";

export default {
  name: "AddressManagement",
  data() {
    return {
      radio: "1",
      num1: 0,
      num2: 0,
      store: [],
      addresslist: [],
      uid: "",
      loadingflag: true,
      cityId: ""
    }
  },
  methods: {
    toAddAddress() {
      sessionStorage.removeItem("addressData")
      this.$router.push("/addAddress" + "?num1=" + this.num1)
    },
    changeaddress(item) {
      sessionStorage.removeItem("addressData")
      // if (this.num1 == 3||this.num1 == 1||this.num1 == 2) {
      let addr = {
        add_time: item.created_at,
        addr: item.area,
        contact: item.receiver,
        gender: item.sex,
        id: item.address_id,
        lat: item.lat,
        lon: item.lng,
        number: item.detail,
        phone: item.mobile,
      }
      this.$router.push("/addAddress?id=" + item.address_id + "&addr=" + JSON.stringify(addr) + "&num1=" + this.num1)
      //   return
      // }
      // this.$router.push("/addAddress?id=" + item.id+"&num1="+this.num1)
    },
    deleaddress(id) {
      let data = {
        apikey: this.$store.state.appkey,
        address_id: id,
        uid: this.uid,
      }
      this.$dialog.confirm({
        message: '是否要删除该地址？',
        confirmButtonColor: 'red'
      }).then(() => {
        // getAddressDelete({
        //   id
        // }).then(res => {
        //   this.$toast(res.msg)
        //   this.getAddress()
        //   // console.log(res);
        // })
        getAddressDeletes(data).then(res => {
          this.$toast(res.msg)
          if (res.code == 200) {
            this.getBskAddress()
            // console.log(res);
          }
        })
      }).catch(() => {
      })
    },
    getAddress() {
      getAddressList().then(res => {
        this.loadingflag = false
        this.addresslist = res.data.address_list
      })
    },
    getBskAddress() {
      var uid = localStorage.getItem("uid");
      this.uid = uid
      let data = {
        apikey: this.$store.state.appkey,
        receiverLat: this.$store.state.lng,
        receiverLng: this.$store.state.lat,
        uid: this.uid,   //11
        page: '1',
        limit: '100'
      }
      getAddressLists(data).then(res => {
        // console.log(res);
        this.loadingflag = false
        this.addresslist = res.data.list
      })
    },
    goproductlist(item) {

      //       const arr = new Date(item.created_at * 1000).getFullYear();
      //  console.log(arr)
      //       if (arr < 2026) {
      //         this.$toast({
      //           message: '当前地址未更新，请删除或新建地址', forbidClick: true,
      //           duration: 2000
      //         });
      //         return false
      //       }
      const createdAt = item.created_at * 1000; // 转换为毫秒

      // 设置截止时间：2026年1月7日 00:00:00
      const cutoffDate = new Date('2026-01-14T00:00:00').getTime();

      // 精确判断：创建时间是否早于2026年1月7日
      if (createdAt < cutoffDate) {
        this.$toast({
          message: '当前地址未更新，请删除或新建地址',
          forbidClick: true,
          duration: 2000
        });
        return false;
      }

      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 100000
      });
      // console.log(item)
      let addr = {}
      // if (this.num1 == 3) {
      addr = {
        add_time: item.created_at,
        addr: item.area,
        contact: item.receiver,
        gender: item.sex,
        id: item.address_id,
        lat: item.lat,
        lon: item.lng,
        number: item.detail,
        phone: item.mobile,
      }
      // } else {
      //   addr = item
      // }
      // return
      sessionStorage.removeItem("goods")
      sessionStorage.setItem('address_Item', JSON.stringify(addr))
      if (this.num1 == 1) {
        // this.getShopsList("MDL", item.lat, item.lon)
        this.getMDLProduct(item.lat, item.lng)
      } else if (this.num1 == 2) {
        // this.getShopsList("Kfc", item.lat, item.lon)
        this.getKFCProduct(item.lat, item.lng)
      } else if (this.num1 == 3) {
        this.getBSKProduct(item.lat, item.lng)
      }

    },
    getMDLProduct(lat, lng) {
      let data = {
        apikey: this.$store.state.appkey,
        receiverLat: lat,
        receiverLng: lng,
      }
      getMDLProductList(data).then(res => {
        if (res.code == 200) {
          this.$toast.clear();
          // console.log(res.data);

          this.store = res.data
          // console.log(this.store,"1111");
          sessionStorage.setItem("deliveryPrice", this.store.deliveryPrice)
          this.$router.push({ path: '/selectproduct', query: { 'num1': this.num1, storeid: this.store.storeCode, flag: true, num2: this.num2 } })
        } else {
          this.$toast(res.msg)
        }

      })
    },
    getKFCProduct(lat, lng) {
      let data = {
        apikey: this.$store.state.appkey,
        receiverLat: lat,
        receiverLng: lng,
      }
      getKFCProductList(data).then(res => {
        if (res.code == 200) {
          this.$toast.clear();
          // console.log(res);
          this.store = res.data
          sessionStorage.setItem("deliveryPrice", this.store.deliveryPrice)
          this.$router.push({ path: '/SelectProductwmkdj', query: { 'num1': this.num1, storeid: this.store.storeCode, flag: true, num2: this.num2 } })
        } else {
          this.$toast(res.msg)
        }
      })
    },
    getBSKProduct(lat, lng) {
      let data = {
        apikey: this.$store.state.appkey,
        receiverLat: lat,
        receiverLng: lng,
        orderType: "2"
      }
      getBSKProductList(data).then(res => {
        if (res.code == 200) {
          this.$toast.clear();
          // console.log(res);
          this.store = res.data
          sessionStorage.setItem("deliveryPrice", this.store.deliveryPrice)
          this.$router.push({
            path: '/selectproduct',
            query: { 'num1': this.num1, storeid: this.store.storeCode, flag: true, num2: this.num2 }
          })
        } else {
          this.$toast(res.msg)
        }

      })
    },
    getShopsList(ot, lat, lng) {
      getShopsList({
        ot,
        cityId: this.cityId,
        lon: lng,
        lat,
      }).then(res => {
        if (res.code == 200) {
          this.$toast.clear();
          this.store = res.data[0]
          this.$router.push({
            path: '/selectproduct',
            query: { 'num1': this.num1, storeid: this.store.id, flag: true, num2: this.num2 }
          })
        } else {
          this.$toast(res.msg || res.data)
        }
      })
    },
  },
  mounted() {
    // console.log(this.$router.push("num1"));
    // this.num1=this.$route.query.numl
  },
  created() {
    this.cityId = sessionStorage.getItem("targetId")
    this.num1 = this.$route.query.num1
    this.num2 = this.$route.query.num2
    this.$store.state.address = ""
    // if (this.num1 == 3) {
    this.getBskAddress()
    // } else {
    //   this.getAddress()
    // }
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
  padding: 15px 15px;
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
    //padding-top: 3px;
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
    justify-content: flex-end;
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
      color: #000000;
      font-size: 13px;
      margin-top: 6px;
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