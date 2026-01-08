<script setup>
// 点单界面
import { useTemplateRef, ref } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import ProductClassification from '../components/ProductClassification.vue';

const classification = ref('奶茶');

const classificationList = ['奶茶', '咖啡', '果汁'];

const productList = ref([
    {
        classification: '奶茶',
        name: '奶茶',
        list: [
            {
                id: 1,
                label: '经典奶茶',
                price: 12.00,
                image: '/src/assets/products/milktea1.jpg'
            },
            {
                id: 2,
                label: '珍珠奶茶',
                price: 15.00,
                image: '/src/assets/products/milktea2.jpg'
            }
        ]
    },
    {
        classification: '咖啡',
        name: '咖啡',
        list: [
            {
                id: 3,
                label: '拿铁咖啡',
                price: 18.00,
                image: '/src/assets/products/coffee1.jpg'
            }
        ]
    },
    {
        classification: '果汁',
        name: '果汁',
        list: [
            {
                id: 4,
                label: '橙汁',
                price: 10.00,
                image: '/src/assets/products/juice1.jpg'
            }
        ]
    },
]);

const selectClassification = (value) => {
    classification.value = value;
    scrollToClassification(newVal);
};

const rightMenuRef = useTemplateRef('rightMenu');
const scrollToClassification = (classificationName) => {
    const targetElement = document.querySelector(`[data-classification="${classificationName}"]`);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
    }
};

const onRightMenuScroll = () => {
    const rightMenu = rightMenuRef.value;
    const classificationElements = rightMenu.querySelectorAll('[data-classification]');
    let closestClassification = null;
    let closestOffset = Infinity;

    classificationElements.forEach((element) => {
        const offset = Math.abs(element.getBoundingClientRect().top - rightMenu.getBoundingClientRect().top);
        if (offset < closestOffset) {
            closestOffset = offset;
            closestClassification = element.getAttribute('data-classification');
        }
    });

    if (closestClassification && closestClassification !== classification.value) {
        classification.value = closestClassification;
    }
};

</script>

<template>
  <div class="order-page">
    <!-- 最近门店和距离信息 -->
    <div class="store-info">
      <el-icon><i class="el-icon-location"></i></el-icon>
      <span>您最近的门店：南山区深南大道10000号（1.2km）</span>
    </div>
    <!-- 商品菜单区域 -->
     <div class="menu-area">
        <!-- 左侧大类滚动区 -->
         <div class="left-menu">
            <div v-for="value in classificationList" :key="value" @click="selectClassification(value)">
                <product-classification :label="value" :isActive="classification === value"/>
            </div>
         </div>
         <!-- 右侧商品展示区 -->
         <div class="right-menu" @scroll="onRightMenuScroll">
            <div v-for="item in productList" :key="item.classification" :data-classification="item.classification">
                <div class="classificationName">{{ item.name }}</div>
                <div class="product-list">
                    <div v-for="product in item.list" :key="product.id">
                        <product-item :productInfo="product"/>
                    </div>
                </div>
            </div>
         </div>
    </div>
  </div>
</template>