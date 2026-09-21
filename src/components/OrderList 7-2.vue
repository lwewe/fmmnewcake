<template>
  <div class="pageMax">
    <div>
      <div v-for="item in prouctList" :key="item.id">
        <!--蛋糕-->
        <div v-if="item.order">
          <div class="listItem2" v-if="(item.order.ord_bs?item.order.ord_bs==5:true)&&item.order.flag==3">
            <div v-for="item2 in item.order_list" :key="item2.id" @click="toDetail(item2.id)">
              <div class="orderNo">
                <div class="orderNum orderTime">订单号:{{ item2.order_no }}</div>
                <!--    订单状态-->
                <!--              订单状态:0-待确认，1- 已确认，2-已完成，3- 已取消-->
                <div v-if="item2.flag==3">
                  <div class="otherType" v-if="item2.detail.status==3">已取消</div>
                  <div class="otherType" v-if="item2.detail.status==2">已完成</div>
                  <div class="otherType" v-if="item2.detail.status==1">已确认</div>
                  <div class="otherType" v-if="item2.detail.status==0">待确认</div>
                </div>
                <div v-if="item2.flag==4">
                  <div class="otherType" v-if="item2.state==4">已取消</div>
                  <div class="otherType" v-if="item2.state==3">已完成</div>
                  <div class="otherType" v-if="item2.state==2">已发货</div>
                  <div class="otherType" v-if="item2.state==1">已确认</div>
                  <div class="otherType" v-if="item2.state==0">待确认</div>
                </div>
              </div>
              <!--              {{item2.flag}}-->
              <!--      影片-->
              <div class="filmBox" v-for="(item3,index3) in item2.flag==4?item2.content:item2.detail.product"
                   :key="index3" style="margin-bottom: 5px">
                <div class="film">
                  <div class="filmImg">
                    <img class="img" :src="item2.flag==4?item3.product.image_path:item3.image_path" alt="">
                  </div>
                  <div class="rightBox">
                    <div class="filmName">{{ item2.flag == 4 ? item3.product.title : item3.product_name }}</div>
                    <div class="startTime textBox" style="margin-top: 0px">
                      {{ item2.flag == 4 ? item3.xinghao.name : item3.spec_name }}
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <!--      价格-->
            <div class="priceBox" style="margin-top: 3px">
              <div>共{{ item.allNum }}件商品</div>
              <div>
                总计: <span class="priceNum"><span style="font-size: 12px">￥</span>{{
                  item.order.zongji ? item.order.zongji : (item.allPrice).toFixed(2)
                }}</span><span
                  class="first">元</span>
              </div>
            </div>
            <!--          <div class="button">-->
            <!--            <div class="cancel">删除订单</div>-->
            <!--            &lt;!&ndash;          <div class="cancel toPay">去支付</div>&ndash;&gt;-->
            <!--          </div>-->
          </div>
          <!--      电子券-->
          <div class="listItem2" @click="toCouponDetail(item.order.id)"
               v-if="(item.order.ord_bs?item.order.ord_bs==5:true)&&item.order.flag==2">
            <div class="orderNo">
              <div class="orderNum orderTime">订单号:{{ item.order.order_no }}</div>
              <!--    订单状态-->
              <div>
                <!--          <div class="time">支付剩余时间 10:25</div>-->
                <!--                    <div class="otherType">已取消</div>-->
                <div class="otherType">已完成</div>
                <!--                    <div class="otherType">待使用</div>-->
              </div>
            </div>
            <!--      影片-->
            <div class="filmBox" v-if="item.coupons">
              <div class="film">
                <div class="filmImg cardImg">
                  <img class="img" style="height: auto;" :src="item.coupons.img" alt="">
                </div>
                <div class="rightBox">
                  <div class="filmName">{{ item.coupons.title }}</div>
                  <!-- <div class="startTime textBox" style="margin-top: 0px">
                    有效期：至{{ timestampToTime2(item.coupons.end_time) }}
                  </div> -->
                </div>
              </div>
            </div>
            <!--      价格-->
            <div class="priceBox" style="margin-top: 3px">
              <div>共1件商品</div>
              <div>
                总计: <span class="priceNum"><span
                  style="font-size: 12px">￥</span>{{ Number(item.order.zongji).toFixed(2) }}</span><span
                  class="first">元</span>
              </div>
            </div>
            <div class="button">
              <div class="cancel">查看详情</div>
              <!--          <div class="cancel toPay">去支付</div>-->
            </div>
          </div>
        </div>
        <div v-else>
          <div class="listItem2" v-if="item.ord_bs==5&&item.flag==3" @click="toDetail(item.id)">
            <div class="orderNo">
              <div class="orderNum orderTime">订单号:{{ item.order_no }}</div>
              <!--    订单状态-->
              <!--              订单状态:0-待确认，1- 已确认，2-已完成，3- 已取消-->
              <div v-if="item.flag==3">
                <div class="otherType" v-if="item.detail.status==3">已取消</div>
                <div class="otherType" v-if="item.detail.status==2">已完成</div>
                <div class="otherType" v-if="item.detail.status==1">已确认</div>
                <div class="otherType" v-if="item.detail.status==0">待确认</div>
              </div>
              <div v-if="item.flag==4">
                <div class="otherType" v-if="item.state==4">已取消</div>
                <div class="otherType" v-if="item.state==3">已完成</div>
                <div class="otherType" v-if="item.state==2">已发货</div>
                <div class="otherType" v-if="item.state==1">已确认</div>
                <div class="otherType" v-if="item.state==0">待确认</div>
              </div>
            </div>
            <!--      影片-->
            <div class="filmBox" v-for="(item3,index3) in item.flag==4?item.content:item.detail.product" :key="index3"
                 style="margin-bottom: 5px">
              <div class="film">
                <div class="filmImg">
                  <img class="img" :src="item.flag==4?item3.product.image_path:item3.image_path" alt="">
                </div>
                <div class="rightBox">
                  <div class="filmName">{{ item.flag == 4 ? item3.product.title : item3.product_name }}</div>
                  <div class="startTime textBox" style="margin-top: 0px">
                    {{ item.flag == 4 ? item3.xinghao.name : item3.spec_name }}
                  </div>
                </div>
              </div>
            </div>

            <!--      价格-->
            <div class="priceBox" style="margin-top: 3px">
              <div>共{{ item.detail.product.length }}件商品</div>
              <div>
                总计: <span class="priceNum"><span style="font-size: 12px">￥</span>{{
                  item.flag == 4 ? item.order.zongji : item.detail.final_amount
                }}</span><span
                  class="first">元</span>
              </div>
            </div>
            <!--          <div class="button">-->
            <!--            <div class="cancel">删除订单</div>-->
            <!--            &lt;!&ndash;          <div class="cancel toPay">去支付</div>&ndash;&gt;-->
            <!--          </div>-->
          </div>
        </div>
        <!--    点餐-->
           
        <div class="listItem2" v-if="item.ord_bs==4" @click="toorderOrder(item.id,item.pf,item.storeId,item.type)">
          <div class="orderNo">
            <div class="orderNum orderTime">订单号:{{ item.orderid }}</div>
            <!--    订单状态-->
            <div>
              <!--          <div class="time">支付剩余时间 10:25</div>-->
              <!--                    <div class="otherType">已取消</div>-->
<!--              <div class="otherType" v-if="item.status==0">待付款</div>-->
<!--              <div class="otherType" v-if="item.status==1">已付款待出餐</div>-->
<!--              <div class="otherType" v-if="item.status==2">出餐中</div>-->
<!--              <div class="otherType" v-if="item.status==3">出餐成功</div>-->
<!--              <div class="otherType" v-if="item.status==4">确认收货</div>-->
<!--              <div class="otherType" v-if="item.status==5">出餐失败退款</div>-->
<!--              <div class="otherType" v-if="item.status==10">订单关闭</div>-->
              <div class="otherType">{{item.statusstr}}</div>
              <!--                    <div class="otherType">待使用</div>-->
            </div>
          </div>
          <!--      影片-->
 
          <div v-if="item.type == 3" class="filmBox" v-for="item2 in JSON.parse(item.products)" :key="item2.id">
<!--                        {{item2}}-->
            <div class="film">
              <div class="filmImg">
                <img class="img"
                     :src="item2.goodsImage || 'http://yxfmm.bjyxfl.com/imgs/default-image.png'"
                     alt="">
              </div>
              <div class="rightBox">
                <div class="filmName">{{
                   item2.goodsName
                  }}
                </div>
                <!-- <div class="startTime textBox" style="margin-top: 0px">
                  {{
                    item2.listname  ||  item2.goodlistname  ||  item2.listname||item2.config
                  }}
                </div> -->
              </div>
            </div>
          </div>
          <div  v-if="item.type != 3"  class="filmBox" v-for="item2 in JSON.parse(item.goods)" :key="item2.id">
<!--                        {{item2}}-->
            <div class="film">
              <div class="filmImg">
                <img class="img"
                     :src="item2.goodImg||item2.itemImage||item2.imageUrl||item2.itemImage"
                     alt="">
              </div>
              <div class="rightBox">
                <div class="filmName">{{
                   item2.goodName ||  item2.itemName||item2.nameCn || item2.itemName
                  }}
                </div>
                <div class="startTime textBox" style="margin-top: 0px">
                  {{
                    item2.listname  ||  item2.goodlistname  ||  item2.listname||item2.config
                  }}
                </div>
              </div>
            </div>
          </div>

          



          <!--      价格-->
          <div class="priceBox" style="margin-top: -1px">
            <div>共{{ JSON.parse(item.goods).length }}件商品</div>
            <div>
              总计: <span class="priceNum">{{ item.zongji }}</span><span class="first">元</span>
            </div>
          </div>
          <!--          <div class="button">-->
          <!--            <div class="cancel">删除订单</div>-->
          <!--            &lt;!&ndash;          <div class="cancel toPay">去支付</div>&ndash;&gt;-->
          <!--          </div>-->
        </div>
        <!--    商品-->
        <div class="listItem2" @click="toShopOrder(item.id)" v-if="item.ord_bs==3">
          <div class="orderNo">
            <div class="orderNum orderTime">订单号:{{ item.order_no }}</div>
            <!--    订单状态-->
            <div v-if="item.state">
              <!--              1-待收货  2-已完成  3-已取消-->
              <div class="otherType" v-if="item.state==0">待发货</div>
              <div class="otherType" v-if="item.state==1">待收货</div>
              <div class="otherType" v-if="item.state==2">已完成</div>
              <div class="otherType" v-if="item.state==3">已取消</div>
            </div>
            <div v-else>
              <div class="otherType" v-if="item.status=='waiting_audit'||orderShow.status=='waiting_shipment'">待发货
              </div>
              <div class="otherType" v-if="item.status=='waiting_confirmed'">待收货</div>
              <div class="otherType" v-if="item.status=='completed'">已完成</div>
              <div class="otherType" v-if="item.status=='canceld'">已取消</div>
            </div>
          </div>
          <!--      影片 v-if="item.child_flag==0&&item.content"-->
          <div class="filmBox" style="width: 100%;" v-for="(key,value) in item.content" :key="key.id">
            <div class="film" style="width: 100%;">
              <div class="filmImg cardImg2">
                <img class="img"
                     :src="(key.product.thumbnailimage.startsWith('https')||key.product.thumbnailimage.startsWith('http'))?key.product.thumbnailimage:$store.state.imgUrl+key.product.thumbnailimage"
                     alt="">
              </div>
              <div class="rightBox" style="width: 72%;">
                <div class="filmName">{{ key.product.name }}</div>
                <div class="startTime textBox" style="margin-top: 0px" v-if="key.xinghao.xinghao">
                  {{ key.xinghao.xinghao }}
                </div>
                <div class="startTime textBox" style="margin-top: 0px" v-else>
                  {{ key.xinghao }}
                </div>
              </div>
            </div>
          </div>
          <!--          <div class="filmBox" v-if="item.child_flag==1&&!item.content" style="width: 100%;" v-for="(key,value) in JSON.parse(item.api_content).CHILD_ORDERS" :key="key.id">-->
          <!--            <div class="film" style="width: 100%;">-->
          <!--              <div class="filmImg cardImg2">-->
          <!--                <img class="img" :src="key.product.thumbnailimage" alt="">-->
          <!--              </div>-->
          <!--              <div class="rightBox" style="width: 72%;">-->
          <!--                <div class="filmName">{{ key.product.name }}</div>-->
          <!--                <div class="startTime textBox" style="margin-top: 0px" v-if="key.productcode">-->
          <!--                  {{ key.productcode }}-->
          <!--                </div>-->
          <!--                <div class="startTime textBox" style="margin-top: 0px" v-else>-->
          <!--                  {{ key.productcode }}-->
          <!--                </div>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->
          <!--      价格-->
          <div class="priceBox" style="margin-top: 0px">
            <div v-if="item.content">共{{ item.content.length }}件商品</div>
            <div v-if="item.child">共{{ item.child.length }}件商品</div>
            <div>
              总计: <span class="priceNum">{{ item.price }}</span><span class="first">元</span>
            </div>
          </div>
          <!--          <div class="button">-->
          <!--            <div class="cancel">删除订单</div>-->
          <!--            &lt;!&ndash;          <div class="cancel toPay">去支付</div>&ndash;&gt;-->
          <!--          </div>-->
        </div>
        <!--        直充-->
        <div class="listItem2" v-if="item.ord_bs==8" @click="toChargeDetail(item.id)">
          <div class="orderNo">
            <div class="orderNum orderTime">订单号:{{ item.order_no }}</div>
            <!--    订单状态-->
            <!--              订单状态:0-待确认，1- 已确认，2-已完成，3- 已取消-->
            <div>
              <div class="otherType" v-if="item.state==1">已失败</div>
              <div class="otherType" v-if="item.state==2">已完成</div>
              <div class="otherType" v-if="item.state==3">已取消</div>
            </div>
          </div>
          <!--      影片-->
          <div class="filmBox" style="margin-bottom: 5px">
            <div class="film">
              <div class="filmImg">
                <img class="img" :src="item.brand.img" alt="">
              </div>
              <div class="rightBox">
                <div class="filmName">{{ item.product.title }}</div>
                <div class="startTime textBox" style="margin-top: 0px">{{ item.product.name }}</div>
              </div>
            </div>
          </div>

          <!--      价格-->
          <div class="priceBox" style="margin-top: 3px">
            <div>共{{ item.number }}个</div>
            <div>
              总计: <span class="priceNum"><span style="font-size: 12px">￥</span>{{ item.total_fee }}</span><span
                class="first">元</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "OrderList",
  props: ['orderList'],
  data() {
    return {
      // orderList: []
      prouctList: this.orderList,
    }
  },
  methods: {
    toShopOrder(id) {
      window.location.href = this.$store.state.Shopbase + "/orderDetail?id=" + id + "&token=" + localStorage.getItem("token")
    },
    toorderOrder(id, pf, storeId,type) {
      window.location.href = this.$store.state.Shopbase + "/orderOrderDetail?id=" + id + "&pf=" + pf + "&storeId=" + storeId+ "&type=" + type + "&token=" + localStorage.getItem("token")
      // this.$router.push({path: "/orderOrderDetail", query: {id,pf,storeId}})
    },
    toDetail(id) {
      this.$router.push({path: "/cakeOrderDetail", query: {id}})
    },
    toChargeDetail(id) {
      this.$router.push({path: "/directChargeOrder", query: {id}})
    },
    toCouponDetail(id) {
      this.$router.push({path: "/couPonOrderDetail", query: {id}})
    },
    tomoveOrder(id, pf) {
      this.$router.push({path: "/orderDetail", query: {id, pf}})
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
      return y + '-' + MM + '-' + d
    },
    change() {
      this.prouctList.forEach((item, index) => {
        item.allPrice = 0
        item.allNum = 0
        if (item.order) {
          if ((item.order.ord_bs ? item.order.ord_bs == 5 : true) && item.order.flag == 3) {
            if (item.order_list) {
              item.order_list.forEach((item2, index2) => {
                if (item.order.id == item2.order_id && item2.dg_final_amount) {
                  item.allPrice += Number(item2.dg_final_amount)
                  item.allNum += item2.detail.number
                }

              })
            }
          }
          if (item.order_list) {
            item.order_list.forEach((item2, index2) => {
              item2.content.forEach(item3 => {
                if (item.order.id == item2.order_id && item2.flag == 4) {
                  item.allPrice += (Number(item3.xinghao.price) * Number(item3.quantity))
                  item.allNum += Number(item3.quantity)
                }
              })
            })
          }
        }
      })
    }
  },
  created() {
    this.change()
  },
  watch: {
    orderList(item1, item2) {
      // item1为新值，item2为旧值
      this.prouctList = item1
      this.change()
    },
    prouctList(val) {
      if (this.orderList !== val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style scoped lang="less">
.pageMax {
  padding: 1px 10px 15px;
}

.listItem {
  background-color: white;
  border-radius: 10px;
  margin-top: 10px;
  overflow: hidden;

  .endTime {
    background-color: #FEF9E6;
    color: #EF494C;
    text-align: center;
    font-weight: bold;
    padding: 10px 0px;
  }

  .orderInfo {
    padding: 10px 15px;

    .orderTop {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .topLeft {
        display: flex;
        align-items: center;
        gap: 5px;

        .pack {
          border: 1px solid #F2696E;
          white-space: nowrap;
          color: #F2696E;
          padding: 0px 3px 1px;
          font-size: 10px;
          border-radius: 2px;
          font-weight: bold;
        }

        .shopName {
          //font-weight: bold;
          font-size: 14px;
        }
      }

      .orderStatus {
        font-size: 13px;
        color: #959595;
      }
    }

    .orderCenter {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
      border-bottom: 1px dotted #EBEBEB;
      padding-bottom: 5px;

      .centerLeft {
        display: flex;
        align-items: center;
        gap: 8px;

        .shopImg {
          width: 77px;
          height: 77px;
        }

        .textRight {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .shopName {
          //font-weight: bold;
          font-size: 14px;
        }

        .shopInfo {
          font-size: 10px;
          color: #646464;
        }
      }

      .fullMoney {
        font-size: 10px;
        text-align: center;
        font-weight: bold;
      }

      .fullMoney span {
        font-size: 17px;
      }

      .piece {
        font-size: 10px;
        color: #767676;
        padding-top: 3px;
      }
    }

    .centerBottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 10px;

      .time {
        font-size: 10px;
      }

      .button {
        display: flex;
        align-items: center;
        gap: 10px;

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
      }
    }
  }
}

.listItem2 {
  background-color: white;
  border-radius: 10px;
  margin-top: 10px;
  padding: 10px 18px 10px;
  //订单号
  .orderNo {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .orderNum {
      font-size: 12px;
      color: #878787;
      font-weight: bold;
    }

    .time {
      font-size: 13px;
      font-weight: bold;
      color: #EE3F45;
      white-space: nowrap;
    }

    .otherType {
      font-size: 14px;
      font-weight: bold;
      color: #B6B6B6;
    }
  }

  //  影片
  .filmBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;

    .film {
      display: flex;
      align-items: center;
      gap: 14px;
      width: 100%;

      .filmImg {
        width: 77px;
        //height: 77px;
        border-radius: 3px;
        overflow: hidden;
      }

      .rightBox {
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 65%;
      }

      .filmName {
        font-size: 14px;
        font-weight: bold;
        margin-top: -10px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2; /* 显示两行 */
      }

      .startTime {
        font-size: 12px;
        color: #818080;
      }

      .seat {
        //display: flex;
        //align-items: center;
        //gap: 4px;
        font-size: 12px;
        color: #818080;
        white-space: nowrap;
        margin-left: -4px;
      }

      .seat span {
        padding-left: 4px;
      }
    }

    .btnBox {
      min-width: 56px;
    }

    .btnno {
      background-color: #ED3036 !important;
      border-radius: 30px !important;
      width: 100%;
      height: 28px !important;
      line-height: 27px !important;
      margin-top: 10px;
      font-size: 12px;
      white-space: nowrap;
      padding: 0;
    }
  }

  //  价格
  .priceBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: #818080;
    margin-top: 8px;

    .priceNum {
      color: #EF4E53;
      font-weight: bold;
      font-size: 17px;
    }

    .first {
      color: #EF4E53;
      font-weight: bold;
    }
  }
}

.button {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
  width: 100%;
  border-top: 1px solid #F6F6F6;
  padding-top: 8px;
  margin-top: 5px;

  .cancel {
    color: #949393;
    border-radius: 30px;
    border: 1px solid #949393;
    text-align: center;
    width: 70px;
    height: 25px;
    line-height: 25px;
    font-size: 13px;
  }

  .toPay {
    color: white;
    background-color: #ED3036;
    border: 1px solid #ED3036;
  }
}

//卡券
.orderTime {
  color: #767676 !important;
}

.payNum {
  color: #979797;
  font-size: 14px;
}

.cardImg {
  width: 65px !important;
  height: auto !important;
}

.cardImg2 {
  width: 65px !important;
}

.priceBottom {
  border-top: 1px solid #F3F3F3;
  padding-top: 6px !important;
}

.textBox {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
}
</style>