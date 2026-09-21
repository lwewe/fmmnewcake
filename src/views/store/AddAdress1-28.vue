<template>
  <div class="conPage">
    <div class="addressBox">
      <div class="consignee">
        <div class="consigneeText">收货人</div>
        <div class="inpBox">
          <input class="inp" v-model="name" type="text" placeholder="请输入收货人姓名">
        </div>
      </div>
      <div class="consignee sex">
        <div class="consigneeText ">性别</div>
        <div class="inpBox">
          <button :class="{ sexoption2: item.id == sex1 }" @click="sex(item.id)" v-for="item in sexList" :key="item.id">
            {{ item.text }}
          </button>
        </div>
      </div>
      <div class="consignee consignee2">
        <div class="consigneeText">电话</div>
        <div class="inpBox" style="position: relative;">
          <span style="position: absolute;font-size: 11px;color: red;bottom: -15px;" v-if="telflag">请输入正确的手机号码</span>
          <input class="inp" v-model="tel" type="number" placeholder="请输入收货人手机号码">
        </div>
      </div>
      <div class="consignee2" style=" border-bottom: 1px solid #dedede;">
        <div class="consignee" style="border-bottom: none">
          <div class="consigneeText">地址</div>
          <div class="inpBox selectAddress" @click="golocation()"
            style="height: 50px;display: flex;align-items: center;">
            <span style="color: #d54342;font-size: 16px;font-weight: bold;"
              v-if="!$store.state.address">请点击进入选择地址</span>
            <span v-else>{{ $store.state.address }}</span>
          </div>
          <div>
            <van-icon name="arrow" />
          </div>
        </div>
        <div style="font-size: 16px;color: #E36261;font-weight: bold;">注:选择地址必须精确到小区或写字楼</div>
      </div>
      <div class="consignee consignee2" style="border-bottom: none">
        <div class="consigneeText">门牌号</div>
        <div class="inpBox">
          <input class="inp" v-model="door" type="text" placeholder="例如:3号楼1单元1201">
        </div>
      </div>
    </div>
    <!--    保存地址-->
    <div class="addNewAddress">
      <div class="btn" @click="saveaddress()">{{ btntext }}</div>
    </div>

    <!--    当前定位的弹窗-->
    <div class="popupBox2">
      <van-popup v-model="showAddress" position="top">
        <div class="popup">
          <div class="brandBox" style="margin: 0;">
            <div>{{ address }}</div>
          </div>
          <div class="retractBox">
            <div class="retract" @click="cancellation">取消</div>
            <div class="retract retract2" @click="filling">填入</div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import { getAddressAdd, getAddressEdit, showdcaddress } from '@/api/service'
import { getAddressAdds, getAddressEdits } from "@/api/address";

export default {
  name: "AddAdress",
  data() {
    return {
      checked: false,
      labelText: "",
      labelColor: "",
      labelColor2: "",
      labelList: [
        {
          id: 1,
          text: "家",
          checked: false
        }, {
          id: 2,
          text: "公司",
          checked: false
        }, {
          id: 3,
          text: "学校",
          checked: false
        },
      ],
      sexList: [
        {
          id: 0,
          text: "先生",
        }, {
          id: 1,
          text: "女士",
        },
      ],
      selectId: 0,
      isAdd: false,
      isExit: false,
      Color: "",
      isChange: false,
      showAddress: false,
      address: "休门街（北国商城地铁站C2西南口步行360米)蓝拓商务中心",
      detailAddress: "",
      isCancel: false,
      btntext: "保存地址",

      telflag: false,
      name: "", //收货人姓名
      tel: "",
      door: "",  //门牌号
      sex1: null,
      // 修改地址
      changelist: [],
      address_id: "",
      uid: "",
      addId: "",
      num1: ""
    }
  },
  watch: {
    tel() {
      // console.log("aaa");
      var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if ((!reg_tel.test(this.tel))) {
        this.telflag = true
      } else {
        this.telflag = false
      }
    }
  },
  destroyed() {
    sessionStorage.removeItem("editaddress")
    sessionStorage.removeItem("num")
  },
  beforeDestroy() {
    // sessionStorage.removeItem("cityName")
    // sessionStorage.removeItem("targetId")
  },
  methods: {
    saveaddress() {
      // 添加地址
      // if(this.num1==3){
      this.BskAddressAdd()
      // return
      // }
      // this.AddressAdd()
    },
    sex(id) {
      this.sex1 = id
    },

    AddressAdd() {
      let data = {
        contact: this.name,
        gender: this.sex1,
        phone: this.tel,
        addr: this.$store.state.address,
        number: this.door,
        lat: this.$store.state.lat,
        lon: this.$store.state.lng,
      }
      console.log(data)
      // return
      if (this.addId) {
        getAddressEdit({ ...data, id: this.addId }).then(res => {
          this.$toast(res.msg || res.data)
          if (res.code == 200) {
            // console.log(res);
            this.$router.go(-1)
            sessionStorage.removeItem("addressData")
          }
        })
      } else {
        getAddressAdd(data).then(res => {
          this.$toast(res.msg || res.data)
          if (res.code == 200) {
            // console.log(res);
            this.$router.go(-1)
            sessionStorage.removeItem("addressData")
          }
        })
      }
    },
    BskAddressAdd() {
      if (this.name == "") {
        this.$toast("请输入收货人")
        return;
      }
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(this.tel)) {
        this.$toast("请正确输入手机号")
        return
      }

      if (this.$store.state.address == "") {
        this.$toast("请选择地址")
        return;
      }
      if (this.door == "") {
        this.$toast("请输入门牌号")
        return;
      }
      let data = {
        apikey: this.$store.state.appkey,
        uid: this.uid,
        area: this.$store.state.address,
        address: this.$store.state.address,
        detail: this.door,
        sex: this.sex1 + 1,
        mobile: this.tel,
        receiver: this.name,
        lng: this.$store.state.lng,
        lat: this.$store.state.lat,
      }
      // console.log(data)
      // return
      if (this.addId) {
        getAddressEdits({ ...data, address_id: this.addId }).then(res => {
          this.$toast(res.msg || res.data)
          if (res.code == 200) {
            // console.log(res);
            this.$router.go(-1)
            sessionStorage.removeItem("addressData")
          }
        })
      } else {
        getAddressAdds(data).then(res => {
          this.$toast(res.msg || res.data)
          if (res.code == 200) {
            // console.log(res);
            this.$router.go(-1)
            sessionStorage.removeItem("addressData")
          }
        })
      }
    },
    golocation() {
      let data = {
        name: this.name,
        tel: this.tel,
        door: this.door,
        sex1: this.sex1
      }
      sessionStorage.setItem("addressData", JSON.stringify(data))
      // sessionStorage.removeItem("cityName")
      this.$router.push("/locationcity")
    },
    changeLabel() {
      if (this.labelText != "") {
        this.labelColor = "#DF5756"
      } else {
        this.labelColor = "#EAEAEA"
      }
    },
    changeSelect(id) {
      this.isChange = false
      if (!this.isChange && this.isExit) {
        this.labelColor = "#2D2D2D"
        this.labelColor2 = "#F6F6F6"
        this.Color = "#000000"
      }
      // if (this.selectId == 0) {
      this.selectId = id
      // } else {
      //   this.selectId = 0
      // }
      this.labelList.filter((item) => {
        if (item.id != id) {
          item.checked = false
          // 通过checked的值改变按钮颜色
        }
      })
      this.labelList.filter((item) => {
        if (item.id === id) {
          item.checked = !item.checked
          // 通过checked的值改变按钮颜色
        }
      })
    },
    changeAdd() {
      this.isAdd = true
      this.selectId = 0
    },
    comfire() {
      this.selectId = 0
      if (this.labelText == "") {
        return
      }
      this.isExit = true
      this.isChange = true
      if (this.isChange) {
        this.labelColor = "#3392FE"
        this.labelColor2 = "#3392FE"
        this.Color = "#fff"
      } else {
        this.labelColor = "#2D2D2D"
      }

    },
    changeWrite() {
      this.isChange = !this.isChange
      if (this.isChange) {
        this.labelColor = "#3392FE"
        this.labelColor2 = "#3392FE"
        this.Color = "#fff"
        this.selectId = 0
      } else {
        this.labelColor = "#2D2D2D"
        this.labelColor2 = "#F6F6F6"
        this.Color = "#000000"
      }
    },
    exit() {
      this.selectId = 0
      this.isExit = false
      this.labelColor = "#DF5756"
    },
    getLocation() {
      if (this.detailAddress || this.isCancel) {
        return
      }
      this.showAddress = true
    },
    cancellation() {
      this.showAddress = false
      this.isCancel = true
    },
    filling() {
      this.detailAddress = this.address
      this.isCancel = true
      this.showAddress = false
    },
    showdcaddress() {
      showdcaddress({
        id: this.addId
      }).then(res => {
        if (res.code == 200) {
          let addressData = res.data.address
          this.name = addressData.contact
          this.sex1 = addressData.gender
          this.tel = addressData.phone
          this.door = addressData.number
          this.$store.commit("changeAddress", addressData.addr)
          this.$store.commit("changelng", addressData.lon)
          this.$store.commit("changelat", addressData.lat)
        }
      })
    }
  },
  // created() {
  //   this.addId = this.$route.query.id || ""
  //   this.num1 = this.$route.query.num1 || ""
  //   this.uid = localStorage.getItem("uid");
  //   if (sessionStorage.getItem("addressData")) {
  //     let addressData = JSON.parse(sessionStorage.getItem("addressData"))
  //     this.name = addressData.name
  //     this.sex1 = addressData.sex1
  //     this.tel = addressData.tel
  //     this.door = addressData.door
  //   }else {
  //     if(this.addId){
  //       let addr = this.$route.query.addr
  //       if(addr){
  //         let addressData = JSON.parse(this.$route.query.addr)
  //         this.name = addressData.contact
  //         this.sex1 = addressData.gender-1
  //         this.tel = addressData.phone
  //         this.door = addressData.number
  //         this.$store.commit("changeAddress", addressData.addr)
  //         this.$store.commit("changelng", addressData.lon)
  //         this.$store.commit("changelat", addressData.lat)
  //       }
  //       // else {
  //       //   this.showdcaddress()
  //       // }
  //     }
  //   }
  // },
  created() {
    this.addId = this.$route.query.id || ""
    this.num1 = this.$route.query.num1 || ""
    this.uid = localStorage.getItem("uid");

    // 关键修改：检查是否有从地址选择器返回的地址
    const selectedAddress = sessionStorage.getItem('selectedAddress')
    console.log(selectedAddress)
    if (selectedAddress) {
      try {
        const addressInfo = JSON.parse(selectedAddress)

        // 如果有fullAddress，优先使用它
        if (addressInfo.fullAddress) {
          this.$store.commit('changeAddress', addressInfo.fullAddress)
        } else if (addressInfo.address) {
          // 如果没有fullAddress，自己拼接
          const fullAddress = [
            addressInfo.province,
            addressInfo.city,
            addressInfo.district,
            addressInfo.name,
            addressInfo.address
          ].filter(item => item && item.trim()).join('')
          this.$store.commit('changeAddress', fullAddress)
        }

        this.$store.commit('changelng', addressInfo.lng)
        this.$store.commit('changelat', addressInfo.lat)

        // 清理sessionStorage
        sessionStorage.removeItem('selectedAddress')
      } catch (error) {
        console.error('解析地址信息失败:', error)
      }
    }

    // 原有的表单数据恢复逻辑保持不变
    if (sessionStorage.getItem("addressData")) {
      let addressData = JSON.parse(sessionStorage.getItem("addressData"))
      this.name = addressData.name
      this.sex1 = addressData.sex1
      this.tel = addressData.tel
      this.door = addressData.door
    } else if (this.addId) {
      // 编辑模式逻辑保持不变
      let addr = this.$route.query.addr
      if (addr) {
        let addressData = JSON.parse(this.$route.query.addr)
        this.name = addressData.contact
        this.sex1 = addressData.gender - 1
        this.tel = addressData.phone
        this.door = addressData.number
        this.$store.commit("changeAddress", addressData.addr)
        this.$store.commit("changelng", addressData.lon)
        this.$store.commit("changelat", addressData.lat)
      }
    }
  },
  mounted() {
  }
}
</script>

<style scoped lang="less">
.conPage {
  min-height: 100vh;
  background-color: #F0F0F0;
  box-sizing: border-box;
}

.sex .inpBox {
  display: flex;
  justify-content: end;
}

.sex .inpBox button {
  margin-right: 10px;
  width: 60px;
  background: transparent;
  border-radius: 50px;
  border: 1px solid gray;
  font-size: 13px;
  padding: 3px 3px;
  color: gray;
}

.sex .inpBox .sexoption2 {
  border: 1px solid #DF5756;
  color: #DF5756;
}

.addressBox {
  background-color: white;
  padding: 10px;

  .consignee {
    display: flex;
    align-items: center;
    gap: 25px;
    padding: 13px 5px;
    border-bottom: 1px solid #dedede;

    .consigneeText {
      // font-weight: bold;
      width: 25%;
      white-space: nowrap;
    }
  }

  .consignee2 {
    padding: 16px 5px;
  }

  .inpBox {
    width: 75%;
    font-size: 15px;
    // font-weight: 600;

    .inp {
      width: 100%;
      height: 100%;
      border: none;
      // font-weight: 600;
    }

    .textarea {
      height: 50px;
      // font-weight: 600;
    }
  }

  .selectAddress {
    padding-left: 16px;
    // color: #F36E72;
    // white-space: nowrap;
  }

  .labelBox {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 75%;
    flex-wrap: wrap;

    .label {
      background-color: #F7F7F7;
      font-size: 14px;
      text-align: center;
      width: 53px;
      height: 23px;
      line-height: 23px;
      border-radius: 2px;
    }

    .label1 {
      background-color: #3392FE;
      color: white;
    }

    .determine {
      display: flex;
      align-items: center;
      width: 100%;
      background-color: #fff0;
      border-radius: 30px;
      overflow: hidden;
      height: 30px;
      line-height: 30px;

      .comfireBox {
        width: 90%;
        background-color: #F6F6F6;
        height: 30px;
        padding: 0px 8px;
        font-size: 13px;

        .comfireInp {
          width: 100%;
          height: 100%;
          border: none;
          background-color: #fff0;
        }
      }

      .comfire {
        width: 20%;
        background-color: #EAEAEA;
        height: 100%;
        color: white;
        padding: 3px;
      }
    }
  }
}

.info {
  color: #A5A5A5;
  font-size: 13px;
  font-weight: 500;
  margin-top: 6px;
}

.addNewAddress {
  background-color: white;
  position: fixed;
  width: 100%;
  left: 0px;
  bottom: 0;
  box-sizing: border-box;
  padding: 13px 15px;

  .btn {
    background-image: linear-gradient(to right, #F28F8E, #DC4F4E);
    color: white;
    border-radius: 30px;
    text-align: center;
    height: 39px;
    line-height: 39px;
    font-size: 17px;
  }
}

/deep/ .van-switch {
  width: 50px;
}

/deep/ .van-switch--on .van-switch__node {
  transform: translateX(20px);
}

.popupBox2 {
  /deep/ .van-overlay {
    display: none;
  }

  /deep/ .van-popup--top {
    top: 166px;
    left: 76%;
    background-color: #fff0;
    transition: none;
    position: absolute;
  }

  .popup {
    padding: 30px 25px;
    background-image: url("../../assets/mine/xb.png");
    width: 272px;
    height: 134px;
    box-sizing: border-box;
    background-size: 100% 100%;
  }

  .brandBox {
    font-size: 14px;
    color: #6c6b6b;
    line-height: 25px;
  }

  .retract {
    border: 1px solid #DF5756;
    color: #DF5756;
    width: 57px;
    font-size: 13px;
    text-align: center;
    height: 28px;
    line-height: 28px;
    border-radius: 5px;
  }

  .retractBox {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 5px;
    justify-content: flex-end;
  }

  .retract2 {
    background-color: #DF5756;
    color: #fff;
  }
}
</style>