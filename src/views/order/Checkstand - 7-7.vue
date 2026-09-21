<template>
  <div class="orderpaybox">
    <NProgress v-if="loadingflag" />
    <!--    选择取餐方式-->
    <div class="takeFood">
      <div v-if="goods.length > 0">
        <div class="storeaddress">
          <div>
            共需支付
          </div>
          <div class="sumprice"><span style="font-size: 12px">￥</span> {{ sumprice.toFixed(2) }}</div>
        </div>
      </div>
    </div>
    <!--    联系方式-->
    <!--    <div class="box takeFood phoneBox">-->
    <!--      <div>-->
    <!--        <div class="connection">联系方式</div>-->
    <!--        <div class="receive">用于接收取餐号</div>-->
    <!--      </div>-->
    <!--      <div class="phone">{{ phone }}</div>-->
    <!--    </div>-->
    <!--    餐品详情-->
    <div class="box takeFood">
      <div class="goodDetail">餐品详情</div>
      <div class="goodList">
        <div v-for="(item, index) in goods" :key="index" class="goodItem">
          <div class="rightBox">
            <div>{{ item.itemName || item.goodName || item.nameCn || item.detail.product_name || item.detail.title }}</div>
            <div class="quantityBox">

              <div class="priceBox" v-if="num1 == 5 && item.fullPrice"><span>￥</span>

                {{ item.fullPrice }}

                <span class="quantity">x {{ item.count || item.quantity }}</span>
              </div>

              <div class="priceBox" v-else><span>￥</span>

                {{ item.detail ? item.detail.salePrice : num1 == 2 ? item.priceHead :
                  item.sumprice || item.price || item.fullPrice||item.oPrice}}

                <span class="quantity">x {{ item.count || item.quantity }}</span>
              </div>




            </div>
          </div>
        </div>
      </div>
      <div class="subtotal">
        共{{ goods.length }}件，小计: <span>{{ sumprice.toFixed(2) }}</span>
      </div>
    </div>
    <!--    配送费-->
    <div class="box takeFood phoneBox">
      <div>
        <div class="connection">其他信息</div>
        <div class="receive">店铺: {{ shopName }}</div>
      </div>
    </div>
    <!--     支付方式-->
    <div class="box">
      <!-- -->
      <Payment :result1="result" :cardList="cardList" @getResult="getResult"></Payment>
    </div>
    <!--    支付密码-->
    <PayPassword :isShow="isShow" @input="input" @onInput="onInput"></PayPassword>
    <!--    底部按钮-->
    <div class="footer">
      <div class="footerBtn" :class="{ footerBtn2: num2 == 1, footerBtn3: num2 == 2, footerBtn6: num1 == 6 }">
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
          <div>确认支付</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Payment from '@/components/Payment.vue';
import PayPassword from "@/components/PayPassword.vue";
import { getcardList, getcardPay, flkpay, wxpay, pay_success } from "@/api/pay.js"
import {
  getsingle,
  getPhone,
  getOderList,
  showorder,
  getDiancanCard,
  diancanPay_date,
  diancanflkpay, diancanwxpay, diancanpay_success, getOderdetail
} from '@/api/service'
// getorderdetail
import { List } from 'vant';

export default {
  components: { Payment, PayPassword },
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
      address_Item: {},
      shopName: "",
      orderid: '',
      isOld: false,
      shop: 0
    };
  },
  created() {
    if (localStorage.getItem("openid")) {
      this.openid = localStorage.getItem("openid")
    }
    this.flagA = this.$route.query.flag
    this.shopName = this.$route.query.shopName
    this.deliveryPrice = this.$route.query.deliveryPrice
    this.orderid = this.$route.query.orderid
    this.shop = this.$route.query.shop

    if (this.flagA) {
      if (sessionStorage.getItem('address_Item')) {
        this.address_Item = JSON.parse(sessionStorage.getItem('address_Item'))
        this.location = this.address_Item.addr
        this.locationdetail = this.address_Item.contact
        this.address_id = this.address_Item.id
      }
      this.packFlag = 2
    }

    // 统一从 goods 获取
    let goodsData = JSON.parse(sessionStorage.getItem("goods")) || [];
    console.log('原始商品数据:', goodsData);
    // 去重
    const uniqueMap = new Map();
    goodsData.forEach(item => {
      const key = item.productId || item.linkId || item.code || item.specifications || JSON.stringify(item);
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
      // const key = item.specifications || item.code || item.linkId || '';
      // if (!uniqueMap.has(key)) {
      //   uniqueMap.set(key, item);
      // }
    });


    // 格式化数据，添加显示字段
    // 格式化数据，添加显示字段
    const formattedGoods = Array.from(uniqueMap.values()).map(item => {
      // 获取商品名称（兼容多个品牌）
      let goodsName = '';
      if (item.detail) {
        goodsName = item.detail.product_name ||   // 麦当劳
          item.detail.name ||           // 肯德基/其他
          item.detail.title ||          // 其他
          item.detail.productName ||
          '';
      }
      if (!goodsName) {
        goodsName = item.itemName || item.nameCn || item.goodName || item.name || '商品';
      }

      // 获取商品图片
      let goodsImage = '';
      if (item.detail) {
        goodsImage = item.detail.product_img || item.detail.image || item.detail.img || '';
      }
      if (!goodsImage) {
        goodsImage = item.itemImage || '';
      }

      return {
        ...item,
        itemName: goodsName,
        itemImage: goodsImage,
        specifications: item.specifications || '',
        count: item.count || 1,
        quantity: item.count || 1,
        price: item.fullPrice || item.price,
        fullPrice: item.fullPrice || item.price,
        sumprice: item.fullPrice || item.price,
        detail: item.detail
      };
    });

    this.verify = formattedGoods;
    this.goods = formattedGoods;

    // 🔧 统一计算总价（关键修改）
    this.sumprice = 0;
    formattedGoods.forEach(item => {
      const price = item.fullPrice || item.price || 0;
      const count = item.count || 1;
      this.sumprice += price * count;
    });

    // 外卖模式加上配送费
    if (this.flagA === 'true' || this.flagA === true) {
      this.sumprice += Number(this.deliveryPrice) || 0;
    }

    console.log('计算的总价:', this.sumprice);

    this.num1 = this.$route.query.num1
    this.num2 = this.$route.query.num2
    this.type = this.$route.query.type
    this.deliveryPrice = Number(this.$route.query.deliveryPrice).toFixed(2)

    if (this.num1 == 3 && !this.flagA) {
      this.packFlag = 1
    }

    this.isOld = this.num1 == 1 && this.flagA || this.num1 == 2 && this.flagA || this.num1 == 3

    if (this.shop == 1) {
      this.getDiancanCard()
      this.getorderdetail()
    } else {
      if (this.isOld) {
        this.getcard()
        // 🔧 注意：这里不要再重复累加 sumprice，否则会翻倍
        this.shopcarlist = this.verify;
      } else {
        this.getDiancanCard()
        this.shopcarlist = this.verify;
        this.showorder()
      }
      this.storecode = this.shopcarlist[0]?.storeCode || this.shopcarlist[0]?.storeId || goodsData[0]?.storeid;
    }
  },
  methods: {
    getorderdetail() {

      getOderdetail({
        type: this.type,
        id: this.orderid
      }).then(res => {
        if (res.code == 200) {
          this.goods = res.data.order_show.goods
          this.sumprice = Number(res.data.order_show.zongji)
        }
      })
    },
    showorder() {
      showorder({
        oid: this.orderid
      }).then(res => {
        if (res.code == 200) {
          this.sumprice = Number(res.data.zongji)
        }
      })
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
        if (this.isOld) {
          this.flkpay(this.pass)
        } else {
          this.diancanflkpay(this.pass)
        }
        this.pass = ""
      }
    },
    // 福利卡支付
    // 福利卡支付
    flkpay(pass) {
       
 const simpleGoods = this.formatGoodsData(false);
      let data = {
        ka_ids: this.ka_ids,
        pass,
        storeCode: this.storecode,
        type: this.type,
        packFlag: this.packFlag,
        orderType: this.packFlag,
        phone: this.phone,
        goods: simpleGoods,
        receiverLng: this.flagA ? this.address_Item.lon : '',
        receiverLat: this.flagA ? this.address_Item.lat : '',
        address_id: this.flagA ? this.address_id : ''
      }

      flkpay(data).then(res => {
        if (res.code == 200 && res.data) {
          this.getcard()
          if (res.code == 200 && res.data) {
            setTimeout(() => {
              this.$router.replace({ path: "/order", query: { tabIndex: 1 } })
              sessionStorage.removeItem("goods")
            }, 1000)
          }
        } else {
          this.$toast(res.msg)
        }
      })
    },
    //   flkpay(pass) {

    // const simpleGoods = this.verify.map(item => {
    //   const detail = item.detail || {};
    //   return {
    //     itemName: detail.name || item.itemName,
    //     itemImage: detail.img || detail.image || item.itemImage,
    //     amount: detail.amount,
    //     discountPrice: item.fullPrice || item.price,
    //     quantity: item.count || item.quantity,
    //     linkId: detail.linkId || item.linkId,
    //     listname: item.specifications || '',
    //     items: item.items || [],  // 保留已有的规格
    //     condimentItems: item.condimentItems || [],
    //     sumprice: ((item.fullPrice || item.price) * (item.count || 1)).toFixed(2)
    //   };
    // });


    //     let data = {
    //       ka_ids: this.ka_ids,
    //       pass,
    //       storeCode: this.storecode,
    //       type: this.type,
    //       packFlag: this.packFlag,
    //       orderType: this.packFlag,
    //       phone: this.phone,
    //       goods: simpleGoods,
    //       receiverLng: this.flagA ? this.address_Item.lon : '',
    //       receiverLat: this.flagA ? this.address_Item.lat : '',
    //       address_id: this.flagA ? this.address_id : ''
    //     }


    //     flkpay(data).then(res => {

    //       if (res.code == 200 && res.data) {
    //         this.getcard()
    //         if (res.code == 200 && res.data) {
    //           setTimeout(() => {
    //             this.$router.replace({path: "/order", query: {tabIndex: 1}})
    //             sessionStorage.removeItem("goods")
    //           }, 1000)
    //         }
    //       } else {
    //         this.$toast(res.msg)
    //       }
    //     })
    //   },
    // 福利卡支付
    diancanflkpay(pass) {
      let data = {
        ka_ids: this.ka_ids,
        pass,
        oid: this.orderid
      }
      diancanflkpay(data).then(res => {
        // console.log(res);
        if (res.code == 200 && res.data) {
          this.getDiancanCard()
          if (res.code == 200 && res.data) {
            setTimeout(() => {
              this.$router.replace({ path: "/order", query: { tabIndex: 1 } })
              sessionStorage.removeItem("goods")
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
      // 格式化 goods，去掉 detail 里的复杂结构
      // const simpleGoods = this.verify.map(item => {
      //   const detail = item.detail || {};
      //   return {
      //     itemName: detail.name || item.itemName,
      //     itemImage: detail.img || detail.image || item.itemImage,
      //     amount: detail.amount,
      //     discountPrice: item.fullPrice || item.price,
      //     quantity: item.count || item.quantity,
      //     linkId: detail.linkId || item.linkId,
      //     listname: item.specifications || '',
      //     items: item.items || [],
      //     condimentItems: item.condimentItems || [],
      //     sumprice: ((item.fullPrice || item.price) * (item.count || 1)).toFixed(2)
      //   };
      // });
 const simpleGoods = this.formatGoodsData(false);

      let data = {
        ka_ids,
        openid: this.openid,
        storeCode: this.storecode,
        type: this.type,
        packFlag: this.packFlag,
        orderType: this.packFlag,
        phone: this.phone,
        goods: simpleGoods,
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
    diancanwxpay(ka_ids = []) {
      let data = {
        ka_ids,
        openid: this.openid,
        oid: this.orderid
      }
      diancanwxpay(data).then(res => {
        if (res.code == 200) {
          this.onBridgeReady(res.data.jsApiParameters, res.data.order_no)
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 去结算
    toPay() {
      // console.log(this.result)
      if (this.result.length == 0 && this.checked == "") {
        this.$toast("请选择支付方式")
        return
      }
      this.$dialog.confirm({
        title: '提示',
        message: '付款后无法退款，请确认后购买',
        confirmButtonColor: 'red',
      }).then(() => {
        if (this.result.length == 0 && this.checked != "") {
          // console.log("微信支付");
          if (!this.isWeiXin()) {
            this.$toast("请使用微信打开进行支付")
            this.isLoading = false
            return;
          }
          // console.log("调用微信支付");
          if (this.isOld) {
            this.wxpay()
          } else {
            this.diancanwxpay()
          }
        } else {
          if (this.isOld) {
            this.isPay_date()
          } else {
            this.diancanPay_date()
          }
        }
      }).catch(() => {

      })

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
     formatGoodsData(needMerge = false) {
    const isMdl = this.type === 'mdl';
    
    // 第一步：转换格式
    let flatGoods = this.verify.map(item => {
      const detail = item.detail || {};
      
      if (isMdl) {
        // ========== 麦当劳格式 ==========
        const comboItems = [];
        if (detail.comboItems) {
          detail.comboItems.forEach(combo => {
            combo.comboProducts?.forEach(product => {
              if (product.isDefault == 1) {
                comboItems.push({
                  choicesCode: combo.choicesCode || '',
                  code: product.code
                });
              }
            });
          });
        }
        
        return {
          itemName: detail.name || item.itemName,
          itemImage: detail.img || detail.image || item.itemImage,
          amount: detail.amount,
          discountPrice: item.fullPrice || item.price,
          quantity: item.count || item.quantity || 1,
          code: detail.code || item.code,
          comboItems: comboItems,
          listname: item.specifications || '',
          sumprice: ((item.fullPrice || item.price) * (item.count || 1)).toFixed(2),
          sumdiscountPrice: ((item.fullPrice || item.price) * (item.count || 1)).toFixed(2)
        };
      } else {
        // ========== 肯德基/必胜客格式 ==========
        const items = [];
        const condimentItems = [];
        
        if (detail.condimentRoundList) {
          detail.condimentRoundList.forEach(round => {
            round.condimentItemList?.forEach(cond => {
              if (cond.defaultSelected == 1) {
                items.push({
                  name: cond.showNameCn || cond.menuCn,
                  count: cond.quantity || 1
                });
                condimentItems.push({
                  condimentLinkId: round.condimentLinkId || '',
                  linkId: cond.linkId,
                  quantity: cond.quantity || 1
                });
              }
            });
          });
        }
        
        return {
          itemName: detail.name || item.itemName,
          itemImage: detail.img || detail.image || item.itemImage,
          amount: detail.amount,
          discountPrice: item.fullPrice || item.price,
          quantity: item.count || item.quantity || 1,
          linkId: detail.linkId || item.linkId,
          items: items.length ? items : (item.items || []),
          listname: item.specifications || '',
          condimentItems: condimentItems.length ? condimentItems : (item.condimentItems || []),
          sumprice: ((item.fullPrice || item.price) * (item.count || 1)).toFixed(2),
          sumdiscountPrice: ((item.fullPrice || item.price) * (item.count || 1)).toFixed(2)
        };
      }
    });
    
    // 第二步：需要去重合并吗？
    if (needMerge) {
      const mergedMap = new Map();
      flatGoods.forEach(item => {
        const key = isMdl ? `${item.code}_${item.listname}` : `${item.linkId}_${item.listname}`;
        if (mergedMap.has(key)) {
          const existing = mergedMap.get(key);
          existing.quantity += item.quantity;
          existing.sumprice = (existing.discountPrice * existing.quantity).toFixed(2);
          existing.sumdiscountPrice = (existing.discountPrice * existing.quantity).toFixed(2);
        } else {
          mergedMap.set(key, { ...item });
        }
      });
      flatGoods = Array.from(mergedMap.values());
    }
    
    return flatGoods;
  },
    // 计算福利卡是否够支付
    isPay_date() {

 

     const finalGoods = this.formatGoodsData(true);

      let data = {
        'fulika': this.result.join(","),
        'storeCode': this.storecode,
        'goods': finalGoods,
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
    // 计算福利卡是否够支付
    diancanPay_date() {
      diancanPay_date({
        fulika: this.result.join(","),
        oid: this.orderid
      }).then(res => {
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
            this.diancanwxpay(this.ka_ids)

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
    // 新福利卡列表
    getDiancanCard() {
      this.result = []
      getDiancanCard().then(res => {
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
            setTimeout(() => {
              that.$toast('支付成功');
              if (that.isOld) {
                that.getcard()
                pay_success({
                  order_no
                }).then(res => {
                  that.$toast(res.msg)
                  if (res.code == 200) {
                    that.$router.replace({ path: "/order", query: { tabIndex: 1 } })
                    sessionStorage.removeItem("goods")
                  }
                })
              } else {
                that.getDiancanCard()
                diancanpay_success({
                  order_no
                }).then(res => {
                  that.$toast(res.msg)
                  if (res.code == 200) {
                    that.$router.replace({ path: "/order", query: { tabIndex: 1 } })
                    sessionStorage.removeItem("goods")
                  }
                })
              }
              // window.location.href = this.$store.state.Shopbase + "/orderInfo?tabIndex=0&token=" + localStorage.getItem("token")
            }, 1000)
          } else if (res.err_msg === "get_brand_wcpay_request:fail") {
            that.$toast('支付失败');
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
    font-size: 13px;
    margin-top: 6px;
    text-align: center;

    .sumprice {
      color: #EE0A24;
      margin-top: 10px;
      font-size: 18px;
      font-weight: bold;
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
    color: #333333;
    font-size: 13px;
    margin-top: 10px;
  }

  .phone {
    font-size: 15px;
  }
}



.goodDetail {
  padding-bottom: 15px;
  border-bottom: 1px solid #F5F5F5;
  font-size: 16px;
  font-weight: bold;
}

.goodList {
  padding-bottom: 15px;
  border-bottom: 1px solid #F5F5F5;

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
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      color: #333333;
    }

    .quantityBox {


      .quantity {
        font-weight: 500;
      }

      .priceBox {
        font-weight: bold;
        font-size: 14px;
        white-space: nowrap;
      }

      .priceBox span {
        font-size: 12px;
        color: #333333;
      }
    }
  }
}

.subtotal {
  padding-top: 15px;
  font-size: 13px;
  text-align: end;

  span {
    color: #DD0F0E;
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