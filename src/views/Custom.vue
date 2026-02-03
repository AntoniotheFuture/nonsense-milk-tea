<template>
  <div class="custom-page">
    <div class="user-info">
      <el-avatar :size="80" icon="User" class="user-avatar" />
      <h2>{{ userName }}</h2>
      <p v-if="!state.isLogin" class="login-prompt">请先登录</p>
    </div>
    
    <div class="user-actions">
      <el-button type="primary" @click="goToLogin" v-if="!state.isLogin">去登录</el-button>
      <el-button type="danger" @click="logout" v-else>退出登录</el-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { state } from '../store/state.js'

// 获取用户名
const userName = computed(() => {
  return state.isLogin ? state.userInfo.username : '游客'
})

// 去登录页面
const goToLogin = () => {
  window.location.hash = '/login'
}

// 退出登录
const logout = () => {
  state.isLogin = false
  state.userInfo = {}
  window.location.hash = '/'
}
</script>

<style scoped>
.custom-page {
  width: 100%;
  box-sizing: border-box;
  padding: 40px 20px;
  min-height: calc(100vh - 60px);
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

.user-avatar {
  margin-bottom: 20px;
  border: 4px solid #ff6b6b;
}

.user-info h2 {
  margin-bottom: 10px;
  color: #333;
}

.login-prompt {
  color: #ff6b6b;
  font-size: 16px;
}

.user-actions {
  display: flex;
  gap: 20px;
}
</style>