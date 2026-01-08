<script setup>
import { ref } from 'vue'
import Loading from './views/Loading.vue'
import Login from './views/Login.vue'

// 页面状态（模拟路由，不保存登录态）
const currentPage = ref('Loading')
const showAd = ref(true) // 强制广告
const showErrorModal = ref(false) // 关不掉的错误弹窗
</script>

<template>
  <!-- 页面切换 -->
  <component :is="currentPage"
    @loadDone="currentPage = 'Home'"
    @gotoLogin="currentPage = 'Login'"
  />
</template>