<template>
  <div class="location">
    <NProgress v-if="loadingflag"/>
    <div class="tab">
      <van-tabs @click="changeType" v-model="active" title-active-color="#ED2E34" color="#F05B60"
                title-inactive-color="#B0B0B0"
                :line-width="15" :line-height="2">
        <van-tab title="全部"></van-tab>
        <van-tab title="待使用"></van-tab>
        <van-tab title="已完成"></van-tab>
        <van-tab title="已取消"></van-tab>
      </van-tabs>
    </div>
    <div v-if="orderList.length>0">
      <OrderList @input="input" :orderList="orderList"></OrderList>
      <loading style="padding: 2px 0px 10px" v-if="isLoading"></loading>
      <div class="none" v-if="isScroll">--没有更多数据了--</div>
    </div>
    <div class="noneBox" v-else>
      <div class="noneBack">
        <img class="img" src="../../assets/tubiao/none.png" alt="">
      </div>
      <div class="noneText">您还没有订单呢~</div>
    </div>
  </div>
</template>
<script>
import OrderList from "@/components/OrderList.vue";
import {getCakeOrderList} from "@/api/mine";

export default {
  name: "OrderInfo",
  components: {OrderList},
  data() {
    return {
      active: 0,
      pageno: 1,
      orderList: [],
      type: "",
      isScroll: false,
      isShow: true,
      loadingflag: true,
      isLoading:false
    }
  },
  methods: {
    input(e){
      this.orderLis = e
    },
    changeType(e) {
      this.orderList = []
      this.pageno = 1
      this.isScroll = false
      this.$router.replace({path: "/order", query: {tabIndex: e + 1}})
      this.getOder(e + 1)
    },
    getOder(type, pageno = this.pageno) {
      this.isLoading = true
      getCakeOrderList({
        type,
        pageno,
        pagesize: 10
      }).then(res => {
        // console.log(res)
        this.loadingflag = false
        this.isLoading = false
        if (res.data.list.length == 0) {
          this.isScroll = true
        }
        if (res.code == 200) {
          if (res.data.list.length > 0) {
            res.data.list.forEach(item => {
              this.orderList.push(item)
            })
          }
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
        this.getOder(this.type, this.pageno)
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    document.body.scrollTop = 0

// firefox

    document.documentElement.scrollTop = 0

// safari

    window.pageYOffset = 0
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, false);
  },
  created() {
    this.type = this.$route.query.tabIndex
    this.active = this.$route.query.tabIndex - 1
    this.getOder(this.type)
  }
}

</script>
<style scoped>
.location {
  background-color: #F0F0F0;
  min-height: 100vh;
  box-sizing: border-box;
}

.none {
  text-align: center;
  font-size: 13px;
  color: #B1B1B1;
  margin-top: 50px;
  padding-bottom: 10px;
}

.noneBack {
  width: 218px;
  margin: auto;
}

.noneText {
  text-align: center;
  font-size: 12px;
  color: #B5B4B4;
  margin-top: -20px;
}

.noneBox {
  margin-top: 52px;
}
</style>