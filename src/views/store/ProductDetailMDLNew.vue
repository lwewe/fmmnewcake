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

      <div class="listBox" v-if="list.length > 0">
        <!-- 四宫格自提：已选提示 -->
        <div v-if="num1 == 4 && !flag" class="selectTip">
          已选 {{ selectedCount }}/{{ maxCount }}
          <span v-if="selectedCount < minCount" class="tipWarn">
            （还差 {{ minCount - selectedCount }} 件）
          </span>
        </div>

        <div v-for="(item, index) in list" :key="index" class="listItem">
          <div class="listName">{{ item.name || item.roundNameCn || item.attrName || item.product_name
            || item.specItemName }}</div>
          <div class="comboProducts">
            <div
              v-for="(item2, index2) in num1 == 3 ? item.itemList : num1 == 2 && detalilist.isMultiSpec == 1 ? item.itemList : item.sku_infos ? item.sku_infos : num1 == 6 ? item.ingredients : num1 == 7 ? item.specValueList : item.values ? item.values : num1 == 1 && flag ? item.comboProducts : num1 == 2 && flag ? item.condimentItemList : 1"
              class="product"
              :class="{ product2: (item2.isDefault == 1 || item2.defaultSelected == 1 || item2.is_default == 1 || item2.checked == 1 || item2.recommendFlag == 1 || item.product_name) && item.display_type != 'bar', product3: num1 == 4 && item.display_type == 'bar', product4: !item2.disabled && num1 == 7 }"
              :key="index2" @click="changeSelect(item, index, item2, index2)">
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
                  <span v-if="num1 == 4 && !flag && item2.price" class="diffPrice" style="display: none;">
                    {{ item2.price > 0 ? '+' : '' }}{{ item2.price }}元
                  </span>
                </div>
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
        <div class="order order2" :class="{ orderDisabled: num1 == 4 && !flag && selectedCount < minCount }"
          @click="addshopcar">
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
      num1: 0,
      num2: 0,
      productid: "",
      storeid: "",
      detalilist: [],
      list: [],
      shopcar: [],
      goods: [],
      count: 1,
      costprice: 0,
      loadingflag: true,
      fullPrice: 0,
      channelFullPrice: 0,   // ★ 新增：实际结算价（成本）
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
  computed: {
    selectedCount() {
      if (this.num1 != 4 || this.flag) return 0
      let n = 0
      this.list.forEach(item => {
        const arr = item.sku_infos || item.comboProducts || []
        arr.forEach(s => {
          if (s.checked === true || s.checked === 1) n++
        })
      })
      return n
    },
    minCount() {
      if (this.num1 != 4 || this.flag) return 0
      return this.list[0]?.selectMinCount || 4
    },
    maxCount() {
      if (this.num1 != 4 || this.flag) return 0
      return this.list[0]?.selectMaxCount || 4
    }
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
    // ★ 重算 channelFullPrice（麦当劳自提/四宫格自提都可用）
    calcChannelFullPrice() {
      let base = this.detalilist.salePrice
        || this.detalilist.product_price
        || this.detalilist.price
        || 0
      this.list.forEach(item => {
        const arr = item.sku_infos || item.comboProducts || []
        arr.forEach(s => {
          if (s.checked === true || s.checked === 1) {
            base += Number(s.channelPrice || 0)
          }
        })
      })
      this.channelFullPrice = Math.round(base * 100) / 100
    },
    changValue(item2, item) {
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
          this.accessories.push(item2.skuCode)
          this.accessoriesText.push(item2.name)
        }
      })
    },
    changeSelect(item, index, item2, index2) {
      if (this.num1 == 2) {
        if (this.detalilist.menuFlag == 2) {
          this.list.forEach((item3, index3) => {
            item3.condimentItemList.forEach((item4, index4) => {
              if (index == index3) {
                item4.defaultSelected = 0
              }
            })
          })
          item2.defaultSelected = 1
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
            this.list.forEach(round => {
              if (round.roundId === item.roundId) {
                round.itemList.forEach(s => s.defaultSelected = 0)
              }
            })
            item2.defaultSelected = 1

            const selected = []
            this.list.forEach(round => {
              round.itemList.forEach(spec => {
                if (spec.defaultSelected == 1) selected.push(spec.showNameCn)
              })
            })

            const matched = this.detalilist.goodsSkuList.find(sku => {
              const values = sku.skuItemList.map(i => i.specValue)
              return selected.length === values.length && selected.every(s => values.includes(s))
            })

            if (matched) {
              this.fullPrice = matched.salePrice || matched.channelPrice
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
      else if (this.num1 == 1) {
        if (this.flag) {
          this.list.forEach(item3 => {
            item3.comboProducts.forEach(item4 => {
              if (item.choicesCode == item3.choicesCode) item4.isDefault = 0
            })
          })
          item2.isDefault = 1
        } else {
          this.fullPrice = this.detalilist.salePrice
          this.list.forEach(item3 => {
            if (item3.sku_infos) {
              item3.sku_infos.forEach(item4 => {
                if (item.id == item3.id && item.name == item3.name && item4.name) {
                  this.$set(item4, 'checked', false)
                }
              })
            }
          })
          if (item2.name) this.$set(item2, 'checked', true)
          this.list.forEach(item3 => {
            if (item3.sku_infos) {
              item3.sku_infos.forEach(item4 => {
                if (item4.checked && item4.name) {
                  this.fullPrice += Number(item4.price || 0)
                }
              })
            }
          })
          this.calcChannelFullPrice()
        }
      }
      // ===== 四宫格：只对自提生效 =====
      else if (this.num1 == 4 && !this.flag) {
        const isChecked = item2.checked === true || item2.checked === 1

        if (isChecked) {
          this.$set(item2, 'checked', false)
        } else {
          let count = 0
          this.list.forEach(item3 => {
            const arr = item3.sku_infos || item3.comboProducts || []
            arr.forEach(s => {
              if (s.checked === true || s.checked === 1) count++
            })
          })
          if (count >= this.maxCount) {
            this.$toast(`最多选 ${this.maxCount} 件`)
            return
          }
          this.$set(item2, 'checked', true)
        }

        this.fullPrice = this.detalilist.salePrice
          || this.detalilist.product_price
          || this.detalilist.price
          || 0

        this.list.forEach(item3 => {
          const arr = item3.sku_infos || item3.comboProducts || []
          arr.forEach(s => {
            if ((s.checked === true || s.checked === 1) && s.price) {
              this.fullPrice += Number(s.price)
            }
          })
        })
        this.fullPrice = Math.round(this.fullPrice * 100) / 100

        // ★ 同步算 channelFullPrice
        this.calcChannelFullPrice()
      }
      // ===== 四宫格外卖：保持原逻辑 =====
      else if (this.num1 == 4 && this.flag) {
        this.fullPrice = this.detalilist.salePrice
        this.list.forEach(item3 => {
          if (item3.sku_infos) {
            item3.sku_infos.forEach(item4 => {
              if (item.id == item3.id && item.name == item3.name && item4.name) {
                this.$set(item4, 'checked', false)
              }
            })
          }
        })
        if (item2.name) this.$set(item2, 'checked', true)
        this.list.forEach(item3 => {
          if (item3.sku_infos) {
            item3.sku_infos.forEach(item4 => {
              if (item4.checked && item4.name) this.fullPrice += item4.price
            })
          }
        })
        this.calcChannelFullPrice()   // ★ 新增
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
    addshopcar() {
      // 四宫格自提校验
      if (this.num1 == 4 && !this.flag) {
        let count = 0
        this.list.forEach(item => {
          const arr = item.sku_infos || item.comboProducts || []
          arr.forEach(s => {
            if (s.checked === true || s.checked === 1) count++
          })
        })
        if (count < this.minCount) {
          this.$toast(`请选满 ${this.minCount} 件`)
          return
        }
        if (count > this.maxCount) {
          this.$toast(`最多选 ${this.maxCount} 件`)
          return
        }
      }

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

      var all = ""
      // ★ 新增：麦当劳自取 selected 组装
      var selected = []
      var allProducts = []

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
          // ★ 自提：跳过 required，组装 selected（num1==1 和 num1==4 都组装）
          this.list.forEach(item => {
            if (!item.sku_infos || !item.id) return
            item.sku_infos.forEach(item2 => {
              const isChecked = item2.checked === true || item2.checked === 1
              if (isChecked) {
                all += (item2.name || item2.product_name) + "/"
                allProducts.push({
                  linkId: item.id,
                  productId: String(item2.id),
                  quantity: item2.amount || item2.number || 1
                })
              }
            })
          })
        }
      }
      else if (this.num1 == 2) {
        var selected2 = []
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

        if (this.detalilist.isMultiSpec == 1) {
          const selectedSpecs = []
          this.list.forEach(round => {
            round.itemList.forEach(spec => {
              if (spec.defaultSelected == 1) {
                all += spec.showNameCn + "/"
                selectedSpecs.push(spec.showNameCn)
                selected2.push({
                  roundId: round.roundId,
                  linkId: round.roundId,
                  productId: spec.showNameCn,
                  quantity: 1
                })
              }
            })
          })

          let matchedSku = this.detalilist.goodsSkuList.find(sku => {
            const values = sku.skuItemList.map(item => item.specValue)
            return selectedSpecs.every(spec => values.includes(spec))
          })

          if (matchedSku) {
            this.fullPrice = matchedSku.salePrice || matchedSku.channelPrice
          }
          this.detalilist.selected = selected2
          this.detalilist.linkId = matchedSku?.skuId || this.detalilist.goodsSkuList?.[0]?.skuId || this.productid
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
                  if (item4.code == item2.spec_code) {
                    item2.checked = 1
                  }
                })
              })
            } else {
              this.detalilist.details.sku_infos.forEach(item => {
                item.specs.forEach(item2 => {
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
        this.list.forEach(item => {
          item.values.forEach(item2 => {
            if (item2.checked == 1) {
              all += item2.name + "+"
            }
          })
        })
      } else if (this.num1 == 6) {
        this.list.forEach(item => {
          item.ingredients.forEach(item2 => {
            if (item2.checked == 1) {
              all += item2.name + "+"
            }
          })
        })
      } else if (this.num1 == 7) {
        this.list.forEach(item => {
          item.specValueList.forEach(item2 => {
            if (item2.recommendFlag == 1) {
              all += item2.name + "+"
            }
          })
        })
      }

      // ★ 麦当劳自取：selected 只 push 一次，products 拍平
      if ((this.num1 == 1 || this.num1 == 4) && allProducts.length > 0) {
        selected.push({
          round: 0,
          products: allProducts
        })
      }

      all = (all + this.accessoriesText.join('+')).slice(0, -1)

      // ★ push 前重算 channelFullPrice
      if (this.num1 == 1 || this.num1 == 4) {
        this.calcChannelFullPrice()
      }

      if (this.goods.filter(item => item.specifications == all && item.fullPrice == this.fullPrice).length > 0) {
        this.goods.filter(item => item.specifications == all && item.fullPrice == this.fullPrice).forEach(item => {
          item.count += this.count
        })
      } else {
        this.goods.push({
          storeid: this.storeid,
          specifications: all,
          detail: this.detalilist,
          selected: selected,          // ★ 新增
          channelFullPrice: this.channelFullPrice,   // ★ 新增
          fullPrice: Math.round(this.fullPrice * 100) / 100,
          count: this.count,
          accessories: this.accessories.length > 0 ? this.accessories : [],
          skuId: this.skuId,
          skuCode: matchedSkuCode
        })
      }
      sessionStorage.setItem("goods", JSON.stringify(this.goods))
      if (sessionStorage.getItem("goods")) {
        this.$toast("加入成功")
        setTimeout(() => {
          this.$router.go(-1)
        }, 800)
      }
    },
    getMDLProductDetailList() {
      let data = {
        apikey: this.$store.state.appkey,
        storeCode: this.storeid,
        productId: this.productid
      }
      getMDLProductDetail(data).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.detalilist = res.data
          this.list = this.detalilist.comboItems
          this.fullPrice = this.detalilist.price
        } else {
          this.$toast(res.msg)
          setTimeout(() => {
            this.$router.go(-1)
          }, 1500)
        }
      })
    },
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
        } else {
          this.$toast(res.msg)
          setTimeout(() => {
            this.$router.go(-1)
          }, 1500)
        }
      })
    },
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
          this.detalilist = res.data
          this.list = this.detalilist.roundList
          this.fullPrice = this.detalilist.price
        } else {
          this.$toast(res.msg)
          setTimeout(() => {
            this.$router.go(-1)
          }, 1500)
        }
      })
    },
    getgoods_detail() {
      getgoods_detail({
        shopId: this.storeid,
        productId: this.productid
      }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          // 肯德基自提，走回 KFC 详情接口
          if (this.num1 == 2) {
            this.getKFCProductDetailList()
            return
          }
          // 只在本地调试时打开，测完删掉

          // ========== 🧪 mock 结束 =========
          this.detalilist = res.data
          this.fullPrice = this.detalilist.salePrice || 0

          // 兜底：只有「1 个组」且「selectMinCount >= 2」的才是四宫格（只对麦当劳自提）
          if (this.num1 == 1 && !this.flag) {
            const optional = res.data.details?.optional || []
            const required = res.data.details?.required || []
            const groups = [...optional, ...required]

            if (groups.length === 1) {
              const g = groups[0]
              if (g.selectMinCount >= 2 && g.selectMaxCount >= 2) {
                this.num1 = 4
              }
            }
          }

          if (this.num1 == 4 && !this.flag) {
            this.list = [...res.data.details.optional || [], ...res.data.details.required || []]

            // ★ 让 checked 变成响应式
            this.list.forEach(item => {
              const arr = item.sku_infos || item.comboProducts || []
              arr.forEach(s => {
                this.$set(s, 'checked', s.checked === true || s.checked === 1)
              })
            })

            this.fullPrice = this.detalilist.salePrice
              || this.detalilist.product_price
              || this.detalilist.price
              || 0
            this.list.forEach(item => {
              const arr = item.sku_infos || item.comboProducts || []
              arr.forEach(item2 => {
                if ((item2.checked === true || item2.checked === 1) && item2.price) {
                  this.fullPrice += Number(item2.price)
                }
              })
            })
            this.fullPrice = Math.round(this.fullPrice * 100) / 100

            // ★ 算 channelFullPrice
            this.calcChannelFullPrice()
          } else if (this.num1 == 4 && this.flag) {
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
            // ★ 让 checked 响应式，并算 channelFullPrice
            this.list.forEach(item => {
              const arr = item.sku_infos || []
              arr.forEach(s => {
                this.$set(s, 'checked', s.checked === true || s.checked === 1)
              })
            })
            this.calcChannelFullPrice()
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
          } else {
            this.list = [...res.data.details.optional || [], ...res.data.details.required || []]
          }
        } else {
          this.$toast(res.msg)
        }
      })
    },
  },
  mounted() {
    this.num1 = this.$route.query.num1
    this.num2 = this.$route.query.num2
    this.productid = this.$route.query.id
    this.storeid = this.$route.query.storeid
    this.flag = this.$route.query.flag

    if (this.flag) {
      if (this.num1 == 1) {
        this.getMDLProductDetailList()
      } else if (this.num1 == 2) {
        this.getKFCProductDetailList()
      } else if (this.num1 == 3) {
        this.getBSKProductDetailList()
      }
    } else {
      if (this.num1 == 3) {
        this.getBSKProductDetailList()
      } else {
        this.getgoods_detail()
      }
    }
  },
  created() {
    if (sessionStorage.getItem("goods")) {
      this.goods = JSON.parse(sessionStorage.getItem("goods"))
    }
  }
};
</script>

<style scoped lang="less">
/* 样式不变，保持你原来的即可 */
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
  }

  .detailImg4 {
    width: 150px;
    margin-top: 10px;
  }
}

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
            margin-top: 5px;

            .quantity {
              font-size: 12px;
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

.selectTip {
  font-size: 14px;
  color: #9B9B9B;
  margin-bottom: 10px;

  .tipWarn {
    color: #D42B1D;
  }
}

.diffPrice {
  font-size: 12px;
  color: #D42B1D;
  margin-left: 4px;
}

.orderDisabled {
  background-color: #CCCCCC !important;
  color: #999999 !important;
  pointer-events: none;
}
</style>