<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { state } from '../store/state.js'
const emit = defineEmits(['goToOrder'])

// 添加随机错误弹窗
const errorMessages = [
  '网络连接异常，请检查网络设置',
  '系统繁忙，请稍后再试',
  '数据库连接失败',
  '权限验证失败',
  '未知错误，请联系管理员'
]

let errorTimer = null

onMounted(() => {
  // 随机错误弹窗，小概率出现
  errorTimer = setInterval(() => {
    if (Math.random() < 0.01) { // 1% 概率
      const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)]
      ElMessageBox.alert(randomError, '系统错误', {
        confirmButtonText: '确定',
        callback: () => {
          // 即使用户点击确定，也可能继续出现错误
          if (Math.random() < 0.3) { // 30% 概率继续弹窗
            setTimeout(() => {
              const anotherError = errorMessages[Math.floor(Math.random() * errorMessages.length)]
              ElMessageBox.alert(anotherError, '系统错误', {
                confirmButtonText: '确定'
              })
            }, 1000)
          }
        }
      })
    }
  }, 5000) // 每5秒检查一次
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (errorTimer) {
    clearInterval(errorTimer)
  }
})

const gotoUser = () => {
    emit('goToUser')
}

const selfPickUp = () => {
   state.orderType = 'selfPickUp'
    emit('goToOrder')
}

const deliveryOrder = () => {
    state.orderType = 'deliveryOrder'
    emit('goToOrder')
}


</script>

<template>
    <div class="home">
        <!-- 顶部用户头像和欢迎语 -->
        <div class="userWelcome">
            <el-avatar :size="40" icon="el-icon-user-solid" @click="gotoUser"></el-avatar>
            <span>
                欢迎，
                <el-link v-if="!state.isLogin" type="primary" href="#/login">{{ $t('goLogin') }}</el-link>
                <span v-else>{{ state.userInfo.username }}</span>
            </span>
        </div>
        <!-- element 轮播广告 -->
        <el-carousel height="150px" indicator-position="outside">
            <el-carousel-item v-for="item in 4" :key="item">
                <img :src="`/src/assets/ads/ad${item}.jpg`" style="width: 100%; height: 100%; object-fit: cover;" />
            </el-carousel-item>
        </el-carousel>
        <!-- 选择到店自取或者外卖点单 -->
        <div class="orderOptions">
            <el-card shadow="hover" class="optionCard" @click="selfPickUp">
                <el-icon>
                    <Shop />
                </el-icon>
                <div>到店自取</div>
            </el-card>
            <el-card shadow="hover" class="optionCard" @click="deliveryOrder">
                <el-icon>
                    <Goods />
                </el-icon>
                <div>外卖点单</div>
            </el-card>
        </div>
        <!-- 巨幅广告列表 -->
        <div class="bigAds" style="margin-top: 20px;">
            <el-image
                v-for="adIndex in 3"
                :key="adIndex"
                :src="`/src/assets/ads/big-ad${adIndex}.jpg`"
                style="width: 100%; height: 120px; margin-bottom: 15px; object-fit: cover;"
            />
        </div>
    </div>
</template>

<style lang="less" scoped>
.home {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-top: 1px solid #ddd;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    gap: 10px;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}
.orderOptions {
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
    .optionCard {
        width: 45%;
        text-align: center;
        cursor: pointer;
    }
}
.bigAds {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 10px;
}
</style>