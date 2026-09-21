<template>
  <div class="conPage">
    
    <div class="banner">
      <img :src="banner" style="width: 100%; " alt="">
    </div>

    <!-- 二级分类tab（可左右滚动） -->
    <div class="subTabbar" v-if="currentSubList.length > 0">
      <div class="subTabbarBox">
        <div class="subTabItem" v-for="subItem in currentSubList" :key="subItem.id" 
             @click="changeSubTab(subItem.id)"
             :class="{ activeSubTab: activeSubId == subItem.id }">
          {{ subItem.title }}
          <span :class="{ activeSubTab1: activeSubId == subItem.id }"></span>
        </div>
      </div>
    </div>

    <!-- 产品列表 -->
    <div class="listBox4">
      <ShopList :productList="productList"></ShopList>
      <loading style="margin-top: 2px" v-if="isLoading"></loading>
    </div>
  </div>
</template>

<script>
import ShopList from "@/components/ShopList.vue";
import { getCakeNominate, getCategoryProduct,syflProduct } from "@/api";

export default {
  components: { ShopList },
  data() {
    return {
      classifyData: null,      // 存储选中的分类数据（对象）
      currentSubList: [],      // 当前二级分类列表
      activeSubId: '',         // 当前选中的二级分类id
      productList: [],         // 产品列表
      isLoading: false,
      isScroll: false,
      pageno: 1,
      banner: '',
      ids: ''
    }
  },
  methods: {
    getBrind() {
      syflProduct({
        fid:this.ids == 2 ? '47' : '46',
        pageno: 1,
        pagesize: 10,

      }).then(res => {
        if (res.code == 200) {
           this.banner = res.data.classify.banner
        }
      })
    },
    // 获取数据
    getNominateData() {
      this.isLoading = true
      getCakeNominate({
        fid: '24'
      }).then(res => {
        this.isLoading = false
        if (res.code == 200) {
          // 根据 ids 选择显示哪个分类
          let selectedClassify = null
          if (this.ids == 1) {
            selectedClassify = res.data.classify_list[0]  // 蛋糕款式
          } else {
            selectedClassify = res.data.classify_list[1]  // 蛋糕口味
          }
          
          this.classifyData = selectedClassify;         
          
          if (selectedClassify) {
            this.currentSubList = selectedClassify.list || []
            this.activeSubId = selectedClassify.zid || (this.currentSubList[0]?.id || '')
            if (selectedClassify.product && selectedClassify.product.length > 0) {
              this.productList = selectedClassify.product
            } else {
              this.getCategoryProduct(this.activeSubId)
            }
          }
        }
      })
    },

    // 切换二级分类
    changeSubTab(subId) {
      this.activeSubId = subId
      this.productList = []
      this.pageno = 1
      this.isScroll = false
      this.getCategoryProduct(subId)
    },

    // 获取产品列表
    getCategoryProduct(fid, pageno = this.pageno) {
      this.isLoading = true
      getCategoryProduct({
        fid: fid,
        pageno: pageno,
        pagesize: 10
      }).then(res => {
        this.isLoading = false
        if (res.code == 200) {
          if (res.data.product_list.length == 0) {
            this.isScroll = true
            return
          }
          if (pageno === 1) {
            this.productList = res.data.product_list
          } else {
            res.data.product_list.forEach(item => {
              this.productList.push(item)
            })
          }
        }
      }).catch(() => {
        this.isLoading = false
      })
    },

    // 滚动加载更多
    handleScroll(e) {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        if (!this.isScroll && this.activeSubId) {
          this.pageno++
          this.getCategoryProduct(this.activeSubId, this.pageno)
        }
      }
    }
  },
  created() {
    this.ids = this.$route.query.id;
    this.getNominateData();
    this.getBrind()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
}
</script>

<style scoped lang="less">
.conPage {
  min-height: 100vh;
  background-color: #F0F0F0;
}

.banner {
  display: flex;
  height: 206px;
}

// 二级分类tab - 可左右滚动
.subTabbar {
  background-color: #fff;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 2px 15px;

  &::-webkit-scrollbar {
    display: none;
  }

  .subTabbarBox {
    display: flex;
    gap: 20px;
    min-width: 100%;
  }

  .subTabItem {position: relative;
    flex-shrink: 0;
    width: 70px;
    text-align: center;
    font-size: 14px;
    color: #666;
    padding: 8px 0;
    cursor: pointer;
    white-space: nowrap;

    &.activeSubTab {
      color: rgba(237, 48, 54, 1);
      font-weight: 600;
      // border-bottom: 2px solid #ff6b6b;
    }
    .activeSubTab1 {
          position: absolute;
    color:  rgba(237, 48, 54, 1);
    font-weight: 600;
    display: inline-block;
    height: 2px;
    width: 30px;
    left: 30%;
    border-bottom: 2px solid rgba(237, 48, 54, 1);
    bottom: 0;
    }
  }
}
 

.listBox4 {
  background-color: rgba(255, 249, 232, 1);
}
</style>