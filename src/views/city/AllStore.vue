<template>
  <div class="conPage">
    <NProgress v-if="loadingflag"/>
    <div class="searchBox">
      <div>
        <!--      地址-->
        {{city}}
      </div>
      <div class="searchValue">
        <van-search @input="searchStore" background="#fff0" placeholder="搜索门店" v-model="searchValue"/>
      </div>
    </div>
    <div class="title">
      <div>所有门店</div>
      <div class="line"></div>
    </div>
    <!--    门店列表-->
    <div>
      <div class="storeItem" v-for="item in storeList" :key="item.shop_id" @click="chooseStore(item)">
        <div class="storeName">{{ item.shop_name }}</div>
        <div class="storeAddress">
          <div style="padding-top: 2px">
            <van-icon name="location-o"/>
          </div>
          <div style="color:#6D6D6D">{{ item.address }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import City from "@/components/City.vue";
import {getAllStore} from "@/api/account";

export default {
  name: "AllStore",
  components: {City},
  data() {
    return {
      searchValue: "",
      city:"",
      storeList: [],
      list:[],
      dataList:[],
      loadingflag:true
    }
  },
  methods: {
    searchStore(e){
      let arry  = this.list
      this.storeList = arry.filter(item=>item.shop_name.includes(e))
    },
    chooseStore(item) {
      // this.$store.commit("changeStoreName", item.shop_name)
      this.dataList = this.dataList.filter(item=>item.indexs!=this.$route.query.index)
      this.dataList.push({
        id:item.shop_id,
        name:item.shop_name,
        indexs:this.$route.query.index,
        detail:item.address.replace(/\s*/g,'')
      })
      sessionStorage.setItem("StoreName",JSON.stringify(this.dataList))
      setTimeout(()=>{
        this.$router.go(-1)
      },500)
    },
    getAll(id){
      getAllStore({
        brand_id:id
      }).then(res=>{
        this.loadingflag = false
        if(res.code == 200){
          this.city  = res.data.shop_list.city.name
          this.storeList = res.data.shop_list.shops
          this.list = res.data.shop_list.shops
        }
      })
    }
  },
  created() {
    this.getAll(this.$route.query.id)
    if(sessionStorage.getItem("StoreName")){
      this.dataList = JSON.parse(sessionStorage.getItem("StoreName"))
    }
  }
}
</script>

<style scoped lang="less">
.conPage {
  min-height: 100vh;
  background-color: #F0F0F0;
  padding: 10px;
  box-sizing: border-box;
}

.searchBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 10px;
  gap: 5px;
}


.searchValue {
  width: 80%;
}

.van-search {
  padding: 10px;
  padding-bottom: 6px;
  padding-top: 6px;
}

.van-search .van-cell {
  background-color: transparent;
}

.van-search__content {
  background-color: #F9F9F9;
  border-radius: 30px;
}

.title {
  text-align: center;
  font-size: 15px;
  margin-top: 3px;
  font-weight: bold;

  .line {
    background-color: #C83937;
    width: 20px;
    height: 3px;
    margin: auto;
    margin-top: 5px;
    border-radius: 30px;
  }
}

.storeItem {
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  font-size: 15px;
  margin-top: 10px;

  .storeAddress {
    display: flex;
    gap: 4px;
    font-size: 14px;
    color: #535353;
    border-top: 1px solid #efefef;
    margin-top: 6px;
    padding-top: 7px;
  }
}
</style>