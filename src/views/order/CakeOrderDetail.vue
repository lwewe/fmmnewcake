<template>
  <div class="location">
    <NProgress v-if="loadingflag"/>
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>
    <!--    地址-->
    <div class="addressBox" v-if="order.phone||orderShow.address">
      <div class="address">
        <div class="leftBox">
          <div class="addressIcon">
            <img class="img" src="../../assets/tubiao/dd.png" alt="">
          </div>
          <div>
            <div>
              <span class="userName">{{ orderShow.flag==3?order.name:orderShow.address.name }}</span>
              <span class="phone">{{ orderShow.flag==3?order.phone:orderShow.address.phone }}</span>
            </div>
            <div v-if="order.take_shop_name">
              <span class="userName">{{ order.take_shop_name }}</span>
            </div>
            <div class="addressDetail">{{ orderShow.flag==3?order.addr:orderShow.address.addr }}</div>
          </div>
        </div>
      </div>
    </div>
    <!--    订单信息-->
    <!--    商品信息-->
    <div class="addressBox addressBox2" v-if="order.product&&orderShow.flag==3">
      <div class="itemTitle">商品信息</div>
      <div class="shopInfo" v-for="item in order.product" :key="item.id">
        <!--                    {{key}}-->
        <div class="shopImg">
          <img style="border-radius: 5px;" class="img"
               :src="item.image_path"
               alt="">
        </div>
        <div class="nameBox">
          <div class="shopName">{{ item.product_name }}</div>
          <div class="can">{{ item.spec_name }}</div>
          <div class="all">
            <div class="price">￥{{ item.price }}</div>
            <div class="number">×{{ item.quantity }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="addressBox addressBox2" v-if="orderShow.flag==4">
      <div class="itemTitle">商品信息</div>
      <div class="shopInfo" v-for="item in order" :key="item.id">
        <!--                    {{key}}-->
        <div class="shopImg">
          <img style="border-radius: 5px;" class="img"
               :src="item.product.image_path"
               alt="">
        </div>
        <div class="nameBox">
          <div class="shopName">{{ item.product.title }}</div>
          <div class="can">{{ item.xinghao.name }}</div>
          <div class="all">
            <div class="price" v-if="item.xinghao">￥{{ item.xinghao.price }}</div>
            <div class="number">×{{ item.quantity }}</div>
          </div>
        </div>
      </div>
    </div>
    <!--    订单明细-->
    <div class="addressBox addressBox2">
      <div class="itemTitle">订单明细</div>
      <div class="orderInfo">
        <div class="shopPrice">
          <div class="shopPriceText">商品金额</div>
          <div class="price">￥{{ orderShow.flag==3?order.total_amount:allPrice }}</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">配送费</div>
          <div class="price">￥{{ orderShow.flag==3?order.ship_amount:0 }}</div>
        </div>
        <div class="shopPrice" v-if=" JSON.parse(orderShow.content).tastes_name ">
          <div class="shopPriceText">口味</div>
          <div class="price">{{  JSON.parse(orderShow.content).tastes_name }} </div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">合计</div>
          <div class="price price1">￥{{ orderShow.flag==3?order.final_amount:allPrice }}</div>
        </div>
      </div>
    </div>
    <!--    订单信息-->
    <div class="addressBox addressBox2">
      <div class="itemTitle">订单信息</div>
      <div class="orderInfo">
        <div class="shopPrice">
          <div class="shopPriceText">订单状态</div>
          <!--         订单状态:0-待确认，1- 已确认，2-已完成，3- 已取消-->
         <div v-if="orderShow.flag==3">
           <div class="price" v-if="order.status==0">待确认</div>
           <div class="price" v-if="order.status==1">已确认</div>
           <div class="price" v-if="order.status==2">已完成</div>
           <div class="price" v-if="order.status==3">已取消</div>
         </div>
         <div v-if="orderShow.flag==4">
           <div class="price" v-if="orderShow.state==4">已取消</div>
           <div class="price" v-if="orderShow.state==3">已完成</div>
           <div class="price" v-if="orderShow.state==2">已发货</div>
           <div class="price" v-if="orderShow.state==1">未发货</div>
           <div class="price" v-if="orderShow.state==0">待确认</div>
         </div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">订单号</div>
          <div class="price">{{ orderShow.order_no }}</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">下单时间</div>
          <div class="price">{{ timestampToTime(orderShow.add_time) }}</div>
        </div>
        <div class="shopPrice" v-if="orders.fuli">
          <div class="shopPriceText">支付方式</div>
          <div class="price"
               v-if="JSON.parse(orders.fuli).filter(item=>item.id=='wx').length==JSON.parse(orders.fuli).length">微信
          </div>
          <div class="price"
               v-if="JSON.parse(orders.fuli).filter(item=>item.id=='wx').length>0&&JSON.parse(orders.fuli).filter(item=>item.id=='wx').length!=JSON.parse(orders.fuli).length">
            微信和福利卡
          </div>
          <div class="price" v-if="JSON.parse(orders.fuli).filter(item=>item.id=='wx').length==0">福利卡</div>
        </div>
      </div>
    </div>
    <div class="service" @click="toKefu">
      <div>如有问题，请联系客服 全年无休(9:00-21:00)</div>
      <div class="serviceBox">
        <img class="img" src="../../assets/kf.png" alt="">
      </div>
    </div>
    <div v-if="expressList">
      <!--    快递信息-->
      <div class="addressBox addressBox2" v-if="expressList.express_no">
        <div class="itemTitle">快递信息</div>
        <div class="orderInfo">
          <div class="shopPrice">
            <div class="shopPriceText">快递</div>
            <div class="price">{{ expressList.express_cp }}</div>
          </div>
          <div class="shopPrice">
            <div class="shopPriceText">快递单号</div>
            <div class="price">{{ expressList.express_no }}</div>
          </div>
        </div>
      </div>
      <!--    物流信息-->
      <div class="addressBox addressBox2" v-if="expressList.contents" style="padding-bottom: 30px">
        <div style="padding-bottom: 40px" :class="{unfoldHeight:!isHeight}">
          <div class="itemTitle">物流信息</div>
          <div class="orderInfo">
            <div class="shopPrice" style="display: block" v-for="item2 in expressList.contents" :key="item2.AcceptTime">
              <div class="price">{{ item2.AcceptTime }}</div>
              <div class="shopPriceText">{{ item2.AcceptStation }}</div>
            </div>
          </div>
          <div class="unfold" @click="isHeight=!isHeight">
            <div>{{ isHeight ? '收起' : '展开' }}</div>
            <div v-if="!isHeight">
              <van-icon name="arrow-down"/>
            </div>
            <div v-else>
              <van-icon name="arrow-up"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--    footer-->
    <!--    <div class="button">-->
    <!--      <div class="cancel">删除订单</div>-->
    <!--      &lt;!&ndash;      <div class="cancel">在线客服</div>&ndash;&gt;-->
    <!--      <div class="cancel toPay">再来一单</div>-->
    <!--      &lt;!&ndash;      <div class="cancel toPay xing">再来一单</div>&ndash;&gt;-->
    <!--    </div>-->
  </div>
</template>
<script>
import Payment from "@/components/Payment.vue";
import {getCakeOrderdetail} from "@/api/mine";

export default {
  components: {Payment},
  data() {
    return {
      cardList: [],
      addrShow: {},
      order: {},
      orderShow: {},
      expressList: {},
      express: "",
      loadingflag: true,
      child: [],
      child_flag: "",
      isHeight: false,
      orders: {},
      allPrice:0
    }
  },
  methods: {
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
      return y + '-' + MM + '-' + d + " " + h + ":" + m + ":" + s
    },
    getDetail(id) {
      this.child = []
      getCakeOrderdetail({
        id
      }).then(res => {
        this.loadingflag = false
        this.allPrice=0
        // console.log(res)
        if (res.code == 200) {
          this.order = res.data.detail
          this.orders = res.data.order
          this.orderShow = res.data.orderinfo
          this.expressList = res.data.order_wuliu
          if(this.orderShow.flag==4){
            this.order.forEach(item=>{
              if(item.xinghao){
                this.allPrice+=Number(item.xinghao.price)
              }else{
                this.allPrice = this.orders.zongji
              }
            })
          }
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
  //padding-bottom: 63px;
}


.addressBox {
  padding: 13px 10px;
  background-color: white;
  border-radius: 10px;

  .address {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .addressIcon {
    width: 20px;
  }

  .phone {
    padding-left: 10px;
    font-size: 12px;
    color: #797979;
  }

  .addressDetail {
    font-size: 13px;
    font-weight: bold;
    margin-top: 3px;
  }

  .userName {
    font-size: 15px;
    font-weight: bold;
  }

  .leftBox {
    display: flex;
    align-items: center;
    gap: 5px;
  }
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
  }

  .price {
    font-size: 14px;
    font-weight: bold;
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

//footer
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
  padding: 8px 15px;
  justify-content: flex-end;

  .cancel {
    color: #949393;
    border-radius: 30px;
    border: 1px solid #949393;
    text-align: center;
    width: 89px;
    height: 35px;
    line-height: 35px;
    font-size: 14px;
  }

  .toPay {
    color: white;
    background-image: linear-gradient(to right, #F55756, #DC0807);
    border: 1px solid #ED3036;
  }

  .xing {
    background-color: #0E6941;
    border: 1px solid #0E6941;
  }
}
</style>