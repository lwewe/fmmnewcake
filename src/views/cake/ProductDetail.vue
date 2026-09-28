<template>
  <div class="location">
    <NProgress v-if="loadingflag" />
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>
    <div v-if="detail.id">
      <!--  轮播图 -->
      <div class="banner">
        <van-swipe :autoplay="3000" indicator-color="white" @change="onChange">
          <van-swipe-item class="bannerImg" v-for="item in bannerList" :key="item.id">
            <img class="img" style="object-fit: cover" :src="item.l_path" alt="">
          </van-swipe-item>
        </van-swipe>
        <div class="bannerNum">{{ onIndex }}/{{ bannerList.length }}</div>
      </div>
      <div class="shopInfo">
        <div class="priceBox">
          <div class="price">
            ￥<span>{{ changePrice1(detail.price) }}</span>.{{ changePrice2(detail.price) }}
          </div>
          <div class="label">{{ detail.label_name }}</div>
        </div>
        <div class="shopName">{{ detail.title }}</div>
        <div class="xTitle">{{ detail.description }}</div>
        <!--      选择-->
        <div class="selectBox">
          <!--          规格-->
          <div class="specifications" :style="{ border: item.id == 3 ? 'none' : '' }" v-for="item in selectList" :key="item.id"
            @click="open(item.status, item.id)">
            <div class="leftBox">
              <div class="specificationsImg">
                <img class="img" :src="item.icon" alt="">
              </div>
              <div>
                <div class="specificationsText">{{ item.text }}</div>
                <!--                <div class="tip" v-if="item.id ==2">明日18:00前下单,预计04月07日(周日)18:00前发货</div>-->
              </div>
            </div>
            <div class="iconBox" v-if="item.id != 3">
              <van-icon name="arrow" />
            </div>
          </div>
        </div>
      </div>
      <!--    商品推荐-->
      <div class="shopDetail" style="padding: 0;" v-if="productCake.length > 0">
        <div class="shopDetailTextBox">
          <div class="line"></div>
          <div class="shopDetailText">商品推荐</div>
          <div class="line"></div>
        </div>
        <!--      列表-->
        <div class="listShop">
          <van-swipe indicator-color="#ED3036" @change="onChangeShop">
            <van-swipe-item v-for="(item, index) in Math.ceil(productCake.length / 6)" :key="item.id">
              <ShopList :cake="1" :productList="productCake.slice(index * 6, (index + 1) * 6)"></ShopList>
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
      <!--    商品详情-->
      <div class="shopDetail">
        <div class="shopDetailTextBox">
          <div class="line"></div>
          <div class="shopDetailText">商品详情</div>
          <div class="line"></div>
        </div>
        <div v-if="detail.content && detail.flag == 0">
          <div class="wcontent" v-if="detail.extra_data">
            <div class="distrubtion">
              {{ JSON.parse(detail.extra_data).distrubtion }}
            </div>
            <div v-for="item in detail.content" :key="item.id">
              <img class="img" :src="item.l_path" alt="">
            </div>
          </div>
        </div>
        <div v-if="detail.flag == 1" class="contentFlag">
          <div v-html="detail.content"></div>
        </div>
      </div>
      <!--    底部button-->
      <div>
        <van-goods-action>
          <van-goods-action-mini-btn @click="toCart" :icon="require('../../assets/tubiao/gc.png')" text="购物车" />
          <van-goods-action-mini-btn @click="toKefu" :icon="require('../../assets/tubiao/kfz.png')" text="客服" />
          <van-goods-action-big-btn class="goCart" :class="{ goCart2: detail.can_buy != 1 || detail.status != 1 || can_buy != 1 }"
            text="加入购物车" @click="open('b', 1)" />
          <van-goods-action-big-btn class="toPay" :class="{ toPay2: detail.can_buy != 1 || detail.status != 1 || can_buy != 1 }"
            primary text="立即购买" @click="open('c', 1)" />
        </van-goods-action>
      </div>
      <!--    规格弹窗-->
      <div class="popupBox">
        <van-popup v-model="showAll" position="bottom">
          <div class="popup">
            <div class="close" @click="showAll = false">
              <van-icon size="18px" name="cross" />
            </div>
            <div v-if="selectId == 1">
              <div class="shopBox">
                <div class="shopImg">
                  <img style="border-radius: 5px;object-fit: cover" class="img" :src="detail.image_path" alt="">
                </div>
                <div style="width: 65%;">
                  <div class="modelName">{{ modelName }}</div>
                  <div class="price">￥<span>{{ changePrice1(modelPrice) }}</span>.{{ changePrice2(modelPrice) }}</div>
                </div>
              </div>
              <div>
                <div class="titleBox">
                  <div class="title">规格</div>
                  <div class="speBox">
                    <div class="spe" :class="{ spe1: detail.flag == 1 ? item.ggid == modelId : item.id == modelId }"
                      @click="changemodelId('规格', item)" v-for="(item, index) in model" :key="index">{{ item.name }}
                    </div>
                  </div>
                </div>

                <div class="titleBox" v-if="tasteList.length > 0">
                  <div class="title">口味</div>
                  <div class="speBox">
                    <div class="spe" :class="{ spe1: selectedTaste == taste }" @click="selectedTaste = taste"
                      v-for="(taste, index) in tasteList" :key="index">{{ taste }}
                    </div>
                  </div>
                </div>


                <div class="titleBox valueNumber">
                  <div class="title">数量</div>
                  <div class="speBox">
                    <van-stepper @change="changeNum" v-model="valueNumber" />
                  </div>
                </div>
              </div>
            </div>
            <div v-if="selectId == 2">
              <div class="addressTitle">{{ addList.length > 0 ? '选择收货地址' : '暂无可配送地址' }}</div>
              <div class="address">
                <van-address-list v-model="chosenAddressId" @edit="editAddress" @select="changeDefault" :list="addList"
                  :disabled-list="disabledList" disabled-text="以下地址超出配送范围" />
                <!--                "can_ship": "1", //是否支持商户自配送 1-支持,0-不支持-->
                <!--                "can_same": "0", //是否支持快递配送 1-支持,0-不支持-->
              </div>
            </div>
            <!--          按钮-->
            <div class="footer">
              <div class="button" v-if="status == 'a'">
                <div class="resetting" @click="resetting">加入购物车</div>
                <div class="resetting complete" @click="toConfirmOrder">立即订购</div>
              </div>
              <div class="button" v-if="status == 'b'">
                <div class="resetting" style="width: 100%;" @click="resetting">加入购物车</div>
              </div>
              <div class="button" v-if="status == 'c'">
                <div class="resetting complete" style="width: 100%;" @click="toConfirmOrder">立即订购</div>
              </div>
              <div class="button" v-if="status == 'd'">
                <div class="resetting complete" @click="addNewAddress"
                  style="width: 100%;background-image: linear-gradient(to right,#F55655,#DB0605);">添加新地址
                </div>
              </div>
            </div>
          </div>
        </van-popup>
      </div>
    </div>
  </div>
</template>
<script>
import ShopList from "@/components/ShopList.vue";
import { addCart, dgseladdress, getCakeDetails } from "@/api/detail";
import { mrscaddress } from "@/api/cakeAddress";

export default {
  name: "ProductDetail",
  components: { ShopList },
  data() {
    return {
      bannerList: [],
      onIndex: 1,
      price: 111.65,
      stock: 0,
      keshou: 1,
      selectList: [
        {
          id: 1,
          icon: require("../../assets/tubiao/gg.png"),
          text: "6英寸500g【约200g榴莲肉】",
          status: "a"
        },
        {
          id: 2,
          icon: require("../../assets/tubiao/dz.png"),
          text: "请选择配送地址",
          status: "d"
        },
        {
          id: 3,
          icon: require("../../assets/tubiao/gj.png"),
          text: "偏远地区不发货"
          // （节假日可能延缓发货）
        },
      ],
      showAll: false,
      isHave: false,
      value: "",
      status: null,
      selectId: 2,
      chosenAddressId: '',
      list: [],
      detail: {},
      modelList: [],
      //1-规格 2-重量 3-颜色 4-型号
      model: [],
      weightList: [],
      colourList: [],
      Specifications: [],
      modelId: 1,
      modelName: "",
      modelPrice: "",
      modelTastes: "",
      address_id: "",
      loadingflag: true,
      swiper: null,
      valueNumber: 1,
      addList: [],
      disabledList: [],
      can_buy: "",
      productCake: [],
      setTimer: null,
      delivery: null,

      tasteList: [],        // 新增：口味列表数组
      selectedTaste: '',    // 新增：当前选中的口味
    }
  },
  methods: {
    changeNum(e) {
      this.getDgseladdress(this.modelId)
    },
    onChangeShop() {

    },
    toCart() {
      this.$router.push("/shopCart")
    },
    toKefu() {
      window.location.href = localStorage.getItem("kefu")
    },
    // 修改默认地址
    changeDefault(e) {
      this.selectList[1].text = e.name + e.tel
      this.address_id = e.id
      mrscaddress({
        id: this.address_id
      }).then(res => {
        // this.$toast(res.data)
        this.showAll = false
        if (res.code == 200) {
          this.getDgseladdress(this.modelId)
        }
      })
    },
    // 加入购物车
    // 加入购物车
    resetting() {
      addCart({
        gid: this.detail.flag == 1 ? Number(this.detail.uid) : 0,	//是	num	供应商ID
        flag: Number(this.detail.flag),	//是	num	类型 0-读取接口,1上传
        product_id: this.detail.id,	//是	num	产品ID
        spec_id: Number(this.modelId),	//是	num	型号ID
        quantity: Number(this.valueNumber),	//是	num	数量
        cpbs: this.detail.cpbs,
        taste_name: this.selectedTaste || this.modelTastes
      }).then(res => {
        this.$toast(res.msg)

        if (res.code == 200) {
          this.showAll = false
        }
      })
    },
    editAddress(e) {
      this.$router.push({ path: "/cakeExitAdress", query: { id: e.id } })
    },
    changemodelId(type, item) {
      //1-规格 2-重量 3-颜色 4-型号
      // if (type == "规格") {
      if (this.detail.flag == 1) {
        this.modelId = item.ggid
      } else {
        this.modelId = item.id
      }
      this.modelName = item.name
      this.modelPrice = item.price
      this.can_buy = item.can_buy
      this.modelTastes = item.tastes || ""
      this.selectList[0].text = this.modelName
      this.getDgseladdress(this.modelId)


      // 新增：处理口味列表
      if (item.tastes) {
        this.tasteList = item.tastes.split(',')
        if (this.tasteList.length > 0) {
          this.selectedTaste = this.tasteList[0]
        }
      } else {
        this.tasteList = []
        this.selectedTaste = ''
      }

    },
    // 价格处理
    changePrice1(price) {
      return price.toString().includes(".") ? price.toString().split('.')[0] : price
    },
    changePrice2(price) {
      return price.toString().includes(".") ? Number(price).toFixed(2).toString().split('.')[1] : "00"
    },
    onChange(index) {
      this.onIndex = index + 1
    },
    open(status, id) {
      if (this.detail.can_buy != 1 || this.detail.status != 1 || this.can_buy != 1) {
        this.$toast("该商品不可购买")
        return;
      }
      if (id == 3) {
        return
      }
      if (id == 2 && !localStorage.getItem("token")) {
        if (this.isWeiXin()) {
          this.$router.push("/quickLogin")
        } else {
          this.$router.push("/login")
        }
        return;
      }
      this.selectId = id
      this.showAll = true
      this.status = status
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    toConfirmOrder() {
      if (!this.chosenAddressId && this.detail.flag == 1) {
        this.$toast("请选择配送地址")
        return
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
        product_id: this.detail.id,
        flag: Number(this.detail.flag),
        gid: this.detail.flag == 1 ? Number(this.detail.uid) : 0,
        quantity: Number(this.valueNumber),
        act: 2,
        spec_id: Number(this.modelId),	//是	num	型号ID
        cpbs: this.detail.cpbs,
        taste_name: this.selectedTaste || this.modelTastes
      }
      this.$router.push({ path: "/confirmOrder", query: { data: JSON.stringify(data) } })
    },
    addNewAddress() {
      this.$router.push("/cakeExitAdress")
    },
    getDgseladdress(spec_id) {
      this.addList = []
      this.disabledList = []
      let data = {
        spec_id,
        quantitys: this.valueNumber
      }
      if (this.detail.flag == 1) {
        data = {
          flag: this.detail.flag,
          brand_id: this.detail.brand_id,
          ...data
        }
      }
      dgseladdress(data).then(res => {
        //1-规格 2-重量 3-颜色 4-型号
        var list = {}
        if (res.data.address_list.length > 0) {
          res.data.address_list.forEach(item => {
            list = {
              id: item.id,
              name: (item.province ? item.province : '') + " " + (item.city ? item.city : '') + " " + (item.area ? item.area : ''),
              tel: item.addr,
              address: item.name + " " + item.phone,
              is_default: item.is_default
            }
            if (this.detail.flag == 0) {
              if (item.can_same == 1 || item.can_ship == 1) {
                this.addList.push(list)
              } else {
                this.disabledList.push(list)
              }
            } else {
              if (item.delivery == 1) {
                this.addList.push(list)
              } else {
                this.disabledList.push(list)
              }
            }

          })
          if (this.addList.filter(item => item.is_default == 1).length > 0) {
            this.delivery = this.addList.filter(item => item.is_default == 1)[0].delivery
            // console.log(this.delivery)
            this.chosenAddressId = this.addList.filter(item => item.is_default == 1)[0].id
            this.selectList[1].text = this.addList.filter(item => item.is_default == 1)[0].name + this.addList.filter(item => item.is_default == 1)[0].tel
          }
        }
      })
    },
    getCakeDetail(id) {
      var token = ""
      if (localStorage.getItem("token")) {
        token = localStorage.getItem("token")
      } else {
        token = ""
      }
      getCakeDetails({
        id, token
      }).then(res => {
        this.loadingflag = false
        if (!res.data) {
          this.$toast(res.msg)
          this.setTimer = setTimeout(() => {
            this.$router.go(-1)
          }, 1000)
        }
        if (res.code == 200 && res.data) {
          this.detail = res.data.show || {}
          this.address_id = res.data.show.id
          this.model = this.detail.gueige
          this.productCake = res.data.product_tuijian
          if (this.model.length > 0) {
            if (this.detail.flag == 1) {
              this.modelId = this.model[0].ggid
            } else {
              this.modelId = this.model[0].id
            }
            this.modelName = this.model[0].name
            this.modelPrice = this.model[0].price
            this.modelTastes = this.model[0].tastes || ""
            this.can_buy = this.model[0].can_buy

            // 新增：初始化口味列表
            if (this.model[0].tastes) {
              this.tasteList = this.model[0].tastes.split(',')
              if (this.tasteList.length > 0) {
                this.selectedTaste = this.tasteList[0]
              }
            }


          }
          if (token) {
            this.getDgseladdress(this.modelId)
          }
          this.selectList[0].text = this.modelName ? this.modelName : this.detail.name
          this.selectList[2].text = this.detail.label_name
          if (this.detail.banner) {
            this.bannerList = this.detail.banner
          } else {
            this.detail.imgs.split("-").filter(item2 => item2 != "").forEach(item => {
              this.bannerList.push({
                l_path: item
              })
            })
          }
        } else if (res.code == -1) {
          localStorage.removeItem("token")
          this.getCakeDetail(this.$route.query.id)
        }
      }
      )
    }
  },
  created() {
    this.getCakeDetail(this.$route.query.id)
  }
  ,
  mounted() {

    document.body.scrollTop = 0

    // firefox

    document.documentElement.scrollTop = 0

    // safari

    window.pageYOffset = 0
  },
  beforeDestroy() {
    clearTimeout(this.setTimer)
  }
}
</script>

<style scoped lang="less">
.location {
  background-color: #F0F0F0;
  min-height: 100vh;
  padding-bottom: 60px;
  box-sizing: border-box;
}

/deep/ .van-swipe__indicator {
  display: none;
}

.banner {
  position: relative;
}

.bannerNum {
  background-color: #CCCCCC;
  border-radius: 30px;
  color: white;
  position: absolute;
  right: 18px;
  bottom: 18px;
  width: 43px;
  text-align: center;
  padding: 2px 0px;
}

.shopInfo {
  background-color: white;
  margin-top: -5px;
  padding: 15px 15px 5px;

  .priceBox {
    display: flex;
    gap: 15px;

    .label {
      color: #dc5654;
      background-color: #FEEDE3;
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: auto;
      padding: 1px 6px;
      font-weight: bold;
      display: flex;
      font-size: 13px;
      align-items: center;
    }

    .label::-webkit-scrollbar {
      display: none
    }

    .price {
      color: #CA4543;
      font-weight: bold;
    }

    .price span {
      font-size: 20px;
    }
  }

  .shopName {
    font-weight: bold;
    line-height: 22px;
    margin-top: 5px;
    font-size: 15px;
  }

  .selectBox {
    margin-top: 5px;
  }

  .specifications {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0px;
    border-bottom: 1px solid rgba(241, 241, 241, 0.43);

    .specificationsImg {
      width: 24px;
      height: 24px;
    }

    .leftBox {
      display: flex;
      //align-items: center;
      gap: 5px;
      width: 90%;
    }

    .specificationsText {
      font-size: 13px;
      margin-top: 3px;
      //white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .iconBox {
      color: #D4D4D4;
      margin-top: 6px;
    }
  }
}

.shopDetail {
  //background-color: white;
  padding: 10px;
  margin-top: 10px;

  .shopDetailTextBox {
    padding: 7px 0px 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    .line {
      border: 1px solid #E3E3E3;
      width: 50px;
    }

    .shopDetailText {
      font-size: 12px;
      color: #939393;
    }
  }
}

.van-button--large {
  height: 40px;
  line-height: 40px;
  margin-top: 5px;
}

.van-goods-action {
  padding-right: 10px;
}

.van-goods-action-mini-btn__icon {
  width: 24px;
  height: 24px;
}

.goCart {
  border-bottom-left-radius: 30px;
  border-top-left-radius: 30px;
  background-image: linear-gradient(to right, #FFAA73, #FF8330);
}

.toPay {
  border-bottom-right-radius: 30px;
  border-top-right-radius: 30px;
  background-image: linear-gradient(to right, #E71D1E, #FA0707);
}

.goCart2 {
  background-image: linear-gradient(to right, #fff0, #fff0);
  background-color: #cccccc;
  border: 1px solid #cccccc;
}

.toPay2 {
  background-image: linear-gradient(to right, #fff0, #fff0);
  background-color: #8d8d8d;
  border: 1px solid #8d8d8d;
}

.popupBox {
  .van-popup--bottom {
    background-color: #FFFFFF !important;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    max-height: 70vh;
  }

  .close {
    position: absolute;
    top: 13px;
    right: 13px;
  }

  .popup {
    padding: 15px;
  }

  .footer {
    margin: auto;
    margin-top: 25px;
    box-sizing: border-box;
    width: 98%;
  }

  .button {
    display: flex;
    align-items: center;
    border-radius: 30px;
    overflow: hidden;
  }

  .resetting {
    background-image: linear-gradient(to right, #FFAA73, #FF8330);
    color: white;
    padding: 10px;
    box-sizing: border-box;
    width: 50%;
    text-align: center;
  }

  .complete {
    background-image: linear-gradient(to right, #E71D1E, #FA0707);
  }

  .shopBox {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .shopImg {
    width: 98px;
    height: 98px;
  }

  .price {
    color: #CA4543;
    font-weight: bold;
    font-size: 13px;
    margin-top: 5px;
  }

  .price span {
    font-size: 18px;
  }

  .title {
    font-size: 15px;
    color: #737373;
  }

  .titleBox {
    margin-top: 15px;
  }

  .speBox {
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .spe {
    color: #6c6c6c;
    border: 1px solid #c2c2c2;
    background-color: #fafafaab;
    border-radius: 30px;
    text-align: center;
    padding: 3px 10px;
    font-size: 13px;
    //font-weight: bold;
  }

  .spe1 {
    background-color: #FFF7F5;
    color: #D14A4C;
    border: 1px solid #D14A4C;
  }

  .number {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
  }

  .addressTitle {
    text-align: center;
    font-weight: bold;
  }

  .van-button--large {
    display: none;
  }

  .van-address-list {
    padding: 0;
  }

  .van-address-item__name {
    font-weight: bold;
    //color: #1F1F1F;
  }

  /deep/ .van-address-item .van-radio__icon--checked .van-icon {
    border-color: #ED2F35;
    background-color: #ED2F35;
  }

  .address {
    margin-top: 15px;
  }
}

.wcontent {
  /deep/ img {
    width: 100%;
  }
}

.modelName {
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 15px;
}

.bannerImg {
  height: 356px !important;
}

.xTitle {
  font-size: 12px;
  color: #AFAFAF;
  margin-top: 5px;
}

.tip {
  font-size: 10px;
  color: #B2B2B2;
  margin-top: 5px;
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.listShop {
  background-color: white;
  padding-bottom: 10px;

  /deep/ .van-swipe__indicator {
    display: initial;
    border-radius: 0px;
    width: 15px;
    height: 3px;
    background-color: #E5E5E5;
    margin: 0;
  }

  /deep/ .van-swipe__indicators {
    bottom: 0px;
    border-radius: 30px;
    overflow: hidden;
  }
}

.valueNumber {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/deep/ .van-stepper__input {
  background-color: rgba(242, 243, 245, 0);
  font-size: 16px;
}

/deep/ .van-stepper__minus {
  background-color: rgba(242, 243, 245, 0);
  border-radius: 50%;
  border: 1px solid #b0b0b0;
  width: 25px;
  height: 25px;
}

/deep/ .van-stepper__plus {
  background-color: #CA403E;
  border-radius: 50%;
  width: 25px;
  height: 25px;
}

.van-stepper__minus::after,
.van-stepper__minus::before,
/deep/ .van-stepper__plus::after,
/deep/ .van-stepper__plus::before {
  background-color: #ffffff;
}

.distrubtion {
  background-color: white;
  padding: 13px;
  font-size: 13px;
  line-height: 23px;
}

.contentFlag {
  background-color: white;
  padding: 13px;
  font-size: 13px;
  line-height: 23px;

  /deep/ img {
    width: 100%;
    display: block;
  }
}

.contentFlag /deep/p {
  margin: 0;
}
</style>