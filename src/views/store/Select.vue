<template>
  <div class="wrap">
    <ReturnBack :rcolor="'#fff'" :bcolor="'rgba(218,218,218,0.26)'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <div class="indexview">
      <div>
        <img :src="imgurl" style="width: 100%;" alt="">
      </div>
      <PublicIndex :num2="num2"></PublicIndex>

      <div class="explain" v-html="copyright" style="line-height: 25px;"></div>

    </div>
  </div>

</template>

<script>
import PublicIndex1 from "@/components/PublicIndex1.vue"
import PublicIndex from "@/components/PublicIndex.vue"
import {getBannerList,getBannerLists, getdbtext} from '@/api/service'

export default {
  components: {PublicIndex, PublicIndex1},
  data() {
    return {
      num1: "",
      num2: "",
      title: "",
      imgurl: "",
      copyright: "",
      loadingflag: true
    };
  },

  mounted() {

    // console.log(this.$route.query.num1,this.$route.query.num2);
    this.num1 = this.$route.query.num1
    this.num2 = this.$route.query.num2
    if (this.num1 == 1) {
      this.title = "mdl"
      getdbtext({
        type: this.title
      }).then(res => {
        this.loadingflag = false
        this.copyright = res.data.mdlcopyright
        // console.log(this.copyright);
      })
    } else if (this.num1 == 2) {
      this.title = "kfc"
      // console.log(this.title);
      getdbtext({
        type: this.title
      }).then(res => {
        this.loadingflag = false
        this.copyright = res.data.kdjcopyright
      })
    } else if (this.num1 == 3) {
      this.title = "bsk"
      getdbtext({
        type: this.title
      }).then(res => {
        this.loadingflag = false
        this.copyright = res.data.bskcopyright
      })
    } else if (this.num1 == 4) {
      this.title = "xbk"
      getdbtext({
        type: this.title
      }).then(res => {
        this.loadingflag = false
        this.copyright = res.data.xbkcopyright
      })
    } else if (this.num1 == 5) {
      this.title = "nx"
      getdbtext({
        type: this.title
      }).then(res => {
        this.loadingflag = false
        this.copyright = res.data.nxcopyright
      })
    }else if (this.num1 == 6) {
      this.title = "rxkf"
      // setTimeout(() => {
      // _this.storename = "瑞幸咖啡"
      // _this.ot = "RXKF"
      // _this.getNXStore()
      // }, 6000);
      getdbtext({
        type: this.title
      }).then(res => {
        this.loadingflag = false
        this.copyright = res.data.rxcopyright
      })
    }else if (this.num1 ==7) {
      this.title = "kd"
      // setTimeout(() => {
      // _this.storename = "库迪"
      // _this.ot = "KD"
      // _this.getNXStore()
      // }, 6000);
      getdbtext({
        type: this.title
      }).then(res => {
        this.loadingflag = false
        this.copyright = res.data.nxcopyright
      })
    }else if (this.num1 ==8) {
      this.title = "tas"
       
      getdbtext({
        type: this.title
      }).then(res => {
        this.loadingflag = false
        this.copyright = res.data.tsdcopyright

      })
    }
    // console.log(this.copyright);

    if(this.num1 != 8){
    this.getpiclist();

    }else{

    this.getpiclists();//岚延

    }
  },

  methods: {
    getpiclist() {
      getBannerList({
        flag: '2',
        type: this.title
      }).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.imgurl = res.data.banner.img
          // this.imgurlbox=res.data.list
          // console.log(this.imgurl);
        }

      })

    },
    getpiclists() {
      getBannerLists({
        flag: '2',
        type: this.title
      }).then(res => {
        
        if (res.code == 200) {
          this.imgurl = res.data.banner.img
          
        }

      })

    }



  },
};
</script>

<style scoped>
.wrap {
  position: relative;
}

.indexview {
  min-height: 100vh;
  width: 100vw;
  background: #f0f0f0;
  position: relative;
}

.explain {
  text-align: center;
  color: #A7A7A7;
  font-size: 13px;
  width: 100%;
  position: absolute;
  bottom: 15px;
}

</style>