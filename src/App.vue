<script setup>
import { ref, computed } from 'vue'
import Index from './views/Index.vue'
import Login from './views/Login.vue'

const routes = {
  '/': {
    component: Index,
    title: '五彩珍珠',
  },
  '/login': {
    component: Login,
    title: '用户登录',
  },
  '/order-detail': {
    component: () => import('./views/OrderDetail.vue'),
    title: '订单详情',
  },
}

const currentPath = ref(window.location.hash)
window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
  document.title = routes[currentPath.value.slice(1) || '/']?.title || '五彩珍珠'
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/']?.component || Index
})
</script>

<template>
  <!-- 页面切换 -->
  <component :is="currentView" />
</template>