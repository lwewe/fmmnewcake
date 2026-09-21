<template>
  <div class="productdetail">
    <NProgress v-if="loadingflag" />
    <ReturnBack :rcolor="'#fff'" :bcolor="'rgba(218,218,218,0.26)'"></ReturnBack>
    
    <!-- 详情图 -->
    <div class="productpic">
      <div class="detailImg">
        <img class="img"
          :src="detalilist.goodsImage ? 'https:' + detalilist.goodsImage : detalilist.imageUrl || detalilist.product_img || detalilist.detailImgUrl || detalilist.image || detalilist.img"
          alt="">
      </div>
    </div>
    
    <div class="detail">
      <div class="wrap">
        <div class="title">{{ detalilist.goodsName }}</div>
        <div class="priceInfo">
          <span class="salesPrice">￥{{ (currentTotalPrice / 100).toFixed(2) }}</span>
          <span class="originalPrice" v-if="originalPrice > currentTotalPrice">
            ￥{{ (originalPrice / 100).toFixed(2) }}
          </span>
        </div>
        <div>
          <van-stepper theme="round" v-model="count" button-size="22" disable-input />
        </div>
      </div>

      

      

      <!-- 规格列表 -->
      <div class="specsContainer" v-if="filteredSpecs && filteredSpecs.length > 0">
        <div v-for="spec in filteredSpecs" :key="spec.specId" class="specItem">
          <div class="specHeader">
            <span class="specName">{{ spec.specName }}</span>
            <span class="specTip">{{ getSpecTipText(spec) }}</span>
            <span class="requiredTip" v-if="spec.isSkuIncluded">(必选)</span>
          </div>
          
          <!-- 单选规格（specType=2） -->
          <div v-if="spec.specType === 2" class="optionsContainer">
            <div 
              v-for="option in getFilteredOptions(spec)" 
              :key="option.optionId"
              class="optionItem"
              :class="{
                'selected': isOptionSelected(spec, option),
                'disabled': option.disabled
              }"
              @click="handleOptionClick(spec, option)"
            >
              <div class="optionName">{{ option.optionName }}</div>
              <div v-if="option.addPrice > 0" class="addPrice">
                +￥{{ (option.addPrice / 100).toFixed(2) }}
              </div>
            </div>
          </div>
          
          <!-- 已包含规格（specType=0或1） -->
          <div v-else-if="spec.specType === 0 || spec.specType === 1" class="optionsContainer">
            <div 
              v-for="option in getFilteredOptions(spec)" 
              :key="option.optionId"
              class="optionItem"
              :class="{
                'selected': isOptionSelected(spec, option),
                'disabled': option.disabled
              }"
              @click="handleOptionClick(spec, option)"
            >
              <div class="optionName">{{ option.optionName }}</div>
              <div v-if="option.addPrice > 0" class="addPrice">
                +￥{{ (option.addPrice / 100).toFixed(2) }}
              </div>
            </div>
          </div>
          
          <!-- 多选规格 -->
          <div v-else-if="spec.specType === 3" class="optionsContainer">
            <div 
              v-for="option in getFilteredOptions(spec)" 
              :key="option.optionId"
              class="optionItem"
              :class="{
                'selected': isMultiSelected(spec, option),
                'disabled': option.disabled || !canSelectMore(spec)
              }"
              @click="handleMultiSelect(spec, option)"
            >
              <div class="optionName">{{ option.optionName }}</div>
              <div v-if="option.addPrice > 0" class="addPrice">
                +￥{{ (option.addPrice / 100).toFixed(2) }}
              </div>
              <!-- 数量选择器（如果需要） -->
              <div v-if="isMultiSelected(spec, option) && option.quantity > 1" class="quantityControl">
                <van-stepper 
                  v-model="selectedMultiOptions[spec.specId][option.optionId]" 
                  :min="option.minQuantity || 1" 
                  :max="option.maxQuantity || 10"
                  button-size="16"
                  disable-input
                  @change="handleQuantityChange(spec, option)"
                />
              </div>
            </div>
            <div class="multiSelectInfo" v-if="spec.minQuantity > 0 || spec.maxQuantity > 0">
              已选择 {{ getSelectedCount(spec) }} 个
              <span v-if="spec.minQuantity > 0">（至少选{{ spec.minQuantity }}个）</span>
              <span v-if="spec.maxQuantity > 0">（最多选{{ spec.maxQuantity }}个）</span>
            </div>
          </div>
          
          <!-- 可选规格 -->
          <div v-else-if="spec.specType === 4" class="optionalSpec">
            <div 
              v-for="option in getFilteredOptions(spec)" 
              :key="option.optionId"
              class="optionItem"
              :class="{
                'selected': isOptionSelected(spec, option),
                'disabled': option.disabled
              }"
              @click="handleOptionalSelect(spec, option)"
            >
              <div class="optionName">{{ option.optionName }}</div>
              <div v-if="option.addPrice > 0" class="addPrice">
                +￥{{ (option.addPrice / 100).toFixed(2) }}
              </div>
              <div v-if="isOptionSelected(spec, option)" class="optionalClose" @click.stop="removeOptionalSelection(spec)">
                ×
              </div>
            </div>
          </div>
          
          <!-- 数量选择规格 -->
          <div v-else-if="spec.specType === 5" class="quantitySpec">
            <div 
              v-for="option in getFilteredOptions(spec)" 
              :key="option.optionId"
              class="quantityOption"
              :class="{ 'selected': isQuantitySelected(spec, option) }"
            >
              <div class="optionInfo">
                <div class="optionName">{{ option.optionName }}</div>
                <div v-if="option.addPrice > 0" class="addPrice">
                  +￥{{ (option.addPrice / 100).toFixed(2) }}
                </div>
              </div>
              <div class="quantityStepper">
                <van-stepper 
                  v-model="selectedQuantities[spec.specId][option.optionId]"
                  :min="option.minQuantity || 0"
                  :max="option.maxQuantity || 10"
                  button-size="16"
                  disable-input
                  @change="handleQuantitySelect(spec, option)"
                />
              </div>
            </div>
            <div class="quantityInfo" v-if="spec.minQuantity > 0 || spec.maxQuantity > 0">
              总数 {{ getTotalQuantity(spec) }}
              <span v-if="spec.minQuantity > 0">（至少{{ spec.minQuantity }}）</span>
              <span v-if="spec.maxQuantity > 0">（最多{{ spec.maxQuantity }}）</span>
            </div>
          </div>
        </div>
      </div>


<!-- 当前选择的规格信息 - 移动到商品描述前面 -->
      <div v-if="selectedSpecsText.length > 0" class="selectedSpecsInfo">
        <div class="infoTitle">已选择：</div>
        <div class="specsText">{{ selectedSpecsText }}</div>
      </div>
      <!-- 商品描述 - 移到规格列表前面 -->
      <div class="goodsDesc" v-if="detalilist.goodsDesc">
        <div class="descTitle">商品描述</div>
        <div class="descContent" v-html=" detalilist.goodsDesc "> </div>
      </div>

    </div>
    
    <!-- 底部按钮 -->
    <div class="footer">
      <div class="footerBtn">
        <div class="cartIconBox">
          <div class="cartIcon">
            <img class="img" src="../../assets/backimage/Vector-1.png" alt="">
          </div>
          <div class="cartPrice">
            ￥<span class="priceText">{{ ((currentTotalPrice * count) / 100).toFixed(2) }}</span>
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
import { CateringGoodsdetail,DetailCheckgoods } from "@/api/service"

export default {
  data() {
    return {
      num1: 0,
      num2: 0,
      productid: "",
      storeid: "",
      detalilist: [],
      goods: [],
      count: 1,
      loadingflag: true,
      
      // 规格相关数据
      originalList: [], // 原始规格数据
      filteredSpecs: [], // 过滤后的规格数据
      selectedSpecs: {}, // 单选/包含选择 {specId: optionId}
      selectedMultiOptions: {}, // 多选选择 {specId: {optionId: quantity}}
      selectedQuantities: {}, // 数量选择 {specId: {optionId: quantity}}
      optionalSelections: {}, // 可选规格选择 {specId: optionId}
      
      // SKU相关
      currentSku: null,
      skuOptions: {},
      originalPrice: 0,
      salesPrice: 0,
      
      // 价格计算
      baseSkuPrice: 0,
      extraPrice: 0,
      currentTotalPrice: 0,
      
      // 其他
      categoryCodes: '',
    };
  },
  computed: {
    // 获取已选择的规格文本 - 优化计算属性，添加依赖项
    selectedSpecsText() {
      const texts = [];
      
      if (!this.filteredSpecs || this.filteredSpecs.length === 0) {
        return '';
      }
      
      // 为每个规格类型添加明确的依赖项
      this.filteredSpecs.forEach(spec => {
        if (spec.specType === 0 || spec.specType === 1 || spec.specType === 2) {
          // 单选/包含/单选规格 - 依赖于selectedSpecs
          const optionId = this.selectedSpecs[spec.specId];
          if (optionId) {
            const option = spec.options.find(opt => opt.optionId === optionId);
            if (option) {
              texts.push(`${spec.specName}: ${option.optionName}`);
            }
          }
        } else if (spec.specType === 3) {
          // 多选 - 依赖于selectedMultiOptions
          const selected = this.selectedMultiOptions[spec.specId];
          if (selected && Object.keys(selected).length > 0) {
            const optionNames = [];
            Object.entries(selected).forEach(([optionId, quantity]) => {
              if (quantity > 0) {
                const option = spec.options.find(opt => opt.optionId === optionId);
                if (option) {
                  optionNames.push(`${option.optionName}×${quantity}`);
                }
              }
            });
            if (optionNames.length > 0) {
              texts.push(`${spec.specName}: ${optionNames.join('、')}`);
            }
          }
        } else if (spec.specType === 4) {
          // 可选 - 依赖于optionalSelections
          const optionId = this.optionalSelections[spec.specId];
          if (optionId) {
            const option = spec.options.find(opt => opt.optionId === optionId);
            if (option) {
              texts.push(`${spec.specName}: ${option.optionName}`);
            }
          }
        } else if (spec.specType === 5) {
          // 数量选择 - 依赖于selectedQuantities
          const quantities = this.selectedQuantities[spec.specId];
          if (quantities) {
            const optionNames = [];
            Object.entries(quantities).forEach(([optionId, quantity]) => {
              if (quantity > 0) {
                const option = spec.options.find(opt => opt.optionId === optionId);
                if (option) {
                  optionNames.push(`${option.optionName}×${quantity}`);
                }
              }
            });
            if (optionNames.length > 0) {
              texts.push(`${spec.specName}: ${optionNames.join('、')}`);
            }
          }
        }
      });
      
      return texts.join('；');
    }
  },
  watch: {
    count() {
      // count变化时更新显示的总价
    },
    // 监听选择变化，确保selectedSpecsText更新
    selectedSpecs: {
      handler() {
        // 强制计算属性更新
        this.$forceUpdate();
      },
      deep: true
    },
    selectedMultiOptions: {
      handler() {
        this.$forceUpdate();
      },
      deep: true
    },
    selectedQuantities: {
      handler() {
        this.$forceUpdate();
      },
      deep: true
    },
    optionalSelections: {
      handler() {
        this.$forceUpdate();
      },
      deep: true
    }
  },
  methods: {
    // 获取规格提示文本
    getSpecTipText(spec) {
      const tips = {
        0: '(未知)',
        1: '(已包含)',
        2: '(单选)',
        3: '(多选)',
        4: '(可选)',
        5: '(数量选择)'
      };
      return tips[spec.specType] || '';
    },
    
    // 获取过滤后的选项（处理互斥关系）
    getFilteredOptions(spec) {
      return spec.options.filter(option => !option.disabled);
    },
    
    // 判断选项是否被选中（单选/包含）
    isOptionSelected(spec, option) {
      return this.selectedSpecs[spec.specId] === option.optionId;
    },
    
    // 判断多选选项是否被选中
    isMultiSelected(spec, option) {
      const selected = this.selectedMultiOptions[spec.specId];
      return selected && selected[option.optionId] > 0;
    },
    
    // 判断数量选择是否被选中
    isQuantitySelected(spec, option) {
      const quantities = this.selectedQuantities[spec.specId];
      return quantities && quantities[option.optionId] > 0;
    },
    
    // 获取已选择的数量（多选）
    getSelectedCount(spec) {
      const selected = this.selectedMultiOptions[spec.specId];
      if (!selected) return 0;
      return Object.values(selected).reduce((sum, qty) => sum + qty, 0);
    },
    
    // 获取总数量（数量选择）
    getTotalQuantity(spec) {
      const quantities = this.selectedQuantities[spec.specId];
      if (!quantities) return 0;
      return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
    },
    
    // 是否可以继续选择（多选）
    canSelectMore(spec) {
      const currentCount = this.getSelectedCount(spec);
      return spec.maxQuantity ? currentCount < spec.maxQuantity : true;
    },
    
    // 处理选项点击（单选规格，包括specType=2）
    handleOptionClick(spec, option) {
      if (option.disabled) return;
      
      console.log('选择规格:', spec.specName, option.optionName);
      
      // 更新选择 - 使用Vue.set确保响应式更新
      this.$set(this.selectedSpecs, spec.specId, option.optionId);
      
      // 处理互斥关系
      this.handleExclusiveRelations(spec, option);
      
      // 更新SKU和价格
      this.updateSkuAndPrice();
      
      // 强制更新视图
      this.$forceUpdate();
      
      console.log('更新后选择:', this.selectedSpecs);
    },
    
    // 处理多选
    handleMultiSelect(spec, option) {
      if (option.disabled) return;
      
      // 初始化数据结构
      if (!this.selectedMultiOptions[spec.specId]) {
        this.$set(this.selectedMultiOptions, spec.specId, {});
      }
      
      const currentQuantity = this.selectedMultiOptions[spec.specId][option.optionId] || 0;
      const currentCount = this.getSelectedCount(spec);
      
      if (currentQuantity > 0) {
        // 取消选择 - 使用Vue.delete确保响应式更新
        this.$delete(this.selectedMultiOptions[spec.specId], option.optionId);
      } else {
        // 检查是否可以继续选择
        if (spec.maxQuantity && currentCount >= spec.maxQuantity) {
          this.$toast(`最多只能选择${spec.maxQuantity}个选项`);
          return;
        }
        // 选择（默认数量为1）
        this.$set(this.selectedMultiOptions[spec.specId], option.optionId, option.minQuantity || 1);
      }
      
      // 处理互斥关系
      this.handleExclusiveRelations(spec, option);
      
      // 更新价格
      this.updatePrice();
      
      this.$forceUpdate();
    },
    
    // 处理可选规格
    handleOptionalSelect(spec, option) {
      if (option.disabled) return;
      
      const currentSelection = this.optionalSelections[spec.specId];
      if (currentSelection === option.optionId) {
        // 取消选择
        this.$delete(this.optionalSelections, spec.specId);
      } else {
        // 选择
        this.$set(this.optionalSelections, spec.specId, option.optionId);
      }
      
      // 更新价格
      this.updatePrice();
      
      this.$forceUpdate();
    },
    
    // 移除可选选择
    removeOptionalSelection(spec) {
      this.$delete(this.optionalSelections, spec.specId);
      this.updatePrice();
      this.$forceUpdate();
    },
    
    // 处理数量变化（多选）
    handleQuantityChange(spec, option) {
      const currentCount = this.getSelectedCount(spec);
      
      // 检查规格数量限制
      if (spec.maxQuantity && currentCount > spec.maxQuantity) {
        this.$toast(`总数不能超过${spec.maxQuantity}`);
        // 恢复之前的值
        this.$nextTick(() => {
          this.$set(this.selectedMultiOptions[spec.specId], option.optionId, 
            Math.min(this.selectedMultiOptions[spec.specId][option.optionId], spec.maxQuantity - (currentCount - this.selectedMultiOptions[spec.specId][option.optionId])));
        });
        return;
      }
      
      if (spec.minQuantity && currentCount < spec.minQuantity) {
        this.$toast(`至少需要选择${spec.minQuantity}个`);
      }
      
      // 更新价格
      this.updatePrice();
      
      this.$forceUpdate();
    },
    
    // 处理数量选择规格
    handleQuantitySelect(spec, option) {
      const totalQuantity = this.getTotalQuantity(spec);
      
      // 检查规格数量限制
      if (spec.maxQuantity && totalQuantity > spec.maxQuantity) {
        this.$toast(`总数不能超过${spec.maxQuantity}`);
        // 恢复之前的值
        this.$nextTick(() => {
          this.$set(this.selectedQuantities[spec.specId], option.optionId, 
            Math.min(this.selectedQuantities[spec.specId][option.optionId], spec.maxQuantity - (totalQuantity - this.selectedQuantities[spec.specId][option.optionId])));
        });
        return;
      }
      
      if (spec.minQuantity && totalQuantity < spec.minQuantity) {
        this.$toast(`至少需要选择${spec.minQuantity}个`);
      }
      
      // 检查选项数量限制
      const currentQty = this.selectedQuantities[spec.specId][option.optionId];
      if (option.maxQuantity && currentQty > option.maxQuantity) {
        this.$toast(`${option.optionName}最多只能选择${option.maxQuantity}个`);
        this.$nextTick(() => {
          this.$set(this.selectedQuantities[spec.specId], option.optionId, option.maxQuantity);
        });
        return;
      }
      
      if (option.minQuantity && currentQty < option.minQuantity) {
        this.$toast(`${option.optionName}至少需要选择${option.minQuantity}个`);
      }
      
      // 更新价格
      this.updatePrice();
      
      this.$forceUpdate();
    },
    
    // 处理互斥关系
    handleExclusiveRelations(currentSpec, currentOption) {
      if (!currentOption.exclusives || currentOption.exclusives.length === 0) {
        return;
      }
      
      currentOption.exclusives.forEach(exclusive => {
        if (exclusive.exclusiveEnum === 1) {
          // 互斥选项禁用
          if (exclusive.isSpecExclusive) {
            // 整个规格互斥
            this.filteredSpecs = this.filteredSpecs.filter(spec => 
              spec.specId !== exclusive.specId
            );
          } else {
            // 特定选项互斥
            this.filteredSpecs.forEach(spec => {
              if (spec.specId === exclusive.specId) {
                spec.options.forEach(option => {
                  if (exclusive.optionIds.includes(option.optionId)) {
                    option.disabled = true;
                  }
                });
              }
            });
          }
        } else if (exclusive.exclusiveEnum === 2) {
          // 互斥选项过滤
          // 这里需要根据业务逻辑实现
        }
      });
    },
    
    // 初始化选择状态
    initSelections() {
      // 初始化数据结构
      this.selectedSpecs = {};
      this.selectedMultiOptions = {};
      this.selectedQuantities = {};
      this.optionalSelections = {};
      
      this.filteredSpecs.forEach(spec => {
        // 初始化默认选择
        const defaultOption = spec.options.find(opt => opt.isDefault);
        if (defaultOption) {
          // 处理所有规格类型
          this.$set(this.selectedSpecs, spec.specId, defaultOption.optionId);
          
          // 额外处理其他类型的数据结构
          if (spec.specType === 3) {
            // 多选
            if (!this.selectedMultiOptions[spec.specId]) {
              this.$set(this.selectedMultiOptions, spec.specId, {});
            }
            this.$set(this.selectedMultiOptions[spec.specId], defaultOption.optionId, 
              defaultOption.minQuantity || 1);
          } else if (spec.specType === 4) {
            // 可选
            this.$set(this.optionalSelections, spec.specId, defaultOption.optionId);
          } else if (spec.specType === 5) {
            // 数量选择
            if (!this.selectedQuantities[spec.specId]) {
              this.$set(this.selectedQuantities, spec.specId, {});
            }
            this.$set(this.selectedQuantities[spec.specId], defaultOption.optionId, 
              defaultOption.minQuantity || 1);
          }
        } else if (spec.options.length > 0) {
          // 如果没有默认选项，选择第一个
          this.$set(this.selectedSpecs, spec.specId, spec.options[0].optionId);
        }
        
        // 初始化数据结构（即使没有默认选项）
        if (spec.specType === 3 && !this.selectedMultiOptions[spec.specId]) {
          this.$set(this.selectedMultiOptions, spec.specId, {});
        }
        if (spec.specType === 5 && !this.selectedQuantities[spec.specId]) {
          this.$set(this.selectedQuantities, spec.specId, {});
        }
      });
      
      console.log('初始化选择:', this.selectedSpecs);
    },
    
    // 构建SKU映射
    buildSkuMapping() {
      this.skuOptions = {};
      if (this.detalilist.skus) {
        this.detalilist.skus.forEach(sku => {
          // 创建一个唯一的key，用于快速查找SKU
          if (sku.specIds && sku.specIds.length > 0) {
            const key = sku.specIds.map(item => `${item.specId}_${item.optionId}`).sort().join('|');
            this.skuOptions[key] = {
              skuId: sku.id,
              skuName: sku.skuName,
              price: sku.price,
              specIds: sku.specIds
            };
          } else {
            // 对于没有specIds的SKU，使用特殊key
            this.skuOptions['no_specs'] = {
              skuId: sku.id,
              skuName: sku.skuName,
              price: sku.price,
              specIds: []
            };
          }
        });
      }
      console.log('SKU映射:', this.skuOptions);
    },
    
    // 查找初始SKU
     // 查找初始SKU
findInitialSku() {
  console.log('查找初始SKU，当前filteredSpecs:', this.filteredSpecs);
  
  // 直接使用第一个SKU，因为您的商品只有一个SKU且specIds为null
  if (this.detalilist.skus && this.detalilist.skus.length > 0) {
    const firstSku = this.detalilist.skus[0];
    this.currentSku = {
      skuId: firstSku.id,
      skuName: firstSku.skuName,
      price: firstSku.price,
      costPrice: firstSku.costPrice
    };
    this.baseSkuPrice = firstSku.price;
    this.currentTotalPrice = this.baseSkuPrice;
    
    console.log('直接使用第一个SKU:', this.currentSku);
    return;
  }
  
  // 如果没有SKU，使用商品售价
  this.currentSku = null;
  this.baseSkuPrice = this.salesPrice;
  this.currentTotalPrice = this.baseSkuPrice;
},
    
    // 更新SKU和价格
    updateSkuAndPrice() {
      // 收集isSkuIncluded为true的选项
      const includedOptions = [];
      this.filteredSpecs.forEach(spec => {
        if (spec.isSkuIncluded) {
          const optionId = this.selectedSpecs[spec.specId];
          if (optionId) {
            includedOptions.push({
              specId: spec.specId,
              optionId: optionId
            });
          }
        }
      });
      
      // 查找匹配的SKU
      let foundSku = null;
      
      if (includedOptions.length > 0) {
        // 创建查找key
        const lookupKey = includedOptions.map(item => `${item.specId}_${item.optionId}`).sort().join('|');
        
        // 在SKU映射中查找
        if (this.skuOptions[lookupKey]) {
          foundSku = this.skuOptions[lookupKey];
        }
      } else {
        // 所有isSkuIncluded都为false
        foundSku = this.detalilist.skus.find(sku => 
          !sku.specIds || sku.specIds.length === 0
        );
      }
      
      this.currentSku = foundSku;
      this.baseSkuPrice = foundSku ? foundSku.price : this.salesPrice;
      
      console.log('更新后的SKU:', foundSku);
      
      // 更新总价
      this.updatePrice();
      
      // 强制更新视图
      this.$forceUpdate();
    },
    
    // 更新价格
    updatePrice() {
      let totalPrice = this.baseSkuPrice;
      
      // 1. 加上isSkuIncluded为true的选项的addPrice
      this.filteredSpecs.forEach(spec => {
        if (spec.isSkuIncluded) {
          const optionId = this.selectedSpecs[spec.specId];
          if (optionId) {
            const option = spec.options.find(opt => opt.optionId === optionId);
            if (option && option.addPrice > 0) {
              totalPrice += option.addPrice;
            }
          }
        }
      });
      
      // 2. 加上isSkuIncluded为false且选中的选项的价格
      this.filteredSpecs.forEach(spec => {
        if (!spec.isSkuIncluded) {
          if (spec.specType === 0 || spec.specType === 1 || spec.specType === 2 || spec.specType === 4) {
            // 单选/包含/单选/可选
            const optionId = this.selectedSpecs[spec.specId] || this.optionalSelections[spec.specId];
            if (optionId) {
              const option = spec.options.find(opt => opt.optionId === optionId);
              if (option && option.addPrice > 0) {
                totalPrice += option.addPrice;
              }
            }
          } else if (spec.specType === 3) {
            // 多选
            const selected = this.selectedMultiOptions[spec.specId];
            if (selected) {
              Object.entries(selected).forEach(([optionId, quantity]) => {
                if (quantity > 0) {
                  const option = spec.options.find(opt => opt.optionId === optionId);
                  if (option && option.addPrice > 0) {
                    totalPrice += option.addPrice * quantity;
                  }
                }
              });
            }
          } else if (spec.specType === 5) {
            // 数量选择
            const quantities = this.selectedQuantities[spec.specId];
            if (quantities) {
              Object.entries(quantities).forEach(([optionId, quantity]) => {
                if (quantity > 0) {
                  const option = spec.options.find(opt => opt.optionId === optionId);
                  if (option && option.addPrice > 0) {
                    totalPrice += option.addPrice * quantity;
                  }
                }
              });
            }
          }
        }
      });
      
      this.currentTotalPrice = totalPrice;
      this.extraPrice = totalPrice - this.baseSkuPrice;
      
      console.log('当前总价:', totalPrice, '基础价格:', this.baseSkuPrice, '额外价格:', this.extraPrice);
    },
    
    // 加入购物车
  // 加入购物车
addshopcar() {
  console.log('当前选择的规格:', {
    selectedSpecs: this.selectedSpecs,
    currentSku: this.currentSku
  });
  
  // 简化验证：只验证SKU是否存在
  if (!this.currentSku || !this.currentSku.skuId) {
    // 尝试重新获取SKU
    if (this.detalilist.skus && this.detalilist.skus.length > 0) {
      const firstSku = this.detalilist.skus[0];
      this.currentSku = {
        skuId: firstSku.id,
        skuName: firstSku.skuName,
        price: firstSku.price
      };
      this.baseSkuPrice = firstSku.price;
      this.currentTotalPrice = this.baseSkuPrice;
    } else {
      this.$toast('商品信息不完整');
      return;
    }
  }
  
  // 验证数量限制
  if (this.detalilist.maxQuantity > 0 && this.count > this.detalilist.maxQuantity) {
    this.$toast(`最多只能购买${this.detalilist.maxQuantity}个`);
    return;
  }
  
  if (this.detalilist.minQuantity > 0 && this.count < this.detalilist.minQuantity) {
    this.$toast(`至少需要购买${this.detalilist.minQuantity}个`);
    return;
  }
  
  // 构建规格选项数组 - 简化版
  const specOptions = [];
  
  // 收集选中的规格选项（您的商品只有一个已包含规格）
  this.filteredSpecs.forEach(spec => {
    const optionId = this.selectedSpecs[spec.specId];
    if (optionId) {
      specOptions.push({
        specId: spec.specId,
        optionId: optionId,
        quantity: 1
      });
    }
  });
  
  // 构建校验请求参数
  const checkData = {
    categoryCode: this.categoryCodes,
    storeCode: this.storeid,
    packFlag: this.$route.query.packFlag,
    
    goods:JSON.stringify( [
      {
        goodsId: this.productid,
        skuId: this.currentSku.skuId,
        quantity: this.count,
        specOptions: specOptions
      }
    ])
  };
  
  console.log('校验请求参数:', JSON.stringify(checkData, null, 2));
  
  // 显示加载中
  this.$toast.loading({
    message: '校验中...',
    forbidClick: true,
    duration: 0
  });
  
  // 调用校验接口
  DetailCheckgoods(checkData).then(res => {
    this.$toast.clear();
    
    if (res.code == 200) {
      console.log('校验通过:', res.data.storeName);
      sessionStorage.setItem('shopName',res.data.storeName)
       
      this.addToCartAfterCheck();
    } else {
      this.$toast(res.msg || '商品校验失败');
    }
  }).catch(error => {
    this.$toast.clear();
    console.error('商品校验失败:', error);
    this.$toast('商品校验失败，请重试');
  });
},

// 校验通过后真正加入购物车
addToCartAfterCheck() {
  // 获取当前商品的基础信息
  const currentSkuPrice = this.currentSku ? this.currentSku.price : this.salesPrice;
  const priceInYuan = (currentSkuPrice / 100).toFixed(2);
  
  // 构建购物车商品 - 匹配商品列表页的结构
  const cartItem = {
    storeid: this.storeid,
    storeCode: this.storeid,
    id: this.productid,  // 关键：使用商品ID
    productId: this.productid,
    productid: this.productid,
    linkId: this.productid,
    skuId: this.currentSku ? this.currentSku.skuId : null,
    goodsCode: this.detalilist.goodsCode,
    
    // 商品基本信息
    nameCn: this.detalilist.goodsName,
    productName: this.detalilist.goodsName,
    goodsName: this.detalilist.goodsName,
    
    // 图片
    productImage: this.detalilist.goodsImage,
    imageUrl: this.detalilist.goodsImage,
    img: this.detalilist.goodsImage,
    
    // 价格相关 - 价格单位统一为元
    price: priceInYuan,  // 单位：元
    priceHead: priceInYuan,  // 肯德基自取
    fullPrice: this.currentTotalPrice / 100,  // 单位：元
    amount: priceInYuan,
    
    // 原始价格
    originalPrice: this.originalPrice / 100,
    
    // 规格信息
    specifications: this.selectedSpecsText,
    
    // 数量
    count: this.count,
    
    // 其他必要字段
    menuFlag: 'C',  // 表示是选择规格的商品
    
    // 规格详情（可选，用于详情展示）
    selectedData: {
      specs: this.selectedSpecs,
      multiOptions: this.selectedMultiOptions,
      quantities: this.selectedQuantities,
      optionalSelections: this.optionalSelections,
      skuName: this.currentSku ? this.currentSku.skuName : this.detalilist.goodsName
    },
    
    // 商品详情引用
    detail: {
      ...this.detalilist,
      price: priceInYuan,
      amount: priceInYuan,
      image: this.detalilist.goodsImage,
      img: this.detalilist.goodsImage,
      name: this.detalilist.goodsName,
      nameCn: this.detalilist.goodsName
    }
  };
  
  console.log('加入购物车的商品:', cartItem);
  
  // 获取现有购物车
  let existingCart = [];
  if (sessionStorage.getItem("goods")) {
    existingCart = JSON.parse(sessionStorage.getItem("goods"));
  }
  
  // 检查是否已存在相同商品（基于商品ID和规格）
  const existingIndex = existingCart.findIndex(item => {
    // 如果是相同商品且规格也相同，则合并数量
    return item.id === cartItem.id && 
           item.specifications === cartItem.specifications &&
           item.storeid === cartItem.storeid;
  });
  
  if (existingIndex >= 0) {
    // 如果已存在，增加数量
    existingCart[existingIndex].count += cartItem.count;
    existingCart[existingIndex].fullPrice = existingCart[existingIndex].count * (existingCart[existingIndex].fullPrice / existingCart[existingIndex].count);
  } else {
    // 否则添加新商品
    existingCart.push(cartItem);
  }
  
  // 保存到sessionStorage
  sessionStorage.setItem("goods", JSON.stringify(existingCart));
  
  this.$toast("加入购物车成功");
  
  setTimeout(() => {
    this.$router.go(-1);
  }, 800);
},

// 校验通过后真正加入购物车
addToCartAfterCheck() {
  // 获取当前商品的基础信息
  const currentSkuPrice = this.currentSku ? this.currentSku.price : this.salesPrice;
  const priceInYuan = (currentSkuPrice / 100).toFixed(2);
  
  // 构建购物车商品 - 匹配商品列表页的结构
  const cartItem = {
    storeid: this.storeid,
    storeCode: this.storeid,
    id: this.productid,  // 关键：使用商品ID
    productId: this.productid,
    productid: this.productid,
    linkId: this.productid,
    skuId: this.currentSku ? this.currentSku.skuId : null,
    goodsCode: this.detalilist.goodsCode,
    
    // 商品基本信息
    nameCn: this.detalilist.goodsName,
    productName: this.detalilist.goodsName,
    goodsName: this.detalilist.goodsName,
    
    // 图片
    productImage: this.detalilist.goodsImage,
    imageUrl: this.detalilist.goodsImage,
    img: this.detalilist.goodsImage,
    
    // 价格相关 - 价格单位统一为元
    price: priceInYuan,  // 单位：元
    priceHead: priceInYuan,  // 肯德基自取
    fullPrice: this.currentTotalPrice / 100,  // 单位：元
    amount: priceInYuan,
    
    // 原始价格
    originalPrice: this.originalPrice / 100,
    
    // 规格信息
    specifications: this.selectedSpecsText,
    
    // 数量
    count: this.count,
    
    // 其他必要字段
    menuFlag: 'C',  // 表示是选择规格的商品
    
    // 规格详情（可选，用于详情展示）
    selectedData: {
      specs: this.selectedSpecs,
      multiOptions: this.selectedMultiOptions,
      quantities: this.selectedQuantities,
      optionalSelections: this.optionalSelections,
      skuName: this.currentSku ? this.currentSku.skuName : this.detalilist.goodsName
    },
    
    // 商品详情引用
    detail: {
      ...this.detalilist,
      price: priceInYuan,
      amount: priceInYuan,
      image: this.detalilist.goodsImage,
      img: this.detalilist.goodsImage,
      name: this.detalilist.goodsName,
      nameCn: this.detalilist.goodsName
    }
  };
  
  console.log('加入购物车的商品:', cartItem);
  
  // 获取现有购物车
  let existingCart = [];
  if (sessionStorage.getItem("goods")) {
    existingCart = JSON.parse(sessionStorage.getItem("goods"));
  }
  
  // 检查是否已存在相同商品（基于商品ID和规格）
  const existingIndex = existingCart.findIndex(item => {
    // 如果是相同商品且规格也相同，则合并数量
    return item.id === cartItem.id && 
           item.specifications === cartItem.specifications &&
           item.storeid === cartItem.storeid;
  });
  
  if (existingIndex >= 0) {
    // 如果已存在，增加数量
    existingCart[existingIndex].count += cartItem.count;
    existingCart[existingIndex].fullPrice = existingCart[existingIndex].count * (existingCart[existingIndex].fullPrice / existingCart[existingIndex].count);
  } else {
    // 否则添加新商品
    existingCart.push(cartItem);
  }
  
  // 保存到sessionStorage
  sessionStorage.setItem("goods", JSON.stringify(existingCart));
  
  this.$toast("加入购物车成功");
  
  setTimeout(() => {
    this.$router.go(-1);
  }, 800);
},
    // 获取商品详情
    // 获取商品详情
getgoods_detail() {
  let datas = {
    categoryCode: this.categoryCodes,
    storeCode: this.storeid,
    goodsId: this.productid
  };
  
  CateringGoodsdetail({data: JSON.stringify(datas)}).then(res => {
    this.loadingflag = false;
    console.log('商品详情响应:', res);
    
    if (res.code == 200) {
      this.detalilist = res.data;
      this.originalPrice = res.data.originalPrice || 0;
      this.salesPrice = res.data.salesPrice || 0;
      
      // 保存原始数据
      this.originalList = res.data.specs || [];
      this.filteredSpecs = JSON.parse(JSON.stringify(this.originalList));
      
      // 初始化选择
      this.initSelections();
      
      // 直接设置当前SKU
      if (this.detalilist.skus && this.detalilist.skus.length > 0) {
        const firstSku = this.detalilist.skus[0];
        this.currentSku = {
          skuId: firstSku.id,
          skuName: firstSku.skuName,
          price: firstSku.price
        };
        this.baseSkuPrice = firstSku.price;
        this.currentTotalPrice = this.baseSkuPrice;
        console.log('设置当前SKU:', this.currentSku);
      }
      
    } else {
      this.$toast(res.msg);
    }
  }).catch(error => {
    this.loadingflag = false;
    console.error('获取商品详情失败:', error);
    this.$toast('获取商品信息失败');
  });
}
  },
  mounted() {
    // 获取值
    this.num1 = this.$route.query.num1;
    this.num2 = this.$route.query.num2;
    this.productid = this.$route.query.id;
    this.storeid = this.$route.query.storeid;
    
    console.log('参数:', {
      num1: this.num1,
      productid: this.productid,
      storeid: this.storeid
    });

    // 设置categoryCodes
    const categoryMap = {
      1: 'mcd',
      2: 'kfc',
      3: 'pzh',
      4: 'sbk',
      5: 'nx',
      6: 'lk',
      7: 'cot',
      8: 'tas'
    };
    
    this.categoryCodes = categoryMap[this.num1] || '';

    this.getgoods_detail();
  },
  created() {
    if (sessionStorage.getItem("goods")) {
      this.goods = JSON.parse(sessionStorage.getItem("goods"));
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
    
    img {
      width: 100%;
      height: auto;
      border-radius: 10px;
    }
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
    flex-wrap: wrap;

    .title {
      font-size: 20px;
      font-weight: bold;
      width: 100%;
      margin-bottom: 10px;
      color: #333;
    }
    
    .priceInfo {
      width: 100%;
      margin-bottom: 15px;
      
      .salesPrice {
        font-size: 24px;
        color: #FF4444;
        font-weight: bold;
      }
      
      .originalPrice {
        font-size: 14px;
        color: #999;
        text-decoration: line-through;
        margin-left: 10px;
      }
    }

    /deep/ .van-stepper {
      margin-left: auto;
    }
  }

  // 当前选择的规格信息 - 调整位置
  .selectedSpecsInfo {
    margin-top: 20px;
    padding: 15px;
    background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%);
    border-radius: 10px;
    border: 1px solid #e0e0e0;
    
    .infoTitle {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    .specsText {
      font-size: 14px;
      color: #333;
      line-height: 1.5;
    }
  }

  // 商品描述 - 调整位置
  .goodsDesc {
    margin: 15px 0;
    padding: 15px;
    background: #f8f8f8;
    border-radius: 8px;
    
    .descTitle {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin-bottom: 8px;
    }
    
    .descContent {
      font-size: 14px;
      color: #666;
      line-height: 1.5;
      white-space: pre-line;
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

  // 规格容器
  .specsContainer {
    margin-top: 20px;
  }

  .specItem {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
    
    .specHeader {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      
      .specName {
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
      
      .specTip {
        font-size: 12px;
        color: #666;
      }
      
      .requiredTip {
        font-size: 12px;
        color: #FF4444;
      }
    }
    
    .optionsContainer {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      
      .optionItem {
        min-width: 80px;
        padding: 10px 15px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background: #f8f8f8;
        cursor: pointer;
        transition: all 0.3s;
        position: relative;
        text-align: center;
        
        &.selected {
          border-color: #FF4444;
          background: #FFF0F0;
          box-shadow: 0 2px 8px rgba(255, 68, 68, 0.1);
          
          .optionName {
            color: #FF4444;
            font-weight: bold;
          }
        }
        
        &.disabled {
          opacity: 0.4;
          cursor: not-allowed;
          background: #f0f0f0;
          
          .optionName {
            color: #999;
          }
        }
        
        &:hover:not(.disabled):not(.selected) {
          border-color: #999;
          background: #f0f0f0;
        }
        
        .optionName {
          font-size: 14px;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .addPrice {
          font-size: 12px;
          color: #FF4444;
          margin-top: 4px;
          font-weight: bold;
        }
        
        .quantityControl {
          margin-top: 8px;
          
          /deep/ .van-stepper {
            width: 100px;
            margin: 0 auto;
          }
        }
      }
    }
    
    .multiSelectInfo {
      font-size: 12px;
      color: #666;
      margin-top: 10px;
      padding-left: 5px;
    }
    
    .optionalSpec {
      .optionItem {
        position: relative;
        padding-right: 35px;
        
        .optionalClose {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 22px;
          height: 22px;
          background: #FF4444;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s;
          
          &:hover {
            background: #ff3333;
          }
        }
      }
    }
    
    .quantitySpec {
      .quantityOption {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding: 12px 15px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background: #f8f8f8;
        transition: all 0.3s;
        
        &.selected {
          border-color: #FF4444;
          background: #FFF0F0;
        }
        
        .optionInfo {
          flex: 1;
          
          .optionName {
            font-size: 14px;
            color: #333;
            font-weight: 500;
          }
          
          .addPrice {
            font-size: 12px;
            color: #FF4444;
            margin-top: 4px;
            font-weight: bold;
          }
        }
        
        .quantityStepper {
          /deep/ .van-stepper {
            width: 100px;
          }
        }
      }
      
      .quantityInfo {
        font-size: 12px;
        color: #666;
        margin-top: 10px;
        padding-left: 5px;
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
  height: 70px;
  background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,1) 100%);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;

  .footerBtn {
    background-color: #3a3a3a;
    border-radius: 35px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 90%;
    max-width: 400px;
    margin: auto;
    padding-left: 20px;
    box-sizing: border-box;
     

    

    .cartIconBox {
      display: flex;
      align-items: center;
      gap: 12px;

      .cartIcon {
        width: 36px;
        position: relative;

        img {
          width: 100%;
          height: auto;
          filter: brightness(0) invert(1);
        }

        .number {
          position: absolute;
          top: -10px;
          right: -5px;
          background-color: #FFD861;
          border-radius: 50%;
          color: #2C2610;
          min-width: 20px;
          min-height: 20px;
          text-align: center;
          line-height: 20px;
          font-size: 12px;
          font-weight: bold;
        }
      }

      .cartPrice {
        color: white;
        font-size: 14px;

        .priceText {
          font-size: 26px;
          font-weight: bold;
          margin-left: 2px;
        }
      }
    }

    .order {
      text-align: center;
      color: #000000;
      background-color: #ffd861;
      border-radius: 35px;
      width: 140px;
      height: 100%;
      padding: 8px 0;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s;

       

      div:first-child {
        font-size: 16px;
        font-weight: 600;
      }

      .orderText {
        font-size: 11px;
        margin-top: 2px;
        opacity: 0.9;
      }
    }
  }
}

// 响应式调整
@media (max-width: 375px) {
  .detail {
    padding: 15px 20px;
    
    .optionItem {
      min-width: 70px;
      padding: 8px 12px;
    }
  }
  
  .footer .footerBtn {
    width: 95%;
  }
}
</style>