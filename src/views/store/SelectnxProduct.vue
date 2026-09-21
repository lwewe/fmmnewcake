<template>
  <div class="selectproduct">
    <!--    <ReturnBack :rcolor="'#fff'" :bcolor="'rgba(218,218,218,0.26)'"></ReturnBack>-->
    <NProgress v-if="loadingflag" />
    <div ref="topBox">
      <!--     -->
      <van-notice-bar v-if="this.starttime" left-icon="volume-o" :text="text" />
      <!--    头部-->
      <div class="topBox">
        <div class="topLeftBox">
          <div class="storeName">
            <!-- <div class="storeIcon" v-if="!flag">
              <img v-if="num2 == 1" class="img" src="../../assets/backimage/store1.png" alt="">
              <img v-if="num2 == 2 && num1 != 6" class="img" src="../../assets/backimage/store4.png" alt="">
              <img v-if="num1 == 6" class="img" src="../../assets/backimage/store6.png" alt="">
            </div>
            <div class="storeIcon2" v-else>
              <img v-if="num2 == 1" class="img" src="../../assets/backimage/dingwei1.png" alt="">
              <img v-if="num2 == 2" class="img" src="../../assets/backimage/dingwei4.png" alt="">
            </div> -->
            <div v-if="!flag" class="location">{{ productlist.name || productlist.storeName || productlist.shopName }}
            </div>
            <div v-else class="location">配送至:{{ location }}</div>
          </div>
          <div class="addressBox" v-if="!flag">
            <!-- <span>{{ flag ? '外送' : '自取' }} </span> -->
            <span class="address">{{ productlist.address || productlist.storeAddress }}</span>
          </div>
        </div>
      
        <div class="topRightBox" @click="replacestore" v-if="!flag">
          <!-- <div class="replacestore" :class="{ replacestore6: num1 == 6 }">
            <img class="img" v-if="isCollect == 3" src="../../assets/backimage/scc.png" alt="">
            <img class="img" v-else src="../../assets/backimage/sc.png" alt="">
          </div>
          <div class="replaceText">{{ isCollect == 3 ? '已收藏' : '收藏' }}</div> -->
        </div>
      </div>
    </div>
    <!--    点餐列表-->
    <div class="shopList" v-if="leftprolist.length > 0">
      <!--      左侧-->
      <div class="centerLeft" ref="centerLeft" :style="'height: calc(100vh - ' + topHeight + 'px);'">
        <div v-for="(item, index) in leftprolist" :key="index" class="leftproItem" @click="changeCate(item, index)"
          :class="{ leftproItem2: selectCate == index }">
          <div class="leftImg leftImgbsk" :class="{ leftImgbsk2: selectCate == index }" v-if="num1 == 3"
            :style="'background-image: url(' + item.imageCnUrl + ')'"></div>
          <div class="leftImg" v-else>
            <img class="img" :src="item.image || item.imageCnUrl || item.default_image" alt="">
          </div>
          <div class="categoryName"
            :class="{ categoryName2: num2 == 1 && selectCate == index, categoryName3: num2 == 2 && selectCate == index, categoryName6: num1 == 6 && selectCate == index, }">
            {{ item.categoryName || item.topName || item.name }}
          </div>
        </div>
      </div>
      <!--      右侧-->
      <div class="centerRight" :style="'height: calc(100vh - ' + topHeight + 'px);'" @scroll="scrollRightItem()">
        <div v-for="(item, index) in leftprolist" ref="rightItem" :key="item.classId || index" :id="'s' + index">
          <div class="lineTitle" v-if="getArrayLength(item, 'right') > 0">
            <div class="line" :class="{ line2: num2 == 2, line6: num1 == 6 }"></div>
            <div class="category">
              {{ item.topName || item.nameCn || '默认分类' }}
            </div>
          </div>
          <div v-for="(item2, index2) in getCurrentArray(item)" :key="index2">
            <div v-for="(item3, index3) in item2.menuVoList" :key="item3.linkId || index3" class="rightItem">
              <div class="shopImg" :class="{ shopImg2: num1 == 3 || num1 == 5 }">
                <img class="img" :src="item3.productImage || item3.imageUrl ||
                  item3.imageUrlNew?.S ||
                  item3.imageUrlNew?.M ||
                  ''
                  " alt="商品图片" @error="handleImgError($event, item3)">
              </div>
              <!-- 商品名称和价格 -->
              <div class="productNameBox">
                <div class="productName">
                  {{ item3.nameCn || item3.showNameCn || item3.productName || '未知商品' }} <!-- 商品名称用 nameCn -->
                </div>
                <div class="priceBox">
                  <div class="price" :class="{ price2: num2 == 2, price6: num1 == 6 }">
                    ￥<span class="eatInPrice">{{ item3.price || item3.amount || item3.priceInfo.eatInPrice || 0
                      }}</span> <!-- 价格用 price 或 amount -->
                  </div>

                  <div v-if="item3.menuFlag == 'C' || num1 == 1 && flag || num1 == 2 && flag || num1 == 3" class="select"
                    :class="{ select2: num2 == 2, select6: num1 == 6, }"
                    @click="godetail(item2.productId || item3.productId || item2.productCode || item2.linkId || item2.id || item2.itemId || item3.productCode || item3.linkId || item3.id || item3.itemId, storeid)">
                    选规格
                  </div>
                  <div :class="{ stepper: num2 == 2, stepper6: num1 == 6 }" v-else>
                    <!-- v-if="item3.count == 0"  -->
                    <van-icon style="height: 30px;line-height: 30px" size="20.222px" v-if="!item3.count"
                      :color="num2 == 1 ? '#febb0c' : '#0d6840'" @click="addCart(item3)" name="add" />
                    <van-stepper v-else @change="editshop(item3)" theme="round" min="0" v-model="item3.count"
                      disable-input />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="noneBox" v-else>
      暂无商品
    </div>
    <!--    底部按钮-->
    <div class="footer">
      <div class="footerBtn"
        :class="{ footerBtn2: shopcarlist.length > 0 && num2 == 1, footerBtn3: shopcarlist.length > 0 && num2 == 2, footerBtn6: shopcarlist.length > 0 && num1 == 6, }"
        @click="orderpopue">
        <div class="cartIconBox">
          <div class="cartIcon">
            <img v-if="shopcarlist.length == 0" class="img" src="../../assets/backimage/Vector.png" alt="">
            <img v-else class="img" src="../../assets/backimage/Vector-1.png" alt="">
            <div class="number" v-if="shopcarlist.length > 0">{{ shopcarlist.length }}</div>
          </div>
          <div v-if="shopcarlist.length == 0">未选购商品</div>
          <div v-else>
            <div class="cartPrice">
              ￥<span class="priceText">{{ sumPrice.toFixed(2) }}</span>
            </div>
            <div class="deliveryPrice" v-if="flag && productlist.deliveryPrice">
              预估配送费:{{ productlist.deliveryPrice.toFixed(2) }}元
            </div>
          </div>
        </div>
        <div class="order" :class="{ order2: shopcarlist.length > 0, order3: flag }" @click.stop="paymentpage">
          <div>选好了</div>
          <div class="orderText">Order</div>
        </div>
      </div>
    </div>
    <!--    购物车列表-->
    <van-popup v-model="showBottom" position="bottom">
      <div class="popupBox">
        <div class="popupTop">
          <div class="selectedNum">已选餐品 ({{ shopcarlist.length }})</div>
          <div class="delBox" @click="delCart">
            <div class="delIcon">
              <img class="img" src="../../assets/backimage/lajitong.png" alt="">
            </div>
            <div>清空购物车</div>
          </div>
        </div>
        <div class="cartList">
          <div class="shopListItem" v-for="(item, index) in shopcarlist" :key="index">
            <div class="shopImg">
              <img class="img"
                :src="num1 == 3 ? item.detail.imageUrl : item.imageUrl || item.detail.product_img || item.detail.detailImgUrl || item.detail.image || item.detail.img"
                alt="">
            </div>
            <div class="listRight">
              <div class="cartShopTitle">
                {{
                  num1 == 3 ? item.detail.nameCn : item.nameCn || item.detail.product_name || item.detail.title ||
                    item.detail.name
                }}
              </div>
              <div class="label"
                v-if="item.specifications ? item.specifications : num1 == 3 ? (item.detail.name || item.detail.nameCn) : ''">
                {{
                  item.specifications ? item.specifications : num1 == 3 ? (item.detail.name || item.detail.nameCn) : ""
                }}
              </div>
              <div class="shopNumBox">
                <div class="numPrice">
                  ￥<span>{{ num1 == 2 && !flag ? item.priceHead : (item.fullPrice || item.price) }}</span>
                </div>
                <div>
                  <van-stepper @change="editshopnum(num1 == 3 ? item.detail.code : item.shopId, item.count, index)"
                    v-model="item.count" min="0" disable-input />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  getMDLProductList,
  getKFCProductList,
  getMDLVerify,
  getKFCVerify,
  getBSKProductList,
  getXBKProductList, getNXProductList, getNXVerify, getBSKVerify, getXBKVerify
} from "@/api/store";
import { getdbtext, getAddCollect, getCollect } from '@/api/service'
import router from "@/router";
import { all } from 'axios';
import { createNewOrder, getMenusList, getShopsDetail } from "@/api/newOrder";

export default {
  data() {
    return {
      flag: false,          //判断是外送还是自取  外送 true   自取 ""
      num1: 0,              //判断是那个产品
      num2: 0,              //判断是那个类别
      isactive: 0,
      productlist: [],      //商品总列表
      prolist2: [],         //筛选商品总列表合并成为一个列表
      leftprolist: [],      //左侧列表
      products: [],         //右侧商品列表
      showBottom: false,    //是否显示弹框
      shopnum: 1,           //购物车弹框内的数量

      sumPrice: 0,               //总价钱
      value: 1,
      storeid: "",          //该门店id
      alllist: [],
      shopcarlist: [],        //购物车内的商品
      sum1: 0,

      // 获取外卖地址
      location: "",
      locationdetail: "",

      titlename: "",
      ziqushijian: "",
      waimaishijian: "",
      starttime: "",
      endtime: "",
      text: "",

      box: [],
      boxheight: [],

      deliveryPrice: "",
      loadingflag: true,
      openStatus: true,
      //
      topHeight: 0,
      selectCate: 0,
      goods: [],
      address_Item: {},
      type: "",
      isCollect: 0
    };
  },
  destroyed() {
    // sessionStorage.removeItem("goods")
  },
  methods: {
    //左侧栏目
    getArrayLength(item) {
      let array = null;
      if (this.num1 == 3 || (this.num1 == 2 && this.flag)) {
        array = item.menuList;
      } else if (this.num1 == 2 && !this.flag) {
        array = item.childClassList;
      } else if (this.num1 == 1 && this.flag) {
        array = item.productList;
      } else {
        array = item.childClassList;
      }
      return array ? array.length : 0;
    },
    //右侧商品列表
    getCurrentArray(item) {
      // 1. 优先检查外层的menuVoList（API文档要求）
      if (item.menuVoList && Array.isArray(item.menuVoList) && item.menuVoList.length > 0) {
        return [{ menuVoList: item.menuVoList }];
      }

      // 2. 检查childClassList中的menuVoList
      if (item.childClassList && Array.isArray(item.childClassList)) {
        const result = [];
        item.childClassList.forEach(child => {
          if (child.menuVoList && Array.isArray(child.menuVoList) && child.menuVoList.length > 0) {
            result.push({ menuVoList: child.menuVoList });
          }
        });
        if (result.length > 0) return result;
      }

      // 3. 保持原有兼容逻辑（完全不变）
      const childClassList = item.childClassList ?? {};
      const possibleLists = [
        item.menuVoList,
        item.menuList,
        item.productList,
        childClassList.menuVoList,
        childClassList.menuList,
        childClassList.productList
      ];
      const validList = possibleLists.find(list => Array.isArray(list) && list.length > 0) || [];

      if (this.num1 == 3 || (this.num1 == 2 && this.flag) || this.num1 == 2 && !this.flag) {
        return validList.length > 0 ? [{ menuVoList: validList }] : [];
      } else if (this.num1 == 1 && this.flag) {
        return validList.length > 0 ? [{ menuVoList: validList }] : [];
      } else {
        const childList = Array.isArray(item.childClassList) ? item.childClassList : [];
        return childList.length > 0 ? childList : [];
      }
    },

    //右侧商品价格
    getDisplayPrice(item2, item3) {
      // console.log('Debug - num1:', this.num1, 'flag:', this.flag);
      if (this.num1 == 1 && this.flag) {
        return item2?.priceInfo?.eatInPrice || '--';
      } else if ([6, 7, 1, 4].includes(this.num1)) {
        return item3?.price || '--';
      } else if (this.num1 == 2 && !this.flag) {
        return item3?.priceHead || '--';
      } else if (this.num1 == 5) {
        return item3?.priceHead || '--';
      } else {
        return item2?.channelPrice || item3?.price || item2?.price || '--';
      }
    },
    // 修改 addCart 方法，支持所有品牌
    addCart(item3) {
      // 增加商品数量
      item3.count = (item3.count || 0) + 1;

      // 根据品牌类型获取正确的商品ID
      let productId;
      if (this.num1 == 2 && !this.flag) {
        // 肯德基自取：可能使用不同的ID字段
        productId = item3.linkId || item3.productId || item3.id;
      } else if (this.num1 == 3) {
        // 必胜客
        productId = item3.linkId || item3.productId;
      } else {
        // 其他品牌
        productId = item3.productId || item3.linkId || item3.id || item3.itemId;
      }

      // 查找购物车中的商品
      const existingIndex = this.shopcarlist.findIndex(item => {
        const cartProductId = item.productId || item.linkId || item.id || item.itemId;
        return cartProductId && productId && cartProductId.toString() === productId.toString();
      });

      if (existingIndex === -1) {
        // 商品不存在，添加到购物车
        const cartItem = {
          ...item3,
          storeid: this.storeid,
          productId: productId,
          price: this.getProductPrice(item3),
          nameCn: item3.nameCn || item3.showNameCn || item3.productName,
          count: item3.count
        };

        // 如果是肯德基自取，特殊处理价格
        if (this.num1 == 2 && !this.flag) {
          cartItem.priceHead = item3.priceHead || item3.price;
          cartItem.price = item3.priceHead || item3.price;
        }

        this.shopcarlist.push(cartItem);
      } else {
        // 商品已存在，更新数量
        this.shopcarlist[existingIndex].count = item3.count;
      }

      // 同步到 sessionStorage
      sessionStorage.setItem("goods", JSON.stringify(this.shopcarlist));

      // 更新总价
      this.getSumPrice();

      // 提示用户
      this.$toast("已添加到购物车");
    },

    // 辅助方法：获取商品价格
    getProductPrice(item) {
      if (this.num1 == 2 && !this.flag) {
        // 肯德基自取：使用 priceHead
        return item.priceHead || item.price || 0;
      } else {
        // 其他情况
        return item.price || item.amount || item.priceInfo?.eatInPrice || 0;
      }
    },
    // 修改 editshop 方法
    editshop(item3) {
      // 获取商品ID
      let productId;
      if (this.num1 == 2 && !this.flag) {
        productId = item3.linkId || item3.productId || item3.id;
      } else {
        productId = item3.productId || item3.linkId || item3.id || item3.itemId;
      }

      // 查找购物车中的商品
      const existingIndex = this.shopcarlist.findIndex(item => {
        const cartProductId = item.productId || item.linkId || item.id || item.itemId;
        return cartProductId && productId && cartProductId.toString() === productId.toString();
      });

      if (item3.count === 0) {
        // 如果数量为0，从购物车移除
        if (existingIndex !== -1) {
          this.shopcarlist.splice(existingIndex, 1);
          this.$toast("已移除商品");
        }
      } else {
        // 更新购物车中的数量
        if (existingIndex !== -1) {
          this.shopcarlist[existingIndex].count = item3.count;
        } else {
          // 如果购物车中没有，添加进去
          const cartItem = {
            ...item3,
            storeid: this.storeid,
            productId: productId,
            price: this.getProductPrice(item3),
            nameCn: item3.nameCn || item3.showNameCn || item3.productName,
            count: item3.count
          };

          // 如果是肯德基自取，特殊处理价格
          if (this.num1 == 2 && !this.flag) {
            cartItem.priceHead = item3.priceHead || item3.price;
            cartItem.price = item3.priceHead || item3.price;
          }

          this.shopcarlist.push(cartItem);
        }
      }

      // 同步到 sessionStorage
      if (this.shopcarlist.length === 0) {
        sessionStorage.removeItem("goods");
      } else {
        sessionStorage.setItem("goods", JSON.stringify(this.shopcarlist));
      }

      // 更新总价
      this.getSumPrice();

      // 如果需要，可以调用同步
      if (item3.count === 0) {
        // 如果数量为0，确保商品列表也同步
        this.syncCartToProductList();
      }
    },

    delCart() {
      // this.$dialog.confirm({
      //   message: '确定要清空购物车吗？',
      //   confirmButtonColor: '#323233',
      // }).then(() => {
      sessionStorage.removeItem("goods")
      this.shopcarlist = []
      this.showBottom = false
      this.$toast("已清空购物车")
      // }).catch(() => {
      // })
      if (this.num1 == 1) {
        // 获取麦当劳该门店商品
        this.getMDLProduct()
      } else if (this.num1 == 2 && this.flag) {
        alert(2)
        // 获取肯德基该门店商品
        this.getKFCProduct()
      } else if (this.num1 == 3) {
        // 获取必胜客该门店商品
        this.getBSKProduct()
      } else {
        this.getMenusList()
      }
    },
    // 获取总价
    getSumPrice() {
      this.sumPrice = 0
      this.shopcarlist.forEach(item => {
        this.sumPrice += item.count * (this.num1 == 2 && !this.flag ? item.priceHead : (item.fullPrice || item.price))
      })
    },
    // 更改购物车内的商品数量
    // 更改购物车内的商品数量（修复参数问题）
    editshopnum(itemid, count, index) {
      if (count == 0) {
        // 从购物车中移除商品
        this.shopcarlist.splice(index, 1);
        this.$toast("删除商品成功");
      } else {
        // 更新购物车中的数量
        this.shopcarlist[index].count = count;
      }

      // 同步到商品列表
      this.syncCartToProductList();

      // 存储和计算总价
      sessionStorage.setItem("goods", JSON.stringify(this.shopcarlist));
      this.getSumPrice();
    },

    // 同步购物车数据到商品列表
    syncCartToProductList() {
      // 遍历左侧分类
      this.leftprolist.forEach(category => {
        // 获取该分类下的商品
        const productArray = this.getCurrentArray(category);

        productArray.forEach(group => {
          if (group.menuVoList && Array.isArray(group.menuVoList)) {
            group.menuVoList.forEach(product => {
              // 重置数量为0
              product.count = 0;

              // 查找购物车中对应的商品
              const cartItem = this.shopcarlist.find(item => {
                // 多种可能的ID匹配方式
                const productId = product.productId || product.linkId || product.id || product.itemId;
                const cartProductId = item.productId || item.linkId || item.id || item.itemId;

                return productId && cartProductId && productId.toString() === cartProductId.toString();
              });

              // 如果购物车中有这个商品，同步数量
              if (cartItem) {
                product.count = cartItem.count;
              }
            });
          }
        });
      });
    },
    // 点击左侧分类
    changeCate(item, index) {
      let idname = '#s' + index
      this.selectCate = index
      document.querySelector(idname).scrollIntoView(true);
    },
    scrollRightItem() {

    },
    getdbtextlist(titlename) {
      // console.log("aaaa");
      this.starttime = this.productlist.starttime ? this.productlist.starttime : this.productlist.openTime ? this.productlist.openTime.split("T")[1] : '';
      this.endtime = this.productlist.endtime ? this.productlist.endtime : this.productlist.closeTime ? this.productlist.closeTime.split("T")[1] : '';
      getdbtext({
        type: titlename
      }).then(res => {
        this.loadingflag = false
        // console.log(res);
        if (res.code == 200) {
          // console.log(res);
          // this.ziqushijian=res.data.mdldcts
          // if (this.num1 == 1) {
          let data = res.data
          if (this.flag) {
            this.waimaishijian = data.mdlwmts || data.kdjwmts || data.bskwmts || data.xbkwmts || data.nxwmts || data.rxwmts || data.kdwmts
          } else {
            this.ziqushijian = data.mdldcts || data.kdjdcts || data.bskdcts || data.xbkdcts || data.nxdcts || data.rxdcts || data.kddcts
          }
          if (this.flag) {
            this.text = this.waimaishijian + this.starttime + '至' + this.endtime + '。'
          } else {
            this.text = this.ziqushijian + this.starttime + '至' + this.endtime + '。'
          }
        }
      })
    },
    orderpopue() {
      if (this.shopcarlist.length == 0) {
        return;
      }
      this.showBottom = true
    },
    // 点击选好了跳转到支付
    paymentpage() {
      if (this.shopcarlist.length == 0) {
        return;
      }

      if (this.num1 == 1 && this.flag) {
        // 获取麦当劳门店商品
        this.getMDLProduct()
      } else if (this.num1 == 2 && this.flag) {
        // 获取肯德基该门店商品
        this.getKFCProduct()
      } else if (this.num1 == 3) {
        // 获取必胜客该门店商品
        this.getBSKProduct()
      }
      if (!this.openStatus) {
        this.$toast("门店未营业")
        return
      }
      var allgoods = []
      var jiaoyan = []
      var items = []
      if (this.num1 == 1 && this.flag) {
        var comboItems = []
        this.shopcarlist.forEach(item => {
          items = []
          comboItems = []
          item.detail.comboItems.forEach(item2 => {
            item2.comboProducts.forEach(item3 => {
              if (item3.isDefault == 1) {
                items.push({
                  "name": item3.name,
                  "count": item.count
                })
                comboItems.push({
                  'choicesCode': item2.choicesCode,
                  'code': item3.code
                })
              }
            })
          })
          var s = JSON.stringify([{
            "itemName": item.detail.name,
            "itemImage": item.detail.image,
            "amount": item.detail.amount,
            "discountPrice": Number(item.detail.price),
            "quantity": Number(item.count),
            "code": item.detail.code,
            "comboItems": comboItems,
            "items": items,
            "listname": item.specifications,
            "sumprice": (Number(item.count) * Number(item.fullPrice)) + '',
            "sumdiscountPrice": (Number(item.count) * Number(item.fullPrice)) + ''
          }])
          // console.log(JSON.parse(s))
          // return
          if (this.flag) {
            // console.log("外卖");
            var data = {
              apikey: this.$store.state.appkey,
              storeCode: this.$route.query.storeid,
              goods: s,
              receiverLat: this.address_Item.lat,
              receiverLng: this.address_Item.lon
            }
          } else {
            var data = {
              apikey: this.$store.state.appkey,
              storeCode: this.$route.query.storeid,
              goods: s,
            }
          }

          jiaoyan.push(...JSON.parse(s))
          getMDLVerify(data).then(res => {
            if (res.code == 200) {
              // console.log(res);
              allgoods.push(res.data)
              if (this.flag) {
                setTimeout(() => {
                  //  this.$router.push("/orderpay")
                  this.$router.push({
                    path: "/orderpay",
                    query: {
                      flag: this.flag,
                      num1: this.num1,
                      num2: this.num2,
                      deliveryPrice: this.productlist.deliveryPrice, type: "mdl", shopName: this.productlist.name
                    }
                  })
                }, 1000);
              } else {
                setTimeout(() => {
                  //  this.$router.push("/orderpay")
                  this.$router.push({
                    path: "/orderpay",
                    query: { num1: this.num1, num2: this.num2, type: "mdl", shopName: this.productlist.name }
                  })

                }, 1000);
              }
            } else {
              this.$toast(res.msg)
            }
            sessionStorage.setItem("allgoods", JSON.stringify(allgoods))
            var jiaoyan2 = []
            jiaoyan.forEach(item => {
              allgoods.filter(item2 => {
                if (item.code == item2.goods[0].goodsId) {
                  jiaoyan2.push(item)
                }
              })
            })
            sessionStorage.setItem("verify", JSON.stringify(jiaoyan2))
          })
        })
        // 肯德基
      } else if (this.num1 == 2 && this.flag) {
        var condimentItems = []
        this.shopcarlist.forEach(item => {
          items = []
          condimentItems = []
          if (item.detail.menuFlag == 2) {
            item.detail.condimentRoundList.forEach(item2 => {
              item2.condimentItemList.forEach(item3 => {
                if (item3.defaultSelected == 1) {
                  items.push({
                    "name": item3.showNameCn,
                    "count": item3.quantity || item.count
                  })
                  condimentItems.push({
                    "condimentLinkId": item2.condimentLinkId || "",
                    "linkId": item3.linkId,
                    "quantity": item3.quantity
                  })
                }
              })
            })
          } else if (item.detail.menuFlag == 3) {
            item.detail.groupRoundList.forEach(item2 => {
              item2.groupItemList.forEach(item3 => {
                if (item3.defaultSelected == 1) {
                  item.detail.price = item3.price
                  item.childLinkId = item3.linkId
                  items.push({
                    "name": item3.showNameCn,
                    "count": item.count
                  })
                  condimentItems.push({
                    "condimentLinkId": item2.condimentLinkId || "",
                    "linkId": item3.linkId,
                    "quantity": item3.quantity || item.count
                  })
                }
              })
            })
          }
          var s = JSON.stringify([{
            "itemName": item.detail.name,
            "itemImage": item.detail.img,
            "amount": item.detail.amount,
            "discountPrice": Number(item.detail.price) + '',
            "quantity": Number(item.count),
            "linkId": item.detail.linkId,
            "childLinkId": item.childLinkId,
            "items": items,
            "listname": item.specifications,
            "condimentItems": condimentItems,
            "sumprice": (Number(item.count) * Number(item.fullPrice)) + '',
            "sumdiscountPrice": (Number(item.count) * Number(item.fullPrice)) + ''
          }])
          if (this.flag) {
            // console.log("外卖");
            var data = {
              apikey: this.$store.state.appkey,
              storeCode: this.$route.query.storeid,
              goods: s,
              receiverLat: this.address_Item.lat,
              receiverLng: this.address_Item.lon
            }
          } else {
            var data = {
              apikey: this.$store.state.appkey,
              storeCode: this.$route.query.storeid,
              goods: s,
            }
          }
          jiaoyan.push(...JSON.parse(s))
          // sessionStorage.setItem("verify",JSON.stringify(s))
          getKFCVerify(data).then(res => {
            if (res.code == 200) {
              // console.log(res);
              // console.log(allgoods);
              allgoods.push(res.data)
              // console.log(allgoods);
              sessionStorage.setItem("allgoods", JSON.stringify(allgoods))
              var jiaoyan2 = []
              jiaoyan.forEach(item => {
                allgoods.filter(item2 => {
                  if (item.linkId == item2.goods[0].goodsId) {
                    jiaoyan2.push(item)
                  }
                })
              })
              sessionStorage.setItem("verify", JSON.stringify(jiaoyan2))
              if (this.flag) {
                setTimeout(() => {
                  this.$router.push({
                    path: "/orderpay",
                    query: {
                      flag: this.flag,
                      num1: this.num1,
                      num2: this.num2,
                      deliveryPrice: this.productlist.deliveryPrice, type: "kfc", shopName: this.productlist.name
                    }
                  })
                }, 1500)
              } else {
                setTimeout(() => {
                  this.$router.push({
                    path: "/orderpay",
                    query: {
                      num1: this.num1,
                      num2: this.num2,
                      deliveryPrice: this.productlist.deliveryPrice,
                      type: "kfc", shopName: this.productlist.name
                    }
                  })
                }, 1500)
              }

            } else {
              this.$toast(res.msg)
            }
          })
        })
      } else if (this.num1 == 3) {
        var mealRoundList = []
        this.shopcarlist.forEach(item => {
          items = []
          mealRoundList = []
          item.detail.roundList.forEach(item2 => {
            item2.itemList.forEach(item3 => {
              if (item3.defaultSelected == 1) {
                items.push({
                  "name": item3.nameCn,
                  "count": item.count
                })
                mealRoundList.push({
                  'mealRoundId': item2.id,
                  'mealItemList': [{
                    'linkId': item3.linkId,
                    'quantity': item3.quantity || item.count,
                    'condimentItemList': []
                  }]
                })
              }
            })
          })
          var s = JSON.stringify([{
            'count': item.count,
            'itemImage': item.detail.imageUrl,
            'amount': item.detail.amount,
            'discountPrice': Number(item.detail.price),
            'itemName': item.detail.showNameCn,
            'goodlistname': item.specifications ? item.specifications : item.detail.showNameCn,
            'linkId': item.detail.linkId,
            'mealRoundList': mealRoundList,
            'sumprice': (Number(item.fullPrice) * Number(item.count)) + '',
            'sumdiscountPrice': (Number(item.fullPrice) * Number(item.count)) + ''
          }])
          let data = {}
          if (this.flag) {
            data = {
              apikey: this.$store.state.appkey,
              storeCode: this.$route.query.storeid,
              //   orderCode:"",
              goods: s + '',
              orderType: "2",
              receiverLat: this.address_Item.lat,
              receiverLng: this.address_Item.lon
            }
          } else {
            data = {
              apikey: this.$store.state.appkey,
              storeCode: this.$route.query.storeid,
              //   orderCode:"",
              goods: s + '',
              orderType: '1'
            }
          }
          jiaoyan.push(...JSON.parse(s))

          // console.log(data);
          getBSKVerify(data).then(res => {
            // console.log(res);
            if (res.code == 200) {
              allgoods.push(res.data)
              if (this.flag) {
                setTimeout(() => {
                  //  this.$router.push("/orderpay")
                  this.$router.push({
                    path: "/orderpay",
                    query: {
                      flag: this.flag,
                      num1: this.num1,
                      num2: this.num2,
                      deliveryPrice: this.productlist.deliveryPrice, type: "bsk",
                      shopName: this.productlist.storeName
                    }
                  })
                }, 1000);
              } else {
                setTimeout(() => {
                  //  this.$router.push("/orderpay")
                  this.$router.push({
                    path: "/orderpay",
                    query: { num1: this.num1, num2: this.num2, type: "bsk", shopName: this.productlist.storeName }
                  })

                }, 1000);
              }
            } else {
              this.$toast(res.msg)
            }
            sessionStorage.setItem("allgoods", JSON.stringify(allgoods))
            var jiaoyan2 = []
            jiaoyan.forEach(item => {
              allgoods.filter(item2 => {
                if (item.linkId == item2.goods[0].goodsId) {
                  jiaoyan2.push(item)
                }
              })
            })
            sessionStorage.setItem("verify", JSON.stringify(jiaoyan2))
          })
        })
      } else {
        if (this.flag) {
          setTimeout(() => {
            //  this.$router.push("/orderpay")
            this.$router.push({
              path: "/orderpaynx",
              query: {
                flag: this.flag,
                num1: this.num1,
                num2: this.num2,
                deliveryPrice: this.productlist.deliveryPrice, type: this.type,
                shopName: this.productlist.shopName
              }
            })
          }, 1000);
        } else {
          setTimeout(() => {
            //  this.$router.push("/orderpay")
            this.$router.push({
              path: "/orderpaynx",
              query: { num1: this.num1, num2: this.num2, type: this.type, shopName: this.productlist.shopName }
            })

          }, 1000);
        }
      }
    },
    replacestore() {
      // this.$router.go(-1)
      getAddCollect({
        type: this.type,
        storeCode: this.$route.query.storeid
      }).then(res => {
        this.isCollect = res.data

      })
    },
    showCollect() {
      getCollect({
        token: localStorage.getItem("token"),
        type: this.type,
        lng: sessionStorage.getItem("longitude"),
        lat: sessionStorage.getItem("latitude"),
      }).then(res => {
        // console.log(res);
        if (res.code == 200) {
          let aroundlist = res.data.collect_list || []
          if (aroundlist.length > 0) {
            this.isCollect = aroundlist.filter(item => item.dpid == this.storeid).length > 0 ? 3 : 1
          }
        }
      })
    },
    editaddress() {
      this.$router.go(-1)
    },
    // 跳转到商品详情页面
    godetail(id, storeid) {
      console.log(id, "id==")
      this.$router.push({
        path: "/productnxdetail",
        query: { num1: this.num1, num2: this.num2, id: id, storeid: storeid, flag: this.flag }
      })
    },
    // 麦当劳num1=1
    getMDLProduct() {
      let data = {}
      if (this.flag) {
        data = {
          apikey: this.$store.state.appkey,
          receiverLat: this.address_Item.lat,
          receiverLng: this.address_Item.lon
        }
      } else {
        data = {
          apikey: this.$store.state.appkey,
          storeCode: this.$route.query.storeid,
        }
      }
      getMDLProductList(data).then(res => {
        this.loadingflag = false
        this.alllist = []
        this.loadingflag = false
        if (res.code == 200) {
          this.storeid = res.data.storeCode
          this.openStatus = res.data.officialStatus
          this.productlist = res.data
          this.leftprolist = res.data.menu
          console.log(this.productlist, "this.productlist==")
          this.leftprolist = res.data.menu.filter(item => {
            // 排除 categoryName 包含特定关键词的项
            const keywords = ["限时", "特惠", "抢购", "热卖", "优惠"];
            return !keywords.some(keyword => item.categoryName?.includes(keyword));
          });
          setTimeout(() => {
            this.topHeight = Number(this.$refs.topBox.getBoundingClientRect().height)
          }, 200)
        } else {
          this.$toast(res.msg)
          setTimeout(() => {
            this.$router.go(-1)
          }, 1000)
        }
        this.getdbtextlist("mdl")

      })
    },
    // 肯德基num1=2
    getKFCProduct() {
      let data = {}
      if (this.flag) {
        data = {
          apikey: this.$store.state.appkey,
          storeCode: this.$route.query.storeid,
          receiverLat: this.address_Item.lat,
          receiverLng: this.address_Item.lon
        }
      } else {
        data = {
          apikey: this.$store.state.appkey,
          storeCode: this.$route.query.storeid
        }
      }
      console.log(data, "data==")
      getKFCProductList(data).then(res => {
        this.alllist = []
        this.loadingflag = false
        if (res.code == 200) {
          this.storeid = res.data.storeCode
          this.openStatus = res.data.officialStatus
          this.productlist = res.data
          this.leftprolist = res.data.menu
          this.leftprolist = this.leftprolist.filter(item => !item.topName.includes("限时") && !item.topName.includes("特惠") && !item.topName.includes("抢购") && !item.topName.includes("热卖") && !item.topName.includes("优惠"))
          setTimeout(() => {
            this.topHeight = Number(this.$refs.topBox.getBoundingClientRect().height)
          }, 200)
        } else {
          this.$toast(res.msg)
          setTimeout(() => {
            this.$router.go(-1)
          }, 1000)
        }
        this.getdbtextlist("kfc")
      })
    },
    //   必胜客num1=3
    getBSKProduct() {
      let data = {}
      if (this.flag) {
        data = {
          apikey: this.$store.state.appkey,
          storeCode: this.$route.query.storeid,
          orderType: "2",
          receiverLat: this.address_Item.lat,
          receiverLng: this.address_Item.lon
        }
      } else {
        data = {
          apikey: this.$store.state.appkey,
          storeCode: this.$route.query.storeid,
          orderType: "1"
        }
      }
      getBSKProductList(data).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.storeid = res.data.storeCode
          this.openStatus = res.data.officialStatus
          this.productlist = res.data
          this.leftprolist = res.data.menu

          // 修正过滤逻辑：保留"比萨"分类，只过滤其他关键词（原过滤"特惠"会删除第一个分类）
          this.leftprolist = this.leftprolist.filter(item =>
            !item.topName.includes("限时") &&
            !item.topName.includes("抢购") &&
            !item.topName.includes("热卖") &&
            !item.topName.includes("优惠")
            // 去掉 "!item.topName.includes("特惠")"，保留第一个分类
          );

          // 初始化商品 count 属性（用于购物车数量控制）
          this.leftprolist.forEach(item => {
            (item.menuList || []).forEach(product => {
              product.count = 0; // 初始化为 0
              // 从购物车同步已有数量（如果需要）
              this.shopcarlist.forEach(cartItem => {
                if (cartItem.productId === product.linkId || cartItem.linkId === product.linkId) {
                  product.count = cartItem.count;
                }
              });
            });
          });

          setTimeout(() => {
            this.topHeight = Number(this.$refs.topBox.getBoundingClientRect().height)
          }, 200)
        } else {
          this.$toast(res.msg)
          setTimeout(() => {
            this.$router.go(-1)
          }, 1000)
        }
        this.getdbtextlist("bsk")
      })
    },

    //   新菜单
    getMenusList() {
      getMenusList({
        shopId: this.$route.query.storeid
      }).then(res => {
        this.loadingflag = false;
        if (res.code == 200) {
          this.storeid = this.$route.query.storeid;
          this.showCollect();

          this.leftprolist = res.data.filter(item =>
            !item.topName.includes("限时") &&
            !item.topName.includes("抢购") &&
            !item.topName.includes("热卖") &&
            !item.topName.includes("优惠") &&
            !item.topName.includes("单品系列")
          );

          this.leftprolist.forEach(item => {
            let validMenuList = [];
            if (item.menuVoList !== null && item.menuVoList !== undefined) {

              validMenuList = item.menuVoList;
            } else {
              validMenuList = item.childClassList?.menuVoList || [];
            }
            validMenuList = validMenuList.filter(items => {
              const excludeNames = [
                "鸡排+趣鸡球", "脆汁鸡鸡胸+鸡块", "脆汁鸡鸡胸+趣鸡球",
                "脆汁鸡鸡腿+趣鸡球", "鸡排+辣翅", "鸡排+中薯",
                "脆汁鸡鸡胸+辣翅", "脆汁鸡鸡胸+中薯", "那么大鸡排",
                "麦麦脆汁鸡胸", "麦辣鸡翅-2块", "麦麦趣鸡球",
                "爆汁三柠茶(中)", "经典香浓玉米饮", "百事(中)",
                "葡式蛋挞(1只)", "红豆派(1个)", "经典草莓圣代",
                "原味圣代BBN(冲绳黑糖珍珠酱)", "原味冰淇淋原味花筒",
                "川辣嫩牛五方", "新奥尔良烤鸡腿堡"
              ];
              return !excludeNames.some(name => items.nameCn.includes(name));
            });

            // 3. 同步购物车中的 count 数量
            validMenuList.forEach(item2 => {
              item2.count = 0; // 初始化数量

              this.shopcarlist.forEach(item3 => {
                if (item3.productId == item2.productId) {
                  item2.count = item3.count;
                }
              });
            });

            if (item.menuVoList !== null && item.menuVoList !== undefined) {
              item.menuVoList = validMenuList;
            } else if (item.childClassList) {
              item.childClassList.menuVoList = validMenuList;
            }
          });

          setTimeout(() => {
            this.topHeight = Number(this.$refs.topBox.getBoundingClientRect().height);
          }, 200);

        } else {
          this.$toast(res.msg);
          setTimeout(() => {
            this.$router.go(-1);
          }, 1000);
        }
        this.getdbtextlist(this.type);
      });
    },
    //   店铺详情
    getShopsDetail() {
      getShopsDetail({
        id: this.$route.query.storeid
      }).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.productlist = res.data
        }

      })
    },
  },
  mounted() {
    document.body.scrollTop = 0
    // firefox
    document.documentElement.scrollTop = 0
    // safari
    window.pageYOffset = 0

    if (this.flag) {
      this.deliveryPrice = sessionStorage.getItem("deliveryPrice")
      if (this.num1 == 1) {
        // 获取麦当劳门店商品
        this.getMDLProduct()
      } else if (this.num1 == 2) {
        // 获取肯德基该门店商品
        this.getKFCProduct()
      } else if (this.num1 == 3) {
        // 获取必胜客该门店商品
        this.getBSKProduct()
      }
    } else {
      if (this.num1 == 3) {
        // 获取必胜客该门店商品
        this.getBSKProduct()
      } else {
        this.getMenusList()
        this.getShopsDetail()
      }
    }

  },
  created() {
    // 获取num1
    this.num1 = this.$route.query.num1
    this.num2 = this.$route.query.num2
    this.flag = this.$route.query.flag
    this.type = this.$route.query.type
    console.log(this.$route.query, "this.$route.query")
    console.log(this.$route.query.flag, "this.$route.query.flag==")
    this.isCollect = this.$route.query.isCollect
    if (this.flag) {
      const addressItem = sessionStorage.getItem('address_Item');
      if (addressItem) {
        try {
          this.address_Item = JSON.parse(addressItem);
          this.location = this.address_Item.addr + this.address_Item.number;
        } catch (error) {
          console.error('解析address_Item时出错', error);
        }
      }
      console.log(addressItem, "==");
    }
    if (sessionStorage.getItem("goods")) {
      var goods = JSON.parse(sessionStorage.getItem("goods"))
      goods.forEach(item => {
        if (item.storeid == this.$route.query.storeid) {
          this.shopcarlist.push(item)
        }
      })
    }


      // 初始化时同步购物车到商品列表
  this.$nextTick(() => {
    if (this.shopcarlist.length > 0) {
      // 延迟执行，确保商品列表已加载
      setTimeout(() => {
        this.syncCartToProductList();
      }, 500);
    }
  });
    this.getSumPrice()
  },
  watch: {}
};
</script>

<style scoped lang="less">
//头部
.topBox {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;

  background: url(http://yxfmm.bjyxfl.com/imgs/map.png) right no-repeat;
   background-size: contain;

  .topLeftBox {
    .storeName {
      display: flex;
      align-items: center;
      gap: 3px;

      .storeIcon {
        width: 21px;
        min-width: 21px;
      }

      .storeIcon2 {
        width: 15px;
      }

      .location {
        padding-left: 2px;
        width: 100%;
      }
    }

    .addressBox {
      font-size: 13px;
      margin-top: 5px;
      //width: 93%;

      .address {
        color: #727272;
        font-size: 13px;
      }
    }
  }

  .topRightBox {
    .replacestore {
      width: 15px;
      margin: auto;
    }

    .replacestore6 {
      width: 20px;
    }

    .replaceText {
      font-size: 13px;
      text-align: center;
      white-space: nowrap;
      margin-top: 6px;
    }
  }
}

.shopList {
  display: flex;

  //左侧列表
  .centerLeft {
    background-color: #F2F2F2;
    overflow-y: auto;
    width: 18%;
    padding-bottom: 100px;
    box-sizing: border-box;

    .leftproItem {
      padding: 10px 0px 0px;

      .leftImg {
        width: 32px;
        margin: auto;
      }

      .leftImgbsk {
        width: 32px;
        height: 32px;
        background-position: 0px -64px;
        background-size: cover;
      }

      .leftImgbsk2 {
        background-position: 0px 32px;
      }

      .categoryName {
        margin: auto;
        text-align: center;
        margin-top: 1px;
        font-size: 12px;
        color: #777777;
        width: 70%;
        border-bottom: 1px solid #E9E9E9;
        padding-bottom: 10px;
      }

      .categoryName2 {
        color: #AA460D;
      }

      .categoryName3 {
        color: #0C6840;
      }

      .categoryName6 {
        color: #21286B;
      }
    }

    .leftproItem2 {
      background-color: white;
      border-radius: 12px;
    }
  }

  .centerLeft::-webkit-scrollbar {
    display: none
  }

  .centerRight {
    overflow-y: auto;
    width: 82%;
    margin-top: -7px;
    padding-bottom: 100px;
    box-sizing: border-box;

    .line {
      background-color: #A74106;
      width: 2px;
      height: 14px;
    }

    .line2 {
      background-color: #07643B;
    }

    .line6 {
      border: 1px solid #21286B;
    }

    .lineTitle {
      color: #777777;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .category {
      margin: 15px 0px;
    }

    .rightItem {
      padding: 12px 0px;
      margin: 0px 14px 0px 20px;
      border-bottom: 1px solid #F8F8F8;
      display: flex;
      align-items: center;
      gap: 10px;

      .shopImg {
        width: 100px;
      }

      .shopImg2 {
        height: 100px;
        border-radius: 50%;
        overflow: hidden;
      }

      .productNameBox {
        width: calc(100% - 120px);

        .productName {
          font-size: 15px;
          font-weight: bold;
        }
      }

      .priceBox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;

        .price {
          font-size: 12px;
          color: #A63F09;
          font-weight: bold;

          .eatInPrice {
            font-size: 18px;
          }
        }

        .price2 {
          color: #0F6942;
        }

        .price6 {
          color: #21286B;
        }

        /deep/ .van-stepper__input {
          background-color: rgba(242, 243, 245, 0);
          font-size: 14px;
          color: #0A0A0A;
        }

        /deep/ .van-stepper__minus {
          background-color: rgba(242, 243, 245, 0);
          border-radius: 50%;
          border: 1px solid #CACACA;
          width: 18px;
          height: 18px;
        }

        /deep/ .van-stepper__plus {
          background-color: #FEBB0C;
          border-radius: 50%;
          width: 18px;
          height: 18px;
        }

        /deep/ .van-stepper__plus::after {
          background-color: #fff;
        }

        /deep/ .van-stepper__plus::before {
          background-color: #fff;
        }

        .stepper {
          white-space: nowrap;

          /deep/ .van-stepper__plus {
            background-color: #0D6840;
          }

        }

        .stepper6 {
          white-space: nowrap;

          /deep/ .van-stepper__plus {
            background-color: #21286B;
          }

        }

        .select {
          font-size: 12px;
          border-radius: 30px;
          background-color: #F0BC6B;
          width: 62px;
          height: 26px;
          text-align: center;
          line-height: 26px;
        }

        .select2 {
          background-color: #CFE7DC;
        }

        .select6 {
          background-color: #21286b36;
        }
      }
    }
  }

  .centerRight::-webkit-scrollbar {
    display: none
  }
}

//底部按钮
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 88px;
  background-image: linear-gradient(to bottom, #ffffff1f, #ffffffb0);
  z-index: 3000;

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
      color: #979797;
      background-color: #6B6B6B;
      border-radius: 50px;
      width: 35%;
      height: 100%;
      padding: 3px 0px;
      font-weight: bold;

      .orderText {
        font-size: 12px;
        margin-top: 2px;
      }
    }

    .order2 {
      background-color: #FFD861;
      color: #3E3418;
    }

    .order3 {
      padding: 5px 0px;
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

/deep/ .van-popup--bottom {
  height: 50vh;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
}

//购物车
.popupBox {
  padding: 10px 15px;
  padding-bottom: 100px;

  .popupTop {
    display: flex;
    justify-content: space-between;

    .selectedNum {
      font-weight: bold;
    }

    .delBox {
      display: flex;
      align-items: center;
      gap: 2px;
      color: #7C7C7C;
      font-size: 14px;
      padding-top: 4px;

      .delIcon {
        width: 24px;
      }
    }
  }

  .cartList {
    margin-top: 8px;

    .shopListItem {
      display: flex;
      align-items: center;
      gap: 15px;
      border-bottom: 1px solid #F5F5F5;
      padding: 10px 0px;

      /deep/ .van-stepper__input {
        background-color: rgba(242, 243, 245, 0);
        font-size: 16px;
        color: #0A0A0A;
      }

      /deep/ .van-stepper__minus {
        background-color: rgba(242, 243, 245, 0);
        border-radius: 50%;
        border: 1px solid #CACACA;
        width: 23px;
        height: 23px;
      }

      /deep/ .van-stepper__plus {
        background-color: #FEBB0C;
        border-radius: 50%;
        width: 23px;
        height: 23px;
      }

      .shopImg {
        width: 88px;
      }

      .cartShopTitle {
        font-size: 15px;
        font-weight: bold;
      }

      .label {
        color: #686868;
        font-size: 12px;
        background-color: #F1F1F1;
        padding: 3px 5px;
        border-radius: 2px;
        margin-top: 3px;
        display: inline-block;
      }

      .shopNumBox {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin-top: 14px;
      }

      .listRight {
        flex: 1;
      }

      .numPrice {
        font-weight: bold;
        font-size: 13px;
      }

      .numPrice span {
        font-size: 18px;
      }
    }
  }

}

.noneBox {
  text-align: center;
  margin-top: 20px;
  color: #727272;
}
</style>
