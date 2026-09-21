<template>
  <div class="location">
    <NProgress v-if="loadingflag"/>
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>
    <!--    订单信息-->
    <!--    商品信息-->
    <div class="addressBox addressBox2"  v-if="coupons">
      <div class="itemTitle">商品信息</div>
      <div class="shopInfo">
        <!--                    {{key}}-->
        <div class="shopImg">
          <img style="border-radius: 5px;" class="img"
               :src="orderShow.brand.img"
               alt="">
        </div>
        <div class="nameBox">
          <div class="shopName">{{ orderShow.zhichong.title }}</div>
          <div class="all">
            <div class="price">￥{{ Number(orderShow.price).toFixed(2) }}</div>
            <div class="number">×{{ orderShow.number }}</div>
          </div>
        </div>
      </div>
    </div>
    <!--    订单信息-->
    <div class="addressBox addressBox2">
      <div class="itemTitle">订单总额</div>
      <div class="orderInfo">
        <div class="shopPrice">
          <div class="shopPriceText">订单总额</div>
          <div class="price price1">￥{{orderShow.total_fee}}</div>
        </div>
      </div>
    </div>
    <!--    订单信息-->
    <div class="addressBox addressBox2">
      <div class="itemTitle">订单信息</div>
      <div class="orderInfo">
        <div class="shopPrice">
          <div class="shopPriceText">订单状态</div>
<!--          "state": "2", //状态 1-失败 2-成功 3-已取消-->
          <div class="price" v-if="orderShow.state==1">已失败</div>
          <div class="price" v-if="orderShow.state==2">已成功</div>
          <div class="price" v-if="orderShow.state==3">已取消</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">订单号</div>
          <div class="price">{{ orderShow.order_no }}</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">下单时间</div>
          <div class="price">{{ timestampToTime2(orderShow.add_time) }}</div>
          <!--            <div class="price">{{ timestampToTime(order.add_time) }}</div>-->
        </div>
        <div class="shopPrice" v-if="orderShow.fuli">
          <div class="shopPriceText">支付方式</div>
          <div class="price" v-if="JSON.parse(orderShow.fuli).filter(item=>item.id=='wx').length==JSON.parse(orderShow.fuli).length">微信</div>
          <div class="price" v-if="JSON.parse(orderShow.fuli).filter(item=>item.id=='wx').length>0&&JSON.parse(orderShow.fuli).filter(item=>item.id=='wx').length!=JSON.parse(orderShow.fuli).length">微信和福利卡</div>
          <div class="price" v-if="JSON.parse(orderShow.fuli).filter(item=>item.id=='wx').length==0">福利卡</div>
        </div>
      </div>
    </div>
    <div class="service" @click="toKefu">
      <div>如有问题，请联系客服 全年无休(9:00-21:00)</div>
      <div class="serviceBox">
        <img class="img" src="../../assets/kf.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
import Payment from "@/components/Payment.vue";
import {getCakeCouponOrderdetail} from "@/api/mine";
import {getZcshow} from "@/api/brand";

export default {
  components: {Payment},
  data() {
    return {
      cardList: [],
      addrShow: {},
      coupons: {},
      orderShow: {},
      expressList: {},
      express: "",
      loadingflag: true,
      child: [],
      child_flag: "",
      isHeight: false,
    }
  },
  methods: {
    copyText(text) {
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      this.$toast("已复制到剪贴板")
    },
    openUrl(url) {
      window.location.href = url
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
    timestampToTime2(time) {
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
      return y + '-' + MM + '-' + d + " " + h + ":" + m + ":" + s
    },
    getDetail(id) {
      getZcshow({
        id
      }).then(res => {
        this.loadingflag = false
        // console.log(res)
        if (res.code == 200) {
          this.orderShow = res.data.show
        }
      })
    }
  },
  created() {
    this.getDetail(this.$route.query.id)
  }
}
</script>
<style scoped lang="less">
.location {
  background-color: #F0F0F0;
  padding: 10px;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 63px;
}


.addressBox {
  padding: 13px 10px;
  background-color: white;
  border-radius: 10px;

}

.addressBox2 {
  margin-top: 10px;
  padding: 13px 15px 15px;
  position: relative;
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

.orderInfo {
  .shopPrice {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
  }

  .shopPriceText {
    color: #828282;
    font-size: 14px;
    white-space: nowrap;
  }

  .price {
    font-size: 14px;
    color: #828282;
    word-break: break-all;
  }

  .price1 {
    color: #C93F3D;
  }
}

.shopInfo {
  margin-top: 15px;
  display: flex;
  align-items: flex-start;
  gap: 10px;

  .shopImg {
    width: 77px;
    height: 77px;
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

//客服
.service {
  background-color: white;
  color: #5b5a5a;
  font-size: 13px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  margin-top: 10px;

  .serviceBox {
    width: 18px;
    padding-top: 1px;
  }
}

.unfold {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 12px;
  gap: 5px;
  margin-top: 10px;
  position: absolute;
  bottom: 6px;
  right: 6px;
}

.unfoldHeight {
  height: 110px;
  overflow: hidden;
}

.shopPriceText2 {
  color: #1a1a1a !important;
  font-weight: bold;
}

.leftBoxx {
  display: flex;
  align-items: center;
  gap: 20px;
}

.copy {
  color: white !important;
  background-color: #FF7675;
  border-radius: 30px;
  width: 44px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 10px !important;
}

.shopPrice2 {
  border-bottom: 1px solid #F7F7F7;
  padding: 10px 0px;
}
</style>