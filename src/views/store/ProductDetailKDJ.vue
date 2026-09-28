<template>
  <div class="productdetail">
    <NProgress v-if="loadingflag" />
    <ReturnBack :rcolor="'#fff'" :bcolor="'rgba(218,218,218,0.26)'"></ReturnBack>
    <!--    详情图-->
    <div class="productpic">
      <div class="detailImg" :class="{ detailImg4: num1 == 4 }">
        <img class="img"
          :src="detalilist.imageUrl || detalilist.product_img || detalilist.detailImgUrl || detalilist.image || detalilist.img"
          alt="">
      </div>
    </div>
    <div class="detail">
      <div class="wrap">
        <div class="title">{{ detalilist.product_name || detalilist.showNameCn || detalilist.title }}</div>
        <div :class="{ stepper: num2 == 2, stepper6: num1 == 6, }">
          <van-stepper theme="round" v-model="count" button-size="22" disable-input />
        </div>
      </div>
      <!--      列表-->
      <!--      浓缩份数-->
      <div class="listBox" v-if="concentration.length > 0">
        <div v-for="(item, index) in concentration.slice(0, 1)" :key="index" class="listItem">
          <div class="listName">{{ item.name }}</div>
          <div class="comboProducts">
            <div v-for="(item2, index2) in item.extra_list" class="product"
              :class="{ product2: item2.is_default == 1 && item.display_type != 'bar', product3: num1 == 4 }"
              :key="index2" @click="changeSelect(item, index, item2, index2)">
              <!--              及数量-->
              <div class="stepperBar">
                <div> {{ item2.name }}{{ item.code }}</div>
                <div class="stepper">
                  <van-stepper v-model="item2.number" min="0" disable-input />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--      <div class="listBox" v-if="accessoriesList.length>0">-->
      <!--        <div class="listItem">-->
      <!--          <div class="listName">配料</div>-->
      <!--          <div class="comboProducts">-->
      <!--            <div v-for="(item,index) in accessoriesList" :key="index" class="product"-->
      <!--                 :class="{product2:item.checked}"-->
      <!--                 @click="changeAccessories(item,index)">-->
      <!--              <div>-->
      <!--                <div>-->
      <!--                  <div class="flexBox">-->
      <!--                    <div class="innerName">{{ item.name }}</div>-->
      <!--                  </div>-->
      <!--                </div>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="listBox" v-if="list.length > 0">
        <div v-for="(item, index) in list" :key="index" class="listItem">
          <div class="listName">{{ item.name || item.roundNameCn || item.attrName || item.product_name
            || item.specItemName }}</div>
          <div class="comboProducts">
            <div
              v-for="(item2, index2) in num1 == 3 ? item.itemList : num1 == 2 && detalilist.isMultiSpec == 1 ? item.itemList : item.sku_infos ? item.sku_infos : num1 == 6 ? item.ingredients : num1 == 7 ? item.specValueList : item.values ? item.values : num1 == 1 && flag ? item.comboProducts : num1 == 2 && flag ? item.condimentItemList : 1"
              class="product"
              :class="{ product2: (item2.isDefault == 1 || item2.defaultSelected == 1 || item2.is_default == 1 || item2.checked == 1 || item2.recommendFlag == 1 || item.product_name) && item.display_type != 'bar', product3: num1 == 4 && item.display_type == 'bar', product4: (!item2.disabled && num1 == 7) || item2.soldOut == 1 }"
              :key="index2" @click="changeSelect(item, index, item2, index2)">
              <!--              及数量-->
              <div v-if="num1 == 4 && item.display_type == 'bar'" class="stepperBar">
                <div> {{ item2.name || item2.menuCn || item2.showNameCn }}</div>
                <div class="stepper">
                  <van-stepper @change="changValue(item2, item)" v-model="item2.number" min="0" disable-input />
                </div>
              </div>
              <div class="flexBox" v-else>
                <div class="productImg"
                  v-if="item2.image || item2.imageUrl || item.product_img || item2.product_img || item2.img">
                  <img class="img"
                    :src="item2.image || item2.imageUrl || item.product_img || item2.product_img || item2.img" alt="">
                </div>
                <div class="innerName">
                  {{ item2.name || item2.nameCn || item2.menuCn || item2.showNameCn || item2.value || item.product_name
                  }}
                  <!--                  <span v-if="item2.quantity>0" class="quantity">×{{ item2.quantity }}</span>-->
                </div>
                <!--                <div style="word-break: break-all">{{ item2.code }}</div>-->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="list.length == 0 && num1 == 5">
        <div v-html="detalilist.itemDesc"></div>
      </div>
    </div>
    <!--    底部按钮-->
    <div class="footer">
      <div class="footerBtn" :class="{ footerBtn2: num2 == 1, footerBtn3: num2 == 2, footerBtn6: num1 == 6, }">
        <div class="cartIconBox">
          <div class="cartIcon">
            <img class="img" src="../../assets/backimage/Vector-1.png" alt="">
          </div>
          <div class="cartPrice">
            ￥<span class="priceText">{{ Number(count * fullPrice).toFixed(2) || 0 }}</span>
          </div>
        </div>
        <div class="order order2" @click="addshopcar">
          <div>加入购物车</div>
          <div class="orderText">Add to Cart</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getMDLProductDetail,
  getKFCProductDetail,
  getBSKProductDetail,
  getXBKProductDetail,
  getNXProductDetail
} from '@/api/store'
import { getgoods_detail } from "@/api/newOrder";

export default {
  data() {
    return {
      practiceList: [],   // ★ 新增：K记套餐做法项
      num1: 0,
      num2: 0,
      productid: "",
      storeid: "",
      detalilist: [],
      list: [],
      shopcar: [],   //购物车
      goods: [],    //需要存储的商品
      count: 1,
      costprice: 0,
      loadingflag: true,
      fullPrice: 0,
      productmapping: {},
      rules: [],
      concentration: [],
      concentration2: [],
      accessoriesList: [],
      accessories: [],
      selectId: 0,
      accessoriesText: [],
      flag: false,
      shopName: ""
    };
  },
  watch: {
    shopcar() {
      this.shopcar = this.detalilist
      var price = this.shopcar.price
      this.costprice = price * this.count
    },
    count() {
      this.shopcar = this.detalilist
      var price = this.shopcar.price
      this.costprice = price * this.count
    }
  },
  methods: {
    changValue(item2, item) {
      // console.log(this.fullPrice)
      // console.log(item2)
      this.list.forEach(item3 => {
        item3.extra_list.forEach(item4 => {
          if (item3.code == "Cupsize") {
            for (const key in this.productmapping) {
              if (key.includes(item4.code) && item4.is_default == 1) {
                this.fullPrice = this.productmapping[key].price
                this.skuId = this.productmapping[key].sku_id
              }
            }
          }
          if (item4.code == item2.code) {
            item4.number = item2.number
            if (item2.must != 1) {
              // console.log("走了" +
              //     "")
              this.fullPrice += Number(Number(item4.price).toFixed(0)) * item4.number
            }
          }

        })
      })
    },
    changeAccessories(item, index) {
      this.accessories = []
      this.accessoriesText = []
      this.fullPrice = this.detalilist.discountPrice
      this.list.forEach(item3 => {
        item3.values.forEach(item4 => {
          if (item4.checked == 1) {
            this.fullPrice += item4.discountPrice
          }
        })
      })
      this.accessoriesList.forEach(item2 => {
        if (item.tagCode == item2.tagCode) {
          if (item.checked) {
            item.checked = false
          } else {
            item.checked = true
          }
        }
        if (item2.checked) {
          // this.fullPrice+=item2.discountPrice
          this.accessories.push(item2.skuCode)
          this.accessoriesText.push(item2.name)
        }
      })
    },
    // 选择规格
    changeSelect(item, index, item2, index2) {
      // if (this.num1 == 1) {
      //
      // }else
      if (this.num1 == 2) {
        if (this.detalilist.menuFlag == 2) {
          // if (item2.selectable == 1) {
          //   if (item2.defaultSelected == null) {
          //     item2.defaultSelected = 1
          //   } else {
          //     item2.defaultSelected = null
          //   }
          // }
          this.list.forEach((item3, index3) => {
            item3.condimentItemList.forEach((item4, index4) => {
              if (index == index3) {
                //   if (item2.selectable != 1) {
                item4.defaultSelected = 0
                // }
              }
            })
          })
          // if (item2.selectable != 1) {
          item2.defaultSelected = 1
          // }
        } else
          if (this.detalilist.menuFlag == 3) {
            this.list.forEach(item3 => {
              item3.groupItemList.forEach(item4 => {
                item4.defaultSelected = 0
              })
            })
            item2.defaultSelected = 1
            this.fullPrice = item2.price
          } else if (this.num1 == 2 && this.detalilist.isMultiSpec == 1) {
            // ★ 售罄拦截
            if (item2.soldOut == 1) {
              this.$toast("该规格已售罄")
              return
            }
            this.list.forEach(round => {
              if (round.roundId === item.roundId) {
                round.itemList.forEach(s => s.defaultSelected = 0)
              }
            })
            item2.defaultSelected = 1

            // ★ 用 specId + specValueId 匹配
            const selections = []
            this.list.forEach(round => {
              round.itemList.forEach(spec => {
                if (spec.defaultSelected == 1) {
                  selections.push({ specId: round.roundId, specValueId: spec.productId })
                }
              })
            })

            const matched = this.detalilist.goodsSkuList.find(sku =>
              selections.length === sku.skuItemList.length &&
              selections.every(sel =>
                sku.skuItemList.some(i => i.specId === sel.specId && i.specValueId === sel.specValueId)
              )
            )

            if (matched) {
              this.fullPrice = matched.salePrice || matched.channelPrice
            } else {
              this.$toast("该规格组合暂不可选")
            }
          }
      }
      else if (this.num1 == 3) {
        this.list.forEach(item3 => {
          item3.itemList.forEach(item4 => {
            if (item.id == item3.id) {
              item4.defaultSelected = 0
            }
          })
        })
        item2.defaultSelected = 1
      }
      else if (this.num1 == 1 || this.num1 == 4) {
        if (this.num1 == 1 && this.flag) {

          this.list.forEach(item3 => {
            item3.comboProducts.forEach(item4 => {
              if (item.choicesCode == item3.choicesCode) {
                item4.isDefault = 0
              }
            })
          })
          //ffgai item.comboProducts.forEach(p => p.isDefault = 0);
          item2.isDefault = 1
        } else {
          this.fullPrice = this.detalilist.salePrice
          this.list.forEach(item3 => {
            if (item3.sku_infos) {
              item3.sku_infos.forEach(item4 => {
                if (item.id == item3.id && item.name == item3.name && item4.name) {
                  item4.checked = false
                }
              })
            }
          })
          if (item2.name) {
            item2.checked = true
          }
          this.list.forEach(item3 => {
            if (item3.sku_infos) {
              item3.sku_infos.forEach(item4 => {
                if (item4.checked && item4.name) {
                  this.fullPrice += item4.price
                }
              })
            }
          })
        }
      }
      else if (this.num1 == 5) {
        this.fullPrice = this.detalilist.salePrice
        this.list.forEach(item3 => {
          item3.values.forEach(item4 => {
            if (item.code == item3.code) {
              item4.checked = 0
            }
          })
        })
        item2.checked = 1
        this.list.forEach(item3 => {
          if (item3.values) {
            item3.values.forEach(item4 => {
              if (item4.checked == 1 && item4.name) {
                this.fullPrice += item4.price
              }
            })
          }
        })
      }
      else if (this.num1 == 6) {
        this.fullPrice = this.detalilist.product_price
        this.list.forEach(item3 => {
          item3.ingredients.forEach(item4 => {
            if (item.name == item3.name) {
              item4.checked = 0
            }
          })
        })
        item2.checked = 1
        this.list.forEach(item3 => {
          if (item3.ingredients) {
            item3.ingredients.forEach(item4 => {
              if (item4.checked == 1 && item4.name) {
                this.fullPrice += item4.price
              }
            })
          }
        })
      }
      else if (this.num1 == 7) {
        if (!item2.disabled) {
          this.$toast("此规格不可选")
          return
        }
        this.list.forEach(item3 => {
          item3.specValueList.forEach(item4 => {
            if (item.specItemNo == item3.specItemNo) {
              item4.recommendFlag = 0
            }
          })
        })
        item2.recommendFlag = 1
      }
    },
    // 加入购物车
    addshopcar() {

      let matchedSkuCode = ''
      if (this.num1 == 6 && this.detalilist.details && this.detalilist.details.sku_infos) {
        const configArr = []
        this.list.forEach(item => {
          item.ingredients.forEach(item2 => {
            if (item2.checked == 1) configArr.push(item2.name)
          })
        })
        const matched = this.detalilist.details.sku_infos.find(sku => {
          const values = sku.values.map(v => v.spec_name)
          return values.length === configArr.length &&
            values.every((v, i) => v === configArr[i])
        })
        if (matched) matchedSkuCode = matched.code
      }
      // ===== 新增结束 =====


      var all = ""
      if (this.num1 == 1 || this.num1 == 4) {
        if (this.num1 == 1 && this.flag) {
          this.list.forEach(item => {
            item.comboProducts.forEach(item2 => {
              if (item2.isDefault == 1) {
                all += item2.name + "/"
              }
            })
          })
        } else {
          this.list.forEach(item => {
            if (item.sku_infos) {
              item.sku_infos.forEach(item2 => {
                if (item2.checked) {
                  all += item2.name + "/"
                }
              })
            } else {
              all += item.product_name + "/"
            }
          })
        }
      }
      else if (this.num1 == 2) {
        var selected = []  // ← 补上声明
        this.list.forEach(item => {


          if (this.detalilist.menuFlag == 2) {

            item.condimentItemList.forEach(item2 => {
              if (item2.defaultSelected == 1) {
                all += item2.showNameCn + "/"
              }
            })
          } else if (this.detalilist.menuFlag == 3) {


            item.groupItemList.forEach(item2 => {
              if (item2.defaultSelected == 1) {
                all += item2.showNameCn + "/"
              }
            })
          }



        })




        // 套餐：遍历 list 收集选中规格
        if (this.detalilist.isMultiSpec == 1) {
          const selectedProducts = []

          // ★ 规格项
          this.list.forEach(round => {
            round.itemList.forEach(spec => {
              if (spec.defaultSelected == 1) {
                all += spec.showNameCn + "/"
                selectedProducts.push({
                  linkId: round.roundId,       // 规格组中文名
                  productId: spec.productId,   // 规格值中文名
                  quantity: 1
                })
              }
            })
          })

          // ★ 做法项（可选）
          if (this.practiceList && this.practiceList.length > 0) {
            this.practiceList.forEach(practice => {
              practice.itemList.forEach(item => {
                if (item.defaultSelected == 1) {
                  all += item.showNameCn + "/"
                  selectedProducts.push({
                    linkId: practice.roundId,   // "null_X"
                    productId: item.productId,  // practiceValueId
                    quantity: 1
                  })
                }
              })
            })
          }

          // 只用规格项匹配 SKU
          const specSelections = selectedProducts.filter(p => !String(p.linkId).startsWith('null_'))
          const matchedSku = this.detalilist.goodsSkuList.find(sku =>
            specSelections.length === sku.skuItemList.length &&
            specSelections.every(sel =>
              sku.skuItemList.some(i => i.specId === sel.linkId && i.specValueId === sel.productId)
            )
          )

          if (matchedSku) {
            this.fullPrice = matchedSku.salePrice || matchedSku.channelPrice
            this.detalilist.linkId = matchedSku.skuId
          } else {
            this.$toast("规格组合无效，请重新选择")
            return
          }

          this.detalilist.selected = [{      // ★ 新结构
            round: 0,
            products: selectedProducts
          }]
        }

      }
      else if (this.num1 == 3) {
        if (this.list[0].itemList.filter(item8 => item8.defaultSelected == 1).length == 0) {
          this.$toast("请选择规格")
          return;
        }
        this.list.forEach(item => {
          item.itemList.forEach(item2 => {
            if (item2.defaultSelected == 1) {
              all += item2.showNameCn + "/"
            }
          })
        })
      }
      else if (this.num1 == 5) {
        this.list.forEach(item3 => {
          item3.values.forEach(item4 => {
            if (item4.checked == 1) {
              this.detalilist.details.sku_infos.forEach(item => {
                item.specs.forEach(item2 => {
                  // item2.checked = 0
                  if (item4.code == item2.spec_code) {
                    item2.checked = 1
                  }
                })
                // console.log(item.specs.filter(item7=>item7.checked==1).length)
                // if( item.specs.filter(item7=>item7.checked==1).length== item.specs.length){
                //   console.log(item.specs)
                //   console.log(55)
                // }
              })
            } else {
              this.detalilist.details.sku_infos.forEach(item => {
                item.specs.forEach(item2 => {
                  // item2.checked = 0
                  if (item4.code == item2.spec_code) {
                    item2.checked = 0
                  }
                })
              })
            }
          })
        })
        let isAdd = false
        this.detalilist.details.sku_infos.forEach(item => {
          if (item.specs.filter(item7 => item7.checked == 1).length == item.specs.length) {
            isAdd = true
          }
          if (item.specs.filter(item7 => item7.checked == 1).length == item.specs.length - 1) {
            this.shopName = item.specs.filter(item7 => item7.checked == 0)[0].name
          }
        })
        if (!isAdd) {
          this.$toast((this.shopName ? this.shopName : "") + "规格选择有误，请重新选择")
          return;
        }
        // console.log(111)
        this.list.forEach(item => {
          item.values.forEach(item2 => {
            if (item2.checked == 1) {
              all += item2.name + "+"
              // this.accessories.push(item2.code)
            }
          })
        })


      } else if (this.num1 == 6) {
        this.list.forEach(item => {
          item.ingredients.forEach(item2 => {
            if (item2.checked == 1) {
              all += item2.name + "+"
              // this.accessories.push(item2.code)
            }
          })
        })
      } else if (this.num1 == 7) {
        this.list.forEach(item => {
          item.specValueList.forEach(item2 => {
            if (item2.recommendFlag == 1) {
              all += item2.name + "+"
              // this.accessories.push(item2.code)
            }
          })
        })
      }
      all = (all + this.accessoriesText.join('+')).slice(0, -1)
      if (this.goods.filter(item => item.specifications == all && item.fullPrice == this.fullPrice).length > 0) {
        this.goods.filter(item => item.specifications == all && item.fullPrice == this.fullPrice).forEach(item => {
          item.count += this.count
        })
      } else {
        this.goods.push({
          storeid: this.storeid,
          specifications: all,
          detail: this.detalilist,
          fullPrice: this.fullPrice,
          count: this.count,
          accessories: this.accessories.length > 0 ? this.accessories : [],
          skuId: this.skuId,
          skuCode: matchedSkuCode   // ← 只加这一行
        })
      }
      // console.log(this.goods)
      // return
      sessionStorage.setItem("goods", JSON.stringify(this.goods))
      if (sessionStorage.getItem("goods")) {
        this.$toast("加入成功")
        setTimeout(() => {
          this.$router.go(-1)
        }, 800)
      }
    },
    // 获取麦当劳商品详情
    getMDLProductDetailList() {
      let data = {
        apikey: this.$store.state.appkey,
        storeCode: this.storeid,
        productId: this.productid
      }
      getMDLProductDetail(data).then(res => {
        console.log(this.productid, "this.productid==")
        this.loadingflag = false
        if (res.code == 200) {
          // console.log(res.data);
          this.detalilist = res.data
          this.list = this.detalilist.comboItems

          // ffgai
          //        this.list = this.detalilist.comboItems.map(item => {
          //   if (item.comboProducts) {
          //     // 找到第一个isDefault为1的索引
          //     const defaultIndex = item.comboProducts.findIndex(p => p.isDefault == 1);

          //     // 重置所有项的isDefault
          //     item.comboProducts.forEach((p, i) => {
          //       p.isDefault = i === defaultIndex ? 1 : 0;
          //     });

          //     // 如果没有默认项，设置第一个为默认
          //     if (defaultIndex === -1 && item.comboProducts.length > 0) {
          //       item.comboProducts[0].isDefault = 1;
          //     }
          //   }
          //   return item;
          // });


          this.fullPrice = this.detalilist.price
        } else {
          this.$toast(res.msg)
          setTimeout(() => {
            this.$router.go(-1)
          }, 1500)
        }
      })
    },
    // 获取肯德鸡详情
    getKFCProductDetailList() {
      this.list = []
      let data = {
        apikey: this.$store.state.appkey,
        storeCode: this.storeid,
        linkId: this.productid
      }
      getKFCProductDetail(data).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.detalilist = res.data
          if (this.detalilist.menuFlag == 2) {
            this.detalilist.condimentRoundList.forEach(item => {
              item.condimentItemList.forEach(item2 => {
                if (item2.defaultSelected == null) {
                  item2.selectable = 1
                }
              })
            })
            this.list = this.detalilist.condimentRoundList
            this.fullPrice = this.detalilist.price
          } else if (this.detalilist.menuFlag == 3) {
            this.list = this.detalilist.groupRoundList
            this.list.forEach(item => {
              item.groupItemList.forEach(item2 => {
                if (item2.defaultSelected == 1) {
                  this.fullPrice = item2.price
                }
              })
            })
          }
          // console.log(res.data);
        } else {
          this.$toast(res.msg)
          setTimeout(() => {
            this.$router.go(-1)
          }, 1500)
        }
      })
    },
    // 必胜客详情
    getBSKProductDetailList() {
      let data = {
        apikey: this.$store.state.appkey,
        storeCode: this.storeid,
        parLinkId: this.productid,
        orderType: "1"
      }
      getBSKProductDetail(data).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          // console.log(res);
          this.detalilist = res.data
          this.list = this.detalilist.roundList
          this.fullPrice = this.detalilist.price
          // this.selectDefault()
        } else {
          this.$toast(res.msg)
          setTimeout(() => {
            this.$router.go(-1)
          }, 1500)
        }

      })
    },
    // 获取新商品详情
    getgoods_detail() {
      getgoods_detail({
        shopId: this.storeid,
        productId: this.productid
      }).then(res => {
        console.log('完整返回:', JSON.stringify(res))
        console.log('fff')
        this.loadingflag = false
        // console.log(res)
        if (res.code == 200) {
          this.detalilist = res.data
          console.log('menuFlag:', this.detalilist.menuFlag, 'num1:', this.num1, typeof this.num1)
          console.log('99999999999')
          // if(this.num1==4){
          //   this.list = res.data.details.optional
          // }
          this.fullPrice = this.detalilist.salePrice || 0

          // ===== K记套餐：isMultiSpec == 1 =====
          if (this.num1 == 2 && this.detalilist.isMultiSpec == 1) {
            const specMap = {}

            // ★ 用 specId::specValueId 做 key，避免不同规格组同值冲突
            const skuMap = {}
            this.detalilist.goodsSkuList.forEach(sku => {
              sku.skuItemList.forEach(item => {
                const key = `${item.specId}::${item.specValueId}`
                skuMap[key] = {
                  skuId: sku.skuId,
                  salePrice: sku.salePrice,
                  channelPrice: sku.channelPrice
                }
              })
            })

              ; (this.detalilist.sortedSpecList || []).forEach(spec => {
                specMap[spec.specName] = {
                  roundId: spec.specId,           // ★ 规格组中文名，如 "主食"
                  roundNameCn: spec.specName,
                  itemList: spec.specValueList.map(val => {
                    const key = `${spec.specId}::${val.specValueId}`
                    const sku = skuMap[key] || {}
                    return {
                      linkId: spec.specId,         // ★ 下单时 linkId = 规格组中文名
                      productId: val.specValueId,  // ★ 下单时 productId = 规格值中文名
                      showNameCn: val.specValue,
                      defaultSelected: val.isDefault === 1 ? 1 : 0,
                      price: sku.salePrice,
                      imageUrl: val.specValuePic || '',
                      soldOut: val.soldOut
                    }
                  })
                }
              })

            this.list = Object.values(specMap)

            // ★ 新增：做法项
            this.practiceList = (this.detalilist.sortedPracticeList || []).map(practice => ({
              roundId: practice.practiceId,     // "null_X"
              roundNameCn: practice.practiceName,
              moreChoiceValue: practice.moreChoiceValue,
              isRequired: practice.isRequired,
              itemList: practice.practiceValueList.map(val => ({
                linkId: practice.practiceId,
                productId: val.practiceValueId,
                showNameCn: val.practiceValue,
                defaultSelected: val.isDefault === 1 ? 1 : 0,
                price: val.price
              }))
            }))

            // ★ 按默认选中组合匹配 SKU
            const defaultSelected = []
            this.list.forEach(round => {
              round.itemList.forEach(spec => {
                if (spec.defaultSelected == 1) {
                  defaultSelected.push({ specId: round.roundId, specValueId: spec.productId })
                }
              })
            })
            const matchedSku = this.detalilist.goodsSkuList.find(sku =>
              defaultSelected.length === sku.skuItemList.length &&
              defaultSelected.every(ds =>
                sku.skuItemList.some(i => i.specId === ds.specId && i.specValueId === ds.specValueId)
              )
            )
            this.fullPrice = matchedSku?.salePrice || matchedSku?.channelPrice || this.detalilist.salePrice || 0
            return
          }
          if (this.num1 == 4) {
            this.list = [...res.data.details.optional || [], ...res.data.details.required || []]
            this.list.forEach(item => {
              item.sku_infos.forEach(item2 => {
                if (item2.checked) {
                  this.fullPrice += item2.price
                }
              })
            })
          } else if (this.num1 == 1) {
            this.list = [...res.data.details.optional || [], ...res.data.details.required || []]
            // this.list.forEach(item => {
            //   if(item.id){
            //
            //   }else {
            //     item.sku_infos=[]
            //     item.sku_infos=item
            //   }
            // })
          } else if (this.num1 == 5) {
            this.list = res.data.details.spu_specs
            this.list.forEach(item => {
              item.values.forEach(item2 => {
                if (item2.checked == 1) {
                  this.fullPrice += item2.price
                }
              })
            })
          } else if (this.num1 == 6) {
            this.fullPrice = this.detalilist.product_price
            this.list = res.data.details.specifications
            this.list.forEach(item => {
              item.ingredients.forEach(item2 => {
                if (item2.checked) {
                  this.fullPrice += item2.price
                }
              })
            })
          } else if (this.num1 == 7) {
            this.list = res.data.specItems
            let acquiesce = res.data.firstSku.skusSpecs
            this.fullPrice = this.detalilist.firstSku.standardPrice
            this.list.forEach(item => {
              item.specValueList.forEach(item2 => {
                item2.recommendFlag = 0
                acquiesce.forEach(item3 => {
                  if (item3.specItemName == item.specItemName) {
                    if (item2.value == item3.specItemValue) {
                      item2.recommendFlag = 1
                    }
                  }
                })
              })
            })
            let disableList = res.data.skuCombinList
            this.list.forEach(item => {
              item.specValueList.forEach(item2 => {
                disableList.forEach(item3 => {
                  item3.skusSpecs.forEach(item4 => {
                    if (item2.name == item4.specItemValueName) {
                      item2.disabled = 1
                    }
                  })
                })
              })
            })
            // console.log(this.list)
          } else {
            this.list = [...res.data.details.optional || [], ...res.data.details.required || []]
          }
        } else {
          this.$toast(res.msg)
          // setTimeout(() => {
          //   this.$router.go(-1)
          // }, 1000)
        }
      })
    },
  },
  mounted() {
    // 获取值
    this.num1 = this.$route.query.num1
    this.num2 = this.$route.query.num2
    this.productid = this.$route.query.id
    console.log(this.$route.query.id, "this.$route.query.id==")
    this.storeid = this.$route.query.storeid
    this.flag = this.$route.query.flag
    // 根据num1的值判断调用哪个详情接口
    if (this.flag) {
      if (this.num1 == 1) {
        // 麦当劳
        this.getMDLProductDetailList()
      } else if (this.num1 == 2) {
        // 肯德基
        this.getKFCProductDetailList()
      } else if (this.num1 == 3) {
        // 麦当劳
        this.getBSKProductDetailList()
      }
    } else {
      if (this.num1 == 3) {
        // 麦当劳
        this.getBSKProductDetailList()
      } else {
        this.getgoods_detail()
      }
    }
    // else if (this.num1 == 4) {
    //   // 星巴克
    //   this.getXBKProductDetailList()
    // } else if (this.num1 == 5) {
    //   // 奈雪
    //   this.getNXProductDetailList()
    // }
  },
  created() {
    if (sessionStorage.getItem("goods")) {
      // console.log(JSON.parse(sessionStorage.getItem("goods")));

      this.goods = JSON.parse(sessionStorage.getItem("goods"))
    }
  }
};
</script>

<style scoped lang="less">
//详情图
.productpic {
  background-color: #1B1504;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 15px;
  box-sizing: border-box;

  .detailImg {
    width: 205px;
    //width: 100%;
  }

  .detailImg4 {
    width: 150px;
    margin-top: 10px;
  }
}

//规格
.detail {
  padding: 15px 25px;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  margin-top: -15px;
  position: relative;
  z-index: 12;
  background-color: white;
  padding-bottom: 80px;
  box-sizing: border-box;

  .wrap {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .title {
      font-size: 20px;
      font-weight: bold;
      width: 68%;
    }
  }

  /deep/ .van-stepper__input {
    background-color: rgba(242, 243, 245, 0);
    font-size: 16px;
    color: #0A0A0A;
  }

  /deep/ .van-stepper__minus {
    background-color: rgba(242, 243, 245, 0);
    border-radius: 50%;
    border: 1px solid #CACACA;
    width: 23px;
    height: 23px;
  }

  /deep/ .van-stepper__plus {
    background-color: #FEBB0C;
    border-radius: 50%;
    width: 23px;
    height: 23px;
  }

  .stepper {
    white-space: nowrap;

    /deep/ .van-stepper__minus {
      width: 21px;
      height: 21px;
    }

    /deep/ .van-stepper__plus {
      background-color: #0D6840;
      width: 21px;
      height: 21px;
    }

    /deep/ .van-stepper__plus::after {
      background-color: #fff;
    }

    /deep/ .van-stepper__plus::before {
      background-color: #fff;
    }
  }

  .stepper6 {
    /deep/ .van-stepper__plus {
      background-color: #21286B;
    }
  }

  .listBox {
    margin-top: 18px;

    .listItem {
      margin-top: 15px;

      .listName {
        font-size: 14px;
        color: #9B9B9B;
      }

      .comboProducts {
        display: flex;
        flex-wrap: wrap;
        gap: 13px;
        margin-top: 15px;

        .flexBox {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .product {
          width: 30.6%;
          border-radius: 5px;
          box-sizing: border-box;
          padding: 10px 15px;
          //min-height: 125px;

          .productImg {
            width: 84%;
            height: 45px;
            margin: auto;

            img {
              object-fit: cover;
            }
          }

          .innerName {
            font-size: 14px;
            text-align: center;
            //font-weight: bold;
            margin-top: 5px;

            .quantity {
              font-size: 12px;
              //font-weight: 500;
            }
          }
        }

        .product2 {
          background-color: #F6F6F6;
        }

        .product3 {
          width: 100%;
          background-color: #F6F6F6;
          padding: 5px 21px;
        }

        .product4 {
          color: #999999;
        }

        .stepperBar {
          display: flex;
          align-items: center;
          font-size: 14px;
          justify-content: space-between;
        }
      }

    }
  }
}

//底部按钮
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background-image: linear-gradient(to bottom, #ffffff1f, #ffffffb0);
  z-index: 3000;

  .footerBtn {
    background-color: #3A3A3A;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 86%;
    margin: auto;
    padding-left: 20px;
    box-sizing: border-box;

    .cartIconBox {
      display: flex;
      align-items: center;
      gap: 9px;
      color: #939393;

      .cartIcon {
        width: 34px;
        position: relative;

        .number {
          position: absolute;
          top: -14px;
          left: 31px;
          background-color: #FFD861;
          border-radius: 50%;
          color: #2C2610;
          min-width: 18px;
          min-height: 18px;
          text-align: center;
          line-height: 18px;
          font-size: 15px;
        }
      }

      .cartPrice {
        color: white;

        .priceText {
          font-size: 24px;
        }
      }
    }

    .order {
      text-align: center;
      color: #979797;
      background-color: #6B6B6B;
      border-radius: 50px;
      width: 35%;
      height: 100%;
      padding: 3px 0px;
      font-weight: bold;

      .orderText {
        font-size: 12px;
        margin-top: 2px;
      }
    }

    .order2 {
      background-color: #FFD861;
      color: #3E3418;
    }
  }

  .footerBtn2 {
    background-color: #D42B1D;
  }

  .footerBtn3 {
    background-color: #0E6941;
  }

  .footerBtn6 {
    background-color: #21286B;
  }
}
</style>
