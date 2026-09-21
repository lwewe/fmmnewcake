<template>
  <div class="location">
    <NProgress v-if="loadingflag"/>
    <div class="info">
      <!--左侧-->
      <div class="leftBox" ref="leftBox">
        <div class="noneselect" :class="{seletBox:selectId==item.id}" v-for="item in classList" :key="item.id"
             @click="changeSelect(item.id)">
          <a @click="changeHash('#s'+item.id)">{{ item.name }}</a>
        </div>
      </div>
      <!--  右侧-->
      <div class="rightBox" @scroll="scrollRightItem()">
        <div class="rightItem" ref="rightItem" :id="'s'+item.id" v-for="(item,index) in classList" :key="item.id">
          <div class="rightTop">
            <div class="flex">
              <div class="line"></div>
              <div class="classTitle">{{ item.name }}</div>
            </div>
            <div class="more" @click="toMore(item.id,index)">
              <div>更多</div>
              <div class="icon">
                <van-icon name="arrow"/>
              </div>
            </div>
          </div>
          <div class="rightCenter" :style="{gap:item.flag==2?'25px 0px':''}">
            <div class="centerItem"  v-for="(item2,index2) in item.list" :key="item2.id"
                 @click="toMore2(item.id,item2.id,index,index2)">
              <div class="imgMax" style="width: 65%;">
                <div class="imgBox">
                  <img class="img" :src="item2.tbimg" alt="">
                </div>
              </div>
              <div class="title">{{ item2.name }}</div>
            </div>
            <div class="centerItem" v-if="item.flag==2||item.flag==3" v-for="(item2,index2) in item.list"
                 :key="item2.id"
                 @click="toMore2(item.id,item2.id,index,index2)">
              <div class="imgMax">
                <div class="imgBox">
                  <img class="img" :src="item2.img" alt="">
                </div>
              </div>
              <div class="title">{{ item2.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <NavigationTab :active="1"></NavigationTab>
  </div>
</template>

<script>
import NavigationTab from "@/components/NavigationTab.vue";
import {getBookClassify, getClassifyList} from "@/api";

export default {
  components: {NavigationTab},
  data() {
    return {
      classList: [],
      selectId: 1,
      tabScrollTop: 0,
      loadingflag: true,
      isclick:false
    }
  },
  methods: {
    scrollRightItem() {
      if(this.isclick ){
        this.isclick = false
        return
      }
      this.classList.forEach((item, index) => {
        // if(index>0){
        let top = Math.ceil(this.$refs.rightItem[index].getBoundingClientRect().top)
        let height = Math.ceil(this.$refs.rightItem[index].getBoundingClientRect().height)
        if (top >= -(height / 2) && top < (height / 4)) {
          this.selectId = item.id
          if (index > 8) {
            this.$refs.leftBox.scrollTop = (index + 1) * 31
          } else {
            this.$refs.leftBox.scrollTop = 0
          }
          return
        }
        // }
        // console.log(top,height)
      })
    },
    changeSelect(id) {
      this.isclick = true
      this.selectId = id
    },
    // 锚链接跳转
    anchor(anchorName) {
      // 找到锚点
      const anchorElement = document.getElementById(anchorName)
      // 如果对应id的锚点存在，就跳转到锚点
      if (anchorElement) {
        anchorElement.scrollIntoView()
      }
    },
    //锚点跳转
    changeHash(idname) {
      document.querySelector(idname).scrollIntoView(true);
    },
    toMore(id, index1) {
      this.$router.push({path: "/productList", query: {id, index1}})
    },
    toMore2(id, id2, index1, index2) {
      this.$router.push({path: "/productList", query: {id, classId: id2, index1, index2}})
    },
    // 获取分类列表
    getClassify() {
      getBookClassify().then(res => {
        // console.log(res)
        this.loadingflag = false
        if (res.code == 200) {
          this.classList = res.data.product_class
        }
      })
    }
  },
  created() {
    this.getClassify()
  }
}
</script>
<style scoped lang="less">
.location {
  background-color: #F0F0F0;
  height: calc(100vh - 50px);
  padding: 10px 10px 0px 0px;
  box-sizing: border-box;
}

.flex {
  display: flex;
  align-items: center;
  gap: 5px;
}

.info {
  display: flex;
}

.leftBox {
  color: #5C5C5C;
  font-size: 14px;
  font-weight: bold;
  margin-top: -22px;
  text-align: center;
  width: 25%;
  padding: 4px 10px 10px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
}

.seletBox {
  background-image: linear-gradient(to right, #46ABFE, #6ECBFF);
  color: #f2f7ff;
  border-radius: 30px;
}

.noneselect {
  padding: 6px 3px;
  width: 90%;
  margin: auto;
  margin-top: 22px;
}

.more {
  display: flex;
  //align-items: baseline;
  gap: 3px;
  color: #909090;
  font-size: 12px;
  padding-top: 2px;
}

.icon {
  padding-top: 3px;
}

.line {
  padding: 8px 1px;
  background-color: #41A5FB;
  width: 5px;
  border-radius: 30px;
}

.rightTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.classTitle {
  font-weight: bold;
}

.rightBox {
  width: 75%;
  max-height: calc(100vh - 50px);
  overflow-y: auto;
  margin-top: -10px;
}

.rightItem {
  background-color: white;
  border-radius: 15px;
  padding: 15px 10px 25px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.rightCenter {
  display: flex;
  flex-wrap: wrap;
  margin-top: 25px;
  gap: 18px 0px;

  .centerItem {
    width: 33%;
  }

  .imgMax {
    width: 50%;
    height: 90%;
    margin: auto;
    overflow: hidden;
    display: flex;
  }

  .imgBox {
    width: 100%;
    margin: auto;
    width: 37px;
    height: 52px;
  }
}

.title {
  font-size: 12px;
  text-align: center;
  color: #666666;
  padding-top: 2px;
  //margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rightBox::-webkit-scrollbar {
  display: none
}

.leftBox::-webkit-scrollbar {
  display: none
}
</style>