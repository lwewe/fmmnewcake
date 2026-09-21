<template>
  <div class="location">
    <NProgress v-if="loadingflag"/>
    <!--  头部-->
    <div class="topBox">
      <div class="leftBox cartText">
        <div class="nowrap">购物车<span style="font-size: 14px">({{ cartList.length }})</span></div>
        <div class="leftBox address">
          <div class="iconBox">
            <van-icon name="location-o"/>
          </div>
          <div>{{ address }}</div>
        </div>
      </div>
      <div class="manage nowrap" @click="manage" v-if="cartList.length>0">{{ !isDelete ? "管理" : "完成" }}</div>
    </div>
    <!--    无商品-->
    <div class="noneShop" v-if="cartList.length==0&&noneList.length==0&&isShow">
      <div>
        <div class="noneImg">
          <img class="img" src="../../assets/tubiao/gn.png" alt="">
        </div>
        <div class="noneText">您的购物车是空的，快去逛逛吧</div>
        <div class="Strolling" @click="toStrolling">去逛逛</div>
      </div>
    </div>
    <!--    有商品-->
    <div class="haveShop" v-else>
      <!--      <van-checkbox-group v-model="result">-->
      <van-checkbox
          @click="checkOnce(item)"
          class="checkbox"
          :label-disabled="true"
          checked-color="#FA6174"
          v-model="item.isCheckout"
          v-for="(item, index) in cartList"
          :key="item.id"
          :name="item"
          :disabled="(item.product.can_buy != 1 || item.product.status != 1 || item.xinghao.can_buy != 1)&&item.cpbs==2&&!isDelete"
      >
        <div class="shopBox" @click.stop="todetail">
          <div class="shopImg" @click.stop="toDetail2(item.product_id)">
            <img class="img" style="border-radius: 5px;"
                 :src="item.cpbs==1?item.product.thumbnailimage:item.product.image_path" alt="">
          </div>
          <div class="rightBox">
            <div class="shopName" v-if="item.product">{{ item.cpbs == 1 ? item.product.name : item.product.title }}</div>
            <div class="bottle" v-if="item.xinghao">{{ item.cpbs == 1 ? item.xinghao.xinghao : item.xinghao.name }}</div>
            <div class="bottle"
                 v-if="(item.product.can_buy != 1 || item.product.status != 1 || item.xinghao.can_buy != 1)&&item.cpbs==2">
              该商品不支持购买
            </div>
            <div class="priceBox" v-if="item.xinghao">
              <div class="price">￥{{ changePrice1(item.xinghao.price) }}.<span
                  style="font-size: 15px">{{ changePrice2(item.xinghao.price) }}</span></div>
              <div @click="changeNumber(item.id)">
                <van-stepper @change="changeValue" v-model="item.quantity"/>
              </div>
            </div>
          </div>
        </div>
      </van-checkbox>
      <!--      </van-checkbox-group>-->
      <!--      <div class="noneList" v-if="noneList.length>0">-->
      <!--        <div class="model">-->
      <!--&lt;!&ndash;          <div class="modelText">该商品不可售</div>&ndash;&gt;-->
      <!--        </div>-->
      <!--        <van-checkbox-->
      <!--            @click="checkOnce(item)"-->
      <!--            class="checkbox"-->
      <!--            :label-disabled="true"-->
      <!--            checked-color="#FA6174"-->
      <!--            v-model="item.isCheckout"-->
      <!--            v-for="(item, index) in noneList"-->
      <!--            :key="item.id"-->
      <!--            :name="item"-->
      <!--        >-->
      <!--          <div class="shopBox" @click.stop="todetail">-->
      <!--            <div class="shopImg" @click.stop="toDetail2(item.product_id)">-->
      <!--              <img class="img" style="border-radius: 5px;" :src="item.cpbs==1?item.product.thumbnailimage:item.product.image_path" alt="">-->
      <!--            </div>-->
      <!--            <div class="rightBox">-->
      <!--              <div class="shopName">{{ item.cpbs==1?item.product.name:item.product.title }}</div>-->
      <!--              <div class="bottle">{{ item.cpbs==1?item.xinghao.xinghao:item.xinghao.name }}</div>-->
      <!--              <div class="priceBox">-->
      <!--                <div class="price">￥{{ changePrice1(item.xinghao.price) }}.<span-->
      <!--                    style="font-size: 15px">{{ changePrice2(item.xinghao.price) }}</span></div>-->
      <!--                <div @click="changeNumber(item.id)">-->
      <!--                  <van-stepper  @change="changeValue" v-model="item.quantity"/>-->
      <!--                </div>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </van-checkbox>-->
      <!--      </div>-->
    </div>

    <!--    去结算-->
    <div class="footer">
      <div class="allNumber">
        <van-checkbox :disabled="cartList.length==0" @click="selectAll" checked-color="#FA6174" v-model="allChecked">
          全选
        </van-checkbox>
      </div>
      <div class="rightBox">
        <div v-if="!isDelete">
          <div class="all">合计:
            <span class="price">{{ changePrice1(fullPrice) }}</span>
            <span class="priceNum">.{{ changePrice2(fullPrice) }}</span>
          </div>
        </div>
        <div class="toPay" :class="{toPay1:result.length==0}" @click="comfireCart">{{
            !isDelete ? '去结算' : "移除商品"
          }}
          <span v-if="result.length>0">({{ result.length }})</span>
        </div>
      </div>
    </div>
    <!--  tabbar-->
    <NavigationTab :active="1"></NavigationTab>
  </div>
</template>
<script>
import NavigationTab from "@/components/NavigationTab.vue";
import {delCart, editCartNumber, getCartList} from "@/api/cart";

export default {
  name: "ShopCart",
  components: {NavigationTab},
  data() {
    return {
      cartList: [],
      result: [],
      allChecked: false,
      isDelete: false,
      fullPrice: 0,
      numberValue: 0,
      noneList: [],
      loadingflag: true,
      address: "",
      isShow: true
    }
  },
  methods: {
    toDetail2(id) {
      //   this.$router.push({path: "/productDetail", query: {id}})
    },
    // 结束
    comfireCart() {
      if (this.result.length == 0) {
        return
      }
      var cartIds = []
      this.result.forEach(item => {
        cartIds.push(item.id)
      })
      if (this.isDelete) {
        this.$dialog.confirm({
          message: '是否删除这' + this.result.length + "个商品",
          confirmButtonColor: 'red'
        }).then(() => {
          this.isShow = false
          delCart({
            cartIds: cartIds.join(",")
          }).then(res => {
            this.$toast(res.data)
            if (res.code == 200) {
              this.getCart()
              this.manage()
            }
          })
        }).catch(() => {
        })
        return;
      }
      sessionStorage.removeItem("StoreName")
      sessionStorage.removeItem("radio")
      sessionStorage.removeItem("radio")
      sessionStorage.removeItem("isPhone")
      sessionStorage.removeItem("phoneNum")
      sessionStorage.removeItem("dateList")
      sessionStorage.removeItem("greetingList")
      sessionStorage.removeItem("deliveryChargeList")
      var data = {
        cartIds: cartIds.join(","),
        act: 1
      }
      this.$router.push({path: "/confirmOrder", query: {data: JSON.stringify(data)}})
    },
    changeValue(e) {
      this.numberValue = e
    },
    changeNumber(id) {
      editCartNumber({
        id,
        num: this.numberValue
      }).then(res => {
        if (res.code == 200) {
          this.getFullPrice()
        }
      })
    },
    todetail() {

    },
    // 价格处理
    changePrice1(price) {
      return price.toString().includes(".") ? price.toString().split('.')[0] : price
    },
    changePrice2(price) {
      return price.toString().includes(".") ? Number(price).toFixed(2).toString().split('.')[1] : "00"
    },
    // 计算价格
    getFullPrice() {
      this.fullPrice = 0
      this.result = this.cartList.filter(item => item.isCheckout == true)
      this.result.forEach(item => {
        this.fullPrice += Number(item.xinghao.price) * Number(item.quantity)
      })
    },
    // 全选
    selectAll() {
      if (this.cartList.length == 0) {
        return;
      }
      this.allChecked = !this.allChecked
      if (this.allChecked == true) {
        this.cartList.forEach(item => {
          if ((item.product.can_buy != 1 || item.product.status != 1 || item.xinghao.can_buy != 1) && item.cpbs == 2 && !this.isDelete) {
            return
          }
          item.isCheckout = true
        })
      } else {
        this.cartList.forEach(item => {
          item.isCheckout = false
        })
      }
      this.getFullPrice()
    },
    //   复选
    checkOnce(item) {
      if ((item.product.can_buy != 1 || item.product.status != 1 || item.xinghao.can_buy != 1) && item.cpbs == 2 && !this.isDelete) {
        return
      }
      var srry = []
      item.isCheckout = !item.isCheckout
      this.result = this.cartList.filter(item => item.isCheckout == true)
      srry = this.cartList.filter(item2 => {
        if (item2.cpbs == 1 || this.isDelete) {
          return item2
        } else {
          return item2.product.can_buy == 1 && item2.product.status == 1 && item2.xinghao.can_buy == 1
        }
      })
      // console.log(this.result.length , srry.length)
      if (this.result.length == srry.length) {
        this.allChecked = true
      } else {
        this.allChecked = false
      }
      this.getFullPrice()
    },
    //  管理
    manage() {
      this.isDelete = !this.isDelete
      this.cartList.forEach(item => {
        item.isCheckout = false
      })
      this.allChecked = false
      this.result = []
      this.fullPrice = 0
    },
    //   去逛逛
    toStrolling() {
      this.$router.replace('/index')
    },
    // 购物车列表
    getCart() {
      this.cartList = []
      this.noneList = []
      getCartList().then(res => {
        this.loadingflag = false
        this.isShow = true
        if (res.code == 200) {
          if (res.data.cart_list) {
            res.data.cart_list.forEach(item => {
              if (item.product) {
                this.cartList.push({
                  ...item,
                  isCheckout: false
                })
              }
            })
            var cartList = this.cartList
            this.cartList = cartList.filter(item => {
              if (item.cpbs == 1) {
                return item.xinghao
              } else {
                return item.product.can_buy == 1 && item.product.status == 1 && item.xinghao.can_buy == 1&&item.xinghao
              }
            })
            this.noneList = cartList.filter(item => {
              if (item.cpbs == 1) {
                return !item.xinghao
              } else {
                return item.product.can_buy != 1 || item.product.status != 1 || item.xinghao.can_buy != 1 || !item.xinghao
              }
            })
            this.cartList = this.cartList.concat(this.noneList)
          }
        }
      })
    }
  },
  created() {
    this.getCart()
    this.address = sessionStorage.getItem("streetNumber")
  }
}
</script>

<style scoped lang="less">
.location {
  padding: 10px 15px;
  box-sizing: border-box;
  min-height: calc(100vh - 50px);
  background-color: #F7F7F7;
  padding-bottom: 120px;
}

.leftBox {
  display: flex;
  align-items: center;
}

.topBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;

  .cartText {
    gap: 20px;
  }

  .address {
    gap: 5px;
    font-size: 12px;
    color: #A2A2A2;
  }

  .iconBox {
    padding-top: 4px;
  }

  .manage {
    font-size: 14px;
  }
}

.noneShop {
  margin-top: 83px;

  .noneImg {
    width: 174px;
    margin: auto;
  }

  .noneText {
    text-align: center;
    color: #a6a5a5;
    font-size: 13px;
    margin-top: -40px;
  }

  .Strolling {
    background-color: #FA6174;
    border-radius: 5px;
    color: white;
    width: 116px;
    height: 33px;
    text-align: center;
    line-height: 33px;
    margin: auto;
    font-size: 13px;
    margin-top: 10px;
  }
}

.nowrap {
  white-space: nowrap;
}

.haveShop {
  .checkbox {
    background-color: white;
    margin-top: 10px;
    padding: 10px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }

  .shopImg {
    width: 72px;
  }

  .shopBox {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .rightBox {
    width: 70%;
  }

  .shopName {
    font-weight: bold;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

  }

  /deep/ .van-checkbox__label {
    width: 93%;
  }

  .bottle {
    color: #ABABAB;
    font-size: 12px;
    margin-top: 3px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .priceBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 10px;
    margin-top: 20px;

    .price {
      color: #C63533;
      font-weight: bold;
    }
  }

  /deep/ .van-stepper__minus, .van-stepper__plus {
    width: 22px;
    height: 22px;
  }

  /deep/ .van-stepper__plus {
    width: 22px;
    height: 22px;
  }

  /deep/ .van-stepper__input {
    width: 28px;
    height: 24px;
    background-color: transparent;
    font-weight: bold;
    font-size: 16px;
  }
}

/deep/ .van-checkbox__icon .van-icon {
  width: 18px;
  height: 18px;
  line-height: 18px;
  font-size: 13px;
}

.footer {
  position: fixed;
  bottom: 50px;
  left: 0;
  background-color: white;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1800;

  .rightBox {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .toPay {
    background-image: linear-gradient(to right, #fa6174d6, #ff435a);
    color: white;
    border-radius: 30px;
    text-align: center;
    width: 106px;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
  }

  .toPay1 {
    background-image: linear-gradient(to right, #f55c6f78, #fa61749c);
  }

  .allNumber {
    font-size: 15px;
    color: #7a7979;
    font-weight: bold;
  }

  .all {
    font-weight: bold;
    font-size: 15px;

    .price {
      color: #CA4240;
      font-size: 20px;
    }

    .priceNum {
      color: #CA4240;
    }
  }
}

.noneList {
  position: relative;

  .model {
    position: absolute;
    border-radius: 10px;
    z-index: 999;
    height: 100%;
    width: 100%;
    background-color: #b9b9b95c;
    display: flex;
    align-items: center;
    justify-content: center;

    .modelText {
      background-color: #cccccc;
      color: #727272;
      border-radius: 50%;
      height: 75px;
      width: 75px;
      line-height: 75px;
      text-align: center;
      font-size: 12px;
      padding: 10px;
    }
  }
}
</style>