<template>
  <div class="location">
    <!--    top-->
    <div class="topBack">
      <div class="shopTop">
        <div class="leftBox">
          <div class="shopIcon">
            <img class="img" src="../../assets/order/h1.png" alt="">
          </div>
          <!--          <div class="shopIcon">-->
          <!--            <img class="img" src="../../assets/order/lv2.png" alt="">-->
          <!--          </div>-->
          <div class="shopName">{{ orderShow.storeName }}</div>
          <div style="padding-top: 6px;margin-left: -2px">
            <van-icon name="arrow"/>
          </div>
        </div>
        <div class="leftBox">
          <!-- <div class="collectIcon" v-if="!isCollect" @click="changeCollect">
            <img class="img" src="../../assets/order/sch.png" alt="">
          </div>
          <div class="collectIcon" v-else @click="changeCollect">
            <img class="img" src="../../assets/order/scx.png" alt="">
          </div> -->
          <!-- <div class="collect">收藏</div> -->
        </div>
      </div>
      <!--      订单-->
      <div style="padding-bottom: 30px">
        <div class="shopCenter" v-for="(item,index) in orderShow.goods" :key="index">
          <div class="shopImg">
            <img class="img" style="border-radius: 5px;"
                 :src="item.itemImage"
                 alt="">
          </div>
          <div class="shopInfo">
            <div class="shopTitle">{{ item.itemName }}</div>
            <div class="dishes">
              <div v-for="(item2,index2) in item.items" :key="index2">{{ item2.count }} × {{ item2.name }}</div>
            </div>
            <div class="priceBox">
              <div>1份</div>
              <div class="price">￥<span>{{ item.sumprice }}</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="line">
        <div class="fullLeft"></div>
        <div class="fullLeft fullRight"></div>
      </div>
      <!--      合计-->
      <div class="full">
        合计
        <span>￥</span>
        <span class="fullMoney">{{ orderShow.zongji }}</span>
      </div>
    </div>
    <!--    v-if="orderShow.takeCode"-->
    <div class="orderCenter deliveryCode" v-if="orderShow.takeCode">
      <div class="oederInfoText" style="padding: 0px;border: none">取餐码</div>
      <div style="margin-right: -5px">
        <span style="padding-right: 5px" v-for="item in orderShow.takeCode" :key="item">{{ item }}</span>
      </div>
    </div>
    <!--    center-->
    <div class="orderCenter">
      <div class="oederInfoText">订单信息</div>
      <div>
        <div class="status" v-for="item in orderInfo" :key="item.id" :style="{border:item.id==7?'none':''}">
          <div class="statusText">{{ item.text }}</div>
          <div class="copyBox">
            <div class="address">{{ item.content }}</div>
            <div class="copy" v-if="item.id==5" @click="copyText">
              <img class="img" src="../../assets/order/cp.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--    footer-->
    <div class="button">
<!--      <div class="cancel">取消订单</div>-->
      <div class="cancel" @click="toKefu">在线客服</div>
      <div class="cancel toPay">再来一单</div>
      <!--      <div class="cancel toPay xing">再来一单</div>-->
    </div>
  </div>
</template>
<script>
// getOderlist
import {getOderdetail} from '@/api/service'

// import clipboard from 'clipboard'
export default {
  name: "OrderDetail",
  data() {
    return {
      orderInfo: [
        {
          id: 1,
          text: "订单状态",
          content: ""
        },
        {
          id: 2,
          text: "取餐门店",
          content: "麦当劳石家庄休门街大洋百货餐厅"
        },
        {
          id: 3,
          text: "取餐位置",
          content: "桥东区中山路158号滨江商务大厦一部分"
        },
        {
          id: 4,
          text: "就餐方式",
          content: "店内用餐"
        },
        {
          id: 5,
          text: "订单号",
          content: "368224521155015522452455"
        },
        {
          id: 6,
          text: "下单时间",
          content: "2023-08-96 12:11:55"
        },
        {
          id: 7,
          text: "联系方式",
          content: "15232117293"
        },
      ],
      isCollect: false,
      orderShow: {},
      order:{}
    }
  },
  methods: {
    toKefu(){
      window.location.href = localStorage.getItem("kefu")
    },
    getorderdetail(id, type) {
      getOderdetail({
        token: localStorage.getItem("token"),
        type,
        id
      }).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.orderShow = res.data.order_show
          this.order = res.data.order
          // 订单状态：0、待付款 1、已付款待出餐 2、出餐中 3、出餐成功 4、确认收货（含部分退款）5、出餐失败退款 10 订单关闭
          this.orderInfo[0].content = this.orderShow.status==0?"待付款":this.orderShow.status==1?"已付款待出餐":this.orderShow.status==2?"出餐中":this.orderShow.status==3?"出餐成功":this.orderShow.status==4?"确认收货":this.orderShow.status==5?"出餐失败退款":this.orderShow.status==10?"订单关闭":''
          this.orderInfo[1].content = this.order.storeName
          this.orderInfo[2].content = this.order.storeAddress
          // 取餐方式 0-堂食 1-打包 2-外送
          this.orderInfo[3].content = this.orderShow.packFlag==0?"店内用餐":this.orderShow.packFlag==1?"打包":this.orderShow.packFlag==2?"外送":""
          this.orderInfo[4].content = this.orderShow.orderid
          this.orderInfo[5].content = this.timestampToTime(this.order.createdtime)
          this.orderInfo[6].content = this.orderShow.phone

        }
      })
    },
    changeCollect() {
      this.isCollect = !this.isCollect
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
      return y + '-' + MM + '-' + d + " " + h + ":" + m + ":" + s
    },
    copyText() {
      //   let text = this.orderInfo[4].content;
      //   clipboard.writeText(text);
      //   alert('已复制到剪贴板！');
    }
  },
  created() {
    this.getorderdetail(this.$route.query.id, this.$route.query.pf)
  }
}
</script>
<style scoped lang="less">
.location {
  background-color: #F0F0F0;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 12px;
  padding-bottom: 78px;
}

.topBack {
  background-color: white;
  border-radius: 8px;
  padding: 15px;

  .shopTop {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .leftBox {
      display: flex;
      align-items: center;
      gap: 5px;

      .shopName {
        font-size: 15px;
        font-weight: bold;
      }

      .shopIcon {
        width: 20px;
        padding-top: 2px;
      }
    }

    .collectIcon {
      width: 16px;
      padding-top: 1px;
    }

    .collect {
      font-size: 14px;
    }
  }

  .shopCenter {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-top: 18px;

    .shopImg {
      width: 75px;
    }

    .shopInfo {
      width: calc(100% - 85px);
    }

    .shopTitle {
      font-weight: bold;
    }

    .dishes {
      font-size: 10px;
      color: #8E8E8E;
      margin-top: 10px;
    }

    .dishes div {
      margin-top: 4px;
    }

    .priceBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: bold;
      font-size: 15px;
      margin-top: 15px;

      .price {
        font-size: 10px;
      }

      .price span {
        font-size: 18px;
      }
    }
  }

  .line {
    position: relative;
    border-top: 2px dotted #EEEEEE;
    width: 90%;
    margin: auto;
  }

  .full {
    text-align: end;
    padding: 20px 0px 0px;
    font-size: 14px;
    font-weight: bold;

    .fullMoney {
      font-size: 20px;
    }
  }

  .fullLeft {
    width: 20px;
    height: 20px;
    background-color: #F0F0F0;
    position: absolute;
    top: -10px;
    left: calc(-24px - 6%);
    border-radius: 50%;
  }

  .fullRight {
    position: absolute;
    top: -10px;
    right: calc(-24px - 6%);
    left: inherit;
  }
}

.orderCenter {
  background-color: white;
  border-radius: 8px;
  padding: 20px 15px 5px;
  margin-top: 10px;

  .oederInfoText {
    font-weight: bold;
    padding-bottom: 20px;
    border-bottom: 1px solid #F6F6F6;
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 17px 0px;
    border-bottom: 1px solid #F6F6F6;
    font-size: 15px;

    .statusText {
      color: #747474;
      white-space: nowrap;
    }

    .address {

    }

    .copy {
      width: 14px;
    }

    .copyBox {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }
}

.button {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: white;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 18px 15px;
  justify-content: flex-end;

  .cancel {
    color: #949393;
    border-radius: 30px;
    border: 1px solid #949393;
    text-align: center;
    width: 85px;
    height: 28px;
    line-height: 28px;
    font-size: 14px;
  }

  .toPay {
    color: white;
    background-color: #ED3036;
    border: 1px solid #ED3036;
  }

  .xing {
    background-color: #0E6941;
    border: 1px solid #0E6941;
  }
}

.deliveryCode {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
}
</style>