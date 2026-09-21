<template>
  <div class="conPage">
    <ReturnBack :rcolor="'#fff'" :bcolor="'rgba(218,218,218,0.26)'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <div class="banner">
      <img class="img" :src="banner" alt="">
    </div>
    <div class="lineBox">
      <div class="line"></div>
      <div class="lineTitle">优选品牌</div>
      <div class="line"></div>
    </div>
    <div class="centerBox">
      <!--      品牌-->
      <!--    轮播图分类 -->
      <div class="filmBox">
        <!--      分类-->
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="item in sortList" :key="item.id" @click="amplify(item.id)">
              <div class="bannerImg">
                <img class="img" style="object-fit: cover" :src="item.image_path" alt="">
              </div>
<!--              <div>{{item.name}}</div>-->
              <!--            详情-->
              <div class="detail" v-if="selectId==item.id"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <!--    列表-->
    <div class="listBox">
      <ShopList :productList="productList"></ShopList>
      <loading style="margin-top: 2px" v-if="isLoading"></loading>
    </div>
  </div>
</template>
<script>
import Swiper from "swiper";
import NewProductList from "@/components/NewProductList.vue";
import ShopList from "@/components/ShopList.vue";
import {getBrindList} from "@/api/brind";
import {getCakeBirthdayList} from "@/api";

export default {
  components: {ShopList},
  data() {
    return {
      swiper: null,
      sortList: [],
      selectId: 2,
      banner: "",
      loadingflag: true,
      productList: [],
      isScroll: false,
      timer:null,
      isLoading:false,
      pageno:1
    }
  },
  methods: {
    // 品牌列表
    getBrind(keyword = "") {
      getBrindList({
        flag: 2,
        pageno: 1,
        pagesize: 99999,
        keyword
      }).then(res => {
        if (res.code == 200) {
          this.sortList = res.data
          setTimeout(()=>{
            this.getSwiper()
          },500)
          if (this.sortList.length > 1) {
            this.selectId = this.sortList[1].id
          } else if (this.sortList.length == 1) {
            this.selectId = this.sortList[0].id
          }
          this.getCakeBirthday(this.selectId)
        }
      })
    },
    // 轮播
    getSwiper() {
      this.swiper = new Swiper('.swiper-container', {
        clickable: true, // 轮播按钮支持点击
        observer: true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,//修改swiper的父元素时，自动初始化swiper
        //点击事件
        on: {
          click: () => {

          },
          slideChange: () => {
            if (this.swiper) {
              this.changeBanner(this.swiper.activeIndex)
            }
            // 在这里可以获取当前位于中间的图片索引
          }
        },
        // slidesPerView: 4,
        paginationClickable: true,
        // spaceBetween: 10,
        slideToClickedSlide: true, // 点击的slide会居中
        slidesPerView: 4,
        sapceBetween: 30,
        centeredSlides: true,
        initialSlide: 1,//默认第二个
        // loop:true,
        // speed : 100, //速度
        // autoplay : {
        //   delay : 5000, //自动切换的时间间隔，单位ms
        //   disableOnInteraction : true //用户操作swiper之后，是否禁止autoplay
        // },
      });
    },
    changeBanner(activeIndex) {
      this.selectId = this.sortList[activeIndex].id
      this.productList = []
      this.pageno = 1
      this.isScroll = false
      // 等待的时间默认200ms
      // 每次事件被触发时，都清除之前的旧定时器
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.isLoading = true
      // 函数延迟执行
      this.timer = setTimeout(() => {
        this.getCakeBirthday(this.selectId)
        this.timer = undefined;
      }, 500);
    },
    amplify(id) {
      this.productList = []
      this.selectId = id
      this.pageno = 1
      this.isScroll = false
      // 等待的时间默认200ms
      // 每次事件被触发时，都清除之前的旧定时器
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.isLoading = true
      // 函数延迟执行
      this.timer = setTimeout(() => {
        this.getCakeBirthday(this.selectId)
        this.timer = undefined;
      }, 500);
    },
    getCakeBirthday(brand_id, pageno = this.pageno) {
      this.isLoading = true
      let data = {
        pageno,
        pagesize: 10,
        brand_id,
        type: 1
      }
      getCakeBirthdayList(data).then(res => {
        this.loadingflag = false
        this.isLoading = false
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
        this.getCakeBirthday(this.selectId)
      }
    }
  },
  created() {
    this.banner = this.$route.query.banner
  },
  mounted() {
    this.getBrind()
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
  background-color: #F0F0F0;
}

.banner {
  width: 100%;
  display: flex;
}

.lineBox {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  color: #E3A678;
  font-size: 14px;
  padding: 10px 0px;

  .line {
    width: 60px;
    border-top: 1px solid #EEE7E1;
    margin-top: 1px;
  }
}

.centerBox {
  background-color: #F9E3D3;
  padding: 0px 10px 15px;
}

//轮播图
.swiper-container {
  width: 100%;
  height: 100%;
  padding: 10px 0px 0px;
  overflow: hidden;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  transition: 200ms;
  transform: scale(0.8);
}

.swiper-wrapper {
  display: flex;
  //margin-left: -36.5%;
  margin-left: -15%;
}

.swiper-slide-active, .swiper-slide-duplicate-active {
  transform: scale(1);
}

.bannerImg {
  width: 88px;
  height: 88px;
  border: 2px solid #F6D6C7;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
}

.detail {
  background-image: linear-gradient(to right, #FE6F6A, #F77E60);
  width: 25px;
  height: 6px;
  margin: 5px auto 0px;
  border-radius: 30px;
}

.listBox {

}
</style>