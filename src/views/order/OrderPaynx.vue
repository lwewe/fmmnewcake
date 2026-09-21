<template>
  <div class="orderpaybox">
    <NProgress v-if="loadingflag"/>
    <!--    选择取餐方式-->
    <div class="takeFood">
      <div v-if="shopcarlist.length>0">
        <div class="storename">
          <div v-if="!flagA">
            {{ shopcarlist[0].name || shopcarlist[0].storeName }}
          </div>
          <div v-else>{{ locationdetail }}</div>
        </div>
        <div class="storeaddress">
          <div v-if="!flagA">
            {{ shopcarlist[0].address || shopcarlist[0].storeAddress }}
          </div>
          <div v-else>{{ location }}</div>
        </div>
      </div>
      <div class="pickupMethodBox">
        <div v-for="(item,index) in flagA?pickupMethod.slice(2,3):num1==3?pickupMethod.slice(3):pickupMethod.slice(0,2)"
             :key="index"
             class="pickupMethod" :class="{pickupMethod2:packFlag==item.packFlag}" @click="changePackFlag(item)">
          <div class="circle" v-if="packFlag==item.packFlag">
            <van-icon name="checked" color="#FFBC0C" size="20px"/>
          </div>
          <div class="imgBox">
            <img class="img" :src="num2==1?item.icon:item.icon2" alt="">
          </div>
          <div class="titleBox">
            <div class="title" :class="{title2:packFlag==item.packFlag}">{{ item.title }}</div>
            <div class="text" :class="{text2:packFlag==item.packFlag}">{{ item.text }}</div>
          </div>
        </div>
      </div>
    </div>
    <!--    联系方式-->
    <div class="box takeFood phoneBox">
      <div>
        <div class="connection">联系方式</div>
        <div class="receive">用于接收取餐号</div>
      </div>
      <div class="phone">{{ phone }}</div>
    </div>
    <!--    餐品详情-->
    <div class="box takeFood">
      <div class="goodDetail">餐品详情</div>
      <div class="goodList">
        <div v-for="item in goods" :key="item.code" class="goodItem">
          <div class="goodImg">
            <img class="img"
                 :src="item.itemImage || item.goodImg||item.imageUrl||item.detail.product_img||item.detail.detailImgUrl"
                 alt="">
          </div>
          <div class="rightBox">
            <div>{{ item.itemName || item.goodName || item.nameCn || item.detail.product_name || item.detail.title }}
            </div>
            <div class="items">
              <div v-if="item.items">
                <div v-for="(item2,index2) in item.items" :key="index2" class="item2Name">
                  {{ item2.count }} x {{ item2.name }}
                </div>
              </div>
              <div v-else>{{ item.goodlistname || item.listname || item.specifications }}</div>
            </div>
            <div class="quantityBox">
              <!--              {{ item.quantity }}-->
              <div class="quantity"></div>
              <div class="priceBox">
                <span>￥</span>{{num1==2&&!flag?item.priceHead: (item.sumprice || item.price || item.fullPrice || item.detail.salePrice) }} <span
                  class="quantity">x {{ item.count || item.quantity }}</span></div>
            </div>
          </div>
        </div>
        <div class="unfoldBox" @click="unfold" v-if="shopcarlist.length>2">
          <div>{{ !isUnfold ? '展开' : '收起' }}(共{{ shopcarlist.length }}项)</div>
          <div class="unfold" :class="{unfold2:isUnfold}">
            <img class="img" src="../../assets/backimage/zk.png" alt="">
          </div>
        </div>
      </div>
    </div>
    <!--    配送费-->
    <div class="box takeFood phoneBox" v-if="flagA">
      <div>
        <div class="connection">预估配送费</div>
        <div class="receive">近期运力紧张，配送时效无法保证~</div>
      </div>
      <div class="phone deliveryPrice"><span>￥</span>{{ deliveryPrice }}</div>
    </div>
    <!-- 支付方式 -->
    <!--    <div class="box">-->
    <!--      &lt;!&ndash; &ndash;&gt;-->
    <!--      <Payment :result1="result" :cardList="cardList" @getResult="getResult"></Payment>-->
    <!--    </div>-->
    <!-- 购买须知 -->
    <div class="box takeFood">
      <div class="instructions">
        <div class="s1">购买须知</div>
        <div>
          <van-checkbox class="s2" v-model="checked1" checked-color="#ee0a24">已阅读并同意</van-checkbox>
        </div>
      </div>
      <div class="inner" v-html="goumaixuzhi" style="font-size: 14px;"></div>
    </div>
    <!--    支付密码-->
    <PayPassword :isShow="isShow" @input="input" @onInput="onInput"></PayPassword>
    <!--    底部按钮-->
    <div class="footer">
      <div class="footerBtn"
           :class="{footerBtn2:num2==1,footerBtn3:num2==2,footerBtn6:num1==6}">
        <div class="cartIconBox">
          <div class="cartIcon">
            <img class="img" src="../../assets/backimage/Vector-1.png" alt="">
          </div>
          <div>
            <div class="cartPrice">
              ￥<span class="priceText">{{ sumprice.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        <div class="order" @click.stop="toPay">
          <div>去支付</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Payment from '@/components/Payment.vue';
import PayPassword from "@/components/PayPassword.vue";
import {getcardList, getcardPay, flkpay, wxpay, pay_success} from "@/api/pay.js"
import {getsingle, getPhone, getOderList, create_order} from '@/api/service'
// getorderdetail
import {List} from 'vant';

export default {
  components: {Payment, PayPassword},
  data() {
    return {
      num1: 0,
      num2: 0,
      // 取餐方式
      pickupMethod: [
        {
          packFlag: '0',
          title: "堂食",
          text: "店内用餐",
          icon: require("../../assets/backimage/t1.png"),
          icon2: require("../../assets/backimage/t2.png"),
        },
        {
          packFlag: '1',
          title: "外带",
          text: "打包带走",
          icon: require("../../assets/backimage/w1.png"),
          icon2: require("../../assets/backimage/w2.png"),
        },
        {
          packFlag: '2',
          title: "立即配送",
          text: "",
          icon: require("../../assets/backimage/bick.png")
        },
        {
          packFlag: '1',
          title: "自取",
          text: "",
          icon: require("../../assets/backimage/t1.png"),
          icon2: require("../../assets/backimage/t2.png"),
        },
      ],
      storecode: "",
      goods: "",
      phone: "",
      type: "",
      openid: "",
      flagA: false,
      checked1: "true",   //购买须知是否勾选
      checked: "",
      flag: true,
      fooddetail: [],
      countbox: [],
      moneybox: [],
      shopcarlist: [],   //购物车内的商品
      packFlag: "0",
      orderType: "1",
      result: [],
      cardList: "",
      // 外卖
      location: "",
      locationdetail: "",
      goumaixuzhi: "",
      flagB: true,
      sumprice: 0,
      receiverLng: "",
      receiverLat: "",
      address_id: "",
      // 配送费
      deliveryPrice: "",
      // 支付变量
      dkprice: "",
      wxprice: "",
      ka_ids: "",
      // 密码框
      isShow: false,
      pass: "",
      loadingflag: true,
      verify: [],
      isUnfold: false,
      address_Item: {}
    };
  },
  created() {
    if (localStorage.getItem("openid")) {
      this.openid = localStorage.getItem("openid")
    }
    this.flagA = this.$route.query.flag
    if (this.flagA) {
      if (sessionStorage.getItem('address_Item')) {
        this.address_Item = JSON.parse(sessionStorage.getItem('address_Item'))
        this.location = this.address_Item.addr + this.address_Item.number
        this.locationdetail = this.address_Item.contact
        this.address_id = this.address_Item.id
      }
      this.packFlag = 2
    }

    this.verify = JSON.parse(sessionStorage.getItem("verify"))
    if (this.verify) {
      this.goods = this.verify.slice(0, 2)
    }
    this.num1 = this.$route.query.num1
    this.num2 = this.$route.query.num2
    this.type = this.$route.query.type
    this.deliveryPrice = Number(this.$route.query.deliveryPrice).toFixed(2)
    if (this.num1 == 3 && !this.flagA) {
      this.packFlag = 1
    }
    // 购买须知
    this.getsinglelist()
    this.getcard()
    if (this.num1 == 1 && this.flagA || this.num1 == 2 && this.flagA || this.num1 == 3) {
      this.shopcarlist = JSON.parse(sessionStorage.getItem("allgoods"));
      this.shopcarlist.forEach(item => {
        this.sumprice += Number(item.totalPrice)
      })
      if (this.flagA && this.shopcarlist.length > 1) {
        this.sumprice = this.sumprice - this.deliveryPrice * (this.shopcarlist.length - 1)
      }

    } else {
      this.shopcarlist = JSON.parse(sessionStorage.getItem("goods"));
      this.verify = JSON.parse(sessionStorage.getItem("goods"))
      this.goods = this.verify.slice(0, 2)
      this.verify.forEach(item => {
        this.sumprice += (this.num1==2&&!this.flag?Number(item.priceHead):Number(item.price) || Number(item.fullPrice)) * item.count
      })
      // if (this.flagA && this.shopcarlist.length > 1) {
      //   this.sumprice = this.sumprice - this.deliveryPrice * (this.shopcarlist.length - 1)
      // }
    }
    this.storecode = this.shopcarlist[0].storeCode || this.shopcarlist[0].storeId

    console.log('sessionStorage.getItem("goods")')
    console.log(sessionStorage.getItem("goods"))
  },
  methods: {
    // 展开
    unfold() {
      this.isUnfold = !this.isUnfold
      if (this.isUnfold) {
        this.goods = this.verify
      } else {
        this.goods = this.verify.slice(0, 2)
      }
    },
    changePackFlag(item) {
      this.packFlag = item.packFlag
    },
    input(e) {
      this.isShow = e
    },
    // 密码输入
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
        storeCode: this.storecode,
        type: this.type,
        packFlag: this.packFlag,
        orderType: this.packFlag,
        phone: this.phone,
        goods: this.verify,
        receiverLng: this.flagA ? this.address_Item.lon : '',
        receiverLat: this.flagA ? this.address_Item.lat : '',
        address_id: this.flagA ? this.address_id : ''
      }
      flkpay(data).then(res => {
        // console.log(res);
        if (res.code == 200 && res.data) {
          this.getcard()
          if (res.code == 200 && res.data) {
            setTimeout(() => {
              this.$router.replace({path: "/order", query: {tabIndex: 1}})
            }, 1000)
          }
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 选择支付方式
    getResult(result, checked) {
      this.result = result
      this.checked = checked
    },
    // 微信支付
    wxpay(ka_ids = []) {
      let data = {
        ka_ids,
        openid: this.openid,
        storeCode: this.storecode,
        type: this.type,
        packFlag: this.packFlag,
        orderType: this.packFlag,
        phone: this.phone,
        goods: this.verify,
        receiverLng: this.flagA ? this.address_Item.lon : '',
        receiverLat: this.flagA ? this.address_Item.lat : '',
        address_id: this.flagA ? this.address_id : ''
      }
      wxpay(data).then(res => {
        if (res.code == 200) {
          this.onBridgeReady(res.data.jsApiParameters, res.data.order_no)
        } else {
          this.$toast(res.msg)
        }
      })
    },
    unique(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr.productId) && res.set(arr.productId, 1)
      );
    },
    // 去结算
    toPay() {
      if (this.num1 == 3 || this.num1 == 1 && this.flagA || this.num1 == 2 && this.flagA) {
        this.$router.push({
          path: "/checkstand",
          query: {
            flag: this.flagA,
            num1: this.num1,
            num2: this.num2,
            type: this.type,
            shopName: this.$route.query.shopName,
            deliveryPrice: this.deliveryPrice || 0
          }
        })
        return
      }
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 100000
      });
      // ?flag=true&num1=1&num2=1&type=bsk&shopName=石家庄休门街大洋百货餐厅
      let data = {
        "shopId": this.goods[0].storeid,
        type: this.type,
        "eatType": this.packFlag,
        "products": [],
        "phone": this.phone,//建议销售价
      }
      this.verify.forEach(item => {
        // data.products.push({
        //   "productId": item.detail.product_id || item.productId,//主商品id
        //   "quantity": item.count,
        //   "priceHead": item.detail.salePrice||item.priceHead,//建议销售价
        //   "price": item.fullPrice || item.price,//建议销售价
        // })
        // data.products = []
        data.products.push({
          "productId": item.productId || item.detail.product_id || item.detail.itemNo,//主商品id
          "linkId": item.linkId || "",
          "quantity": item.count,
          "nameCn": item.nameCn || item.detail.product_name || item.detail.title,
          "imageUrl": item.imageUrl || item.detail.product_img || item.detail.detailImgUrl,
          "sellPrice": item.priceHead || item.detail.salePrice || item.detail.firstSku.salePrice,//建议销售价
          "oPrice": item.price || item.fullPrice,//市场价
          "config": item.specifications || "",//这里只是为了直观展示套餐选项，实际下单可以传空
          "selected": [
            {
              "round": 0,//麦当劳产品round目前没有使用，传0
              "products": [
                // {
                //   "linkId": "1918",//下单参数linkId（有时会和主商品id相同）
                //   "productId": "1939",//套餐选项商品id
                //   "quantity": 1
                // },
                // {
                //   "linkId": "1918",//下单参数linkId（有时会和主商品id相同）
                //   "productId": "1944",//套餐选项商品id
                //   "quantity": 1
                // }
              ]
            }
          ]
        })
        // console.log(data.products,"ssss")
        if (item.detail) {
          data.products.forEach(item5 => {
            
            let list = item.detail.details ? item.detail.details.optional || item.detail.details.spu_specs || item.detail.details.specifications : item.detail.specItems
            // console.log(item5.selected)
            list.forEach((item2, index2) => {

              // console.log(item2,"item2")
              if (item2.sku_infos) {
                if ((item.productId || item.detail.product_id || item.detail.itemNo) == item5.productId) {
                  // console.log(item2.id , item5.productId)
                  item2.sku_infos.forEach(item3 => {
                    if (item3.checked) {
                      // console.log(1111)
                      item5.selected.forEach(item6 => {
                        item6.round = 0
                        item6.products.push({
                          "linkId": item2.id,//下单参数linkId（有时会和主商品id相同）
                          "productId": item3.id,//套餐选项商品id
                          "quantity": 1
                        })
                      })
                    }
                  })
                  // console.log(item5,"item5.selected")
                }
              } else {
                // console.log(1111111111,item.detail.itemNo , item5.productId)
                if (this.num1 == 5 && item.detail.product_id == item5.productId) {
                  

 // 添加标记，避免重复处理
  if (!item5._naixueProcessed) {
    item5._naixueProcessed = true
    
    // 清空之前可能添加的SKU
    item5.selected.forEach(item6 => {
      item6.products = []
    })
    
    // 查找匹配的SKU
    let matchedSku = null
    if (item.skuId) {
      // 使用保存的skuId
      matchedSku = item.detail.details.sku_infos?.find(sku => sku.code === item.skuId)
    }
    
    // 如果没找到，尝试根据规格匹配
    if (!matchedSku) {
      item2.values.forEach((item3, index3) => {
        if (item3.checked == 1) {
          item.detail.details.sku_infos.forEach((item7) => {
            item7.specs.forEach((item8, index8) => {
              if (item3.code == item8.spec_code && item2.code == item8.code) {
                item8.checked = 1
              }
            })
            
            // 找到匹配的SKU
            if (item7.specs.filter(item => item.checked == 1).length == item7.specs.length) {
              matchedSku = item7
            }
          })
        }
      })
    }
    
    // 只添加匹配的SKU
    if (matchedSku) {
      item5.selected.forEach(item6 => {
        item6.round = 0
        item6.products.push({
          "linkId": "",
          "productId": matchedSku.code,
          "quantity": 1
        })
      })
      item5.linkId = matchedSku.code
    }
  }


                } else if (this.num1 == 6 && item.detail.product_id == item5.productId) {
                  item2.ingredients.forEach((item3, index3) => {
                    if (item3.checked) {
                      item.detail.details.sku_infos.forEach((item7) => {
                        item7.values.forEach((item8, index8) => {
                          if (item3.name == item8.spec_name) {
                            item8.checked = true
                          }
                        })
                        if (item7.values.filter(item => item.checked).length == item7.values.length) {
                          item5.selected.forEach(item6 => {
                            item6.round = 0
                            item6.products.push({
                              "linkId": "",//下单参数linkId（有时会和主商品id相同）
                              "productId": item7.code,//套餐选项商品id
                              "quantity": 1
                            })
                          })
                        }
                      })

                    }
                  })
                } else if (this.num1 == 7 && item.detail.itemNo == item5.productId) {
                  item2.specValueList.forEach((item3, index3) => {
                    if (item3.recommendFlag == 1) {
                      item.detail.skuCombinList.forEach((item7) => {
                        item7.skusSpecs.forEach((item8, index8) => {
                          if (item3.name == item8.specItemValueName) {
                            item8.recommendFlag = 1
                          }
                        })
                        if (item7.skusSpecs.filter(item => item.recommendFlag == 1).length == item7.skusSpecs.length) {
                          item5.selected.forEach(item6 => {
                            item6.round = 0
                            item6.products.push({
                              "linkId": "",//下单参数linkId（有时会和主商品id相同）
                              "productId": item7.skuNo,//套餐选项商品id
                              "quantity": 1
                            })
                          })
                          item5.linkId = item7.skuNo
                        }
                      })

                    }
                  })
                }
              }
            })
          })

        } else {
          data.products.forEach(item5 => {
            if ((item.productId || item.detail.product_id || item.detail.itemNo) == item5.productId) {
              item5.selected = []
            }
          })
        }
      })
      data.products = JSON.stringify(data.products)
       
      create_order(data).then(res => {
        if (res.code == 200) {
          this.$toast.clear();
          this.$router.replace({
            path: "/checkstand",
            query: {
              flag: this.flagA,
              num1: this.num1,
              num2: this.num2,
              type: this.type,
              shopName: this.$route.query.shopName,
              deliveryPrice: this.deliveryPrice || 0,
              orderid: res.data.orderid
            }
          })
        } else {
          this.$toast(res.msg)
        }
      })
      // if (!this.checked1) {
      //   this.$toast("请阅读并同意购买须知")
      //   return;
      // }
      // // console.log(this.result)
      // if (this.result.length == 0 && this.checked == "") {
      //   this.$toast("请选择支付方式")
      //   return
      // }
      // this.$dialog.confirm({
      //   title: '提示',
      //   message: '付款后无法退款，请确认后购买',
      //   confirmButtonColor: 'red',
      // }).then(() => {
      //   if (this.result.length == 0 && this.checked != "") {
      //     // console.log("微信支付");
      //     if (!this.isWeiXin()) {
      //       this.$toast("请使用微信打开进行支付")
      //       this.isLoading = false
      //       return;
      //     }
      //     // console.log("调用微信支付");
      //     this.wxpay()
      //   } else {
      //     // console.log("调用卡支付");
      //     this.isPay_date()
      //   }
      // }).catch(() => {
      //
      // })

    },
    // 判断是否在微信中打开
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    // 计算福利卡是否够支付
    isPay_date() {
      let data = {
        'fulika': this.result.join(","),
        'storeCode': this.storecode,
        'goods': this.verify,
        'type': this.type,
        'receiverLng': this.flagA ? this.address_Item.lon : '',
        'receiverLat': this.flagA ? this.address_Item.lat : '',
        'packFlag': this.packFlag,
        'orderType': this.packFlag,
        'address_id': this.flagA ? this.address_id : ''
      }
      getcardPay(data).then(res => {
        if (res.code == 200) {
          this.wxprice = res.data.wxprice
          this.dkprice = res.data.dkprice
          this.ka_ids = res.data.ka_ids
          // 福利卡支付价格
          if (this.wxprice != 0) {
            // 微信支付
            if (!this.isWeiXin()) {
              this.$toast("请使用微信打开进行支付")
              this.isLoading = false
              return;
            }
            this.wxpay(this.ka_ids)

          } else {
            // console.log("卡够了");
            // 去福利卡支付
            if (this.dkprice != 0) {
              // console.log("卡支付")
              this.isShow = true
            }
          }
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 协议
    getsinglelist() {
      getsingle({
        type: this.type,
        flag: '2'
      }).then(res => {
        // console.log(res);
        this.goumaixuzhi = res.data.content
      })
    },
    // 福利卡列表
    getcard() {
      this.result = []
      getcardList().then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.cardList = res.data.card_list
          if (this.cardList.length !== 0) {
            this.result.push(this.cardList[0].id)
          }
          // console.log(res.data.card_list);
        }
      })
      if (!this.flagA) {
        getPhone().then(res => {
          // console.log(res, "电话");
          if (res.code == 200) {
            this.phone = res.data.all_phone
          }
        })
      } else {
        this.phone = this.address_Item.phone
      }
    },
    // 调取微信支付
    onBridgeReady(params, order_no) {
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
              this.getcard()
              setTimeout(() => {
                that.$toast('支付成功');
                that.$router.replace({path: "/order", query: {tabIndex: 1}})
                // window.location.href = this.$store.state.Shopbase + "/orderInfo?tabIndex=0&token=" + localStorage.getItem("token")
              }, 1000)
            } else if (res.err_msg === "get_brand_wcpay_request:fail") {
              that.$toast('支付失败');
            }
            if (res.err_msg) {
              pay_success({
                order_no
              }).then(res => {
                that.$toast(res.msg)
                if (res.code == 200) {

                }
              })
            }
          });
    },
  }
  ,
  mounted() {

    document.body.scrollTop = 0

// firefox

    document.documentElement.scrollTop = 0

// safari

    window.pageYOffset = 0
  }
};
</script>

<style scoped lang="less">
.orderpaybox {
  padding: 10px;
  background-color: #F0F0F0;
  padding-bottom: 100px;
  min-height: 100vh;
  box-sizing: border-box;
}

.takeFood {
  background-color: white;
  border-radius: 10px;
  padding: 15px;

  .storename {
    font-size: 18px;
    font-weight: bold;
  }

  .storeaddress {
    color: #474747;
    font-size: 15px;
    margin-top: 6px;
  }

  .pickupMethodBox {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 30px;

    .pickupMethod {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 39%;
      border: 2px solid #D4D4D4;
      border-radius: 5px;
      padding: 8px;
      position: relative;

      .circle {
        position: absolute;
        top: -7px;
        right: -7px;
        background-color: black;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .imgBox {
        width: 34px;
      }

      .titleBox {
        font-size: 15px;

        .title {
          color: #6B6B6B;
        }

        .text {
          color: #ADADAD;
          margin-top: 2px;
        }

        .title2 {
          color: #2B2B2B;
          font-weight: bold;
        }

        .text2 {
          color: #919191;
        }
      }
    }

    .pickupMethod2 {
      border: 2px solid #FFD873;
    }
  }
}

.box {
  margin-top: 10px;
}

.phoneBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;

  .connection {
    font-weight: bold;
  }

  .receive {
    color: #DC5457;
    font-size: 12px;
    margin-top: 5px;
  }

  .phone {
    font-size: 15px;
  }
}

.instructions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F5F5F5;

  .s1 {
    font-size: 16px;
    font-weight: bold;
  }

  /deep/ .van-checkbox__label {
    margin-left: 5px;
  }
}

.goodDetail {
  padding-bottom: 19px;
  border-bottom: 1px solid #F5F5F5;
  font-size: 16px;
  font-weight: bold;
}

.goodList {
  .goodItem {
    display: flex;
    align-items: center;
    margin-top: 20px;
    gap: 10px;

    .goodImg {
      width: 90px;
    }

    .items {
      font-size: 13px;
      color: #888888;
      margin-top: 8px;

      .item2Name {
        margin-top: 5px;
      }
    }

    .rightBox {
      width: calc(100% - 110px);
    }

    .quantityBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;

      .quantity {
        font-weight: 500;
      }

      .priceBox {
        font-weight: bold;
        font-size: 19px;
      }

      .priceBox span {
        font-size: 13px;
      }
    }
  }
}

.unfoldBox {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8D8D8D;
  font-size: 14px;
  gap: 3px;
  margin-top: 20px;

  .unfold {
    width: 11px;
  }

  .unfold2 {
    transform: rotate(180deg);
  }
}

.deliveryPrice {
  font-weight: bold;
  font-size: 18px !important;
}

.deliveryPrice span {
  font-size: 13px;
}

//底部按钮
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 88px;
  z-index: 100;

  .footerBtn {
    background-color: #3A3A3A;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 86%;
    margin: auto;
    padding-left: 20px;
    box-sizing: border-box;

    .cartIconBox {
      display: flex;
      align-items: center;
      gap: 9px;
      color: #939393;

      .cartIcon {
        width: 34px;
        position: relative;

        .number {
          position: absolute;
          top: -14px;
          left: 31px;
          background-color: #FFD861;
          border-radius: 50%;
          color: #2C2610;
          min-width: 18px;
          min-height: 18px;
          text-align: center;
          line-height: 18px;
          font-size: 15px;
        }
      }

      .cartPrice {
        color: white;

        .priceText {
          font-size: 24px;
        }
      }

      .deliveryPrice {
        color: white;
        font-size: 12px;
        margin-bottom: 3px;
      }
    }

    .order {
      text-align: center;
      background-color: #FFD861;
      color: #3E3418;
      border-radius: 50px;
      width: 35%;
      height: 100%;
      padding: 11px 0px;
      font-weight: bold;

      .orderText {
        font-size: 12px;
        margin-top: 2px;
      }
    }
  }

  .footerBtn2 {
    background-color: #D42B1D;
  }

  .footerBtn3 {
    background-color: #0E6941;
  }

  .footerBtn6 {
    background-color: #21286B;
  }
}
</style>
