<template>
  <div>
    <!--  支付密码-->
    <van-popup v-model="show" position="bottom">
      <div class="passwordBox">
        <div class="close" @click="show=false">
          <van-icon size="18px" name="cross"/>
        </div>
        <div class="title">请输入支付密码</div>
        <div class="flex">
          <div>付款方式</div>
          <div>福利卡</div>
        </div>
        <!-- 密码输入框 -->
        <van-password-input
            style="margin-top: 15px"
            :value="pass"
            @focus="showKeyboard = true"
        />
        <!-- 数字键盘 -->
        <van-number-keyboard
            :show="showKeyboard"
            @input="onInput"
            @delete="onDelete"
            @blur="showKeyboard = false"
        />
      </div>
    </van-popup>
  </div>
</template>
<script>
export default {
  name: "PayPassword",
  props: {
    isShow: Boolean
  },
  data() {
    return {
      show: this.isShow,
      pass: "",
      showKeyboard: true
    }
  },
  methods: {
    onInput(key) {
      this.pass = (this.pass + key).slice(0, 6);
      this.$emit("onInput",this.pass)
    },
    onDelete() {
      this.pass = this.pass.slice(0, this.pass.length - 1);
    },
  },
  created() {
  },
  watch: {
    isShow(item1, item2) {
      // item1为新值，item2为旧值
      this.show = item1
    },
    show(val) {
      if (this.isShow !== val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>


<style scoped lang="less">
.van-popup--bottom {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.passwordBox {
  padding: 15px;
  position: relative;
  height: 50vh;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
}

.title {
  text-align: center;
  font-size: 13px;
}

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #9b9b9b;
  margin-top: 15px;
  padding: 0px 10px;
}
</style>