<template>
  <div v-if="visible" class="ad">
    <div class="adMain" @click="handleClick" :style="computedStyle">
      <el-icon class="closeBtn" @click.stop="close">
        <CircleClose />
      </el-icon>
    </div>
    <el-dialog v-model="dialogVisible" :before-close="handleClose">
      <span>广告很精彩，还有{{ adCount }}秒，请耐心看完~</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">
            好
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue'
const emit = defineEmits(['adEnd', 'adClick'])

const visible = ref(false)
const adCount = ref(8)
const adImgUrl = ref('')
const stopAble = ref(true)
const countDown = ref(0)
const dialogVisible = ref(false)
let timer = null

const computedStyle = computed(() => {
  return {
    background: `url(${adImgUrl.value}) no-repeat center/cover`
  }
})

// 开始播放广告图
let start = (adImgUrlI, countDownI = 8, stopAbleI = true) => {
  adImgUrl.value = adImgUrlI
  countDown.value = countDownI
  stopAble.value = stopAbleI
  // 等待图片加载完毕再渲染
  let img = new Image()
  img.src = adImgUrl.value
  img.onload = () => {
    visible.value = true
    startTimer()
  }
}

let startTimer = () => {
  adCount.value = countDown.value
  timer = setInterval(() => {
    if (dialogVisible.value) return
    adCount.value--
    if (adCount.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

let close = () => {
  if (stopAble.value || adCount.value <= 0) {
    visible.value = false
    clearInterval(timer)
    emit('adEnd')
    return
  }
  dialogVisible.value = true
}

let handleClick = () => {
  emit('adEnd')
  emit('adClick')
}

defineExpose({
  start
})
</script>

<style scoped>
.ad { 
  position: fixed; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100vh; 

  display: flex;
  flex-direction: column;
  justify-content: center;

  background: rgba(0, 0, 0, 0.151); 
  color: #fff; 
  text-align: center; 
  z-index: 9999; 
  .adMain { 
    width: 70%;
    min-width: 200px;
    max-width: 90%;
    max-height: 80%;
    margin: 0 auto; 
    aspect-ratio: 9 / 16;
    position: relative; 
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 16px; 
    overflow: hidden;
    .closeBtn { 
      position: absolute; 
      top: 5px; 
      right: 5px; 
      cursor: pointer; 
    } 
  }
}
</style>