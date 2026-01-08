<template>
  <div class="ad">
    <h3>广告：本店珍珠，颗颗有身份证！</h3>
    <p>剩余 <span>{{ adCount }}</span> 秒</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
const emit = defineEmits(['adEnd'])

const adCount = ref(8)
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    adCount.value--
  }, 1000)
})

watch(adCount, (val) => {
  if (val <= 0) {
    clearInterval(timer)
    emit('adEnd')
  }
})
</script>

<style scoped>
.ad { 
  position: fixed; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100vh; 
  background: #000; 
  color: #fff; 
  text-align: center; 
  padding-top: 200px; 
  z-index: 9999; 
}
</style>