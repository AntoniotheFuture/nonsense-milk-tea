<template>
  <div class="payment-page">
    <!-- 付款成功动画 -->
    <div class="success-animation">
      <div class="checkmark">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 13L9 17L19 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    
    <h2>付款成功！</h2>
    
    <div class="payment-info">
      <div class="info-item">
        <span>订单金额:</span>
        <span class="amount">¥{{ totalAmount.toFixed(2) }}</span>
      </div>
      <div class="info-item">
        <span>支付方式:</span>
        <span>微信支付</span>
      </div>
      <div class="info-item">
        <span>支付时间:</span>
        <span>{{ paymentTime }}</span>
      </div>
    </div>
    
    <!-- 查看订单按钮 -->
    <el-button 
      type="primary" 
      size="large" 
      class="view-order-button"
      @click="viewOrderDetails"
    >
      查看订单详情
    </el-button>
    
    <!-- 地狱级体验警告 -->
    <div class="warning-message">
      ⚠️ 系统不会记录您的订单，建议截图保存！
    </div>
    
    <!-- 返回首页按钮 -->
    <el-button 
      size="large" 
      class="back-home-button"
      @click="goBackHome"
    >
      返回首页
    </el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { state, selfPickUpState, deliveryOrderState } from '../store/state.js'

// 计算总金额
const totalAmount = ref(0)
const paymentTime = ref('')

// 获取当前购物车商品并计算总金额
const calculateTotal = () => {
  let items = []
  if (state.orderType === 'selfPickUp') {
    items = selfPickUpState.orders
  } else {
    items = deliveryOrderState.orders
  }
  
  totalAmount.value = items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

onMounted(() => {
  calculateTotal()
  paymentTime.value = new Date().toLocaleString('zh-CN')
})

// 查看订单详情
const viewOrderDetails = () => {
  // 跳转到订单详情页面
  window.location.hash = '/order-details'
}

// 返回首页
const goBackHome = () => {
  // 跳转到首页
  window.location.hash = '/'
}
</script>

<style scoped>
.payment-page {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success-animation {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px 0;
  animation: pulse 1s ease-in-out;
}

.checkmark svg {
  width: 60px;
  height: 60px;
}

h2 {
  color: #4CAF50;
  margin-bottom: 30px;
  font-size: 24px;
}

.payment-info {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.info-item:last-child {
  border-bottom: none;
}

.amount {
  color: #ff6b6b;
  font-weight: bold;
}

.view-order-button {
  width: 100%;
  max-width: 400px;
  height: 50px;
  font-size: 18px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  border: none;
}

.warning-message {
  text-align: center;
  color: #ff4757;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 20px;
  animation: blink 2s infinite;
}

.back-home-button {
  width: 100%;
  max-width: 400px;
  height: 50px;
  font-size: 16px;
  border: 2px solid #999;
  color: #999;
}

@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>