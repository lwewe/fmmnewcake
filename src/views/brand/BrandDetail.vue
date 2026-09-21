<template>
  <div class="conDetail">
    <ReturnBack :rcolor="'#fff'" :bcolor="'rgb(255 255 255 / 26%)'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <div class="backImg">
      <img class="img" :src="banner" alt="">
    </div>
    <div class="topBox">
      <div class="brandBox">
          <div class="brandImg">
            <img class="img"  :src="brandshow.image_path" alt="">
          </div>
        <div style="padding-bottom: 3px">{{brandshow.name}}</div>
      </div>
      <div class="textBox" v-if="brandshow.description">
        <div class="toTop">
          <img class="img"  src="../../assets/cake/sj.png" alt="">
        </div>
        <div class="textMax" :class="{textMax2:isPackUp}" v-html="brandshow.description"></div>
        <div class="brandDetails" @click="isPackUp=!isPackUp">
          <div>{{!isPackUp? '品牌详情':'收起'}}</div>
          <div>
            <van-icon v-if="!isPackUp" name="arrow-down" />
            <van-icon v-else name="arrow-up" />
          </div>
        </div>
      </div>
    </div>
    <div class="listBox">
      <ShopList :productList="productList"></ShopList>
      <loading style="margin: 10px 0px 20px" v-if="listLoading"></loading>
    </div>
  </div>
</template>
<script>
import ShopList from "@/components/ShopList.vue";
import {getBrindDetail} from "@/api/brind";
import {getCakeBirthdayList} from "@/api";

export default {
  name: "BrandDetail",
  components: {ShopList},
  data(){
    return{
      isPackUp:false,
      banner:"",
      brandshow:{},
      loadingflag:true,
      isScroll:false,
      pageno:1,
      productList:[],
      listLoading:false
    }
  },
  methods:{
    getDetail(id){
      getBrindDetail({
        id
      }).then(res=>{
        this.loadingflag = false
        if(res.code==200){
          this.banner = res.data.banner.img
          this.brandshow = res.data.brandshow
        }
      })
    },
    getCakeBirthday(brand_id,pageno = this.pageno) {
      this.listLoading = true
      let data = {
        pageno,
        pagesize: 10,
        brand_id,
        type:1
      }
      getCakeBirthdayList(data).then(res => {
        this.loadingflag = false
        this.listLoading = false
        // this.isLoading = false
        if (res.code == 200) {
          if (res.data.product_list.length == 0) {
            this.isScroll = true
            return
          }
          res.data.product_list.forEach(item => {
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
        this.getCakeBirthday(this.$route.query.brandId)
      }
    }
  },
  created() {
    this.getDetail(this.$route.query.id)
    this.getCakeBirthday(this.$route.query.brandId)
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
.conDetail {
  background-color: #F0F0F0;
  min-height: 100vh;
  position: relative;
}
.backImg{
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.topBox {
  width: 100%;
  background-size: 100% 100%;
  box-sizing: border-box;
  padding: 50px 10px 0px;
  position: relative;
}
.brandImg{
  width: 60px;
  height: 60px;
  border-radius: 10px;
  overflow: hidden;
}
.brandBox{
  display: flex;
  align-items: flex-end;
  gap: 8px;
  font-size: 15px;
  padding: 0px 28px;
  //font-weight: bold;
}
.textBox{
  background-color: white;
  border-radius: 8px;
  padding: 10px;
  font-size: 13px;
  line-height: 20px;
  position: relative;
  margin-top: 15px;
  color: #3d3d3d;
  .textMax{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2; /* 显示两行 */
  }
}
.toTop{
  position: absolute;
  top: -16px;
  left: 45px;
  width: 24px;
  height: 22px;
}
.brandDetails{
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #D87675;
  justify-content: flex-end;
}
.textMax2{
  display: block !important;
}
.listBox{
  position: relative;
}
</style>