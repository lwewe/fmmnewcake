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
           <!-- 已包含规格（specType=0或1） -->
<div v-else-if="spec.specType === 0 || spec.specType === 1" class="optionsContainer">
  <div class="included-tip" v-if="spec.specType === 1 && spec.options.length > 1">
    包含以下所有选项：
  </div>
  <div 
    v-for="option in getFilteredOptions(spec)" 
    :key="option.optionId"
    class="optionItem"
    :class="{
      'selected': isOptionSelected(spec, option),
      'disabled': option.disabled,
      'included-option': spec.specType === 1 && spec.options.length > 1
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
import { CateringGoodsdetail, DetailCheckgoods } from "@/api/service"

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
      skuMap: {}, // SKU映射表
      originalPrice: 0,
      salesPrice: 0,
      
      // 价格计算
      baseSkuPrice: 0,
      extraPrice: 0,
      currentTotalPrice: 0,
      
      // 其他
      categoryCodes: '',
      
      // 缓存：用于保存用户之前的甜度子规格选择
      sweetnessSubSpecCache: {},
    };
  },
  computed: {
    // 获取已选择的规格文本
    selectedSpecsText() {
      const texts = [];
      
      if (!this.filteredSpecs || this.filteredSpecs.length === 0) {
        return '';
      }
      
      this.filteredSpecs.forEach(spec => {
        if (spec.specType === 0 || spec.specType === 1 || spec.specType === 2) {
          const optionId = this.selectedSpecs[spec.specId];
          if (optionId) {
            const option = spec.options.find(opt => opt.optionId === optionId);
            if (option) {
              texts.push(`${spec.specName}: ${option.optionName}`);
            }
          }
        } else if (spec.specType === 3) {
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
          const optionId = this.optionalSelections[spec.specId];
          if (optionId) {
            const option = spec.options.find(opt => opt.optionId === optionId);
            if (option) {
              texts.push(`${spec.specName}: ${option.optionName}`);
            }
          }
        } else if (spec.specType === 5) {
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
    selectedSpecs: {
      handler(newVal, oldVal) {
        // 检查是否是甜度选择发生了变化
        const sweetnessSpec = this.findSpecByName("甜度选择");
        if (sweetnessSpec) {
          const oldSweetness = oldVal ? oldVal[sweetnessSpec.specId] : null;
          const newSweetness = newVal[sweetnessSpec.specId];
          
          // 如果甜度选择发生了变化，重新处理互斥
          if (oldSweetness !== newSweetness) {
            this.$nextTick(() => {
              this.processAllExclusiveRules();
            });
          }
        }
        
        this.updateSkuAndPrice();
      },
      deep: true
    },
    selectedMultiOptions: {
      handler() {
        this.updatePrice();
      },
      deep: true
    },
    selectedQuantities: {
      handler() {
        this.updatePrice();
      },
      deep: true
    },
    optionalSelections: {
      handler() {
        this.updatePrice();
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
    
    // 获取过滤后的选项
    getFilteredOptions(spec) {
      if (!spec || !spec.options) return [];
      return spec.options.filter(option => !option.disabled);
    },
    
    // 判断选项是否被选中（单选/包含）
    // 判断选项是否被选中（单选/包含）
isOptionSelected(spec, option) {
  // 对于已包含类型且有多个选项，使用多选结构判断
  if (spec.specType === 1 && spec.options.length > 1) {
    const multiSelected = this.selectedMultiOptions[spec.specId] || {};
    return multiSelected[option.optionId] > 0;
  }
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
    
    // 辅助方法：根据规格名称查找规格对象
    findSpecByName(specName) {
      return this.filteredSpecs.find(s => 
        s.specName === specName || s.specName.includes(specName)
      );
    },
    
    // 辅助方法：根据规格名称查找ID
    findSpecIdByName(specName) {
      const spec = this.findSpecByName(specName);
      return spec ? spec.specId : null;
    },
    
    // 处理选项点击
    handleOptionClick(spec, option) {
      if (option.disabled) return;
      
      console.log('选择规格:', spec.specName, option.optionName);
      
      // 更新选择
      this.$set(this.selectedSpecs, spec.specId, option.optionId);
      
      // 处理互斥规则
      this.processAllExclusiveRules();
      
      this.$forceUpdate();
    },
    
    // 处理多选
    // handleMultiSelect(spec, option) {
    //   if (option.disabled) return;
      
    //   if (!this.selectedMultiOptions[spec.specId]) {
    //     this.$set(this.selectedMultiOptions, spec.specId, {});
    //   }
      
    //   const currentQuantity = this.selectedMultiOptions[spec.specId][option.optionId] || 0;
    //   const currentCount = this.getSelectedCount(spec);
      
    //   if (currentQuantity > 0) {
    //     this.$delete(this.selectedMultiOptions[spec.specId], option.optionId);
    //   } else {
    //     if (spec.maxQuantity && currentCount >= spec.maxQuantity) {
    //       this.$toast(`最多只能选择${spec.maxQuantity}个选项`);
    //       return;
    //     }
    //     this.$set(this.selectedMultiOptions[spec.specId], option.optionId, option.minQuantity || 1);
    //   }
      
    //   this.processAllExclusiveRules();
    //   this.updatePrice();
    //   this.$forceUpdate();
    // },
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
    // 取消选择
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
  
  // 处理互斥规则
  this.processAllExclusiveRules();
  this.updatePrice();
  this.$forceUpdate();
},
    
    // 处理可选规格
    handleOptionalSelect(spec, option) {
      if (option.disabled) return;
      
      const currentSelection = this.optionalSelections[spec.specId];
      if (currentSelection === option.optionId) {
        this.$delete(this.optionalSelections, spec.specId);
      } else {
        this.$set(this.optionalSelections, spec.specId, option.optionId);
      }
      
      this.processAllExclusiveRules();
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
      
      if (spec.maxQuantity && currentCount > spec.maxQuantity) {
        this.$toast(`总数不能超过${spec.maxQuantity}`);
        this.$nextTick(() => {
          this.$set(this.selectedMultiOptions[spec.specId], option.optionId, 
            Math.min(this.selectedMultiOptions[spec.specId][option.optionId], spec.maxQuantity - (currentCount - this.selectedMultiOptions[spec.specId][option.optionId])));
        });
        return;
      }
      
      if (spec.minQuantity && currentCount < spec.minQuantity) {
        this.$toast(`至少需要选择${spec.minQuantity}个`);
      }
      
      this.updatePrice();
      this.$forceUpdate();
    },
    
    // 处理数量选择规格
    handleQuantitySelect(spec, option) {
      if (!this.selectedQuantities[spec.specId]) {
        this.$set(this.selectedQuantities, spec.specId, {});
      }
      
      if (this.selectedQuantities[spec.specId][option.optionId] === 0) {
        this.$delete(this.selectedQuantities[spec.specId], option.optionId);
        this.updatePrice();
        return;
      }
      
      const totalQuantity = this.getTotalQuantity(spec);
      
      if (spec.maxQuantity && totalQuantity > spec.maxQuantity) {
        this.$toast(`总数不能超过${spec.maxQuantity}`);
        this.$nextTick(() => {
          this.$set(this.selectedQuantities[spec.specId], option.optionId, 
            Math.min(this.selectedQuantities[spec.specId][option.optionId], spec.maxQuantity - (totalQuantity - this.selectedQuantities[spec.specId][option.optionId])));
        });
        return;
      }
      
      if (spec.minQuantity && totalQuantity < spec.minQuantity) {
        this.$toast(`至少需要选择${spec.minQuantity}个`);
      }
      
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
      
      this.updatePrice();
      this.$forceUpdate();
    },
    
    // 核心方法：处理所有互斥规则
    processAllExclusiveRules() {
      console.log('处理所有互斥规则');
      
      // 1. 先重置为原始数据
      this.filteredSpecs = JSON.parse(JSON.stringify(this.originalList));
      
      // 2. 收集所有已选中的选项的互斥规则
      const exclusiveRules = [];
      
      Object.keys(this.selectedSpecs).forEach(specId => {
        const optionId = this.selectedSpecs[specId];
        const spec = this.filteredSpecs.find(s => s.specId === specId);
        if (!spec) return;
        
        const option = spec.options.find(opt => opt.optionId === optionId);
        if (option && option.exclusives && option.exclusives.length > 0) {
          exclusiveRules.push({
            sourceSpec: spec,
            sourceOption: option,
            rules: option.exclusives
          });
        }
      });
      
      // 3. 应用互斥规则
      exclusiveRules.forEach(({ sourceSpec, sourceOption, rules }) => {
        rules.forEach(exclusive => {
          if (exclusive.exclusiveEnum === 1) {
            if (exclusive.isSpecExclusive) {
              // 整个规格互斥 - 移除规格
              console.log('整个规格互斥，移除规格:', exclusive.specId);
              this.filteredSpecs = this.filteredSpecs.filter(spec => 
                spec.specId !== exclusive.specId
              );
              
              // 清除被移除规格的选中状态
              if (this.selectedSpecs[exclusive.specId]) {
                this.$delete(this.selectedSpecs, exclusive.specId);
              }
            } else {
              // 特定选项互斥 - 禁用这些选项
              console.log('特定选项互斥，禁用选项:', exclusive.optionIds);
              this.filteredSpecs.forEach(spec => {
                if (spec.specId === exclusive.specId && spec.options) {
                  spec.options.forEach(option => {
                    if (exclusive.optionIds.includes(option.optionId)) {
                      option.disabled = true;
                      
                      // 如果这个被禁用的选项当前被选中，取消选中
                      if (this.selectedSpecs[spec.specId] === option.optionId) {
                        console.log('取消选中被禁用的选项:', option.optionName);
                        this.$delete(this.selectedSpecs, spec.specId);
                      }
                    }
                  });
                }
              });
            }
          }
        });
      });
      
      // 4. 处理甜度依赖关系
      this.handleSweetnessDependency();
    },
    
    // 处理甜度依赖关系
    handleSweetnessDependency() {
      const sweetnessSpec = this.findSpecByName("甜度选择");
      if (!sweetnessSpec) return;
      
      const selectedSweetness = this.selectedSpecs[sweetnessSpec.specId];
      if (!selectedSweetness) return;
      
      const selectedOption = sweetnessSpec.options.find(opt => opt.optionId === selectedSweetness);
      if (!selectedOption) return;
      
      console.log('当前选择的甜度:', selectedOption.optionName);
      
      // 保存当前甜度子规格的选中状态到缓存
      this.filteredSpecs.forEach(spec => {
        if (spec.specName.includes("甜度-")) {
          if (this.selectedSpecs[spec.specId]) {
            this.sweetnessSubSpecCache[spec.specId] = this.selectedSpecs[spec.specId];
          }
        }
      });
      
      // 过滤规格，只保留与当前甜度相关的子规格
      this.filteredSpecs = this.filteredSpecs.filter(spec => {
        // 总是保留的规格列表
        const alwaysKeepSpecs = [
          "杯型",
          "温度",
          "甜度选择",
          "无糖风味定制/添加",
          "添加或更换牛奶",
          "奶泡",
          "浓缩咖啡",
          "萃取方式",
          "浓缩份数"
        ];
        
        if (alwaysKeepSpecs.some(name => spec.specName.includes(name))) {
          return true;
        }
        
        // 处理甜度子规格
        if (spec.specName.includes("甜度-")) {
          let shouldKeep = false;
          
          if (selectedOption.optionName === "经典糖" && spec.specName.includes("经典糖")) {
            shouldKeep = true;
          } else if (selectedOption.optionName === "0热量代糖" && spec.specName.includes("0热量代糖")) {
            shouldKeep = true;
          } else if (selectedOption.optionName === "不另外加糖" && spec.specName.includes("不另外加糖")) {
            shouldKeep = true;
          }
          
          if (shouldKeep) {
            // 确保这个子规格有选中值
            if (!this.selectedSpecs[spec.specId]) {
              // 优先使用缓存中的值
              if (this.sweetnessSubSpecCache[spec.specId]) {
                this.$set(this.selectedSpecs, spec.specId, this.sweetnessSubSpecCache[spec.specId]);
                console.log('从缓存恢复选中值:', spec.specName);
              } else {
                // 否则使用默认选项
                const defaultOption = spec.options.find(opt => opt.isDefault);
                if (defaultOption) {
                  this.$set(this.selectedSpecs, spec.specId, defaultOption.optionId);
                  console.log('设置默认选项:', spec.specName, defaultOption.optionName);
                } else if (spec.options.length > 0) {
                  this.$set(this.selectedSpecs, spec.specId, spec.options[0].optionId);
                  console.log('设置第一个选项:', spec.specName, spec.options[0].optionName);
                }
              }
            }
            return true;
          }
          
          // 如果这个甜度子规格被移除，同时清除它的选中状态
          if (this.selectedSpecs[spec.specId]) {
            console.log('移除甜度子规格选中:', spec.specName);
            this.$delete(this.selectedSpecs, spec.specId);
          }
          return false;
        }
        
        return true;
      });
      
      console.log('过滤后的规格:', this.filteredSpecs.map(s => s.specName));
    },
    
    // 构建SKU映射
    buildSkuMap() {
      this.skuMap = {};
      if (this.detalilist.skus && this.detalilist.skus.length > 0) {
        this.detalilist.skus.forEach(sku => {
          if (!sku.specIds || sku.specIds.length === 0) {
            this.skuMap['default'] = {
              skuId: sku.id,
              skuName: sku.skuName,
              price: sku.price,
              costPrice: sku.costPrice,
              specIds: []
            };
          } else {
            const key = sku.specIds
              .map(item => `${item.specId}_${item.optionId}`)
              .sort()
              .join('|');
            
            this.skuMap[key] = {
              skuId: sku.id,
              skuName: sku.skuName,
              price: sku.price,
              costPrice: sku.costPrice,
              specIds: sku.specIds
            };
          }
        });
      }
      console.log('SKU映射表:', this.skuMap);
    },
    
    // 查找匹配的SKU
    findMatchingSku() {
      const selectedSkuOptions = [];
      
      this.filteredSpecs.forEach(spec => {
        if (spec.isSkuIncluded) {
          const optionId = this.selectedSpecs[spec.specId];
          if (optionId) {
            selectedSkuOptions.push({
              specId: spec.specId,
              optionId: optionId
            });
          }
        }
      });
      
      if (selectedSkuOptions.length === 0) {
        return this.skuMap['default'] || null;
      }
      
      const lookupKey = selectedSkuOptions
        .map(item => `${item.specId}_${item.optionId}`)
        .sort()
        .join('|');
      
      return this.skuMap[lookupKey] || null;
    },
    
    // 更新SKU和价格
    updateSkuAndPrice() {
      const matchedSku = this.findMatchingSku();
      
      if (matchedSku) {
        this.currentSku = matchedSku;
        this.baseSkuPrice = matchedSku.price;
      } else {
        this.currentSku = this.skuMap['default'] || null;
        this.baseSkuPrice = this.currentSku ? this.currentSku.price : this.salesPrice;
      }
      
      this.updatePrice();
    },
    
    // 更新价格
    // updatePrice() {
    //   let totalPrice = this.baseSkuPrice;
      
    //   this.filteredSpecs.forEach(spec => {
    //     if (!spec.isSkuIncluded) {
    //       if (spec.specType === 0 || spec.specType === 1 || spec.specType === 2) {
    //         const optionId = this.selectedSpecs[spec.specId];
    //         if (optionId) {
    //           const option = spec.options.find(opt => opt.optionId === optionId);
    //           if (option && option.addPrice > 0) {
    //             totalPrice += option.addPrice;
    //           }
    //         }
    //       } else if (spec.specType === 3) {
    //         const selected = this.selectedMultiOptions[spec.specId];
    //         if (selected) {
    //           Object.entries(selected).forEach(([optionId, quantity]) => {
    //             if (quantity > 0) {
    //               const option = spec.options.find(opt => opt.optionId === optionId);
    //               if (option && option.addPrice > 0) {
    //                 totalPrice += option.addPrice * quantity;
    //               }
    //             }
    //           });
    //         }
    //       } else if (spec.specType === 4) {
    //         const optionId = this.optionalSelections[spec.specId];
    //         if (optionId) {
    //           const option = spec.options.find(opt => opt.optionId === optionId);
    //           if (option && option.addPrice > 0) {
    //             totalPrice += option.addPrice;
    //           }
    //         }
    //       } else if (spec.specType === 5) {
    //         const quantities = this.selectedQuantities[spec.specId];
    //         if (quantities) {
    //           Object.entries(quantities).forEach(([optionId, quantity]) => {
    //             if (quantity > 0) {
    //               const option = spec.options.find(opt => opt.optionId === optionId);
    //               if (option && option.addPrice > 0) {
    //                 totalPrice += option.addPrice * quantity;
    //               }
    //             }
    //           });
    //         }
    //       }
    //     }
    //   });
      
    //   this.currentTotalPrice = totalPrice;
    //   this.extraPrice = totalPrice - this.baseSkuPrice;
    // },
    // 更新价格
updatePrice() {
  let totalPrice = this.baseSkuPrice;
  
  this.filteredSpecs.forEach(spec => {
    if (!spec.isSkuIncluded) {
      if (spec.specType === 0 || spec.specType === 1 || spec.specType === 2 || spec.specType === 4) {
        const optionId = this.selectedSpecs[spec.specId] || this.optionalSelections[spec.specId];
        if (optionId) {
          const option = spec.options.find(opt => opt.optionId === optionId);
          if (option && option.addPrice > 0) {
            totalPrice += option.addPrice;
          }
        }
      } else if (spec.specType === 3) {
        // 多选规格 - 累加每个选中项的价格
        const selected = this.selectedMultiOptions[spec.specId] || {};
        Object.entries(selected).forEach(([optionId, quantity]) => {
          if (quantity > 0) {
            const option = spec.options.find(opt => opt.optionId === optionId);
            if (option && option.addPrice > 0) {
              totalPrice += option.addPrice * quantity;
            }
          }
        });
      } else if (spec.specType === 5) {
        const quantities = this.selectedQuantities[spec.specId] || {};
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
  });
  
  this.currentTotalPrice = totalPrice;
  this.extraPrice = totalPrice - this.baseSkuPrice;
},
     // 初始化选择状态
initSelections() {
  this.selectedSpecs = {};
  this.selectedMultiOptions = {};
  this.selectedQuantities = {};
  this.optionalSelections = {};
  this.sweetnessSubSpecCache = {};
  
  this.filteredSpecs.forEach(spec => {
    // 处理默认选项
    const defaultOptions = spec.options.filter(opt => opt.isDefault);
    
    if (spec.specType === 3) {
      // 多选规格 - 可以选中多个默认选项
      if (!this.selectedMultiOptions[spec.specId]) {
        this.$set(this.selectedMultiOptions, spec.specId, {});
      }
      
      // 选中所有默认选项
      defaultOptions.forEach(defaultOption => {
        this.$set(this.selectedMultiOptions[spec.specId], defaultOption.optionId, 
          defaultOption.minQuantity || 1);
      });
      
      // 如果没有默认选项且最小数量>0，自动选中第一个
      if (defaultOptions.length === 0 && spec.minQuantity > 0 && spec.options.length > 0) {
        this.$set(this.selectedMultiOptions[spec.specId], spec.options[0].optionId, 
          spec.options[0].minQuantity || 1);
      }
    } 
    // 处理已包含类型 (specType === 1) - 需要选中所有选项
    else if (spec.specType === 1) {
      console.log('已包含类型规格:', spec.specName, '选项数量:', spec.options.length);
      
      // 已包含类型可能有多个选项，应该全部选中
      if (spec.options.length > 1) {
        // 多个选项，使用多选结构
        if (!this.selectedMultiOptions[spec.specId]) {
          this.$set(this.selectedMultiOptions, spec.specId, {});
        }
        
        // 选中所有选项
        spec.options.forEach(option => {
          this.$set(this.selectedMultiOptions[spec.specId], option.optionId, 1);
          console.log(`已包含类型选中: ${option.optionName}`);
        });
      } else if (spec.options.length === 1) {
        // 单个选项，使用单选结构
        this.$set(this.selectedSpecs, spec.specId, spec.options[0].optionId);
      }
    }
    else if (defaultOptions.length > 0) {
      // 单选规格 - 只选中一个默认选项
      this.$set(this.selectedSpecs, spec.specId, defaultOptions[0].optionId);
      
      if (spec.specType === 4) {
        this.$set(this.optionalSelections, spec.specId, defaultOptions[0].optionId);
      } else if (spec.specType === 5) {
        if (!this.selectedQuantities[spec.specId]) {
          this.$set(this.selectedQuantities, spec.specId, {});
        }
        this.$set(this.selectedQuantities[spec.specId], defaultOptions[0].optionId, 
          defaultOptions[0].minQuantity || 1);
      }
    } else if (spec.options.length > 0 && spec.specType !== 3 && spec.specType !== 5) {
      // 没有默认选项的单选规格，选择第一个
      this.$set(this.selectedSpecs, spec.specId, spec.options[0].optionId);
    }
    
    // 初始化数据结构
    if (spec.specType === 3 && !this.selectedMultiOptions[spec.specId]) {
      this.$set(this.selectedMultiOptions, spec.specId, {});
    }
    if (spec.specType === 5 && !this.selectedQuantities[spec.specId]) {
      this.$set(this.selectedQuantities, spec.specId, {});
    }
  });
  
  console.log('初始化选择:', {
    selectedSpecs: this.selectedSpecs,
    selectedMultiOptions: this.selectedMultiOptions
  });
  
  // 处理初始互斥规则
  this.$nextTick(() => {
    this.processAllExclusiveRules();
    this.updateSkuAndPrice();
  });
},
    // 加入购物车
addshopcar() {
  console.log('当前选择的规格:', {
    selectedSpecs: this.selectedSpecs,
    selectedMultiOptions: this.selectedMultiOptions,
    currentSku: this.currentSku
  });
  
  // 验证所有规格的数量限制
  let validationPassed = true;
  
  this.filteredSpecs.forEach(spec => {
    if (spec.specType === 2 || spec.specType === 0) {
      const optionId = this.selectedSpecs[spec.specId];
      if (spec.isSkuIncluded && !optionId) {
        this.$toast(`请选择${spec.specName}`);
        validationPassed = false;
      }
    }
    
    // 处理已包含类型
    if (spec.specType === 1) {
      if (spec.options.length > 1) {
        // 多个选项，检查多选结构中是否选中了所有选项
        const multiSelected = this.selectedMultiOptions[spec.specId] || {};
        const selectedCount = Object.keys(multiSelected).length;
        
        if (selectedCount < spec.options.length) {
          this.$toast(`${spec.specName} 必须包含所有选项`);
          validationPassed = false;
        }
      } else {
        // 单个选项，检查单选结构
        const optionId = this.selectedSpecs[spec.specId];
        if (!optionId) {
          this.$toast(`请选择${spec.specName}`);
          validationPassed = false;
        }
      }
    }
    
    // 验证多选规格的数量限制
    if (spec.specType === 3) {
      const selected = this.selectedMultiOptions[spec.specId] || {};
      const selectedCount = Object.keys(selected).length;
      
      if (spec.minQuantity > 0 && selectedCount < spec.minQuantity) {
        this.$toast(`${spec.specName} 最少需要选择 ${spec.minQuantity} 个`);
        validationPassed = false;
      }
      
      if (spec.maxQuantity > 0 && selectedCount > spec.maxQuantity) {
        this.$toast(`${spec.specName} 最多只能选择 ${spec.maxQuantity} 个`);
        validationPassed = false;
      }
      
      // 验证每个选中项的数量限制
      Object.entries(selected).forEach(([optionId, quantity]) => {
        const option = spec.options.find(opt => opt.optionId === optionId);
        if (option) {
          if (option.minQuantity > 0 && quantity < option.minQuantity) {
            this.$toast(`${option.optionName} 最少需要选择 ${option.minQuantity} 个`);
            validationPassed = false;
          }
          if (option.maxQuantity > 0 && quantity > option.maxQuantity) {
            this.$toast(`${option.optionName} 最多只能选择 ${option.maxQuantity} 个`);
            validationPassed = false;
          }
        }
      });
    }
  });
  
  if (!validationPassed) return;
  
  // 验证SKU是否存在
  if (!this.currentSku || !this.currentSku.skuId) {
    const matchedSku = this.findMatchingSku();
    if (matchedSku) {
      this.currentSku = matchedSku;
      this.baseSkuPrice = matchedSku.price;
      this.currentTotalPrice = this.baseSkuPrice;
    } else {
      this.$toast('请选择正确的规格组合');
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
  
  // 构建规格选项数组
  const specOptions = [];
  
  this.filteredSpecs.forEach(spec => {
    // 处理单选规格
    if (spec.specType === 2 || spec.specType === 0) {
      const optionId = this.selectedSpecs[spec.specId];
      if (optionId) {
        specOptions.push({
          specId: spec.specId,
          optionId: optionId,
          quantity: 1
        });
      }
    }
    
    // 处理已包含类型
    if (spec.specType === 1) {
      if (spec.options.length > 1) {
        // 多个选项，从多选结构获取
        const multiSelected = this.selectedMultiOptions[spec.specId] || {};
        Object.entries(multiSelected).forEach(([optionId, quantity]) => {
          if (quantity > 0) {
            specOptions.push({
              specId: spec.specId,
              optionId: optionId,
              quantity: quantity
            });
          }
        });
      } else {
        // 单个选项，从单选结构获取
        const optionId = this.selectedSpecs[spec.specId];
        if (optionId) {
          specOptions.push({
            specId: spec.specId,
            optionId: optionId,
            quantity: 1
          });
        }
      }
    }
    
    // 添加多选规格
    if (spec.specType === 3) {
      const selected = this.selectedMultiOptions[spec.specId] || {};
      Object.entries(selected).forEach(([optionId, quantity]) => {
        if (quantity > 0) {
          specOptions.push({
            specId: spec.specId,
            optionId: optionId,
            quantity: quantity
          });
        }
      });
    }
    
    // 添加可选规格
    if (spec.specType === 4) {
      const optionId = this.optionalSelections[spec.specId];
      if (optionId) {
        specOptions.push({
          specId: spec.specId,
          optionId: optionId,
          quantity: 1
        });
      }
    }
    
    // 添加数量选择规格
    if (spec.specType === 5) {
      const quantities = this.selectedQuantities[spec.specId] || {};
      Object.entries(quantities).forEach(([optionId, quantity]) => {
        if (quantity > 0) {
          specOptions.push({
            specId: spec.specId,
            optionId: optionId,
            quantity: quantity
          });
        }
      });
    }
  });
  
  console.log('构建的规格选项:', specOptions);
  
  const checkData = {
    categoryCode: this.categoryCodes,
    storeCode: this.storeid,
    packFlag: this.$route.query.packFlag,
    goods: JSON.stringify([
      {
        goodsId: this.productid,
        skuId: this.currentSku.skuId,
        quantity: this.count,
        specOptions: specOptions
      }
    ])
  };
  
  console.log('校验请求参数:', JSON.stringify(checkData, null, 2));
  
  this.$toast.loading({
    message: '校验中...',
    forbidClick: true,
    duration: 0
  });
  
  DetailCheckgoods(checkData).then(res => {
    this.$toast.clear();
    
    if (res.code == 200) {
      console.log('校验通过:', res.data.storeName);
      sessionStorage.setItem('shopName', res.data.storeName);
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
      const currentSkuPrice = this.currentSku ? this.currentSku.price : this.salesPrice;
      const priceInYuan = (currentSkuPrice / 100).toFixed(2);
      
      const cartItem = {
        storeid: this.storeid,
        storeCode: this.storeid,
        id: this.productid,
        productId: this.productid,
        productid: this.productid,
        linkId: this.productid,
        skuId: this.currentSku ? this.currentSku.skuId : null,
        goodsCode: this.detalilist.goodsCode,
        
        nameCn: this.detalilist.goodsName,
        productName: this.detalilist.goodsName,
        goodsName: this.detalilist.goodsName,
        
        productImage: this.detalilist.goodsImage,
        imageUrl: this.detalilist.goodsImage,
        img: this.detalilist.goodsImage,
        
        price: priceInYuan,
        priceHead: priceInYuan,
        fullPrice: this.currentTotalPrice / 100,
        amount: priceInYuan,
        
        originalPrice: this.originalPrice / 100,
        
        specifications: this.selectedSpecsText,
        
        count: this.count,
        
        menuFlag: 'C',
        
        selectedData: {
          specs: this.selectedSpecs,
          multiOptions: this.selectedMultiOptions,
          quantities: this.selectedQuantities,
          optionalSelections: this.optionalSelections,
          skuName: this.currentSku ? this.currentSku.skuName : this.detalilist.goodsName
        },
        
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
      
      let existingCart = [];
      if (sessionStorage.getItem("goods")) {
        existingCart = JSON.parse(sessionStorage.getItem("goods"));
      }
      
      const existingIndex = existingCart.findIndex(item => {
        return item.id === cartItem.id && 
               item.specifications === cartItem.specifications &&
               item.storeid === cartItem.storeid;
      });
      
      if (existingIndex >= 0) {
         existingCart[existingIndex].count += cartItem.count;
        // existingCart[existingIndex].count += cartItem.count;
        // existingCart[existingIndex].fullPrice = existingCart[existingIndex].count * (existingCart[existingIndex].fullPrice / (existingCart[existingIndex].count - cartItem.count));
      } else {
        existingCart.push(cartItem);
      }
      
      sessionStorage.setItem("goods", JSON.stringify(existingCart));
      
      this.$toast("加入购物车成功");
      
      setTimeout(() => {
        this.$router.go(-1);
      }, 800);
    },
    
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
          
          this.originalList = res.data.specs || [];
          this.filteredSpecs = JSON.parse(JSON.stringify(this.originalList));
          
          this.buildSkuMap();
          this.initSelections();
          
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
    this.num1 = this.$route.query.num1;
    this.num2 = this.$route.query.num2;
    this.productid = this.$route.query.id;
    this.storeid = this.$route.query.storeid;
    
    console.log('参数:', {
      num1: this.num1,
      productid: this.productid,
      storeid: this.storeid
    });

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

.included-tip {
  width: 100%;
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
  padding-left: 5px;
}

.included-option {
  cursor: default;
  &:hover {
    border-color: #e0e0e0;
  }
}
</style>