<template>
  <div class="pageCon">
    <!--    介绍-->
    <div class="info">
      <div class="priceBox">
        <div class="phone2Box">充值账号: <span>{{ phone }}</span></div>
        <div class="promptBox">
          <div class="prompt">
            <img class="img" src="../assets/tubiao/ts.png" alt="">
          </div>
          <div>充值商品不支持退换货</div>
        </div>
      </div>
    </div>
    <!--    手机号-->
    <div class="phoneBox">
      <div>{{ detaillist.title }}</div>
      <div class="priceBox">￥<span>{{ detaillist.price }}</span></div>
    </div>
    <!--    规格-->
    <div class="specifications" style="padding: 10px;">
      <!--      数量-->
      <div class="numberBox">
        <div class="sTitle">购买数量</div>
        <div class="numberOne">
                              1
<!--          <van-stepper @change="changeNumber" v-model="shopNumber"/>-->
        </div>
      </div>
    </div>
    <!--      支付方式-->
    <div style="margin-top: 10px">
      <Payment :result1="result" :cardList="cardList" @getResult="getResult"></Payment>
    </div>
    <div class="phoneBox" v-if="detaillist.fw_price>0">
      <div>服务费</div>
      <div style="color: #000000" class="priceBox">￥<span>{{ detaillist.fw_price }}</span></div>
    </div>
    <!--      支付-->
    <div class="btnBox">
      <van-button type="danger" class="btn" @click="toPay"><span class="btnPrice">￥{{ fullprice }}</span> 立即购买
      </van-button>
    </div>
    <div class="loadingBox" v-if="isLoading">
      <loading :loadingText="0"></loading>
    </div>
    <!--  支付密码-->
    <van-popup v-model="show" position="bottom">
      <div class="passwordBox">
        <div class="close" @click="show=false">
          <van-icon size="18px" name="cross"/>
        </div>
        <div class="title">请输入支付密码</div>
        <div class="flex">
          <div>付款方式</div>
          <div>福利卡</div>
        </div>
        <!-- 密码输入框 -->
        <van-password-input
            style="margin-top: 15px"
            :value="pass"
            @focus="showKeyboard = true"
        />
        <!-- 数字键盘 -->
        <van-number-keyboard
            :show="showKeyboard"
            @input="onInput"
            @delete="onDelete"
            @blur="showKeyboard = false"
        />
      </div>
    </van-popup>
  </div>
</template>
<script>
import Payment from "@/components/Payment.vue";
import {getCardList, getEnjoyCardList} from "@/api/brand";
import {getflkpay, KaquanPaySuccess, KaquanWxpay, toPay_date} from "@/api/brand";
import {getflkList} from "@/api/account";
// import {getUserInfo} from "@/api/locality/login";

export default {
  name: "BuyFreeca",
  props: ['detail', 'list', 'value', 'phone', 'selectId'],
  components: {
    Payment
  },
  data() {
    return {
      specificationsList: [],
      // selectId: 0,
      detaillist: [],
      result: [],
      cardList: [],
      checked: "",
      token: "",
      wxprice: 0,
      dkprice: 0,
      show: false,
      pass: "",
      showKeyboard: true,
      ka_ids: [],
      fullprice: 0,
      userInfo: {},
      openid: "",
      wxCode: "",
      imgBox: "",
      shopNumber: 1,
      isLoading: false,
      full: "",
      cake: ""
    }
  },
  methods: {
    changeNumber(e) {
      this.fullprice = ((Number(this.detaillist.price) + Number(this.detaillist.fw_price)) * Number(e)).toFixed(2)
      this.$emit("changeNum", e)
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
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
            if (res.err_msg === "get_brand_wcpay_request:ok") {
              that.$toast('支付成功！');
              KaquanPaySuccess({
                token: that.token,
                order_no
              }).then(res => {
                // that.$toast(res.msg)
                if (res.code == 200) {
                  setTimeout(() => {
                    that.$router.replace({path: "/order", query: {tabIndex: 1}})
                  }, 1000)
                }
              })
            } else if (res.err_msg === "get_brand_wcpay_request:fail") {
              that.$toast('支付失败！');
            }
          });
    },
    onInput(key) {
      this.pass = (this.pass + key).slice(0, 6);
      if (this.pass.length == 6) {
        this.show = false
        this.flkpay(this.pass)
        this.pass = ""
      }
    },
    onDelete() {
      this.pass = this.pass.slice(0, this.pass.length - 1);
    },
    getResult(result, checked) {
      this.result = result
      this.checked = checked
    },
    // 支付
    // 福利卡支付
    flkpay(pass) {
      getflkpay({
        token: this.token,
        ka_ids: this.ka_ids,
        pass: pass,
        id: this.selectId,
        number: this.value.toString(),
        phone: this.phone,
        position: this.full == 1 ? 3 : 1
      }).then(res => {
        this.isLoading = false
        // console.log(res.msg)  && res.data
        // this.$toast({message:res.msg,duration:0})
        this.$toast(res.msg)
        if (res.code == 200 && res.data) {
          this.getcard()
          setTimeout(() => {
            this.$router.replace({path: "/order", query: {tabIndex: 1}})
          }, 1000)
        }
      })
    },
    // 计算福利卡是否够支付
    isPay_date() {
      toPay_date({
        token: this.token,
        fulika: this.result.join(","),
        id: this.selectId,
        number: this.value,
        position: this.full == 1 ? 3 : 1
      }).then(res => {
        if (res.code == 200) {
          if (res.status != 3) {
            this.$toast(res.msg)
            return;
          }
          this.isLoading = true
          // 福利卡支付价格
          this.dkprice = res.data.dkprice
          this.wxprice = res.data.wxprice
          this.ka_ids = res.data.ka_ids
          if (this.wxprice != 0) {
            //   微信支付
            if (!this.isWeiXin()) {
              this.isLoading = false
              this.$toast("请使用微信打开进行支付")
              return
            }
            KaquanWxpay({
              token: this.token,
              ka_ids: res.data.ka_ids,
              openid: this.openid,
              id: this.selectId,
              number: this.value,
              phone: this.phone,
              position: this.full == 1 ? 3 :  1
            }).then(res => {
              if (res.code == 200) {
                this.onBridgeReady(res.data.jsApiParameters, res.data.order_no)
              }else {
                this.isLoading = false
                this.$toast(res.msg)
              }
            })
          } else {
            if (this.dkprice != 0) {
              this.show = true
              this.isLoading = false
            }
          }
        } else {
          this.$toast(res.msg)
          this.isLoading = false
        }
      })
    },
    toPay() {
      const regex = /[^\u4e00-\u9fa5a-zA-Z0-9]+/g; // 正则表达式匹配特殊字符
      this.phone = this.phone.replace(regex, '')
      if (this.result.length == 0 && this.checked == "") {
        this.$toast("请选择支付方式")
        return
      }
      if (this.result.length == 0 && this.checked != "") {

        //   微信支付
        if (!this.isWeiXin()) {
          this.isLoading = false
          this.$toast("请使用微信打开进行支付")
          return;
        }
        this.isLoading = true
        KaquanWxpay({
          token: this.token,
          ka_ids: [],
          openid: this.openid,
          id: this.selectId,
          number: this.value,
          phone: this.phone,
          position: this.full == 1 ? 3 : 1
        }).then(res => {
          if (res.code == 200) {
            if (res.status != 1) {
              this.$toast(res.msg)
              return;
            }
            this.onBridgeReady(res.data.jsApiParameters, res.data.order_no)
          }else {
            this.isLoading = false
            this.$toast(res.msg)
          }
        })
      } else {
        this.isPay_date()
      }
    },

    // 福利卡列表
    getcard() {
      this.result = []
      if (this.full == 1) { //Product/card
        getEnjoyCardList().then(res => {
          if (res.code == 200) {
            this.cardList = res.data.card_list
            if (this.cardList.length !== 0) {
              this.result.push(this.cardList[0].id)
            }
          }
        })
      } else if(!this.cake) {
        getflkList().then(res => {
          if (res.code == 200) {//Cart/card
            this.cardList = res.data.card_list

            if (this.cardList.length !== 0) {
              this.result.push(this.cardList[0].id)
            }
          }
        })
      } else if(this.cake){//Shop/card
        getflkList().then(res => {
          if (res.code == 200) {
            this.cardList = res.data.card_list
            if (this.cardList.length !== 0) {
              this.result.push(this.cardList[0].id)
            }
          }
        })
      }
      
      // else if(this.cake){//Shop/card
      //   getCardList().then(res => {
      //     if (res.code == 200) {
      //       this.cardList = res.data.card_list
      //       if (this.cardList.length !== 0) {
      //         this.result.push(this.cardList[0].id)
      //       }
      //     }
      //   })
      // }



    },
    // changeSpecifications(item, id) {
    //   this.selectId = id
    //   this.imgBox = item.img
    //   this.fullprice = item.price
    // },
    // getUserInfo() {
    //   getUserInfo({
    //     token: this.token
    //   }).then(res => {
    //     this.userInfo = res.data
    //   })
    // },
  },
  created() {
    this.token = localStorage.getItem("token")
    this.full = sessionStorage.getItem("full")
    this.cake = sessionStorage.getItem("cake")
    console.log( this.cake +' this.cake')
    // this.getUserInfo()
    this.getcard()
    if (localStorage.getItem("openid")) {
      this.openid = localStorage.getItem("openid")
    }
    this.shopNumber = this.value
    this.detaillist = this.detail
    this.fullprice = ((Number(this.detaillist.price) + Number(this.detaillist.fw_price)) * Number(this.shopNumber)).toFixed(2)
  },
  updated() {
    this.detaillist = this.detail
    this.fullprice = ((Number(this.detaillist.price) + Number(this.detaillist.fw_price)) * Number(this.shopNumber)).toFixed(2)
  },
  // watch: {
  //   shopList(item1, item2) {
  //     // item1为新值，item2为旧值
  //     this.leftList = []
  //     this.rightList = []
  //     this.prouctList = item1
  //     // console.log( this.prouctList,"22222222222222222222222222")
  //     this.getHeight()
  //   },
  //   prouctList(val) {
  //     // console.log(this.shopList,"this.shopList")
  //     if (this.shopList !== val) {
  //       this.$emit('input', val)
  //     }
  //   }
  // // }
  watch: {
    detail(item1, item2) {
      // item1为新值，item2为旧值
      console.log(item1)
      this.detaillist = item1
      console.log(this.detaillist)
      // console.log( this.prouctList,"22222222222222222222222222")
      this.fullprice = ((Number(this.detaillist.price)+Number(this.detaillist.fw_price))*Number(this.shopNumber)).toFixed(2)
    },
    detaillist(val) {
      if (this.detail !== val) {
        console.log(this.detail)
        this.$emit('changeNum', val)
      }
    }
  }
}
</script>
<style scoped lang="less">
.pageCon {
  padding: 10px 15px;
  height: 82vh;
  overflow-y: auto;
}

.info {
  display: flex;
  align-items: flex-end;
  gap: 10px;

  .imgBox {
    width: 88px;
    height: 88px;
    border-radius: 8px;
    overflow: hidden;
  }

  .priceBox {
    padding-bottom: 10px;

    .price {
      color: #ED343A;
      font-weight: bold;
    }

    .priceNum {
      font-size: 20px;
    }

    .promptBox {
      color: #FCA426;
      font-size: 10px;
      display: flex;
      align-items: center;
      margin-top: 2px;
      gap: 4px;

      .prompt {
        width: 15px;
        height: 15px;
      }
    }

  }
}

.phoneBox {
  background-color: white;
  margin-top: 10px;
  border-radius: 5px;
  padding: 15px;
  font-weight: bold;
  font-size: 15px;
  color: #404040;
  display: flex;
  justify-content: space-between;

  .priceBox {
    color: #CD4B49;
    font-size: 14px;
  }

  .priceBox span {
    font-size: 18px;
  }
}

.specifications {
  background-color: white;
  margin-top: 10px;
  border-radius: 5px;
  padding: 15px;

  .sTitle {
    font-weight: bold;
  }

  .specificationsList {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;

    .card {
      background-color: #F6F6F6;
      border-radius: 30px;
      width: 60px;
      height: 32px;
      line-height: 33px;
      text-align: center;
      font-size: 13px;
      font-weight: bold;
      color: #393100;
    }
  }

  .numberBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 6px;
  }
}

.btn {
  border-radius: 30px;
  width: 100%;
  height: 45px;
  line-height: 45px;
  background-color: #FFDD9D;
  border: none;

}

.btnPrice {
  color: #C83939 !important;
  font-size: 18px;
}

.btn span {
  color: #431C05;
  font-size: 16px;
  font-weight: bold;
}

.btnBox {
  width: 80%;
  margin: 15px auto;
  //position: absolute;
  //bottom: 10px;
  //left: 15%;
}

.van-popup--bottom {
  height: 50vh;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.passwordBox {
  padding: 15px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
}

.title {
  text-align: center;
  font-size: 13px;
}

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #9b9b9b;
  margin-top: 15px;
  padding: 0px 10px;
}

.phone2Box {
  padding: 7px 0px 3px;
  font-size: 17px;
}

.phone2Box span {
  font-size: 16px;
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

.numberOne {
  //font-size: 14px;
  //width: 32px;
  //height: 28px;
  //text-align: center;
  //line-height: 28px;
  //color: #676767;
}
</style>