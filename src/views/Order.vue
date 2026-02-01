<script setup>
// 点单界面
import { useTemplateRef, ref, onMounted, onUnmounted, computed } from 'vue'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import ProductClassification from '../components/ProductClassification.vue';
import ProductCustomDialog from '../components/ProductCustomDialog.vue';
import { state, selfPickUpState, deliveryOrderState } from '../store/state.js'

// 添加随机价格变动
let priceChangeTimer = null
const originalProductList = [
    {
        classification: '奶茶',
        name: '奶茶',
        list: [
            {
                id: 1,
                label: '经典奶茶',
                price: 12.00,
                image: '/src/assets/products/milktea1.jpg',
                description: '经典港式奶茶，丝滑醇香'
            },
            {
                id: 2,
                label: '珍珠奶茶',
                price: 15.00,
                image: '/src/assets/products/milktea2.jpg',
                description: 'Q弹珍珠搭配香浓奶茶，经典之选'
            }
        ]
    },
    {
        classification: '咖啡',
        name: '咖啡',
        list: [
            {
                id: 3,
                label: '拿铁咖啡',
                price: 18.00,
                image: '/src/assets/products/coffee1.jpg',
                description: '意式浓缩与牛奶的完美融合'
            }
        ]
    },
    {
        classification: '果汁',
        name: '果汁',
        list: [
            {
                id: 4,
                label: '橙汁',
                price: 10.00,
                image: '/src/assets/products/juice1.jpg',
                description: '100%鲜榨橙汁，维C满满'
            }
        ]
    },
];

const classification = ref('奶茶');
const classificationList = ['奶茶', '咖啡', '果汁'];
const productList = ref(JSON.parse(JSON.stringify(originalProductList))); // 深拷贝

// 商品定制对话框
const customDialogVisible = ref(false)
const selectedProduct = ref(null)

// 购物车相关
const cartItems = ref([])
const showCartDrawer = ref(false)

// 随机价格变动功能
const changeRandomPrices = () => {
  productList.value.forEach(category => {
    category.list.forEach(product => {
      // 随机改变价格，±2元浮动
      const priceChange = (Math.random() - 0.5) * 4; // -2到+2的随机数
      product.price = parseFloat((product.price + priceChange).toFixed(2));
    });
  });
};

onMounted(() => {
  // 每隔30秒随机改变价格
  priceChangeTimer = setInterval(() => {
    if (Math.random() < 0.7) { // 70% 概率改变价格
      changeRandomPrices();
      ElMessage.info('商品价格刚刚更新！');
    }
  }, 30000); // 30秒
  
  // 初始化购物车（从store获取）
  updateCartFromStore()
});

// 组件卸载时清理定时器
onUnmounted(() => {
  if (priceChangeTimer) {
    clearInterval(priceChangeTimer);
  }
});

const selectClassification = (value) => {
    classification.value = value;
    scrollToClassification(value);
};

const scrollToClassification = (classificationName) => {
    const targetElement = document.querySelector(`[data-classification="${classificationName}"]`);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
    }
};

// 打开商品定制对话框
const openCustomDialog = (product) => {
  selectedProduct.value = { ...product }
  customDialogVisible.value = true
}

// 处理商品定制确认
const handleCustomConfirm = (customData) => {
  const item = {
    ...selectedProduct.value,
    ...customData,
    id: Date.now() // 确保唯一ID
  }
  
  // 添加到购物车
  cartItems.value.push(item)
  
  // 根据订单类型保存到对应的store
  if (state.orderType === 'selfPickUp') {
    selfPickUpState.addItem2Cart(item)
  } else {
    deliveryOrderState.addItem2Cart(item)
  }
  
  ElMessage.success('已添加到购物车！')
}

// 更新购物车显示
const updateCartFromStore = () => {
  if (state.orderType === 'selfPickUp') {
    cartItems.value = [...selfPickUpState.orders]
  } else {
    cartItems.value = [...deliveryOrderState.orders]
  }
}

// 计算购物车总价
const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

// 显示购物车抽屉
const toggleCartDrawer = () => {
  showCartDrawer.value = !showCartDrawer.value
}

// 删除购物车商品
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

// 结算功能
const checkout = () => {
  if (cartItems.value.length === 0) {
    ElMessage.warning('购物车为空，请先添加商品')
    return
  }
  
  // 跳转到订单确认页面（需要路由支持）
  alert('跳转到订单确认页面 - 功能待开发')
}
</script>

<template>
  <div class="order-page">
    <!-- 配送类型选择器 -->
    <div class="order-type-selector">
        <el-link :type="state.orderType === 'selfPickUp' ? 'primary' : ''" @click="state.orderType = 'selfPickUp'">到店自取</el-link>
        <el-link :type="state.orderType === 'deliveryOrder' ? 'primary' : ''" @click="state.orderType = 'deliveryOrder'">外卖配送</el-link>
    </div>
    <template v-if="state.orderType === 'selfPickUp'">
        <div class="store-info">
          <el-icon><Location /></el-icon>
          <span>您最近的门店：南山区深南大道10000号（1.2km）</span>
        </div>
    </template>
    <template v-else>
        <div class="delivery-info">
          <el-icon><Location /></el-icon>
          <span>配送地址：南山区深南大道10000号</span>
        </div>
    </template>
    
    <!-- 商品分类导航 -->
    <div class="classification-nav">
      <el-tabs v-model="classification" type="scrollable" @tab-change="selectClassification">
        <el-tab-pane 
          v-for="item in classificationList" 
          :key="item" 
          :label="item" 
          :name="item"
        >
          <div 
            v-for="category in productList" 
            :key="category.classification"
            v-show="category.classification === item"
            :data-classification="category.classification"
            class="product-category"
          >
            <div 
              v-for="product in category.list" 
              :key="product.id" 
              class="product-item"
              @click="openCustomDialog(product)"
            >
              <img :src="product.image" :alt="product.label" class="product-img">
              <div class="product-info">
                <div class="product-label">{{ product.label }}</div>
                <div class="product-price">¥{{ product.price }}</div>
                <el-button type="primary" size="small" style="margin-top: 5px;">添加到购物车</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  
  <!-- 购物车抽屉 -->
  <el-drawer
    v-model="showCartDrawer"
    :with-header="false"
    direction="bottom"
    size="50%"
    :modal="true"
    :close-on-click-modal="false"
  >
    <div class="cart-drawer">
      <div class="cart-header">
        <h3>购物车</h3>
        <el-button @click="showCartDrawer = false" circle>
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      
      <div v-if="cartItems.length === 0" class="empty-cart">
        购物车为空
      </div>
      
      <div v-else class="cart-items">
        <div 
          v-for="(item, index) in cartItems" 
          :key="item.id" 
          class="cart-item"
        >
          <div class="item-info">
            <div class="item-name">{{ item.label }}</div>
            <div class="item-details">
              甜度: {{ getSweetnessLabel(item.sweetness) }} · 数量: {{ item.quantity }}
            </div>
            <div v-if="item.pearls" class="pearl-details">
              珍珠: {{ item.pearls.length }}颗
            </div>
          </div>
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
      
      <div class="cart-footer">
        <div class="total">总计: ¥{{ cartTotal.toFixed(2) }}</div>
        <el-button 
          type="primary" 
          size="large" 
          @click="checkout"
          :disabled="cartItems.length === 0"
        >
          结算
        </el-button>
      </div>
    </div>
  </el-drawer>
  
  <!-- 商品定制对话框 -->
  <ProductCustomDialog
    v-model="customDialogVisible"
    :product="selectedProduct"
    @confirm="handleCustomConfirm"
  />
  
  <!-- 底部购物车按钮 -->
  <div class="cart-bottom-bar" v-if="cartItems.length > 0">
    <div class="cart-summary">
      <el-badge :value="cartItems.length" class="cart-badge">
        <el-icon><ShoppingCart /></el-icon>
      </el-badge>
      <span>¥{{ cartTotal.toFixed(2) }}</span>
    </div>
    <el-button type="primary" @click="toggleCartDrawer">查看购物车</el-button>
  </div>
</template>

<style lang="less" scoped>
.order-page {
  padding: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
  background-color: #f5f5f5;
}

.order-type-selector {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
  padding: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.store-info, .delivery-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  margin-bottom: 20px;
  background: #e3f2fd;
  border-radius: 8px;
  border-left: 4px solid #2196f3;
}

.classification-nav {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  :deep(.el-tabs__nav-wrap)::after {
    background-color: #f0f0f0;
  }
}

.product-category {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  padding: 10px 0;
}

.product-item {
  display: flex;
  flex-direction: column;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  background: white;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
}

.product-img {
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.product-info {
  padding: 10px;
  text-align: center;
}

.product-label {
  font-size: 14px;
  margin-bottom: 5px;
  font-weight: 500;
}

.product-price {
  color: #ff6b6b;
  font-weight: bold;
  font-size: 16px;
}

// 购物车抽屉样式
.cart-drawer {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.empty-cart {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.item-info {
  flex: 1;
  margin-right: 15px;
}

.item-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.item-details, .pearl-details {
  font-size: 12px;
  color: #666;
}

.item-price {
  color: #ff6b6b;
  font-weight: bold;
  min-width: 60px;
  text-align: right;
}

.cart-footer {
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.total {
  font-size: 18px;
  font-weight: bold;
  text-align: right;
  margin-bottom: 10px;
  color: #ff6b6b;
}

// 底部购物车按钮
.cart-bottom-bar {
  position: fixed;
  bottom: 60px;
  left: 0;
  width: 100%;
  background: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
}

.cart-summary {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cart-badge {
  font-size: 18px;
}

.cart-badge ::v-deep(.el-badge__content) {
  top: -5px;
  right: -5px;
}
</style>