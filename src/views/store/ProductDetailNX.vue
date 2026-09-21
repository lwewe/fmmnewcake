<template>
    <div class="productdetail">
      <NProgress v-if="loadingflag"/>
      <div class="shopcar1" style="position: fixed;z-index: 10000;">
          <!-- 有商品 -->
          <div>
              <img src="../../assets/backimage/Vector-1.png" alt="">
          </div>
          <span>￥{{ Number((count*(detalilist.discountPrice+s))).toFixed(2) || 0 }}</span>
          <p class="btn1" @click="addshopcar()">
              <i>加入购物车</i>
              <i>Order</i>
          </p>
      </div>
      <div class="productpic">
          <img :src="detalilist.itemImage" alt="">
      </div>
      <div class="detail">
          <div class="wrap">
              <div class="title" style="margin-bottom: 5px">
                  <p>{{ detalilist.itemName}}</p>
                  <van-stepper v-model="count" theme="round" button-size="22" disable-input />
              </div>
            <div style="font-size: 12px" v-html="detalilist.itemDesc" v-if="list.length<=0"></div>
                <ul v-else>
                  <li v-for="(item,index) in list" :key="index" style="">
                      <p style="color: #999;font-size: 14px;margin-top: 10px;">
                          <span >{{ item.attrName || item.name }}</span>
                      </p>
                      
                      <div style="display: flex;flex-wrap: wrap;" v-if="item.attrName">
                          <div v-for="(inner,index) in item.values" class="product" :key="index" :name="inner.checked" style="">
                              <div style="display: flex;justify-content: center;align-items: center;">
                                  <div class="around1" :id="'id'+item.attrCode"  @click="checkproduct(item.attrCode,index)" style="margin-bottom: 10px;width: 90px;">
                                      <!-- <span class="itemname" style="font-size: 13px;">{{ inner.value }}</span> -->
                                      <div style="display: flex;justify-content: center;align-items: center;font-size: 13px;">
                                        <span class="itemname" style="">{{ inner.value }}</span>
<!--                                        <span v-if="inner.amount!=0">￥</span>-->
<!--                                        <span v-if="inner.amount!=0" class="price">{{ inner.amount }}</span>-->
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div style="display: flex;flex-wrap: wrap;" v-if="item.name">
                          <div class="product" :key="index" style="width: 140px;">
                              <div style="display: flex;justify-content: center;align-items: center;">
                                  <div class="around1" :id="'id'+item.skuCode" @click="checkproduct(item.skuCode,index)" style="margin-bottom: 10px;width: 140px;">
                                    <div class="accessories" style="display: flex;justify-content: center;align-items: center;font-size: 13px;">
                                      <span class="itemname" style="">{{ item.name }}</span>
                                      <span>￥</span>
                                      <span class="price">{{ item.discountPrice }}</span>
                                    </div>
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
  import {getNXProductDetail} from '@/api/store'
  export default {
    data() {
      return {
        count:1,
        number:0,
        num1:0,
        productid:"",
        storeid:"",
        detalilist:[],
        list:[],
        shopcar:[],
        loadingflag:true,
        s:0,
        costprice:0,
        goods:[]
      };
    },
    watch:{
      shopcar(){
        this.shopcar=this.detalilist
        var price=this.shopcar.discountPrice
        this.costprice=price*this.count
      },
      count(){
        this.shopcar=this.detalilist
        var price=this.shopcar.discountPrice
        this.costprice=price*this.count
      }
    },  
    methods: {
      // 添加购物车
      addshopcar(){
        this.$toast({message: "添加成功", type: "success"})
        var all=""
        for(var i=0;i<document.querySelectorAll(".around1").length;i++){
          if(document.querySelectorAll(".around1")[i].getAttribute("name")=="checked"){
            all=all+document.querySelectorAll(".around1 .itemname")[i].innerHTML+'/'
          }
        }
        var all=all.substring(0, all.length - 1);
        // console.log(all);
        this.shopcar=this.detalilist
        var accessories=[]
        // console.log(this.goods);
        if (this.goods.length > 0) {
          if (this.goods.filter(item => item.specifications == all).length > 0) {
            this.goods.filter(item => item.specifications == all).forEach(item => {
              item.count += this.count
            })
          } else {
              for(var s=0;s<document.querySelectorAll(".accessories").length;s++){
                if(document.querySelectorAll(".accessories")[s].parentElement.getAttribute("name")=="checked"){
                  accessories.push(document.querySelectorAll(".accessories")[s].parentElement.getAttribute("id").substring(2,document.querySelectorAll(".accessories")[s].parentElement.getAttribute("id").length))
                }
              }
              this.goods.push({'specifications':all,'detail':this.detalilist,'count':this.count,'price':(this.count*(this.detalilist.discountPrice+this.s)),'accessories':accessories})
          }
        } else {
            for(var s=0;s<document.querySelectorAll(".accessories").length;s++){
              if(document.querySelectorAll(".accessories")[s].parentElement.getAttribute("name")=="checked"){
                accessories.push(document.querySelectorAll(".accessories")[s].parentElement.getAttribute("id").substring(2,document.querySelectorAll(".accessories")[s].parentElement.getAttribute("id").length))
              }
            }
            this.goods.push({'specifications':all,'detail':this.detalilist,'count':this.count,'price':(this.count*(this.detalilist.discountPrice+this.s)),'accessories':accessories})

        }

        sessionStorage.setItem("goods",JSON.stringify(this.goods))
        if (sessionStorage.getItem("goods")) {
          this.$toast("加入成功")
          setTimeout(() => {
            this.$router.go(-1)
          }, 800)
        }
      },

      // 获取星巴克商品详情
      getNXProductDetailList(){
          let data ={
              apikey: this.$store.state.appkey,
              storeId:this.storeid,
              itemId:this.productid
          }
          getNXProductDetail(data).then(res=>{
            this.loadingflag = false
            if(res.code==200){
                this.detalilist=res.data
                // console.log(res.data);
                this.list=res.data.spuAttrs

                // var s=res.data.accessories.length;
                for(var i=0;i<res.data.accessories.length;i++){
                  this.list.push(res.data.accessories[i])
                }
                // console.log(this.list);
                this.selectDefault()
            }
            
          })
      },
      
      selectDefault(){
          // 默认选中
          this.$nextTick(()=>{
            // console.log(this.list.length);
            // console.log(this.list);
              for(var i=0;i<this.list.length;i++){
                // console.log(this.list[i].attrCode);
                if(this.list[i].values){
                  for(var j=0;j<this.list[i].values.length;j++){
                    if(this.list[i].values[j].checked==1){
                        document.querySelectorAll("#id"+this.list[i].attrCode)[j].style.background="#f6f6f6"
                        document.querySelectorAll("#id"+this.list[i].attrCode)[j].setAttribute("name","checked")

                    }
                  }
                }
                
              }
          })
          
      },
      checkproduct(code,index){
        // console.log(code,index);
        
        if(code.substring(0,1)!="P"){
          // console.log("aaa");
          this.$nextTick(()=>{
            
            document.querySelectorAll("#id"+code)[index].style.background="#f6f6f6"
            document.querySelectorAll("#id"+code)[index].setAttribute("name","checked")
            if(document.querySelectorAll("#id"+code)[index].querySelectorAll(".price")[0]){
              this.s=this.s+Number(document.querySelectorAll("#id"+code)[index].querySelectorAll(".price")[0].innerHTML)
              // console.log(this.s,Number(document.querySelectorAll("#id"+code)[index].querySelectorAll(".price")[0].innerHTML));
              // console.log(Number(document.querySelectorAll("#id"+code)[index].querySelectorAll(".price")[0].innerHTML));
            }
            for(var i=0;i<document.querySelectorAll("#id"+code).length;i++){
                if(i!=index){
                    document.querySelectorAll("#id"+code)[i].style.background="#ffffff"
                    document.querySelectorAll("#id"+code)[i].removeAttribute("name")
                    if(document.querySelectorAll("#id"+code)[i].querySelectorAll(".price")[0]){
                      this.s=this.s-Number(document.querySelectorAll("#id"+code)[i].querySelectorAll(".price")[0].innerHTML)
                    }
                }
            }
       
          })
        }else{
          this.$nextTick(()=>{
            // this.s=0
            if(document.querySelectorAll("#id"+code)[0].getAttribute("name")=="checked"){
              document.querySelectorAll("#id"+code)[0].style.background="#ffffff"
              document.querySelectorAll("#id"+code)[0].removeAttribute("name")
              this.s=this.s-Number(document.querySelectorAll("#id"+code)[0].querySelectorAll(".price")[0].innerHTML)
            }else{
              document.querySelectorAll("#id"+code)[0].style.background="#f6f6f6"
              document.querySelectorAll("#id"+code)[0].setAttribute("name","checked")
              // console.log(document.querySelectorAll("#id"+code)[0].querySelectorAll("span")[0].innerHTML);
              this.s=this.s+Number(document.querySelectorAll("#id"+code)[0].querySelectorAll(".price")[0].innerHTML)
            }
            
          })
        }
          
      }
    },
    mounted() {
      // 获取值
      this.num1=this.$route.query.num1
      this.productid=this.$route.query.id
      this.storeid=this.$route.query.storeid
      // 星巴克
      this.getNXProductDetailList()
    },
    created(){
      if(sessionStorage.getItem("goods")){
        // console.log(JSON.parse(sessionStorage.getItem("goods")));
        // var goods=JSON.parse(sessionStorage.getItem("goods"))
        // this.count=goods[0].count
        this.goods=JSON.parse(sessionStorage.getItem("goods"))
      }
    }
  };
  </script>
  <style src="../../css/productdetail.css" scoped></style>