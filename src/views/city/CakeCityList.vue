<template>
  <div class="citylist">
    <div class="citysearch">
      <van-icon class="quit" size="1.5em" name="arrow-left" @click="quit()"/>
      <van-search class="search" v-model="searchQuery" placeholder="城市/拼音" @input="inpchange"
                  style="padding: 0;"/>

    </div>
    <!-- 搜索显示的列表 -->
    <ul class="searchlist" v-if="filteredCities.length>0">
      <li v-for="(city,index) in filteredCities" :key="index"
          @click="editCity(city.name,city.id)"
          style="border-bottom: 1px solid #f0f0f0;font-size: 0.8rem;padding-top: 10px;padding-bottom: 10px;">
        {{ city.name }}
      </li>
    </ul>
    <!-- 不搜索显示的列表 -->
    <div class="inner" v-else>
      <p style="text-align: center;margin-top: 0;font-size: 13px;padding: 8px;margin-bottom: 5px;background-color: white">
        当前城市:{{ city }}</p>
      <div class="hotcity" style="background-color: #f0f0f0;padding-top: 10px;">
        <!-- 定位/最近访问 -->
        <p style="font-size: 13px;margin-left: 3vw;height: 7px;margin-top: 0;">定位/最近访问</p>
        <div class="cityblock2" @click="goindex()">
          <div style="padding-top: 3px">
            <van-icon name="location" color="red"/>
          </div>
          <div class="cityNmae" style="font-size: 0.8rem;">{{ city }}</div>
        </div>
        <br><br>
        <!-- 热门城市 -->
        <p id="热门" class="font13" style="margin-left: 3vw;margin-top: -23px;height: 7px;">热门城市</p>
        <div class="hotbox">
          <div @click="editCity(item.name,item.id)" class="cityblock" style="font-size: 0.8rem;"
               v-for="(item,index) in hotcitylist"
               :id="item.citycode" :key="index" :name="item.name">{{ item.name }}
          </div>
        </div>
      </div>
      <!-- 城市列表 -->
      <div class="list">
        <div v-for="(value,key) in cityList" :key="key">
          <p class="wordtitle" style="margin: 0;" :id="key">{{ key }}</p>
          <div style="background-color: white;padding: 3px 15px;">
            <p class="cityone" @click="editCity(item.name,item.id)"
               v-for="item in value" :key="item.id"
               style="height: 20px;line-height: 20px;">{{ item.name }}</p>
          </div>
        </div>
      </div>
      <!-- 右侧锚点列表 -->
      <ul class="find" style="z-index: 1000;
    position: fixed;
    top: 18vh;
    right: 2.2vw;
    text-align: center;
    font-size: 12px;">
        <li style="margin-bottom: 5px;" v-for="(item,index) in findword" :key="index"><a @click="changeHash('#'+item)">{{
            item
          }}</a></li>
      </ul>
    </div>

  </div>
</template>

<script>
//引入
import moment from 'moment';
import 'moment/locale/zh-cn';
import {Cakecityshow, getCakeCityList, getCityList, searchCakeCity} from "@/api/city";
import {getCitiesList} from "@/api/newOrder";

moment.locale('zh-cn');
//调用城市列表接口
export default {
  data() {
    return {
      findword: ["热门"],
      timestamp: null,
      city: "定位中",
      hotcitylist: [],
      popusearch: "",
      // 城市列表
      cityList: {},
      //首字母
      wordtitle: [],
      searchQuery: "",
      filteredCities: [],
      timer:null
    };
  },
  mounted() {
    // 获取当前城市
    this.city = this.$route.query.city
    //获取城市列表
    this.getCity()
  },
  methods: {
    inpchange() {
      // 每次事件被触发时，都清除之前的旧定时器
      if (this.timer) {
        clearTimeout(this.timer);
      }
      // 函数延迟执行
      this.timer = setTimeout(() => {
        this.searchCity()
        this.timer = undefined;
      }, 1000);
    },
    // 左上角返回
    quit() {
      this.$router.go(-1);
    },
    // 获取搜索的城市列表
    searchCity() {
      this.filteredCities = []
      searchCakeCity({
        param: this.searchQuery
      }).then(res => {
        if (res.code == 200) {
          this.filteredCities = res.data.city_list
        } else {
          this.$toast(res.msg)
        }
      })
    },
    //获取城市列表
    getCity() {
      // let data = {
      //   method: "xuankua.city.list",
      //   appkey: this.$store.state.appkey,
      //   timestamp: this.timestamp.toString(),
      //   v: "1.0"
      // }
      // let sign = this.$utils.getASCII(data)
      getCakeCityList().then(res => {
        if (res.code == 200) {
        }

        this.cityList = res.data.city_list
        this.hotcitylist = res.data.hot_city
        //生成26英文字母,为锚点准备
        for (var i = 65; i < 91; i++) {
          this.findword.push(String.fromCharCode(i))
        }
      })
    },
    //锚点跳转
    changeHash(idname) {
      document.querySelector(idname).scrollIntoView(true);
    },
    //修改城市
    editCity(option,cityId) {
      // this.$router.push({path:"/index",query: {city:''+this.city}})
      // let targetId = option.target.id
      let cityName = option
      // this.$store.commit("changeTargetId", targetId)
      // sessionStorage.setItem("targetId", targetId)
      sessionStorage.setItem("cityName", cityName)
      this.getCity2(cityName)
      sessionStorage.setItem("cityId", cityId)
      // sessionStorage.setItem("changeCity", '1')
      this.$router.options.routes.forEach(item=>{
        if(item.meta){
          if(item.meta.keepAlive){
            item.meta.keepAlive=false
          }
        }
      })
      this.$router.go(-1)
    },
    goindex() {
      this.$router.go(-1)
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

  },
  created() {
    // 获取时间
    this.timestamp = moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
  }
};
</script>

<style scoped lang="less">
// html {
//   scroll-behavior: smooth;
// }
.font13 {
  font-size: 13px;
}

.citylist {
  position: relative;
  background-color: #F0F0F0;
  min-height: 100vh;
}

/deep/ .van-search__content {
  background-color: #fff0;
}

.citylist .citysearch {
  //background-color: #f9f9f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 5px;
  background-color: #F9F9F9;
}

.citylist .citysearch .quit {
  margin-left: 1vw;
}

.citylist .citysearch .van-search .van-cell {
  background-color: #ececec;
  border-radius: 50px;
  padding-left: 15px;

}

.citylist .citysearch .search {
  width: 80vw;
  margin-right: 5vw;
  background-color: #fff0 !important;
}

.citylist .van-icon-search:before {
  margin-left: 25vw;
}

.citylist .list .cityone {
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
  //font-weight: bold;
  padding-bottom: 1vh;
}

.citylist .list .wordtitle {
  background-color: #f0f0f0;
  padding-left: 3vw;
  font-size: 0.8rem;
  color: #999;
  padding-bottom: 1vh;
  padding-top: 1vh;
}

.citylist .cityblock {
  width: 28%;
  background-color: #fff;
  text-align: center;
  height: 30px;
  line-height: 30px;
  //font-weight: bold;
}

.cityblock2 {
  width: 28%;
  background-color: #fff;
  text-align: center;
  height: 30px;
  line-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  margin-left: 10px;
  margin-top: 20px;
  //font-weight: bold;
}
.cityNmae{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.hotbox {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
}

.searchlist {
  background-color: white;
  padding: 10px;
}
</style>