<template>
  <div class="distancestore">
    <ReturnBack :rcolor="'#fff'" :bcolor="'rgba(218,218,218,0.26)'"></ReturnBack>
    <NProgress v-if="loadingflag" />
    <div class="logo" style="width: 100%;">
      <img :src="imgurl" alt="">
    </div>
    <div class="searchbox">
      <div class="left">
        <City :type="2" :num1="num1"></City>
      </div>
      <div class="right" style="position: relative;">
        <van-search background="#fff0" placeholder="搜索门店" v-model="searchtext" @compositionstart="searchstore1"
          @compositionend="searchstore" @input="searchstore2" />
      </div>
    </div>
    <!-- 下面餐厅 -->
    <!-- <van-tabs v-model:active="active" @change="changeActive" background="#fff0" :line-width="15"
              title-active-color="#1F1F1F" color="#BE0407">
      <van-tab title="附近餐厅"></van-tab>
      <van-tab title="我的收藏"></van-tab>
    </van-tabs> -->
    <!--    列表-->
    <div v-if="aroundlist.length == 0 && active == 1" style="text-align: center;padding-bottom:20px;font-size: 14px">
      暂无收藏...
    </div>
    <div class="listBox" v-else>
      <div class="listItem" v-for="(item, index) in aroundlist" :key="index"
        @click="diancan(item, active == 0 ? item.enable ? item.enable : item.openStatus : true)">
        <div class="storeName">
          <div class="storeNameMode"
            :class="{ model: active == 0 ? item.openStatus ? !item.openStatus : !item.enable : false }">
            {{ item.name || item.storeName || item.shopName }}
          </div>
          <div class="toOrder"
            :class="{ toOrder2: active == 0 ? item.openStatus ? !item.openStatus : !item.enable : false, toOrder3: num2 == 1, toOrder4: num2 == 2, toOrder6: num1 == 6 }">
            {{
              active == 0 ? item.enable ? item.enable ? "去点餐" : "门店未营业" : item.openStatus ? "去点餐" : "门店未营业" : '去点餐'
            }}
          </div>
        </div>
        <div class="storeAddress">
          <div class="addIcon">
            <div>
              <van-icon name="location-o" />
            </div>
            <div class="address">{{ item.address || item.storeAddress }}</div>
          </div>
          <div class="distancekm">
            {{ active == 1 && num1 != 3 ? item.juli : item.distancekm || (Number(item.distance) / 1000).toFixed(2) }}km
          </div>
        </div>
      </div>
    </div>
    <!--   点餐弹窗-->
    <van-popup v-model="show" position="center">
      <div class="dialogwrap"
        :style="{ backgroundImage: num2 == 1 ? 'url(' + require('../../assets/backimage/bg1.png') + ')' : num1 == 6 ? 'url(' + require('../../assets/backimage/bg6.png') + ')' : 'url(' + require('../../assets/backimage/bg4.png') + ')' }">
        <div class="inner">
          <div class="comInfo" :class="{ comInfo2: num2 == 2, fromdistancekm6: num1 == 6 }"> 请您确认信息</div>
          <div class="p5 orientationBox">
            <div>
              <img class="orientation" v-if="num2 == 1" src="../../assets/backimage/dingwei1.png" alt="">
              <img class="orientation" v-if="num2 == 2 && num1 != 6" src="../../assets/backimage/dingwei4.png" alt="">
              <img class="orientation" v-if="num1 == 6" src="../../assets/backimage/dingwei6.png" alt="">
            </div>
            <div>
              <div>{{ dialoglist.name || dialoglist.storeName || dialoglist.shopName }}</div>
              <div class="fromdistancekm"
                :class="{ fromdistancekm2: num2 == 2 && num1 != 6, fromdistancekm6: num1 == 6, }">
                距您{{ active == 1 && num1 != 3 ? dialoglist.juli : dialoglist.distancekm || (Number(dialoglist.distance)
                  / 1000).toFixed(2) }}km
              </div>
              <div class="storeAddress">{{ dialoglist.address || dialoglist.storeAddress }}</div>
            </div>
          </div>
          <div class="p5">
            <div>
              <img class="orderImg" v-if="num2 == 1" src="../../assets/backimage/button1.png" alt="">
              <img class="orderImg" v-if="num2 == 2 && num1 != 6" src="../../assets/backimage/button4.png" alt="">
              <img class="orderImg" v-if="num1 == 6" src="../../assets/backimage/button6.png" alt="">
            </div>
            <div>现在点餐，支付成功后取餐</div>
          </div>
          <div class="single" v-html="single"></div>
          <div @click="goselect" class="goselect" :class="{ goselect2: num2 == 2, goselect6: num1 == 6, }">立即点餐</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>

import City from '../../components/City.vue';
import { getXBKStoreList, getMDLStoreList, getBSKStoreList, getKFCStoreList, getNXStoreList } from "@/api/store";
import { location } from '../../utils/location'
import { getBannerList, getsingle, getCollect } from '@/api/service'
import BMap from "BMap"
import { getCitiesList, getShopsList } from "@/api/newOrder";

export default {
  components: { City },
  data() {
    return {
      city: "正在定位",
      num1: 0,
      num2: 0,
      storename: "",
      active: 0,
      show: false,
      searchtext: "",
      dialoglist: {},
      location: "",
      lat: 0,
      lng: 0,
      data: null,
      aroundlist: [],
      imgname: "",   //前缀
      imgurl: "",   //图片地址
      single: "",

      // aroundlist: [],
      loadingflag: true,
      timer: null,
      ot: "",
      iscomd: false
    };
    logo: {
    }

  },
  destroyed() {
    sessionStorage.removeItem("goods")
  },
  methods: {
    getCity() {
      getCitiesList().then(res => {
        // console.log(res)
        if (res.code == 200) {
          let cityName = sessionStorage.getItem("cityName")
          let cityList = res.data.filter(item => cityName.includes(item.name))
          sessionStorage.setItem("targetId", cityList[0].cityId)
          sessionStorage.setItem("cityName", cityList[0].name)
          this.cityId = cityList[0].cityId
          this.getLongitudeLatitude()
        }
      })
    },
    //坐标转换
    bd09ToGcj02(lng, lat) {
      var x_pi = 3.14159265358979324 * 3000.0 / 180.0
      var x = lng - 0.0065
      var y = lat - 0.006
      var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
      var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
      var gg_lng = z * Math.cos(theta)
      var gg_lat = z * Math.sin(theta)
      return [gg_lng, gg_lat]
    },
    getbanner(imgname) {
      getBannerList({
        flag: '3',
        type: imgname
      }).then(res => {
        // console.log(res);
        this.imgurl = res.data.lct_img.img
      })
      getsingle({
        flag: '1',
        type: imgname
      }).then(res => {
        // console.log(res,"111111111111111");
        this.single = res.data.content
      })
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    getLongitudeLatitude() {
      //Toast("如长时间未获取办理区域请手动选择");
      let _this = this;
      let geolocation = new BMap.Geolocation();
      // 创建百度地理位置实例，代替 navigator.geolocation
      geolocation.getCurrentPosition(function (e) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          // 百度 geolocation 的经纬度属性不同，此处是 point.lat 而不是 coords.latitude
          let point = new BMap.Point(e.point.lng, e.point.lat);
          let gc = new BMap.Geocoder();
          gc.getLocation(point, function (rs) {
            // console.log(rs);
            if (_this.isWeiXin) {
              _this.lng = sessionStorage.getItem("longitude")
              _this.lat = sessionStorage.getItem("latitude")
            } else {
              _this.lng = _this.bd09ToGcj02(rs.point.lng, rs.point.lat)[0]
              _this.lat = _this.bd09ToGcj02(rs.point.lng, rs.point.lat)[1]
            }
            _this.cityId = sessionStorage.getItem("targetId")
            //<<<<<<<<<<<<<<<<需要的位置信息在这获取
            if (_this.num1 == 1) {
              _this.imgname = "mdl"
              // setTimeout(() => {
              _this.storename = "麦当劳"
              _this.ot = "MDL"
              // _this.getMDLStore()
              // }, 6000);
            } else if (_this.num1 == 2) {
              _this.imgname = "kfc"
              // setTimeout(() => {
              _this.storename = "肯德基"
              _this.ot = "Kfc"
              // _this.getKFCStore()
              // }, 6000);

            } else if (_this.num1 == 3) {
              _this.imgname = "bsk"
              // setTimeout(() => {
              _this.storename = "必胜客"
              _this.getBSKstore()
              // }, 6000);
            } else if (_this.num1 == 4) {
              _this.imgname = "xbk"
              // setTimeout(() => {
              _this.storename = "星巴克"
              _this.ot = "XBK"
              // _this.getXBKStore()
              // }, 6000);
            } else if (_this.num1 == 5) {
              _this.imgname = "nx"
              // setTimeout(() => {
              _this.storename = "奈雪的茶"
              _this.ot = "NXDC"
              // _this.getNXStore()
              // }, 6000);

            } else if (_this.num1 == 6) {
              _this.imgname = "rxkf"
              // setTimeout(() => {
              _this.storename = "瑞幸咖啡"
              _this.ot = "RXKF"
              // _this.getNXStore()
              // }, 6000);

            } else if (_this.num1 == 7) {
              _this.imgname = "kd"
              // setTimeout(() => {
              _this.storename = "库迪"
              _this.ot = "KD"
              // _this.getNXStore()
              // }, 6000);

            }
            // console.log(_this.imgname)
            _this.getbanner(_this.imgname)
            if (_this.num1 != 3) {
              _this.getShopsList()
            }
          });
        } else {
          this.$toast("定位失败，请手动选择区域或重新定位");
        }
      });
    },
    changeActive(e) {
      this.active = e
      this.searchtext = ""
      // console.log(this.active)
      if (e == 0) {
        this.aroundlist = []
        this.getLongitudeLatitude()
      } else {
        this.getCollectList()
      }
    },
    getCollectList() {
      // console.log(this.imgname);
      var list = []
      getCollect({
        token: localStorage.getItem("token"),
        type: this.imgname,
        lng: this.lng,
        lat: this.lat,
      }).then(res => {
        // console.log(res);
        if (res.code == 200) {
          if (this.num1 == 3) {
            let list = res.data.collect_list
            let arry = []
            list.forEach(item => {
              this.aroundlist.forEach(item2 => {
                if (item.dpid == item2.storeCode) {
                  arry.push(item2)
                }
              })
            })
            this.aroundlist = arry
          } else {
            this.aroundlist = []
            this.aroundlist = res.data.collect_list
          }
        } else {
          // this.$toast({message: res.msg, type: "fail"})
        }
      })
    },
    gocitylist() {
      this.$router.push("/citylist")
      this.$router.push({ path: '/citylist', query: { city: this.city } })
    },
    searchstore() {
      this.iscomd = true
      if (this.timer) {
        clearTimeout(this.timer);
      }
      // 函数延迟执行
      this.timer = setTimeout(() => {
        if (this.num1 == 3) {
          // 必胜客搜索
          let data = {
            apikey: this.$store.state.appkey,
            keywords: this.searchtext,
            receiverLng: this.lng,
            receiverLat: this.lat,
            cityId: this.cityId,
          }
          getBSKStoreList(data).then(res => {
            this.loadingflag = false
            this.aroundlist = res.data
          })
        } else {
          this.aroundlist = this.aroundlist.filter(item => item.shopName ? item.shopName.includes(this.searchtext) : item.name.includes(this.searchtext))
        }

        this.timer = undefined;
        this.iscomd = false
      }, 1000);

    },
    searchstore1() {
      this.iscomd = true
    },
    searchstore2() {
      if (this.searchtext == "") {
        if (this.active == 0) {
          this.aroundlist = []
          this.getLongitudeLatitude()
        } else {
          this.getCollectList()
        }
      }
      if (!this.iscomd) {
        console.log(111)
        if (this.timer) {
          clearTimeout(this.timer);
        }
        // 函数延迟执行
        this.timer = setTimeout(() => {
          if (this.num1 == 3) {
            // 必胜客搜索
            let data = {
              apikey: this.$store.state.appkey,
              keywords: this.searchtext,
              receiverLng: this.lng,
              receiverLat: this.lat,
              cityId: this.cityId,
            }
            getBSKStoreList(data).then(res => {
              this.loadingflag = false
              this.aroundlist = res.data
            })
          } else {
            this.aroundlist = this.aroundlist.filter(item => item.shopName.includes(this.searchtext))
          }

          this.timer = undefined;
        }, 1000);
      }

    },
    // 点击去点餐弹出模态框
    diancan(item, openStatus) {
      if (!openStatus) {
        this.$toast("门店未营业")
        return
      }
      sessionStorage.removeItem("goods")
      this.dialoglist = item
      console.log(item, "item==")
      // 出现弹窗
      this.show = !this.show

    },
     goselect() {
  let path = ''
  if (this.num1 == 1) {
    // 麦当劳 → 独立文件
    path = '/selectproductmdl'
  } else if (this.num1 == 2) {
    // 肯德基 → 独立文件
    path = '/SelectProductKDJ'
  } else if (this.num1 == 5) {
    // 奈雪
    path = '/selectnxproduct'
  } else {
    // 必胜客、其他
    path = '/selectproduct'
  }

  this.$router.push({
    path: path,
    query: {
      num1: this.num1,
      num2: this.num2,
      storeid: this.num1 == 3 ? this.dialoglist.storeCode : this.dialoglist.id || this.dialoglist.dpid,
      type: this.imgname,
      isCollect: this.active == 1 ? 3 : this.dialoglist.isCollect,
    }
  })
},
    // 获取星巴克门店列表
    getXBKStore() {
      this.aroundlist = []
      let data = {
        apikey: this.$store.state.appkey,
        cityId: this.cityId,
        // keywords: "石家庄",
        receiverLng: this.lng,
        receiverLat: this.lat,
      }
      getXBKStoreList(data).then(res => {
        // console.log(res)
        this.loadingflag = false
        this.aroundlist = res.data
      })
    },
    // 获取麦当劳门店列表
    getMDLStore() {
      // console.log(this.lng);
      // console.log(this.lat);
      this.aroundlist = []
      let data = {
        apikey: this.$store.state.appkey,
        cityId: this.cityId,
        // keywords: "石家庄",
        receiverLng: this.lng,
        receiverLat: this.lat,
      }
      getMDLStoreList(data).then(res => {
        this.loadingflag = false
        // console.log(res);
        this.aroundlist = res.data
      })
    },
    getBSKstore() {
      this.aroundlist = []
      let data = {
        apikey: this.$store.state.appkey,
        cityId: this.cityId,
        // keywords: "石家庄",
        receiverLng: this.lng,
        receiverLat: this.lat,
      }
      getBSKStoreList(data).then(res => {
        // console.log(res.data);
        this.loadingflag = false
        this.aroundlist = res.data
      })
    },
    getKFCStore() {
      this.aroundlist = []
      let data = {
        apikey: this.$store.state.appkey,
        cityId: this.cityId,
        // keywords: "石家庄",
        receiverLng: this.lng,
        receiverLat: this.lat,
      }
      getKFCStoreList(data).then(res => {
        this.loadingflag = false
        this.aroundlist = res.data
      })
    },
    getNXStore() {
      this.aroundlist = []
      let data = {
        apikey: this.$store.state.appkey,
        cityId: this.cityId,
        // keywords: "石家庄",
        receiverLng: this.lng,
        receiverLat: this.lat,
      }
      getNXStoreList(data).then(res => {
        this.loadingflag = false
        this.aroundlist = res.data
      })
    },
    //   新门店列表
    getShopsList() {
      getShopsList({
        ot: this.ot,
        cityId: this.cityId,
        lon: this.lng,
        lat: this.lat,
      }).then(res => {
        if (res.code == 200) {
          this.loadingflag = false
          this.aroundlist = res.data
        }
      })
    },
  },
  created() {
    this.getCity()
    this.num1 = this.$route.query.num1
    this.num2 = this.$route.query.num2
  },
  mounted() {

    document.body.scrollTop = 0

    // firefox

    document.documentElement.scrollTop = 0

    // safari

    window.pageYOffset = 0
  }
};
</script>

<style scoped lang="less">
.distancestore {
  width: 100%;
  min-height: 100vh;
  background: #f0f0f0;
  box-sizing: border-box;
}

.logo img {
  width: 100%;
}

.searchbox {
  display: flex;
  align-items: center;
  padding: 0px 15px;
}

.search {
  padding-left: 40px;
  width: 95%;
  border-radius: 50px;
  border: none;
  background-color: #fff;
  display: inline-block;
  height: 35px;
  font-size: 15px;
}

.searchicon {
  position: absolute;
  left: 12px;
  top: 10px;
}

/deep/ .van-search {
  padding-bottom: 0px;
  padding: 0;
}

/deep/ .van-search__content {
  border-radius: 30px;
}

.right {
  margin-left: 10px;
  width: 100%;
}

/deep/ .van-popup {
  border-radius: 15px;
  overflow-y: inherit;
}

/deep/ .van-tab--active {
  font-weight: bold;
}

/deep/ .van-tabs__line {
  bottom: 18px;
}

//列表
.listBox {
  padding: 0px 10px 10px;

  //margin-top: -3px;
  .listItem {
    background-color: #fff;
    margin-top: 10px;
    padding: 10px 15px;
    border-radius: 10px;
  }

  .storeName {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .storeNameMode {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 95%;
  }

  .storeAddress {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    border-top: 1px solid #F6F6F6;
    margin-top: 10px;
    padding-top: 10px;

    .addIcon {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #7B7B7B;
      width: 80%;

      .address {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }

    .distancekm {
      color: #6E6E6E;
    }
  }
}

.toOrder {
  border-radius: 30px;
  font-size: 14px;
  padding: 2px 10px;
  white-space: nowrap;
}

.toOrder2 {
  color: #8b8b8b !important;
  border: 1px solid #8b8b8b !important;
}

.toOrder3 {
  color: #963D0B;
  border: 1px solid #963D0B;
}

.toOrder4 {
  color: #227651;
  border: 1px solid #227651;
}

.toOrder6 {
  color: #21286B;
  border: 1px solid #21286B;
}

.model {
  color: #8b8b8b;
}

.dialogwrap {
  width: 285px;
  min-height: 337px;
  background-size: 100% 100%;
  padding: 8px 10px 10px;
  box-sizing: border-box;
  font-size: 15px;

  .comInfo {
    text-align: center;
    color: #A42408;
    font-weight: bold;
  }

  .comInfo2 {
    color: #08653C;
  }

  .orientation {
    width: 16px;
    padding-top: 2px;
  }

  .orderImg {
    width: 18px;
    padding-top: 2px;
  }

  .p5 {
    display: flex;
    gap: 7px;
    margin-top: 13px;
  }

  .orientationBox {
    margin-top: 26px;
  }

  .storeAddress {
    font-size: 12px;
    margin-top: 4px;
    color: #6A6663;
  }

  .fromdistancekm {
    color: #BA5A3A;
    font-size: 12px;
    margin-top: 4px;
  }

  .fromdistancekm2 {
    color: #126B44;
  }

  .fromdistancekm6 {
    color: #21286B;
  }

  .single {
    font-size: 13px;
    background-color: #FFFBF8;
    padding: 10px;
    border-radius: 5px;
    margin-top: 15px;
    line-height: 20px;
    height: 95px;
    overflow-y: auto;

    /deep/ p {
      margin: 0;
    }
  }

  .single::-webkit-scrollbar {
    display: none
  }

  .goselect {
    background-color: #AA460D;
    width: 163px;
    height: 33px;
    border-radius: 30px;
    text-align: center;
    color: white;
    line-height: 32px;
    margin: auto;
    margin-top: 14px;
  }

  .goselect2 {
    background-color: #0E6941;
  }

  .goselect6 {
    background-color: #21286B;
  }
}
</style>