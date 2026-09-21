<template>
  <div class="location">
    <NProgress v-if="loadingflag" />

    <div class="topBox">
      <div class="pTop">
        <div class="icon" @click="returnBack">
          <van-icon size="23px" name="arrow-left" />
        </div>
        <div class="searchValue">
          <van-search background="#fff0" placeholder="搜索你喜欢的东西" @input="search" v-model="searchValue" />
        </div>
      </div>
      <!--      icon-->
      <div style="position: relative">
        <div class="iconBox" ref="topScroll">
          <div class="sortTop sortCenter" :style="'width:' + sortList.length * 70 + 'px;'">
            <div class="sortItem" ref="topItem" @click="changeSelect(item.id, index, item.flag)"
              v-for="(item, index) in sortList" :key="item.id">
              <div class="iconImg" :style="{ transform: selectId == item.id ? 'scale(1.3)' : '' }">
                <img class="img" :src="item.tbimg" alt="">
              </div>
              <div class="sortText" :class="{ sortText1: selectId == item.id }">{{ item.name }}</div>
            </div>
          </div>
        </div>
        <div class="allBox" @click="bigcategory = true">
          <div>全</div>
          <div>部</div>
          <div class="allIcon">
            <img class="img" src="../../assets/tubiao/all.png" alt="">
          </div>
        </div>
      </div>
    </div>
    <!--    筛选-->
    <div class="centerBox">
      <div style="position: relative;padding-right: 24px" v-if="classList.length > 1">
        <div class="iconBox" ref="centerScroll">
          <div class="sortTop sortCenter" :style="'width:' + classList.length * 60 + 'px;'">
            <div class="sortItem" @click="changeClassSelect(item.id, index)" v-for="(item, index) in classList"
              :key="item.id">
              <div class="sortText" :class="{ sortText1: ClassSelect == item.id }">{{ item.name }}</div>
            </div>
          </div>
        </div>
        <div class="allBox" @click="category = true" v-if="classList.length > 0">
          <van-icon size="15px" name="arrow-down" />
        </div>
      </div>
      <!--      排序-->
      <div class="sort">
        <div class="comprehensive" @click="showSynthesis = !showSynthesis">
          <div>综合</div>
          <div class="down">
            <van-icon v-if="!showSynthesis" size="12px" name="arrow-down" />
            <van-icon v-else size="12px" name="arrow-up
" />
          </div>
        </div>
        <div class="comprehensive" style="color: #464646" @click="changePrice">
          <div>价格</div>
          <div class="down">
            <img class="img" src="../../assets/tubiao/px.png" alt="">
          </div>
        </div>
        <div class="comprehensive" style="color: #464646" @click="showAll = true" v-if="classList.length > 0">
          <div>筛选</div>
          <div class="down" style="width: 15px;">
            <img class="img" src="../../assets/tubiao/sx.png" alt="">
          </div>
        </div>
      </div>
      <!--            列表-->
      <div class="listBox" @scroll="handleScroll" ref="listBox">
        <!--        <div v-for="(item,index) in shopList" :key="item.id" class="shopList">-->
        <!--          <ShopList :pinpai="item.pinpai" :listItem="item" :flag="flag"></ShopList>-->
        <NewShopList :flag="flag" :shopList="shopList" v-if="shopList.length > 0" @input="input"></NewShopList>
        <!--        </div>-->
        <!--        加载-->
        <!-- /        <loading v-if="isLoading"></loading> -->
        <!-- <NProgress /> -->
       

          <div class="box" v-if="loadingflag1">
            <img src="../../assets/logotitle.png" alt="">
            <p><span style="display: inline-block;width: 40px;">加载中</span> </p>
          </div>
        

      </div>
    </div>
    <!--全部筛选-->
    <div class="popupBox">
      <van-popup v-model="showAll" position="bottom">
        <div class="popup">
          <div class="close" @click="showAll = false">
            <van-icon size="18px" name="cross" />
          </div>
          <div class="title">全部筛选</div>
          <div class="listItem">
            <div class="titleItem">价格筛选</div>
            <div class="priceBox">
              <div class="inpBox">
                <input class="inp" type="number" v-model="bottomPrice" placeholder="最低价">
              </div>
              <div>-</div>
              <div class="inpBox">
                <input class="inp" type="number" v-model="highestPrice" placeholder="最高价">
              </div>
            </div>
          </div>
          <!--          按钮-->
          <div class="footer">
            <div class="resetting" @click="resetting">重置</div>
            <div class="resetting complete" @click="complete">完成</div>
          </div>
        </div>
      </van-popup>
    </div>
    <!--    综合-->
    <div class="popupBox1">
      <van-popup v-model="showSynthesis" position="top">
        <div class="popup">
          <div class="synthesisItem" v-for="item in synthesisList" :key="item.id" @click="changeSynthesis(item.id)">
            <div :class="{ addRegion: synthesisId == item.id }">{{ item.text }}</div>
            <div v-if="synthesisId == item.id">
              <van-icon color="#4681B4" name="success" size="16px" />
            </div>
          </div>
        </div>
      </van-popup>
    </div>
    <!--    小类别-->
    <div class="popupBox2">
      <van-popup v-model="category" position="top">
        <div class="popup">
          <div class="brandBox" style="margin: 0;">
            <div class="sortText sortcontent" :class="{ sortText1: ClassSelect == item.id }"
              v-for="(item, index) in classList" :key="item.id" @click="changeClassSelect(item.id, index)">
              <div>{{ item.name }}</div>
            </div>
          </div>
          <div>
            <div class="retract" @click="category = false">
              <div>收起</div>
              <div style="padding-top: 3px">
                <van-icon name="arrow-up" />
              </div>
            </div>
          </div>
        </div>
      </van-popup>
    </div>
    <!--    大类别-->
    <div class="popupBox3">
      <van-popup v-model="bigcategory" position="top">
        <div class="popup">
          <div class="sortTop sortCenter">
            <div class="sortItem" @click="changeSelect(item.id, index, item.flag)" v-for="(item, index) in sortList"
              :key="item.id">
              <div class="iconImg" :style="{ transform: selectId == item.id ? 'scale(1.3)' : '' }">
                <img class="img" :src="item.tbimg" alt="">
              </div>
              <div class="sortText" :class="{ sortText1: selectId == item.id }">{{ item.name }}</div>
            </div>
          </div>
          <div>
            <div class="retract" @click="bigcategory = false">
              <div>收起</div>
              <div style="padding-top: 3px">
                <van-icon name="arrow-up" />
              </div>
            </div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import ShopList from "@/components/ShopList.vue";
import { getBrandList } from "@/api/classify";
import NewShopList from "@/components/NewShopList.vue";
import Swiper from "swiper";
import { getBookClassify, getBookClassifyList } from "@/api";

export default {
  name: "ProductList",
  components: { NewShopList, ShopList },
  data() {
    return {
      searchValue: "",
      bottomPrice: "",
      highestPrice: "",
      sortList: [],
      selectId: null,
      ClassSelect: null,
      showAll: false,
      showSynthesis: false,
      category: false,
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
      classList: [{
        id: "",
        name: "全部",
        pid: "1",
      }],
      brandList: [],
      brandId: "",
      //   商品
      pageno: 1,
      shopList: [],
      flag: 0,
      isMinPrice: "",
      index: null,
      isScroll: false,
      isSearch: false,
      index2: 0,
      index1: 0,
      isLoading: false,
      loadingflag1: false,
      loadingflag: true,
      timer: null,
      timer2: null,
      timer3: null,
      swiper: null
    }
  },
  methods: {
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
              // this.changeBanner(this.swiper.activeIndex)
            }
            // 在这里可以获取当前位于中间的图片索引
          }
        },
        // slidesPerView: 4,
        paginationClickable: true,
        // spaceBetween: 10,
        slideToClickedSlide: true, // 点击的slide会居中
        slidesPerView: 6,
        sapceBetween: 30,
        centeredSlides: true,
        initialSlide: this.index1,//默认第二个
        // loop:true,
        // speed : 100, //速度
        // autoplay : {
        //   delay : 5000, //自动切换的时间间隔，单位ms
        //   disableOnInteraction : true //用户操作swiper之后，是否禁止autoplay
        // },
      });
    },
    scrollToCenter(index) {
      const box = this.$refs.topItem[index];
      const boxRect = box.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      const scrollX = boxRect.left - (screenWidth / index);
      // console.log(boxRect.left)
      // console.log(screenWidth)
      // console.log(scrollX)
      this.$refs.topScroll.scrollLeft = scrollX
    },
    input() {

    },
    returnBack() {
      this.$router.go(-1)
    },
    changeBrand(id) {
      this.brandId = id
    },
    resetting() {
      // 重置
      this.brandId = ''
      this.bottomPrice = null
      this.highestPrice = null
    },
    complete() {
      this.shopList = []
      this.isSearch = false
      this.isScroll = false
      this.pageno = 1
      // 完成
      // pageno = this.pageno,
      //     brand_id = null,
      //     type = 1,
      //     minprice = "",
      //     maxprice = "",
      //     keyword = "",
      if (this.isMinPrice == "") {
        this.getBrandShop(1, this.synthesisId, this.bottomPrice, this.highestPrice, this.searchValue)
      } else {
        this.getBrandShop(1, this.isMinPrice, this.bottomPrice, this.highestPrice, this.searchValue)
      }

      this.showAll = false
    },
    search() {
      this.isSearch = true
      this.shopList = []
      this.isScroll = false
      this.pageno = 1
      // 等待的时间默认200ms
      // 每次事件被触发时，都清除之前的旧定时器
      if (this.timer) {
        clearTimeout(this.timer);
      }
      // 函数延迟执行
      this.timer = setTimeout(() => {
        if (this.isMinPrice == "") {
          this.getBrandShop(1, this.synthesisId, this.bottomPrice, this.highestPrice, this.searchValue)
        } else {
          this.getBrandShop(1, this.isMinPrice, this.bottomPrice, this.highestPrice, this.searchValue)
        }
        this.timer = undefined;
      }, 1000);
    },
    changePrice() {
      this.shopList = []
      this.isSearch = false
      this.isScroll = false
      this.pageno = 1
      this.synthesisId = 1
      if (this.isMinPrice == "" || this.isMinPrice == 5) {
        this.isMinPrice = 4
      } else {
        this.isMinPrice = 5
      }
      this.getBrandShop(1, this.isMinPrice, this.bottomPrice, this.highestPrice, this.searchValue)
    },
    changeSelect(id, index, flag) {
      // this.index1 = index
      // this.getSwiper()
      // console.log(this.swiper)
      this.searchValue = ""
      // this.scrollToCenter(index)
      this.shopList = []
      this.classList = [{
        id: "",
        name: "全部",
        pid: "1",
      }]
      this.flag = ""
      this.isSearch = false
      this.pageno = 1
      this.isScroll = false
      // this.$refs.centerScroll.scrollLeft = 0
      this.selectId = id
      // 清除之前的定时器
      this.shopList = []
      if (this.timer2) {
        clearTimeout(this.timer2);
      }
      // 函数延迟执行
      this.timer2 = setTimeout(() => {
        this.getClassify()
        this.timer2 = undefined;
      }, 500);
      if (this.selectId != this.$route.query.id) {
        this.$router.replace({ path: "/productList", query: { id: this.selectId, index: this.index, index1: index, } })
      }
      if (this.$refs.centerScroll) {
        this.$refs.centerScroll.scrollLeft = 0
      }
      this.flag = flag
      this.bigcategory = false
      // if (this.sortList[index].list) {
      //   this.classList = this.sortList[index].list
      //   this.sortList[index].list.forEach(item=>{
      //     this.classList.push(item)
      //   })
      //   this.ClassSelect = this.classList[0].id
      // }
      // console.log(this.classList)
      if ((index + 1) >= 5) {
        this.$refs.topScroll.scrollLeft = 43 * (index + 1)
      } else {
        this.$refs.topScroll.scrollLeft = 0
      }
    },
    changeClassSelect(id, index) {
      // this.searchValue = ""
      this.shopList = []
      this.isSearch = false
      this.pageno = 1
      this.isScroll = false
      this.ClassSelect = id
      this.index2 = index
      this.$router.replace({ path: "/productList", query: { id: this.selectId, index: this.index, index1: this.index1, index2: this.index2, classId: this.ClassSelect } })
      this.getBrandShop(1, this.isMinPrice, this.bottomPrice, this.highestPrice, this.searchValue)
      this.category = false
      if (this.classList.length > 10 && index >= 9) {
        this.$refs.centerScroll.scrollLeft = 60 * (index + 1)
        if (index >= 20) {
          this.$refs.centerScroll.scrollLeft = 65 * (index + 1)
        }
        return
      }
      if ((index + 1) > 4) {
        this.$refs.centerScroll.scrollLeft = 44 * (index + 1)
      } else {
        this.$refs.centerScroll.scrollLeft = 0
      }
    },
    changeSynthesis(id) {
      this.shopList = []
      this.isSearch = false
      this.pageno = 1
      this.isScroll = false
      this.synthesisId = id
      this.isMinPrice = ""
      this.showSynthesis = false
      this.getBrandShop(1, this.synthesisId, this.bottomPrice, this.highestPrice, this.searchValue)
    },
    changeAll() {
      this.brandId = ''
    },
    // 获取分类列表
    getClassify() {
      getBookClassify().then(res => {
        this.loadingflag = false
        // console.log(res)
        if (res.code == 200) {
          this.sortList = res.data.product_class
          this.classList = [{
            id: "",
            name: "全部",
            pid: "1",
          }]
          this.flag = ""
          if (this.selectId) {
            // console.log(this.classList)
            if (this.sortList.filter(item => item.id == this.selectId)[0].list) {
              this.sortList.filter(item => item.id == this.selectId)[0].list.forEach(item => {
                this.classList.push(item)
              })
              // this.classList = this.sortList.filter(item => item.id == this.selectId)[0].list
              // console.log(this.classList)
            }
            if (this.$route.query.classId) {
              this.ClassSelect = this.$route.query.classId
            } else {
              this.ClassSelect = this.classList[0].id
            }
            this.flag = this.sortList.filter(item => item.id == this.selectId)[0].flag
          } else {
            this.flag = 1
          }
          this.searchValue = this.$route.query.keyword
          // console.log(this.flag)
          this.getBrandShop(1, this.synthesisId, this.bottomPrice, this.highestPrice, this.searchValue)

        }
      })
    },
    //滚动条事件
    handleScroll(e) {
      // console.log(e)
      // console.log(e.target.scrollTop+e.target.clientHeight,e.target.scrollHeight)
      // console.log((e.target.scrollTop+e.target.clientHeight)==e.target.scrollHeight)
      // let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      // let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      // let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      // if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
      //   this.onMost()
      // }
      // this.$toast({message:e.target.scrollHeight,duration:0})
      // this.$toast({message:Math.ceil(e.target.scrollTop+e.target.clientHeight),duration:0})
      if (Math.ceil(e.target.scrollTop + e.target.clientHeight) >= e.target.scrollHeight - 5) {
        this.onMost()
      }
    },
    onMost() {
      if (!this.isScroll) {
        // if (this.timer3) {
        //   clearTimeout(this.timer3);
        // }
        // 函数延迟执行
        // this.timer3 = setTimeout(() => {
        this.pageno++
        this.getBrandShop(this.pageno, this.isMinPrice, this.bottomPrice, this.highestPrice, this.searchValue)
        this.timer3 = undefined;
        // }, 1000);
      }
    },
    //   商品列表
    getBrandShop(pageno = this.pageno,
      type = 1,
      minprice = "",
      maxprice = "",
      keyword = "",) {
      // this.isLoading = true
      this.loadingflag1 = true
      let data = {
        pageno,//	否	num	页数 默认1
        pagesize: 10,//	否	num	每页多少条记录 默认10
        pid: this.selectId,//	否	num	大类ID
        zid: this.ClassSelect,//	否	num	小类ID
        type,//	否	num	默认1- 综合 2-销量 3-新品优先 4-价格低->高 5-价格高->低
        minprice,//	否	float	最低价
        maxprice,//	否	float	最高价
        keyword,//	否	string	关键词
      }
      getBookClassifyList(data).then(res => {
        // this.isLoading = false
        this.loadingflag1 = false

        if (res.code == 200) {
          if (res.data.books_list.length == 0) {
            this.isScroll = true
            return
          }
          if (this.isSearch) {
            this.shopList = []
          }
          res.data.books_list.forEach(item => {
            this.shopList.push(item)
          })
        }
      })
    },
  },
  created() {
    this.selectId = this.$route.query.id
    if (this.$route.query.classId) {
      this.ClassSelect = this.$route.query.classId
    }
    this.index = this.$route.query.index
    this.getClassify()
  },
  mounted() {
    setTimeout(() => {
      if (Number(this.$route.query.index1) > 4) {
        this.$refs.topScroll.scrollLeft = 44 * Number(this.$route.query.index1)
      } else {
        this.$refs.topScroll.scrollLeft = 0
      }
      this.index2 = this.$route.query.index2
      this.index1 = this.$route.query.index1
      this.getSwiper()
      var index2 = Number(this.$route.query.index2)
      if (this.classList.length > 10 && index2 >= 9) {
        this.$refs.centerScroll.scrollLeft = 60 * (index2 + 1)
        if (index2 >= 20) {
          this.$refs.centerScroll.scrollLeft = 65 * (index2 + 1)
        }
        return
      }
      if (this.$refs.centerScroll) {
        if ((index2 + 1) > 4) {
          this.$refs.centerScroll.scrollLeft = 44 * (index2 + 1)
        } else {
          this.$refs.centerScroll.scrollLeft = 0
        }
      }

    }, 300)

    // window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    // window.removeEventListener('scroll', this.handleScroll, false);
  },
}
</script>
<style scoped lang="less">
.location {
  background-color: #F6F6F6;
  min-height: 100vh;
  box-sizing: border-box;
}

.iconBox {
  overflow-x: auto;
  padding-right: 25px;
  padding-left: 10px;
}

.iconBox::-webkit-scrollbar {
  display: none
}

.sortTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.topBox {
  background-color: white;
  padding: 1px 10px 10px 0px;
  position: relative;
  z-index: 999;

  .searchValue {
    width: 95%;
  }

  .van-search {
    padding-bottom: 6px;
    padding-top: 6px;
    padding-right: 5px;
  }

  .van-search .van-cell {
    background-color: transparent;
  }

  .van-search__content {
    background-color: #F6F6F6;
    border-radius: 30px;
  }

  .pTop {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 10px;

    .icon {
      width: 5%;
      color: #717171;
      padding-top: 3px;
    }
  }


  .sortText {
    text-align: center;
    font-size: 12px;
    margin-top: 5px;
    color: #737373;
    padding: 2px 0px 3px;
  }

  .sortText1 {
    background-color: #40A5FB;
    color: white;
    border-radius: 30px;
  }

  .sortCenter {
    color: #212226;
    width: 100%;

    .sortItem {
      width: 20%;
    }
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
    width: 23px;
    padding: 14px 10px;
    box-shadow: -4px 1px 7px 1px #fff;
    box-sizing: border-box;

    .allIcon {
      width: 11px;
      margin: auto;
    }
  }
}

.iconImg {
  width: 36px;
  //width: 54%;
  margin: auto;
}

.centerBox {
  .sortCenter {
    gap: 10px;
    padding: 0px 10px;
  }

  .sortText {
    color: #646464;
    background-color: white;
    white-space: nowrap;
    padding: 3px 8px 4px;
    border-radius: 30px;
    font-size: 12px;
    min-width: 30px;
    text-align: center;
  }

  .sortText1 {
    color: #2A70AC;
    background-color: #E0EBFF;
  }

  .allBox {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    padding: 12px 5px 8px;
    box-sizing: border-box;
    background-color: #F0F0F0;
    box-shadow: -4px 1px 7px 1px #F0F0F0;
    color: #8E8E8E;
  }

  .comprehensive {
    display: flex;
    align-items: center;
    font-size: 15px;
    gap: 3px;
    color: #4681B4;
    font-weight: bold;
  }

  .down {
    padding-top: 3px;
    width: 12px;
  }

  .sort {
    display: flex;
    justify-content: space-around;
    margin-top: 12px;
    padding-bottom: 10px;
  }

  .listBox {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 2px;
    padding: 0px 10px 10px;
    gap: 8px 0px;
    height: calc(100vh - 216px);
    overflow: auto;

    .shopList {
      width: 49%;
    }
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
    margin-top: 80px;
    border: 1px solid #AEAEAE;
  }

  .resetting {
    color: #737373;
    padding: 10px;
    box-sizing: border-box;
    width: 50%;
    text-align: center;
  }

  .complete {
    color: white;
    background-image: linear-gradient(to right, #1F87E5, #0793FA);
  }
}

.brandBox {
  display: flex;
  flex-wrap: wrap;
  margin-top: 18px;
  gap: 10px;

  .sortText {
    color: #646464;
    background-color: #F6F6F6;
    white-space: nowrap;
    padding: 5px 15px 6px;
    border-radius: 30px;
    font-size: 13px;
    min-width: 21%;
    text-align: center;
  }

  .sortcontent {
    background-color: #fff;
    color: #4d4d4d;
  }

  .sortText1 {
    color: #2A70AC;
    background-color: #E0EBFF;
  }
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
  /deep/ .van-overlay {
    top: 200px;
  }

  /deep/ .van-popup--top {
    top: 200px;
  }

  .synthesisItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    font-size: 12px;
  }

  .addRegion {
    color: #4681B4;
  }
}

.popupBox2 {
  /deep/ .van-overlay {
    top: 129px;
  }

  /deep/ .van-popup--top {
    top: 129px;
    background-color: #F6F6F6;
    max-height: 250px;
  }

  .popup {
    padding: 15px 25px;
  }
}

.popupBox3 {
  /deep/ .van-overlay {
    top: 50px;
  }

  /deep/ .van-popup--top {
    top: 50px;
  }

  .popup {
    padding: 15px 25px;
  }

  .sortCenter {
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
    color: #737373;
    padding: 2px 0px 3px;
  }

  .sortText1 {
    background-color: #40A5FB;
    color: white;
    border-radius: 30px;
  }

  .sortItem {
    width: 25%;
  }
}

.listBox::-webkit-scrollbar {
  display: none
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
  //margin-left: -15%;
}

.swiper-slide-active,
.swiper-slide-duplicate-active {
  transform: scale(1);
}

.bannerImg {
  width: 60px;
  height: 60px;
  overflow: hidden;
  position: relative;
}



.box {
    width: 100%;
    height: 50vh;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
 
    
  // width: 100%;
  // height: 100vh;
  // display: flex;
  // justify-content: center;
  // align-content: center;
  // flex-direction: column;

  img {
    width: 50px;
    height: 50px;
    margin: 0 auto;
  }

  p {
    text-align: center;
    color: #999;
    font-size: 13px;
  }

}
</style>