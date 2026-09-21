<template>
  <div>
    <div class="address" @click="showPopup()">
      <div class="city">{{ city }}</div><img src="../assets/pull1.png" style="width: 12px;" alt="">
      <!-- <div class="pull-down">
        <van-icon class="" name="arrow-down" size="13px"/>
      </div> -->
    </div>
  </div>
</template>
<script>
import BMap from "BMap"
import wx from "weixin-js-sdk";
import { Cakecityshow, getCityList, getLocations } from "@/api/city";
import { getAccessToken, getCitiesList } from "@/api/newOrder";

export default {
  name: "City",
  props: {
    cityName: [Number, String],
    type: [Number, String],
    num1: [Number, String],
  },
  data() {
    return {
      city: "正在定位",
      info: {},
      parameter: {
        appkey: this.$store.state.appkey,
        timestamp: this.$store.state.timestamp,
        v: "1.0",
      },
    }
  },
  methods: {
    getTokenKey(city) {
      const token = localStorage.getItem('access_token');
      const expiresAt = localStorage.getItem('token_expires_at');
      const currentTime = Math.floor(Date.now() / 1000);

      if (token && expiresAt && currentTime < expiresAt) {
        // token 有效，直接使用
        if (city) this.getCity2(city);
        return;
      }

      getAccessToken({
        entId: "101344",
        appSecret: "IALrbqLuSVtlMW3k9WlnxnCwuCA556jr"
      }).then(res => {
        // console.log(res, "1111")
        localStorage.setItem('token_type', res.data.token_type);
        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('token_expires_at', res.data.expires_at); // 保存过期时间
        // this.getCity2(city)
         if (city) this.getCity2(city);  // 加上 city 判断
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
    // 城市跳转
    showPopup() {
      if (this.type == 1) {
        this.$router.push({ path: "/cakeCityList", query: { city: '' + this.city, change: this.change } })
      } else {
        if (this.num1 == 3) {
          this.$router.push({ path: "/citylist", query: { city: '' + this.city, change: this.change } })
          return
        }
        this.$router.push({ path: "/newCitylist", query: { city: '' + this.city, change: this.change } })
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
            this.createMap2()
          }
        });
      });
      wx.error(function (res) {
      });
    },
    // 查询初始cityId
    searchCityId(city) {
      Cakecityshow({
        city
      }).then(res => {
        // console.log(res)
        if (res.code == 200) {
          let cityShow = res.data.city_show
          this.city = cityShow.name
          sessionStorage.setItem("cityName", cityShow.name)
          sessionStorage.setItem("cityId", cityShow.id)
          this.$emit('getCityId', cityShow.id)
        }
      })
    },
    getCity2(cityName) {
      getCitiesList().then(res => {
        // console.log(res)
        if (res.code == 200) {
          let id = res.data.filter(item => cityName.includes(item.name))[0].cityId
          sessionStorage.setItem("targetId", id)
        }
      })
    },
    createMap2() {
      // console.log("[[[")
      const geolocation = new BMap.Geolocation();
      var _this = this
      geolocation.getCurrentPosition(function getinfo(position) {
        let latitude = position.latitude
        let longitude = position.longitude
        var gc = new BMap.Geocoder();
        gc.getLocation(position.point, function (rs) {
          //   debugger
          var addComp = rs.addressComponents;
          _this.city = addComp.city
          var address =
            addComp.street +
            addComp.streetNumber; //获取地址
          sessionStorage.setItem("streetNumber", address)
          sessionStorage.setItem("longitude", longitude)
          sessionStorage.setItem("latitude", latitude)
          sessionStorage.setItem("cityName", _this.city)
          if (sessionStorage.getItem("promptcity") != 2 && sessionStorage.getItem("cake") != 1) {
            _this.messageinfo()
          }
          // console.log(!sessionStorage.getItem("cityId"))
          if (!sessionStorage.getItem("cityId")) {
            _this.searchCityId(addComp.city)
            _this.getTokenKey(addComp.city)
          }
        });
      }, { enableHighAccuracy: true }, function (e) {
        // console.log(e)
      }, {
        provider: 'baidu'
      });
    },
    createMap() {
      // console.log("[[[")
      const geolocation = new BMap.Geolocation();
      var _this = this
      geolocation.getCurrentPosition(function getinfo(position) {
        let latitude = position.latitude
        let longitude = position.longitude
        var gc = new BMap.Geocoder();
        gc.getLocation(position.point, function (rs) {
          //   debugger
          var addComp = rs.addressComponents;
          if (_this.isWeiXin()) {
            _this.getLocation()
          } else {
            _this.city = addComp.city
            var address =
              addComp.street +
              addComp.streetNumber; //获取地址
            sessionStorage.setItem("streetNumber", address)
            sessionStorage.setItem("longitude", longitude)
            sessionStorage.setItem("latitude", latitude)
            sessionStorage.setItem("cityName", _this.city)
            if (sessionStorage.getItem("promptcity") != 2 && sessionStorage.getItem("cake") != 1) {
              _this.messageinfo()
            }
            // console.log(!sessionStorage.getItem("cityId"))
            if (!sessionStorage.getItem("cityId")) {
              _this.searchCityId(addComp.city)
              _this.getTokenKey(addComp.city)
            }
          }
        });
      }, { enableHighAccuracy: true }, function (e) {
        // console.log(e)
      }, {
        provider: 'baidu'
      });
    },
    // 提示当前城市是否需要切换
    messageinfo() {
      this.$dialog.confirm({
        message: '当前定位"' + this.city + '"，是否需要切换到其他城市？',
        confirmButtonColor: 'red',
        cancelButtonColor: 'red'
      }).then(() => {
        this.$router.push({ path: "/citylist", query: { city: '' + this.city } })
        sessionStorage.setItem("promptcity", "2")
      }).catch(() => {
        sessionStorage.setItem("promptcity", "2")
      })

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
        this.city = addComp.city;
        var address =
          addComp.street +
          addComp.streetNumber; //获取地址
        sessionStorage.setItem("streetNumber", address)
        sessionStorage.setItem("cityName", this.city)
        if (!sessionStorage.getItem("cityId")) {
          this.searchCityId(this.city)
          this.getTokenKey(this.city)
        }
        if (sessionStorage.getItem("promptcity") != 2 && sessionStorage.getItem("cake") != 1) {
          this.messageinfo()
        }
      });
    },
  },
  created() {
    // setTimeout(() => {
    if (sessionStorage.getItem("cityName") && sessionStorage.getItem("cityId")) {
      this.city = sessionStorage.getItem("cityName")
      // console.log(this.city,"this.city")
      // this.searchCityId(this.city)
    } else {
      this.createMap()
    }
    // }, 1000)
  },
  mounted() {
  },
  updated() {
    // if(sessionStorage.getItem("cityName")){
    //   this.city = sessionStorage.getItem("cityName")
    //   // console.log(this.city,"this.city")
    // }
  },
}
</script>

<style scoped>
.address {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  padding: 10px 0px;
}

.pull-down {
  width: 12px;
  height: 12px;
}

.city {
  white-space: nowrap;
  max-width: 80px;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 15px;
}
</style>