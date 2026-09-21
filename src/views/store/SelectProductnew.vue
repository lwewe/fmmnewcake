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

            <div v-for="(item3, index3) in item2.menuVoList" :key="item3.id" class="rightItem">
              <div class="shopImg">
                <img class="img" :src="item3.productImage ||
                  ''
                  " alt="商品图片" @error="handleImgError($event, item3)">
              </div>
              <!-- 商品名称和价格 -->
              <div class="productNameBox">
                <div class="productName">
                  {{ item3.nameCn || '未知商品' }} <!-- 商品名称用 nameCn -->
                </div>
                <div class="priceBox">
                  <div class="price">
                    ￥<span class="eatInPrice">{{ item3.price || item3.amount || 0
                    }}</span> <span
                      style="color: #666666;text-decoration: line-through;" v-if=" item3.price < item3.originalPrice" >{{ item3.originalPrice }}</span>
                  </div>

                  <!-- 修改这里：根据goodsType决定显示什么 -->
                  <div v-if="item3.goodsType === 1" class="select" :class="{ select2: num2 == 2, select6: num1 == 6 }">
                    <van-icon style="height: 30px;line-height: 30px" size="20.222px" v-if="!item3.count"
                      :color="num2 == 1 ? '#febb0c' : '#0d6840'" @click="addCart(item3)" name="add" />
                    <van-stepper v-else @change="editshop(item3)" theme="round" min="0" v-model="item3.count"
                      disable-input />
                  </div>

                  <div v-else-if="item3.goodsType === 2 || item3.goodsType === 3" class="select"
                    :class="{ select2: num2 == 2, select6: num1 == 6 }"
                    @click="godetail(item3.id || item3.itemId, storeid, item3.goodsType)">
                    选规格
                  </div>

                  <div v-else>

                    <van-icon style="height: 30px;line-height: 30px" size="20.222px" v-if="!item3.count"
                      @click="addCart(item3)" name="add" />
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
                :src="item.imageUrl || item.productImage || item.img ||
                  (item.detail ? (item.detail.imageUrl || item.detail.product_img || item.detail.image || item.detail.img) : '')"
                alt="">
            </div>
            <div class="listRight">
              <div class="cartShopTitle">
                {{ item.nameCn || item.productName || item.goodsName || '未知商品' }}
              </div>
              <div class="label" v-if="item.specifications && item.specifications.trim() !== ''">
                {{ item.specifications }}
              </div>
              <div class="shopNumBox">
                <!-- {{ item }} -->
                <div class="numPrice">
                   ￥<span>{{ (item.fullPrice || parseFloat(item.price) || 0).toFixed(2) }}</span>
                </div>
                <div>
                  <van-stepper @change="editshopnum(item.id, item.count, index)" v-model="item.count" min="0"
                    disable-input />
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
import { getdbtext, getAddCollect, getCollect, CateringMenus } from '@/api/service'
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
      isCollect: 0,
      categoryCodes: ''
    };
  },
  destroyed() {
    // sessionStorage.removeItem("goods")
  },
  methods: {
    //左侧栏目
    getArrayLength(item) {
      // 麦当劳特化处理
      if (this.num1 == 1) {
        return item.menuVoList ? item.menuVoList.length : 0;
      }

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

      // 麦当劳特化处理
      if (this.num1 == 1) {
        if (item.menuVoList && item.menuVoList.length > 0) {
          return [{ menuVoList: item.menuVoList }];
        }
        return [];
      }


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

    // 辅助方法：获取商品价格
    getProductPrice(item) {
      // 麦当劳特殊处理
      if (this.num1 == 1) {
        // 如果商品有 price 字段（已转换的元），直接使用
        if (item.price !== undefined) {
          return parseFloat(item.price) || 0;
        }
        // 否则尝试从 salesPrice 转换（分转元）
        if (item.salesPrice !== undefined) {
          return item.salesPrice / 100;
        }
      } else if (this.num1 == 2 && !this.flag) {
        // 肯德基自取：使用 priceHead
        return item.priceHead || item.price || 0;
      }

      // 默认处理
      return item.price || item.amount || item.priceInfo?.eatInPrice || 0;
    },

    // 同步购物车数据到商品列表
    syncCartToProductList() {
      // 遍历左侧分类
      this.leftprolist.forEach(category => {
        // 获取该分类下的商品
        if (category.menuVoList && Array.isArray(category.menuVoList)) {
          category.menuVoList.forEach(product => {
            // 重置数量为0
            product.count = 0;

            // 查找购物车中对应的商品
            const cartItem = this.shopcarlist.find(item => {
              // 多种可能的ID匹配方式
              const productId = product.id || product.productId || product.linkId;
              const cartProductId = item.id || item.productId || item.linkId;

              return productId && cartProductId && productId.toString() === cartProductId.toString();
            });

            // 如果购物车中有这个商品，同步数量
            if (cartItem) {
              product.count = cartItem.count;
            }
          });
        }
      });
    },

    // 添加商品到购物车
    addCart(item3) {
      // 检查商品类型：只有goodsType为1的单品可以直接加入购物车
      if (item3.goodsType !== 1 && item3.goodsType !== undefined) {
        // 如果是套餐或多规格产品，跳转到详情页
        this.$toast("请选择规格");
        this.godetail(item3.id || item3.itemId, this.storeid, item3.goodsType);
        return;
      }

      // 增加商品数量
      item3.count = (item3.count || 0) + 1;

      // 获取商品ID
      let productId = item3.id || item3.productId || item3.linkId;

      // 查找购物车中的商品
      const existingIndex = this.shopcarlist.findIndex(item => {
        const cartProductId = item.id || item.productId || item.linkId;
        return cartProductId && productId && cartProductId.toString() === productId.toString();
      });

      if (existingIndex === -1) {
        // 商品不存在，添加到购物车
        const cartItem = {
          ...item3,
          storeid: this.storeid,
          id: productId,
          productId: productId,
          price: this.getProductPrice(item3),
          nameCn: item3.nameCn || item3.goodsName || item3.productName,
          count: item3.count
        };

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

    // 编辑商品数量
    editshop(item3) {
      // 只有单品可以直接编辑数量
      if (item3.goodsType !== 1 && item3.goodsType !== undefined) {
        this.$toast("请进入详情页修改规格");
        return;
      }

      // 获取商品ID
      let productId = item3.id || item3.productId || item3.linkId;

      // 查找购物车中的商品
      const existingIndex = this.shopcarlist.findIndex(item => {
        const cartProductId = item.id || item.productId || item.linkId;
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
            id: productId,
            productId: productId,
            price: this.getProductPrice(item3),
            nameCn: item3.nameCn || item3.goodsName || item3.productName,
            count: item3.count
          };

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
    },

    delCart() {
      // 清空当前门店的购物车
      if (sessionStorage.getItem("goods")) {
        const allGoods = JSON.parse(sessionStorage.getItem("goods"));
        // 过滤掉当前门店的商品
        const remainingGoods = allGoods.filter(item =>
          item.storeid !== this.$route.query.storeid &&
          item.storeCode !== this.$route.query.storeid
        );

        sessionStorage.setItem("goods", JSON.stringify(remainingGoods));
      }

      this.shopcarlist = [];
      this.showBottom = false;
      sessionStorage.removeItem("goods")

      this.$toast("已清空购物车");

      // 重新加载页面商品列表以更新数量
      this.getMDLProduct()
    },


    // 更改购物车内的商品数量
    // 更改购物车内的商品数量
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

      // 存储和计算总价 - 保存整个购物车
      const allGoods = JSON.parse(sessionStorage.getItem("goods") || "[]");

      // 找到并更新或删除
      const existingIndex = allGoods.findIndex(item =>
        item.id === itemid &&
        item.storeid === this.shopcarlist[index]?.storeid
      );

      if (count == 0) {
        // 删除
        if (existingIndex >= 0) {
          allGoods.splice(existingIndex, 1);
        }
      } else {
        // 更新
        if (existingIndex >= 0) {
          allGoods[existingIndex].count = count;
        }
      }

      sessionStorage.setItem("goods", JSON.stringify(allGoods));

      // 重新计算总价
      this.getSumPrice();

      // 重新加载购物车
      this.loadCartItems();
    },

    // 获取总价 - 修复
    getSumPrice() {
      this.sumPrice = 0;
      this.shopcarlist.forEach(item => {
        const price = item.fullPrice || item.price || 0;
        this.sumPrice += item.count * parseFloat(price);
      });
      console.log('总价计算:', this.sumPrice);
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
     // 新增：验证所有规格选择
validateAllSpecs() {
  for (const spec of this.specs) {
    // 跳过已包含的规格（specType: 1）
    if (spec.specType === 1) continue;
    
    const selectedCount = this.getSelectedCount(spec);
    
    if (spec.specType === 3) { // 多选规格
      // 检查最小选择数量
      if (spec.minQuantity > 0 && selectedCount < spec.minQuantity) {
        this.$toast(`${spec.specName} 至少需要选择 ${spec.minQuantity} 个（当前选了 ${selectedCount} 个）`);
        return false;
      }
      
      // 检查最大选择数量
      if (spec.maxQuantity > 0 && selectedCount > spec.maxQuantity) {
        this.$toast(`${spec.specName} 最多只能选择 ${spec.maxQuantity} 个（当前选了 ${selectedCount} 个）`);
        return false;
      }
    } else if (spec.specType === 2) { // 单选规格
      if (spec.minQuantity > 0 && selectedCount === 0) {
        this.$toast(`请选择 ${spec.specName}`);
        return false;
      }
    }
  }
  return true;
},
// 修改：处理选项点击
handleOptionClick(spec, clickedOption) {
  if (spec.specType === 1) {
    // 已包含的规格不能修改
    this.$toast('此规格已包含，无需选择');
    return;
  }
  
  if (spec.specType === 3) { // 多选规格
    // 获取当前已选择数量
    const currentSelected = this.getSelectedCount(spec);
    
    // 如果点击的是已选中的选项，可以取消（但要检查是否低于最小要求）
    if (clickedOption.selected) {
      // 检查取消后是否低于最小要求
      if (spec.minQuantity > 0 && currentSelected - 1 < spec.minQuantity) {
        this.$toast(`${spec.specName} 至少需要选择 ${spec.minQuantity} 个，不能取消`);
        return;
      }
      clickedOption.selected = false;
    } else {
      // 如果点击未选中的选项，检查是否超过最大要求
      if (spec.maxQuantity > 0 && currentSelected >= spec.maxQuantity) {
        this.$toast(`${spec.specName} 最多只能选择 ${spec.maxQuantity} 个`);
        return;
      }
      clickedOption.selected = true;
    }
  } else if (spec.specType === 2) { // 单选规格
    // 先取消所有选项
    spec.options.forEach(opt => opt.selected = false);
    // 选中当前选项
    clickedOption.selected = true;
  }
},
    // 点击选好了跳转到支付
    paymentpage() {
      if (this.shopcarlist.length == 0) {
        this.$toast('请先选择商品');
        return;
      }

      if (!this.openStatus) {
        this.$toast('门店未营业');
        return;
      }

      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 10000
      });

      // 构建符合新API要求的商品数据
      const goodsData = this.shopcarlist.map(item => {
        // 处理规格选项 - 从商品的detail或selectedData中获取
        let specOptions = [];

        // 如果商品有规格选择（goodsType为2或3）
        if (item.goodsType === 2 || item.goodsType === 3) {
          // 从商品详情中获取选中的规格
          if (item.selectedData && item.selectedData.specs) {
            Object.entries(item.selectedData.specs).forEach(([specId, optionId]) => {
              specOptions.push({
                specId: specId,
                optionId: optionId
              });
            });
          }

          // 处理多选规格
          if (item.selectedData && item.selectedData.multiOptions) {
            Object.entries(item.selectedData.multiOptions).forEach(([specId, optionIds]) => {
              if (Array.isArray(optionIds)) {
                optionIds.forEach(optionId => {
                  specOptions.push({
                    specId: specId,
                    optionId: optionId
                  });
                });
              }
            });
          }
        }

        // 价格处理：salesPrice是分，需要转换为元
        const price = item.salesPrice ? (item.salesPrice / 100) :
          (item.price || item.amount || 0);

        return {
          goodsId: item.productId || item.id || item.goodsId,
          skuId: item.skuId || item.defaultSkuId || '',
          quantity: item.count || 1,
          specOptions: specOptions,
          // 以下字段用于显示，不下单用
          nameCn: item.nameCn || item.goodsName || item.productName,
          price: price,
          imageUrl: item.imageUrl || item.goodsImage || item.productImage,
          goodsType: item.goodsType
        };
      });

      // 构建完整的订单数据
      const orderData = {
        categoryCode: this.$route.query.categoryCode || 'C',
        storeCode: this.storeid || this.$route.query.storeCode,
        packFlag: this.packFlag || '0',
        lng: this.flag ? (this.address_Item?.lon || null) : null,
        lat: this.flag ? (this.address_Item?.lat || null) : null,
        goods: goodsData,
        phoneNo: this.phone || this.address_Item?.phone || '',
        receiverName: this.flag ? (this.address_Item?.contact || null) : null,
        receiverAddress: this.flag ? (this.location || null) : null
      };

      // 存储数据到sessionStorage
      sessionStorage.setItem('orderData', JSON.stringify(orderData));
      sessionStorage.setItem('verify', JSON.stringify(goodsData));
      sessionStorage.setItem('shopcarlist', JSON.stringify(this.shopcarlist));

      // 跳转到支付页面
      setTimeout(() => {
        this.$toast.clear();
        this.$router.push({
          path: '/orderpaynew',
          query: {
            flag: this.flag,
            num1: this.num1,
            num2: this.num2,
            packFlag: this.packFlag,
            type: this.type,
            storeCode: this.storeid,
            shopName: this.productlist?.storeName || this.productlist?.name,
            deliveryPrice: this.productlist?.deliveryPrice || 0
          }
        });
      }, 500);
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
        path: "/productdetailnew",
        query: { num1: this.num1, num2: this.num2, id: id, storeid: storeid, flag: this.flag, packFlag: this.packFlag }
      })
    },


    // 麦当劳num1=1
    // 麦当劳num1=1 - 修正版
    getMDLProduct() {
      let datas = {
        categoryCode: this.$route.query.categoryCode,
        storeCode: this.$route.query.storeCode,
        packFlag: this.$route.query.packFlag,
        orderCode: '',
        lng: '',
        lat: '',
      }

      CateringMenus({ data: JSON.stringify(datas) }).then(res => {
        this.loadingflag = false
        this.alllist = []

        if (res.code == 200) {
          this.storeid = res.data.storeCode;
          this.openStatus = res.data.officialStatus;
          this.productlist = res.data;

          // 检查是否有数据
          if (!res.data.catalogs || res.data.catalogs.length === 0) {
            this.$toast("该门店暂无商品");
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000);
            return;
          }

          // 转换数据结构：将 catalogs 转换为 leftprolist 需要的格式
          this.leftprolist = res.data.catalogs.map(catalog => {
            // 将商品列表转换为统一的 menuVoList 格式
            const menuVoList = (catalog.goodsList || []).map(goods => {
              // 初始化商品计数
              let count = 0;

              // 从购物车中查找对应商品的数量
              if (this.shopcarlist.length > 0) {
                const cartItem = this.shopcarlist.find(item =>
                  item.productId === goods.id ||
                  item.id === goods.id
                );
                if (cartItem) {
                  count = cartItem.count;
                }
              }

              return {
                id: goods.id,
                productId: goods.id,
                linkId: goods.id,
                nameCn: goods.goodsName,
                productName: goods.goodsName,
                productImage: goods.goodsImage,
                imageUrl: goods.goodsImage,
                // 价格处理：分转元
                price: goods.salesPrice ? (goods.salesPrice / 100).toFixed(2) : '0.00',
                amount: goods.salesPrice ? (goods.salesPrice / 100).toFixed(2) : '0.00',
                originalPrice: goods.originalPrice ? (goods.originalPrice / 100).toFixed(2) : '0.00',
                // 根据 goodsType 设置 menuFlag
                menuFlag: goods.goodsType === 3 ? 'C' : 'A', // 多规格产品需要选规格
                count: count, // 购物车数量
                goodsType: goods.goodsType,
                goodsDesc: goods.goodsDesc,
                maxQuantity: goods.maxQuantity || res.data.maxQuantity || 10,
                defaultSkuId: goods.defaultSkuId
              };
            });

            return {
              catalogName: catalog.catalogName,
              catalogImage: catalog.catalogImage,
              menuVoList: menuVoList,
              // 为了兼容原有的 getArrayLength 方法
              menuList: catalog.goodsList || [],
              childClassList: catalog.goodsList || [],
              // 为了兼容原有的模板渲染
              topName: catalog.catalogName,
              name: catalog.catalogName,
              categoryName: catalog.catalogName,
              // 为了 getCurrentArray 方法
              childClassList: [{ menuVoList: menuVoList }]
            };
          });

          // 过滤分类（如果需要）
          const keywords = ["限时", "特惠", "抢购", "热卖", "优惠"];
          this.leftprolist = this.leftprolist.filter(item =>
            !keywords.some(keyword => item.catalogName?.includes(keyword))
          );

          // 重新计算总价
          this.getSumPrice();

          // 设置顶部高度
          this.$nextTick(() => {
            if (this.$refs.topBox) {
              this.topHeight = Number(this.$refs.topBox.getBoundingClientRect().height);
            }
          });

        } else {
          this.$toast(res.message || "获取商品列表失败");
          setTimeout(() => {
            this.$router.go(-1);
          }, 1000);
        }

        // 获取提示文本
        this.getdbtextlist("mdl");

      }).catch(error => {
        this.loadingflag = false;
        this.$toast("加载失败，请重试");
        console.error("获取麦当劳商品失败:", error);
      });
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
    loadCartItems() {
      if (sessionStorage.getItem("goods")) {
        try {
          const allGoods = JSON.parse(sessionStorage.getItem("goods"));

          // 过滤出当前门店的商品
          this.shopcarlist = allGoods.filter(item => {
            // 多种可能的门店ID字段匹配
            return (item.storeid === this.$route.query.storeid) ||
              (item.storeCode === this.$route.query.storeid) ||
              (item.storeCode === this.$route.query.storeCode);
          });

          console.log('加载的购物车商品:', this.shopcarlist);

        } catch (error) {
          console.error('解析购物车失败:', error);
          this.shopcarlist = [];
        }
      }
    }
  },
  mounted() {
    document.body.scrollTop = 0
    // firefox
    document.documentElement.scrollTop = 0
    // safari
    window.pageYOffset = 0
    this.getMDLProduct()
    // if (this.flag) {
    //   this.deliveryPrice = sessionStorage.getItem("deliveryPrice")
    //   if (this.num1 == 1) {
    //     // 获取麦当劳门店商品
    //     this.getMDLProduct()
    //   } else if (this.num1 == 2) {
    //     // 获取肯德基该门店商品
    //     this.getKFCProduct()
    //   } else if (this.num1 == 3) {
    //     // 获取必胜客该门店商品
    //     this.getBSKProduct()
    //   }
    // } else {
    //   if (this.num1 == 3) {
    //     // 获取必胜客该门店商品
    //     this.getBSKProduct()
    //   } else {
    //     this.getMenusList()
    //     this.getShopsDetail()
    //   }
    // }

  },
  created() {
    // 获取num1
    this.num1 = this.$route.query.num1;
    this.num2 = this.$route.query.num2;
    this.flag = this.$route.query.flag;
    this.type = this.$route.query.type;

    this.packFlag = this.$route.query.packFlag;
    console.log(this.$route.query, "this.$route.query")
    console.log(this.$route.query.flag, "this.$route.query.flag==")
    // this.isCollect = this.$route.query.isCollect
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

    // 加载购物车 - 修复逻辑
    this.loadCartItems();
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