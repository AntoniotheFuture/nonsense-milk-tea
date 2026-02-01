<script setup>
import { defineComponent, onMounted, ref, useTemplateRef, defineOptions } from 'vue'
import Ad from '../components/Ad.vue'
import Home from './Home.vue'
import Order from './Order.vue'
import Custom from './Custom.vue'
import NavButton from '../components/NavButton.vue'

// 页面状态（模拟路由，不保存登录态）
const currentPage = ref('Home')
const showErrorModal = ref(false) // 关不掉的错误弹窗

// 添加广告倒计时功能
const showAdOverlay = ref(false)
const adCountdown = ref(10)
const adInterval = ref(null)

defineOptions({
  components: {
    Home,
    Order,
    Custom,
    NavButton
  }
})

const adConfig = ref({
  adImgUrl: '/src/assets/img/ads/big-ad1.jpg',
  countDown: 8,
  stopAble: false,
  actionType: 'web', // 'web' 或 'internal'
  actionUrl: 'https://www.example.com/advertisement'
})

const adRef = useTemplateRef('adRef')

onMounted(() => {
  // 判断今天有没有显示过广告，如果没有，则显示
  const today = new Date().toDateString()
  const lastAdDate = localStorage.getItem('lastAdDate')
  if (lastAdDate !== today) {
    adRef.value.start('/src/assets/img/ads/ad1.png', 8, false)
  }
  
  // 启动广告倒计时
  startAdTimer()
})

let adEnd = () => {
  // 广告结束后的操作
  const today = new Date().toDateString()
  localStorage.setItem('lastAdDate', today)
}

let adClick = () => {
  // 广告点击后的操作，比如跳转到广告详情页
  if (adConfig.value.actionType === 'internal') {
    // 内部跳转逻辑
    location.href = adConfig.value.actionUrl
  } else if (adConfig.value.actionType === 'web') {
    window.open(adConfig.value.actionUrl, '_blank')
  }
}

// 广告倒计时功能
const startAdTimer = () => {
  // 检查是否已经显示过今天的广告
  const today = new Date().toDateString()
  const lastAdDate = localStorage.getItem('forcedAdDate')
  
  if (lastAdDate !== today) {
    showAdOverlay.value = true
    adCountdown.value = 10
    
    adInterval.value = setInterval(() => {
      adCountdown.value--
      if (adCountdown.value <= 0) {
        clearInterval(adInterval.value)
        showAdOverlay.value = false
        // 记录今天已经显示过强制广告
        localStorage.setItem('forcedAdDate', today)
      }
    }, 1000)
  }
}

// 关闭广告（只是显示确认对话框，不会真正关闭倒计时）
const closeAd = () => {
  confirm('您确定要关闭广告吗？广告将在倒计时结束后自动消失。')
  // 不实际关闭广告，倒计时继续
}

</script>

<template>
  <div class="index">
    <component :is="currentPage"
      @goToOrder="currentPage = 'Order'"
      @goToUser="currentPage = 'Custom'"
    />

    <div class="bottom-nav">
      <NavButton label="首页" color="#000" :active="currentPage === 'Home'" @click="currentPage = 'Home'"></NavButton>
      <NavButton label="点单" color="#000" :active="currentPage === 'Order'" @click="currentPage = 'Order'"></NavButton>
      <NavButton label="我的" color="#000" :active="currentPage === 'Custom'" @click="currentPage = 'Custom'"></NavButton>
    </div>
  </div>

  <!-- 强制广告倒计时覆盖层 -->
  <div v-if="showAdOverlay" class="ad-overlay">
    <div class="ad-content">
      <img src="/src/assets/ads/big-ad1.jpg" alt="Advertisement" style="width: 100%; height: 80%; object-fit: cover;">
      <div class="ad-timer">广告剩余 {{ adCountdown }} 秒</div>
      <button @click="closeAd" class="close-ad-btn">X</button>
    </div>
  </div>

  <!-- 强制广告组件 -->
  <Ad ref="adRef" @adEnd="adEnd" @adClick="adClick"/>

  <!-- 错误弹窗（关不掉） -->
  <el-dialog v-model="showErrorModal" title="错误：操作失败！" width="30%" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false">
    <p>请退出页面重新进入</p>
  </el-dialog>
</template>

<style lang="less" scoped>
.index {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
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
}

.ad-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.ad-content {
  position: relative;
  width: 90%;
  max-width: 400px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  border: 3px solid #ff6b6b;
}

.ad-timer {
  margin-top: 15px;
  font-size: 20px;
  font-weight: bold;
  color: #8B0000;
  text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
}

.close-ad-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(45deg, #ff4757, #ff6b6b);
  color: white;
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
</style>