<script setup>
import { ref } from 'vue'
import { state } from '../store/state.js'
const emit = defineEmits(['goToLogin'])

// 页面状态（模拟路由，不保存登录态）
const currentPage = ref('Login')
const showAd = ref(true) // 强制广告
const showErrorModal = ref(false) // 关不掉的错误弹窗

const gotoLogin = () => {
    emit('goToLogin')
}

const selfPickUp = () => {

}

const deliveryOrder = () => {

}
</script>

<template>
    <div class="home">
        <!-- 顶部用户头像和欢迎语 -->
        <div class="userWelcome">
            <el-avatar :size="40" icon="el-icon-user-solid"></el-avatar>
            <span>
                欢迎，
                <el-button v-if="!state.isLogin" type="text" @click="gotoLogin">
                    {{ $t('goLogin') }}
                </el-button>
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
        <div class="orderOptions" style="margin-top: 20px; display: flex; justify-content: space-around;">
            <el-card shadow="hover" style="width: 45%; text-align: center; cursor: pointer;" @click="">
                <el-icon><i class="el-icon-shop"></i></el-icon>
                <div>到店自取</div>
            </el-card>
            <el-card shadow="hover" style="width: 45%; text-align: center; cursor: pointer;">
                <el-icon><i class="el-icon-truck"></i></el-icon>
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

<i18n>
{
  "en": {
    "goLogin": "Go to Login"
  },
  "zh": {
    "goLogin": "去登录"
  }
}
</i18n>

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
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}
</style>