<template>
<div class="addBox">
  <div class="address">
    <div class="title">请选择地址</div>
    <div class="choose">
      <div class="chooseItem" @click="change">{{ city ? city : '请选择' }}</div>
      <div class="chooseItem" v-if="county">{{ county ? county : '请选择' }}</div>
    </div>
    <!--    地区列表-->
    <div class="addressList" v-if="addressList.length==0">
      <div v-for="(item,vale) in addObj" :key="vale" :id="vale">
        <div style="padding-top: 1px">
          <div class="valeNum">{{ vale }}</div>
        </div>
        <div class="addrssItem" v-for="item2 in item" :key="item.id" @click="chanegAddress(item2)">
          <div :class="{success:selectId==item2.id}">{{ item2.name }}</div>
          <div class="success" v-if="selectId==item2.id">
            <van-icon name="success"/>
          </div>
        </div>
      </div>
    </div>
    <div class="addressList" v-else>
      <div class="addrssItem" v-for="item in addressList" :key="item.id"
           @click="chanegAddress(item)" :id="item.first_letter">
        <div :class="{success:selectId==item.id}">{{ item.name }}</div>
        <div class="success" v-if="selectId==item.id">
          <van-icon name="success"/>
        </div>
      </div>
    </div>
  </div>
  <!-- 右侧锚点列表 -->
  <div class="find" style="z-index: 1000;
    position: fixed;
    top: 45px;
    right: 2.2vw;
    text-align: center;
    font-size: 12px;
overflow: scroll;" v-if="addressList.length==0">
    <div style="margin-bottom: 5px;" v-for="(item,index) in findword" :key="index" :class="{seltctS:seltctS=='#'+item}"><a @click="changeHash('#'+item)" >{{
        item
      }}</a></div>
  </div>
</div>
</template>
<script>
import {getSccity, getSccounty} from "@/api/cakeAddress";

export default {
  name: "Address",
  data() {
    return {
      selectId: null,
      addressList: [],
      addObj: {},
      province: "",
      city: "",
      county: "",
      twon: "",
      allAddress: "",
      province_id: "",
      city_id: "",
      county_id: "",
      town_id: "",
      findword: [],
      seltctS:""
    }
  },
  methods: {
    change() {
      this.addressList = []
      this.county = ""
      this.city = ""
      this.selectId = ""
      this.getSccityList()
    },
    close() {
      this.$emit("chanegTown", false)
      this.allAddress = this.city + " " + this.county
      let dataId = {
        city_id: this.city,
        county_id: this.county,
      }
      this.$emit("getAddress", this.allAddress, dataId)
    },
    //锚点跳转
    changeHash(idname) {
      document.querySelector(idname).scrollIntoView(true);
      this.seltctS = idname
    },
    chanegAddress(item) {
      if (item.first_letter) {
        this.city = item.name
        this.city_id = item.id
        // 获取区
        this.getSccountyList(this.city_id)
      } else {
        this.selectId = item.id
        this.county = item.name
        this.county_id = item.id
        this.close()
      }
    },
    //   市
    getSccityList() {
      var dataObj = {}
      var arry = []
      this.addObj = {}
      this.findword = []
      getSccity().then(res => {
        if (res.code == 200) {
          // this.addressList = res.data.city_list
          //生成26英文字母,为锚点准备
          for (var i = 65; i < 91; i++) {
            this.findword.push(String.fromCharCode(i))
          }
          this.findword.forEach(item => {
            res.data.city_list.forEach(item2 => {
              if (item == item2.first_letter) {
                arry.push(item2)
                this.$set(dataObj, item, arry.filter(item3 => item3.first_letter == item));
              }
            })
          })
          this.addObj = dataObj
          if (!this.addObj) {
            this.close()
          }
        }
      })
    },
    //   区
    getSccountyList(city_id) {
      this.addObj = {}
      getSccounty({
        city_id
      }).then(res => {
        if (res.code == 200) {
          this.addressList = res.data.area_list
          if (!this.addressList) {
            this.close()
          }
        }
      })
    },
  },
  created() {
    this.getSccityList()
  }
}
</script>

<style scoped lang="less">
.address {
  padding: 10px;
  //height: 591px;
  //overflow: scroll;
  height: 79vh;
  overflow: auto;
}

.title {
  text-align: center;
}

.choose {
  padding: 5px 0px 10px;
  border-bottom: 1px solid #F6F6F6;
  display: flex;
  align-items: center;
  //justify-content: space-around;
  gap: 5px;

  .chooseItem {
    border-bottom: 2px solid #3392FE;
    padding: 15px 0px;
    color: #ADADAD;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 20%;
    text-align: center;
  }

  .screen {
    width: 40%;
  }
}

.addressList {
  margin-top: 10px;
  font-size: 15px;
  width: 95%;

  .addrssItem {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }

  .success {
    color: #3392FE;
  }
}

.valeNum {
  background-color: #dcdcdc5c;
  width: 35px;
  text-align: center;
  margin-top: 13px;
  font-size: 12px;
  padding: 2px 0px;
}
.addBox{

}
.seltctS{
  color:#3392FE;
}
</style>