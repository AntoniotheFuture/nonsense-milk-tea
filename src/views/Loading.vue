<template>
  <div class="loading-page">
    <h1>奶茶点单系统 V1.0（练手版）</h1>
    <div class="loading">
      <el-progress :percentage="percentage" :status="status" />
      <p class="currentScript">正在加载{{ currentScript }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
let currentScript = ref('')
let percentage = ref(0)
let status = ref('loading')
const emit = defineEmits(['loadDone'])

const startLoad = () => {
  // 随机加载很多js文件，模拟加载过程
  let scripts = []
  for (let i = 0; i < 100; i++) {
    let makeRandomScriptName = () => {
      let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let name = ''
      for (let j = 0; j < 10; j++) {
        name += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return 'js/' + name + '.js'
    }
    scripts.push(makeRandomScriptName())
  }
  while (scripts.length > 0) {
    currentScript = scripts.shift()
    await new Promise(resolve => setTimeout(resolve, 20))
    percentage.value += 1
  }
  percentage.value = 100
  status.value = 'success'
  setTimeout(() => {
    emit('loadDone')
  }, 500)
}

onMounted(() => {
  startLoad()
})
</script>

<style scoped lang="less">
  .loading-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100vh;
    background-color: #f5f5f5;
    h1 {
      margin-bottom: 20px;
    }
    .loading {
      max-width: 400px;
      width: 80%;
      height: 100px;
      text-align: center;
      padding: 16px;
    }
  }
  .currentScript {
    width: 100%;
    padding: 10px 0;
    text-align: center;
    font-size: 12px;
    color: #999;
  }
</style>