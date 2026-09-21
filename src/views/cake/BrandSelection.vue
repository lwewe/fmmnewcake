<template>
  <div class="conPage">
    <NProgress v-if="loadingflag" />
    <!--  -->
    <div class="newSelect">
      <div class="mb10"><span></span>场景甄选
      </div>
      <div v-for="items in festivalList" :key="items.id" class="topImg">
        <img :src="items.img" style="width: 100%;" alt="" @click="brandaelectiondetails(items.id, items.banner)">
        <div class="boxSelect">
          <div v-for="item1 in items.product" :key="item1.id" class="itemBox" @click="todetail(item1)">
            <img :src="item1.image_path" alt="" style="width: 100%;border-radius: 8px;">
            <div class="line1">
              {{ item1.title }}
            </div>
            <div style="color: #CB4947;">
              <span class="fs10">￥</span>
              <span class="fs14 fw200">{{ item1.price }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="songli">
        <div class="mb10"><span></span>送礼优选
        </div>
        <div style="display: flex;justify-content: space-between;" v-for="item2 in giftsList" :key="item2.id">
          <img :src="item2.img" alt="" style="height: 234px;" @click="brandaelectiondetails(item2.id, item2.banner)">
          <div class="boxLf">

            <div v-for="item3 in item2.product" class="w97" @click="todetail(item3)">
              <img :src="item3.image_path" alt="" style="width:70px;height: 70px;border-radius: 8px;">
              <div style="flex: 1;font-size: 12px;padding-left: 8px;">
                <span class="titles">{{
                  item3.title }}</span>
                <span class="pinkL">{{
                  item3.label_name.slice(0, 4) }}</span>
                <span class="price"><span class="fs10">￥</span>{{ item3.price }}</span>
              </div>
            </div>

            <!-- <div style=" text-align: center; margin-top: 20px;" @click="brandaelectiondetails(item2.id, item2.banner)">
              <span class="mores">查看更多</span>
            </div> -->
          </div>
        </div>

      </div>

    </div>
    <!--  -->


  </div>
</template>
<script>
import Swiper from "swiper";
import NewProductList from "@/components/NewProductList.vue";
import ShopList from "@/components/ShopList.vue";
import { getBrindList } from "@/api/brind";
import { getCakeBirthdayList, getFestival } from "@/api";

export default {
  components: { ShopList },
  data() {
    return {
      swiper: null,
      sortList: [],
      selectId: 2,
      banner: "",
      loadingflag: true,
      productList: [],
      isScroll: false,
      timer: null,
      isLoading: false,
      pageno: 1,

      festivalList: '',
      giftsList: '',
    }
  },
  methods: {
    brandaelectiondetails(fid, banner) {
      this.$router.push({ path: '/brandaelectiondetails', query: { fid: fid, banner: banner } })
    },
    todetail(item) {

      if (item.cpbs == 1) {
        this.$router.push({ path: "/shopDetail", query: { id: item.id } })
      } else if (item.cpbs == 2) {
        if (this.cake == 1) {
          this.$router.replace({ path: "/productDetail", query: { id: item.id } })
          this.$router.go(0)
        } else {
          this.$router.push({ path: "/productDetail", query: { id: item.id } })
        }
      }
    },
    getFestivals() {
      getFestival({
      }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.festivalList = res.data.festival_list;
          this.giftsList = res.data.gifts_list;
        }
      })
    },
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
          setTimeout(() => {
            this.getSwiper()
          }, 500)
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
        // this.loadingflag = false
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
    // this.getBrind()
    this.getFestivals()
    // window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    // window.removeEventListener('scroll', this.handleScroll, false);
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

.newSelect {
  padding: 10px;

  .mb10 {
    margin-bottom: 10px;

    span {
      background-color: #ff7157;
      width: 2px;
      height: 12px;
      display: inline-block;
      margin-right: 5px;
    }
  }

  .topImg {
    background-color: #ffffff;
    border-radius: 8px;
    margin-bottom: 10px;
  }

  .boxSelect {
    display: flex;
    justify-content: space-between;
    width: 96%;
    margin: auto;
    background-color: #ffffff;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;

    .fs10 {
      font-size: 10px;
    }

    .fs14 {
      font-size: 14px;
    }

    .fw200 {
      font-weight: 200;
    }

    .itemBox {
      width: 23.5%;
      margin-top: 6px;
      margin-bottom: 8px;

      .line1 {
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }


  }


  .songli {
    .mb10 {
      margin-bottom: 10px;

      span {

        background-color: #ff7157;
        width: 2px;
        height: 12px;
        display: inline-block;
        margin-right: 5px;
      }
    }


    .boxLf {
      width: 50%;
      background-color: #ffffff;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;

      .w97 {
        display: flex;
        width: 97%;
        padding-left: 3%;
        margin-top: 6px;

        .titles {
          font-size: 13px;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 90px;
        }

        .pinkL {
          display: inline-block;
          border: 1px solid #F99E9B;
          color: #F99E9B;
          padding: 0 4px;
          font-size: 12px;
        }
      }

      .price {
        display: block;
        color: #CB4947;
        margin-top: 4px;
        font-size: 14px;
        font-weight: 200;
        .fs10{
          font-size: 10px;
        }
      }
    }

    .mores {
      background: #F99E9B;
      color: #ffffff;
      font-size: 12px;
      text-align: center;
      padding: 4px 10px;
      border-radius: 30px;
    }

  }



}
</style>