<template>
  <div class="conPage">
    <ReturnBack :rcolor="'#fff'" :bcolor="'rgba(218,218,218,0.26)'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <div class="banner">
      <img class="img" :src="banner" alt="">
    </div>
<!--    列表-->
    <div class="listBox">
      <NewShopList  :flag="1" :shopList="productList" v-if="productList.length>0"></NewShopList>
      <!--        </div>-->
      <loading style="margin-top: 2px" v-if="isLoading"></loading>
    </div>
  </div>
</template>
<script>
import ShopList from "@/components/ShopList.vue";
import {getCakeProductList, getWinnowList} from "@/api";
import NewShopList from "@/components/NewShopList.vue";

export default {
  name: "GoodBooks",
  components: {NewShopList, ShopList},
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
      getWinnowList({
        pageno,
        pagesize:10
      }).then(res => {
        // console.log(res)
        this.isLoading = false
        this.loadingflag = false
        if(res.code==200){
          this.banner = res.data.banner.img
          if(res.data.jingxuan_list.length==0){
            this.isScroll = true
            return
          }
          res.data.jingxuan_list.forEach(item=>{
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
      // console.log(Math.ceil(scrollTop + clientHeight), scrollHeight)
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        this.onMost()
      }
    },
    onMost() {
      // console.log(this.isScroll)
      if (!this.isScroll) {
        this.pageno++
        // console.log(this.active,this.pageno)
        this.getCakeProduct(this.active, this.pageno)
      }
    }
  },
  created() {
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
 background-image: linear-gradient(to bottom,#8180F9,#9898F9,#D6D9FA,#D6D9FA);
}

.banner {
  width: 100%;
  display: flex;
}
.listBox{
  padding: 0px 12px 10px;
  margin-top: -18px;
}
</style>