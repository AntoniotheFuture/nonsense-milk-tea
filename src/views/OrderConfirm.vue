<template>
  <div class="order-confirm-page">
    <h2>订单确认</h2>
    
    <!-- 订单类型信息 -->
    <div class="order-type-info" v-if="state.orderType === 'selfPickUp'">
      <el-icon><Shop /></el-icon>
      <span>到店自取</span>
    </div>
    <div class="order-type-info" v-else>
      <el-icon><Truck /></el-icon>
      <span>外卖配送</span>
    </div>
    
    <!-- 商品列表 -->
    <div class="order-items">
      <h3>商品清单</h3>
      <div 
        v-for="(item, index) in currentCartItems" 
        :key="index" 
        class="order-item"
      >
        <div class="item-left">
          <div class="item-name">{{ item.label }}</div>
          <div class="item-details">
            <span>甜度: {{ getSweetnessLabel(item.sweetness) }}</span>
            <span>数量: {{ item.quantity }}</span>
            <span v-if="item.pearls">珍珠: {{ item.pearls.length }}颗</span>
          </div>
        </div>
        <div class="item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
      </div>
    </div>
    
    <!-- 配送/自取信息 -->
    <div class="delivery-info" v-if="state.orderType === 'deliveryOrder'">
      <h3>配送信息</h3>
      <div class="info-item">
        <el-icon><Location /></el-icon>
        <span>南山区深南大道10000号</span>
      </div>
      <div class="info-item">
        <el-icon><User /></el-icon>
        <span>用户</span>
      </div>
      <div class="info-item">
        <el-icon><Phone /></el-icon>
        <span>138****8888</span>
      </div>
    </div>
    
    <!-- 自取门店信息 -->
    <div class="store-info" v-else>
      <h3>自取门店</h3>
      <div class="info-item">
        <el-icon><Location /></el-icon>
        <span>南山区深南大道10000号</span>
      </div>
      <div class="info-item">
        <el-icon><Timer /></el-icon>
        <span>预计等待时间: 15-20分钟</span>
      </div>
    </div>
    
    <!-- 总计 -->
    <div class="order-total">
      <div class="total-label">总计:</div>
      <div class="total-amount">¥{{ totalAmount.toFixed(2) }}</div>
    </div>
    
    <!-- 返回购物车按钮 -->
    <el-button 
      type="default" 
      size="large" 
      class="back-button"
      @click="goBackToCart"
    >
      返回购物车
    </el-button>
    
    <!-- 付款按钮 -->
    <el-button 
      type="primary" 
      size="large" 
      class="pay-button"
      @click="proceedToPayment"
    >
      立即付款
    </el-button>
    
    <!-- 地狱级体验：不保存订单的警告 -->
    <div class="warning-note">
      ⚠️ 系统不会记录您的订单，建议截图保存！
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { state, selfPickUpState, deliveryOrderState } from '../store/state.js'

// 获取当前购物车商品
const currentCartItems = computed(() => {
  if (state.orderType === 'selfPickUp') {
    return selfPickUpState.orders
  } else {
    return deliveryOrderState.orders
  }
})

// 计算总金额
const totalAmount = computed(() => {
  return currentCartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

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

// 返回购物车
const goBackToCart = () => {
  window.location.hash = '/cart'
}

// 跳转到付款页面
const proceedToPayment = () => {
  // 验证购物车不为空
  if (currentCartItems.value.length === 0) {
    ElMessage.warning('购物车为空，无法结算')
    return
  }
  
  // 清空购物车
  if (state.orderType === 'selfPickUp') {
    selfPickUpState.orders = []
  } else {
    deliveryOrderState.orders = []
  }
  
  // 跳转到付款成功页面
  window.location.hash = '/payment'
}
</script>

<style scoped>
.order-confirm-page {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.order-type-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  background: #e3f2fd;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: bold;
  color: #1976d2;
}

.order-items {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.order-items h3 {
  margin-bottom: 15px;
  color: #333;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.item-left {
  flex: 1;
}

.item-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.item-details {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
  color: #666;
}

.item-price {
  color: #ff6b6b;
  font-weight: bold;
  min-width: 60px;
  text-align: right;
}

.delivery-info, .store-info {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.delivery-info h3, .store-info h3 {
  margin-bottom: 15px;
  color: #333;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 5px 0;
}

.order-total {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.total-label {
  font-size: 18px;
  font-weight: bold;
}

.total-amount {
  font-size: 24px;
  font-weight: bold;
  color: #ff6b6b;
}

.back-button {
  width: 100%;
  height: 45px;
  margin-bottom: 10px;
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.pay-button {
  width: 100%;
  height: 50px;
  font-size: 18px;
  margin-bottom: 20px;
}

.warning-note {
  text-align: center;
  color: #ff4757;
  font-weight: bold;
  font-size: 14px;
  animation: blink 2s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>