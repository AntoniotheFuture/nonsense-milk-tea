<script setup>
import { ref, computed } from 'vue'
import Index from './views/Index.vue'
import Login from './views/Login.vue'
import OrderConfirm from './views/OrderConfirm.vue'
import Payment from './views/Payment.vue'
import OrderDetails from './views/OrderDetails.vue'
import Cart from './views/Cart.vue'
import AddressEdit from './views/AddressEdit.vue'

const routes = {
  '/': {
    component: Index,
    title: '五彩珍珠',
  },
  '/login': {
    component: Login,
    title: '用户登录',
  },
  '/order': {
    component: Index,
    title: '点单',
  },
  '/cart': {
    component: Index,
    title: '购物车',
  },
  '/custom': {
    component: Index,
    title: '我的',
  },
  '/order-confirm': {
    component: OrderConfirm,
    title: '订单确认',
  },
  '/payment': {
    component: Payment,
    title: '付款成功',
  },
  '/order-details': {
    component: OrderDetails,
    title: '订单详情',
  },
  '/address-edit': {
    component: AddressEdit,
    title: '修改配送地址',
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

<style lang="less">
/* 全局样式重置，确保页面可以正常滚动 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f5f5;
}

/* 全局提示弹窗样式，使其更符合消费场景 */

/* 修改ElMessage的样式 */
.el-message {
  min-width: 280px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 15px 20px;
  
  .el-message__content {
    font-size: 14px;
    line-height: 1.5;
  }
  
  &.el-message--success {
    background-color: #f0f9eb;
    border-color: #e1f3d8;
    
    .el-message__icon {
      color: #67c23a;
    }
  }
  
  &.el-message--warning {
    background-color: #fdf6ec;
    border-color: #faecd8;
    
    .el-message__icon {
      color: #e6a23c;
    }
  }
  
  &.el-message--error {
    background-color: #fef0f0;
    border-color: #fde2e2;
    
    .el-message__icon {
      color: #f56c6c;
    }
  }
  
  &.el-message--info {
    background-color: #ecf5ff;
    border-color: #ebeef5;
    
    .el-message__icon {
      color: #409eff;
    }
  }
}

/* 修改ElMessageBox的样式 */
.el-message-box {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  
  .el-message-box__header {
    padding: 20px 24px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    
    .el-message-box__title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  }
  
  .el-message-box__content {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    color: #666;
  }
  
  .el-message-box__btns {
    padding: 0 24px 24px;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    
    .el-button {
      border-radius: 8px;
      padding: 8px 20px;
      font-size: 14px;
      font-weight: 500;
      
      &.el-button--primary {
        background-color: #ff6b6b;
        border-color: #ff6b6b;
        
        &:hover {
          background-color: #ff5252;
          border-color: #ff5252;
        }
      }
      
      &.el-button--default {
        border-color: #e9ecef;
        color: #666;
        
        &:hover {
          border-color: #ff6b6b;
          color: #ff6b6b;
        }
      }
    }
  }
}
</style>