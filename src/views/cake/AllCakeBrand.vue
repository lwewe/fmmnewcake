<template>
  <div class="conpage">
    <NProgress v-if="loadingflag"/>
    <div class="searchBox">
      <van-search background="#fff0" @input="searchInput" placeholder="搜索想要的品牌" v-model="searchValue"/>
    </div>
    <div class="title">
      <div>蛋糕品牌</div>
      <div class="line"></div>
    </div>
    <div class="sortTop sortCenter">
      <div class="sortItem" v-for="(item,index) in sortList"
           :key="item.id" @click="toBrandDetail(item.id,item.brand_id)">
        <div class="iconImg">
          <img class="img" :src="item.image_path" alt="">
        </div>
        <div class="sortText">{{ item.name }}</div>
      </div>
    </div>
    <loading style="margin-top: 2px" v-if="isLoading"></loading>
  </div>
</template>
<script>
import {getBrindList} from "@/api/brind";

export default {
  name: "AllCakeBrand",
  data() {
    return {
      searchValue: "",
      sortList: [],
      isScroll: false,
      pageno: 1,
      isLoading: false,
      timer: null,
      loadingflag: true
    }
  },
  methods: {
    toBrandDetail(id, brandId) {
      this.$router.push({path: "/brandDetail", query: {id, brandId:id}})
    },
    searchInput(e) {
      this.sortList = []
      // 等待的时间默认200ms
      // 每次事件被触发时，都清除之前的旧定时器
      if (this.timer) {
        clearTimeout(this.timer);
      }
      // 函数延迟执行
      this.timer = setTimeout(() => {
        this.getBrind(e)
        this.timer = undefined;
      }, 1000);
    },
    // 品牌列表
    getBrind(keyword = "") {
      this.isLoading = true
      getBrindList({
        flag: 1,
        pageno: this.pageno,
        pagesize: 20,
        keyword
      }).then(res => {
        this.loadingflag = false
        this.isLoading = false
        if (res.code == 200) {
          if (res.data.length == 0) {
            this.isScroll = true
            return
          }
          res.data.forEach(item => {
            this.sortList.push(item)
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
        this.getBrind(this.searchValue)
      }
    }
  },
  created() {
    this.getBrind()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, false);
  },
}
</script>
<style scoped lang="less">
.conpage {
  padding: 10px;
}

.searchBox {

}

.van-search__content {
  background-color: #F6F6F6;
  border-radius: 30px;
}

.van-search {
  padding: 8px 5px 7px;
}

.title {
  text-align: center;
  color: #C83937;
  font-size: 14px;

  .line {
    background-color: #C83937;
    width: 20px;
    height: 2px;
    margin: auto;
    margin-top: 5px;
    border-radius: 30px;
  }
}

.sortCenter {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 23px 13px;
  margin-top: 15px;
}

.sortText {
  width: 80%;
  margin: auto;
  text-align: center;
  font-size: 12px;
  margin-top: 5px;
  color: #707070;
  padding: 2px 0px 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sortText1 {
  background-color: #E42021;
  color: white;
  border-radius: 30px;
}

.sortItem {
  width: calc(25% - 10px);
}

.iconImg {
  //width: 48px;
  //height: 48px;
  margin: auto;
  border: 1px solid #e3e2e2;
  border-radius: 5px;
  overflow: hidden;
}
</style>