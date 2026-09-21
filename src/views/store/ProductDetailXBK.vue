<template>
  <div class="productdetail">
    <NProgress v-if="loadingflag"/>
    <div class="shopcar1"style="position: fixed;z-index: 10000;background-color: #0E6941;">
      <!-- 有商品 -->
      <div>
        <img src="../../assets/backimage/Vector-1.png" alt="">
      </div>
      <span>￥{{ (count * fullPrice).toFixed(2) }}</span>
      <p class="btn1" @click="addshopcar()">
        <i>加入购物车</i>
        <i>Order</i>
      </p>
    </div>
    <div class="productpic">
      <img :src="productobject.default_image" alt="">
    </div>
    <div class="detail">
      <div class="wrap">
        <div class="title" style="margin-bottom: 5px">
          <p>{{ productobject.name }}</p>
          <van-stepper v-model="count" theme="round" button-size="22" disable-input/>
        </div>
        <ul v-if="productmapping.Grande_Cold||productrules.length>0">
          <li v-for="(item, index) in productrules" :key="index" style="">
            <div style="color: #999;font-size: 14px;margin-top: 10px;display: flex;align-items: center;">
              <span v-if="item.extra_list != undefined || item.extra_list != ''">{{ item.name }}</span>
              <!-- <div v-if="item.extra_list.length==0 && item.code!='BlondeExtraFilter'" style="margin-left: 30px;">
                <van-stepper class="step" style="display: flex;" min="0" :default-value="0" theme="round" disable-input />
              </div> -->
            </div>
            <div style="display: flex;flex-wrap: wrap;width: 100%;" v-if="item.extra_list.length>0">
              <div v-for="(inner, index) in item.extra_list" class="product" :code="item.code" :id="item.code"
                   :key="index" :name="inner.is_default"
                   :style="{ width: item.display_type != 'bar' ? '110px' : '100%'}">
                <div style="display: flex;justify-content: center;align-items: center;width: 100%;"
                     @click="item.code == 'Cupsize' ? selectsize(inner.code, inner) : ''">
                  <!--                  {{ inner.code=="6111065" }}-->
                  <div class="around1" :id="'id' + item.code"
                       @click="checkproduct(item.code, index, item.display_type,inner.code,inner.name,inner)"
                       :style="{backgroundColor:inner.is_default===1?'#f6f6f6':item.display_type != 'bar' ? '' : '#f6f6f6' }">
<!--                    {{ inner.code }}-->
                    <!--                    {{ inner.count }}-->
                    <!-- :style="{background: item.code=='Other' || item.code=='ChangeSyrup' || item.code=='CoconutMilk'  ? '' : '#f6f6f6'}" -->
                    <!-- code!='Other' && code!='ChangeSyrup' && code !='CoconutMilk' && code != 'RistrettoDecafMopFilter' -->
                    <!--                    {{item.mindefaultw}}-->
                    <div class="stepbox" :style="{ background: item.display_type != 'bar' ? '' : '#f6f6f6' }">
                      <span class="itemname" :code="inner.code" style="font-size: 13px;">{{ inner.name }}</span>
                      <van-stepper class="step" style="display: flex;" :min="inner.is_default" :max="item.maxNumber"
                                   :default-value="inner.number" v-if="item.display_type == 'bar'"
                                   @change="changecount(inner, item.code,item.display_type)" theme="round" disable-input
                                   v-model="inner.number"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- <div style="display: flex;flex-wrap: wrap;width: 100%;">
                <div v-for="(inner,index) in arr2[0]" class="product" :id="item.code"  :key="index" :name="inner.is_default" :style="{width: item.display_type!='bar' ? '110px' : '100%'}">
                    <div style="display: flex;justify-content: center;align-items: center;width: 100%;" @click="item.code=='Cupsize' ? selectsize(inner.name) : ''">

                        <div class="around1" :id="'id'+item.code" @click="checkproduct(item.code,index)" :style="{background: item.display_type!='bar' ? '#fff' : '#f6f6f6'}">
                          <div class="stepbox" :style="{background: item.display_type!='bar' ? '' : '#f6f6f6'}">
                              <span style="font-size: 13px;">{{ inner.name }}</span>
                              <van-stepper class="step" style="display: flex;" :min="inner.is_default" :default-value="inner.is_default" v-if="item.display_type=='bar'" @change="changecount('#id'+item.code,index,item.name)" theme="round" disable-input />
                          </div>


                          </div>

                    </div>
                </div>
            </div> -->


          </li>
        </ul>
        <div v-else>
          <div style="font-size: 14px" v-if="productobject.description">{{
              productobject.description.replace(/n/g, "")
            }}
          </div>
          <!--          <div>{{ productobject.note }}</div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getXBKProductDetail} from '@/api/store'
import {set} from 'vue';

export default {
  data() {
    return {
      count: 1,
      number: 0,
      num1: 0,
      productid: "",
      storeid: "",
      detalilist: [],
      list: [],
      countbox: [],
      //   xbk
      productobject: [],
      productmapping: [],
      rules: [],
      s1: "",

      zindex: 0,

      productrules: [],
      customizations: [],


      countcondimentflag: true,     //判断小料组有没有添加到最多
      countcondimentprice: 0,


      arr2: [],                //有没有添加或更改笑料
      price: 0,
      cupsize1: 0,
      fullPrice: 0,
      tumbler: "",
      allNumber: 0,
      code: "",


      nobararr: [],

      shopcar: [],
      goods: [],
      cupName: "",
      cupnum: "",
      addExtra: [],
      otherList: [],
      isHot: false,
      loadingflag: true,
      extractionCode: ''
    };
  },
  methods: {
    selectsize(code, inner) {
      // console.log(code, inner,"**********")
      // this.cupName = inner.name
      // this.arr2 = []
      // this.cupsize1 = 0
      // this.tumbler = code
      // if (code == "Tall") {
      //   if (this.productmapping.Tall_Cold) {
      //     this.cupsize1 = this.productmapping.Tall_Cold.sku_id
      //     this.fullPrice = this.productmapping.Tall_Cold.price
      //   }
      //   if (this.productmapping.Tall_Hot) {
      //     this.cupnum = this.productmapping.Tall_Hot.sku_id
      //     this.fullPrice = this.productmapping.Tall_Hot.price
      //   }
      // } else if (code == "Grande") {
      //   if (this.productmapping.Grande_Cold) {
      //     this.cupsize1 = this.productmapping.Grande_Cold.sku_id
      //     this.fullPrice = this.productmapping.Grande_Cold.price
      //   }
      //   if (this.productmapping.Grande_Hot) {
      //     this.cupnum = this.productmapping.Grande_Hot.sku_id
      //     this.fullPrice = this.productmapping.Grande_Hot.price
      //   }
      // } else if (code == "Venti") {
      //   if (this.productmapping.Venti_Cold) {
      //     this.cupsize1 = this.productmapping.Venti_Cold.sku_id
      //     this.fullPrice = this.productmapping.Venti_Cold.price
      //   }
      //   if (this.productmapping.Venti_Hot) {
      //     this.cupnum = this.productmapping.Venti_Hot.sku_id
      //     this.fullPrice = this.productmapping.Venti_Hot.price
      //   }
      // } else if (code == "Intenso") {
      //   if (this.productmapping.Intenso_Cold) {
      //     this.cupsize1 = this.productmapping.Intenso_Cold.sku_id
      //     this.fullPrice = this.productmapping.Intenso_Cold.price
      //   }
      //   if (this.productmapping.Intenso_Hot) {
      //     this.fullPrice = this.productmapping.Intenso_Hot.price
      //     this.cupnum = this.productmapping.Intenso_Hot.sku_id
      //   }
      // }
      // this.changecount({}, this.tumbler)
    },
    getFullNumber(code) {
      // console.log(code)
      if (code == "Tall") {
        if (this.productmapping.Tall_Cold) {
          this.cupsize1 = this.productmapping.Tall_Cold.sku_id
          this.fullPrice = this.productmapping.Tall_Cold.price
        }
        if (this.productmapping.Tall_Hot) {
          this.cupnum = this.productmapping.Tall_Hot.sku_id
          this.fullPrice = this.productmapping.Tall_Hot.price
        }
      } else if (code == "Grande") {
        if (this.productmapping.Grande_Cold) {
          this.cupsize1 = this.productmapping.Grande_Cold.sku_id
          this.fullPrice = this.productmapping.Grande_Cold.price
        }
        if (this.productmapping.Grande_Hot) {
          this.cupnum = this.productmapping.Grande_Hot.sku_id
          this.fullPrice = this.productmapping.Grande_Hot.price
        }
      } else if (code == "Venti") {
        if (this.productmapping.Venti_Cold) {
          this.cupsize1 = this.productmapping.Venti_Cold.sku_id
          this.fullPrice = this.productmapping.Venti_Cold.price
        }
        if (this.productmapping.Venti_Hot) {
          this.cupnum = this.productmapping.Venti_Hot.sku_id
          this.fullPrice = this.productmapping.Venti_Hot.price
        }
      } else if (code == "Intenso") {
        if (this.productmapping.Intenso_Cold) {
          this.cupsize1 = this.productmapping.Intenso_Cold.sku_id
          this.fullPrice = this.productmapping.Intenso_Cold.price
        }
        if (this.productmapping.Intenso_Hot) {
          this.fullPrice = this.productmapping.Intenso_Hot.price
          this.cupnum = this.productmapping.Intenso_Hot.sku_id
        }
      }
    },
    changecount(inner, code,display_type) {
      // console.log(inner, code,display_type)
      // if (display_type != "bar") {
      //   return
      // }
      // console.log(inner, code)
      this.code = code
      var count = 0
      var defaultw = 0
      var allNumber = 0
      this.allNumber = 0
      var must = 0
      var mindefaultw = 0
      var repurchase = 0
      this.getFullNumber(this.tumbler)
      this.rules.forEach(item => {
        if (item.code == this.cupsize1) {
          item.rules.forEach(item2 => {
            if (item2.group_code == code) {
              // console.log(item2,"item2")
              if (item2.group_name == "浓缩咖啡") {
                repurchase = item2.repurchase
              } else {
                repurchase = 1
              }
              allNumber = item2.group_max_number
              mindefaultw = item2.group_min_number
              // console.log(item2,mindefaultw,item2.group_code,"cccccccccccc")
              item2.group_detail_rules.forEach(item3 => {
                count = item3.default_count
                // console.log(item3,count,"[[[")
                defaultw = item3.max_number
                must = item3.must
              })
            }
          })
        }
      })
      this.productrules.forEach(item => {
            item.extra_list.forEach((item2, index) => {
              if (item.code == code) {
                if (item2.name == "浓缩份数") {
                  item2.count = 2
                } else {
                  item2.count = count
                }
                item.maxNumber = defaultw
                item.mindefaultw = mindefaultw
                item2.repurchase = repurchase
                // if(item2.is_default==1){
                //   item2.number = item.mindefaultw
                // }else{
                //   item2.number = item2.is_default
                // }
                this.allNumber += item2.number
                if (Number(item2.number) >= item.maxNumber) {
                  item2.number = item.maxNumber
                }
                // console.log(this.allNumber , allNumber,this.allNumber >= allNumber,"[[[")
                if (item.display_type == "bar") {
                  setTimeout(() => {
                    if (this.allNumber >= allNumber) {
                      // console.log(index, "index888888888")
                      // console.log(document.querySelectorAll("#id"+code)[k])
                      document.querySelectorAll("#id" + code)[index].querySelectorAll(".van-stepper__plus")[0].setAttribute("disabled", true)
                    } else {
                      document.querySelectorAll("#id" + code)[index].querySelectorAll(".van-stepper__plus")[0].removeAttribute("disabled")
                    }
                  }, 15)
                }
              }
              // console.log(item2.must == 0 && item2.price > 0)
              if (item2.repurchase == 0 && item2.must == 0) {
                item2.number = 0
              }
              // console.log(item2.number != item.mindefaultw)
              if (item2.repurchase == 1 && item2.must == 0 && item2.price > 0) {
                if (item2.price > 0 && item.display_type != 'bar') {
                  if (inner.name == item2.name) {
                    if (item2.is_default == 1) {
                      item2.is_default = 0
                      item2.number = 0
                    } else {
                      item2.is_default = 1
                      item2.number = 1
                    }
                  }
                  if (code == "NoDefultCream" && inner.name != item2.name) {
                    item2.is_default = 0
                    item2.number = 0
                  }
                }
                // console.log(item2.number,"222222222222",item.code)
                // console.log(item2.is_default == 1 , item.code == "StandardStandardMopFilter","9999999999999999999999999")|| item.code == "StandardStandardMopFilter"
                // console.log(item2.name,item2.count,count,"item2.count")
                if (item2.is_default >= 1) {
                  var num = (item2.number - (item2.is_default + 1)).toString().includes("-") ? 0 : item2.number - (item2.is_default)
                  if (item2.price > 0 && item.display_type != 'bar') {
                    num = item2.number
                  }
                  // console.log(item2.number - (item2.is_default + 1).toString().includes("-"), num, "num")
                  // setTimeout(()=>{
                  // console.log(num, "============")
                  // console.log(item2.name, this.fullPrice, item2.price, num, count, Number(Math.ceil(num) / item2.count), Math.floor(Number(item2.price)) * Number(Math.ceil(num) / item2.count), "4444444444444444444444444444")
                  // console.log(item2.name, Number(item2.price), "wwwwwwwwwww", Number(item2.number))
                  if (item2.count > 0) {
                    this.fullPrice += Math.floor(Number(item2.price)) * Math.ceil(Number(Math.ceil(num) / item2.count))
                  } else {
                    this.fullPrice = this.fullPrice
                  }
                  // },10)
                } else {
                  // console.log(this.fullPrice, "[[[[[[[[[[[[[[")
                  // console.log(item2.name, Number(item2.price), "wwwwwwwwwww", Number(item2.number))
                  // setTimeout(()=>{
                  if (item2.count > 0) {
                    // console.log(item2.name, item2.number, count, Number(((item2.number / item2.count))), "xxxxxxxxxxxxx")
                    this.fullPrice += Math.floor(Number(item2.price)) * Math.ceil(Number(Math.ceil(item2.number) / item2.count))
                  } else {
                    this.fullPrice = this.fullPrice
                  }
                  // },10)
                  // console.log(this.fullPrice, "----------")
                }
                // console.log(this.fullPrice)
              }
            })

          }
      )

    },
    addshopcar() {
      this.addExtra = []
      if(this.productrules.filter(item=>item.name.includes('浓缩')).length>0?this.productrules.filter(item=>item.name.includes('浓缩'))[0].extra_list.filter(item2=>item2.number==0).length>0:false){
        this.$toast("浓缩份数为必选")
        return
      }
      // log
      // console.log(this.cupsize1,"热量");
      // console.log(this.cupsize1,"zzzzz");
      var all = ""
      // for (var i = 0; i < document.querySelectorAll(".around1").length; i++) {
      //   if (document.querySelectorAll(".around1")[i].parentElement.parentElement.getAttribute("name") == "1") {
      //     all = all + (document.querySelectorAll(".around1 .itemname")[i].innerHTML) + '/'
      //   }
      //   // + "×"+Number(document.querySelectorAll(".step")[i].querySelectorAll(".van-stepper__input")[0].value)
      // }
      if (this.productrules.length > 0) {
        this.productrules.forEach(item => {
          item.extra_list.forEach((item2, index) => {
            if ((item.display_type == 'bar' && item2.number > 0) || (item.display_type != "bar" && item2.is_default == 1)) {
              all += item2.name + (item.display_type == 'bar' ? "×" + item2.number : '') + '/'
            }
          })
        })
        var all = all.substring(0, all.length - 1);
      } else {
        all = this.productobject.category_name
      }

      // console.log(all,this.productrules)
      // return
      // console.log(all);
      // this.shopcar=this.detalilist
      for (var i = 0; i < document.querySelectorAll(".step").length; i++) {
        // console.log(document.querySelectorAll(".step")[i].parentElement.querySelectorAll(".itemname")[0].getAttribute("code"), "[[[");
        this.addExtra.push({
          'extra_sku': document.querySelectorAll(".step")[i].parentElement.querySelectorAll(".itemname")[0].getAttribute("code"),
          'qty': Number(document.querySelectorAll(".step")[i].querySelectorAll(".van-stepper__input")[0].value)
        })
      }
      this.addExtra = this.unique(this.addExtra)
      // console.log(this.addExtra, 'this.addExtra')
      // return;
      var a = []
      this.nobararr.forEach(item => {
        a.push(item.innercode)
      })
      var s = Array.from(new Set(a))
      // console.log(s, "this.nobararr")
      for (var j = 0; j < s.length; j++) {
        // console.log(s[j]);
        this.addExtra.push({
          'extra_sku': s[j],
          'qty': 1

        })
      }
      // console.log(Array.from(new Set(this.nobararr)));
      this.addExtra = this.unique(this.addExtra)
      // console.log(this.addExtra, 'this.addExtra');
      // return;

      // console.log(this.productobject);
      var accessories = []
      // this.goods.push()
      // console.log(this.cupsize1,"8888888"+this.cupnum,"[[[[[[[[[[[[")
      var a = 0
      // console.log(this.cupnum, this.cupsize1)
      if (this.rules.length > 0) {
        if (this.isHot) {
          a = this.cupnum ? this.cupnum : this.cupsize1
        } else {
          a = this.cupsize1
        }
      } else {
        a = this.productobject.code
      }

      // console.log(this.isHot,a,"[[[[[[[[[[[[[[")
      // return;
      // this.goods.push({
      //   'specifications': all,
      //   'detail': this.productobject,
      //   'count': this.count,
      //   'price': this.fullPrice.toFixed(2),
      //   'addExtra': this.addExtra,
      //   "cupsize": a
      // })
      if (this.goods.filter(item => item.specifications == all && item.fullPrice==this.fullPrice).length > 0) {
        this.goods.filter(item => item.specifications == all && item.fullPrice==this.fullPrice).forEach(item => {
          item.count += this.count
        })
      } else {
        this.goods.push({
          storeid: this.storeid,
          specifications: all,
          detail: this.productobject,
          fullPrice: this.fullPrice.toFixed(2),
          count: this.count,
          addExtra: this.addExtra,
          cupsize: a
        })
      }
      // console.log(this.goods, "goods");
      // return
      sessionStorage.setItem("goods", JSON.stringify(this.goods))
      if (sessionStorage.getItem("goods")) {
        this.$toast("加入成功")
        setTimeout(() => {
          this.$router.go(-1)
        }, 800)
      }
    }
    ,
    unique(arr) {
      const res = new Map();
      return arr.filter((arr) => arr.qty != 0 && !res.has(arr.extra_sku) && res.set(arr.extra_sku, 1));
    }
    ,
// 获取星巴克商品详情
    getXBKProductDetailList() {
      let data = {
        apikey: this.$store.state.appkey,
        storeId: this.storeid,
        productId: this.productid
      }
      getXBKProductDetail(data).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          // console.log(res.data);
          this.productobject = res.data.customization_data
          this.productmapping = res.data.coffee_sku_mapping
          this.rules = res.data.rules
          const uniqueUsers = [];
          const map = new Map();
          this.productobject.customizations.forEach(user => {
            if (user.name.includes('浓缩')) {
              uniqueUsers.push(user);
            } else {
              if (!map.has(user.name)) {
                map.set(user.name, true);
                uniqueUsers.push(user);
              }
            }
          });
          uniqueUsers.forEach(item => {
            item.extra_list.forEach(item2 => {
              item2.number = item2.is_default
              if (item.name == "萃取方式" && item2.is_default == 1) {
                this.extractionCode = item2.code
              }
              // if(item.name.includes('浓缩')){
              //   item2.is_default = 1
              // }
            })
            this.productrules.push({
              ...item,
              maxNumber: 100,
            })
          })
          this.productrules = this.productrules.filter(item => {
            if (item.name.includes('浓缩')) {
              return item.code == this.extractionCode
            } else {
              return item
            }
          })
          if (!this.productmapping.Grande_Cold || this.productobject.customizations.length == 0) {
            this.fullPrice = this.productobject.price
          }
          this.selectDefault()
        }
      })
    },
    selectDefault() {
      // console.log("走了")
      // if (this.productmapping) {
      this.productobject.customizations.forEach(item => {
        item.extra_list.forEach(item2 => {
          if (item2.is_default == 1) {
            if(item.code == 'Temperature'){
              if (item2.name.includes("冰")) {
                this.isHot = false
              } else {
                this.isHot = true
              }
            }
            // console.log(item2.name, item2.code)
            this.nobararr.push({
              innercode: item2.code,
              code: item.code
            })
            this.otherList = this.nobararr
            if (item.code == "Cupsize") {
              // console.log("888888888888888888888888", item.code)
              if (item2.code == "Tall") {
                // console.log(111)
                this.tumbler = "Tall"
                this.cupName = "中杯"
                if (this.productmapping.Tall_Cold) {
                  this.cupsize1 = this.productmapping.Tall_Cold.sku_id
                  this.fullPrice = this.productmapping.Tall_Cold.price

                }
                // console.log(this.fullPrice, "[,,,,,,,,,,,,,,,,,,")
                if (this.productmapping.Tall_Hot) {
                  this.cupnum = this.productmapping.Tall_Hot.sku_id
                  this.fullPrice = this.productmapping.Tall_Hot.price
                }
              } else if (item2.code == "Grande") {
                // console.log(222)
                this.tumbler = "Grande"
                this.cupName = "大杯"
                if (this.productmapping.Grande_Cold) {
                  this.cupsize1 = this.productmapping.Grande_Cold.sku_id
                  this.fullPrice = this.productmapping.Grande_Cold.price
                }
                if (this.productmapping.Grande_Hot) {
                  this.cupnum = this.productmapping.Grande_Hot.sku_id
                  this.fullPrice = this.productmapping.Grande_Hot.price
                }
              } else if (item2.code == "Venti") {
                // console.log(333)
                this.tumbler = "Venti"
                this.cupName = "超大杯"
                if (this.productmapping.Venti_Cold) {
                  this.cupsize1 = this.productmapping.Venti_Cold.sku_id
                  this.fullPrice = this.productmapping.Venti_Cold.price
                }
                if (this.productmapping.Venti_Hot) {
                  this.cupnum = this.productmapping.Venti_Hot.sku_id
                  this.fullPrice = this.productmapping.Venti_Hot.price
                }
              } else if (item2.code == "Intenso") {
                // console.log(444)
                this.tumbler = "Intenso"
                if (this.productmapping.Intenso_Cold) {
                  this.cupsize1 = this.productmapping.Intenso_Cold.sku_id
                  this.fullPrice = this.productmapping.Intenso_Cold.price
                }
                this.cupName = "\浓/小杯"
                if (this.productmapping.Intenso_Hot) {
                  this.fullPrice = this.productmapping.Intenso_Hot.price
                  this.cupnum = this.productmapping.Intenso_Hot.sku_id
                }
              }
            }
            // setTimeout(()=>{
            //   this.changecount(item2,item.code)
            // },200)
          }
        })
      });
      // }
    }
    ,
    checkproduct(code, index, display_type, innercode, name, inner) {
      this.changecount(inner, code)
      // this.addExtra = []
      // console.log(code, index, display_type, innercode, name, inner,"[[[")
      if (display_type == "bar") {
        return
      }
      this.productrules = []
      if(code == 'Temperature'){
        if (name.includes("冰")) {
          this.isHot = false
        } else {
          this.isHot = true
        }
      }
      // console.log( this.isHot,"[[[[[[[[[[")
      // console.log(code,"code")
      this.productobject.customizations.forEach(item => {
        item.extra_list.forEach(item2 => {
          if (item2.price > 0) {
            return
          }
          if (code == item.code) {
            if (item2.is_default == 1) {
              item2.is_default = 0
            }
            if (item2.code == innercode) {
              item2.is_default = 1
            }
          }
          // if(item2.is_default==1){
          //   console.log(item2.name)
          //   console.log(item)
          // }
        })
      });
      const uniqueUsers = [];
      const map = new Map();
      this.productobject.customizations.forEach(user => {
        if (user.name.includes('浓缩')) {
          uniqueUsers.push(user);
        } else {
          if (!map.has(user.name)) {
            map.set(user.name, true);
            uniqueUsers.push(user);
          }
        }
      });
      uniqueUsers.forEach(item => {
        item.extra_list.forEach(item2 => {
          item2.number = item2.is_default
          if (item.name == "萃取方式" && item2.is_default == 1) {
            this.extractionCode = item2.code
          }
          // if(item.name.includes('浓缩')){
          //   item2.is_default = 1
          // }
        })
        this.productrules.push({
          ...item,
          maxNumber: 100,
        })
      })
      this.productrules = this.productrules.filter(item => {
        if (item.name.includes('浓缩')) {
          return item.code == this.extractionCode
        } else {
          return item
        }
      })
      //
      this.otherList.forEach(item => {
        if (item.code == code) {
          this.nobararr = this.nobararr.filter((item2, index) => item2.code != item.code)
        }
      })
      // console.log(innercode=="6111062","-----------------");
      if(inner.is_default==1){
        this.nobararr.push({innercode, code})
      }else {
        this.nobararr = this.nobararr.filter(item=>item.innercode!=innercode)
      }
      // console.log(this.nobararr, "this.nobararr")
      var cupsize = 0
      // console.log("888888888888888888888888", item.code)
      if (innercode == "Tall") {
        // console.log(111)
        this.tumbler = "Tall"
        this.cupName = "中杯"
        if (this.productmapping.Tall_Cold) {
          this.cupsize1 = this.productmapping.Tall_Cold.sku_id
          this.fullPrice = this.productmapping.Tall_Cold.price

        }
        // console.log(this.fullPrice, "[,,,,,,,,,,,,,,,,,,")
        if (this.productmapping.Tall_Hot) {
          this.cupnum = this.productmapping.Tall_Hot.sku_id
          this.fullPrice = this.productmapping.Tall_Hot.price
        }
      } else if (innercode == "Grande") {
        // console.log(222)
        this.tumbler = "Grande"
        this.cupName = "大杯"
        if (this.productmapping.Grande_Cold) {
          this.cupsize1 = this.productmapping.Grande_Cold.sku_id
          this.fullPrice = this.productmapping.Grande_Cold.price
        }
        if (this.productmapping.Grande_Hot) {
          this.cupnum = this.productmapping.Grande_Hot.sku_id
          this.fullPrice = this.productmapping.Grande_Hot.price
        }
      } else if (innercode == "Venti") {
        // console.log(333)
        this.tumbler = "Venti"
        this.cupName = "超大杯"
        if (this.productmapping.Venti_Cold) {
          this.cupsize1 = this.productmapping.Venti_Cold.sku_id
          this.fullPrice = this.productmapping.Venti_Cold.price
        }
        if (this.productmapping.Venti_Hot) {
          this.cupnum = this.productmapping.Venti_Hot.sku_id
          this.fullPrice = this.productmapping.Venti_Hot.price
        }
      } else if (innercode == "Intenso") {
        // console.log(444)
        this.tumbler = "Intenso"
        if (this.productmapping.Intenso_Cold) {
          this.cupsize1 = this.productmapping.Intenso_Cold.sku_id
          this.fullPrice = this.productmapping.Intenso_Cold.price
        }
        this.cupName = "\浓/小杯"
        if (this.productmapping.Intenso_Hot) {
          this.fullPrice = this.productmapping.Intenso_Hot.price
          this.cupnum = this.productmapping.Intenso_Hot.sku_id
        }
      }
      // if (code !== 'ChangeSyrup') {
      //   this.$nextTick(() => {
      //     document.querySelectorAll("#id" + code)[index].style.background = "#f6f6f6"
      //     document.querySelectorAll("#id" + code)[index].parentElement.parentElement.setAttribute("name", "1")
      //
      //     for (var i = 0; i < document.querySelectorAll("#id" + code).length; i++) {
      //       if (i != index) {
      //         if (code != 'Other' && code != 'ChangeSyrup' && code != 'CoconutMilk' && code != 'RistrettoDecafMopFilter') {
      //           document.querySelectorAll("#id" + code)[i].style.background = "#ffffff"
      //           document.querySelectorAll("#id" + code)[i].parentElement.parentElement.removeAttribute("name")
      //         }
      //
      //       }
      //     }
      //   })
      // }
    }
  },
  mounted() {
    // 获取值
    this.num1 = this.$route.query.num1
    this.productid = this.$route.query.id
    this.storeid = this.$route.query.storeid

    // 星巴克
    this.getXBKProductDetailList()

  }
  ,
  created() {
    if (sessionStorage.getItem("goods")) {
      // console.log(JSON.parse(sessionStorage.getItem("goods")));

      this.goods = JSON.parse(sessionStorage.getItem("goods"))
    }
  }
}
;
</script>
<style src="../../css/productdetail.css" scoped></style>
<style scoped>
.around1 {
  margin-bottom: 10px;
  width: 100%;
}

.stepbox {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}
/deep/.van-stepper__plus{
  background-color: #0E6941 !important;
}
/deep/ .van-stepper__plus::after  {
  background-color: #fff !important;
}
/deep/.van-stepper__plus::before  {
  background-color: #fff !important;
}
</style>