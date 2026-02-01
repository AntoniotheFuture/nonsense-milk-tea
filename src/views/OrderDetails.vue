<template>
  <div class="order-details-page">
    <h2>订单详情</h2>
    
    <!-- 订单状态 -->
    <div class="order-status" v-if="state.orderType === 'selfPickUp'">
      <el-icon><Timer /></el-icon>
      <span>排队中...</span>
    </div>
    <div class="order-status" v-else>
      <el-icon><Truck /></el-icon>
      <span>配送中...</span>
    </div>
    
    <!-- 排队号/配送信息 -->
    <div class="queue-info" v-if="state.orderType === 'selfPickUp'">
      <div class="queue-number">您的排队号: #{{ queueNumber }}</div>
      <div class="estimated-time">预计等待时间: {{ estimatedTime }}分钟</div>
      <div class="current-serving">当前服务: #{{ currentServing }}</div>
    </div>
    <div class="delivery-info" v-else>
      <div class="delivery-status">骑手已接单</div>
      <div class="delivery-time">预计送达: {{ deliveryTime }}</div>
      <div class="rider-info">骑手: 张师傅 (138****1234)</div>
    </div>
    
    <!-- 商品清单 -->
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
    
    <!-- 总计 -->
    <div class="order-total">
      <div class="total-label">总计:</div>
      <div class="total-amount">¥{{ totalAmount.toFixed(2) }}</div>
    </div>
    
    <!-- 地狱级体验警告 -->
    <div class="warning-note">
      ⚠️ 系统不会记录您的订单，建议截图保存！
    </div>
    
    <!-- 如果用户离开此页面就无法返回的提示 -->
    <div class="no-return-warning">
      ❗ 离开此页面后将无法再次查看订单状态！
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { state, selfPickUpState, deliveryOrderState } from '../store/state.js'

// 模拟排队信息
const queueNumber = ref(0)
const currentServing = ref(0)
const estimatedTime = ref(0)

// 模拟配送信息
const deliveryTime = ref('')

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

onMounted(() => {
  if (state.orderType === 'selfPickUp') {
    // 生成随机排队信息
    queueNumber.value = Math.floor(Math.random() * 50) + 10
    currentServing.value = Math.floor(Math.random() * 10) + 1
    estimatedTime.value = Math.floor(Math.random() * 15) + 10
  } else {
    // 生成配送时间
    const now = new Date()
    now.setMinutes(now.getMinutes() + 30 + Math.floor(Math.random() * 20))
    deliveryTime.value = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
})
</script>

<style scoped>
.order-details-page {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.order-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  border-radius: 8px;
  margin-bottom: 20px;
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.queue-info, .delivery-info {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.queue-number {
  font-size: 24px;
  font-weight: bold;
  color: #ff6b6b;
  margin-bottom: 10px;
}

.estimated-time, .delivery-time {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.current-serving, .rider-info, .delivery-status {
  color: #666;
  font-size: 14px;
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
  text-align: left;
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

.warning-note {
  text-align: center;
  color: #ff4757;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 20px;
  animation: blink 2s infinite;
}

.no-return-warning {
  text-align: center;
  color: #ff6b6b;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 20px;
  background: #fff5f5;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #ff4757;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>