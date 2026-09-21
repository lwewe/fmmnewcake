<template>
  <div class="conPage">

    <!-- <NProgress v-if="loadingflag"/> -->
    <div class="banner">
      <img :src="banner" style="width: 100%;" alt="">

    </div>
    <!-- tab -->

    <div class="tabbar" :class="{ tabbar2: show }" ref="topScroll"
      v-if="tabList && tabList.length > 0 && (classfynum == 4 || classfynum == 7 || classfynum == 8)">
      <div v-if="isLoading" class="isTab" :style="'width:' + tabList.length * 90 + 'px;'"></div>
      <div class="tabbarBox" :style="'width:' + tabList.length * 90 + 'px;'">
        <div class="tabItem" v-for="(item, index) in tabList" :key="item.id" @click="changeTab(item.id, index)">
          <div class="tabTop " :class="[{ tabTop2: active == item.id }, { ['text' + classfynum]: active == item.id }]">
            {{
              item.title }}</div>
          <div class="tabBottom"
            :class="[{ tabBottom2: active == item.id }, { ['bg' + classfynum]: active == item.id }]">
            {{ item.xtitle }}</div>
        </div>
      </div>
    </div>

    <!--    列表-->
    <div :class="'listBox' + classfynum" :style="{ paddingTop: show ? '65px' : '0' }">
      <ShopList :productList="productList"></ShopList>
      <loading style="margin-top: 2px" v-if="isLoading"></loading>
    </div>
  </div>
</template>
<script>
import Swiper from "swiper";

import ShopList from "@/components/ShopList.vue";

import { getCakeBirthdayList, syflProduct, getCakeIndex } from "@/api";

export default {
  components: { ShopList },
  data() {
    return {
      classfynum: '',
      classify: '',
      active: 0,           // 当前选中的tab id
      show: false,         // tab吸顶状态
      isTab: false,         // tab切换标记
      tabList: [],
      isHeight: false,
      swiper: null,
      sortList: [],
      selectId: 2,
      banner: '',
      loadingflag: true,
      productList: [],
      isScroll: false,
      timer: null,
      isLoading: false,
      pageno: 1,
      fid: '',
      cid: ''
    }
  },
  methods: {
    // 获取分类tab列表
    // getTabList() {
    //   getCakeIndex().then(res => {
    //     if (res.code == 200) {
    //      // this.tabList = res.data.classify
    //       //  this.tabList =this.classify;
    //       if (this.tabList.length > 0) {
    //         this.active = this.tabList[0].id
    //         this.fid = this.active
    //         this.getCakeProduct(this.active)
    //       }
    //     }
    //   })
    // },

    // 根据分类获取产品列表
    getCakeProduct(fid, pageno = 1) {
      this.isLoading = true

      // 使用传入的 fid 参数，而不是 this.fid
      const requestFid = fid || this.fid || this.$route.query.id

      syflProduct({
        fid: requestFid,
        pageno: pageno,
        pagesize: 10
      }).then(res => {
        this.isLoading = false
        if (res.code == 200) {
          // 安全处理 classify_list
          if (pageno === 1 && res.data.classify_list) {
            this.tabList = res.data.classify_list
            // 只在第一次加载且 active 为 0 时设置默认值
            if (this.active === 0 && this.tabList.length > 0) {
              this.active = this.tabList[0].id
              this.fid = this.active
            }
          }

          // 安全设置 banner
          if (res.data.classify) {
            this.banner = res.data.classify.banner || this.banner
          }

          // 处理产品列表
          if (pageno === 1) {
            this.productList = res.data.product_list || []
          } else {
            const newProducts = res.data.product_list || []
            this.productList = [...this.productList, ...newProducts]
          }

          // 判断是否还有更多数据
          const productList = res.data.product_list || []
          if (productList.length === 0) {
            this.isScroll = true
          } else {
            this.isScroll = productList.length < 10
          }
        } else {
          // 请求失败时的处理
          if (pageno === 1) {
            this.productList = []
            this.tabList = []
          }
          this.isScroll = true
        }
      }).catch(() => {
        this.isLoading = false
        if (pageno === 1) {
          this.productList = []
          this.tabList = []
        }
      })
    },
    showSearch() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      // 获取banner高度
      let bannerHeight = document.querySelector('.banner')?.offsetHeight || 0;
      if (scrollTop > bannerHeight) {
        this.show = true;
      } else {
        this.show = false;
      }
    },
    changeTab(id, index) {
      if (this.active === id) return

      this.isHeight = true
      this.isScroll = false
      this.productList = []  // 清空列表
      this.pageno = 1
      this.active = id
      this.fid = id
      this.isTab = true

      // 直接调用，传入新的 fid
      this.getCakeProduct(id, 1)

      // 滚动处理，添加安全检查
      this.$nextTick(() => {
        if (this.$refs.topScroll) {
          if ((index + 1) >= 3) {
            this.$refs.topScroll.scrollLeft = 60 * (index + 1)
          } else {
            this.$refs.topScroll.scrollLeft = 0
          }
        }
      })
    },
    // 品牌列表
    getBrind(keyword = "") {
      syflProduct({
        // cid: this.cid || this.$route.query.id,
        fid: this.fid || this.$router.query.id,
        pageno: 1,
        pagesize: 99999,

      }).then(res => {
        if (res.code == 200) {
          this.productList = res.data.product_list;
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
        // this.getCakeBirthday(this.selectId);

        this.getCakeProduct(this.active, this.pageno)  // 改为调用 getCakeProduct
      }
    }
  },
  created() {
    // this.banner = this.$route.query.banner
    //  this.fid = 18;
    this.fid = this.$route.query.id;
    this.classfynum = this.$route.query.classfynum; // 如果不再用于判断 Tab 显示，可保留作样式用
    if (this.fid) {
      this.getCakeProduct(this.fid, 1)
    }
    // this.cid = this.$route.query.cid;
    // this.getTabList()  // 改为调用获取tab列表
  },
  mounted() {
    this.classfynum = this.$route.query.classfynum;
    // this.getBrind()
    window.addEventListener('scroll', this.handleScroll);

    window.addEventListener('scroll', this.showSearch);  // 新增
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, false);

    window.removeEventListener('scroll', this.showSearch, false);  // 新增
  },
}
</script>


<style scoped lang="less">
// tab 样式 - 添加以下内容
.tabbar {
  background-color: #fff;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 7px 15px;
  margin-top: 0px;
  position: relative;

  .tabbarBox {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .tabItem {
    width: 100%;
  }

  .tabTop {
    text-align: center;
    font-size: 15px;
  }

  .tabBottom {
    font-size: 12px;
    color: #A8A8A8;
    text-align: center;
    padding-top: 2px;
    margin-top: 3px;
  }

  .tabTop2 {
    color: #240003;
    font-weight: 600;
  }

  .tabBottom2 {
    padding: 2px 4px 3px;
    width: 85%;
    margin: auto;
    margin-top: 3px;
    // background-color: #F99E9B;
    color: #ffffff;
    border-radius: 30px;
    font-size: 13px;
  }
}

.tabbar2 {
  position: fixed;
  top: -5px;
  left: 0;
  z-index: 99;
  width: 93%;
}

.tabbar::-webkit-scrollbar {
  display: none;
}

.isTab {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

//  xinzneg

.conPage {
  min-height: 100vh;
  background-color: #F0F0F0;
}

.banner {

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

.swiper-slide-active,
.swiper-slide-duplicate-active {
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

.listBox1 {
  background-color: rgba(253, 237, 238, 1);
}

.text1 {
  color: rgba(236, 92, 88, 1) !important;
}

.bg1 {
  background-color: rgba(236, 92, 88, 1) !important;
}


.listBox2 {
  background-color: rgba(246, 184, 112, 0.36);
}

.text2 {
  color: rgba(234, 121, 50, 1) !important;
}

.bg2 {
  background-color: rgba(234, 121, 50, 1) !important;
}

.listBox3 {
  background-color: rgba(252, 252, 219, 0.34);
}

.text3 {
  color: rgba(248, 182, 42, 1) !important;
}

.bg3 {
  background-color: rgba(248, 182, 42, 1) !important;
}


.listBox4 {
  background-color: rgba(255, 249, 232, 1);
}

.text4 {
  color: rgba(255, 191, 103, 1) !important;
}

.bg4 {
  background-color: rgba(255, 191, 103, 1) !important;
}



.listBox5 {
  background-color: rgba(202, 251, 255, 1);
}

.text5 {
  color: rgba(30, 166, 217, 1) !important;
}

.bg5 {
  background-color: rgba(30, 166, 217, 1) !important;
}

.listBox6 {
  background-color: rgba(118, 62, 45, 0.50);
}

.text6 {
  color: rgba(130, 71, 53, 1) !important;
}

.bg6 {
  background-color: rgba(130, 71, 53, 1) !important;
}

//
.listBox7 {
  background-color: rgba(252, 213, 174, 0.50);
}

.text7 {
  color: rgba(88, 153, 37, 1) !important;
}

.bg7 {
  background-color: rgba(88, 153, 37, 1) !important;
}

//饮品
.listBox8 {
  background-color: rgba(255, 165, 25, 0.50);
}

.text8 {
  color: rgba(255, 165, 25, 1) !important;
}

.bg8 {
  background: rgba(255, 165, 25, 1) !important;
}
</style>