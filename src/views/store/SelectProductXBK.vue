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
          
  
          <span v-if="shopcarlist.length" @click="orderpopue()">￥{{ sum }}</span>
          <p class="btn1" @click="shopcarlist.length ? paymentpage() : ''">
              <i>选好了</i>
              <i>Order</i>
          </p>
      </div>
      <div class="header">
          <div class="headerleft">
              <p class="store">
                  <img :src="require('../../assets/backimage/store'+num1+'.png')" style="width: 25px;" alt="">
                  <span class="storeadd">{{ productlist.name }}</span>
              </p>
              <p class="option"><span style="color: #000;">自取</span> | {{ productlist.address }}</p>
          </div>
          <div class="headerright" @click="switchstore()">
              <img :src="require('../../assets/backimage/replacestore'+num1+'.png')" style="width: 18px;" alt="">
              <p style="">更换门店</p>
          </div>
      </div>
      <div class="listbox">
          <!-- 左侧导航条 -->
          <ul class="leftlist" ref="leftList">
              <li id="li1" :style="{display:index==0?'none':''}" v-for="(item,index) in leftprolist" :name="item.name || item.categoryName" :key="index" :class="{bg:index==isactive}" @click="selectname(index)" style="height: 50px">
                <a class="lia" @click="changeHash('#goli'+index)" style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
                 <img v-if="num1==1" :src="item.image" :name="item.categoryName" alt="">
                  <img v-if="num1==4" :src="item.default_image" :name="item.name" alt="">
                  <span style="font-size: 13px;" :name="item.name || item.categoryName">{{ item.name }}{{ item.categoryName }}</span>
                </a>
              </li>
          </ul>
          <!-- 右侧商品列表 -->
          <div class="rightlist" ref="rightList" @scroll="handleScroll($event)">
              <ul>
                <li v-for="(x,index) in alllist" :key="index" id="libox1" :style="{display:index==0||index==1?'none':''}">
                    <p :id="'goli'+(x[1])" v-if="index%2==0" class="title">{{ x[0] }}</p>
                    <div v-if="index%2==1">
                        <div class="wrap" v-for="(item,index) in x" :key="index">
                            <div class="left" style="flex: 1;">
                                <img :src="item.default_image " alt="">
                            </div>
                            <div class="right" style="flex: 2;">
                                <p class="p1">{{ item.name }}</p>
                                <p class="p2">
                                    <span :class="'rightlistprice'+num1">￥{{ item.price || item.priceInfo.amount }}</span>
                                    <button :class="'rightlistbtn'+num1" style="" @click="godetail(item.id || item.productCode,storeid)">选规格</button>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                </li>
                  <!-- <p class="title" v-once>{{ leftprolist.name }}</p> -->
                  <!-- <li v-for="(item,index) in products" id="libox1" :key="index">
                    
                      <div class="wrap">
                          
                        </div>
  
                  </li> -->
              </ul>
          </div>
      </div>
      <van-popup v-model:show="showBottom" round position="bottom" :style="{ height: '60%' }">
          <div class="title">
              <span class="s1">已选餐品({{ shopcarlist.length }})</span>
              <p @click="clearshopcar">
                  <img src="../../assets/backimage/lajitong.png" alt="">
                  <span class="s2">清空购物车</span>
              </p>
          </div>
          <ul class="shopcarproduct">
              <li class="li1" v-for="(item,index) in shopcarlist" :key="index" style="">
                  <img :src="item.detail.default_image"  alt="">
                  <div class="shop">
                      <p class="name">{{ item.detail.name }}</p>
                      <p class="specification">{{ item.specifications }}</p>
                      <div>
                          <span class="price" :id="'price'+index">￥{{ item.price}}</span>
                          <van-stepper theme="round" button-size="22" v-model="item.count" disable-input @change="editshopnum(index,$event)" />
                      </div>
                  </div>
              </li>
          </ul>
      </van-popup>
    </div>
  </template>
  
  <script>
  import {getXBKProductList,getXBKVerify} from "@/api/store";
  import {getdbtext} from '@/api/service'
  import router from "@/router";
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
          shopcarlist:[        //购物车内的商品
              
              
          ],
          box:[],
          boxheight:[],
        // 头部滚动条
        titlename:"",
        ziqushijian:"",
        waimaishijian:"",
        starttime:"",
        endtime:"",
        text:"",
        loadingflag:true,
        openStatus:true
      };
    },
    methods: {
      clearshopcar(){
        this.shopcarlist = []
        sessionStorage.removeItem("goods")
      },
        changeHash(idname){
            // console.log(idname);
            document.querySelector(idname).scrollIntoView(true)
        },
        handleScroll(e){
        // console.log(document.querySelector(".rightlist ul").clientHeight);
        // this.panduan=true
        let scrollTop = this.$refs.rightList.scrollTop;
        
        // console.log(this.boxheight);
          for(var i=0;i<this.boxheight.length;i++){
          if(i==0){
           
          }else{
            if(document.querySelectorAll("#li1")){
              if(scrollTop>=this.boxheight[i-1] && scrollTop<=this.boxheight[i]){
                document.querySelectorAll("#li1")[i-1].style.background="#fff"
                document.querySelectorAll("#li1")[i-1].style.color="#0e6941"
                document.querySelectorAll("#li1")[i-1].style.fontWeight="800"
                //   document.querySelectorAll("#li1 img")[i-1].src=this.leftprolist[i-1].imageOn

              }else{
                document.querySelectorAll("#li1")[i-1].style.background="#f0f0f0"
                document.querySelectorAll("#li1")[i-1].style.color="gray"
                document.querySelectorAll("#li1")[i-1].style.fontWeight="400"
                //   document.querySelectorAll("#li1 img")[i-1].src=this.leftprolist[i-1].imageOff
              }
            }
          }
          
        
        }
        if(scrollTop<=this.boxheight[0]){
          // console.log("aaa");
          // console.log(document.querySelectorAll("#li1")[0]);
            document.querySelectorAll("#li1")[0].style.background="#fff"
            document.querySelectorAll("#li1")[0].style.color="#0e6941"
            document.querySelectorAll("#li1")[0].style.fontWeight="800"
            // document.querySelectorAll("#li1 img")[0].src=this.leftprolist[0].imageOn
        }
        
        
        // console.log(scrollTop);
        
      },
      selectname(index){
          this.isactive=index
          for(var i=0;i<this.leftprolist.length;i++){
                  if(this.leftprolist[i].name==event.target.getAttribute("name")){
                      this.products=this.leftprolist[i].products
                  }
              }
              for(var i=0;i<document.querySelectorAll("#li1").length;i++){
                  if(i==this.isactive){
                      document.querySelectorAll("#li1")[i].style.background="#fff"
                      document.querySelectorAll("#li1")[i].style.color="#0e6941"
                      document.querySelectorAll("#li1")[i].style.fontWeight="800"
                  }else{
                      document.querySelectorAll("#li1")[i].style.background="#f0f0f0"
                      document.querySelectorAll("#li1")[i].style.color="gray"
                      document.querySelectorAll("#li1")[i].style.fontWeight="400"
                  }
              }
      },
      orderpopue(){
          this.showBottom=!this.showBottom
      },
      // 点击选好了跳转到支付
      paymentpage(){
        this.getStoreProduct()
        if(!this.openStatus){
          this.$toast("门店未营业")
          return
        }
        var jiaoyan=[]
        var allgoods=[]
        // var s=[
        //     {

        //     }
        // ]
        // console.log(this.shopcarlist);

        for(var i=0;i<this.shopcarlist.length;i++){
            var s=[{
                "num":this.shopcarlist[i].count,
                "goodName":this.shopcarlist[i].detail.name,
                "productId":this.shopcarlist[i].detail.id,
                'skuId':this.shopcarlist[i].cupsize,
                'sale':this.shopcarlist[i].detail.salePrice,
                'goodImg':this.shopcarlist[i].detail.default_image,
                'listname':this.shopcarlist[i].specifications,
                'listtxt':this.shopcarlist[i].specifications,
                'original':this.shopcarlist[i].price,
                'addExtra':this.shopcarlist[i].addExtra,
                'sumprice':this.shopcarlist[i].price*this.shopcarlist[i].count,
                'sumdiscountPrice':this.shopcarlist[i].price*this.shopcarlist[i].count

            }]
            
            jiaoyan.push(s)
          // console.log(s,"s")
            getXBKVerify({
                apikey: this.$store.state.appkey,
                storeId:this.$route.query.storeid,
                goods:s

            }).then(res=>{
                // console.log(res);
                this.loadingflag = false
                if(res.code==200){
                    // console.log(res);
                    allgoods.push(res.data)
                  setTimeout(() => {
                    //  this.$router.push("/orderpay")
                    this.$router.push({path:"/orderpay",query:{num1:this.num1}})

                  }, 1500);
                }else{
                    this.$toast(res.msg)
                   setTimeout(()=>{
                     // this.$router.go(-1)
                   },1000)
                }
                sessionStorage.setItem("allgoods",JSON.stringify(allgoods))
                
                
                //   this.$router.push("/orderpay")
             })
        }
        sessionStorage.setItem("verify",JSON.stringify(jiaoyan))

        
      },
      editshopnum(index,count){
        // console.log(itemid,count);
        // console.log(this.shopcarlist);
        if(count==0){
          this.shopcarlist=this.shopcarlist.filter(function(item){
            return item.count!=0
          })
          this.shopcarlist=this.shopcarlist
          // console.log(this.shopcarlist);
          // console.log(this.shopcarlist);
          // this.shopcarlist=this.shopcarlist.splice(index,1)
          this.$toast({message: "删除商品成功", type: "success"})
        }else{
          for(var i=0;i<this.shopcarlist.length;i++){
            if(index==i){
              this.shopcarlist[i].count=count
            }
          }
        }
        // console.log();
        // this.shopcarlist=
        sessionStorage.setItem("goods",JSON.stringify(this.shopcarlist))
        this.sumprice()
      },
      switchstore(){
          this.$router.go(-1)
      },
      // 跳转到商品详情页面
      godetail(id,storeid){
          // console.log(id);
          // console.log(storeid);
          this.$router.push({path:"/productdetailxbk",query:{num1:this.num1,id:id,storeid:storeid}})
      },
      getStoreProduct() {
        let data = {
          apikey: this.$store.state.appkey,
          storeId:this.$route.query.storeid
        }
        var _document=document
        getXBKProductList(data).then(res => {
          // console.log(res.data);
          this.loadingflag = false
          if(res.code==200){
              this.productlist=res.data
              this.storeid=this.productlist.storeId
              this.openStatus=this.productlist.openStatus
              // 筛选左侧列表数据
              for(var i=0;i<this.productlist.categories.length;i++){
                  this.prolist2.push(this.productlist.categories[i].sub_categories)
              }
              for(var i=0;i<this.prolist2.length;i++){
                  for(var j=0;j<(this.prolist2[i]).length;j++){
                      this.leftprolist.push((this.prolist2[i])[j])
                  }
              }
              for(var i=0;i<this.leftprolist.length;i++){
                    this.alllist.push([this.leftprolist[i].name,i],this.leftprolist[i].products)
                }
            //   this.products=this.leftprolist[0].products
          }
          // console.log(this.leftprolist)
          this.$nextTick(()=>{
              document.querySelectorAll("#li1")[0].style.background="#fff"
              document.querySelectorAll("#li1")[0].style.color="#0e6941"
              document.querySelectorAll("#li1")[0].style.fontWeight="800"
          })
          
          this.starttime=this.productlist.starttime;
            this.endtime=this.productlist.endtime;
            getdbtext({
            type:"xbk"
            }).then(res=>{
            // console.log(res);
            if(res.code==200){
                // console.log(res);
                if(this.flag){
                    this.waimaishijian=res.data.xbkwmts
                    this.text=this.waimaishijian+this.starttime+'至'+this.endtime+'。'
                }else{
                    this.ziqushijian=res.data.xbkdcts
                    this.text=this.ziqushijian+this.starttime+'至'+this.endtime+'。'
                    // console.log(this.productlist,"1111");
                }
               
            }
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
        })
      },
      sumprice(){
        this.sum=0
        for(var i=0;i<this.shopcarlist.length;i++){
          this.sum=this.sum+this.shopcarlist[i].count*this.shopcarlist[i].price
        }
      }
    },
    mounted() {

          // 获取星巴克该门店商品
          this.getStoreProduct()
          
       // 获取左侧列表的DOM元素
       const leftList = this.$refs.leftList;
      const rightList = this.$refs.rightList;
      // 设置左侧列表的高度和样式
      leftList.style.height = 'calc(100vh - 40px - 75px)';
      leftList.style.overflowY = 'auto';
      // 设置左侧列表的高度和样式
      rightList.style.height = 'calc(100vh - 87px)';
      rightList.style.overflowY = 'auto';
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
    },
    watch:{
  
    }
  };
  </script>
<style src="../../css/productlist.css" scoped></style>