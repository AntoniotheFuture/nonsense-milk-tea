<script setup>
import { ref } from 'vue'
import Ad from './components/Ad.vue'
import Home from './views/Home.vue'
import Order from './views/Order.vue'
import Custom from './views/Custom.vue'
const emit = defineEmits(['goToLogin'])

// 页面状态（模拟路由，不保存登录态）
const currentPage = ref('Home')
const showAd = ref(true) // 强制广告
const showErrorModal = ref(false) // 关不掉的错误弹窗

const goToLogin = () => {
    emit('goToLogin')
}
</script>

<template>
  <div class="index">
    <component :is="currentPage"
      @goToLogin="goToLogin"
    />

    <div class="bottom-nav">
      <NavButton label="首页" color="#000" :active="currentPage === 'Home'"></NavButton>
      <NavButton label="点单" color="#000" :active="currentPage === 'Order'"></NavButton>
      <NavButton label="我的" color="#000" :active="currentPage === 'Custom'"></NavButton>
    </div>
  </div>

  <!-- 强制广告组件 -->
  <Ad v-if="showAd" @adEnd="showAd = false" />

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