<template>
  <div class="order-confirm-page">
    <div class="header">
      <el-button 
        type="text" 
        class="back-button" 
        @click="goBack"
      >
        <el-icon><ArrowLeft /></el-icon>
        <span>返回</span>
      </el-button>
      <h2>订单确认</h2>
    </div>
    
    <!-- 付款loading界面 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <el-loading :text="'正在付款...'" type="spinner" />
      </div>
    </div>
    
    <!-- 订单类型信息 -->
    <div class="order-type-info" v-if="state.orderType === 'selfPickUp'">
      <el-icon><Shop /></el-icon>
      <span>到店自取</span>
    </div>
    <div class="order-type-info" v-else>
      <el-icon><Van /></el-icon>
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
            <span>冰量: {{ getIceLabel(item.ice) }}</span>
            <span>杯型: {{ item.cupSize || '500ml' }}</span>
            <span>数量: {{ item.quantity }}</span>
            <span v-if="item.pearls">珍珠: {{ item.pearls.length }}颗</span>
          </div>
        </div>
        <div class="item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
      </div>
    </div>
    
    <!-- 配送/自取信息 -->
    <template v-if="state.orderType === 'deliveryOrder'">
      <div class="delivery-info">
        <div class="delivery-header">
          <h3>配送信息</h3>
          <div class="address-actions">
            <el-button 
              v-if="!addressInfo.address" 
              type="text" 
              @click="showAddAddressForm = true"
              class="add-address-button"
            >
              添加地址
            </el-button>
            <el-button 
              v-else 
              type="text" 
              @click="showEditAddressForm = true"
              class="edit-address-button"
            >
              修改地址
            </el-button>
          </div>
        </div>
        
        <div v-if="addressInfo.address" class="address-details">
          <div class="info-item">
            <el-icon><Location /></el-icon>
            <span>{{ addressInfo.address }}</span>
          </div>
          <div class="info-item">
            <el-icon><User /></el-icon>
            <span>{{ addressInfo.name }}</span>
          </div>
          <div class="info-item">
            <el-icon><Phone /></el-icon>
            <span>{{ addressInfo.phone }}</span>
          </div>
        </div>
        <div v-else class="no-address">
          <p>请添加配送地址</p>
        </div>
      </div>
    </template>
    <template v-else>
      <!-- 自取门店信息 -->
      <div class="store-info">
        <h3>自取门店</h3>
        <div class="info-item">
          <el-icon><Location /></el-icon>
          <span>深南大道店 - 南山区深南大道10000号</span>
        </div>
        <div class="info-item">
          <el-icon><Timer /></el-icon>
          <span>预计等待时间: 15-20分钟</span>
        </div>
        <div class="info-item">
          <el-icon><InfoFilled /></el-icon>
          <span>距离: 0.65海里</span>
        </div>
      </div>
    </template>
    
    <!-- 添加地址表单 -->
    <el-dialog 
      v-model="showAddAddressForm" 
      title="添加地址" 
      width="90%"
    >
      <el-form :model="newAddress" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="newAddress.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="newAddress.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="newAddress.address" placeholder="请输入详细地址" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddAddressForm = false">取消</el-button>
          <el-button type="primary" @click="saveAddress">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 修改地址表单 -->
    <el-dialog 
      v-model="showEditAddressForm" 
      title="修改地址" 
      width="90%"
    >
      <el-form :model="editAddress" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="editAddress.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editAddress.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="editAddress.address" placeholder="请输入详细地址" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditAddressForm = false">取消</el-button>
          <el-button type="primary" @click="updateAddress">保存修改</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 费用详情 -->
    <div class="order-fees" v-if="state.orderType === 'deliveryOrder'">
      <h3>费用详情</h3>
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
      <div class="fee-item" v-if="totalAmount > 0">
        <span>平台活动优惠券: </span>
        <span class="discount">-¥{{ totalAmount.toFixed(2) }}</span>
      </div>
    </div>
    <div class="order-fees" v-else>
      <h3>费用详情</h3>
      <div class="fee-item">
        <span>商品总价: </span>
        <span>¥{{ productTotal.toFixed(2) }}</span>
      </div>
      <div class="fee-item" v-if="totalAmount > 0">
        <span>平台活动优惠券: </span>
        <span class="discount">-¥{{ totalAmount.toFixed(2) }}</span>
      </div>
    </div>
    
    <!-- 总计 -->
    <div class="order-total">
      <div class="total-label">总计:</div>
      <div class="total-amount">¥{{ finalAmount.toFixed(2) }}</div>
    </div>
    
    <!-- 底部按钮容器 -->
    <div class="bottom-buttons">
      <!-- 返回购物车按钮 -->
      <el-button 
        type="default" 
        size="large" 
        class="back-to-cart-button"
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
        style="background-color: #ff6b6b; border-color: #ff6b6b;"
      >
        立即付款
      </el-button>
    </div>
    
    <!-- 地狱级体验：不保存订单的警告 -->
    <div class="warning-note">
      ⚠️ 系统不会记录您的订单，建议截图保存！
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Shop, Van, Location, User, Phone, Timer, InfoFilled } from '@element-plus/icons-vue'
import { state, selfPickUpState, deliveryOrderState } from '../store/state.js'

// 返回上一页
const goBack = () => {
  window.history.back()
}

// 自取门店信息
const currentStore = ref({
  id: 1,
  name: '深南大道店',
  address: '南山区深南大道10000号',
  distance: '0.65海里'
})

// 地址信息
const addressInfo = ref({
  name: '',
  phone: '',
  address: ''
})

// 地址表单状态
const showAddAddressForm = ref(false)
const showEditAddressForm = ref(false)

// 新地址表单
const newAddress = ref({
  name: '',
  phone: '',
  address: ''
})

// 编辑地址表单
const editAddress = ref({
  name: '',
  phone: '',
  address: ''
})

// 登录状态
const isLoggedIn = ref(false)

// loading状态
const isLoading = ref(false)

// 保存地址
const saveAddress = () => {
  if (!newAddress.value.name || !newAddress.value.phone || !newAddress.value.address) {
    ElMessage.error('请填写完整的地址信息')
    return
  }
  
  addressInfo.value = { ...newAddress.value }
  showAddAddressForm.value = false
  
  // 重置表单
  newAddress.value = {
    name: '',
    phone: '',
    address: ''
  }
  
  ElMessage.success('地址添加成功')
}

// 更新地址
const updateAddress = () => {
  if (!editAddress.value.name || !editAddress.value.phone || !editAddress.value.address) {
    ElMessage.error('请填写完整的地址信息')
    return
  }
  
  addressInfo.value = { ...editAddress.value }
  showEditAddressForm.value = false
  ElMessage.success('地址更新成功')
}

// 打开编辑地址表单时，填充当前地址信息
const openEditAddressForm = () => {
  editAddress.value = { ...addressInfo.value }
  showEditAddressForm.value = true
}

// 检查登录状态
const checkLoginStatus = () => {
  // 模拟登录状态检查，实际项目中应该从localStorage或状态管理中获取
  const loginStatus = localStorage.getItem('isLoggedIn')
  isLoggedIn.value = loginStatus === 'true'
}

// 页面加载时检查登录状态
onMounted(() => {
  checkLoginStatus()
})

// 获取当前购物车商品
const currentCartItems = computed(() => {
  if (state.orderType === 'selfPickUp') {
    return selfPickUpState.orders
  } else {
    return deliveryOrderState.orders
  }
})

// 计算商品总价
const productTotal = computed(() => {
  return currentCartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

// 打包费
const packingFee = computed(() => {
  return state.orderType === 'deliveryOrder' ? 2.00 : 0
})

// 配送费
const deliveryFee = computed(() => {
  return state.orderType === 'deliveryOrder' ? 5.00 : 0
})

// 计算总金额
const totalAmount = computed(() => {
  return productTotal.value + packingFee.value + deliveryFee.value
})

// 计算最终支付金额
const finalAmount = computed(() => {
  if (totalAmount.value > 0) {
    // 总价大于0时，优惠金额等于总价，最终支付0元
    return 0
  } else {
    // 总价为负数时，保持原逻辑
    return totalAmount.value
  }
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
  
  // 检查最终金额是否小于0
  if (finalAmount.value < 0) {
    ElMessage.error('总价不能小于0，无法提交订单')
    return
  }
  
  // 检查登录状态
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录')
    window.location.hash = '/login'
    return
  }
  
  // 检查配送地址
  if (state.orderType === 'deliveryOrder' && !addressInfo.value.address) {
    ElMessage.error('请添加配送地址')
    return
  }
  
  // 显示loading界面
  isLoading.value = true
  
  // 清空购物车
  if (state.orderType === 'selfPickUp') {
    selfPickUpState.orders = []
  } else {
    deliveryOrderState.orders = []
  }
  
  // 延迟2秒后跳转到付款成功页面
  setTimeout(() => {
    // 跳转到付款成功页面
    window.location.hash = '/payment'
  }, 2000)
}
</script>

<style scoped>
.order-confirm-page {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
  box-sizing: border-box;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
}

.header .back-button {
  margin-right: 20px;
  color: #333;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.header h2 {
  flex: 1;
  text-align: center;
  margin: 0;
  color: #333;
  font-size: 20px;
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

.delivery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.delivery-header h3 {
  margin: 0;
  color: #333;
}

.address-actions {
  display: flex;
  gap: 10px;
}

.add-address-button,
.edit-address-button {
  color: #ff6b6b;
  font-size: 14px;
}

.no-address {
  padding: 20px;
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #666;
}

.address-details {
  margin-top: 10px;
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
  color: #333;
}

.order-fees {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.order-fees h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.fee-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  color: #333;
}

.fee-item:last-child {
  margin-bottom: 0;
}

.discount {
  color: #ff4757;
  font-weight: bold;
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

.bottom-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.back-to-cart-button {
  width: 100%;
  height: 45px;
  border-color: #ff6b6b;
  color: #ff6b6b;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ff5252;
    color: #ff5252;
  }
}

.pay-button {
  width: 100%;
  height: 50px;
  font-size: 18px;
  background-color: #ff6b6b;
  border-color: #ff6b6b;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #ff5252;
    border-color: #ff5252;
  }
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

/* loading overlay样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
}
</style>