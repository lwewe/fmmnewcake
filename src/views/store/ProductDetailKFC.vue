<template>
  <div class="productdetail">
    <NProgress v-if="loadingflag"/>
    <div class="shopcar1" style="position: fixed;z-index: 10000;">
      <!-- 有商品 -->
      <div>
        <img src="../../assets/backimage/Vector-1.png" alt="">
      </div>
      <span v-if="detalilist.length>0">￥{{
          count * detalilist.price || detalilist.groupRoundList[0].groupItemList[0].price * count || 0
        }}</span>
      <p class="btn1" @click="addshopcar()">
        <i>加入购物车</i>
        <i>Order</i>
      </p>
    </div>
    <div class="productpic">
      <img :src="detalilist.img" alt="">
    </div>
    <div class="detail">
      <div class="wrap">
        <div class="title" style="margin-bottom: 5px">
          <p>{{ detalilist.name }}</p>
          <van-stepper theme="round" v-model="count" button-size="22" disable-input/>
        </div>
        <ul>
          <li v-for="(item,index) in list" :key="index" style="">

            <p style="color: #999;font-size: 14px;margin-top: 10px;">
              <span>{{ item.roundNameCn }}</span>
              <span v-if="detalilist.condimentRoundList">({{ item.itemCount }}份)</span>
            </p>
            <div v-if="detalilist.condimentRoundList" style="display: flex;flex-wrap: wrap;">
              <!-- :id="item.choicesCode" -->
              <div v-for="(inner,index) in item.condimentItemList" class="product" :key="index"
                   :name="inner.defaultSelected" style="width: 110px;height: 130px;">
                <div :class="inner.defaultSelected=='1' ? 'selected' : ''"
                     style="display: flex;justify-content: center;align-items: center;">
                  <div :class="inner.imageUrl ? 'around' : 'around1'" :name="inner.defaultSelected"
                       :id="item.condimentLinkId" @click="checkproduct(inner.linkId,index,item.condimentLinkId)">
                    <img v-if="inner.imageUrl" style="width: 60px;height: 60px;" :src="inner.imageUrl" alt="">
                    <span style="font-size: 13px;">{{ inner.showNameCn }}</span>
<!--                    <van-stepper class="step" style="display: flex;" v-model="condimentcount[index]"-->
<!--                                 :disable-plus="true" v-if="item.itemCount>1" min="0" theme="round" disable-input-->
<!--                                 @change="editnumber(inner.menuCn,item.itemCount,index)"/>-->
                  </div>

                </div>
              </div>
            </div>
            <div v-if="!detalilist.condimentRoundList">
              <div v-for="(inner,index) in item.gpOptions" class="coffee" :key="index" style="">

                <p class="pcate" :name="inner.defaultSelected" style="font-size: 15px;font-weight: 800;">
                  <span style="display: inline-block;">{{ inner.name }}</span>
                </p>
                <div style="display: flex;">
                  <div v-for="(x,index) in inner.options" :key="index" style="">
                    <p class="around1" :id="inner.id" style="font-size: 14px;color: gray;"
                       @click="checkproduct(inner.id,index,item.condimentLinkId)">{{ x.name }}</p>
                    <!-- <div style="padding-bottom: 20px">
                        <div class="xwrap" v-for="(z,index) in x.condimentItemList" :key="index" style="display: inline-block;width: 100px">
                            <div class="zinner" :name="z.defaultSelected" style="padding: 5px 7px;">
                                <span style="font-size: 14px;display: flex;justify-content: center;align-items: center;">{{ z.menuCn }}</span>
                                <van-stepper class="step" style="display: flex;" v-model="condimentcount[index]" :disable-plus="true"  v-if="x.itemCount>1" min="0" theme="round" disable-input @change="editnumber(z.menuCn,x.itemCount,index)" />
                            </div>
                        </div>
                    </div> -->
                  </div>
                </div>


              </div>
              <div v-for="(z,index) in item.groupItemList[0].condimentRoundList" :key="index">
                <p style="font-size: 15px;font-weight: 800;">{{ z.roundNameCn }}</p>
                <div style="display: flex;font-size: 15px;">
                  <!-- {{ z.condimentItemList }} -->
                  <div class="around1" @click="checkproduct(z.condimentLinkId,index,item.condimentLinkId)"
                       :id="z.condimentLinkId" style="padding: 7px 15px;font-size: 14px;color: gray;"
                       v-for="(inn,index) in z.condimentItemList" :key="index">
                    {{ inn.menuCn }}
                  </div>
                </div>

              </div>
            </div>


          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {getKFCProductDetail} from '@/api/store'

export default {
  data() {
    return {
      flag: false,
      num1: 0,
      productid: "",
      storeid: "",
      detalilist: [],
      list: [],
      shopcar: [],   //购物车
      goods: [],    //需要存储的商品
      count: 1,
      costprice: 0,
      loadingflag: true,

      // item:[],
      condimentcount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
  },
  watch: {
    shopcar() {
      this.shopcar = this.detalilist
      var price = this.shopcar.price
      this.costprice = price * this.count
    },
    count() {
      this.shopcar = this.detalilist
      var price = this.shopcar.price
      this.costprice = price * this.count
    }
  },
  methods: {
    editnumber(name, max, index) {
      var count = 0
      for (var i = 0; i < this.condimentcount.length; i++) {
        count = count + this.condimentcount[i]
      }
      if (count == max) {
        for (var i = 0; i < document.querySelectorAll(".step").length; i++) {
          document.querySelectorAll(".step .van-stepper__plus")[i].setAttribute("disabled", true)
        }
      }
      if (count < max) {
        this.flag = false
        for (var i = 0; i < document.querySelectorAll(".step").length; i++) {
          document.querySelectorAll(".step .van-stepper__plus")[i].removeAttribute("disabled")
        }
      }
      // console.log(event.target.parentElement.querySelector("input").value=10);
    },
    addshopcar() {
      var all = ""
      if (this.detalilist.condimentRoundList) {
        // 判断condimentLinkId 为 null_1的 并且为可多选
        if (this.detalilist.condimentRoundList[0].condimentLinkId == "null_1" && this.detalilist.condimentRoundList[0].itemCount != 1) {
          if (this.detalilist.condimentRoundList) {
            if (document.querySelectorAll(".around1").length != 0) {
              for (var i = 0; i < document.querySelectorAll(".around1").length; i++) {
                // console.log(document.querySelectorAll(".around1 span")[i].innerHTML);
                // console.log(this.condimentcount[i]);
                if(this.condimentcount[i]>0){
                  all = all + ("" + document.querySelectorAll(".around1 span")[i].innerHTML + "×" + this.condimentcount[i] + ",")
                  this.detalilist.condimentRoundList[0].condimentItemList[i].quantity = this.condimentcount[i]
                }else{
                  this.detalilist.condimentRoundList[0].condimentItemList[i] = []
                }
              }
              all = all.substring(0, all.length - 1)
              // console.log(all);
            } else {
              for (var i = 0; i < document.querySelectorAll(".around").length; i++) {
                // console.log(document.querySelectorAll(".around span")[i].innerHTML);
                // console.log(this.condimentcount[i]);
                if(this.condimentcount[i]>0){
                  all = all + ("" + document.querySelectorAll(".around span")[i].innerHTML + "×" + this.condimentcount[i] + ",")
                  this.detalilist.condimentRoundList[0].condimentItemList[i].quantity = this.condimentcount[i]
                }else{
                  this.detalilist.condimentRoundList[0].condimentItemList[i] = []
                }
              }
              all = all.substring(0, all.length - 1)
              // console.log(all);
            }
            setTimeout(()=>{
              // console.log(this.detalilist)
              if (this.goods.length > 0) {
                if (this.goods.filter(item => item.specifications == all).length > 0) {
                  this.goods.filter(item => item.specifications == all).forEach(item => {
                    item.count += this.count
                  })
                } else {
                  this.goods.push({
                    'storeid': this.storeid,
                    'specifications': all,
                    'detail': this.detalilist,
                    'count': this.count
                  })
                }
              } else {
                this.goods.push({
                  'storeid': this.storeid,
                  'specifications': all,
                  'detail': this.detalilist,
                  'count': this.count
                })
              }
              // console.log(this.goods)
              // return
              sessionStorage.setItem("goods", JSON.stringify(this.goods))
              if (sessionStorage.getItem("goods")) {
                this.$toast("加入成功")
                setTimeout(() => {
                  this.$router.go(-1)
                }, 800)
              }
            },1000)
          } else {
            // console.log("aaa");
          }
          // 判断condimentLinkId 为 null_1的 并且为单选
        } else if (this.detalilist.condimentRoundList[0].condimentLinkId == "null_1" && this.detalilist.condimentRoundList[0].itemCount == 1) {
          // console.log("1111");
          for (var i = 0; i < document.querySelectorAll(".around").length; i++) {
            var s1 = document.querySelectorAll(".around")[0]

          }
          for (var i = 0; i < document.querySelectorAll(".around1").length; i++) {
            var s2 = document.querySelectorAll(".around1")[0]
          }
          if (s1.getAttribute("name") == '1') {

            var istiaobang = document.querySelectorAll(".around span")[0].innerHTML
          } else {
            var istiaobang = document.querySelectorAll(".around1 span")[0].innerHTML
          }
          // console.log(istiaobang);
          if (this.goods.length > 0) {
            if (this.goods.filter(item => item.istiaobang == istiaobang).length > 0) {
              this.goods.filter(item => item.istiaobang == istiaobang).forEach(item => {
                item.count += this.count
              })
            } else {
              this.goods.push({
                'storeid': this.storeid,
                'detail': this.detalilist,
                'count': this.count,
                'istiaobang': istiaobang
              })
            }
          } else {
            this.goods.push({
              'storeid': this.storeid,
              'detail': this.detalilist,
              'count': this.count,
              'istiaobang': istiaobang
            })
          }
          sessionStorage.setItem("goods", JSON.stringify(this.goods))
          if (sessionStorage.getItem("goods")) {
            this.$toast("加入成功")
            setTimeout(() => {
              this.$router.go(-1)
            }, 800)
          }

          // 判断condimentLinkId 为 ""
        } else if (this.detalilist.condimentRoundList[0].condimentLinkId == "") {
          // console.log("Aaaa");
          if (this.goods.length > 0) {
            if (this.goods.filter(item => item.detail.name == this.detalilist.name).length > 0) {
              this.goods.filter(item => item.detail.name == this.detalilist.name).forEach(item => {
                item.count += this.count
              })
            } else {
              this.goods.push({'storeid': this.storeid, 'detail': this.detalilist, 'count': this.count})
            }
          } else {
            this.goods.push({'storeid': this.storeid, 'detail': this.detalilist, 'count': this.count})
          }
          // this.goods.push({'storeid': this.storeid, 'detail': this.detalilist, 'count': this.count})
          sessionStorage.setItem("goods", JSON.stringify(this.goods))
          if (sessionStorage.getItem("goods")) {
            this.$toast("加入成功")
            setTimeout(() => {
              this.$router.go(-1)
            }, 800)
          }
        }
      } else {
        var all = ""
        for (var i = 0; i < document.querySelectorAll(".around1").length; i++) {
          if (document.querySelectorAll(".around1")[i].getAttribute("name") == 1) {
            // console.log(document.querySelectorAll(".around1")[i].innerHTML);
            all = all + document.querySelectorAll(".around1")[i].innerHTML + '/'
          }
        }
        all = all.substring(0, all.length - 1)
        if (this.goods.length > 0) {
          if (this.goods.filter(item => item.specifications == all).length > 0) {
            this.goods.filter(item => item.specifications == all).forEach(item => {
              item.count += this.count
            })
          } else {
            this.goods.push({
              'storeid': this.storeid,
              'detail': this.detalilist,
              'count': this.count,
              'specifications': all
            })
          }
        } else {
          this.goods.push({
            'storeid': this.storeid,
            'detail': this.detalilist,
            'count': this.count,
            'specifications': all
          })
        }
        sessionStorage.setItem("goods", JSON.stringify(this.goods))
        if (sessionStorage.getItem("goods")) {
          this.$toast("加入成功")
          setTimeout(() => {
            this.$router.go(-1)
          }, 800)
        }
      }


      // console.log(all);
      // this.shopcar=this.detalilist
      // this.goods.push({'specifications':all,'detail':this.detalilist,'count':this.count})
      // sessionStorage.setItem("goods",JSON.stringify(this.goods))


    },
    // getKFCProductDetail
    getKFCProductDetailList() {
      let data = {
        apikey: this.$store.state.appkey,
        storeCode: this.storeid,
        linkId: this.productid
      }
      getKFCProductDetail(data).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.detalilist = res.data
          // console.log(res.data);
          if (this.detalilist.condimentRoundList) {
            this.list = this.detalilist.condimentRoundList
            this.selectDefault()
          }
          if (this.detalilist.groupRoundList) {
            this.list = this.detalilist.groupRoundList
            this.selectDefault()
          }
        } else {
          this.$toast({message: res.msg, type: "fail"})
          this.$router.go(-1)
        }
      })
    },
    selectDefault() {
      // console.log(this.list);
      this.$nextTick(() => {
        for (var i = 0; i < document.querySelectorAll(".product .selected").length; i++) {
          document.querySelectorAll(".product .selected .around")[i].style.background = '#f6f6f6'
        }


        if (!this.detalilist.condimentRoundList) {
          for (var i = 0; i < document.querySelectorAll(".around1").length; i++) {
            document.querySelectorAll('#' + document.querySelectorAll(".around1")[i].getAttribute("id"))[0].style.background = "#f6f6f6"
            document.querySelectorAll('#' + document.querySelectorAll(".around1")[i].getAttribute("id"))[0].setAttribute("name", 1)
          }
          // console.log(document.querySelectorAll(".around1").getAttribute(""))
          // for(var i=0;i<)
          // for(var i=0;i<document.querySelectorAll(".categray").length;i++){
          //     console.log(document.querySelectorAll(".categray")[i]);
          //     if(document.querySelectorAll(".categray .pcate")[i].getAttribute("name")==1){
          //         document.querySelectorAll(".categray .pcate span")[i].style.background='#f6f6f6'
          //         console.log(document.querySelectorAll(".categray .zinner")[i].getAttribute("name"));
          //         // if(document.querySelectorAll(".categray .zinner")[i].getAttribute("name")==1){
          //         //     document.querySelectorAll(".categray .zinner")[3].style.background='#f6f6f6'
          //         // }
          //     }
          // }
        }

      })

    },
    checkproduct(code, index, condiment) {
      this.$nextTick(() => {
        if (!this.detalilist.condimentRoundList) {
          // console.log(code, index);
          document.querySelectorAll("#" + code)[index].style.background = "#f6f6f6"
          document.querySelectorAll("#" + code)[index].setAttribute("name", 1)
          for (var i = 0; i < document.querySelectorAll("#" + code).length; i++) {
            if (i != index) {
              document.querySelectorAll("#" + code)[i].style.background = "#ffffff"
              document.querySelectorAll("#" + code)[i].setAttribute("name", 0)
            }
          }

        } else {
          if (this.detalilist.condimentRoundList[0].itemCount == 1) {
            document.querySelectorAll('#' + condiment)[index].style.background = "#f6f6f6"
            // console.log();
            document.querySelectorAll('#' + condiment)[index].setAttribute("name", 1)
            for (var i = 0; i < document.querySelectorAll('#' + condiment).length; i++) {
              if (i != index) {
                document.querySelectorAll('#' + condiment)[i].style.background = "#ffffff"
                document.querySelectorAll('#' + condiment)[i].setAttribute("name", 0)
              }
            }
          }
        }


      })
    },
    options(code, index, itemcount) {
      // if(this.)
      this.$nextTick(() => {
        // console.log(itemcount);
        var id = "#id" + code
        document.querySelectorAll(id)[0].style.background = "#f6f6f6"

      })
    }
  },
  mounted() {
    // 获取值
    this.num1 = this.$route.query.num1
    this.productid = this.$route.query.id
    this.storeid = this.$route.query.storeid
    // 根据num1的值判断调用哪个详情接口

    // 肯德基
    this.getKFCProductDetailList()


  },
  created() {
    if (sessionStorage.getItem("goods")) {
      // console.log(JSON.parse(sessionStorage.getItem("goods")));

      this.goods = JSON.parse(sessionStorage.getItem("goods"))
    }
  }
};
</script>

<style src="../../css/productdetail.css" scoped></style>

<style scoped>
.zinner {
  /* float: left; */
  /* display: flex;justify-content: center;align-items: center;flex-direction: column; */
}
</style>