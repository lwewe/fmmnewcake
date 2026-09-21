<template>
  <div class="conPage">
    <ReturnBack :rcolor="'#34495B'" :bcolor="'rgb(255 255 255 / 41%)'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <!--  轮播图-->
    <!--    <div class="banner">-->
    <!--      <van-swipe :autoplay="3000" indicator-color="white" @change="onChange">-->
    <!--        <van-swipe-item class="bannerImg" v-for="item in bannerList" :key="item.id">-->
    <!--          <img class="img"-->
    <!--               :src=" item.img"-->
    <!--               alt="">-->
    <!--        </van-swipe-item>-->
    <!--      </van-swipe>-->
    <!--    </div>-->
    <div>
      <img class="img" :src="brand.banner" alt="">
    </div>
    <!--    介绍-->
    <div class="info">
      <div class="infoBox">
        <div class="againstBox">
          <div class="vector">
            <img class="img" src="../../assets/dangao/Vector.png" alt="">
          </div>
          <div class="price" v-if="coupons.price">
            <span>{{ changePrice1(coupons.price) }}</span>.{{ changePrice2(coupons.price) }}
          </div>
        </div>
        <div class="shopName">{{ coupons.title }}</div>
      </div>
      <!-- <div class="validity">有效期 至{{ timestampToTime(coupons.end_time) }}</div> -->
    </div>
    <!--    商品详情-->
    <div>
      <div class="shopDetailTextBox">
        <div class="line"></div>
        <div class="shopDetailText">商品详情</div>
        <div class="line"></div>
      </div>
      <div v-html="brand.content" class="brandcontent">

      </div>
    </div>
    <!--    兑换须知-->
    <div v-if="coupons.content">
      <div class="shopDetailTextBox">
        <div class="line"></div>
        <div class="shopDetailText">兑换须知</div>
        <div class="line"></div>
      </div>
      <div v-html="coupons.content" class="couponsContent">
      </div>
    </div>
    <div class="footer">
      <div class="kefuBox" @click="toKefu">
        <div class="kefu">
          <img class="img" src="../../assets/tubiao/kfz.png" alt="">
        </div>
        <div>客服</div>
      </div>
      <div class="btn" @click="toCouPonComfireOrder" :class="{btn2:isBuy!=0}">{{
          isBuy == 1 ? '正在补货中...' : isBuy == 2 ? '您今日购卡次数已上限' : isBuy == 3 ? '您今日总购卡次数已上限' : '立即兑换'
        }}
      </div>
    </div>
  </div>
</template>
<script>
import {getCouPonShopDetail} from "@/api/coupon";
import {getIsShowOder} from "@/api/service";

export default {
  name: "CouPonDetail",
  data() {
    return {
      onIndex: "",
      bannerList: [],
      brand: {},
      coupons: {},
      loadingflag: true,
      isBuy: "",
      signal: 0
    }
  },
  methods: {
    getIsShowOder() {
      getIsShowOder().then(res => {
        if (res.code == 200) {
          this.flag = res.data.flag
          this.signal = res.data.signal
        }
      })
    },
    toKefu() {
      window.location.href = localStorage.getItem("kefu")
    },
    timestampToTime(time) {
      // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var date = new Date(time * 1000)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d
    },
    // 价格处理
    changePrice1(price) {
      return price.toString().includes(".") ? price.toString().split('.')[0] : price
    },
    changePrice2(price) {
      return price.toString().includes(".") ? Number(price).toFixed(2).toString().split('.')[1] : "00"
    },
    onChange(index) {
      this.onIndex = index + 1
    },
    toCouPonComfireOrder() {
      if (this.isBuy == 1) {
        // 显示正在补货中  先判断 brand->id = (13,18,73,74,75)  在请求接口 signal等于1 在弹窗
        if (this.signal == 1 && (this.brand.id == 13 || this.brand.id == 18 || this.brand.id == 73 || this.brand.id == 74 || this.brand.id == 75)) {
          this.$dialog.confirm({
            title: '提示',
            message: '遇到电子券补充中需联系客服',
            confirmButtonColor: 'red'
          }).then(() => {
            this.toKefu()
          }).catch(() => {
          })
        } else {
          this.$toast("卡已售罄")
        }
        return
      }
      if (this.isBuy == 2) {
        this.$toast("您今日购卡次数已上限")
        return
      }
      if (this.isBuy == 3) {
        this.$toast("您今日总购卡次数已上限")
        return
      }
      this.$router.push({path: "/couPonConfirmOrder", query: {id: this.coupons.id}})
    },
    getCouPonShopDetail(id) {
      var token = ""
      if (localStorage.getItem("token")) {
        token = localStorage.getItem("token")
      } else {
        token = ""
      }
      getCouPonShopDetail({
        id, token
      }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.brand = res.data.brand
          this.coupons = res.data.coupons
          this.isBuy = res.data.buy
        } else if (res.code == -1) {
          localStorage.removeItem("token")
          this.getCouPonShopDetail(this.$route.query.id)
        }
      })
    }
  },
  created() {
    this.getIsShowOder()
    this.getCouPonShopDetail(this.$route.query.id)
  }
}
</script>

<style scoped lang="less">
.conPage {
  min-height: 100vh;
  background-color: #F0F0F0;
  padding-bottom: 65px;
}

.bannerImg {
  //height: 315px !important;
}

.info {
  background-color: white;
  padding: 15px;
}

.againstBox {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  padding-left: 10px;

  .vector {
    width: 15px;
  }

  .price {
    color: #CA4240;

  }

  .price span {
    font-size: 18px;

  }
}

.shopName {
  margin-top: 5px;
}

.infoBox {
  border-bottom: 1px solid #F9F9F9;
  padding-bottom: 11px;
}

.validity {
  padding: 12px 8px 7px;
  font-size: 14px;
}

.shopDetailTextBox {
  padding: 24px 0px 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  .line {
    border: 1px solid #E3E3E3;
    width: 50px;
  }

  .shopDetailText {
    font-size: 12px;
    color: #7B7B7B;
  }
}

.footer {
  position: fixed;
  width: 100%;
  background-color: #fff;
  left: 0px;
  bottom: 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  box-sizing: border-box;

  .kefuBox {
    width: 20%;
    text-align: center;
  }

  .kefu {
    width: 25px;
    margin: auto;
  }

  .btn {
    width: 80%;
    color: white;
    height: 40px;
    line-height: 40px;
    background-image: linear-gradient(to right, #F57372, #DD0E0C);
    text-align: center;
    border-radius: 30px;
  }

  .btn2 {
    background-image: linear-gradient(to right, #f573728a, #dd0e0c75);
  }
}

.brandcontent {
  /deep/ img {
    width: 100%;
  }
}

.couponsContent {
  background-color: white;
  padding: 10px 10px 10px 25px;
  font-size: 14px;

  /deep/ img {
    width: 100%;
  }

  /deep/ p {
    margin: 10px 0px;
    font-size: 14px !important;
  }

  /deep/ p span {
    font-size: 14px !important;
  }
}
</style>
