<template>
  <div class="conPage">
    <NProgress v-if="loadingflag"/>
    <!--  头部-->
    <div class="topBox">
      <div class="leftBox">
        <div class="avatar">
          <van-uploader :after-read="onRead">
            <img class="img"
                 :src="userInfo.img"
                 alt="">
          </van-uploader>
        </div>
        <div>
          <div class="phone">{{ userInfo.phone }}</div>
        </div>
      </div>
      <div class="settingBox">
        <div class="setting" @click="toStting('/setting')">
          <img class="img" src="@/assets/mine/sz.png" alt="">
        </div>
        <div class="setting" @click="scanQRCode">
          <img class="img" src="@/assets/mine/sys.png" alt="">
        </div>
      </div>
    </div>
    <div class="centerBox" >
      <div class="freeaBox"   @click="toFreea">
        <div class="ImgBox">
          <img class="img" src="../../assets/mine/flk.png" alt="">
        </div>
        <div class="leftBox">
          <div class="freeaText">查看我的福利卡</div>
        </div>
      </div>
      <div class="orderInfo">
        <!--      我的订单-->
        <div class="coupons orderMax">
          <!--        状态-->
          <div class="obligationMax">
            <div class="obligationBox" v-for="item in orderIcon" :key="item.id" @click="toOrder(item.id)">
              <div class="obligationImg">
                <img class="img" :src="item.icon" alt="">
                <div class="point" v-if="item.type&&item.id==1"></div>
                <div class="num" v-if="item.type&&item.id==2">{{ item.type }}</div>
                <div class="line" v-if="item.id==1">
                  <img class="img" src="../../assets/mine/line.png" alt="">
                </div>
              </div>
              <div class="obligationText">{{ item.text }}</div>
            </div>
          </div>
        </div>
        <!--  功能-->
        <div class="coupons orderMax" style="margin-top: 10px;border-radius: 8px">
          <div class="obligationMax" style="padding: 0px 24px 0px 20px ;">
            <div class="obligationBox" style="width: 39px;" v-for="item in mineFun" :key="item.id"
                 @click="toFun(item.id,item.path)">
              <div class="obligationImg" style="width: 30px;height: 30px;">
                <img class="img" :src="item.icon" alt="">
              </div>
              <div class="obligationText" style="white-space: nowrap;" :style="{marginLeft:item.id==4?'0px':'-5px'}">
                {{ item.text }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
<!--    <NavigationTab :active="3"></NavigationTab>-->
  </div>
</template>

<script>
import NavigationTab from "@/components/NavigationTab.vue";
import {bindingcard, changeAvatar, getUserInfo, qrcodeBinging} from "@/api/mine";
import wx from "weixin-js-sdk";

export default {
  name: "PersonCenter",
  components: {NavigationTab},
  data() {
    return {
      orderIcon: [
        {
          id: 1,
          icon: require("../../assets/mine/dfk.png"),
          text: "全部订单"
        },
        {
          id: 2,
          icon: require("../../assets/mine/dsh.png"),
          text: "待使用"
        },
        {
          id: 3,
          icon: require("../../assets/mine/ywc.png"),
          text: "已完成"
        },
        {
          id: 4,
          icon: require("../../assets/mine/tk.png"),
          text: "退款售后"
        },
      ],
      mineFun: [
        {
          id: 1,
          icon: require("../../assets/mine/dz.png"),
          text: "地址管理",
          path: "/cakeAddressList"
        },
        {
          id: 2,
          icon: require("../../assets/mine/zfmm.png"),
          text: "支付密码"
        },
        {
          id: 3,
          icon: require("../../assets/mine/syzn.png"),
          text: "使用指南",
        },
        {
          id: 4,
          icon: require("../../assets/mine/kf.png"),
          text: "客服"
        },
      ],
      userInfo: {},
      token: "",
      kefu: "",
      info: {},
      loadingflag:true
    }
  },
  methods: {
    scanQRCode() {
      let _that = this;
      wx.ready(function () {
        wx.checkJsApi({
          jsApiList: ['scanQRCode'],
          success: function (res) {
            if (res.checkResult.scanQRCode === true) {
              wx.scanQRCode({ // 微信扫一扫接口
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                  let url = res.resultStr // 当needResult 为 1 时，扫码返回的结果
                  let token = localStorage.getItem("token")
                  qrcodeBinging({
                    token,
                    content: url
                  }).then(res => {
                    if (res.code == 200) {
                      setTimeout(() => {
                        _that.$router.go(-1)
                        _that.$toast(res.data)
                      }, 1000)
                    } else {
                      _that.$toast(res.msg)
                    }
                  })
                }
              })
            } else {
              _that.$toast("抱歉，当前客户端版本不支持扫一扫");
            }
          },
          fail: function (res) { // 检测getNetworkType该功能失败时处理
            _that.$toast('fail' + res)
          }
        });
      });
      //错误信息
      wx.error(function (res) {
        _that.$toast("出错了：" + res.errMsg);
      });
    },
    getSign() {
      // this.$toast({message:purl,duration:0})
      //请求后端，获取微信签名信息
      let configData = {
        debug: false,
        appId: this.info.appid, // 必填，公众号的唯一标识
        timestamp: "" + this.info.time, // 必填，生成签名的时间戳
        nonceStr: this.info.nonceStr, // 必填，生成签名的随机串
        signature: this.info.signature,// 必填，签名
        jsApiList: ['scanQRCode', 'checkJsApi']
      }
      wx.config(configData);
      wx.ready(function (res) {

      });
      wx.error(function (res) {
      });
    },
    getbindingcard() {
      let purl = /(Android)/i.test(navigator.userAgent) ? location.href.split('#')[0] : window.localStorage.getItem('scanUrl');
      bindingcard({
        url: purl
      }).then(res => {
        this.info = res.data
        this.getSign()
      })
    },
    // 上传头像
    onRead(file) {
      var formdata = new FormData(); //new一个FormData
      formdata.append('img', file.file)  //把上传的图片信息放入，传给后台
      formdata.append('token', this.token)  //把上传的图片信息放入，传给后台
      formdata.append('channel_no', "12358")  //把上传的图片信息放入，传给后台
      changeAvatar(formdata).then(res => {
        if (res.code == 200) {
          this.userInfo.img = res.data
          this.$toast("修改头像成功")
        }
      })
    },
    toOrder(id) {
      if (id == 4) {
        window.location.href = this.kefu
      } else {
        this.$router.push({path: "/order", query: {tabIndex: id}})
      }

    },
    //   去福利卡
    toFreea() {
        window.location.href = this.$store.state.base + "/securitycards?change=2&token="+localStorage.getItem("token")+"&cityName="+sessionStorage.getItem("cityName")
    },
    //   去支付密码
    toFun(id, path) {
      if (id == 2) {
        window.location.href = this.$store.state.base + "/payPassword" + "?token=" + localStorage.getItem("token")
      } else if (id == 3) {
        window.location.href = this.$store.state.Shopbase+"/userGuide"
      }else if (id == 4) {
        window.location.href = this.kefu
      } else {
        this.$router.push(path)
      }
    },
    toStting(path) {
      this.$router.push(path)
    },
    getUserInfo() {
      getUserInfo().then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.userInfo = res.data
        }
      })
    },
  },
  created() {
    this.token = localStorage.getItem("token")
    this.getUserInfo()
    this.kefu = localStorage.getItem("kefu")
    // this.$store.commit("changeFilm", this.$route.query.film)
    // console.log(this.$store.state.film)
    this.getbindingcard()
  }
}
</script>

<style scoped lang="less">
.conPage {
  background-color: #F6F6F6;
  min-height: calc(100vh - 50px);
  box-sizing: border-box;
  overflow: hidden;
}

.topBox {
  background-image: url("@/assets/mine/dback.png");
  width: 100%;
  height: 200px;
  background-size: cover;
  box-sizing: border-box;
  padding: 8px 20px 0px 30px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
  }

  .leftBox {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 14px;

    .phone {
      font-weight: bold;
      margin-top: 5px;
      padding-left: 7px;
    }
  }

  .settingBox {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 5px;

    .setting {
      width: 24px;
    }
  }
}

.centerBox {
  padding: 0px 10px;
  margin-top: -95px;

  .ImgBox {
    width: 52px;
  }

  .freeaBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-image: url("@/assets/mine/xback.png");
    width: 100%;
    height: 92px;
    background-size: cover;
    box-sizing: border-box;
    padding: 0px 23px;

    .vipIcon {
      width: 32px;
    }

    .leftBox {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #fff;
      //font-weight: bold;
    }

    .freeaText {
      margin-top: -5px;
    }
  }

  .coupons {
    background-color: white;
    padding: 15px;
    border-radius: 8px;
  }

  //我的订单
  .orderMax {

    .arrow {
      height: 11px;
      padding-left: 3px;
    }

    .obligationBox {
      text-align: center;
    }

    .obligationImg {
      width: 36px;
      height: 36px;
      margin: auto;
      position: relative;
    }

    .obligationText {
      margin-top: 3px;
      font-size: 13px;
      font-weight: bold;
    }

    .point {
      position: absolute;
      width: 8px;
      height: 8px;
      background-color: #ED3036;
      border-radius: 50%;
      top: 0px;
      right: 0px;
    }

    .num {
      position: absolute;
      min-width: 13px;
      height: 10px;
      border-radius: 50%;
      top: -10px;
      left: 17px;
      border: 1px solid #ed3036;
      color: #ed3036;
      font-size: 10px;
      padding: 1px 1px 3px;
    }
  }

  .obligationMax {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 20px 0px;
  }
}
.orderInfo{
  background-image: url("../../assets/mine/cback.png");
  background-size: 100% auto;
  padding: 50px 15px;
  box-sizing: border-box;
  width: calc(100% + 28px);
  margin-left: -14px;
  margin-top: -47px;
  position: relative;
  z-index: 2;
}
.line{
  position: absolute;
  right: -18px;
  top: 3px;
  width: 8px;
}
</style>