<template>
  <el-dialog
    v-model="visible"
    :title="product.label"
    width="90%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
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
      <p>{{ product.description || '美味的奶茶，快来定制吧！' }}</p>
    </div>
    
    <!-- 甜度选择（不一致单位增加认知负担） -->
    <el-form-item label="甜度选择">
      <el-radio-group v-model="selectedSweetness" size="large">
        <el-radio label="zero">Zero糖</el-radio>
        <el-radio label="25">25%糖</el-radio>
        <el-radio label="50">半糖</el-radio>
        <el-radio label="100">百分百糖</el-radio>
      </el-radio-group>
    </el-form-item>
    
    <!-- 数量选择 -->
    <el-form-item label="数量">
      <el-input-number 
        v-model="quantity" 
        :min="1" 
        :max="99"
        size="large"
      />
    </el-form-item>
    
    <!-- 珍珠定制（仅珍珠奶茶显示） -->
    <div v-if="isPearlMilkTea" class="pearl-custom-section">
      <el-form-item label="珍珠数量">
        <el-input-number 
          v-model="pearlCount" 
          :min="1" 
          :max="50"
          size="large"
          @change="generatePearlOptions"
        />
      </el-form-item>
      
      <!-- 每颗珍珠的定制选项 -->
      <div v-if="pearlOptions.length > 0" class="pearl-options-list">
        <h4 style="margin: 20px 0; color: #ff6b6b;">每颗珍珠都要定制！</h4>
        <div 
          v-for="(pearl, index) in pearlOptions" 
          :key="index"
          class="pearl-option-item"
          style="border: 2px solid #ff6b6b; padding: 15px; margin: 10px 0; border-radius: 8px;"
        >
          <h5>第 {{ index + 1 }} 颗珍珠</h5>
          
          <!-- 材质选择 -->
          <el-form-item :label="`珍珠${index + 1}材质`" style="margin: 10px 0;">
            <el-select 
              v-model="pearl.material" 
              placeholder="请选择材质" 
              size="large"
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
          
          <!-- 颜色选择 -->
          <el-form-item :label="`珍珠${index + 1}颜色`" style="margin: 10px 0;">
            <el-select 
              v-model="pearl.color" 
              placeholder="请选择颜色" 
              size="large"
              style="width: 100%;"
              :required="true"
            >
              <el-option label="经典黑色" value="black" />
              <el-option label="活力红色" value="red" />
              <el-option label="清新绿色" value="green" />
              <el-option label="梦幻紫色" value="purple" />
              <el-option label="温暖棕色" value="brown" />
              <el-option label="亮眼黄色" value="yellow" />
              <el-option label="纯净白色" value="white" />
            </el-select>
          </el-form-item>
        </div>
      </div>
      
      <!-- 强制必填提示 -->
      <div v-if="pearlOptions.length > 0" class="required-warning" style="color: #ff4757; font-weight: bold; margin: 10px 0;">
        ⚠️ 每颗珍珠的材质和颜色都必须选择！
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
const carouselImages = ref([
  '/src/assets/products/milktea2.jpg',
  '/src/assets/products/milktea1.jpg',
  '/src/assets/products/coffee1.jpg',
  '/src/assets/products/juice1.jpg'
])
const currentImageIndex = ref(0)
const inconsistentHeights = ref([120, 180, 100, 200]) // 不一致的高度

// 商品定制选项
const selectedSweetness = ref('50') // 默认半糖
const quantity = ref(1)
const pearlCount = ref(3) // 默认3颗珍珠
const pearlOptions = ref([])

// 确认加载状态
const confirmLoading = ref(false)

// 判断是否是珍珠奶茶
const isPearlMilkTea = computed(() => {
  return props.product.label && props.product.label.includes('珍珠')
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
      quantity: quantity.value,
      pearls: isPearlMilkTea.value ? pearlOptions.value : null
    }
    
    emit('confirm', customData)
    confirmLoading.value = false
    handleClose()
  }, 1000)
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
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px dashed #ff6b6b;
}

.pearl-option-item h5 {
  margin: 0 0 10px 0;
  color: #ff6b6b;
}

.required-warning {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>