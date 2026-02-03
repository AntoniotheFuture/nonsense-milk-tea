<template>
  <el-button type="text" @click="goBack" class="back-button">
    <el-icon><ArrowLeft /></el-icon> {{ text }}
  </el-button>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: '返回'
  }
})

const goBack = () => {
  window.history.back()
}
</script>

<style scoped>
.back-button {
  font-size: 16px;
  color: #ff6b6b !important;
  
  &:hover {
    color: #ff5252 !important;
  }
}
</style>