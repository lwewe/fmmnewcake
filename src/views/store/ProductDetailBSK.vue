<template>
    <div class="productdetail">
      <NProgress v-if="loadingflag"/>
      <div class="shopcar1" style="position: fixed;z-index: 10000;">
          <!-- 有商品 -->
          <div>
              <img src="../../assets/backimage/Vector-1.png" alt="">
          </div>
          <span>￥{{ count*detalilist.price || 0 }}</span>
          <p class="btn1" @click="addshopcar()">
              <i>加入购物车</i>
              <i>Order</i>
          </p>
      </div>
      <div class="productpic">
          <img style="width: 70%;" :src="detalilist.imageUrl" alt="">
      </div>
      <div class="detail">
          <div class="wrap">
              <div class="title" style="margin-bottom: 5px">
                  <p>{{ detalilist.nameCn }}</p>
                  <van-stepper theme="round" v-model="count" button-size="22" disable-input />
              </div>
            <div v-if="list.length==0" style="font-size: 13px">{{detalilist.descCn}}</div>
              <ul v-else>
                  <li v-for="(item,index) in list" :key="index"  style="">
                    
                        <p style="color: #999;font-size: 14px;margin-top: 10px;">
                          <span>{{ item.name }}</span>
                        </p>
                        <div style="display: flex;flex-wrap: wrap;">
                            <div v-for="(inner,index) in item.itemList" class="product" :key="index" :name="inner.defaultSelected" style="width: 85px;">
                                <div style="display: flex;justify-content: center;align-items: center;">
                                    <div :class="inner.imageUrl ? 'around' : 'around1'" :id="'id'+item.id" @click="checkproduct(item.id,index)">
                                        <img v-if="inner.imageUrl" style="width: 60px;height: 60px;" :src="inner.imageUrl" alt="">
                                        <span style="font-size: 13px;">{{ inner.nameCn }}</span>
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
  import {getBSKProductDetail} from '@/api/store'
  export default {
    data() {
      return {
        num1:0,
        productid:"",
        storeid:"",
        detalilist:[],

        shopcar:[],
        list:[],
        count:1,
        goods:[],   //存入session的数组
        loadingflag:true
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
        var all=""
        // console.log(document.querySelectorAll(".around1").length);
        if(document.querySelectorAll(".around1").length==0){
          for(var i=0;i<document.querySelectorAll(".around").length;i++){
            // console.log(document.querySelectorAll(".around")[i]);
            if(document.querySelectorAll(".around")[i].getAttribute("name")=="1"){
              all=all+document.querySelectorAll(".around span")[i].innerHTML+'/'
            }
          }
        }else{
          for(var i=0;i<document.querySelectorAll(".around1").length;i++){
            if(document.querySelectorAll(".around1")[i].getAttribute("name")=="1"){
              all=all+document.querySelectorAll(".around1 span")[i].innerHTML+'/'
            }
          }
        }
        
        var all=all.substring(0, all.length - 1);
        // console.log(all);
        if(all=="" && this.list.length>0){
          this.$toast("请选择规格")
          return
        }
        this.shopcar=this.detalilist
        if (this.goods.length > 0) {
          if (this.goods.filter(item => item.specifications == all).length > 0) {
            this.goods.filter(item => item.specifications == all).forEach(item => {
              item.count += this.count
            })
          } else {
            this.goods.push({'specifications':all,'detail':this.detalilist,'count':this.count})
          }
        } else {
          this.goods.push({'specifications':all,'detail':this.detalilist,'count':this.count})
        }
        // console.log(this.goods);
        sessionStorage.setItem("goods",JSON.stringify(this.goods))
        if (sessionStorage.getItem("goods")) {
          this.$toast("加入成功")
          setTimeout(() => {
            this.$router.go(-1)
          }, 800)
        }
        

      },
      // getKFCProductDetail
      getBSKProductDetailList(){
          let data ={
              apikey: this.$store.state.appkey,
              storeCode:this.storeid,
              parLinkId:this.productid,
              orderType:"1"
          }
          getBSKProductDetail(data).then(res=>{
            if(res.code==200){
              this.loadingflag = false
                // console.log(res);
                this.detalilist=res.data
                this.list=this.detalilist.roundList
                this.selectDefault()
            }
            
          })
      },
      selectDefault(){
        this.$nextTick(()=>{
          // if(document.querySelectorAll(".around1").length==0){
          //   document.querySelectorAll(".around")[0].style.background="#f6f6f6"
          //   document.querySelectorAll(".around")[0].setAttribute("name","1")
          // }else{
          //   document.querySelectorAll(".around1")[0].style.background="#f6f6f6"
          //   document.querySelectorAll(".around1")[0].setAttribute("name","1")
          // }
            for(var i=0;i<this.list.length;i++){
                for(var j=0;j<this.list[i].itemList.length;j++){
                    if(this.list[i].itemList[j].defaultSelected==1){
                        // console.log(this.list[i].itemList[j].linkId);
                        document.querySelectorAll("#id"+this.list[i].id)[j].style.background="#f6f6f6"
                        document.querySelectorAll("#id"+this.list[i].id)[j].setAttribute("name","1")
                    }
                }
            }
        })
        
      },
      checkproduct(code,index){
          this.$nextTick(()=>{
              document.querySelectorAll("#id"+code)[index].style.background="#f6f6f6"
              document.querySelectorAll("#id"+code)[index].setAttribute("name","1")
              for(var i=0;i<document.querySelectorAll("#id"+code).length;i++){
                if(i!=index){
                    document.querySelectorAll("#id"+code)[i].style.background="#ffffff"
                    document.querySelectorAll("#id"+code)[i].removeAttribute("name")
                }
              }
          })
      },
      
    },
    mounted() {
      // 获取值
      this.num1=this.$route.query.num1
      this.productid=this.$route.query.id
      this.storeid=this.$route.query.storeid
      // 根据num1的值判断调用哪个详情接口

          // 肯德基
          this.getBSKProductDetailList()
      
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