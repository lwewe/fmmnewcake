<template>
  <div class="location">
    <NProgress v-if="loadingflag"/>
    <!--    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>-->
    <!--  轮播图-->
    <div class="banner">
      <van-swipe :autoplay="3000" indicator-color="white" @change="onChange">
        <van-swipe-item class="bannerImg" v-for="item in bannerList" :key="item">
          <img class="img"
               :src=" item"
               alt="">
        </van-swipe-item>
      </van-swipe>
      <div class="bannerNum">{{ onIndex }}/{{ bannerList.length }}</div>
    </div>
    <div class="shopInfo">
      <div class="priceBox">
        <div class="price" v-if="modelList.length>0">
          <span>{{ changePrice1(modelList[0].price) }}</span>.{{ changePrice2(modelList[0].price) }}
        </div>
        <div class="label" v-if="detail.pinpai">{{ detail.pinpai.name }}</div>
      </div>
      <div class="shopName">{{ detail.name }}</div>
      <!--      选择-->
      <div class="selectBox">
        <!--          规格-->
        <div class="specifications" :style="{border:item.id ==3?'none':''}" v-for="item in selectList" :key="item.id"
             @click="open(item.status,item.id)">
          <div class="leftBox">
            <div class="specificationsImg">
              <img class="img" :src="item.icon" alt="">
            </div>
            <div class="specificationsText" :class="{specificationsText2:item.id==3}"  :style="{width:item.id==1?'67%':'' }">{{ item.text }}</div>
          </div>
          <div class="iconBox" v-if="item.id !=3">
            <van-icon name="arrow"/>
          </div>
        </div>
      </div>
    </div>
    <div class="shopDetail">
      <div class="shopDetailTextBox">
        <div class="line"></div>
        <div class="shopDetailText">商品详情</div>
        <div class="line"></div>
      </div>
      <div class="wcontent" v-html="detail.wcontent">

      </div>
    </div>
    <!--    底部button-->
    <div>
      <van-goods-action>
        <van-goods-action-mini-btn
            @click="toCart"
            :icon="require('../../assets/tubiao/gc.png')"
            text="购物车"
        />
        <van-goods-action-mini-btn
            @click="toKefu"
            :icon="require('../../assets/tubiao/kfz.png')"
            text="客服"
        />
        <van-goods-action-big-btn class="goCart"
                                  :class="{goCart2:detail.keshou==0||(detail.stock?detail.stock==0:'')}"
                                  text="加入购物车"
                                  @click="open('b',1)"
        />
        <van-goods-action-big-btn class="toPay"
                                  :class="{toPay2:detail.keshou==0||(detail.stock?detail.stock==0:'')}"
                                  primary
                                  text="立即购买"
                                  @click="open('c',1)"
        />
      </van-goods-action>
    </div>
    <!--    规格弹窗-->
    <div class="popupBox">
      <van-popup v-model="showAll" position="bottom">
        <div class="popup">
          <div class="close" @click="showAll=false">
            <van-icon size="18px" name="cross"/>
          </div>
          <div v-if="selectId==1">
            <div class="shopBox">
              <div class="shopImg">
                <img style="border-radius: 5px;" class="img" :src="detail.thumbnailimage" alt="">
              </div>
              <div style="width: 65%;">
                <div class="modelName"> {{ modelName ? modelName : detail.name }}</div>
                <div class="price">￥<span>{{ changePrice1(modelPrice) }}</span>.{{ changePrice2(modelPrice) }}</div>
              </div>
            </div>
            <div v-if="!isHave">
              <div class="titleBox" v-if="model.length>0">
                <!--              //1-规格 2-重量 3-颜色 4-型号-->
                <div class="title">规格</div>
                <div class="speBox">
                  <div class="spe" :class="{spe1:item.id==modelId}" @click="changemodelId('规格',item)"
                       v-for="item in model"
                       :key="item.id">{{ item.xinghao }}
                  </div>
                </div>
              </div>
              <div class="titleBox" v-if="weightList.length>0">
                <!--              //1-规格 2-重量 3-颜色 4-型号-->
                <div class="title">重量</div>
                <div class="speBox">
                  <div class="spe" v-for="item in weightList" :key="item.id" :class="{spe1:item.id==modelId}"
                       @click="changemodelId('重量',item)">{{ item.xinghao }}
                  </div>
                </div>
              </div>
              <div class="titleBox" v-if="colourList.length>0">
                <!--              //1-规格 2-重量 3-颜色 4-型号-->
                <div class="title">颜色</div>
                <div class="speBox">
                  <div class="spe" v-for="item in colourList" :key="item.id" :class="{spe1:item.id==modelId}"
                       @click="changemodelId('颜色',item)">{{ item.xinghao }}
                  </div>
                </div>
              </div>
              <div class="titleBox" v-if="Specifications.length>0">
                <!--              //1-规格 2-重量 3-颜色 4-型号-->
                <div class="title">型号</div>
                <div class="speBox">
                  <div class="spe" v-for="item in Specifications" :key="item.id" :class="{spe1:item.id==modelId}"
                       @click="changemodelId('型号',item)">{{ item.xinghao }}
                  </div>
                </div>
              </div>
              <div class="titleBox" v-if="tasteList.length>0">
                <!--              //1-规格 2-重量 3-颜色 4-型号 5口味-->
                <div class="title">口味</div>
                <div class="speBox">
                  <div class="spe" v-for="item in tasteList" :key="item.id" :class="{spe1:item.id==modelId}"
                       @click="changemodelId('口味',item)">{{ item.xinghao }}
                  </div>
                </div>
              </div>
            </div>
            <div class="number">
              <div class="title">数量</div>
              <div>
                <van-stepper v-model="value"/>
              </div>
            </div>
          </div>
          <div v-if="selectId==2">
            <div class="addressTitle">{{ addList.length > 0 ? '选择收货地址' : '暂无地址请添加收货地址' }}</div>
            <div class="address">
              <van-address-list
                  v-model="chosenAddressId"
                  @edit="editAddress"
                  @select="changeDefault"
                  :list="addList"
              />
            </div>
          </div>
          <!--          按钮-->
          <div class="footer">
            <div class="button" v-if="status=='a'">
              <div class="resetting" @click="resetting">加入购物车</div>
              <div class="resetting complete" @click="toConfirmOrder">立即订购</div>
            </div>
            <div class="button" v-if="status=='b'">
              <div class="resetting" style="width: 100%;" @click="resetting">加入购物车</div>
            </div>
            <div class="button" v-if="status=='c'">
              <div class="resetting complete" style="width: 100%;" @click="toConfirmOrder">立即订购</div>
            </div>
            <div class="button" v-if="status=='d'">
              <div class="resetting complete" @click="addNewAddress"
                   style="width: 100%;background-image: linear-gradient(to right,#F55655,#DB0605);">添加新地址
              </div>
            </div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import {addCart, getProductDetail, selscaddress} from "@/api/detail";
import {mrscaddress} from "@/api/cakeAddress";

export default {
  name: "ProductDetail",
  data() {
    return {
      bannerList: [],
      onIndex: 1,
      selectList: [
        {
          id: 1,
          icon: require("../../assets/tubiao/gg.png"),
          text: "",
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
          text: "预计48小时发货"
          // （节假日可能延缓发货）
        },
      ],
      showAll: false,
      isHave: false,
      value: "1",
      status: null,
      selectId: 2,
      chosenAddressId: '',
      addList: [],
      detail: {},
      modelList: [],
      //1-规格 2-重量 3-颜色 4-型号
      model: [],
      weightList: [],
      colourList: [],
      Specifications: [],
      tasteList: [],
      modelId: "",
      modelName: "",
      modelPrice: "",
      address_id: "",
      loadingflag: true
    }
  },
  methods: {
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
        this.$toast(res.data)
        this.showAll = false
        if (res.code == 200) {
          this.getScaddressList()
        }
      })
    },
    // 加入购物车
    resetting() {
      if(this.modelId==""){
        this.$toast("请选择规格")
        return
      }
      addCart({
        gid: this.detail.flag == 1 ? Number(this.detail.uid) : 0,	//是	num	供应商ID
        flag: Number(this.detail.flag),	//是	num	类型 0-读取接口,1上传
        product_id: this.detail.id,	//是	num	产品ID
        spec_id: Number(this.modelId),	//是	num	型号ID
        quantity: Number(this.value),	//是	num	数量
        cpbs: this.detail.cpbs,
        taste_name: ""
      }).then(res => {
        this.$toast(res.msg)

        if (res.code == 200) {
          this.showAll = false
        }
      })
    },
    editAddress(e) {
      this.$router.push({path: "/cakeExitAdress", query: {id: e.id}})
    },
    changemodelId(type, item) {
      //1-规格 2-重量 3-颜色 4-型号
      // if (type == "规格") {
      this.modelId = item.id
      this.modelName = item.xinghao
      this.modelPrice = item.price
      this.selectList[0].text = this.modelName
      // }
      // else  if(type == "重量"){
      //   this.modelId = item.id
      //   this.modelName = item.xinghao
      //   this.modelPrice = item.price
      //   this.selectList[0].text = this.modelName
      // }else  if(type == "颜色"){
      //   this.modelId = item.id
      //   this.modelName = item.xinghao
      //   this.modelPrice = item.price
      //   this.selectList[0].text = this.modelName
      // }else  if(type == "型号"){
      //   this.modelId = item.id
      //   this.modelName = item.xinghao
      //   this.modelPrice = item.price
      //   this.selectList[0].text = this.modelName
      // }
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
      if (this.detail.keshou == 0) {
        this.$toast("该商品不可售")
        return;
      }
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
      if(this.modelId==""){
        this.$toast("请选择规格")
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
      // selscaddress({
      //   address_id: this.address_id,
      //   product_id: this.detail.id
      // }).then(res => {
      //   if (res.code == 200) {
      //     if (res.data.show.xz == 1) {
      var data = {
        product_id: this.detail.id,
        flag: Number(this.detail.flag),
        gid: this.detail.flag == 1 ? Number(this.detail.uid) : 0,
        quantity: Number(this.value),
        act: 2,
        spec_id: Number(this.modelId),	//是	num	型号ID
        cpbs: this.detail.cpbs,
        taste_name: ""
      }
      this.$router.push({path: "/confirmOrder", query: {data: JSON.stringify(data)}})
      //     } else {
      //       this.$toast("当前地址不可售,请重新选择地址")
      //     }
      //   }
      // })
    },
    addNewAddress() {
      this.$router.push("/cakeExitAdress")
    },
    getDetail(id) {
      var token = ""
      if (localStorage.getItem("token")) {
        token = localStorage.getItem("token")
      } else {
        token = ""
      }
      getProductDetail({
        id,
        token
      }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          //1-规格 2-重量 3-颜色 4-型号
          if (res.data.address_list.length > 0) {
            for (let i = 0; i < res.data.address_list.length; i++) {
              let item = res.data.address_list[i]
              this.addList.push({
                id: item.id,
                name: (item.province ? item.province : '') + " " + (item.city ? item.city : '') + " " + (item.area ? item.area : ''),
                tel: item.addr,
                address: item.name + " " + item.phone,
                is_default: item.is_default
              })
            }
            // res.data.address_list.forEach(item => {
            //   this.addList.push({
            //     id: item.id,
            //     name: item.province.name + " " + item.city.name + " " + item.county.name + " " + (item.town ? item.town.name : ""),
            //     tel: item.addr,
            //     address: item.name + " " + item.phone,
            //     is_default: item.is_default
            //   })
            // })
            if (this.addList.filter(item => item.is_default == 1).length > 0) {
              this.chosenAddressId = this.addList.filter(item => item.is_default == 1)[0].id
            }
          }
          this.detail = res.data.show
          this.address_id = res.data.show.id
          this.modelList = this.detail.xinghao
          var arry = this.modelList.filter(item => item.xinghao == "")
          if (this.modelList.length == arry.length) {
            this.isHave = true
          } else {
            this.isHave = false
          }
          this.model = this.modelList.filter(item => item.shuxing == 1)
          this.weightList = this.modelList.filter(item => item.shuxing == 2)
          this.colourList = this.modelList.filter(item => item.shuxing == 3)
          this.Specifications = this.modelList.filter(item => item.shuxing == 4)
          this.tasteList = this.modelList.filter(item => item.shuxing == 5)
          if (this.model.length > 0) {
            this.modelId = this.model[0].id
            this.modelName = this.model[0].xinghao
            this.modelPrice = this.model[0].price
          } else if (this.weightList.length > 0) {
            this.modelId = this.weightList[0].id
            this.modelName = this.weightList[0].xinghao
            this.modelPrice = this.weightList[0].price
          } else if (this.colourList.length > 0) {
            this.modelId = this.colourList[0].id
            this.modelName = this.colourList[0].xinghao
            this.modelPrice = this.colourList[0].price
          } else if (this.Specifications.length > 0) {
            this.modelId = this.Specifications[0].id
            this.modelName = this.Specifications[0].xinghao
            this.modelPrice = this.Specifications[0].price
          } else if (this.tasteList.length > 0) {
            this.modelId = this.tasteList[0].id
            this.modelName = this.tasteList[0].xinghao
            this.modelPrice = this.tasteList[0].price
          }
          this.selectList[0].text = this.modelName ? this.modelName : this.detail.name
          if (this.addList.length > 0) {
            this.selectList[1].text = this.addList[0].name + this.addList[0].tel
          }
          if(this.detail.deliverymsg){
            this.selectList[2].text =this.selectList[2].text+" ("+this.detail.deliverymsg+")"
          }
          this.bannerList = this.detail.imgs.split("-").slice(0, this.bannerList.length - 1)
        } else if (res.code == -1) {
          localStorage.removeItem("token")
          this.getDetail(this.$route.query.id)
        }
      })
    },
    // getCurrentTime() {
    //   const currentDate = new Date();
    //   this.currentTime = currentDate.toLocaleString();
    // },
    // getFilteredDate() {
    //   const currentDate = new Date();
    //   currentDate.setDate(currentDate.getDate() + 2);
    //
    //   // 假设节假日列表
    //   const holidayList = ['2022-10-01', '2022-10-02']; // 假设国庆节
    //
    //   while (holidayList.includes(currentDate.toISOString().slice(0, 10))) {
    //     currentDate.setDate(currentDate.getDate() + 1);
    //   }
    //
    //   this.filteredDate = currentDate.toLocaleString();
    // }
  },
  created() {
    this.getDetail(this.$route.query.id)
  },
  mounted() {
    // this.getCurrentTime()
    // this.getFilteredDate()

    document.body.scrollTop = 0

// firefox

    document.documentElement.scrollTop = 0

// safari

    window.pageYOffset = 0
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
  padding: 10px 15px 5px;

  .priceBox {
    display: flex;
    gap: 15px;

    .label {
      color: #dc5654;
      background-color: #FEEDE3;
      text-align: center;
      white-space: nowrap;
      padding: 1px 6px;
      font-weight: bold;
      display: flex;
      font-size: 14px;
      align-items: center;
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
      align-items: center;
      gap: 5px;
      width: 90%;
    }

    .specificationsText {
      font-size: 13px;
      margin-top: -1px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .specificationsText2{
      white-space: pre-wrap;
    }
    .iconBox {
      color: #D4D4D4;
      margin-top: 6px;
    }
  }
}

.shopDetail {
  background-color: white;
  padding: 10px;
  margin-top: 10px;

  .shopDetailTextBox {
    padding: 7px 0px 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    .line {
      border: 1px solid #F7F7F7;
      width: 50px;
    }

    .shopDetailText {
      font-size: 12px;
      color: #C3C3C3;
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
    width: 83px;
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
    color: #1F1F1F;
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

  /deep/ p {
    font-size: 14px;
    margin: 10px 0px;
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

</style>