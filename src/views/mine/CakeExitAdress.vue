<template>
  <div class="conPage">
    <NProgress v-if="loadingflag"/>
    <div class="addressBox">
      <div class="consignee">
        <div class="consigneeText">收货人</div>
        <div class="inpBox">
          <input class="inp" type="text" v-model="userName" placeholder="请输入收货人姓名">
        </div>
      </div>
      <div class="consignee consignee2">
        <div class="consigneeText">手机号码</div>
        <div class="inpBox">
          <input class="inp" type="number" v-model="phone" placeholder="请输入收货人手机号码">
        </div>
      </div>
      <div class="consignee consignee2" @click="changeAddress=true">
        <div class="consigneeText" @click.stop="changeAddress=false">所在地区</div>
        <div class="inpBox selectAddress" v-if="!allAddress">
          请选择地址
        </div>
        <div class="inpBox selectAddress2" v-else>
          {{ allAddress }}
        </div>
        <div>
          <van-icon name="arrow"/>
        </div>
      </div>
      <div class="consignee" style="align-items: flex-start">
        <div class="consigneeText">详细地址</div>
        <div class="inpBox" @click="getLocation">
          <textarea v-model="detailAddress" class="inp textarea" type="text"
                    placeholder="小区、楼栋号、单元室等"></textarea>

          <!--    当前定位的弹窗 :disabled="showAddress"-->
          <!--          <div class="popupBox2">-->
          <!--            <van-popup v-model="showAddress" position="top">-->
          <!--              <div class="popup">-->
          <!--                <div class="brandBox" style="margin: 0;">-->
          <!--                  <div>{{ address }}-->
          <!--                  </div>-->
          <!--                </div>-->
          <!--                <div class="retractBox">-->
          <!--                  <div class="retract" @click="cancellation">取消</div>-->
          <!--                  <div class="retract retract2" @click="filling">填入</div>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--            </van-popup>-->
          <!--          </div>-->
        </div>
      </div>
      <!--      <div class="consignee consignee2">-->
      <!--        <div class="consigneeText">门牌号</div>-->
      <!--        <div class="inpBox">-->
      <!--          <input class="inp" type="text" placeholder="例如:3号楼1单元1201">-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="consignee">
        <div class="consigneeText">地址标签</div>
        <div class="inpBox labelBox">
          <div class="label" :class="{label1:selectId==item.id&&item.checked}" @click="changeSelect(item.id,item.text)"
               v-for="item in labelList" :key="item.id">{{ item.text }}
          </div>
          <div class="label" v-if="!isAdd" @click="changeAdd">+</div>
          <div v-else>
            <div class="label determine" v-if="isExit" style="width: inherit;">
              <div class="comfireBox" style="width: inherit;" :style="'background-color:'+ labelColor2+';color:'+Color"
                   @click="changeWrite">{{ labelText }}
              </div>
              <div class="comfire" :style="'background-color:'+ labelColor"
                   style="width: inherit;border-left: 1px solid white" @click="exit">编辑
              </div>
            </div>
            <div class="label determine" v-else>
              <div class="comfireBox"><input maxlength="5" x @input="changeLabel" v-model="labelText" class="comfireInp"
                                             type="text"
                                             placeholder="请输入标签名称，最多5个字"></div>
              <div class="comfire" :style="'background-color:'+ labelColor" @click="comfire">确定</div>
            </div>
          </div>
        </div>
      </div>
      <div class="consignee" style="justify-content: space-between;border: none">
        <div class="consigneeText" style="width: 60%;">
          <div>设为默认地址</div>
          <div class="info">每次下单会默认推荐使用该地址</div>
        </div>
        <div>
          <van-switch @change="changeSwitch" active-color="#DF5756"
                      inactive-color="#FFFFFF" v-model="checked"/>
        </div>
      </div>
    </div>
    <!--    保存地址-->
    <div class="addNewAddress">
      <div class="btn" @click="addaddress">保存地址</div>
    </div>
    <!--      选择省市区街道-->
    <div class="popupBox3">
      <van-popup v-model="changeAddress" position="bottom">
        <div>
          <Address @getAddress="getAddress" @chanegTown="chanegTown"></Address>
          <div class="close" @click="changeAddress=false">
            <van-icon size="18px" name="cross"/>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import Address from "@/components/Address.vue";
import {addscaddress, editscaddress, showscaddress} from "@/api/cakeAddress";

export default {
  name: "AddAdress",
  components: {Address},
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
      selectId: 0,
      isAdd: false,
      isExit: false,
      Color: "",
      isChange: false,
      showAddress: false,
      address: "",
      detailAddress: "",
      isCancel: false,
      changeAddress: false,
      allAddress: "",
      province_id: "",
      city_id: "",
      county_id: "",
      town_id: "",
      userName: "",
      phone: "",
      changeText: "",
      is_default: 0,
      id: "",
      change: null,
      listlength: null,
      gid: "",
      loadingflag: true
    }
  },
  methods: {
    // 添加地址
    addaddress() {
      var reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (this.userName == "") {
        this.$toast("请填写您的收货人姓名");
        return
      }
      if (!reg_tel.test(this.phone)) {
        this.$toast("请正确填写您的手机号码");
        return
      }
      if (this.allAddress == "") {
        this.$toast("请选择您的所在地区");
        return
      }
      if (!this.county_id) {
        this.$toast("请重新选择您的所在地区");
        return
      }
      if (this.detailAddress == "") {
        this.$toast("请填写您的详细地址");
        return
      }
      let data = {
        name: this.userName,  //    是	string	姓名
        phone: this.phone,//    是	string	手机号
        city: this.city_id,	//    是	string	市ID
        area: this.county_id,//    是	string	县/区ID
        addr: this.detailAddress,//    是	string	详细地址
        tag: this.labelText ? this.labelText : this.changeText,	//   是	string	标签（家，公司，学校）
        is_default: this.is_default //是	string	默认地址 1-默认 0-不默认 传1和
      }
      if (!this.id) {
        addscaddress(data).then(res => {
          if (res.code == 200) {
            this.$toast(res.data)
            setTimeout(() => {
              if (this.change == 0 && this.listlength == 0) {
                this.$router.go(-2)
              } else {
                this.$router.go(-1)
              }
            }, 1000)
          } else {
            this.$toast(res.data)
          }
        })
      } else {
        editscaddress({
          ...data,
          id: this.id,
          gid: this.gid
        }).then(res => {
          if (res.code == 200) {
            this.$toast(res.data)
            setTimeout(() => {
              this.$router.go(-1)
            }, 1000)
          } else {
            this.$toast(res.data)
          }
        })
      }
    },
    changeSwitch(e) {
      if (e) {
        this.is_default = 1
      } else {
        this.is_default = 0
      }
    },
    chanegTown(e) {
      this.changeAddress = e
    },
    getAddress(e, ids) {
      this.allAddress = e
      this.city_id = ids.city_id
      this.county_id = ids.county_id
    },
    changeLabel() {
      if (this.labelText != "") {
        this.labelColor = "#DF5756"
      } else {
        this.labelColor = "#EAEAEA"
      }
    },
    changeSelect(id, text) {
      this.isChange = false
      if (!this.isChange && this.isExit) {
        this.labelColor = "#2D2D2D"
        this.labelColor2 = "#F6F6F6"
        this.Color = "#000000"
      }
      // if (this.selectId == 0) {
      this.selectId = id
      this.changeText = text
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
      this.changeText = ""
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
    //   编辑的时候回显
    getshowscaddress(id) {
      showscaddress({
        id
      }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          let address = res.data.address
          let city = res.data.address.city
          let county = res.data.address.area
          this.city_id = city
          this.county_id = county
          this.userName = address.name
          this.gid = address.gid
          this.phone = address.phone
          this.detailAddress = address.addr
          if (address.tag) {
            if (this.labelList.filter(item => address.tag == item.text).length == 0) {
              this.labelText = address.tag
              this.isAdd = true
              this.isExit = true
              this.labelColor = "#3392FE"
              this.labelColor2 = "#3392FE"
              this.Color = "#fff"
            } else {
              this.selectId = this.labelList.filter(item => address.tag == item.text)[0].id
              this.labelList.filter(item => address.tag == item.text)[0].checked = true
            }
          }
          this.is_default = address.is_default
          this.checked = address.is_default == 1 ? true : false
          this.allAddress = city + " " + county + " "
        }
      })
    }
  },
  created() {
    this.address = sessionStorage.getItem("streetNumber")
    this.id = this.$route.query.id
    this.change = this.$route.query.change
    this.listlength = this.$route.query.length
    if (this.$route.query.id) {
      document.title = "编辑地址"
      this.getshowscaddress(this.$route.query.id)
    } else {
      document.title = "新增地址"
      this.loadingflag = false
    }
  }
}
</script>

<style scoped lang="less">
.conPage {
  min-height: 100vh;
  background-color: #F0F0F0;
  box-sizing: border-box;
}

.addressBox {
  background-color: white;
  padding: 10px;

  .consignee {
    display: flex;
    align-items: center;
    gap: 25px;
    padding: 13px 5px;
    border-bottom: 1px solid #F2F2F2;

    .consigneeText {
      font-weight: bold;
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
    position: relative;

    .inp {
      width: 100%;
      height: 100%;
      border: none;
    }

    .textarea {
      height: 50px;
      background-color: white;
    }
  }

  .selectAddress {
    padding-left: 16px;
    color: #F36E72;
    white-space: nowrap;
  }

  .selectAddress2 {
    //padding-left: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 50%;
    overflow: hidden;
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
    top: -17px;
    left: 43%;
    background-color: #fff0;
    transition: none;
    position: absolute;
    max-height: 223%;
  }

  .popup {
    padding: 30px 25px;
    background-image: url("../../assets/mine/xb.png");
    //width: 227px;
    //height: 134px;
    box-sizing: border-box;
    background-size: 100% 100%;
    position: relative;
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
    position: relative;
    bottom: -12px;
  }

  .retract2 {
    background-color: #DF5756;
    color: #fff;
  }
}

.popupBox3 {
  /deep/ .van-popup--bottom {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    height: 82vh;
  }

  .close {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>