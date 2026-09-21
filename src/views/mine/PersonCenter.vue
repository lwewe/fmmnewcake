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
      <!-- <div class="settingBox">
        <div class="setting" @click="toStting('/setting')">
          <img class="img" src="@/assets/mine/sz.png" alt="">
        </div>
       
      </div> -->
    </div>
    <div class="centerBox" >
      
       <div class="coupons1">
        <div class="couponsTitle" @click="scanQRCode">扫码绑定  
          <img class="img" src="@/assets/mine/sys.png"   alt="" style="width: 20px;margin-left: 6px;">
         </div>
        <div class="couponsBox">
          <div class="welfareBox" style="width: 44%;" @click="toFreea()">
            <div>
              <div class="welfareCard" style="white-space: nowrap">福利卡</div>
              <div class="none" style="text-align: center;white-space: nowrap;" v-if="userInfo.card_num != 0">{{
                userInfo.card_num }}张福利卡</div>
              <div class="none" style="text-align: center;white-space: nowrap;" v-else>暂无福利卡</div>
            </div>
            <div class="welfare" style="width: 39px;"  >
              <img class="img" src="../../assets/newico/flk.png" alt="">
            </div>
          </div>
          <div class="lines"></div>
          <a @click="toFun(6)">
            <div class="welfareBox">
              <div>
                <div class="welfareCard">在线客服</div>
                <div class="none">全年无休(9:00-21:00)</div>
              </div>
              <div class="welfare">
                <img class="img" src="../../assets/newico/kf.png" alt="">
              </div>
            </div>
          </a>

        </div>
      </div>
      <!-- <div class="freeaBox"   @click="toFreea">
        <div class="ImgBox">
          <img class="img" src="../../assets/mine/flk.png" alt="">
        </div>
        <div class="leftBox">
          <div class="freeaText">查看我的福利卡</div>
        </div>
      </div> -->
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
                <!-- <div class="line" v-if="item.id==1">
                  <img class="img" src="../../assets/mine/line.png" alt="">
                </div> -->
              </div>
              <div class="obligationText">{{ item.text }}</div>
            </div>
          </div>
        </div>
        <!--  功能-->
        <div class="coupons orderMax" style="margin-top: 10px;border-radius: 8px">
          <div class="obligationMax" style="padding: 0px;">
            <div class="obligationBox" style="width: 20%;" v-for="item in mineFun" :key="item.id"
                 @click="toFun(item.id,item.path)">
              <div class="obligationImg" style="width: 26px;height: 26px;">
                <img class="img" :src="item.icon" alt="">
              </div>
              <div class="obligationText" style="white-space: nowrap;" :style="{marginLeft:item.id==4?'0px':'0px'}">
                {{ item.text }}
              </div>
            </div>
          </div>
        </div>

         <!--  -->
         <div class="hotmember">美味推荐 <span></span> </div>
      <!--  -->
 <div   >

      <ShopList style="padding: 10px 0px !important;" :productList="productList" :indexs="1"></ShopList>
      <loading style="margin-top: 2px" v-if="isLoading"></loading>
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
import ShopList from "@/components/ShopList.vue";
import {  getCakeProductList } from "@/api";
export default {
  name: "PersonCenter",
  components: {NavigationTab,ShopList},
  data() {
    return {pageno:1,isLoading:false,productList: [],
      orderIcon: [
        {
          id: 1,
          icon: require("../../assets/newico/add/all.png"),
          text: "全部订单"
        },
        {
          id: 2,
          icon: require("../../assets/newico/add/dsy.png"),
          text: "待使用"
        },
        {
          id: 3,
          icon: require("../../assets/newico/add/dpj.png"),
          text: "已完成"
        },
        {
          id: 4,
          icon: require("../../assets/newico/add/sh.png"),
          text: "退款售后"
        },
      ],
      mineFun: [
        {
          id: 1,
          icon: require("../../assets/addnew/map.png"),
          text: "地址管理",
          path: "/cakeAddressList"
        },
        {
          id: 2,
          icon: require("../../assets/addnew/zfmm.png"),
          text: "支付密码"
        },
        {
          id: 3,
          icon: require("../../assets/addnew/zn.png"),
          text: "使用指南",
        },
        {
          id: 5,
          icon: require("../../assets/addnew/yj.png"),
          text: "意见反馈"
        },
        {
          id: 4,
          icon: require("../../assets/addnew/tc.png"),
          text: "退出登录"
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
    getCakeProduct(fid, pageno = this.pageno) {
      this.isLoading = true
      getCakeProductList({
        fid,
        pageno,
        pagesize: 10
      }).then(res => {
       console.log(res)
        this.isLoading = false
        if (res.code == 200) {
          if (res.data.product_list.length == 0) {
            // this.isScroll = true
            return
          }
          res.data.product_list.forEach(item => {
            this.productList.push(item)
          })
        }
      })
    },
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
      }else if (id == 5) {
        window.location.href = this.$store.state.base+"/feedback"
      }else if (id == 4) {
 this.$dialog.confirm({
        title: '退出',
        message: '是否退出登录？',
        confirmButtonColor: 'red'
      }).then(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("uid")
        this.$store.commit("settoken", "")
        this.$toast("退出登录成功")
        setTimeout(()=>{
          this.$router.replace({path: "/index"})
        },1000)
      }).catch(() => {
      })
        // window.location.href = this.kefu

      }
      else if (id == 6) {
  
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
    this.cityId = sessionStorage.getItem("cityId")
     
    this.token = localStorage.getItem("token")
    this.getUserInfo()
    this.kefu = localStorage.getItem("kefu")
    // this.$store.commit("changeFilm", this.$route.query.film)
    // console.log(this.$store.state.film)
    this.getbindingcard()
    this.getCakeProduct(12)
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
  // background: linear-gradient(to bottom,#FFB1B7,transparent);
  width: 100%;
  height: 200px;
  background-size: cover;
  box-sizing: border-box;
  padding: 8px 20px 0px 10px;
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
  margin-top: -106px;

  .ImgBox {
    width: 52px;
  }

  .freeaBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    color: #000;
    // background-image: url("@/assets/mine/xback.png");
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
      // color: #fff;
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
    padding: 0px 10px 0px;
  }
}
.orderInfo{
  // background-image: url("../../assets/mine/cback.png");
  background-size: 100% auto;
  padding: 50px 15px;
  box-sizing: border-box;
  width: calc(100% + 28px);
  margin-left: -14px;
  margin-top: -41px;
  position: relative;
  z-index: 2;
}
.line{
  position: absolute;
  right: -18px;
  top: 3px;
  width: 8px;
}


//我的卡券
.coupons1 {
  background-color: white;
  border-radius: 8px;
  margin-top: 8px;
  padding: 14px;

  .couponsTitle {display: flex;align-items: center;
    font-weight: bold;
    color: #383838;
  }

  .welfare {
    min-width: 43px;
    width: 43px;
  }

  .welfareBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    //width: 42%;
    padding: 4px 10px 0px 0;
    gap: 5px;
  }

  .welfareBox:last-child {
    display: flex;
    align-items: center;
    justify-content: space-between;
    //width: 42%;
    padding: 4px 0px 0px 10px;
    gap: 5px;
  }

  .none {
    font-size: 12px;
    color: #696969;
    margin-top: 5px;
  }

  .welfareCard {
    font-weight: bold;
    font-size: 15px;
    color: #343434;
    white-space: nowrap;
  }

  .couponsBox {
    display: flex;
    align-items: center;
    padding-top: 8px;
    //justify-content: space-between;
  }

  .lines {
    width: 1px;
    background-color: #f3f3f3;
    height: 45px;
  }
}
.hotmember {
  margin-top: 10px;
  background: #ffffff;
  border-radius: 8px;
  padding: 8px 15px;
  position: relative;
  font-weight: bold;
  color: #383838;

  span {
    position: absolute;
    bottom: 0;
    left: 33px;
    background-color: #ff384a;
    height: 4px;
    width: 30px;
    border-radius: 4px;
    display: inline-block;
  }
}
</style>