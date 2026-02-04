<template>
  <div class="cart-page">
    <div class="cart-header">
    <h2>购物车</h2>
  </div>
    
    <div v-if="cartItems.length === 0" class="empty-cart">
      <el-empty description="购物车为空" />
      <el-button type="primary" @click="goToOrder">去点单</el-button>
    </div>
    
    <div v-else class="cart-content">
      <div class="cart-items">
        <div 
          v-for="(item, index) in cartItems" 
          :key="item.id" 
          class="cart-item"
        >
          <img :src="item.image" :alt="item.label" class="item-image">
          <div class="item-info">
            <div class="item-name">{{ item.label }}</div>
            <div class="item-details">
              甜度: {{ getSweetnessLabel(item.sweetness) }} · 冰量: {{ getIceLabel(item.ice) }} · 杯型: {{ item.cupSize || '500ml' }} · 数量: {{ item.quantity }}
            </div>
            <div v-if="item.pearls" class="pearl-details">
              珍珠: {{ item.pearls.length }}颗
            </div>
          </div>
          <div class="item-actions">
            <div class="item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
            <el-button 
              type="danger" 
              size="small" 
              @click="removeCartItem(index)"
              circle
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
      
      <div class="cart-footer">
        <div class="fee-section" v-if="state.orderType === 'deliveryOrder'">
          <div class="fee-item">
            <span>商品总价: </span>
            <span>¥{{ productTotal.toFixed(2) }}</span>
          </div>
          <div class="fee-item">
            <span>打包费: </span>
            <span>¥{{ packingFee.toFixed(2) }}</span>
          </div>
          <div class="fee-item">
            <span>配送费: </span>
            <span>¥{{ deliveryFee.toFixed(2) }}</span>
          </div>
        </div>
        <div class="total-section">
          <span>总计: </span>
          <strong>¥{{ cartTotal.toFixed(2) }}</strong>
        </div>
        <div class="checkout-section">
          <el-button 
            type="primary" 
            size="large" 
            @click="checkout"
            :disabled="cartItems.length === 0"
            class="checkout-btn"
          >
            结算
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 错误弹框 -->
    <CommonDialog
      v-model="errorDialogVisible"
      title="错误"
      :show-cancel="false"
      :show-confirm="false"
    >
      <p>总价不能小于0，无法提交订单</p>
    </CommonDialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import CommonDialog from '../components/CommonDialog.vue'
import { state, selfPickUpState, deliveryOrderState } from '../store/state.js'

const emit = defineEmits(['goToOrder'])

const cartItems = ref([])
const errorDialogVisible = ref(false)

// 获取甜度标签
const getSweetnessLabel = (sweetness) => {
  const map = {
    'zero': 'Zero糖',
    '25': '25%糖', 
    '50': '半糖',
    '100': '百分百糖'
  }
  return map[sweetness] || sweetness
}

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

// 更新购物车
const updateCart = () => {
  if (state.orderType === 'selfPickUp') {
    cartItems.value = [...selfPickUpState.orders]
  } else {
    cartItems.value = [...deliveryOrderState.orders]
  }
}

// 计算商品总价
const productTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

// 打包费
const packingFee = computed(() => {
  return state.orderType === 'deliveryOrder' ? 2.00 : 0
})

// 配送费
const deliveryFee = computed(() => {
  return state.orderType === 'deliveryOrder' ? 5.00 : 0
})

// 计算总价
const cartTotal = computed(() => {
  return productTotal.value + packingFee.value + deliveryFee.value
})

// 返回首页（因为没有真正的路由，回到首页）
const goBack = () => {
  // 在你们的hash路由系统中，回到首页
  window.location.hash = '/'
}

// 去点单页面
const goToOrder = () => {
  // 使用hash导航跳转到点单页面
  window.location.hash = '#/order'
}

// 删除商品
const removeCartItem = (index) => {
  const removedItem = cartItems.value.splice(index, 1)[0]
  
  // 从store中移除
  if (state.orderType === 'selfPickUp') {
    const storeIndex = selfPickUpState.orders.findIndex(item => item.id === removedItem.id)
    if (storeIndex > -1) {
      selfPickUpState.orders.splice(storeIndex, 1)
    }
  } else {
    const storeIndex = deliveryOrderState.orders.findIndex(item => item.id === removedItem.id)
    if (storeIndex > -1) {
      deliveryOrderState.orders.splice(storeIndex, 1)
    }
  }
  
  ElMessage.info('商品已移除')
}

// 结算 - 跳转到订单确认页面
const checkout = () => {
  if (cartItems.value.length === 0) {
    ElMessage.warning('购物车为空，请先添加商品')
    return
  }
  
  // 检查总价是否小于0
  if (cartTotal.value < 0) {
    errorDialogVisible.value = true
    return
  }
  
  // 使用hash路由跳转到订单确认页面
  window.location.hash = '/order-confirm'
}

onMounted(() => {
  updateCart()
})
</script>

<style scoped>
.cart-page {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.empty-cart {
  text-align: center;
  padding: 40px 20px;
  
  .el-button {
    margin-top: 20px;
  }
}

.cart-content {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.cart-items {
  padding: 0 15px;
}

.cart-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 15px;
}

.item-info {
  flex: 1;
  margin-right: 15px;
}

.item-name {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
}

.item-details, .pearl-details {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 80px;
}

.item-price {
  color: #ff6b6b;
  font-weight: bold;
  margin-bottom: 8px;
}

.cart-footer {
  position: fixed;
  bottom: 60px;
  left: 0;
  right: 0;
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  background: white;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  z-index: 100;
  box-sizing: border-box;
}

.checkout-section {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
}

/* 为购物车内容添加底部间距，避免被fixed的footer遮挡 */
.cart-items {
  padding: 0 15px;
  padding-bottom: 100px;
}

.fee-section {
  width: 100%;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-sizing: border-box;
}

.fee-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}

.fee-item:last-child {
  margin-bottom: 0;
}

.total-section {
  font-size: 18px;
  
  strong {
    color: #ff6b6b;
  }
}

.checkout-btn {
  width: 120px;
}
</style>