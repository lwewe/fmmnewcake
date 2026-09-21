<template>
  <div class="conPage">
    <ReturnBack :rcolor="'#fff'" :bcolor="'rgba(218,218,218,0.26)'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <div class="banner">
      <img class="img" :src="banner" alt="">
    </div>
<!--    列表-->
    <div class="listBox">
        <ShopList :productList="productList"></ShopList>
      <loading style="margin-top: 2px" v-if="isLoading"></loading>
    </div>
  </div>
</template>
<script>
import ShopList from "@/components/ShopList.vue";
import {getCakeProductList} from "@/api";

export default {
  name: "NiceBirthday",
  components: {ShopList},
  data(){
    return{
      banner:"",
      pageno:1,
      isScroll:false,
      productList:[],
      isLoading:false,
      loadingflag:true
    }
  },
  methods:{
    getCakeProduct(pageno = this.pageno) {
      this.isLoading = true
      getCakeProductList({
        fid:9,
        pageno,
        pagesize:10
      }).then(res => {
        this.isLoading = false
        this.loadingflag = false
        if(res.code==200){
          if(res.data.product_list.length==0){
            this.isScroll = true
            return
          }
          res.data.product_list.forEach(item=>{
            this.productList.push(item)
          })
        }
      })
    },
    //滚动条事件
    handleScroll(e) {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        this.onMost()
      }
    },
    onMost() {
      if (!this.isScroll) {
        this.pageno++
        this.getCakeProduct(this.active, this.pageno)
      }
    }
  },
  created() {
    this.banner = this.$route.query.banner
    this.getCakeProduct()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, false);
  },
}
</script>


<style scoped lang="less">
.conPage {
  min-height: 100vh;
 background-color: #F6D9DB;
}

.banner {
  width: 100%;
  display: flex;
}
</style>