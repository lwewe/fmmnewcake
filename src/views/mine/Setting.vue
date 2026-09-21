<template>
  <div class="conPage">
    <div class="setting">
      <div class="settingBox">
        <div class="leftBox">
          <div class="iconImg">
            <img class="img" src="../../assets/mine/wm.png" alt="">
          </div>
          <div>联系我们</div>
        </div>
        <div class="leftBox rightBox" @click="toKefu">
          <div>{{settingInfo.gzsj}}</div>
          <div class="arrow">
            <van-icon name="arrow"/>
          </div>
        </div>
      </div>
      <div class="settingBox">
        <div class="leftBox">
          <div class="iconImg">
            <img class="img" src="../../assets/mine/yj.png" alt="">
          </div>
          <div>意见反馈</div>
        </div>
        <div class="leftBox rightBox">
          <div>{{settingInfo.email}}</div>
        </div>
      </div>
      <div class="settingBox" style="border: none">
        <div class="leftBox">
          <div class="iconImg">
            <img class="img" src="../../assets/mine/bb.png" alt="">
          </div>
          <div>版本</div>
        </div>
        <div class="leftBox rightBox">
          <div>v1.0.0</div>
        </div>
      </div>
    </div>

    <div class="addNewAddress" @click="messageinfo">
      <div class="btn">退出登录</div>
    </div>
  </div>
</template>
<script>
import {getSetting} from "@/api/mine";

export default {
  name: "Setting",
  data(){
    return{
      settingInfo:{},
      kefu:""
    }
  },
  methods:{
    messageinfo() {
      this.$dialog.confirm({
        title: '退出',
        message: '是否退出登录？',
        confirmButtonColor: 'red'
      }).then(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("uid")
        this.$store.commit("settoken", "")
        this.$toast("退出登录成功")
        setTimeout(()=>{
          this.$router.replace({path: "/index"})
        },1000)
      }).catch(() => {
      })
    },
    getSettingInfo(){
      getSetting().then(res=>{
        if(res.code == 200){
          this.settingInfo = res.data
        }
      })
    },
    toKefu(){
      window.location.href =  this.kefu
    }
  },
  created() {
    this.getSettingInfo()
    this.kefu = localStorage.getItem("kefu")
  }
}
</script>

<style scoped lang="less">
.conPage {
  background-color: #F0F0F0;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 10px;
}

.setting {
  background-color: white;
  padding: 0px 10px;
  border-radius: 5px;
.settingBox{
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #F7F7F7;
  padding: 9px 0px 10px;
}
  .leftBox {
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: bold;
    font-size: 15px;
    color: #4B4B4B;
  }
.rightBox{
  font-weight: 500;
  font-size: 13px;
  color: #8d8d8d;
}
  .iconImg {
    width: 24px;
  }
  .arrow{
    padding-top: 5px;
  }
}

.addNewAddress {
  width: 100%;
  box-sizing: border-box;
  margin-top: 45px;

  .btn {
    background-image: linear-gradient(to right, #F28F8E, #DC4F4E);
    color: white;
    border-radius: 30px;
    text-align: center;
    height: 39px;
    line-height: 39px;
    font-size: 14px;
  }
}
</style>