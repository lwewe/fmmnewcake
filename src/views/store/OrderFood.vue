<template>
  <div class="orderfood">
    <!--    <ReturnBack :rcolor="'#fff'" :bcolor="'rgba(218,218,218,0.26)'"></ReturnBack>-->
    <NProgress v-if="loadingflag" />
    <!--    tab切换-->
    <div class="tabListBox">
      <div
        v-for="item in cake == 88 ? tabList.filter(item => item.active == 2) : flag == 0 ? tabList : flag == 2 ? tabList.filter(item => item.active != 3 && item.active != 2) : tabList.filter(item => item.active != 3)" 
        :key="item.active" :style="{ backgroundImage: item.active == active ? 'url(' + item.back + ')' : '' }"
        class="tabItem" @click="changeType(item.active)"
        :class="{ tabItem2: item.active == active, tabItem3: cake ? cake != 2 : false, tabItem4: item.active == active && cake != 1 || types == 1, }"
        v-if="item.isShow">
        <div>{{ item.title }}</div>
        <div class="tabIcon" v-if="item.active == active">
          <img class="img" src="../../assets/zhichong/xuanz.png" alt="">
        </div>
      </div>
    </div>
    <!--    自助点餐-->
    <div class="leftwrap" v-if="active == 3 && flag == 0">
      <!-- 悬浮广告层 -->
      <!-- <div class="ad-overlay" v-if="showAd" @click.self="closeAd">
        <div class="ad-modal">
          <img src="http://yxfmm.bjyxfl.com/imgs/ad2.png" class="ad-image" alt="广告" @click="closeImg()">
          <div class="close-btn" @click="closeAd">
            <img src="http://yxfmm.bjyxfl.com/imgs/cl.png" style="height: 18px; width: 18px;" alt="">
          </div>
        </div>
      </div> -->
      <img src="../../assets/newico/tp.png" alt="" style="width: 100%;">
      <div style="margin-top: 5px;padding: 0 10px;" @click="toNexts()">
        <van-notice-bar :text="gonggao" left-icon="volume-o" />
      </div>
      <div class="pd0">
        <div class="banner1" v-for="(item, index) in imgurlbox" :key="item.id" v-if="item.id !=25"
          @click="goindex(index + 1, index <= 2 || index == 6 ? 1 : 2)">
          <img class="img" :src="item.img" alt="">
        </div>
      </div>
    </div>
    <!--    电子券-->
    <div class="rightwrap" v-if="active == 1">

      <!--      <div v-if="signal==1" style="margin-top: 5px">-->
      <!--        <van-notice-bar-->
      <!--            text="如遇到电子券补充中需联系客服"-->
      <!--            left-icon="volume-o"-->
      <!--        />-->
      <!--      </div>-->
      <ElectronicCoupon></ElectronicCoupon>
    </div>
    <!--    饮品直冲-->
    <!-- <div class="brandList" v-if="active == 2 && flag != 2"> -->

    <div class="brandList" v-if="active == 2 && (flag != 2 || cake == 88)"> 
      <div v-for="item in brandList" :key="item.id" class="brandItem" @click="todetail(item.id)">
        <img class="img" :src="item.img" alt="">
      </div>
    </div>

    
  </div>
</template>

<script>
import { getBannerList, getBannerLists, getIsShowOder } from '@/api/service'
import ElectronicCoupon from "@/components/select/ElectronicCoupon.vue";
import { getBrandDirect } from "@/api/brand";
export default {
  components: { ElectronicCoupon },
  data() {
    return {
      showAd: true, 
      gonggao: '尊敬的悦享聚汇用户，您好，感谢您一直以来的信任与支持。为给您提供更稳定的服务，现有一项重要安排需向您通知。近期，由于麦当劳、瑞幸、库迪、塔斯汀等品牌供应链体系波动导致我平台部分订单履约稳定性受到一定影响。为从根本上解决这一问题，提升整体服务质量，我们决定对以上品牌系统进行一次集中维护与优化。维护时间:2025年3月6日12:00，维护期间，以上点餐品牌订单成功率会受到一定程度影响，维护期间出餐成功率预计，麦当劳(50%)瑞幸(80%)、库迪(80%)、塔斯汀(50%)，具体表现，部分订单可能出现延迟、失败退款等需要人工处理，我们力争在3月15日前完成全部优化工作，数据恢复后我们将第一时间通知。因本次维护给您带来的不便，我们深表歉意，也衷心感谢您的理解与支持。',
      active: 1,
      imgurlbox: [],
      loadingflag: true,
      cake: 0,
      types: 0,
      tabList: [
        {
          title: "电子券",
          active: 1,
          back: require("../../assets/zhichong/yb.png")
        },
        {
          title: "饮品直冲",
          active: 2,
          back: require("../../assets/zhichong/zj.png")
        },
        {
          title: "自助点餐",
          active: 3,
          back: require("../../assets/zhichong/zb.png")
        },
      ],
      pageno: 1,
      brandList: [],
      isScroll: false,
      flag: 0,
      signal: 0
    };
  },
  methods: {
    // 关闭广告
    closeImg() { this.showAd = false; },
    closeAd() {
      this.showAd = false;

    },

    // 点击广告图片
    toNexts() {
      window.location.href = 'http://yxfmm.bjyxfl.com/imgs/ad2.png';
    },
    getIsShowOder() {
      getIsShowOder().then(res => {
        if (res.code == 200) {
          this.flag = res.data.flag
          this.signal = res.data.signal
        }
      })
    },
    todetail(id) {
      this.$router.push({ path: "/directCharge", query: { id } })
    },
    changeType(e) {
      this.active = e
      if (this.active == 2) {
        this.brandList = []
        this.pageno = 1
        this.getBrandDirect()
      } else if (this.active == 3) {
        this.showAd = true
        this.getlistpics()
      }
      this.$router.replace({ path: "/orderfood", query: { active: e } })
    },
    getlistpic() {
      getBannerList({
        flag: '1',
        // type:'mdl'
      }).then(res => {
        this.loadingflag = false
        // console.log(res);
        if (res.code == 200) {
          this.imgurlbox = res.data.list
          // console.log(this.imgurlbox);
        }

      })
    },
    getlistpics() {
      getBannerLists({
        flag: '1',
        // type:'mdl'
      }).then(res => {
        this.loadingflag = false
        console.log(res);
        if (res.code == 200) {
          this.imgurlbox = res.data.list

        }

      })
    },
    goindex(num1, num2) {
      // if(num1==4){
      //   this.$toast("正在建设中...,敬请期待")
      //   return
      // }
      this.$router.push({ path: "/select", query: { num1: num1, num2: num2 } })
    },
    getBrandDirect(pageno = this.pageno) {
      getBrandDirect({
        pageno,
        pagesize: 10
      }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          if (res.data.length == 0) {
            this.isScroll = true
            return
          }
          res.data.forEach(item => {
            this.brandList.push(item)
          })

        }
      })
    },
    //滚动条事件
    handleScroll(e) {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        this.onMost()
      }
    },
    onMost() {
      if (!this.isScroll) {
        this.pageno++
        if (this.active == 2) {
          this.getBrandDirect(this.pageno)
        }
      }
    },

  },
  created() {
    this.getIsShowOder()
    if (sessionStorage.getItem("cake")) {
      this.cake = sessionStorage.getItem("cake")
    }
    if (sessionStorage.getItem("types")) {
      this.types = sessionStorage.getItem("types")
    }
    this.active = this.$route.query.active || 1
    if (this.cake == 2) {
      this.active = 3
    }

    if (this.cake == 88) {
      this.active = 2
    }
    this.tabList.forEach(item => {
      // if (item.active == 1 || item.active == 2) {
      //   item.isShow = this.cake != 2
      // } else {
      //   item.isShow = this.cake != 1 || this.types == 1
      // }
      if (this.cake == 88) {
    item.isShow = item.active == 2
  } else if (item.active == 1 || item.active == 2) {
    item.isShow = this.cake != 2
  } else {
    item.isShow = this.cake != 1 || this.types == 1
  }
    })
  },
  mounted() {
    if (this.active == 2) {
      this.getBrandDirect()
    } else if (this.active == 3) {
      // this.getlistpic();
      this.getlistpics();//岚延
    } else if (this.active == 1) {
      setTimeout(() => {
        this.loadingflag = false
      }, 500)
    }
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, false);
  },
};
</script>

<style scoped lang="less">
// 悬浮广告样式 // yishagn以上控制广告
 
 

// yishagn以上控制广告
.orderfood {
  min-height: 100vh;
  background: #f0f0f0;
  padding-top: 10px;
  box-sizing: border-box;

}

// .leftwrap {
//   padding: 0px 10px 10px;

//   .banner1 {
//     margin-top: 10px;
//   }
// }
.leftwrap {
  width: 100%;

  .pd0 {
    margin-top: 2px;
    padding: 0px 10px 50px 10px;
    display: flex;
    // gap: 7px;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .banner1 {
    width: 49%;
    margin-top: 5px;
  }
}

.tabListBox {
  background-image: url("../../assets/zhichong/jbback.png");
  background-size: 100% 100%;
  width: 100%;
  height: 44px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  .tabItem {
    width: 33.3%;
    width: 50%;
    text-align: center;
    background-size: 100% 100%;
    font-size: 14px;
    color: #646166;
    height: 54px;
    line-height: 64px;
  }

  .tabItem2 {
    line-height: 54px;
    font-size: 15px;
    font-weight: bold;
    color: #343434;
  }

  .tabItem3 {
    width: 50%;
  }

  //.tabItem4{
  //  margin: 0 auto;
  //}
  .tabIcon {
    width: 16px;
    margin: auto;
    margin-top: -13px;
  }
}

.brandList {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  gap: 10px 2px;
  justify-content: space-between;

  .brandItem {
    width: calc(50% - 2px);
  }
}
</style>
