<template>
  <div class="selectproduct">
    <!--    <ReturnBack :rcolor="'#fff'" :bcolor="'rgba(218,218,218,0.26)'"></ReturnBack>-->
    <NProgress v-if="loadingflag"/>
    <van-notice-bar
        left-icon="volume-o"
        :text="text"
    />
    <div :class="!shopcarlist.length ? 'shopcar' : 'shopcar1'" :id="'shopcarbck'+num1"
         style="position: fixed;z-index: 10000;">
      <!-- 无商品 -->
      <img v-if="!shopcarlist.length" src="../../assets/backimage/Vector.png" alt="">
      <span v-if="!shopcarlist.length">未选购商品</span>
      <!-- 有商品 -->
      <div @click="orderpopue()">
        <img v-if="shopcarlist.length" src="../../assets/backimage/Vector-1.png" alt="">
        <span v-if="shopcarlist.length" class="circle" style="">{{ shopcarlist.length }}</span>
      </div>


      <span v-if="shopcarlist.length" @click="orderpopue()">￥{{ sum || 0 }}</span>
      <p class="btn1" @click="shopcarlist.length ? paymentpage() : ''">
        <i>选好了</i>
        <i>Order</i>
      </p>
    </div>
    <!-- 自取模式 -->
    <div class="header" v-if="!flag">
      <div class="headerleft">
        <p class="store">
          <img :src="require('../../assets/backimage/store'+num1+'.png')" style="width: 25px;" alt="">
          <span class="storeadd">{{ productlist.name || productlist.storeName }}</span>
        </p>
        <p class="option"><span style="color: #000;">自取</span> | {{ productlist.address || productlist.storeAddress }}
        </p>
      </div>
      <div class="headerright" @click="switchstore()">
        <img :src="require('../../assets/backimage/replacestore'+num1+'.png')" style="width: 18px;" alt="">
        <p style="">更换门店</p>
      </div>
    </div>
    <!-- 外送显示 -->
    <div class="header" v-if="flag">
      <div class="headerleft">
        <p class="store">
          <img :src="require('../../assets/backimage/waisong'+num1+'.png')" style="width: 15px;" alt="">
          <span class="storeadd">{{ location + locationdetail }}</span>
        </p>
        <p class="option"><span style="color: #000;">外送</span> | {{ productlist.address || productlist.storeAddress }}
        </p>
      </div>
      <div class="headerright" @click="editaddress()">
        <img :src="require('../../assets/backimage/replacestore'+num1+'.png')" style="width: 18px;" alt="">
        <p style="">更换地址</p>
      </div>
    </div>
    <div class="listbox">
      <!-- 左侧导航条 -->
      <ul class="leftlist" ref="leftList" style="height: 82.7vh;">
        <li id="li1" v-for="(item,index) in leftprolist" :key="index" :class="{bg:index==isactive}"
            @click="selectname(index)" style="height: 50px;">
          <a class="lia" @click="changeHash('#goli'+index)"
             style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
            <div class="leftbg" @click="selectname(index)"
                 :style="{width: '50px',height: '40px',backgroundImage: 'url(' + item.imageCnUrl + ')',backgroundPosition: '2px -6px',backgroundSize:'cover'}"></div>
            <span style="font-size: 13px;" @click="selectname(index)" :name="item.name || item.top">{{
                item.topName
              }}</span>
          </a>
        </li>
      </ul>
      <!-- 右侧商品列表 -->
      <div class="rightlist" ref="rightList" @scroll="handleScroll($event)">
        <ul>
          <!-- <p class="title" v-once>{{ leftprolist.name }}</p> -->
          <li v-for="(item,index) in alllist" id="libox1" :key="index">
            <p :id="'goli'+(item[1])" v-if="index%2==0" class="title">{{ item[0] }}</p>
            <div v-if="index%2==1">
              <div class="wrap" v-for="(x,index) in item" :key="index">
                <div class="left" style="flex: 1;display: flex;justify-content: center;align-items: center;">
                  <img style="border-radius: 50px;height: 90px;width: 100px;" :src="x.imageUrl" alt="">
                </div>
                <div class="right" style="flex: 2;">
                  <p class="p1">{{ x.showNameCn }}</p>
                  <p class="p2">
                    <span :class="'rightlistprice'+num1">￥{{ x.price || x.priceInfo.amount }}</span>
                    <button :class="'rightlistbtn'+num1" style="" @click="godetail(x.linkId,storeid)">选规格</button>
                  </p>
                </div>

              </div>
            </div>


          </li>
        </ul>
      </div>
    </div>
    <van-popup v-model:show="showBottom" round position="bottom" :style="{ height: '60%' }">
      <div class="title">
        <span class="s1">已选餐品({{ shopcarlist.length }})</span>
        <p @click="deleteallcar()">
          ` <img src="../../assets/backimage/lajitong.png" alt="">
          <span class="s2">清空购物车</span>
        </p>
      </div>
      <ul class="shopcarproduct">
        <li class="li1" v-for="(item,index) in shopcarlist" :key="index" style="">
          <img :src="item.detail.imageUrl" style="border-radius: 10px;" alt="">
          <div class="shop">
            <p class="name">{{ item.detail.showNameCn }}</p>
            <p class="specification" v-if="item.specifications">{{ item.specifications }}</p>
            <div>
              <span class="price" :id="'price'+index">￥{{ item.detail.price }}</span>
              <!-- <van-stepper theme="round" button-size="22" disable-input @change="editshopnum(index,$event)" /> -->
              <van-stepper theme="round" min="0" button-size="22" v-model="item.count" disable-input
                           @change="editshopnum(item.detail.linkId,item.count,index)"/>
            </div>
          </div>
        </li>
      </ul>
    </van-popup>
  </div>
</template>

<script>
import {getBSKProductList, getBSKVerify} from "@/api/store";
import {getdbtext} from '@/api/service'
import router from "@/router";

export default {
  data() {
    return {
      num1: 0,              //判断是那个产品
      isactive: 0,
      productlist: [],      //商品总列表
      prolist2: [],         //筛选商品总列表合并成为一个列表
      leftprolist: [],      //左侧列表
      products: [],         //右侧商品列表
      showBottom: false,    //是否显示弹框
      shopnum: 1,           //购物车弹框内的数量
      sum: 0,               //总价钱
      value: 0,
      storeid: "",          //该门店id
      alllist: [],
      shopcarlist: [        //购物车内的商品


      ],
      // 外卖模式字段
      flag: false,
      location: "",
      locationdetail: "",


      titlename: "",
      ziqushijian: "",
      waimaishijian: "",
      starttime: "",
      endtime: "",
      text: "",


      boxheight: "",
      loadingflag: true,
      openStatus: true,

    };
  },
  methods: {
    handleScroll(e) {
      // console.log(document.querySelector(".rightlist ul").clientHeight);
      // this.panduan=true
      let scrollTop = this.$refs.rightList.scrollTop;

      // console.log(this.boxheight);
      for (var i = 0; i < this.boxheight.length; i++) {
        if (i == 0) {

        } else {
          if (scrollTop >= this.boxheight[i - 1] && scrollTop <= this.boxheight[i]) {
            //   document.querySelectorAll("#li1")[i-1].style.background="#fff"
            //   document.querySelectorAll("#li1")[i-1].style.color="#0e6941"
            //   document.querySelectorAll("#li1")[i-1].style.fontWeight="800"
            //   document.querySelectorAll("#li1 img")[i-1].src=this.leftprolist[i-1].imageOn
            document.querySelectorAll("#li1")[i - 1].style.background = "#fff"
            document.querySelectorAll("#li1")[i - 1].style.color = "#c5815a"
            document.querySelectorAll("#li1")[i - 1].style.fontWeight = "800"
            document.querySelectorAll(".leftbg")[i - 1].style.backgroundPosition = "2px -55px"

          } else {
            document.querySelectorAll("#li1")[i - 1].style.background = "#f0f0f0"
            document.querySelectorAll("#li1")[i - 1].style.color = "gray"
            document.querySelectorAll("#li1")[i - 1].style.fontWeight = "400"
            document.querySelectorAll(".leftbg")[i - 1].style.backgroundPosition = "2px -6px"
          }
        }


      }
      if (scrollTop <= this.boxheight[0]) {
        document.querySelectorAll("#li1")[0].style.background = "#fff"
        document.querySelectorAll("#li1")[0].style.color = "#c5815a"
        document.querySelectorAll("#li1")[0].style.fontWeight = "800"
        document.querySelectorAll(".leftbg")[0].style.backgroundPosition = "2px -55px"
      }


      // console.log(scrollTop);

    },
    selectname(index) {
      this.isactive = index
      this.products = this.leftprolist[index].menuList

      for (var i = 0; i < document.querySelectorAll("#li1").length; i++) {
        if (i == this.isactive) {
          document.querySelectorAll("#li1")[i].style.background = "#fff"
          document.querySelectorAll("#li1")[i].style.color = "#c5815a"
          document.querySelectorAll("#li1")[i].style.fontWeight = "800"
          document.querySelectorAll(".leftbg")[i].style.backgroundPosition = "2px -55px"
        } else {
          1
          document.querySelectorAll("#li1")[i].style.background = "#f0f0f0"
          document.querySelectorAll("#li1")[i].style.color = "gray"
          document.querySelectorAll("#li1")[i].style.fontWeight = "400"
          document.querySelectorAll(".leftbg")[i].style.backgroundPosition = "2px -6px"
        }
      }

    },
    // 更改购物车内的商品数量
    editshopnum(itemid, count, index) {
      // console.log(itemid,count);
      if (count == 0) {
        this.shopcarlist = this.shopcarlist.filter(function (item) {
          return item.count != 0
        })
        this.$toast({message: "删除商品成功", type: "success"})
      } else {
        for (var i = 0; i < this.shopcarlist.length; i++) {
          if (index == i) {
            this.shopcarlist[i].count = count
          }
        }
      }
      sessionStorage.setItem("goods", JSON.stringify(this.shopcarlist))
      this.sumprice()
    },
    changeHash(idname) {
      // console.log(idname);
      document.querySelector(idname).scrollIntoView(true)
    },
    orderpopue() {
      this.showBottom = !this.showBottom
    },
    // 点击选好了跳转到支付
    paymentpage() {
      this.getBSKProduct()
      if(!this.openStatus){
        this.$toast("门店未营业")
        return
      }
      var goodslist = JSON.parse(sessionStorage.getItem("goods"))
      var goods = []
      // console.log(goodslist);
      var jiaoyan = []
      for (var i = 0; i < goodslist.length; i++) {
        var s = []
        var mealRoundList = []
        for (var j = 0; j < goodslist[i].detail.roundList.length; j++) {
          for (var f = 0; f < goodslist[i].detail.roundList[j].itemList.length; f++) {
            // ,
            //
            if (goodslist[i].detail.roundList[j].itemList[f].quantity == null) {
              var quantity = 1
            } else {
              var quantity = goodslist[i].detail.roundList[j].itemList[f].quantity
            }
            if(goodslist[i].detail.roundList[j].itemList[f].nameCn==goodslist[i].specifications){
              mealRoundList.push({
                'mealRoundId': goodslist[i].detail.roundList[j].id,
                'mealItemList': [{
                  'linkId': goodslist[i].detail.roundList[j].itemList[f].linkId,
                  'quantity': quantity,
                  'condimentItemList': []
                }]
              })
            }

          }
        }

        s = JSON.stringify([{
          'count': goodslist[i].count,
          'itemImage': goodslist[i].detail.imageUrl,
          'amount': goodslist[i].detail.amount,
          'discountPrice': Number(goodslist[i].detail.price),
          'itemName': goodslist[i].detail.showNameCn,
          'goodlistname': goodslist[i].specifications,
          'linkId': goodslist[i].detail.linkId,
          'mealRoundList': mealRoundList,
          'sumprice': (Number(goodslist[i].count) * Number(goodslist[i].detail.price)) + '',
          'sumdiscountPrice': (Number(goodslist[i].count) * Number(goodslist[i].detail.price)) + ''
        }])

        let data = {}
        if(this.flag){
          data = {
            apikey: this.$store.state.appkey,
            storeCode: this.$route.query.storeid,
            //   orderCode:"",
            goods: s + '',
            orderType:"2",
            receiverLat:localStorage.getItem("lat"),
            receiverLng:localStorage.getItem("lng")
          }
        }else{
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
        var allgoods = []
        getBSKVerify(data).then(res => {
          // console.log(res);
          if (res.code == 200) {
            allgoods.push(res.data)
            if (this.flag) {
              setTimeout(() => {
                //  this.$router.push("/orderpay")
                this.$router.push({path: "/orderpay", query: {flag: this.flag, num1: this.num1}})
              }, 1000);
            } else {
              setTimeout(() => {
                //  this.$router.push("/orderpay")
                this.$router.push({path: "/orderpay", query: {num1: this.num1}})

              }, 1000);
            }
          } else {
            this.$toast(res.msg)
            setTimeout(() => {
              this.$router.go(-1)
            }, 1000)
          }
          sessionStorage.setItem("allgoods", JSON.stringify(allgoods))
          var jiaoyan2 = []
          jiaoyan.forEach(item=>{
            allgoods.filter(item2=>{
              if(item.linkId==item2.goods[0].goodsId){
                jiaoyan2.push(item)
              }
            })
          })
          sessionStorage.setItem("verify", JSON.stringify(jiaoyan2))
        })
      }
      // sessionStorage.setItem("verify", JSON.stringify(jiaoyan))
    },
    switchstore() {
      this.$router.go(-1)
    },
    // 跳转到商品详情页面
    godetail(id, storeid) {
      // console.log(id);
      // console.log(storeid);
      this.$router.push({path: "/productdetailbsk", query: {num1: this.num1, id: id, storeid: storeid}})
    },
    getBSKProduct() {
      let data = {}
      if(this.flag){
       data = {
          apikey: this.$store.state.appkey,
          storeCode: this.$route.query.storeid,
          orderType:"2",
          receiverLat:localStorage.getItem("lat"),
          receiverLng:localStorage.getItem("lng")
        }
      }else{
        data = {
          apikey: this.$store.state.appkey,
          storeCode: this.$route.query.storeid,
          orderType:"1"
        }
      }
      getBSKProductList(data).then(res => {
        this.loadingflag = false
        if (res.code == 200) {

          this.productlist = res.data
          this.leftprolist = res.data.menu
          this.openStatus = res.data.officialStatus
          // console.log(res.data);
          for (var i = 0; i < this.leftprolist.length; i++) {
            this.alllist.push([this.leftprolist[i].topName, i], this.leftprolist[i].menuList)
          }
          // console.log(this.alllist);
          if (res.data.menu == undefined) {
            this.$toast({message: "操作失败", type: "fail"})
            this.$router.go(-1)

          } else {
            this.products = res.data.menu[0].menuList
          }


          // console.log(this.leftprolist);


        } else {
          this.$toast(res.msg)
          this.$router.go(-1)
        }
        this.starttime = this.productlist.starttime;
        this.endtime = this.productlist.endtime;
        getdbtext({
          type: "bsk"
        }).then(res => {
          // console.log(res);
          if (res.code == 200) {
            // console.log(res);
            if (this.flag) {
              this.waimaishijian = res.data.bskwmts
              this.text = this.waimaishijian + this.starttime + '至' + this.endtime + '。'
            } else {
              this.ziqushijian = res.data.bskdcts
              this.text = this.ziqushijian + this.starttime + '至' + this.endtime + '。'
              // console.log(this.productlist,"1111");
            }

          }
          this.$nextTick(() => {
            this.boxheight = []
            this.box = []

            // console.log(document.querySelectorAll("#libox1"));
            for (var i = 0; i < document.querySelectorAll("#libox1").length; i++) {
              if (i % 2 != 0) {
                this.box.push(document.querySelectorAll("#libox1")[i].clientHeight)
              }
            }

            for (var j = 0; j < this.box.length; j++) {
              var height = 0
              if (j == 0) {
                height = this.box[0]
              } else {
                for (i = 0; i < j; i++) {
                  height = height + this.box[i]
                }
              }

              this.boxheight.push(height)

            }
            // console.log(this.boxheight);
          })
          this.$nextTick(() => {
            document.querySelectorAll("#li1")[0].style.background = "#fff"
            document.querySelectorAll("#li1")[0].style.color = "#c5815a"
            document.querySelectorAll("#li1")[0].style.fontWeight = "800"
            document.querySelectorAll(".leftbg")[0].style.backgroundPosition = "2px -55px"
          })
        })
      })
    },
    deleteallcar() {
      this.shopcarlist = []
      sessionStorage.removeItem("goods")
    },
    sumprice() {
      this.sum = 0
      for (var i = 0; i < this.shopcarlist.length; i++) {
        this.sum = this.sum + this.shopcarlist[i].count * this.shopcarlist[i].detail.price
      }
    }
  },
  mounted() {
    this.getBSKProduct()


    // 获取左侧列表的DOM元素
    const leftList = this.$refs.leftList;
    const rightList = this.$refs.rightList;
    // 设置左侧列表的高度和样式
    leftList.style.height = '85vh';
    leftList.style.overflowY = 'auto';
    // 设置左侧列表的高度和样式
    rightList.style.height = '70vh';
    rightList.style.overflowY = 'auto';
  },
  created() {
    // 获取num1
    this.num1 = this.$route.query.num1
    this.storeid = this.$route.query.storeid
    this.flag = this.$route.query.flag
    if (this.flag) {
      this.location = localStorage.getItem("location")
      this.locationdetail = localStorage.getItem("locationdetail")
    }
    // console.log(this.location,this.locationdetail);
    //   获取商品
    if (sessionStorage.getItem("goods")) {
      this.shopcarlist = JSON.parse(sessionStorage.getItem("goods"))
      // console.log(this.shopcarlist);

      this.sumprice()
    }
  },
};
</script>
<style src="../../css/productlist.css" scoped></style>
<style scoped>
.listbox .rightlist .title {
  border-left: 3px solid #e6a54e
}
</style>