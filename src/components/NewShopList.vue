<template>
  <div class="container">
    <div class="left">
      <!--      朱商品轮播-->
      <div class="bannerBox" ref="bannerBox" v-if="active == 0">
        <van-swipe :autoplay="3000" indicator-color="white">
          <van-swipe-item class="bannerImg" v-for="item in shopSwiper" :key="item.img" @click="toDetail(item.id)">
            <img class="img" :src="item.img" alt="">
          </van-swipe-item>
        </van-swipe>
      </div>
      <!--      -->
      <div :class="{ bottomShop: active == 0 }">
        <div v-for="(item, index) in leftList" :key="index" id="leftList">
          <ShopList :flag="flag" :listItem="item"></ShopList>
        </div>
      </div>
    </div>
    <!--    @ShopList="rightList"-->
    <div class="left">
      <div v-for="(item, index) in rightList" :key="index" id="rightList">
        <ShopList :flag="flag" :listItem="item"></ShopList>
      </div>
    </div>
  </div>
</template>
<script>
import ShopList from "@/components/ShopList.vue";

export default {
  name: "NewShopList",
  components: { ShopList },
  props: {
    shopList: [Array, Object],
    shopSwiper: [Array, Object],
    swiperHeight: [Number, String],
    active: [Number, String],
    flag: [Number, String],
  },
  data() {
    return {
      prouctList: this.shopList,
      leftList: [],
      rightList: [],
      leftHeight: 0,
      rightHeight: 0,
      isShow: false,
    }
  },
  methods: {
    toDetail(id) {
      this.$router.push({ path: "/activityZone", query: { id } })
    },
    getHeight() {
      this.prouctList.forEach((item, index) => {
        // if (index > 1) {
        // console.log(this.leftHeight <= this.rightHeight)
        if (this.leftList.length <= this.rightList.length) {
          this.leftList.push(item)
          // this.leftHeight += document.querySelector("#leftList").offsetHeight
          // document.querySelector("#leftList").offsetHeight
        } else {
          this.rightList.push(item)
          // this.rightHeight += document.querySelector("#rightList").offsetHeight
          // document.querySelector("#rightList").offsetHeight
        }
        // }
      })
      // console.log(this.leftList,"leftList")
      // console.log(this.rightList,"rightList")
    }
  },
  created() {
    // this.leftList.push(this.prouctList[0])
    // this.rightList.push(this.prouctList[1])
    // console.log(this.shopList)
  },
  mounted() {
    setTimeout(() => {
      // if (document.querySelector("#leftList")||document.querySelector("#rightList")) {
      //   this.leftHeight = document.querySelector("#leftList").offsetHeight
      //   this.rightHeight = document.querySelector("#rightList").offsetHeight
      this.getHeight()
      //   }
    }, 200)
  },
  watch: {
    shopList(item1, item2) {
      // item1为新值，item2为旧值
      this.leftList = []
      this.rightList = []
      this.prouctList = item1
      // console.log( this.prouctList,"22222222222222222222222222")
      this.getHeight()
    },
    prouctList(val) {
      // console.log(this.shopList,"this.shopList")
      if (this.shopList !== val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>


<style scoped lang="less">
.container {
  display: flex;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
}

.left {
  width: 49%;
  box-sizing: border-box;
}

.bannerBox {
  margin-top: 10px;
}

.bottomShop {
  margin-top: -5px;
}

.van-swipe {
  border-radius: 10px;
}
</style>