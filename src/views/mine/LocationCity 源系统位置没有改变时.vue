<!--
 * @Description: 地图标记
 * @Autor: bolingsun
 * @Date: 2022-02-23 13:38:59
-->
<template>
  <div class="map-maker-wrapper">
    <!--    <Header title="选择地址">-->
    <!--      <template v-slot:right>-->
    <!--        <div class="btn-confrim" @click="handleSubmit">确定</div>-->
    <!--      </template>-->
    <!--    </Header>-->
    <baidu-map
        class="bm-view"
        ak="b3nPqKCpAtoSG03oDXu2FjuIUFvWOn9C"
        :center="mapCenter"
        :zoom="mapZoom"
        :scroll-wheel-zoom="true"
        @ready="onReady"
    >
    </baidu-map>
<!--{{keyword1}}-->
    <div class="search-wrap">
      <div class="search">
        <div>
          <City :type="2"></City>
        </div>
        <div style="width: 90%;">
          <van-search background="#fff0" placeholder="搜索地址(精确到小区或写字楼)" class="search-input" type="text" @input="handleSearch"
                      v-model="keyword"/>
        </div>
      </div>

      <!-- 检索结果 -->
      <div v-show="showResultFlag" class="search-result">
        <div v-for="(item, index) in searchResult" class="item" :key="index" @click="handleSelect(item)">
          <div class="titleBox">
            <p class="title" :class="{item2:selectId==item.uid}">{{ item.title }}</p>
            <div v-if="selectId==item.uid">
              <van-icon color="#2897FB" name="success"/>
            </div>
          </div>
          <p class="address">{{ item.address }}</p>
        </div>
      </div>
    </div>
    <div class="OKBox">
      <div class="OK" @click="comfire">确定</div>
    </div>
  </div>
</template>

<script>
import {Toast} from 'vant'
// import Header from '@/components/Header'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import {BmLocalSearch} from 'vue-baidu-map'
import City from "@/components/City.vue";
import {getLocations} from "@/api/city";
import wx from "weixin-js-sdk";

export default {
  name: 'MapMaker',
  components: {
    City,
    // Header,
    BaiduMap
  },
  data() {
    return {
      BMap: null,
      map: null,
      mapZoom: 15,
      mapCenter: {lng: 116.404, lat: 39.915},
      keyword: '',
      keyword1: '',
      searchResult: [], // 检索结果列表
      showResultFlag: true,
      defaultInfo: {
        lng: 0,
        lat: 0,
        addressStr: '',
        title: '',
        province: '', // 省
        city: '', // 市
        district: '' // 区
      },
      selectInfo: null,
      selectId: 0,
      address: "",
      lng: "",
      lat: "",
      city: "",
      timer:null
    }
  },
  methods: {
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
    comfire() {
      this.$store.commit("changeAddress", this.address)
      this.$store.commit("changelng", this.bd09ToGcj02(this.lng, this.lat)[0])
      this.$store.commit("changelat", this.bd09ToGcj02(this.lng, this.lat)[1])
      setTimeout(() => {
        this.$router.go(-1)
      }, 100)
    },
    // 地图初始化回调
    onReady({BMap, map}) {
      this.BMap = BMap
      this.map = map
      // console.log('BMap', BMap)
    },
    handleSearch() {
      if(this.timer){
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(()=>{
        this.timer = undefined
        let self = this
        self.showResultFlag = true
        // console.log('111111111', this.defaultInfo)
        self.selectInfo = Object.assign({}, this.defaultInfo)
        let local = new this.BMap.LocalSearch(this.map, {
          renderOptions: {
            map: this.map,
            selectFirstResult: false
          },
          onSearchComplete: function (res) {
            // console.log('results', res)
            if (res && res.Rr) {
              // self.searchResult = [...res.as]
              self.searchResult = res.Rr
              self.selectId = self.searchResult[0].uid
              self.address = self.searchResult[0].address + self.searchResult[0].title
              self.lng = self.searchResult[0].point.lng
              self.lat = self.searchResult[0].point.lat
            }
          }
        })
        // console.log(this.keyword || (!this.city.includes(sessionStorage.getItem("cityName")) && sessionStorage.getItem("cityName")) ? sessionStorage.getItem("cityName") + this.keyword : this.keyword1)
        local.search(this.keyword || (!this.city.includes(sessionStorage.getItem("cityName")) && sessionStorage.getItem("cityName")) ? sessionStorage.getItem("cityName") + this.keyword+"号" : this.keyword1)
      },800)
    },
    handleSelect(item) {
      // console.log(item)
      this.selectId = item.uid
      this.address = item.address + item.title
      this.lng = item.point.lng
      this.lat = item.point.lat
      // let self = this
      // console.log('item', item)
      // let title = item.title
      // let {lng, lat} = item.marker.point
      // console.log('lng,lat', lng, lat)
      // let point = new this.BMap.Point(lng, lat)
      // let geoc = new this.BMap.Geocoder()
      // geoc.getLocation(point, function (res) {
      //   // console.log('res111', res)
      //   let addString =
      //       res.addressComponents.province + res.addressComponents.city + res.addressComponents.district + title
      //   console.log('addString', addString)
      //   self.showResultFlag = false
      //   self.keyword = addString
      //   self.map.clearOverlays() //清除地图上所有覆盖物
      //   self.map.addOverlay(new self.BMap.Marker({lng, lat}))
      //   self.mapCenter.lng = lng
      //   self.mapCenter.lat = lat
      //   self.mapZoom = 15
      //   self.selectInfo = {
      //     lng,
      //     lat,
      //     addressStr: addString,
      //     title: title,
      //     province: res.addressComponents.province,
      //     city: res.addressComponents.city,
      //     district: res.addressComponents.district
      //   }
      // })
    },
    handleSubmit() {
      // console.log('this.selectInfo', this.selectInfo)
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    // 获取定位
    getLocation() {
      let purl = /(Android)/i.test(navigator.userAgent) ? location.href.split('#')[0] : window.localStorage.getItem('scanUrl');
      getLocations({
        url: purl
      }).then(res => {
        // console.log(res)
        if (res.code == 200) {
          this.info = res.data
          this.getSign()
        }
      })
    },
    getSign() {
      //请求后端，获取微信签名信息
      let configData = {
        debug: false,
        appId: this.info.appid, // 必填，公众号的唯一标识
        timestamp: "" + this.info.time, // 必填，生成签名的时间戳
        nonceStr: this.info.nonceStr, // 必填，生成签名的随机串
        signature: this.info.signature,// 必填，签名
        jsApiList: ['getLocation']
      }
      // console.log(configData)
      wx.config(configData);
      wx.ready((res1) => {
        wx.getLocation({
          type: 'wgs84',
          success: (res) => {
            this.getCityName(res.longitude, res.latitude)
            sessionStorage.setItem("longitude", res.longitude)
            sessionStorage.setItem("latitude", res.latitude)
          }, fail: () => {
            // console.log("定位失败")
            this.createMap()
          }
        });
      });
      wx.error(function (res) {
      });
    },
    getCityName(lng, lat) {
      // 创建一个坐标点
      let point = new BMap.Point(lng, lat);

      // 创建一个地理编码实例
      let geoc = new BMap.Geocoder();

      // 根据坐标点进行逆地理编码
      geoc.getLocation(point, (rs) => {
        let addComp = rs.addressComponents;
        // console.log(addComp,"addComp")
        // console.log(addComp)
        this.defaultInfo = {
          lng: rs.point.lng,
          lat: rs.point.lat,
          addressStr: addComp.street + addComp.streetNumber,
          province: addComp.province, // 省
          city: addComp.city, // 市
          district: addComp.district // 区
        }
        this.keyword1 = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
        this.city = addComp.city
        if (addComp.city.includes(sessionStorage.getItem("cityName")) || !sessionStorage.getItem("cityName")) {
          this.handleSearch()
        }
      });
    },
    createMap() {
      var _this = this
      let geolocation = new BMap.Geolocation();
      // 创建百度地理位置实例，代替 navigator.geolocation
      geolocation.getCurrentPosition(function (e) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          // 百度 geolocation 的经纬度属性不同，此处是 point.lat 而不是 coords.latitude
          let point = new BMap.Point(e.point.lng, e.point.lat);
          let gc = new BMap.Geocoder();
          gc.getLocation(point, function (rs) {
            // console.log(rs);
            //   debugger
            var addComp = rs.addressComponents;
            if (!sessionStorage.getItem("longitude")) {
              if (_this.isWeiXin) {
                _this.getLocation()
              } else {
                // console.log(addComp)
                _this.defaultInfo = {
                  lng: rs.point.lng,
                  lat: rs.point.lat,
                  addressStr: addComp.street + addComp.streetNumber,
                  province: addComp.province, // 省
                  city: addComp.city, // 市
                  district: addComp.district // 区
                }
                _this.keyword1 = rs.address
                _this.city = addComp.city
                if (addComp.city.includes(sessionStorage.getItem("cityName")) || !sessionStorage.getItem("cityName")) {
                  _this.handleSearch()
                }
              }
            }else{
              _this.getCityName(sessionStorage.getItem("longitude"),sessionStorage.getItem("latitude"))
            }
          })
        } else {
          this.$toast("定位失败，请手动选择区域或重新定位");
        }
      })
    }
  },
  created() {
    this.createMap()
  }
}
</script>

<style lang="less" scoped>
.map-maker-wrapper {
  position: relative;
  padding-bottom: 40px;
}

.btn-confrim {
  width: 120px;
  height: 56px;
  line-height: 56px;
  background-color: #5ac9d4;
  border-radius: 8px;
  color: #ffffff;
  text-align: center;
}

.bm-view {
  width: 100%;
  height: 158px;
}

.search-wrap {
  width: 100vw;
  box-sizing: border-box;
  padding: 10px;
  // background-color: red;
  .search {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .search-img {
      width: 48px;
      height: 48px;
    }

    .search-input {
      width: 100%;
      outline: none;
      border: none;
      background: none;
      font-size: 28px;
      color: #313233;
    }

    .search-btn {
      font-size: 28px;
      font-weight: 600;
      color: #313233;
    }
  }

  .search-result {
    background-color: #fff;
    //padding: 0 32px;
    //border-radius: 24px;
    //max-height: 720px;
    padding: 10px;

    .item {
      border-bottom: 1px solid #ebeef2;
      padding: 10px 0px;
      //padding: 32px 0;
      &:last-child {
        border-bottom: none;
      }

      .title {
        font-size: 14px;
        //font-weight: 600;
        color: #262626;
        margin: 0;
      }

      .address {
        font-size: 12px;
        font-weight: 400;
        color: #767676;
        margin: 0;
        margin-top: 8px;
      }
    }
  }
}

.van-search {
  padding-bottom: 6px;
  padding-top: 6px;
}

.van-search .van-cell {
  background-color: transparent;
}

.van-search__content {
  background-color: #F7F7F7;
  border-radius: 30px;
}

.item2 {
  color: #2897FB !important;
}

.titleBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.OK {
  background-image: linear-gradient(to right, #F3908F, #DD5150);
  color: white;
  height: 40px;
  border-radius: 30px;
  width: 84%;
  text-align: center;
  line-height: 40px;
  margin: auto;
}

.OKBox {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0px;
  background-color: #fff;
  padding: 10px 0px;
}
</style>

