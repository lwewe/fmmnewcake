<template>
  <div class="publicindex1">
    <div class="wrap">
        <div class="top" @click="godetail()">
            <div style="flex-wrap: wrap;flex: 1;">
                <img style="width: 50%;float: right;margin-right: 10px;" src="../assets/backimage/7.png" alt="">
            </div>
            <div style="flex: 1.4;">
                <p style="font-size: 19px;font-weight: 800;color: #03694d;">自助点单</p>
                <p style="font-size: 14px;font-weight: 600;">ORDER</p>
                <p style="font-size: 15px;">提前点单 到店自取</p>
            </div>
        </div>
        <div class="bottom" style="display: flex;justify-content: center">
<!--            <div class="left" style="border-right: 2px solid #9bccbf;">-->
<!--                <img style="flex-wrap: wrap;width: 20%;" src="../assets/backimage/8.png" alt="">-->
<!--                <div class="inner" style="">-->
<!--                    <p style="font-size: 19px;color:#03694d;font-weight: 800;margin-bottom: 1px;">我的订单</p>-->
<!--                    <p style="font-size: 14px;font-weight: 600;">INDEX</p>-->
<!--                </div>-->
<!--            </div>-->
            <div class="left right" style="gap: 10px;" @click="toKefu">
                <img style="flex-wrap: wrap;width: 32%;" src="../assets/backimage/9.png" alt="">
                <div class="inner" style="" @click="gozxkf()">
                    <p style="font-size: 19px;color:#03694d;font-weight: 800;margin-bottom: 1px;">在线客服</p>
                    <p style="font-size: 14px;font-weight: 600;">SERVICE</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import {getLogo} from '@/api/service'
export default {
  name: "PublicIndex1",
  data() {
    return {
      num1:0,
      zxkf:""
    };
  },

  mounted() {
    this.num1=this.$route.query.num1
    this.getLoginInfo()
  },

  methods: {
    toKefu(){
      window.location.href = localStorage.getItem("kefu")
    },
    godetail(){
        this.$router.push({path:"/distancestore",query:{num1:this.num1}})
    },
    getLoginInfo() {
      getLogo().then(res => {
        // console.log(res);
        if (res.code == 200) {
        //   console.log(res);
          this.zxkf=res.data.zxkf
        //   console.log(this.zxkf);
        }
      })
    },
    gozxkf(){
        window.location.href=this.zxkf
    }
  },
};
</script>


<style scoped>
*{
    margin: 0;
    padding: 0;
}
.publicindex1{
    margin-left: 15px;
    margin-right: 15px;
}
.wrap{
    border: 1.5px solid rgb(207, 226, 221);
    border-radius: 10px;
    height: 200px;
    box-shadow: 0 0 10px 5px rgb(207, 226, 221);
    margin-bottom: 15px;
    background: #fff;
}
.wrap .top{
    height: 54%;
    border-bottom: 2px solid #9bccbf;
    margin-left: 15px;
    margin-right: 15px;
    /* background: red; */
    display: flex;
    align-items: center;
    justify-content: center;
}
.wrap .top p{
    width: 70%;
    text-align: center;
    margin-bottom: 5px;
}
.wrap .bottom{
    height: 43%;
    /* background: red; */
    display: flex;
}
.wrap .bottom .left{
    display: flex;width: 48%;
    justify-content: center;
    align-items: center;
    margin-top: 3%;
    margin-bottom: 3%;
}
.wrap .bottom .left .inner{
    text-align: center;margin-left: 3%;
}
</style>