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
    // 直接跳转到用户页面，而不是emit事件
    window.location.hash = '#/custom'
}

const selfPickUp = () => {
   state.orderType = 'selfPickUp'
    // 使用hash导航跳转到点单页面
    window.location.hash = '#/order'
}

const deliveryOrder = () => {
    state.orderType = 'deliveryOrder'
    // 使用hash导航跳转到点单页面
    window.location.hash = '#/order'
}

// 广告图片生成函数
const getAdImage = (index) => {
  const adPrompts = [
    'milk tea advertisement with colorful bubbles and fruits',
    'coffee shop promotion with cozy atmosphere',
    'fresh fruit juice ad with vibrant colors',
    'summer drink promotion with ice cubes and mint',
    'tea house advertisement with traditional Chinese style'
  ]
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(adPrompts[index - 1])}&image_size=landscape_16_9`
}

// 广告点击事件
const adClick = () => {
  // 跳转到点单页
  window.location.hash = '#/order'
  
  // 延迟一段时间确保页面加载完成，然后触发五彩珍珠奶茶的弹窗
  setTimeout(() => {
    // 触发全局事件，让Order页面监听并弹出弹窗
    window.dispatchEvent(new CustomEvent('openProductDialog', {
      detail: { productId: 2 } // 五彩珍珠奶茶的ID
    }))
  }, 500)
}

// 轮播图图片生成函数
const getCarouselImage = (index) => {
  const carouselPrompts = [
    'milk tea shop interior with cozy atmosphere',
    'colorful bubble tea with fruits on top',
    'modern cafe with people enjoying drinks',
    'summer beverage promotion with ice and mint'
  ]
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(carouselPrompts[index])}&image_size=landscape_16_9`
}

</script>

<template>
    <div class="home">
        <!-- 顶部用户头像和欢迎语 -->
        <div class="userWelcome">
            <el-avatar :size="40" icon="User" @click="gotoUser" />
            <span class="welcome-text">
                欢迎，
                <el-link v-if="!state.isLogin" type="primary" href="#/login">{{ $t('goLogin') }}</el-link>
                <span v-else>{{ state.userInfo.username }}</span>
            </span>
        </div>
        <!-- element 轮播广告 -->
        <el-carousel height="150px" indicator-position="outside" style="width: 100%;">
            <el-carousel-item v-for="(item, index) in 4" :key="index">
                <img 
                  :src="getCarouselImage(index)" 
                  style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;" 
                  @click="adClick"
                />
            </el-carousel-item>
        </el-carousel>
        <!-- 选择到店自取或者外卖点单 -->
        <div class="orderOptions">
            <el-card shadow="hover" class="optionCard" @click="selfPickUp">
                <div class="option-content">
                    <el-icon class="option-icon">
                        <Shop />
                    </el-icon>
                    <span class="option-text">到店自取</span>
                </div>
            </el-card>
            <el-card shadow="hover" class="optionCard" @click="deliveryOrder">
                <div class="option-content">
                    <el-icon class="option-icon">
                        <Goods />
                    </el-icon>
                    <span class="option-text">外卖点单</span>
                </div>
            </el-card>
        </div>
        <!-- 巨幅广告列表 -->
        <div class="bigAds" style="margin-top: 20px; width: 100%;">
            <img
                v-for="adIndex in 5"
                :key="adIndex"
                :src="getAdImage(adIndex)"
                style="width: 100%; height: 120px; margin-bottom: 15px; object-fit: cover; display: block; border-radius: 8px;"
                @click="adClick"
            />
        </div>
    </div>
</template>

<style lang="less" scoped>
.home {
    padding: 20px;
    min-height: 100vh;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    width: 100%;
    box-sizing: border-box;
    padding-bottom: 80px; /* 为底部导航留出足够空间 */
    
    /* 确保滚动条可见但不影响布局 */
    scrollbar-width: thin;
    scrollbar-color: #ccc #f5f5f5;
    
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f5f5f5;
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 3px;
    }
}

.userWelcome {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    justify-content: space-between;
    padding: 15px 20px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 10px;
    box-sizing: border-box;
    
    .welcome-text {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    .el-avatar {
        cursor: pointer;
        transition: transform 0.3s ease;
        
        &:hover {
            transform: scale(1.1);
        }
    }
}

.orderOptions {
    width: 100%;
    display: flex;
    gap: 15px;
    margin: 10px 0;
    
    .optionCard {
        flex: 1;
        text-align: center;
        cursor: pointer;
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        
        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.15);
        }
        
        .option-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 15px;
            padding: 30px 20px;
        }
        
        .option-icon {
            font-size: 32px;
            color: #ff6b6b;
        }
        
        .option-text {
            font-size: 16px;
            font-weight: 600;
            color: #333;
        }
    }
}

.bigAds {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    margin-top: 10px;
    
    img {
        cursor: pointer;
        transition: transform 0.3s ease;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        
        &:hover {
            transform: scale(1.02);
        }
    }
}
</style>