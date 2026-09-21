<template>
  <div class="conPage">
    <ReturnBack :rcolor="'#fff'" :bcolor="'rgb(255 255 255 / 26%)'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <div class="backBox" v-if="search!=1">
      <img class="img" :src="banner" alt="">
    </div>
    <div>
      <van-search @input="searchInput" background="#fff0" :placeholder="search!=1?'搜索你喜欢的品牌':'搜索你喜欢的商品'" v-model="searchValue"/>
    </div>
    <!--    品牌-->
    <loading style="margin: 10px 0px 20px" v-if="isLoading&&sortList.length==0&&search!=1"></loading>
    <div class="filmBox" v-if="sortList.length>0&&search!=1">
      <!--    大类别-->
      <div class="popupBox3" v-if="bigcategory">
        <van-popup v-model="bigcategory" position="top">
          <div class="popup">
            <div class="sortTop sortCenter">
              <div class="sortItem" v-for="(item,index) in sortList"
                   :key="item.id" @click="toBrandDetail(item.id,item.brand_id)">
                <div class="iconImg">
                  <img class="img" :src="item.image_path" alt="">
                </div>
                <div class="sortText">{{ item.name }}</div>
              </div>
            </div>
            <div>
              <div class="retract" @click="bigcategory=false">
                <div>收起</div>
                <div style="padding-top: 3px">
                  <van-icon name="arrow-up"/>
                </div>
              </div>
            </div>
          </div>
        </van-popup>
      </div>
      <div class="allBox" @click="bigcategory=true">
        <div>全</div>
        <div>部</div>
        <div class="allIcon">
          <img class="img" src="../../assets/tubiao/all.png" alt="">
        </div>
      </div>
      <!--      分类-->
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <!--          :class="{amplify:item.id==selectId||index==indexText+2}" -->
          <div @click="toBrandDetail(item.id,item.brand_id)" class="swiper-slide" v-for="(item,index) in sortList" :key="item.id"
               :style="{backgroundImage:(index+1)%4==1?'linear-gradient(to bottom, #E45FB9, #F1608A,#FB6768)':(index+1)%4==2?'linear-gradient(to bottom, #F8E59B, #FAC67D,#FD9C59)':(index+1)%4==3?'linear-gradient(to bottom, #A9D8E6, #73A5EC,#5582F2)':(index+1)%4==0?'linear-gradient(to bottom, #FFD5B3, #F793BA,#F05CC3)':''}">
            <div class="bannerBox">
              <div class="bannerImg">
                <img class="img" :src="item.image_path" alt="">
              </div>
            </div>
            <!--            详情-->
            <div class="sortText">{{ item.name }}</div>
          </div>
        </div>

      </div>
    </div>
    <!--      排序-->
    <div class="sort">
      <!--    综合-->
      <div class="popupBox1" v-if="showSynthesis">
        <van-popup v-model="showSynthesis" position="top">
          <div class="popup" style="border: 1px solid #EAEAEA">
            <div class="synthesisItem" v-for="item in synthesisList" :key="item.id" @click="changeSynthesis(item.id)">
              <div :class="{addRegion:synthesisId==item.id}">{{ item.text }}</div>
              <div v-if="synthesisId==item.id">
                <van-icon color="#ED3137" name="success" size="16px"/>
              </div>
            </div>
          </div>
        </van-popup>
      </div>
      <div class="comprehensive" @click="showSynthesis=!showSynthesis">
        <div>综合</div>
        <div class="down">
          <van-icon v-if="!showSynthesis" size="12px" name="arrow-down"/>
          <van-icon v-else size="12px" name="arrow-up
"/>
        </div>
      </div>
      <div class="comprehensive" style="color: #464646" @click="changePrice">
        <div>价格</div>
        <div class="down">
          <img class="img" src="../../assets/tubiao/px.png" alt="">
        </div>
      </div>
      <div class="comprehensive" style="color: #464646" @click="showAll=true">
        <div>筛选</div>
        <div class="down" style="width: 15px;">
          <img class="img" src="../../assets/tubiao/sx.png" alt="">
        </div>
      </div>
    </div>
    <!--    列表-->
    <div class="listBoxcake" v-if="productList.length>0">
      <ShopList :productList="productList" :cake="2"></ShopList>
    </div>
    <loading style="margin: 10px 0px 20px" v-if="listLoading"></loading>
    <!--    弹窗-->
    <!--全部筛选-->
    <div class="popupBox">
      <van-popup v-model="showAll" position="bottom">
        <div class="popup">
          <div class="close" @click="showAll=false">
            <van-icon size="18px" name="cross"/>
          </div>
          <div class="title">全部筛选</div>
          <div class="listItem">
            <div class="titleItem">价格筛选</div>
            <div class="priceBox">
              <div class="inpBox">
                <input class="inp" type="number" v-model="minprice" placeholder="最低价">
              </div>
              <div>-</div>
              <div class="inpBox">
                <input class="inp" type="number" v-model="maxprice" placeholder="最高价">
              </div>
            </div>
          </div>
          <div class="footer">
            <div class="resetting" @click="resetting">重置</div>
            <div class="resetting complete" @click="complete">完成</div>
          </div>
        </div>
      </van-popup>
    </div>
    <!--    弹窗end-->
    <!--    返回顶部-->
    <div class="goTop" @click.stop="goTop">
      <img class="img" src="../../assets/dangao/db.png" alt="">
    </div>
  </div>
</template>

<script>
import Swiper from "swiper";
import ShopList from "@/components/ShopList.vue";
import {getBrindList} from "@/api/brind";
import {getCakeBirthdayList} from "@/api";

export default {
  name: "BirthdayCake",
  components: {ShopList},
  data() {
    return {
      searchValue: "",
      swiper: null,
      sortList: [],
      //   弹窗
      showSynthesis: false,
      showAll: false,
      bigcategory: false,
      synthesisList: [
        {
          id: 1,
          text: "综合推荐"
        },
        {
          id: 2,
          text: "销量由高到低"
        },
        {
          id: 3,
          text: "新品优先"
        },
      ],
      synthesisId: 1,
      //   弹窗end
      banner: "",
      timer: "",
      isLoading: false,
      listLoading: false,
      pageno: 1,
      productList: [],
      minprice: "",
      maxprice: "",
      type: 1,
      loadingflag:true,
      search:""
    }
  },
  methods: {
    getCakeBirthday(pageno = this.pageno, type = this.type, minprice = this.minprice, maxprice = this.maxprice,keyword=this.searchValue) {
      this.listLoading = true
      let data = {
        pageno,
        type,
        pagesize: 10,
        minprice,
        maxprice,
        keyword
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
    changePrice() {
      this.productList = []
      // this.isSearch = false
      this.isScroll = false
      this.pageno = 1
      if (this.type != 4) {
        this.type = 4
      } else {
        this.type = 5
      }
      this.getCakeBirthday()
    },
    toBrandDetail(id,brandId) {
      this.$router.push({path: "/brandDetail", query: {id,brandId:id}})
    },
    // 返回顶部
    goTop() {
      var num = 0
      this.timer = setInterval(() => {
        num += 10
        document.documentElement.scrollTop -= num;
        if (document.documentElement.scrollTop <= 0) {
          clearInterval(this.timer)
        }
      }, 10)
    },
    searchInput(e) {
      this.sortList = []
      this.isScroll = false
      this.pageno = 1
      // 等待的时间默认200ms
      // 每次事件被触发时，都清除之前的旧定时器
      if (this.timer) {
        clearTimeout(this.timer);
      }
      // 函数延迟执行
      this.timer = setTimeout(() => {
        if(this.search==1){
          this.productList = []
          this.getCakeBirthday()
        }else{
          this.getBrind(e)
        }
        this.timer = undefined;
      }, 1000);
    },
    // 品牌列表
    getBrind(keyword = "") {
      this.isLoading = true
      getBrindList({
        flag: 3,
        pageno: 1,
        pagesize: 99999,
        keyword
      }).then(res => {
        this.isLoading = false
        if (res.code == 200) {
          this.sortList = res.data
         setTimeout(()=>{
           this.getSwiper()
         },500)
        }
      })
    },
    // 弹窗
    changeSynthesis(id) {
      this.synthesisId = id
      this.productList = []
      // this.isSearch = false
      this.isScroll = false
      this.pageno = 1
      this.type = id
      this.getCakeBirthday()
      this.showSynthesis = false
    },
    resetting() {
      // 重置
      this.brandId = ''
      this.maxprice = null
      this.minprice = null
    },
    complete() {
      this.productList = []
      // this.isSearch = false
      this.isScroll = false
      this.pageno = 1
      this.getCakeBirthday()
      this.showAll = false
    },
    // 弹窗end
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
        // centeredSlides: true,
        // initialSlide: 1,//默认第二个
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
      this.indexText = activeIndex
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
        this.getCakeBirthday()
      }
    }, restoreScroll() {
        const scrollY = sessionStorage.getItem('scrollPosition');
        if (scrollY) {
            this.$nextTick(() => {
                window.scrollTo(0, parseInt(scrollY));
            });
        }
    }

    
  },
  created() {
    this.banner = this.$route.query.banner
    this.search = this.$route.query.search
    if(this.search==1){
      document.title = "搜索"
    }
    this.getCakeBirthday()
  },
  mounted() {
    this.getBrind()
    window.addEventListener('scroll', this.handleScroll);
     this.restoreScroll();
  },
   // 添加 keep-alive 激活钩子
    activated() {
        this.restoreScroll();
    },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, false);
  },
}
</script>

<style scoped lang="less">
.conPage {
  overflow: hidden;
}

.backBox {
  width: 100%;
}

.van-search__content {
  background-color: #F4F4F4;
  border-radius: 30px;
}

//轮播图
.swiper-container {
  height: 100%;
  padding: 0px 10px;
  overflow: hidden;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  transition: 200ms;
  transform: scale(0.7);
  background-image: linear-gradient(to bottom, #EED586, #FD9453);
  border-radius: 10px;
  padding: 3px;
  width: 72px !important;
}

.swiper-wrapper {
  width: 100%;
  display: flex;
  //margin-left: -19%;
}

//.swiper-slide-active, .swiper-slide-duplicate-active {
//  transform: scale(1);
//}

.filmBox {
  padding: 0px 15px;
  box-sizing: border-box;
  position: relative;
}

.bannerBox {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  width: 70px;
  height: 70px;
  //box-sizing: border-box;
  display: flex;
  align-items: center;
  margin: auto;
}

.bannerImg {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  position: relative;
  display: flex;

}

.sortText {
  color: white;
  width: 100%;
  border-radius: 8px;
  font-size: 10px;
  height: 20px;
  line-height: 20px;
  padding: 2px 0px 3px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.bannerBox {

}

.allBox {
  font-size: 12px;
  color: #4d4c4c;
  text-align: center;
  background-color: rgb(255 255 255);
  position: absolute;
  top: 0;
  right: -1px;
  height: 100%;
  //width: 23px;
  padding: 28px 13px;
  box-shadow: -4px 1px 7px 1px #fff;
  box-sizing: border-box;
  z-index: 9;

  .allIcon {
    width: 11px;
    margin: auto;
  }
}

.sort {
  display: flex;
  justify-content: space-around;
  margin-top: 7px;
  width: 100%;
  position: relative;

  .comprehensive {
    display: flex;
    align-items: center;
    font-size: 15px;
    gap: 3px;
    color: #CA4041;
    font-weight: bold;
    position: relative;
  }

  .down {
    //padding-top: 3px;
    width: 12px;
  }
}

.listBoxcake {
  background-color: #FBABAB;
  margin-top: 25px;
  min-height: calc(100vh - 106px);
}

//弹窗
/deep/ .van-overlay {
  position: absolute;
}

/deep/ .van-popup--top {
  width: 101%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  transition: none;
  position: absolute;
}

.popupBox1 {
  position: absolute;
  top: 26px;
  left: 0px;
  width: 100%;
  height: 100vh;
  /deep/ .van-overlay {
    top: 0px;
  }

  /deep/ .van-popup--top {
    top: 0px;
  }

  .synthesisItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    font-size: 12px;
  }

  .addRegion {
    color: #D25053;
  }
}

.popupBox {
  .van-popup--bottom {
    max-height: 70vh;
    background-color: #FFFFFF !important;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .close {
    position: absolute;
    top: 13px;
    right: 13px;
  }

  .popup {
    padding: 15px;
  }

  .title {
    font-weight: bold;
    text-align: center;
    font-size: 17px;
  }

  .titleItem {
    font-weight: bold;
    font-size: 15px;
  }

  .listItem {
    margin-top: 20px;
  }

  .priceBox {
    width: 90%;
    margin: 18px auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;

    .inpBox {
      background-color: #F6F6F6;
      border-radius: 30px;
      height: 35px;
      font-size: 13px;

      .inp {
        border: none;
        background-color: transparent;
        text-align: center;
        width: 100%;
        height: 100%;
      }
    }
  }

  .footer {
    //position: absolute;
    //bottom: 8px;
    //left: 5%;
    margin: auto;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 90%;
    border-radius: 30px;
    overflow: hidden;
    margin-top: 125px;
  }

  .resetting {
    background-image: linear-gradient(to right, #FFAA73, #FF8330);
    color: white;
    padding: 10px;
    box-sizing: border-box;
    width: 50%;
    text-align: center;
  }

  .complete {
    background-image: linear-gradient(to right, #E71D1E, #FA0707);
  }
}

.popupBox3 {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100vh;
  /deep/ .van-overlay {
    top: 0px;
  }

  /deep/ .van-popup--top {
    top: 0px;
    max-height: 46vh;
  }

  .popup {
    padding: 15px 25px;
  }

  .sortCenter {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 10px 0px;
  }

  .sortText {
    width: 80%;
    margin: auto;
    text-align: center;
    font-size: 12px;
    margin-top: 5px;
    color: #707070;
    padding: 2px 0px 3px;
  }

  .sortText1 {
    background-color: #E42021;
    color: white;
    border-radius: 30px;
  }

  .sortItem {
    width: 20%;
  }

  .retract {
    text-align: center;
    font-size: 12px;
    color: #B2B2B2;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
  }

  .iconImg {
    width: 48px;
    height: 48px;
    margin: auto;
    border: 1px solid #e3e2e2;
    border-radius: 5px;
    overflow: hidden;
  }
}

.goTop {
  position: fixed;
  bottom: 10px;
  right: 5px;
  width: 40px;
}

//弹窗end
</style>