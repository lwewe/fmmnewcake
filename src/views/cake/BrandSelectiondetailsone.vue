<template>
  <div class="conPage">
    <!-- Banner 区域 - 动态获取 -->
    <div class="banner">
      <img :src="bannerUrl" style="width: 100%;" alt="">
    </div>

    <!-- 动态渲染多个板块 -->
    <div v-for="(section, sectionIndex) in sectionsData" :key="sectionIndex" style="padding: 10px;">
      <div class="addImg">
        <!-- 板块标题 -->
        <div :class="sectionIndex === 0 ? 'titles' : 'titles1'"></div>

        <!-- 横向滚动Tab栏 -->
        <div class="tabs-wrapper">
          <div class="tabs" :ref="`tabScrollContainer${sectionIndex}`">
            <div v-for="(tabItem, tabIndex) in section.list" :key="tabIndex"
              :class="['tab-item', { active: section.activeTab === tabIndex }]"
              @click="switchTab(sectionIndex, tabIndex)">
              {{ tabItem.title }}
            </div>
          </div>
        </div>

        <!-- 产品列表 -->
        <div class="product-grid">
          <div v-for="(product, pIdx) in getProductList(sectionIndex)" :key="pIdx" class="itemsBox"
            @click="goProductDetail(product)">
            <div class="itemCt">
              <img :src="product.image_path"
                style="height: 100px; width: 100%; object-fit: cover;" alt="">
              <div class="cakeTitle">{{ product.title }}</div>
              <div class="priceBox">
                <span class="fs10">￥</span>
                <span>{{ product.price }}</span>
              </div>
              <!-- <div class="brandName">{{ product.brand_name }}</div> -->
            </div>
          </div>
          <div v-for="n in getEmptyCount(getProductList(sectionIndex).length)" :key="`empty-${sectionIndex}-${n}`"
            class="itemsBox empty-item"></div>
        </div>

        <!--  -->

        <div v-if="getProductList(sectionIndex).length === 0 && !getTabLoading(sectionIndex)" class="empty-state">
   
  <p class="empty-text">当前地区没有可选择分类蛋糕</p>
</div>

        <!-- 查看更多 -->
        <div class="moreClass" @click="loadMore(sectionIndex === 0 ? '1' : '2')">
          查看更多
        </div>
      </div>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="loading-mask">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script>
import { getCakeNominate, getCategoryProduct } from "@/api";

export default {
  data() {
    return {
      loading: false,
      bannerUrl: '',
      cityId: '1',
      // 核心数据：存储API返回的所有板块
      sectionsData: [],
      // 分页大小
      pageSize: 6
    }
  },

  computed: {
    // 获取当前板块的产品列表
    getProductList() {
      return (sectionIndex) => {
        const section = this.sectionsData[sectionIndex]
        if (!section) return []

        const currentTab = section.list[section.activeTab]
        if (!currentTab) return []

        // 返回当前Tab的产品数据
        return currentTab.productList || []
      }
    },

    // 判断是否还有更多数据
    hasMore() {
      return (sectionIndex) => {
        const section = this.sectionsData[sectionIndex]
        if (!section) return false

        const currentTab = section.list[section.activeTab]
        if (!currentTab) return false

        // 当前页 < 总页数
        return currentTab.currentPage < currentTab.totalPages
      }
    }
  },

  methods: {
    // 获取当前Tab的加载状态（用于判断是否显示空状态，避免加载中闪烁）
getTabLoading(sectionIndex) {
  const section = this.sectionsData[sectionIndex]
  if (!section) return false
  
  const currentTab = section.list[section.activeTab]
  return currentTab?.loading || false
},
    // 计算空位补全
    getEmptyCount(length) {
      const remainder = length % 3
      return remainder === 0 ? 0 : 3 - remainder
    },

    // 切换Tab - 调用接口获取产品
    async switchTab(sectionIndex, tabIndex) {
      const section = this.sectionsData[sectionIndex]
      if (!section) return

      // 更新激活Tab
      section.activeTab = tabIndex

      const currentTab = section.list[tabIndex]
      if (!currentTab) return

      // 重置分页
      currentTab.currentPage = 1
      currentTab.productList = []

      // 调用接口获取产品
      await this.fetchProducts(sectionIndex, tabIndex, true)

      // 滚动到可见区域
      this.scrollTabIntoView(sectionIndex, tabIndex)
    },

    // 获取产品列表（调用二级分类接口）
    async fetchProducts(sectionIndex, tabIndex, isReset = false) {
      const section = this.sectionsData[sectionIndex]
      if (!section) return

      const currentTab = section.list[tabIndex]
      if (!currentTab) return

      // 如果是重置，页码设为1
      if (isReset) {
        currentTab.currentPage = 1
      }

      // 防止重复加载
      if (currentTab.loading) return

      currentTab.loading = true
      this.loading = true

      try {
        const params = {
          // cid: this.cityId,
          fid: currentTab.id,  // 二级分类ID
          pageno: currentTab.currentPage,
          pagesize: this.pageSize
        }

        const res = await getCategoryProduct(params)

        if (res.code === 200 && res.data) {
          const productList = res.data.product_list || []

          // 更新产品列表
          if (isReset) {
            currentTab.productList = productList
          } else {
            currentTab.productList = [...currentTab.productList, ...productList]
          }

          // 计算总页数（如果API返回了总条数，否则根据返回数量判断）
          if (productList.length < this.pageSize) {
            currentTab.totalPages = currentTab.currentPage
          } else {
            currentTab.totalPages = currentTab.currentPage + 1
          }
        }
      } catch (error) {
        console.error('获取产品列表失败:', error)
        this.$toast?.error('获取数据失败，请稍后重试')
      } finally {
        currentTab.loading = false
        this.loading = false
      }
    },

    // 加载更多
    loadMore(vals) {
      this.$router.push({
        path: 'BrandSelectiondetailsclassfy', query: { id: vals }
      })
      
    },

    // 滚动Tab到可见区域
    scrollTabIntoView(sectionIndex, tabIndex) {
      this.$nextTick(() => {
        const container = this.$refs[`tabScrollContainer${sectionIndex}`]
        if (container && container[0] && container[0].children[tabIndex]) {
          container[0].children[tabIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          })
        }
      })
    },

    // 跳转产品详情
    goProductDetail(product) {
      this.$router.push({
        path: '/productDetail',
        query: { id: product.id }
      })
    },

    // 获取一级分类数据（Cake/nominate）
    async fetchNominateData() {
      this.loading = true

      try {
        const res = await getCakeNominate({
          // cid: this.cityId,
          fid: '24'
        })

        if (res.code === 200 && res.data) {
          // 设置Banner
          if (res.data.classify && res.data.classify.banner) {
            this.bannerUrl = res.data.classify.banner
          }

          // 处理板块数据
          const classifyList = res.data.classify_list || []

          this.sectionsData = classifyList.map((item) => {
            // 处理每个分类下的子分类
            const listWithProducts = (item.list || []).map(listItem => {
              return {
                id: listItem.id,
                title: listItem.title,
                productList: [],      // 存储产品列表
                currentPage: 1,       // 当前页码
                totalPages: 1,        // 总页数
                loading: false        // 加载状态
              }
            })

            return {
              id: item.id,
              title: item.title,
              img: item.img,
              list: listWithProducts,
              activeTab: 0,           // 默认选中第一个
              zid: item.zid
            }
          })

          // 为每个板块加载默认Tab的产品
          for (let i = 0; i < this.sectionsData.length; i++) {
            const section = this.sectionsData[i]
            if (section.list.length > 0) {
              await this.fetchProducts(i, 0, true)
            }
          }
        }
      } catch (error) {
        console.error('获取推荐数据失败:', error)
        this.$toast?.error('获取数据失败，请稍后重试')
      } finally {
        this.loading = false
      }
    }
  },

  created() {
    // 获取城市ID
    // this.cityId = this.$route.query.cid || localStorage.getItem('cityId') || '1'

    // 获取数据
    this.fetchNominateData()
  }
}
</script>

<style scoped lang="less">
.conPage {
  font-size: 12px;
  min-height: 100vh;
  background-color: rgba(253, 237, 238, 1);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px 7px;
}

.itemsBox {
  width: 100%;
  cursor: pointer;

  &.empty-item {
    visibility: hidden;
    height: 0;
    padding: 0;
    margin: 0;
  }
}

.cakeTitle {
  font-size: 13px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 1;
  line-height: 1.3;
  min-height: 17px;
}

.brandName {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.priceBox {
  color: #CB4947;
  font-size: 13px;
  margin-top: 6px;
}

.priceBox span {
  font-size: 15px;
}

.banner {
  display: flex;
}

.addImg {
  background-color: #ffffff;
  padding: 10px;
  border-radius: 10px;

  .titles {
    font-size: 18px;
    font-weight: 600;
    color: rgba(190, 141, 101, 1);
    background: url(../../assets/icon-1/dgks.png);
    background-size: contain;
    height: 40px;
    background-repeat: no-repeat;
  }

  .titles1 {
    background: url(../../assets/icon-1/dgk.png);
    font-size: 18px;
    font-weight: 600;
    color: rgba(190, 141, 101, 1);
    background-size: contain;
    height: 40px;
    background-repeat: no-repeat;
  }
}

/* Tab栏横向滚动样式 */
.tabs-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  margin-bottom: 15px;
  margin-top: 6px;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tabs {
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  min-width: max-content;
  padding: 0 5px;
}

.tab-item {
  flex-shrink: 0;
  width: 100px;
  padding: 8px 0;
  text-align: center;
  background-color: rgba(253, 234, 235, 1);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #666;

   

  &.active {
    background-color: rgba(236, 92, 88, 1);
    color: #ffffff;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.2);
  }
}

.moreClass {color:  rgba(151, 151, 151, 1);
  font-size: 12px;
  text-align: center;
  border-radius: 30px;
  background-color: rgba(255, 225, 180, 1);
  margin: 10px auto 0;
  width: 200px;
  padding: 3px 0;
  cursor: pointer;
}

/* 加载动画 */
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #CB4947;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .tab-item {
    width: 80px;
    font-size: 12px;
    padding: 6px 0;
  }
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  
  .empty-icon {
    width: 120px;
    margin-bottom: 16px;
    opacity: 0.6;
  }
  
  .empty-text {
    font-size: 14px;
    color: #999;
    line-height: 1.5;
  }
}
</style>