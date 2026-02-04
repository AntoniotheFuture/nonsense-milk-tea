<script setup>
// 点单界面
import { ref, onMounted, onUnmounted, computed, defineEmits, watch } from 'vue'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import { Shop, Van, ArrowRight, Location, ShoppingCart, Delete, Close } from '@element-plus/icons-vue'
import ProductClassification from '../components/ProductClassification.vue';
import ProductCustomDialog from '../components/ProductCustomDialog.vue';
import { state, selfPickUpState, deliveryOrderState } from '../store/state.js'

const emit = defineEmits(['goToCart'])

// 添加随机价格变动
let priceChangeTimer = null
const originalProductList = [
    {
        classification: '奶茶',
        name: '奶茶',
        list: [
            {
                id: 2,
                label: '五彩珍珠奶茶',
                price: 15.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pearl%20milk%20tea%20with%20tapioca%20pearls%20in%20a%20plastic%20cup&image_size=square_hd',
                description: 'Q弹珍珠搭配香浓奶茶，经典之选'
            },
            {
                id: 1,
                label: '经典奶茶',
                price: 12.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=classic%20milk%20tea%20in%20a%20glass%20cup%20with%20tea%20leaves%20background&image_size=square_hd',
                description: '经典港式奶茶，丝滑醇香',
                carouselImages: [
                    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=classic%20milk%20tea%20in%20a%20glass%20cup%20with%20tea%20leaves%20background&image_size=landscape_16_9',
                    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=milk%20tea%20being%20poured%20into%20a%20cup&image_size=landscape_16_9',
                    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=milk%20tea%20with%20boba%20pearls%20in%20a%20cup&image_size=landscape_16_9'
                ]
            },
            {
                id: 3,
                label: '布丁奶茶',
                price: 16.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=milk%20tea%20with%20pudding%20layers%20in%20a%20clear%20cup&image_size=square_hd',
                description: '顺滑布丁与奶茶的完美结合'
            },
            {
                id: 4,
                label: '红豆奶茶',
                price: 15.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=milk%20tea%20with%20red%20beans%20topping%20in%20a%20cup&image_size=square_hd',
                description: '香甜红豆搭配浓郁奶茶'
            },
            {
                id: 5,
                label: '抹茶奶茶',
                price: 17.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=matcha%20milk%20tea%20with%20green%20tea%20powder%20on%20top&image_size=square_hd',
                description: '清香抹茶与奶茶的融合，口感丰富'
            },
            {
                id: 6,
                label: '咖啡奶茶',
                price: 18.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=coffee%20milk%20tea%20with%20coffee%20beans%20decoration&image_size=square_hd',
                description: '咖啡与奶茶的完美结合，醇厚香浓'
            },
            {
                id: 7,
                label: '椰果奶茶',
                price: 15.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=coconut%20milk%20tea%20with%20tapioca%20pearls%20and%20coconut%20jelly&image_size=square_hd',
                description: 'Q弹椰果搭配香浓奶茶，口感丰富'
            },
            {
                id: 8,
                label: '燕麦奶茶',
                price: 16.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=oat%20milk%20tea%20with%20oat%20flakes%20on%20top&image_size=square_hd',
                description: '营养燕麦与奶茶的融合，健康美味'
            }
        ]
    },
    {
        classification: '果茶',
        name: '果茶',
        list: [
            {
                id: 9,
                label: '柠檬茶',
                price: 13.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=lemon%20tea%20with%20fresh%20lemon%20slices%20and%20mint&image_size=square_hd',
                description: '清新柠檬与茶的完美结合，酸甜可口'
            },
            {
                id: 10,
                label: '百香果茶',
                price: 15.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=passion%20fruit%20tea%20with%20fresh%20passion%20fruit%20pulp&image_size=square_hd',
                description: '浓郁百香果与茶的融合，香气四溢'
            },
            {
                id: 11,
                label: '草莓茶',
                price: 16.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=strawberry%20tea%20with%20fresh%20strawberries%20and%20mint&image_size=square_hd',
                description: '香甜草莓与茶的融合，口感清爽'
            },
            {
                id: 12,
                label: '芒果茶',
                price: 17.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mango%20tea%20with%20fresh%20mango%20slices%20and%20ice&image_size=square_hd',
                description: '香甜芒果与茶的融合，口感丰富'
            },
            {
                id: 13,
                label: '蓝莓茶',
                price: 16.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blueberry%20tea%20with%20fresh%20blueberries%20and%20lemon&image_size=square_hd',
                description: '清香蓝莓与茶的融合，口感清爽'
            },
            {
                id: 14,
                label: '蜜桃茶',
                price: 15.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=peach%20tea%20with%20fresh%20peach%20slices%20and%20mint&image_size=square_hd',
                description: '香甜蜜桃与茶的融合，香气四溢'
            },
            {
                id: 15,
                label: '菠萝茶',
                price: 14.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=pineapple%20tea%20with%20fresh%20pineapple%20chunks%20and%20mint&image_size=square_hd',
                description: '清新菠萝与茶的融合，口感清爽'
            },
            {
                id: 16,
                label: '西瓜茶',
                price: 15.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=watermelon%20tea%20with%20fresh%20watermelon%20chunks%20and%20mint&image_size=square_hd',
                description: '清甜西瓜与茶的融合，夏日必备'
            }
        ]
    },
    {
        classification: '咖啡',
        name: '咖啡',
        list: [
            {
                id: 17,
                label: '美式咖啡',
                price: 15.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=americano%20coffee%20in%20a%20glass%20cup%20with%20coffee%20beans&image_size=square_hd',
                description: '经典美式咖啡，醇厚香浓'
            },
            {
                id: 18,
                label: '拿铁咖啡',
                price: 18.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=latte%20coffee%20with%20milk%20foam%20and%20latte%20art&image_size=square_hd',
                description: '浓缩咖啡与牛奶的完美融合'
            },
            {
                id: 19,
                label: '卡布奇诺',
                price: 19.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cappuccino%20coffee%20with%20milk%20foam%20and%20cocoa%20powder&image_size=square_hd',
                description: '浓缩咖啡、牛奶和奶泡的完美比例'
            },
            {
                id: 20,
                label: '摩卡咖啡',
                price: 20.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mocha%20coffee%20with%20chocolate%20syrup%20and%20whipped%20cream&image_size=square_hd',
                description: '浓缩咖啡、巧克力和牛奶的完美融合'
            },
            {
                id: 21,
                label: '焦糖玛奇朵',
                price: 21.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=caramel%20macchiato%20with%20caramel%20syrup%20and%20milk%20foam&image_size=square_hd',
                description: '浓缩咖啡、牛奶和焦糖的完美融合'
            },
            {
                id: 22,
                label: '香草拿铁',
                price: 19.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=vanilla%20latte%20with%20vanilla%20syrup%20and%20milk%20foam&image_size=square_hd',
                description: '浓缩咖啡、牛奶和香草的完美融合'
            },
            {
                id: 23,
                label: '榛果拿铁',
                price: 20.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=hazelnut%20latte%20with%20hazelnut%20syrup%20and%20milk%20foam&image_size=square_hd',
                description: '浓缩咖啡、牛奶和榛果的完美融合'
            },
            {
                id: 24,
                label: '抹茶拿铁',
                price: 20.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=matcha%20latte%20with%20green%20tea%20powder%20and%20milk%20foam&image_size=square_hd',
                description: '清香抹茶与牛奶的完美融合'
            }
        ]
    },
    {
        classification: '甜点',
        name: '甜点',
        list: [
            {
                id: 25,
                label: '提拉米苏',
                price: 22.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tiramisu%20dessert%20with%20coffee%20sauce%20and%20cocoa%20powder&image_size=square_hd',
                description: '经典意式甜点，口感丰富'
            },
            {
                id: 26,
                label: '芒果慕斯',
                price: 20.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mango%20mousse%20dessert%20with%20fresh%20mango%20slices&image_size=square_hd',
                description: '香甜芒果慕斯，口感轻盈'
            },
            {
                id: 27,
                label: '巧克力蛋糕',
                price: 18.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chocolate%20cake%20with%20chocolate%20frosting%20and%20berries&image_size=square_hd',
                description: '浓郁巧克力蛋糕，口感丰富'
            },
            {
                id: 28,
                label: '芝士蛋糕',
                price: 20.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cheesecake%20with%20strawberries%20and%20cream&image_size=square_hd',
                description: '浓郁芝士蛋糕，口感细腻'
            },
            {
                id: 29,
                label: '抹茶蛋糕',
                price: 21.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=matcha%20cake%20with%20green%20tea%20powder%20and%20cream&image_size=square_hd',
                description: '清香抹茶蛋糕，口感细腻'
            },
            {
                id: 30,
                label: '草莓蛋糕',
                price: 22.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=strawberry%20cake%20with%20fresh%20strawberries%20and%20cream&image_size=square_hd',
                description: '香甜草莓蛋糕，口感丰富'
            },
            {
                id: 31,
                label: '焦糖布丁',
                price: 15.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=caramel%20pudding%20with%20caramel%20sauce%20and%20berries&image_size=square_hd',
                description: '香甜焦糖布丁，口感丝滑'
            },
            {
                id: 32,
                label: '芒果班戟',
                price: 18.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mango%20pancake%20with%20fresh%20mango%20slices%20and%20cream&image_size=square_hd',
                description: '香甜芒果班戟，口感丰富'
            }
        ]
    },
    {
        classification: '小食',
        name: '小食',
        list: [
            {
                id: 33,
                label: '薯条',
                price: 12.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=french%20fries%20with%20ketchup%20and%20mayonnaise&image_size=square_hd',
                description: '酥脆薯条，口感美味'
            },
            {
                id: 34,
                label: '鸡米花',
                price: 15.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=popcorn%20chicken%20with%20spicy%20sauce&image_size=square_hd',
                description: '酥脆鸡米花，口感美味'
            },
            {
                id: 35,
                label: '洋葱圈',
                price: 13.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=onion%20rings%20with%20spicy%20sauce&image_size=square_hd',
                description: '酥脆洋葱圈，口感美味'
            },
            {
                id: 36,
                label: '鸡翅',
                price: 18.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chicken%20wings%20with%20bbq%20sauce&image_size=square_hd',
                description: '香辣鸡翅，口感美味'
            },
            {
                id: 37,
                label: '鸡块',
                price: 16.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chicken%20nuggets%20with%20spicy%20sauce&image_size=square_hd',
                description: '酥脆鸡块，口感美味'
            },
            {
                id: 38,
                label: '春卷',
                price: 14.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=spring%20rolls%20with%20dipping%20sauce&image_size=square_hd',
                description: '酥脆春卷，口感美味'
            },
            {
                id: 39,
                label: '蛋挞',
                price: 10.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=egg%20tarts%20with%20custard%20filling&image_size=square_hd',
                description: '香甜蛋挞，口感丝滑'
            },
            {
                id: 40,
                label: '爆米花',
                price: 12.00,
                image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=popcorn%20with%20butter%20and%20salt&image_size=square_hd',
                description: '香甜爆米花，口感美味'
            }
        ]
    }
]

// 深拷贝商品列表
const productList = ref(JSON.parse(JSON.stringify(originalProductList)))

// 商品分类
const classificationList = ['奶茶', '果茶', '咖啡', '甜点', '小食']
const classification = ref(classificationList[0]) // 默认选中第一个分类

// 地址和门店相关
const showStoreDrawer = ref(false)
const currentStore = ref({ id: 1, name: '深南大道店', address: '南山区深南大道10000号', distance: '0.65海里' })
const nearbyStores = ref([
  { id: 1, name: '深南大道店', address: '南山区深南大道10000号', distance: '0.65海里' },
  { id: 2, name: '科技园店', address: '南山区科技园南区高新南一道', distance: '1.35海里' },
  { id: 3, name: '海岸城店', address: '南山区海岸城购物中心', distance: '1.67海里' },
  { id: 4, name: '深圳湾店', address: '南山区深圳湾体育中心', distance: '2.27海里' }
])

const currentAddress = ref({ name: '张三', phone: '13800138000', address: '南山区深南大道10000号', recipient: '张三' })

// 商品定制对话框相关
const customDialogVisible = ref(false)
const selectedProduct = ref(null)

// 购物车相关
const cartItems = ref([])
const showCartDrawer = ref(false)

// loading状态
const isLoading = ref(false)

// 选择商品分类
const selectClassification = (category) => {
  classification.value = category
  
  // 滚动到对应分类
  const element = document.getElementById(`category-${category}`)
  if (element) {
    element.scrollIntoView({ behavior: 'auto', block: 'start' })
  }
}

// 切换商品分类
const toggleClassification = (category) => {
  classification.value = classification.value === category ? '' : category
}

// 商品面板引用
const productPanelRef = ref(null)

// 处理滚动
const handleScroll = () => {
  if (!productPanelRef.value) return
  
  const scrollTop = productPanelRef.value.scrollTop
  const categories = productPanelRef.value.querySelectorAll('.product-category')
  
  categories.forEach((category) => {
    const offsetTop = category.offsetTop
    const height = category.offsetHeight
    
    if (scrollTop >= offsetTop - 150 && scrollTop < offsetTop + height - 150) {
      classification.value = category.id.replace('category-', '')
    }
  })
}

// 打开商品定制对话框
const openCustomDialog = (product) => {
  selectedProduct.value = product
  customDialogVisible.value = true
}

// 处理商品定制确认
const handleCustomConfirm = (customData) => {
  const item = {
    ...selectedProduct.value,
    ...customData,
    id: Date.now() // 确保唯一ID
  }
  
  // 添加到购物车
  cartItems.value.push(item)
  
  // 根据订单类型保存到对应的store
  if (state.orderType === 'selfPickUp') {
    selfPickUpState.addItem2Cart(item)
  } else {
    deliveryOrderState.addItem2Cart(item)
  }
  
  ElMessage.success('已添加到购物车！')
}

// 从store更新购物车
const updateCartFromStore = () => {
  if (state.orderType === 'selfPickUp') {
    cartItems.value = [...selfPickUpState.orders]
  } else {
    cartItems.value = [...deliveryOrderState.orders]
  }
}

// 计算购物车总价
const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    const price = Number(item.price) || 0
    const quantity = Number(item.quantity) || 1
    return total + (price * quantity)
  }, 0)
})

// 显示购物车抽屉
const toggleCartDrawer = () => {
  showCartDrawer.value = !showCartDrawer.value
}

// 删除购物车商品
const removeCartItem = (index) => {
  const removedItem = cartItems.value.splice(index, 1)[0]
  
  // 从store中移除
  if (state.orderType === 'selfPickUp') {
    selfPickUpState.orders = selfPickUpState.orders.filter(item => item.id !== removedItem.id)
  } else {
    deliveryOrderState.orders = deliveryOrderState.orders.filter(item => item.id !== removedItem.id)
  }
  
  ElMessage.success('已从购物车移除！')
}

// 结算
const checkout = () => {
  if (cartItems.length === 0) {
    ElMessage.warning('购物车为空，请先添加商品')
    return
  }
  
  // 使用hash导航跳转到购物车页面进行结算
  window.location.hash = '#/cart'
}

// 选择门店
const selectStore = (store) => {
  currentStore.value = store
  showStoreDrawer.value = false
  ElMessage.success('门店选择成功！')
}

// 去地址编辑页面
const goToAddressEdit = () => {
  window.location.hash = '#/address-edit'
}

// 去购物车页面
const goToCart = () => {
  if (cartItems.length === 0) {
    ElMessage.warning('购物车为空，请先添加商品')
    return
  }
  
  // 使用hash导航跳转到购物车页面进行结算
  window.location.hash = '#/cart'
}

// 获取甜度标签
const getSweetnessLabel = (sweetness) => {
  const sweetnessMap = {
    '0': '无糖',
    '30': '三分糖',
    '50': '半糖',
    '70': '七分糖',
    '100': '全糖'
  }
  return sweetnessMap[sweetness] || sweetness
}

// 监听订单类型变化，更新购物车
watch(
  () => state.orderType,
  () => {
    updateCartFromStore()
  }
)

// 页面加载时从store获取购物车数据
onMounted(() => {
  // 添加随机价格变动效果
  priceChangeTimer = setInterval(() => {
    productList.value.forEach(category => {
      category.list.forEach(product => {
        // 随机变动价格（±0.5元）
        const change = (Math.random() - 0.5) * 1
        product.price = Math.max(10, Math.round((product.price + change) * 100) / 100)
      })
    })
  }, 5000)
  
  // 从store更新购物车
  updateCartFromStore()
})

// 页面卸载时清除定时器
onUnmounted(() => {
  if (priceChangeTimer) {
    clearInterval(priceChangeTimer)
  }
})
</script>

<template>
  <div class="order-page">
    <!-- 虚假loading效果 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <el-loading :text="'加载中...'" type="spinner" />
      </div>
    </div>
    <!-- 配送类型选择器 -->
    <div class="order-type-selector">
        <div 
          class="order-type-item"
          :class="{ active: state.orderType === 'selfPickUp' }"
          @click="state.orderType = 'selfPickUp'"
        >
          <el-icon><Shop /></el-icon>
          <span>到店自取</span>
        </div>
        <div 
          class="order-type-item"
          :class="{ active: state.orderType === 'deliveryOrder' }"
          @click="state.orderType = 'deliveryOrder'"
        >
          <el-icon><Van /></el-icon>
          <span>外卖配送</span>
        </div>
    </div>
    <template v-if="state.orderType === 'selfPickUp'">
        <div class="address-section" @click="showStoreDrawer = true">
          <div class="address-header">
            <h3>自取门店</h3>
            <el-button type="text">更换门店 <el-icon><ArrowRight /></el-icon></el-button>
          </div>
          <div class="address-content">
            <el-icon class="address-icon"><Location /></el-icon>
            <div class="address-info">
              <div class="address-name">{{ currentStore.name }}</div>
              <div class="address-detail">{{ currentStore.address }}（{{ currentStore.distance }}）</div>
            </div>
          </div>
        </div>
    </template>
    <template v-else>
        <div class="address-section" @click="goToAddressEdit">
          <div class="address-header">
            <h3>配送地址</h3>
            <el-button type="text">修改地址 <el-icon><ArrowRight /></el-icon></el-button>
          </div>
          <div class="address-content">
            <el-icon class="address-icon"><Location /></el-icon>
            <div class="address-info">
              <div class="address-name">{{ currentAddress.name }} {{ currentAddress.phone }}</div>
              <div class="address-detail">{{ currentAddress.address }}</div>
            </div>
          </div>
        </div>
    </template>
    
    <!-- 左右并列布局 -->
    <div class="order-layout">
      <!-- 左侧：商品分类 -->
      <div class="classification-panel">
        <div 
          v-for="category in classificationList" 
          :key="category"
          class="classification-item"
          :class="{ active: classification === category }"
          @click="selectClassification(category)"
        >
          {{ category }}
        </div>
      </div>
      
      <!-- 右侧：商品列表 -->
      <div class="product-panel" ref="productPanelRef" @scroll="handleScroll">
        <div 
          v-for="category in productList" 
          :key="category.classification"
          :id="`category-${category.classification}`"
          class="product-category"
        >
          <h3 class="category-title">{{ category.classification }}</h3>
          <div class="product-list">
            <div 
              v-for="product in category.list" 
              :key="product.id" 
              class="product-item"
            >
              <div class="product-image-container" @click="openCustomDialog(product)">
                <img :src="product.image" :alt="product.label" class="product-img">
              </div>
              <div class="product-info">
                <div class="product-label" @click="openCustomDialog(product)">{{ product.label }}</div>
                <div class="product-price">¥{{ product.price }}</div>
                <el-button type="primary" size="small" class="add-to-cart-btn" @click.stop="openCustomDialog(product)">添加到购物车</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <!-- 门店选择抽屉 -->
    <el-drawer
      v-model="showStoreDrawer"
      title="选择门店"
      direction="btt"
      size="70%"
      :modal="true"
      :close-on-click-modal="false"
      class="store-drawer"
      :with-header="true"
    >
      <div class="store-list">
        <div 
          v-for="store in nearbyStores" 
          :key="store.id"
          class="store-item"
          :class="{ active: currentStore.id === store.id }"
          @click="selectStore(store)"
        >
          <div class="store-info">
            <div class="store-name">{{ store.name }}</div>
            <div class="store-address">{{ store.address }}</div>
          </div>
          <div class="store-distance">{{ store.distance }}</div>
        </div>
      </div>
    </el-drawer>
  
    <!-- 购物车抽屉 -->
    <el-drawer
      v-model="showCartDrawer"
      :with-header="false"
      direction="bottom"
      size="50%"
      :modal="true"
      :close-on-click-modal="false"
    >
      <div class="cart-drawer">
        <div class="cart-header">
          <h3>购物车</h3>
          <el-button @click="showCartDrawer = false" circle>
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
        
        <div v-if="cartItems.length === 0" class="empty-cart">
          购物车为空
        </div>
        
        <div v-else class="cart-items">
          <div 
            v-for="(item, index) in cartItems" 
            :key="item.id" 
            class="cart-item"
          >
            <div class="item-info">
              <div class="item-name">{{ item.label }}</div>
              <div class="item-details">
                甜度: {{ getSweetnessLabel(item.sweetness) }} · 数量: {{ item.quantity }}
              </div>
              <div v-if="item.pearls" class="pearl-details">
                珍珠: {{ item.pearls.length }}颗
              </div>
            </div>
            <div class="item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
            <el-button 
              type="danger" 
              size="small" 
              @click="removeCartItem(index)"
              circle
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
        
        <div class="cart-footer">
          <div class="total">总计: ¥{{ cartTotal.toFixed(2) }}</div>
          <el-button 
            type="primary" 
            size="large" 
            @click="checkout"
            :disabled="cartItems.length === 0"
          >
            结算
          </el-button>
        </div>
      </div>
    </el-drawer>
  
    <!-- 商品定制对话框 -->
    <ProductCustomDialog
      v-model="customDialogVisible"
      :product="selectedProduct"
      @confirm="handleCustomConfirm"
    />
  
    <!-- 底部购物车按钮 -->
    <div class="cart-bottom-bar" v-if="cartItems.length > 0">
      <div class="cart-summary">
        <el-badge :value="cartItems.length" class="cart-badge">
          <el-icon><ShoppingCart /></el-icon>
        </el-badge>
        <span>¥{{ cartTotal.toFixed(2) }}</span>
      </div>
      <el-button type="primary" @click="goToCart" style="background-color: #ff6b6b; border-color: #ff6b6b;">去购物车</el-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.order-page {
  padding: 15px;
  height: 100%;
  background-color: #f5f5f5;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  padding-bottom: 50px;
  box-sizing: border-box;
}

.order-type-selector {
  flex: none;
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
  padding: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.order-type-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 500;
  
  &:hover {
    background-color: #f0f0f0;
  }
  
  &.active {
    background-color: #ff6b6b;
    color: white;
  }
}

.address-section {
  flex: none;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
}

.address-content {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.address-icon {
  font-size: 20px;
  color: #ff6b6b;
  margin-top: 2px;
}

.address-info {
  flex: 1;
}

.address-name {
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
}

.address-detail {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

// 左右并列布局
.order-layout {
  display: flex;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  flex: 1;
}

.classification-panel {
  width: 180px;
  border-right: 1px solid #f0f0f0;
  background-color: #fafafa;
  overflow-y: auto;
  display: block;
  
  .classification-item {
    padding: 16px 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
    border-left: 3px solid transparent;
    display: block;
    
    &:hover {
      background-color: #f0f0f0;
    }
    
    &.active {
      background-color: white;
      border-left-color: #ff6b6b;
      font-weight: 600;
      color: #ff6b6b;
    }
  }
}

.product-panel {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.product-category {
  margin-bottom: 30px;
  
  .category-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
    padding-left: 10px;
    border-left: 4px solid #ff6b6b;
  }
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
}

.product-item {
  background-color: #fafafa;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  box-sizing: border-box;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateY(-2px);
  }
}

.product-image-container {
  position: relative;
  width: 120px;
  height: 120px;
  overflow: hidden;
  border-radius: 6px;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-label {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  font-size: 18px;
  font-weight: 600;
  color: #ff6b6b;
  margin-bottom: 12px;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  .product-item:hover & {
    transform: scale(1.05);
  }
}

.add-to-cart-btn {
  display: inline-block;
  width: auto;
  background-color: #ff6b6b;
  border-color: #ff6b6b;
  
  &:hover {
    background-color: #ff5252;
    border-color: #ff5252;
  }
}

// 门店选择抽屉样式
.store-drawer {
  .el-drawer__header {
    padding: 20px;
    border-bottom: 1px solid #eee;
  }
  
  .el-drawer__body {
    padding: 20px;
    overflow-y: auto;
  }
}

.store-list {
  .store-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: #f9f9f9;
    }
    
    &.active {
      background-color: #fff3f3;
      color: #ff6b6b;
    }
  }
  
  .store-info {
    flex: 1;
  }
  
  .store-name {
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .store-address {
    font-size: 14px;
    color: #666;
  }
  
  .store-distance {
    font-size: 14px;
    color: #999;
  }
}

// 购物车抽屉样式
.cart-drawer {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
    
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
  }
  
  .empty-cart {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #999;
  }
  
  .cart-items {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    
    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
    }
    
    .item-info {
      flex: 1;
    }
    
    .item-name {
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .item-details {
      font-size: 14px;
      color: #666;
      margin-bottom: 4px;
    }
    
    .pearl-details {
      font-size: 14px;
      color: #666;
    }
    
    .item-price {
      font-weight: 600;
      color: #ff6b6b;
      margin: 0 16px;
    }
  }
  
  .cart-footer {
    padding: 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fafafa;
    
    .total {
      font-size: 16px;
      font-weight: 600;
      
      span {
        color: #ff6b6b;
      }
    }
  }
}

// 底部购物车按钮
.cart-bottom-bar {
  position: fixed;
  bottom: 60px;
  left: 0;
  width: 100%;
  background: white;
  padding: 10px 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  z-index: 999;
  box-sizing: border-box;
}

.cart-summary {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cart-badge {
  font-size: 20px;
  cursor: pointer;
  
  &:hover {
    color: #ff6b6b;
  }
}

.cart-bottom-bar .el-button {
  max-width: 120px; /* 限制按钮宽度，防止溢出 */
  padding: 8px 16px; /* 调整按钮内边距 */
  font-size: 14px; /* 调整字体大小 */
}

.cart-badge ::v-deep(.el-badge__content) {
  top: -5px;
  right: -5px;
}

/* loading overlay样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
}

// 响应式设计
@media (max-width: 768px) {
  .order-type-selector {
    gap: 15px;
    
    .order-type-item {
      padding: 10px 20px;
      font-size: 14px;
    }
  }
  
  .order-layout {
    flex: auto;
    flex-direction: row;
    
    .classification-panel {
      border-right: none;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      flex-direction: column;
      overflow-x: auto;
      overflow-y: auto;
      white-space: nowrap;
      flex: none;
      width: auto;

      
      .classification-item {
        border-left: none;
        border-bottom: 3px solid transparent;
        display: inline-block;
        white-space: nowrap;
      }
      
      .classification-item.active {
        border-left-color: transparent;
        border-bottom-color: #ff6b6b;
      }
    }
  }
  
  .product-list {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px;
  }
  
  .product-image-container {
    height: 120px;
  }
  
  .cart-bottom-bar {
    padding: 10px 15px;
    
    .cart-summary {
      font-size: 14px;
    }
    
    .el-button {
      padding: 8px 12px;
      font-size: 13px;
    }
  }
}

// 甜度标签
.sweetness-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

// 珍珠选择
.pearl-selection {
  margin-top: 12px;
  
  .pearl-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
  }
  
  .pearl-options {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
}

// 商品标题
.product-title {
  color: #ff6b6b;
  font-weight: bold;
  margin-bottom: 4px;
  font-size: 14px;
}
</style>