<template>
<!--  首页tabbbr-->
  <div>
    <van-tabbar v-model="activeNum"  active-color="#FA6174">
      <van-tabbar-item  to="/index">
        <span>蛋糕</span>
        <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? icon.active : icon.normal"
        >
      </van-tabbar-item>
      <van-tabbar-item to="/shopCart">
        <span>购物车</span>
        <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? mulIcon.active : mulIcon.normal"
        >
      </van-tabbar-item>
      <van-tabbar-item @click="toFreea" v-if="cake==0">
        <span>福利卡</span>
        <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? flkIcon.active : flkIcon.normal"
        >
      </van-tabbar-item>
      <van-tabbar-item to="/mine" v-if="cake==0">
        <span>我的</span>
        <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? mineIcon.active : mineIcon.normal"
        >
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  name: "NavigationTab",
  props:{
    active:[Number,String]
  },
  data(){
    return {
      activeNum:0,
      // 首页
      icon: {
        normal: require('@/assets/icon/syh.png'),
        active: require('@/assets/icon/syx.png')
      },
      mulIcon:{
        normal: require('@/assets/icon/dh.png'),
        active: require('@/assets/icon/dx.png')
      },
      flkIcon:{
        normal: require('@/assets/icon/flkh.png'),
        active: require('@/assets/icon/flkx.png')
      },
      mineIcon:{
        normal: require('@/assets/icon/gh.png'),
        active: require('@/assets/icon/gx.png')
      },
      cake:0
    }
  },
  methods:{
    toFreea() {
      window.location.href = this.$store.state.base + "/securitycards?change=2&token="+localStorage.getItem("token")+"&cityName="+sessionStorage.getItem("cityName")
      // window.location.replace(this.$store.state.base + "/securitycards?change=2&token="+localStorage.getItem("token")+"&cityName="+sessionStorage.getItem("cityName"))
    }
  },
  created() {
    this.activeNum = this.active
    if (sessionStorage.getItem("cake")) {
      this.cake = sessionStorage.getItem("cake")
    }
  }
}
</script>



<style scoped>
.van-tabbar--fixed {
  z-index: 1800 !important;
}
.van-tabbar-item__icon img{
  width: 100%;
  height: 100%;
}
/deep/.van-tabbar-item__icon {
  position: relative;
  font-size: 18%;
  margin-bottom: 5px;
  width: 25px;
}
/deep/.van-tabbar {
  height: auto;
  padding: 4px 0px;
}
</style>