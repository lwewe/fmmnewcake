<template>
  <div class="citylist">
      <div class="citysearch">
        <van-icon class="quit" size="1.5em" name="arrow-left" @click="quit()" />
        <van-search class="search" v-model="searchQuery" placeholder="城市/拼音"  style="padding: 0;" />
       
      </div>
      <!-- 搜索显示的列表 -->
      <ul class="searchlist">
        <li v-for="(city,index) in filteredCities"  :key="index" @click="editCity(city)" style="padding-left: 3vw;border-bottom: 1px solid #f0f0f0;font-size: 0.8rem;padding-top: 10px;padding-bottom: 10px;">{{ city.cityName }}</li>
      </ul>
      <!-- 不搜索显示的列表 -->
      <div class="inner">
        <p style="text-align: center;font-size: 13px;margin-top: 5px;margin-bottom: 5px;">当前城市:{{ city }}</p>
      <div class="hotcity" style="background-color: #f0f0f0;padding-top: 10px;padding-bottom: 20px;">
        <!-- 定位/最近访问 -->
            <p style="font-size: 13px;margin-left: 3vw;height: 7px;">定位/最近访问</p>
            <span class="cityblock" style="width:auto;padding-left: 8%;padding-right: 8%;" @click="goindex()">
                <van-icon name="location" color="red"/>
                <span style="font-size: 0.8rem;">{{ city }}</span>
            </span>
            <br><br>
        <!-- 热门城市 -->
<!--            <p id="热门" class="font13" style="margin-left: 3vw;margin-top: 15px;height: 7px;">热门城市</p>-->
<!--            <ul class="hotbox">-->
<!--                <li @click="editCity($event)" class="cityblock" style="font-size: 0.8rem;" v-for="(item,index) in hotcitylist" :id="item.cityId" :key="index" :name="item.cityName">{{ item.cityName }}</li>-->
<!--            </ul>-->
      </div>
      <!-- 城市列表 -->
      <ul class="list">
        <li v-for="(item,index) in cityList" :key="index">
            <p class="wordtitle" style="margin: 0;"  v-if="index === 0 || item.cityPinyin.charAt(0) != cityList[index - 1].cityPinyin.charAt(0)">{{ item.cityPinyin[0] }}</p>
            <p class="cityone" @click="editCity(item)"  style="height: 20px;line-height: 20px;">{{ item.cityName }}</p>
        </li>
      </ul>
      <!-- 右侧锚点列表 -->
      <ul class="find" style="z-index: 1000;position: fixed;top: 18vh;right: 0.2vw;text-align: center;font-size: 13px;">
        <li style="margin-bottom: 5px;" v-for="(item,index) in findword" :key="index"><a @click="changeHash('#'+item)">{{ item }}</a></li>
      </ul>
      </div>
      
  </div>
</template>

<script>
//调用城市列表接口
import {Cakecityshow, getCityList} from "@/api/city";
export default {
  data() {
    return {
        findword:["热门"],
        timestamp:null,
        city:"定位中",
        hotcitylist:[],
        popusearch:"",
        // 城市列表
        cityList:[],
        //首字母
         wordtitle:[],
        searchQuery:"",
    };
  },
  watch:{
    searchQuery(){
        this.see()
    }
  },
  computed:{
    filteredCities() {
        if(this.searchQuery==""){
            return ""
        }else{
            return this.cityList.filter(city => {
                return city.cityName.toLowerCase().includes(this.searchQuery.toLowerCase()) || city.cityPinyin.toLowerCase().includes(this.searchQuery.toLowerCase());
            });
        }
      
    }
  },
  mounted() {
    // 获取当前城市
    this.city=this.$route.query.city
    //获取城市列表
    this.getCity()
  },
  methods: {
    // 左上角返回
    quit(){
        this.$router.go(-1);
    },
    //获取城市列表
    getCity(){
      getCityList({
        apikey:this.$store.state.appkey
      }).then(res=>{
        if(res.code==200){
          this.cityList=res.data
          this.cityList = this.cityList.sort(this.sortBankList("cityPinyin"));
          
          //生成26英文字母,为锚点准备
          for(var i=65;i<91;i++){
              this.findword.push(String.fromCharCode(i))
          }
        
        }
      })
    },
    sortBankList(propertyName) {
      return function sortList(object1, object2) {
        const value1 = object1[propertyName];
        const value2 = object2[propertyName];
        if (value2 < value1) {
          return 1;
        }
        if (value2 > value1) {
          return -1;
        }
        return 0;
      };
    },
    // getCity(){
    //   let data = {
    //     method:"xuankua.city.list",
    //     appkey:this.$store.state.appkey,
    //     timestamp:this.timestamp.toString(),
    //     v:"1.0"
    //   }
    //   let sign=this.$utils.getASCII(data)
    //   getCityList({
    //     ...data,
    //     sign:sign
    //   }).then(res=>{
      
    //     this.cityList=res.data.cityList
    //     //拿出前十个热门城市
    //     let count=0
    //     for(var i=0;i<this.cityList.length;i++){
    //         if(this.cityList[i].ishot==true){
    //             this.hotcitylist.push(this.cityList[i])
    //             count++
    //             if(count==10){
    //                 break
    //             }
    //         }
    //     }
    //     // console.log(this.hotcitylist);
    
    // },
    //锚点跳转
    changeHash(idname) {
        document.querySelector(idname).scrollIntoView(true);
    },
    see(){
        if(this.searchQuery==""){
            document.querySelector(".inner").style.display="block"
        document.querySelector(".searchlist").style.display="none"
        }else{
            document.querySelector(".inner").style.display="none"
        document.querySelector(".searchlist").style.display="block"
        }
    },
    //修改城市
    editCity(option){
        // console.log();
        // this.$router.push({path:"/index",query: {city:''+this.city}})
      let targetId = option.cityId
      let cityName = option.cityName
      this.$store.commit("changeTargetId",targetId)
      this.$store.commit("changeCityName",cityName)
      this.searchCityId(cityName+'市')
      sessionStorage.setItem("targetId",targetId)
      sessionStorage.setItem("cityName",cityName)
      // sessionStorage.setItem("changeCity",1)
      this.$router.options.routes.forEach(item=>{
        if(item.meta){
          if(item.meta.keepAlive){
            item.meta.keepAlive=false
          }
        }
      })
        this.$router.go(-1)
    },
    goindex(){
      this.$router.go(-1)
    },
    // 查询初始cityId
    searchCityId(city){
      Cakecityshow({
        city
      }).then(res=>{
        // console.log(res)
        if(res.code==200){
          let cityShow = res.data.city_show
          this.city = cityShow.name
          sessionStorage.setItem("cityName",cityShow.name)
          sessionStorage.setItem("cityId",cityShow.id)
          this.$emit('getCityId',cityShow.id)
        }
      })
    },
    
  },
  created(){
    // console.log(baseurl);
    // 获取时间
  }
};
</script>

<style scoped lang="less">
// html {
//   scroll-behavior: smooth;
// }
.font13{
    font-size: 13px;
}
.citylist{
    position: relative;
  padding-top: 13px;
}
/deep/.van-search__content {
  background-color: #fff0;
}
.citylist .citysearch{
    //background-color: #f9f9f9;
    height: 5vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .citylist .citysearch .quit{
    margin-left: 1vw;
  }
  .citylist .citysearch .van-search .van-cell{
    background-color: #ececec;
    border-radius: 50px;
    padding-left: 15px;
    
  }
  .citylist .citysearch .search{
    width: 80vw;
    margin-right: 5vw;
    height: 3vh;
  }
  .citylist .van-icon-search:before{
    margin-left: 25vw;
  }
  .citylist .list .cityone{
    border-bottom: 1px solid #f0f0f0;
    padding-left: 3vw;
    font-size: 0.8rem;
    // padding-top: 1vh;
    padding-bottom: 1vh;
  }
  .citylist .list .wordtitle{
    background-color: #f0f0f0;
    padding-left: 3vw;
    font-size: 0.8rem;
    color: #999;
    padding-bottom: 1vh;
    padding-top: 1vh;
  }
  .citylist .cityblock{
    width: 28%;
    background-color: #fff;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 4vh;
    margin-left: 3vw;
    margin-top: 10px;
    float: left;
  }
</style>