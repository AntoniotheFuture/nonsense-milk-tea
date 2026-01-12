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

</script>

<template>
  <div class="index">
    <component :is="currentPage"
      @goToOrder="currentPage = 'Order'"
    />

    <div class="bottom-nav">
      <NavButton label="首页" color="#000" :active="currentPage === 'Home'" @click="currentPage = 'Home'"></NavButton>
      <NavButton label="点单" color="#000" :active="currentPage === 'Order'" @click="currentPage = 'Order'"></NavButton>
      <NavButton label="我的" color="#000" :active="currentPage === 'Custom'" @click="currentPage = 'Custom'"></NavButton>
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
</style>