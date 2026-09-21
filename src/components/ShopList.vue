<template>
  <div class="listBox" :style="{ gap: cake == 1 ? '3px 0px' : '' }">
    <div class="listItem" :class="{ cake2: cake == 2 && (index == 0 || index == 1) }"
      :style="{ width: cake == 1 ? '31.6%' : '', boxShadow: cake == 2 ? '0px 0px 4px -3px #00000094' : '' }"
      v-for="(item, index) in productList" :key="index" @click="todetail(item)">
      <div class="imgBox" :style="{ height: cake == 1 ? '109px' : '' }">
        <div class="cakeImg">
          <img class="img" style="object-fit:cover;" :src="item.cpbs == 2 ? item.image_path : item.thumbnailimage" alt="">
        </div>
      </div>
      <div class="bottomBack">
        <div class="cakeTitle" :style="{ fontSize: cake == 1 ? '10px' : '' }">{{ item.cpbs == 2 ? item.title : item.name }}</div>
        <div class="blessedness" v-if="cake == 2">{{ item.brand_name }}</div>
        <div class="blessedness" v-if="indexs == 1 && item.label_name">{{ item.label_name }}</div>
        <div class="priceBox" :style="{ marginTop: cake == 1 ? '8px' : '' }">
          <span class="fs10">￥</span><span>{{ changePrice1(item.price) }}</span>.{{ changePrice2(item.price) }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ShopList",
  props: ['cake', 'productList', 'indexs'],
  data() {
    return {}
  },
  methods: {
    // 价格处理
    changePrice1(price) {
      return price.toString().includes(".") ? price.toString().split('.')[0] : price
    },
    changePrice2(price) {
      return price.toString().includes(".") ? Number(price).toFixed(2).toString().split('.')[1] : "00"
    },
    todetail(item) {

      sessionStorage.setItem('scrollPosition',
        document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset
      );



      if (item.cpbs == 1) {
        this.$router.push({ path: "/shopDetail", query: { id: item.id } })
      } else if (item.cpbs == 2) {
        if (this.cake == 1) {
          this.$router.replace({ path: "/productDetail", query: { id: item.id } })
          this.$router.go(0)
        } else {
          this.$router.push({ path: "/productDetail", query: { id: item.id } })
        }
      }
    }
  }
}
</script>


<style scoped>
.listItem {
  width: 48.6%;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
}

.listBox {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px 0px;
}

.imgBox {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 163px;
  overflow: hidden;
}

.cakeImg {
  width: 100%;
  height: 100%;
}

.priceBox {
  color: #CB4947;
  font-size: 13px;
  margin-top: 10px;
}

.priceBox span {
  font-size: 15px;
}

.cakeTitle {
  font-size: 13px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 1;
  /* 显示两行 */
}

.bottomBack {
  padding: 8px 10px;
}

.cake2 {
  margin-top: -25px;
}

.blessedness {
  color: #D36261;
  border: 1px solid #D36261;
  font-size: 10px;
  max-width: 80%;
  padding: 0px 4px;
  margin-top: 5px;
  text-align: center;
  border-radius: 2px;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>