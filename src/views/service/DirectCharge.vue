<template>
  <div class="location">
    <NProgress v-if="loadingflag" />
    <!--    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>-->
    <!--    头部-->
    <div class="centerBox">
      <div class="priceBox detailBox inputBox">
        <div class="inpBox">
          <input v-model="phone" class="inp" type="text" placeholder="请输入手机号">
        </div>
        <div class="clear" @click="phone = ''">
          <van-icon name="clear" />
        </div>
      </div>
      <div class="priceBox detailBox weeklyPassBox" v-if="list">
        <div class="weeklyPass" :class="{ weeklyPass1: selectId == item.id }" v-if="brandShow.id == 12"
          v-for="(item, index) in list" :key="item.id" @click="changeSelectId(item)">
          <img :src="item.img" alt="" style="width: 100%;height: 100%;border-radius: 10px;">
           
        </div>

        <!--  -->
        <div class="weeklyPass" v-if="brandShow.id != 12" :class="{ weeklyPass1: selectId == item.id }"
          @click="changeSelectId(item)" v-for="item in list" :key="item.id">
          <div class="Recommended" v-if="item.id == detail.id">推荐</div>
          <div class="weeklyPassText">{{ item.name }}</div>
          <div class="weeklyPassPrice">￥<span>{{ changePrice1(item.price) }}</span>.{{ changePrice2(item.price) }}</div>
        </div>
        <!--  -->


      </div>
      <!--    价格-->
      <div class="priceBox">
        <div class="price" style="font-size: 18px">￥<span class="priceNum">{{ detail.price }}</span></div>
        <div class="title">{{ detail.title }}</div>
      </div>
      <!--  规格-->
      <!--      <div class="priceBox specifications">-->
      <!--        <div>规格</div>-->
      <!--        <div>{{ detail.gueige }}</div>-->
      <!--      </div>-->
      <!--      详情-->
      <!-- {{ contentimg }} -->
      <!--    规格-->
      <div class="priceBox" style="padding: 10px;">
        <!--      数量-->
        <div class="numberBox">
          <div class="sTitle">购买数量</div>
          <div class="numberOne">
            <!--            <van-stepper @change="changeNumber" v-model="value"/>-->
            1
          </div>
        </div>
      </div>
      <div class="priceBox detailBox">
        <div class="imgBox" v-html="brandShow.content">
        </div>
      </div>
    </div>
    <!--    支付-->
    <div class="footer">

      <div class="btnBox">
        <van-button type="danger" class="btn" :class="{ btn1: isBuy != 0 && detail.type == 2 }" @click="toPay">
          <div v-if="isBuy == 0">
            <span class="price">￥{{ fullprice }} </span>&nbsp;
            <span class="priceText">立即购买</span>
          </div>
          <div v-else>
            {{
              isBuy == 1 ? '正在补货中...' : isBuy == 2 ? '您今日购卡次数已上限' : isBuy == 3 ? '您今日总购卡次数已上限' : '立即购买'
            }}
          </div>
        </van-button>
      </div>
    </div>
    <!--    支付弹窗-->
    <van-popup v-model="show" position="bottom">
      <div>
        <BuyFreeca @changeNum="changeNum" :selectId="selectId" :detail="detail" :list="list" :value="value"
          :phone="phone"></BuyFreeca>
        <div class="close" @click="show = false">
          <van-icon size="18px" name="cross" />
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
// 获取客服
// import {getLogo} from "@/api/locality/login"
import BuyFreeca from "@/components/BuyFreeca.vue";
import { cartDetailed } from "@/api/brand";
import { getLogo } from "@/api/brand";
// import {geCardDetail} from "@/api/member"
export default {
  components: {
    BuyFreeca
  },
  data() {
    return {
      show: false,
      id: 0,
      detail: {},
      brandShow: {},
      list: [],
      contentimg: "",
      loadingflag: true,
      kefu: "",
      value: 1,
      phone: "",
      selectId: 1,
      fullprice: 0,
      full: "",
      cake: "",
      isBuy: "",
      title: ""
    }
  },
  mounted() {
    this.id = this.$route.query.id
    this.getCardDetailList()
  },

  methods: {
    changeNum(e) {
      this.value = e
    },
    changeNumber(e) {
      this.fullprice = ((Number(this.detail.price)) * Number(e)).toFixed(2)
      this.value = e
    },
    changeSelectId(item) {
      this.getDetailed('', item.id)
      this.full = sessionStorage.getItem("full")
      this.selectId = item.id
      this.fullprice = ((Number(this.detail.price)) * Number(this.value)).toFixed(2)
    },
    // 价格处理
    changePrice1(price) {
      return price.toString().includes(".") ? price.toString().split('.')[0] : price
    },
    changePrice2(price) {
      return price.toString().includes(".") ? Number(price).toFixed(2).toString().split('.')[1] : "00"
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    toPay() {
      if (this.isBuy == 1 && this.detail.type == 2) {
        this.$toast("卡已售罄")
        return
      }
      if (this.isBuy == 2 && this.detail.type == 2) {
        this.$toast("您今日购卡次数已上限")
        return
      }
      if (this.isBuy == 3 && this.detail.type == 2) {
        this.$toast("您今日总购卡次数已上限")
        return
      }

      var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (!reg_tel.test(this.phone)) {
        this.$toast("请正确填写您的手机号码");
        return
      }
      if (localStorage.getItem("token")) {
        this.show = true
      } else {
        this.$toast("请先登录")
        setTimeout(() => {
          if (this.isWeiXin()) {
            this.$router.replace("/quickLogin")
          } else {
            this.$router.replace("/login")
          }
        }, 1000)
      }
    },
    getCardDetailList() {
      // geCardDetail({
      //   id: this.id
      // }).then(res => {
      //   console.log(res);
      //   this.detail = res.data.show
      //   this.list = res.data.list
      // })
    },
    getLoginInfo() {
      getLogo().then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.kefu = res.data.zxkf
        }
      })
    },
    getDetailed(ppid, id = '') {
      cartDetailed({
        ppid,
        id
      }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.detail = res.data.show
          this.title = res.data.show.title
          this.brandShow = res.data.brand_show
          this.isBuy = res.data.buy
          if (this.full == 1) {
            this.detail.fw_price = res.data.show.fw_price1
          } else if (this.cake) {
            this.detail.fw_price = res.data.show.fw_price
          } else if (!this.cake) {
            this.detail.fw_price = 0
          }
          this.list = res.data.list
          this.selectId = this.detail.id
          this.fullprice = ((Number(this.detail.price)) * Number(this.value)).toFixed(2)
        }
      })
    }
  },
  created() {
    this.full = sessionStorage.getItem("full")
    this.cake = sessionStorage.getItem("cake")
    this.getDetailed(this.$route.query.id)
  }
}
</script>


<style scoped lang="less">
.location {
  width: 100%;
  min-height: 100vh;
  background-color: #F0F0F0;
  box-sizing: border-box;
  padding: 10px;
}

.bnner {
  //height: 45vh;
}

.centerBox {
  padding: 0px 0px 65px;
  margin-top: -10px;

  //价格
  .priceBox {
    background-color: white;
    border-radius: 8px;
    padding: 10px 15px 10px;
    font-weight: bold;
    margin-top: 10px;

    .price {
      color: #ED343A;

      .priceNum {
        font-size: 18px;
      }
    }

    .title {
      margin-top: 5px;
      font-size: 15px;
      color: #222222;
    }

    .introduce {
      color: #A6A6A6;
      font-size: 12px;
      margin-top: 4px;
      font-weight: 500;
    }
  }

  //  规格
  .specifications {
    font-size: 15px;
    color: #424242;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 16px;
    padding-bottom: 15px;
  }

  //  详情
  .detailBox {
    .title {
      font-size: 15px;
      color: #424242;
    }

    .detail {
      padding: 13px 17px;

      .minTitle {
        font-size: 15px;
        color: #424242;
      }

      .info {
        font-size: 12px;
        color: #B0B0B0;
        font-weight: 500;
      }

      .info p {
        margin: 5px 0px;
        line-height: 18px;
      }
    }

    .detail2 {
      margin-top: -18px;
    }

    .welfareList {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .welfare {
        width: 25%;
        margin-top: 15px;

        .welfareImg {
          width: 42px;
          margin: auto;
        }

        .welfareText {
          text-align: center;
          padding-top: 4px;
        }
      }

    }

    .none {
      text-align: center;
      font-weight: 500;
      margin-top: 15px;
      font-size: 12px;
      color: #A4A4A4;
    }
  }
}

//支付
.footer {
  background-color: white;
  width: 100%;
  height: 55px;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 15px;
  box-sizing: border-box;

  .serviceBox {
    width: 21px;
    margin: auto;
  }

  .serviceText {
    color: #4B4B4B;
    font-size: 10px;
    text-align: center;
  }

  .btn {
    border-radius: 30px;
    width: 100%;
    height: 38px;
    font-size: 16px;
    line-height: 38px;
    background-color: #FFE1A8;
    color: #4B250A;
    border: none;
    font-weight: bold;
  }

  .btn1 {
    background-color: #d0d0d0;
  }

  .btnBox {
    width: 100%;
    margin: auto;

    .price {
      color: #CD4944;
      font-size: 18px;
    }

    .priceText {
      font-size: 15px;
    }
  }
}

.van-popup--bottom {
  height: 85vh;
  background-color: #F3F4F8 !important;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  z-index: 1500 !important;
}

/deep/ .van-overlay {
  z-index: 1499 !important;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
}

.imgBox {
  width: 100%;
}

/deep/ .imgBox img {
  width: 100%;
}

.inputBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.inpBox {
  width: 90%;

  .inp {
    border: none;
    font-size: 15px;
    width: 100%;
  }
}

.clear {
  color: #D9D9D9;
  font-size: 18px;
}

.weeklyPassBox {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 18px !important;
}

.weeklyPass {
  border: 1px solid #DFDFDF;
  border-radius: 10px;
  width: 30%;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;


  .weeklyPassText {
    text-align: center;
    font-size: 18px;
  }

  .weeklyPassPrice {
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #CB4644;
  }

  .weeklyPassPrice span {
    font-size: 18px;
  }
}

.weeklyPass1 {
  background-color: #FDE9C5;
  border: none;
}

.Recommended {
  position: absolute;
  color: #D0C2A1;
  background-color: #222222;
  font-size: 10px;
  padding: 1px 5px;
  width: 28px;
  text-align: center;
  border-radius: 30px;
  border-bottom-left-radius: 0px;
  border-top-left-radius: 15px;
  top: -10px;
  left: 0px;
}

.numberBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 6px;
}

.numberOne {
  //font-size: 14px;
  //width: 32px;
  //height: 28px;
  //text-align: center;
  //line-height: 28px;
  //color: #676767;
}
</style>