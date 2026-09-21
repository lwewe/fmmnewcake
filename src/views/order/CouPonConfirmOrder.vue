<template>
  <div class="location">
    <NProgress v-if="loadingflag"/>
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>
    <!--    商品信息-->
    <div class="addressBox">
      <div class="itemTitle">商品信息</div>
      <div class="shopInfo">
        <div class="shopImg">
          <img style="border-radius: 5px;" class="img"
               :src="coupons.img"
               alt="">
        </div>
        <div class="nameBox">
          <div class="shopName">{{ coupons.title }}</div>
          <!-- <div class="can">有效期：至{{ timestampToTime(coupons.end_time) }}</div> -->
          <div class="noReapt">不可退换</div>
          <div class="all">
            <div class="price">￥{{ coupons.price }}</div>
            <div class="number">
              <van-stepper :max="coupons.sj==1?10:coupons.num" v-model="valueNumber"/>
            </div>
          </div>
        </div>
      </div>
      <div class="totalBox">合计:
        <span class="priceIcon">￥</span>
        <span class="price2">{{ changePrice1(coupons.price * valueNumber) }}</span>
        <span class="priceNmber">.{{ changePrice2(coupons.price * valueNumber) }}</span>
      </div>
    </div>
    <!--    支付方式-->
    <div class="addressBox addressBox2 addressBox3">
      <Payment :result1="result" :cardList="cardList" @getResult="getResult"></Payment>
    </div>
    <!--    支付按钮-->
    <div class="footer">
      <div class="allNumber">共{{ valueNumber }}件</div>
      <div class="rightBox">
        <div>
          <div class="all">合计:
            <span class="price">{{ changePrice1(coupons.price * valueNumber) }}</span>
            <span class="priceNum">.{{ changePrice2(coupons.price * valueNumber) }}</span>
          </div>
        </div>
        <div class="toPay" @click="toPay">去支付</div>
      </div>
    </div>
    <div class="loadingBox" v-if="isLoading">
      <loading :loadingText="0"></loading>
    </div>
    <!--    支付密码-->
    <PayPassword :isShow="isShow" @input="input" @onInput="onInput"></PayPassword>
  </div>
</template>
<script>
import Payment from "@/components/Payment.vue";
import PayPassword from "@/components/PayPassword.vue";
import {
  changeNum,
  couponFlkpay,
  couponIsPayDate,
  couponPaySuccess,
  couponwxpay,
  getCouPonShopDetail
} from "@/api/coupon";
import {getflkList} from "@/api/account";

export default {
  name: "ConfirmOrder",
  components: {PayPassword, Payment},
  data() {
    return {
      cardList: [],
      orderList: [],
      addrShow: {},
      total: 0,
      result: [],
      // 支付方式选中
      checked: "",
      isShow: false,
      dataDetail: {},
      code: "",
      remark: "",
      dkprice: "",
      wxprice: "",
      ka_ids: [],
      pass: "",
      act: "",
      otherData: {},
      openid: "",
      loadingflag: true,
      isLoading: false,
      greeting: "",
      withChecked: false,
      HomeDelivery: true,
      type: "",
      valueNumber: "",
      brand: {},
      coupons: {}
    }
  },
  methods: {
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
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    // 支付
    // ///////微信登录
    onBridgeReady(params, order_no) {
      this.isLoading = false
      var that = this
      // "jsApiParameters": { //支付信息
      //   "appId": "wx05cc5223511e93c3",
      //       "timeStamp": "1710496158",
      //       "nonceStr": "qx0rpl2z6aqb492cvejftx5p4dowya4u",
      //       "package": "prepay_id=wx15174918865168a10f39f811aca3ea0000",
      //       "signType": "MD5",
      //       "paySign": "F0A17328ADD15AA9171CAEB082261A47"
      // }
      WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            "appId": params.appId,  //公众号名称，由商户传入
            "timeStamp": params.timeStamp, //支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            "nonceStr": params.nonceStr,  //支付签名随机串，不长于 32 位
            "package": params.package,//统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            "signType": params.signType,  //签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            "paySign": params.paySign, //支付签名
          },
          function (res) {
            that.isLoading = false; // +++ 重置 +++
            if (res.err_msg === "get_brand_wcpay_request:ok") {
              that.$toast('支付成功！');
                couponPaySuccess({
                  order_no
                }).then(res => {
                  // that.$toast(res.msg)
                  that.getCard()
                  if (res.code == 200) {
                    //   if (this.change == 0) {
                    //     setTimeout(() => {
                    //       that.$router.go(-1)
                    //     }, 1000)
                    //   } else {
                    setTimeout(() => {
                      that.$router.replace({path: "/order", query: {tabIndex: 1}})
                    }, 1000)
                    //   }
                  }
                })
            } else if (res.err_msg === "get_brand_wcpay_request:fail") {
              that.$toast('支付失败！');
            }
          });
    },
    input(e) {
      this.isShow = e
    },
    getResult(result, checked) {
      this.result = result
      this.checked = checked
    },
    judgmentPayDate() {
      let data = {
        fulika: this.result.join(","),
        shuliang: this.valueNumber,
        id: this.coupons.id
      }
      couponIsPayDate(data).then(res => {
        if (res.code == 200) {
          if(res.status !=3){
            this.$toast(res.msg)
            this.isLoading = false; // +++ 重置 +++
            return;
          }
          this.isLoading = true
          // 福利卡支付价格
          this.dkprice = res.data.dkprice
          this.wxprice = res.data.wxprice
          this.ka_ids = res.data.ka_ids
          this.code = res.data.code
          if (this.wxprice != 0) {
            //   微信支付
            // console.log("微信支付")
            // 去支付
            if (!this.isWeiXin()) {
              this.$toast("请使用微信打开进行支付")
              this.isLoading = false
              return;
            }
            this.shoptoWxpay()
          } else {
            if (this.dkprice != 0) {
              // console.log("卡支付")
              this.isShow = true
              this.isLoading = false
            }
          }
        } else {
          this.$toast(res.msg)
          this.isLoading = false
        }
      })
    },
    onInput(key) {
      this.pass = key
      if (this.pass.length == 6) {
        this.isShow = false
        this.flkpay(this.pass)
        this.pass = ""
      }
    },
    // 福利卡支付
    flkpay(pass) {
      let data = {
        ka_ids: this.ka_ids,
        pass,
        code: this.code,
        shuliang: this.valueNumber,
        id: this.coupons.id
      }
      couponFlkpay(data).then(res => {
        this.isLoading = false
        this.$toast(res.msg)
        if (res.code == 200&&res.data) {
          this.getCard()
          // if (this.change == 0) {
          //   setTimeout(() => {
          //     that.$router.go(-1)
          //   }, 1000)
          // } else {
          setTimeout(() => {
            this.$router.replace({path: "/order", query: {tabIndex: 1}})
          }, 1000)
          // }
        }
      })
    },
    // 支付
    toPay() {
      if (this.isLoading) {
    return;
  }
  this.isLoading = true;
      changeNum({
        shuliang: this.valueNumber,
        id: this.coupons.id
      }).then(res => {
        if (res.msg) {
          this.$toast(res.msg)
          this.isLoading = false; // +++ 重置 +++
          return
        }
        if (this.result.length == 0 && this.checked == "") {
          this.$toast("请选择支付方式")
          this.isLoading = false; // +++ 重置 +++
          return
        }

        // if (this.result.length == 0 && this.checked != "") {
        //   // 去支付
        //   // if (!this.isWeiXin()) {
        //   //   this.$toast("请使用微信打开进行支付")
        //   //   this.isLoading = false
        //   //   return;
        //   // }
        //   this.shoptoWxpay()
        // } else {
          this.judgmentPayDate()
        // }
      })
    },
    shoptoWxpay() {
      let data = {
        ka_ids: this.ka_ids,
        code: this.code,
        openid: this.openid,
        shuliang: this.valueNumber,
        id: this.coupons.id
      }
      // this.$toast({message:data.openid,duration:0})
      couponwxpay(data).then(res => {
        this.$toast(res.msg)
        if (res.code == 200) {
          this.onBridgeReady(res.data.jsApiParameters, res.data.order_no)
        }else {
          this.isLoading = false
          this.$toast(res.msg)
        }
      })
    },
    //支付end
    // 价格处理
    changePrice1(price) {
      return price.toString().includes(".") ? price.toString().split('.')[0] : price
    },
    changePrice2(price) {
      return price.toString().includes(",") ? price.toString().includes(".") ? price.toString().split('.')[1] : "00" : price.toString().includes(".") ? price.toString().split('.')[1] : "00"
    },
    changeAdress() {
      this.$router.push("/address?change=0")
    },
    //   卡列表
    getCard() {
      getflkList().then(res => {
        if (res.code == 200) {
          this.cardList = res.data.card_list

          if (this.cardList.length !== 0) {
            this.result.push(this.cardList[0].id)
          }
        }
      })
    },
    getCouPonShopDetail(id) {
      getCouPonShopDetail({
        id
      }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.brand = res.data.brand
          this.coupons = res.data.coupons
        }
      })
    },
  },
  created() {
    // this.dataDetail = JSON.parse(this.$route.query.data)
    // this.getCheckout(this.dataDetail)
    this.getCard()
    if (localStorage.getItem("openid")) {
      this.openid = localStorage.getItem("openid")
    }
    this.type = this.$route.query.type
    this.getCouPonShopDetail(this.$route.query.id)
  }
}
</script>
<style scoped lang="less">
.location {
  background-color: #F0F0F0;
  padding: 10px;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 66px;
}


.addressBox {
  padding: 13px 10px;
  background-color: white;
  border-radius: 10px;
}

.addressBox2 {
  margin-top: 10px;
  padding: 13px 15px 15px;
}

.addressBox3 {
  padding: 0px;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: white;
  width: 100%;
  box-sizing: border-box;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .rightBox {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .toPay {
    background-image: linear-gradient(to right, #F65958, #DD0A09);
    color: white;
    border-radius: 30px;
    text-align: center;
    width: 106px;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
  }

  .allNumber {
    font-size: 13px;
    color: #7a7979;
  }

  .all {
    font-weight: bold;
    font-size: 15px;

    .price {
      color: #CA4240;
      font-size: 20px;
    }

    .priceNum {
      color: #CA4240;
    }
  }
}

.itemTitle {
  font-weight: bold;
  font-size: 15px;
}

.textarea {
  background-color: #F6F6F6;
  height: 94px;
  border-radius: 3px;
  margin-top: 5px;
  padding: 10px;
  box-sizing: border-box;
}

.textarea textarea {
  border: none;
  background-color: #fff0;
  font-size: 13px;
}


.shopInfo {
  margin-top: 15px;
  display: flex;
  align-items: flex-start;
  gap: 10px;

  .shopImg {
    width: 80px;
    height: 80px;
  }

  .nameBox {
    width: 73%;
  }

  .shopName {
    font-size: 14px;
    font-weight: bold;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2; /* 显示两行 */
  }

  .can {
    margin-top: 7px;
    font-size: 13px;
    color: #979797;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 1; /* 显示两行 */
  }

  .all {
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
  }

  .price {
    color: #C63532;
    font-weight: bold;
    font-size: 15px;
  }

  .number {
    color: #989898;
  }
}

.loadingBox {
  width: 122px;
  position: fixed;
  top: calc(50% - 17px);
  left: calc(50% - 61px);
  background-color: rgba(50, 50, 51, .88);
  border-radius: 4px;
  height: 34px;
  line-height: 27px;
}

/deep/ .van-loading {
  color: white !important;
}

/deep/ .loadingText {
  color: #ffffff !important;
}


.noReapt {
  color: #D25D5B;
  border: 1px solid #D25D5B;
  display: inline-block;
  font-size: 10px;
  margin-top: 5px;
  border-radius: 2px;
  padding: 0px 5px 1px;
}

/deep/ .van-stepper__input {
  background-color: rgba(242, 243, 245, 0);
  font-size: 16px;
}

/deep/ .van-stepper__minus {
  background-color: rgba(242, 243, 245, 0);
  border-radius: 50%;
  border: 1px solid #b0b0b0;
  width: 25px;
  height: 25px;
}

/deep/ .van-stepper__plus {
  background-color: #CA403E;
  border-radius: 50%;
  width: 25px;
  height: 25px;
}

.van-stepper__minus::after, .van-stepper__minus::before, /deep/ .van-stepper__plus::after, /deep/ .van-stepper__plus::before {
  background-color: #ffffff;
}

.totalBox {
  border-top: 1px solid #F6F6F6;
  margin-top: 10px;
  padding-top: 10px;
  text-align: end;
  font-size: 14px;
}

.priceIcon {
  color: #CB4342;
  font-size: 13px;
}

.price2 {
  color: #CB4342;
  font-size: 16px;
}

.priceNmber {
  color: #CB4342;
  font-size: 13px;
}
</style>