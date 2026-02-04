<script setup>
import { defineComponent, onMounted, ref, useTemplateRef, defineOptions, watch } from 'vue'
import Ad from '../components/Ad.vue'
import Home from './Home.vue'
import Order from './Order.vue'
import Cart from './Cart.vue'
import Custom from './Custom.vue'
import NavButton from '../components/NavButton.vue'

// 页面状态（使用hash路由）
const currentPage = ref('Home')
const showErrorModal = ref(false) // 关不掉的错误弹窗

// 组件映射
const pageComponents = {
  'Home': Home,
  'Order': Order,
  'Cart': Cart,
  'Custom': Custom
}

// hash路由映射
const hashToPage = {
  '#/': 'Home',
  '#/order': 'Order',
  '#/cart': 'Cart',
  '#/custom': 'Custom'
}

// 页面到hash映射
const pageToHash = {
  'Home': '#/',
  'Order': '#/order',
  'Cart': '#/cart',
  'Custom': '#/custom'
}

defineOptions({
  components: {
    Home,
    Order,
    Cart,
    Custom,
    NavButton
  }
})

const adRef = useTemplateRef('adRef')

// 监听hash变化
const updatePageFromHash = () => {
  const hash = window.location.hash
  currentPage.value = hashToPage[hash] || 'Home'
}

// 监听页面变化，更新hash
watch(currentPage, (newPage) => {
  const hash = pageToHash[newPage]
  if (hash && window.location.hash !== hash) {
    window.location.hash = hash
  }
})

onMounted(() => {
  // 初始化页面
  updatePageFromHash()
  
  // 监听hash变化
  window.addEventListener('hashchange', updatePageFromHash)
  
  // 检查今天是否已经显示过广告
  const today = new Date().toDateString()
  const lastAdDate = localStorage.getItem('lastAdDate')
  
  if (lastAdDate !== today) {
    // 今天还没显示过广告，显示广告
    adRef.value.start('/src/assets/img/ads/ad1.png', 10, false)
    // 记录今天的日期
    localStorage.setItem('lastAdDate', today)
  }
})

let adEnd = () => {
  // 广告结束后的操作
}

let adClick = () => {
  // 广告点击后的操作
  window.open('https://www.example.com/advertisement', '_blank')
}

</script>

<template>
  <div class="index">
    <div class="main">
      <component 
        :is="pageComponents[currentPage]"
        :key="currentPage"
        @goToOrder="currentPage = 'Order'"
        @goToCart="currentPage = 'Cart'"
        @goToUser="currentPage = 'Custom'"
      />
    </div>
    

    <div class="bottom-nav">
      <NavButton 
        label="首页" 
        :active="currentPage === 'Home'" 
        @click="currentPage = 'Home'"
      >
        <template #el-icon>
          <House />
        </template>
      </NavButton>
      <NavButton 
        label="点单" 
        :active="currentPage === 'Order'" 
        @click="currentPage = 'Order'"
      >
        <template #el-icon>
          <Coffee />
        </template>
      </NavButton>
      <NavButton 
        label="购物车" 
        :active="currentPage === 'Cart'" 
        @click="currentPage = 'Cart'"
      >
        <template #el-icon>
          <ShoppingCart />
        </template>
      </NavButton>
      <NavButton 
        label="我的" 
        :active="currentPage === 'Custom'" 
        @click="currentPage = 'Custom'"
      >
        <template #el-icon>
          <User />
        </template>
      </NavButton>
    </div>
  </div>

  <!-- 广告组件 -->
  <Ad ref="adRef" @adEnd="adEnd" @adClick="adClick"/>

  <!-- 错误弹窗（关不掉） -->
  <el-dialog v-model="showErrorModal" title="错误：操作失败！" width="30%" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false">
    <p>请退出页面重新进入</p>
  </el-dialog>
</template>

<style lang="less" scoped>
.index {
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 60px; /* 为底部导航留出空间 */
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .main {
    flex: auto;
    width: 100%;
    overflow-y: auto;
  }
  .bottom-nav {
    flex: none;
    height: 60px;
    width: 100%;
  }
}

/* 确保页面组件可以正常滚动 */
.index > *:not(.bottom-nav) {
  width: 100%;
  min-height: calc(100vh - 60px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
</style>