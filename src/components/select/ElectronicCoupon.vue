<template>
  <div class="conPage">
    <div class="conItem" v-for="item in couPonList" :key="item.id" @click="toDetail(item)">
      <div class="leftRound"></div>
      <div class="leftRound rightRound"></div>
      <div class="leftBox">
        <div class="leftbackImg">
          <div class="backImg">
            <img class="img" src="../../assets/dangao/quan.png" alt="">
          </div>
        </div>
        <div>
          <div class="couponName">{{ item.title }}</div>
          <div class="exchange">点击兑换</div>
        </div>
      </div>
      <div class="rightBox" :style="'background-color: '+item.yanse">
        <div class="imgBox">
          <img class="img" :src="item.img" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {getCouPonList} from "@/api/coupon";

export default {
  name: "ElectronicCoupon",
  data() {
    return {
      pageno: 1,
      couPonList: [],
      isScroll: false
    }
  },
  methods: {
    toDetail(item) {
      this.$router.push({path: "/brandCouPon", query: {id: item.id}})
    },
    getCouPon() {
      getCouPonList({
        pageno: this.pageno,
        pagesize: 20
      }).then(res => {
        if (res.code == 200) {
          if (res.data.brand_list.length == 0) {
            this.isScroll = true
            return
          }
          res.data.brand_list.forEach(item => {
            this.couPonList.push(item)
          })
        }
      })
    },
    //滚动条事件
    handleScroll(e) {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      // console.log(Math.ceil(scrollTop + clientHeight), scrollHeight)
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        this.onMost()
      }
    },
    onMost() {
      // console.log(this.isScroll)
      if (!this.isScroll) {
        this.pageno++
        // console.log(this.active,this.pageno)
        this.getCouPon()
      }
    }
  },
  created() {
    this.getCouPon()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, false);
  },
}
</script>

<style scoped lang="less">
.conPage {
  padding: 0px 15px 15px;
}

.conItem {
  display: flex;
  align-items: center;
  height: 80px;
  position: relative;
  margin-top: 10px;
}

.leftbackImg {
  display: flex;
  align-items: flex-end;
  height: 100%;
}

.leftBox {
  height: 100%;
  background-color: white;
  width: 70%;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 15px;

  .backImg {
    width: 74px;
  }
}

.rightBox {
  height: 100%;
  width: 30%;
  background-color: #ADE8CD;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .imgBox {
    width: 50px;
  }
}

.couponName {
  font-size: 14px;
}

.exchange {
  color: white;
  background-image: linear-gradient(to right, #F57271, #DD0F0E);
  text-align: center;
  border-radius: 30px;
  font-size: 12px;
  display: inline-block;
  padding: 3px 3px;
  width: 65px;
  margin-top: 8px;
}

.leftRound {
  background-color: #F0F0F0;
  width: 14px;
  height: 14px;
  position: absolute;
  left: -7px;
  top: calc(50% - 7px);
  border-radius: 50%;
}

.rightRound {
  right: -7px;
  left: initial;
}
</style>