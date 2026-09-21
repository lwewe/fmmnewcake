<template>
  <div class="packAge">
    <div :class="{allPage:num2==2,allPage6:num1==6}">
      <div class="topPage" :class="{topPage2:num2==2,topBorder:num2==2&&num1!=6,topBorder6:num1==6,topPage7:num1==7}">
        <div class="leftBox" @click="godetail">
          <div class="topRight">
            <div class="icon">
              <img v-if="num2==1" class="img" src="../assets/backimage/3.png" alt="">
              <img v-if="num2==2&&num1!=6" class="img" src="../assets/backimage/7.png" alt="">
              <img v-if="num1==6" class="img" src="../assets/backimage/rx.png" alt="">
            </div>
            <div>
              <div class="selfOrder" :class="{selfOrder2:num2==2,selfOrder6:num1==6}">自助点单</div>
              <div class="order">ORDER</div>
            </div>
          </div>
          <div class="tips">提前点单 到店自取</div>
        </div>
        <div class="line" v-if="num2==1&&num1!=7"></div>
        <div class="leftBox" @click="goaddress" v-if="num2==1&&num1!=7">
          <div class="topRight">
            <div class="icon2">
              <img class="img" src="../assets/backimage/4.png" alt="">
            </div>
            <div>
              <div class="selfOrder">外卖下单</div>
              <div class="order">ORDER</div>
            </div>
          </div>
          <div class="tips">在线点单 外送到家</div>
        </div>
      </div>
      <div class="topPage bottomPage" @click="toKefu" :class="{topPage2:num2==2}">
        <div class="leftBox">
          <div class="topRight">
            <div class="icon3">
              <img v-if="num2==1" class="img" src="../assets/backimage/6.png" alt="">
              <img v-if="num2==2&&num1!=6" class="img" src="../assets/backimage/9.png" alt="">
              <img v-if="num1==6" class="img" src="../assets/backimage/rxkf.png" alt="">
            </div>
            <div>
              <div class="selfOrder" :class="{selfOrder2:num2==2,selfOrder6:num1==6}">在线客服</div>
              <div class="order">SERVICE</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getLogo} from '@/api/service'

export default {
  name: "PublicIndex",
  props: {
    // info:[String,Number],
    num2: [String, Number]
  },
  data() {
    return {
      num1: 0,
      zxkf: ""
    };
  },

  mounted() {
    // console.log();
    this.num1 = this.$route.query.num1
    this.getLoginInfo()
  },

  methods: {
    toKefu() {
      window.location.href = localStorage.getItem("kefu")
    },
    toOrderList() {
      this.$router.push({path: "/order", query: {num1: this.num1,num2:this.num2}})
    },
    godetail() {
      this.$router.push({path: "/distancestore", query: {num1: this.num1,num2:this.num2}})
    },
    goaddress() {
      this.$router.push({path: '/address', query: {'num1': this.num1,num2:this.num2}})
    },
    getMDLProduct() {
      // let data = {
      //       apikey: this.$store.state.appkey,
      //       receiverLat:this.$route.query.storeid
      //       receiverLng:
      //     }
      // getMDLProductList(data).then(res=>{
      //     console.log(res);
      // })
    },
    getLoginInfo() {
      getLogo().then(res => {
        // console.log(res);
        if (res.code == 200) {
          //   console.log(res);
          this.zxkf = res.data.zxkf
          //   console.log(this.zxkf);
        }
      })
    },
    gozxkf() {
      location.href = this.zxkf
    }
  },
};
</script>
<style scoped lang="less">
.packAge {
  padding: 13px 15px;
}

.allPage {
  border: 1px solid #ABCDC3;
  box-shadow: 0px 0px 8px 1px #E0E7E5;
  border-radius: 15px;
  background-color: white;
  padding: 0px 20px;
}
.allPage6{
  border: 1px solid #13227A;
  box-shadow: 0px 0px 8px 1px #13227A17;
}

.topPage {
  padding: 18px 15px;
  border: 1px solid #E1C3AF;
  box-shadow: 0px 0px 8px 1px #E8DED8;
  border-radius: 10px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.topPage2{
  justify-content: center;
  border: none;
  box-shadow: initial;
  border-radius: 0px;
  background-color: transparent;
}
.topPage6{
  justify-content: center;
  border: none;
  box-shadow: initial;
  border-radius: 0px;
  background-color: transparent;
}
.topPage7{
  justify-content: center;
}
.topBorder{
  border-bottom: 1px solid #D8E8E3;
}
.topBorder6{
  border-bottom: 1px solid #13227A;
}
.leftBox {
  width: 50%;

  .topRight {
    display: flex;
    align-items: center;
    gap: 5px;

    .icon {
      width: 55px;
    }

    .icon2 {
      width: 60px;
    }

    .icon3 {
      width: 44px;
    }

    .selfOrder {
      color: #A84310;
      font-weight: 600;
      font-size: 20px;
      letter-spacing: 1px;
      white-space: nowrap;
    }

    .selfOrder2 {
      color: #0A6B4F;
    }

    .selfOrder6 {
      color: #13227A;
    }

    .order {
      font-size: 12px;
      text-align: center;
      margin-top: 5px;
    }
  }

  .tips {
    font-size: 12px;
    color: #6B6B6B;
    text-align: center;
    margin-top: 10px;
  }
}

.line {
  border-left: 1px solid #F0E0D4;
  height: 78px;
  width: 1px;
}

.bottomPage {
  margin-top: 11px;
  justify-content: center;
}
</style>