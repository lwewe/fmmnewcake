<template>
  <div>
    <div class="address" @click="showPopup()">
      <div class="city">{{ city }}</div>
      <div class="pull-down">
        <van-icon class="" name="arrow-down" size="13px"/>
      </div>
    </div>
  </div>
</template>
<script>
import BMap from "BMap"
import {Cakecityshow} from "@/api/city";
import {getCitiesList} from "@/api/newOrder";

export default {
  name: "CakeCity",
  props: {
    cakeCityName: [Number, String],
  },
  data() {
    return {
      city: "正在定位",
    }
  },
  methods: {
    // 城市跳转
    showPopup() {
      this.$router.push({path: "/cakeCityList", query: {city: '' + this.city, change: this.change}})
    },
    // 查询初始cityId
    searchCityId(city){
      Cakecityshow({
        city
      }).then(res=>{
        if(res.code==200){
          let cityShow = res.data.city_show
          sessionStorage.setItem("cakeCityName",cityShow.name)
          sessionStorage.setItem("cityId",cityShow.id)
        }
      })
    },
    getCity2(cityName){
      getCitiesList().then(res=>{
        // console.log(res)
        if(res.code==200){
          let id = res.data.filter(item=>cityName.includes(item.name))[0].cityId
          sessionStorage.setItem("targetId",id)
        }
      })
    },
    createMap() {
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
          if(!sessionStorage.getItem("cakeCityName")){
            _this.searchCityId(addComp.city)
            _this.getCity2(addComp.city)
          }
        });
        // console.log(city)
      }, function (e) {
        // console.log(e)
      }, {
        provider: 'baidu'
      });
    },
  },
  created() {
    this.createMap()
  },
  updated() {
    if (sessionStorage.getItem("cakeCityName")) {
      this.city = sessionStorage.getItem("cakeCityName")
      // console.log(this.city,"this.city")
    }

  }
}
</script>

<style scoped>
.address {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  padding: 10px 0px;
  font-weight: bold;
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
}
</style>