<template>
  <el-dialog
    v-model="visible"
    :title="product?.label || '商品详情'"
    width="90%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
    class="custom-dialog"
    :max-height="'80vh'"
  >
    <div class="dialog-content-wrapper">
    <!-- 高度不一致的轮播图（地狱级体验：轮播时页面跳动） -->
    <div class="inconsistent-carousel" style="margin-bottom: 20px; overflow: hidden;">
      <div 
        v-for="(img, index) in carouselImages" 
        :key="index"
        v-show="currentImageIndex === index"
        :style="{ height: inconsistentHeights[index] + 'px', transition: 'height 0.3s ease' }"
      >
        <img 
          :src="img" 
          :alt="`Product ${index}`"
          style="width: 100%; object-fit: cover;"
          @click="nextImage"
        />
      </div>
    </div>
    
    <!-- 商品基本信息 -->
    <div class="product-info" style="margin-bottom: 20px;">
      <p>{{ product?.description || '美味的奶茶，快来定制吧！' }}</p>
    </div>
    
    <!-- 甜度选择 -->
    <div class="form-section">
      <h4 class="form-section-title">甜度</h4>
      <div class="sweetness-options">
        <button
          v-for="option in sweetnessOptions"
          :key="option.value"
          :class="['sweetness-option', { active: selectedSweetness === option.value }]"
          @click="selectedSweetness = option.value"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
    
    <!-- 冰量选择 -->
    <div class="form-section">
      <h4 class="form-section-title">冰量</h4>
      <div class="ice-options">
        <button
          v-for="option in iceOptions"
          :key="option.value"
          :class="['ice-option', { active: selectedIce === option.value }]"
          @click="selectedIce = option.value"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
    
    <!-- 杯型选择 -->
    <div v-if="isCupSizeSupported" class="form-section">
      <h4 class="form-section-title">杯型</h4>
      <div class="cup-size-options">
        <button
          v-for="option in cupSizeOptions"
          :key="option.value"
          :class="['cup-size-option', { active: selectedCupSize === option.value }]"
          @click="selectedCupSize = option.value"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
    
    <!-- 数量选择 -->
    <div class="form-section">
      <h4 class="form-section-title">数量</h4>
      <div class="quantity-control">
        <button 
          class="quantity-btn"
          @click="decreaseQuantity"
        >
          -
        </button>
        <span class="quantity-value">{{ quantity }}</span>
        <button 
          class="quantity-btn"
          @click="increaseQuantity"
          :disabled="quantity >= 99"
        >
          +
        </button>
      </div>
    </div>
    
    <!-- 珍珠定制（仅珍珠奶茶显示） -->
    <div v-if="isPearlMilkTea" class="pearl-custom-section">
      <el-form-item label="珍珠数量">
        <el-input-number 
          v-model="pearlCount" 
          :min="1" 
          :max="50"
          size="small"
          @change="generatePearlOptions"
        />
      </el-form-item>
      
      <!-- 每颗珍珠的定制选项 -->
      <div v-if="pearlOptions.length > 0" class="pearl-options-list">
        <h4 style="margin: 15px 0; color: #ff6b6b; font-size: 16px;">每颗珍珠都要定制！</h4>
        <div 
          v-for="(pearl, index) in pearlOptions" 
          :key="index"
          class="pearl-option-item"
          style="border: 1px solid #ff6b6b; padding: 8px; margin: 6px 0; border-radius: 6px;"
        >
          <h5>第 {{ index + 1 }} 颗珍珠</h5>
          
          <!-- 材质选择 -->
          <el-form-item :label="`珍珠${index + 1}材质`" style="margin: 10px 0;">
            <el-select 
              v-model="pearl.material" 
              placeholder="请选择材质" 
              size="small"
              style="width: 100%;"
              :required="true"
            >
              <el-option label="Q弹椰果" value="coconut" />
              <el-option label="软糯芋圆" value="taro" />
              <el-option label="经典黑糖" value="brown-sugar" />
              <el-option label="脆脆仙草" value="grass-jelly" />
              <el-option label="滑滑布丁" value="pudding" />
            </el-select>
          </el-form-item>
          
          <!-- 颜色选择（RGB选择器） -->
          <el-form-item :label="`珍珠${index + 1}颜色`" style="margin: 10px 0;">
            <el-color-picker 
              v-model="pearl.color" 
              show-alpha
              size="small"
              style="width: 100%;"
            />
            <div style="margin-top: 5px; font-size: 12px; color: #666;">
              当前颜色: {{ pearl.color || '未选择' }}
            </div>
          </el-form-item>
        </div>
      </div>
      
      <!-- 强制必填提示 -->
      <div v-if="pearlOptions.length > 0" class="required-warning" style="color: #ff4757; font-weight: bold; margin: 10px 0;">
        ⚠️ 每颗珍珠的材质和颜色都必须选择！
      </div>
    </div>
    </div>
    
    <!-- 操作按钮 -->
    <template #footer>
      <div style="text-align: center;">
        <el-button @click="handleClose" size="large">取消</el-button>
        <el-button 
          type="primary" 
          @click="handleConfirm" 
          size="large"
          :loading="confirmLoading"
          style="background-color: #ff6b6b; border-color: #ff6b6b;"
        >
          加入购物车
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

// 对话框可见性
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 轮播图相关
const carouselImages = ref([])
const currentImageIndex = ref(0)
const inconsistentHeights = ref([]) // 不一致的高度

// 监听product变化，更新轮播图
watch(() => props.product, (newProduct) => {
  if (newProduct && newProduct.carouselImages && newProduct.carouselImages.length > 0) {
    carouselImages.value = newProduct.carouselImages
    // 为每张图片生成随机高度（保持地狱级体验）
    inconsistentHeights.value = newProduct.carouselImages.map(() => 100 + Math.floor(Math.random() * 150))
  } else {
    // 默认图片
    carouselImages.value = [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20milk%20tea%20product%20image&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20beverage%20product%20image&image_size=landscape_16_9'
    ]
    inconsistentHeights.value = [150, 180]
  }
  currentImageIndex.value = 0
}, { immediate: true })

// 甜度选项
const sweetnessOptions = ref([
  { value: 'zero', label: '无糖' },
  { value: '25', label: '25%糖' },
  { value: '50', label: '半糖' },
  { value: '75', label: '75%糖' },
  { value: '100', label: '全糖' }
])

// 商品定制选项
const selectedSweetness = ref('50') // 默认半糖
const selectedIce = ref('normal') // 默认有冰
const selectedCupSize = ref('500ml') // 默认500ml
const quantity = ref(1)
const pearlCount = ref(3) // 默认3颗珍珠
const pearlOptions = ref([])

// 杯型选项
const cupSizeOptions = [
  { value: '500ml', label: '500ml' },
  { value: '700ml', label: '700ml' }
]

// 检查商品是否支持杯型选择
const isCupSizeSupported = computed(() => {
  // 为部分商品添加杯型选择功能
  const cupSizeProducts = ['五彩珍珠奶茶', '经典奶茶', '美式咖啡', '橙汁']
  return cupSizeProducts.includes(props.product.label)
})

// 冰量选项
const iceOptions = [
  { value: 'normal', label: '有冰' },
  { value: 'no', label: '无冰' },
  { value: 'much', label: '很多冰' },
  { value: 'super', label: '超级多冰' }
]

// 获取冰量标签
const getIceLabel = (ice) => {
  const map = {
    'normal': '有冰',
    'no': '无冰',
    'much': '很多冰',
    'super': '超级多冰'
  }
  return map[ice] || ice
}

// 数量控制方法
const decreaseQuantity = () => {
  quantity.value--
}

const increaseQuantity = () => {
  if (quantity.value < 99) {
    quantity.value++
  }
}

// 确认加载状态
const confirmLoading = ref(false)

// 判断是否是珍珠奶茶
const isPearlMilkTea = computed(() => {
  return props.product && props.product.label && props.product.label.includes('珍珠')
})

// 生成珍珠选项
const generatePearlOptions = () => {
  const options = []
  for (let i = 0; i < pearlCount.value; i++) {
    options.push({
      material: '',
      color: ''
    })
  }
  pearlOptions.value = options
}

// 轮播图自动切换
let carouselInterval = null
onMounted(() => {
  generatePearlOptions()
  
  // 启动轮播（地狱级体验：导致页面跳动）
  carouselInterval = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % carouselImages.value.length
  }, 3000)
})

// 清理定时器
const handleClose = () => {
  if (carouselInterval) {
    clearInterval(carouselInterval)
    carouselInterval = null
  }
  visible.value = false
}

// 确认添加到购物车
const handleConfirm = async () => {
  // 验证珍珠选项（如果有的话）
  if (isPearlMilkTea.value && pearlOptions.value.length > 0) {
    const hasEmpty = pearlOptions.value.some(pearl => !pearl.material || !pearl.color)
    if (hasEmpty) {
      ElMessage.error('每颗珍珠的材质和颜色都必须选择！')
      return
    }
  }
  
  confirmLoading.value = true
  
  // 模拟添加到购物车的延迟
  setTimeout(() => {
    const customData = {
      sweetness: selectedSweetness.value,
      ice: selectedIce.value,
      cupSize: isCupSizeSupported.value ? selectedCupSize.value : '500ml',
      quantity: quantity.value,
      pearls: isPearlMilkTea.value ? pearlOptions.value : null
    }
    
    emit('confirm', customData)
    confirmLoading.value = false
    handleClose()
  }, 500)
}

// 组件卸载时清理
watch(() => visible.value, (newVal) => {
  if (!newVal && carouselInterval) {
    clearInterval(carouselInterval)
    carouselInterval = null
  }
})
</script>

<style scoped>
.inconsistent-carousel {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.pearl-custom-section {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #ff6b6b;
}

.pearl-option-item h5 {
  margin: 0 0 8px 0;
  color: #ff6b6b;
  font-size: 14px;
}

.required-warning {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 表单样式 */
.form-section {
  margin-bottom: 15px;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.form-section-title {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

/* 甜度选择样式 */
.sweetness-options,
.ice-options,
.cup-size-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  overflow-x: hidden;
}

.sweetness-option,
.ice-option,
.cup-size-option {
  width: auto;
  padding: 6px 16px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 14px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 11px;
  margin-right: 8px;
  
  &:last-child {
    margin-right: 0;
  }
  
  &:hover {
    border-color: #ff6b6b;
    transform: translateY(-1px);
  }
  
  &.active {
    background-color: #ff6b6b;
    color: #fff;
    border-color: #ff6b6b;
  }
}

/* 数量选择样式 */
.quantity-control {
  display: flex;
  align-items: center;
  max-width: 120px;
}

.quantity-btn {
  width: 28px;
  height: 28px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover:not(:disabled) {
    background-color: #ff6b6b;
    color: #fff;
    border-color: #ff6b6b;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.quantity-value {
  flex: 1;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  padding: 0 12px;
  min-width: 35px;
}

/* 对话框内容包装器，实现内部滚动 */
.dialog-content-wrapper {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 10px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ff6b6b;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #ff5252;
  }
}

/* 珍珠定制样式优化 */
.pearl-custom-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px dashed #ff6b6b;
}

.pearl-option-item {
  border: 1px solid #e0e0e0 !important;
  border-radius: 8px !important;
  padding: 15px !important;
  margin: 10px 0 !important;
  background-color: #f9f9f9;
}

.pearl-option-item h5 {
  margin: 0 0 15px 0 !important;
  font-size: 14px !important;
  color: #666 !important;
}
/* 弹窗内部滚动样式 */
.custom-dialog {
  .el-dialog__body {
    max-height: 70vh;
    overflow-y: auto;
    padding: 20px;
    
    /* 自定义滚动条样式 */
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #ff6b6b;
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: #ff5252;
    }
  }
}
</style>