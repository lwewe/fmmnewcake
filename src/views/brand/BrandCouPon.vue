<template>
  <div class="conPage">
    <ReturnBack :rcolor="'#34495B'" :bcolor="'rgb(255 255 255 / 41%)'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <div class="imgBox">
      <img class="img" :src="banner.img" alt="">
    </div>
    <!--    品牌详情-->
    <div class="topBox">
      <div class="brandBoxItem">
        <div class="brandBox">
          <div class="brandImg">
            <img class="img"
                 style="height: auto;"
                 :src="detail.img"
                 alt="">
          </div>
          <div style="padding-bottom: 3px">{{detail.title}}</div>
        </div>
        <div class="textBox">
          <div class="textMax" :class="{textMax2:isPackUp}" v-html="detail.introduce"></div>
          <div class="brandDetails" @click="isPackUp=!isPackUp">
            <div>{{ !isPackUp ? '品牌详情' : '收起' }}</div>
            <div>
              <van-icon v-if="!isPackUp" name="arrow-down"/>
              <van-icon v-else name="arrow-up"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--    券列表-->
    <div class="listBox">
      <div class="listItem" v-for="item in couponsList" :key="item.id" @click="toCouPonDetail(item.id)">
        <!--        梯形-->
        <div class="trapezoidBox" :style="'background-color: '+bgColor">
          <div class="ImgBox" >
            <img class="img"  :src="detail.img" alt="">
          </div>
          <div class="trapezoid" :style="'background-color: '+bgColor"></div>
        </div>
        <!--        正方形-->
        <div class="square" :style="'background-color: '+bgColor">
          <div class="map"></div>
        </div>

        <div class="xlistItem">
          <div class="leftBox">
            <div class="xTitle">{{detail.title}}</div>
            <div class="againstBox">
              <div class="againstText">兑</div>
              <div class="lineText">{{item.title}}</div>
            </div>
            <div class="againstBox vectorBox">
              <div class="vector">
                <img class="img" src="../../assets/dangao/Vector.png" alt="">
              </div>
              <div>{{item.price}}</div>
            </div>
          </div>
          <div class="centerBox">
            <div class="leftRound"></div>
            <div class="leftRound rightRound"></div>
          </div>
          <div class="ImmediateBox">
            <div class="Immediate">立即兑换</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getCouPonDetail} from "@/api/coupon";

export default {
  name: "BrandCouPon",
  data() {
    return {
      isPackUp: false,
      detail:{},
      banner:{},
      couponsList:[],
      bgColor:"",
      loadingflag:true
    }
  },
  methods:{
    toCouPonDetail(id){
   this.$router.push({path:"/couPonDetail",query:{id}})
    },
    getCouPonDetail(brand_id){
      getCouPonDetail({
        brand_id
      }).then(res=>{
        this.loadingflag = false
        if(res.code == 200){
          this.banner = res.data.banner
          this.detail = res.data.brand_show
          this.couponsList = res.data.coupons
          this.bgColor = this.detail.yanse
        }
      })
    }
  },
  created() {
    this.getCouPonDetail(this.$route.query.id)
  }
}
</script>

<style scoped lang="less">
.conPage {
  min-height: 100vh;
  background-color: #F0F0F0;
}

.imgBox {
  width: 100%;
}

.brandBoxItem {
  background-color: white;
  border-radius: 10px;
  padding: 32px 0px 0px;
}

.topBox {
  width: 100%;
  background-size: 100% 100%;
  box-sizing: border-box;
  padding: 0px 10px;
  position: relative;
  margin-top: -38px;
}

.brandImg {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #F3F3F3;
  background-color: white;
  padding: 2px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.brandBox {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  font-size: 15px;
  padding: 0px 28px;
  //font-weight: bold;
  position: absolute;
  top: -18px;
}

.textBox {
  padding: 10px;
  font-size: 13px;
  line-height: 20px;
  position: relative;
  margin-top: 0px;
  color: #3d3d3d;

  .textMax {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2; /* 显示两行 */
  }
}

.brandDetails {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #D87675;
  justify-content: flex-end;
}

.textMax2 {
  display: block !important;
}

.trapezoid {
  width: 100%; /* 梯形的宽度 */
  height: 100%; /* 梯形的高度 */
  background: #BBD3EF; /* 梯形的背景颜色 */
  border-radius: 5px; /* 圆角的半径 */
  box-shadow: 8px 0px 12px -4px #00000038; /* 阴影的大小和颜色 */
  transform: rotate(0deg) skew(20deg) scale(1, 1); /* 梯形的变换，可以调整角度和比例 */
  position: absolute;
  left: 20px;
  top: 0px;
}

.trapezoidBox {
  background: #BBD3EF; /* 梯形的背景颜色 */
  width: 55px; /* 梯形的宽度 */
  height: 92px; /* 梯形的高度 */
  border-radius: 5px; /* 圆角的半径 */
  position: absolute;
  top: 0px;
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;

  .ImgBox {
    width: 50px;
    position: absolute;
    z-index: 8;
    left: 12px;
  }
}

.listItem {
  position: relative;
  height: 82px;
  margin-top: 20px;
}

.listBox {
  padding: 0px 20px 10px;
  margin-top: -8px;
}

.square {
  background: #BBD3EF; /* 梯形的背景颜色 */
  width: 97px; /* 梯形的宽度 */
  height: 92px; /* 梯形的高度 */
  border-radius: 5px; /* 圆角的半径 */
  position: absolute;
  top: 0px;
  left: 0;
  z-index: 4;
  overflow: hidden;
  border-bottom-left-radius: 8px;
  border-top-left-radius: 8px;
}

.xlistItem {
  background-color: #fff;
  margin-top: 10px;
  border-radius: 5px;
  width: 100%;
  height: 100%;
  position: absolute;
  top: -5px;
  left: 0;
  z-index: 4;
  padding-left: 98px;
  padding-right: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  font-size: 12px;

  .xTitle {
    font-size: 14px;
    font-weight: bold;
  }

  .againstBox {
    margin-top: 5px;
    display: flex;
    align-items: center;
    gap: 5px;

    .againstText {
      font-size: 10px;
      background-color: #EA9036;
      color: white;
      padding: 0px 2px 1px;
    }
  }

  .vectorBox {
    margin-top: 5px;
    margin-left: 23px;

    .vector {
      width: 9px;
    }
  }
.centerBox{
  border-left: 1px dashed #E6E6E6;
  height: 68%;
  position: relative;
}
  .leftBox{
    width: 60%;
  }
  .ImmediateBox {
    width:30%;
    .Immediate {
      background-image: linear-gradient(to right, #F46E6D, #DC0A09);
      color: white;
      border-radius: 30px;
      width: 72px;
      height: 28px;
      text-align: center;
      line-height: 28px;
      margin: auto;
    }
  }
  .leftRound{
    background-color: #F0F0F0;
    width: 14px;
    height: 14px;
    position: absolute;
    left: -7px;
    top: calc(-7px - 25%);
    border-radius: 50%;
  }
  .rightRound{
    right: -7px;
    left: initial;
    top: initial;
    bottom:calc(-7px - 25%);
  }
}

.map {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to right, #0000008a, #ffffff1a);
}
.lineText{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2; /* 显示两行 */
}
</style>