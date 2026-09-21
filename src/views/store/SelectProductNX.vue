<template>
    <div class="selectproduct">
<!--      <ReturnBack :rcolor="'#fff'" :bcolor="'rgba(218,218,218,0.26)'"></ReturnBack>-->
      <NProgress v-if="loadingflag"/>
      <van-notice-bar
        left-icon="volume-o"
        :text="text"
      />
      <div :class="!shopcarlist.length ? 'shopcar' : 'shopcar1'" :id="'shopcarbck'+num1" style="position: fixed;z-index: 10000;">
          <!-- 无商品 -->
          <img v-if="!shopcarlist.length" src="../../assets/backimage/Vector.png" alt="">
          <span v-if="!shopcarlist.length">未选购商品</span>
          <!-- 有商品 -->
          <div  @click="orderpopue()">
              <img v-if="shopcarlist.length" src="../../assets/backimage/Vector-1.png" alt="">
              <span v-if="shopcarlist.length" class="circle" style="">{{ shopcarlist.length }}</span>
          </div>
          
  
          <span v-if="shopcarlist.length" @click="orderpopue()">￥{{ sum.toFixed(2) }}</span>
          <p class="btn1" @click="shopcarlist.length ? paymentpage() : ''">
              <i>选好了</i>
              <i>Order</i>
          </p>
      </div>
      <div class="header">
          <div class="headerleft">
              <p class="store">
                  <img :src="require('../../assets/backimage/store'+num1+'.png')" style="width: 25px;" alt="">
                  <span class="storeadd">{{ productlist.storeName }}</span>
              </p>
              <p class="option"><span style="color: #000;">自取</span> | {{ productlist.storeAddress }}</p>
          </div>
          <div class="headerright" @click="switchstore()">
              <img :src="require('../../assets/backimage/replacestore'+num1+'.png')" style="width: 18px;" alt="">
              <p style="">更换门店</p>
          </div>
      </div>
      <div class="listbox">
          <!-- 左侧导航条 -->
          <ul class="leftlist" ref="leftList" style="height: 82.7vh;">

              <li id="li1" v-for="(item,index) in leftprolist" :name="item.name" :key="index" :class="{bg:index==isactive}" @click="selectname(index)">
                <a class="lia" @click="changeHash('#goli'+index)" style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
                    <img :src="item.imageOff" :name="item.name" alt="">
                    <span style="font-size: 13px;" :name="item.name || item.categoryName">{{ item.name }}</span>
                </a>  
                 
              </li>
          </ul>
          <!-- 右侧商品列表 -->
          <div class="rightlist" ref="rightList" @scroll="handleScroll($event)" >
              <ul>
                  <li v-for="(item,index) in alllist" id="libox1" :key="index">
                      <p :id="'goli'+(item[1])" v-if="index%2==0" class="title">{{ item[0] }}</p>
                      <div ref="product" v-if="index%2==1" >
                        <div class="wrap" v-for="(x,index) in item" :key="index">
                            <div class="left" style="flex: 1;">
                              <img :src="x.itemImage " alt="">
                          </div>
                          <div class="right" style="flex: 2;">
                              <p class="p1">{{ x.itemName }}</p>
                              <p class="p2">
                                  <span :class="'rightlistprice'+num1">￥{{ x.discountPrice}}</span>
                                  <button :class="'rightlistbtn'+num1" style="" @click="godetail(x.itemId,storeid)">选规格</button>
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
  `                <img src="../../assets/backimage/lajitong.png" alt="">
                  <span class="s2">清空购物车</span>
              </p>
          </div>
          <ul class="shopcarproduct">
              <li class="li1" v-for="(item,index) in shopcarlist" :key="index" style="">
                  <img :src="item.detail.itemImage"  alt="">
                  <div class="shop">
                      <p class="name">{{ item.detail.itemName }}</p>
                      <p class="specification" v-if="item.specifications">{{ item.specifications }}</p>
                      <div>
                          <span class="price" :id="'price'+index">￥{{ item.detail.discountPrice}}</span>
                          <van-stepper theme="round" min="0" button-size="22" v-model="item.count" disable-input @change="editshopnum(item.detail.itemId,item.count,index)" />
                      </div>
                  </div>
              </li>
          </ul>
      </van-popup>
    </div>
  </template>
  
  <script>
  import {getNXProductList,getNXVerify} from "@/api/store";
  import {getdbtext} from '@/api/service'
  import router from "@/router";
  import BScroll from 'better-scroll'
  export default {
    data() {
      return {
          num1:0,              //判断是那个产品
          isactive:0,
          productlist:[],      //商品总列表
          prolist2:[],         //筛选商品总列表合并成为一个列表
          leftprolist:[],      //左侧列表
          products:[],         //右侧商品列表
          showBottom:false,    //是否显示弹框
          shopnum:1,           //购物车弹框内的数量
          sum:0,               //总价钱
          value:0,
          storeid:"",          //该门店id
          alllist:[],
          shopcarlist:[],        //购物车内的商品,
          goodprice:0,    //购物车商品单价
          box:[],
          boxheight:[],
          panduan:true,



          // 头部滚动条
        titlename:"",
        ziqushijian:"",
        waimaishijian:"",
        starttime:"",
        endtime:"",
        text:"",
        loadingflag:true,
        openStatus:true,
      };
    },
    methods: {
      selectname(index){
          this.isactive=index
            this.products=this.leftprolist[index].itemList
              for(var i=0;i<document.querySelectorAll("#li1").length;i++){
                  if(i==this.isactive){
                      document.querySelectorAll("#li1")[i].style.background="#fff"
                      document.querySelectorAll("#li1")[i].style.color="#0e6941"
                      document.querySelectorAll("#li1")[i].style.fontWeight="800"
                      document.querySelectorAll("#li1 img")[i].src=this.leftprolist[i].imageOn
                  }else{
                      document.querySelectorAll("#li1")[i].style.background="#f0f0f0"
                      document.querySelectorAll("#li1")[i].style.color="gray"
                      document.querySelectorAll("#li1")[i].style.fontWeight="400"
                      document.querySelectorAll("#li1 img")[i].src=this.leftprolist[i].imageOff
                  }
                }
      },
      orderpopue(){
          this.showBottom=!this.showBottom
      },
      handleScroll(e){
        // console.log(document.querySelector(".rightlist ul").clientHeight);
        // this.panduan=true
        let scrollTop = this.$refs.rightList.scrollTop;
        
        // console.log(this.boxheight);
          for(var i=0;i<this.boxheight.length;i++){
          if(i==0){
           
          }else{
            if(scrollTop>=this.boxheight[i-1] && scrollTop<=this.boxheight[i]){
              document.querySelectorAll("#li1")[i-1].style.background="#fff"
              document.querySelectorAll("#li1")[i-1].style.color="#0e6941"
              document.querySelectorAll("#li1")[i-1].style.fontWeight="800"
              document.querySelectorAll("#li1 img")[i-1].src=this.leftprolist[i-1].imageOn

            }else{
              document.querySelectorAll("#li1")[i-1].style.background="#f0f0f0"
              document.querySelectorAll("#li1")[i-1].style.color="gray"
              document.querySelectorAll("#li1")[i-1].style.fontWeight="400"
              document.querySelectorAll("#li1 img")[i-1].src=this.leftprolist[i-1].imageOff
            }
          }
          
        
        }
        if(scrollTop<=100){
          // console.log("aaa");
          // console.log(document.querySelectorAll("#li1")[0]);
            document.querySelectorAll("#li1")[0].style.background="#fff"
            document.querySelectorAll("#li1")[0].style.color="#0e6941"
            document.querySelectorAll("#li1")[0].style.fontWeight="800"
            document.querySelectorAll("#li1 img")[0].src=this.leftprolist[0].imageOn
        }
        
        
        // console.log(scrollTop);
        
      },
      
      // 点击选好了跳转到支付
      paymentpage(){
        this.getNXProduct()
        if(!this.openStatus){
          this.$toast("门店未营业")
          return
        }
        var allgoods=[]
        var jiaoyan=[]
        var goodslist=JSON.parse(sessionStorage.getItem("goods"))
        // console.log(goodslist);
        for(var i=0;i<goodslist.length;i++){
          var accessories=[]
          if(goodslist[i].accessories!=undefined){
            accessories=goodslist[i].accessories
          }else{
            // console.log("2222");
          }
          var s=[]
          s=JSON.stringify([{
            "count":goodslist[i].count,
            "itemImage":goodslist[i].detail.itemImage,
            "categoryId":goodslist[i].detail.categoryId,
            "amount":Number(goodslist[i].detail.amount),
            "discountPrice":goodslist[i].detail.discountPrice,
            "itemId":goodslist[i].detail.itemId,
            "itemName":goodslist[i].detail.itemName,
            "goodlistname":goodslist[i].specifications,
            "skuCode":goodslist[i].detail.skuCode,
            "accessories":accessories,
            "spuAttrsType2":"",
            "spuAttrsType4":"",
            "sumprice":goodslist[i].detail.discountPrice*goodslist[i].count+'',
            "sumdiscountPrice":goodslist[i].detail.discountPrice*goodslist[i].count+''
          }])
          let data = {
          apikey: this.$store.state.appkey,
          storeId:this.$route.query.storeid,
          goods:s,
          packFlag:'0'
          }
          jiaoyan.push(...JSON.parse(s))
          // console.log(data);
          var allgoods=[]
          getNXVerify(data).then(res=>{
            // console.log(res,"订单校验");
            if(res.code==200){
                allgoods.push(res.data)
              setTimeout(() => {
                //  this.$router.push("/orderpay")
                this.$router.push({path:"/orderpay",query:{num1:this.num1}})

              }, 1000);
            }else{
                this.$toast({message:res.msg,type:"fail"})
               setTimeout(()=>{
                 this.$router.go(-1)
               },1000)
            }

            sessionStorage.setItem("allgoods",JSON.stringify(allgoods))
              
           
          })
      }
      sessionStorage.setItem("verify",JSON.stringify(jiaoyan))
        
       

          
      },
      // 更改购物车内的商品数量
      editshopnum(itemid,count,index){
        // console.log(itemid,count);
        if(count==0){
          this.shopcarlist=this.shopcarlist.filter(function(item){
              return item.count!=0
          })
          this.$toast({message: "删除商品成功", type: "success"})
        }else{
          for(var i=0;i<this.shopcarlist.length;i++){
            if(index==i){
              this.shopcarlist[i].count=count
            }
          }
        }
        sessionStorage.setItem("goods",JSON.stringify(this.shopcarlist))
        this.sumprice()
      },
      switchstore(){
        this.$router.go(-1)
      },
      // 跳转到商品详情页面
      godetail(id,storeid){
        //   console.log(id);
        //   console.log(storeid);
        this.$router.push({path:"/productdetailnx",query:{num1:this.num1,id:id,storeid:storeid}})
      },
      changeHash(idname){
        // console.log(idname);
        document.querySelector(idname).scrollIntoView(true)
      },
      
      deleteallcar(){
        this.shopcarlist=[]
        sessionStorage.removeItem("goods")
      },
      getNXProduct(){

        let data = {
          apikey: this.$store.state.appkey,
          storeId:this.$route.query.storeid
        }
        getNXProductList(data).then(res=>{
          this.loadingflag = false
            // console.log(res.data);
            if(res.code==200){
              // console.log(res.data);
                this.productlist=res.data
                this.leftprolist=res.data.menu
                this.products=this.leftprolist[0].itemList
                // 获取门店id
                this.storeid=res.data.storeId
                this.openStatus=res.data.officialStatus

                // console.log(this.leftprolist);
                for(var i=0;i<this.leftprolist.length;i++){
                    this.alllist.push([this.leftprolist[i].name,i],this.leftprolist[i].itemList)
                }
                // console.log(this.alllist);
                this.$nextTick(()=>{
                  document.querySelectorAll("#li1")[0].style.background="#fff"
                  document.querySelectorAll("#li1")[0].style.color="#0e6941"
                  document.querySelectorAll("#li1")[0].style.fontWeight="800"
                  document.querySelectorAll("#li1 img")[0].src=this.leftprolist[0].imageOn
                })

                this.$nextTick(()=>{
                  this.boxheight=[]
                  this.box=[]
                  
                  // console.log(document.querySelectorAll("#libox1"));
                  for(var i=0;i<document.querySelectorAll("#libox1").length;i++){
                    if(i%2!=0){
                      this.box.push(document.querySelectorAll("#libox1")[i].clientHeight)
                    }
                  }
                  
                  for(var j=0;j<this.box.length;j++){
                    var height=0
                    if(j==0){
                      height=this.box[0]
                    }else{
                      for(i=0;i<j;i++){
                        height=height+this.box[i]
                      }
                    }
                    
                    this.boxheight.push(height)
                  
                  }
                  // console.log(this.boxheight);
                })
               

            }else{
              this.$toast({message: res.msg, type: "fail"})
            }
            this.starttime=this.productlist.starttime;
            this.endtime=this.productlist.endtime;
            getdbtext({
            type:"nx"
            }).then(res=>{
            // console.log(res);
            if(res.code==200){
                // console.log(res);
                if(this.flag){
                    this.waimaishijian=res.data.nxwmts
                    this.text=this.waimaishijian+this.starttime+'至'+this.endtime+'。'
                }else{
                    this.ziqushijian=res.data.nxdcts
                    this.text=this.ziqushijian+this.starttime+'至'+this.endtime+'。'
                    // console.log(this.productlist,"1111");
                }
               
            }
            })
          
        })
      },
      sumprice(){
        this.sum=0
        for(var i=0;i<this.shopcarlist.length;i++){
          this.sum=this.sum+(this.shopcarlist[i].detail.discountPrice*this.shopcarlist[i].count)
        }
      }
      
    },
    mounted() {
   
          // 获取星巴克该门店商品
          this.getNXProduct()

       // 获取左侧列表的DOM元素
       const leftList = this.$refs.leftList;
      const rightList = this.$refs.rightList;
      // 设置左侧列表的高度和样式
      leftList.style.height = '85vh';
      leftList.style.overflowY = 'auto';
      // 设置左侧列表的高度和样式
      rightList.style.height = '70vh';
      rightList.style.overflowY = 'auto';

            this.$nextTick(()=>{
                // const navItem=document.querySelectorAll("#li1")
                // console.log(document.querySelectorAll("#li1"));
            })
        
    },
    created(){
      // 获取num1
      this.num1=this.$route.query.num1
    //   获取商品
    if(sessionStorage.getItem("goods")){
      this.shopcarlist=JSON.parse(sessionStorage.getItem("goods"))
      // console.log(this.shopcarlist);
      
      this.sumprice()
    } 
    
    // console.log(JSON.parse(sessionStorage.getItem("shopcar")));
    },
  };
  </script>
<style src="../../css/productlist.css" scoped></style>