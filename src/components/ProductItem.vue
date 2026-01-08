<script setup>
    defineEmits(['addToCart'])
    // 商品列表卡片
    defineProps({
        productInfo: {
            type: Object,
            required: true
        },
    })

    const clickItem = () => {
        $emit('clickItem', productInfo)
    }
    const add2Cart = () => {
        $emit('addToCart', productInfo)
    }
</script>

<template>
    <!-- 商品列表卡片，左边图片，中间信息 ，右侧添加购物车按钮-->
    <div class="product-item" @click="clickItem">
        <img :src="productInfo.image" alt="商品图片">
        <div class="infos">
            <div class="label">{{ productInfo.label }}</div>
            <div class="price">￥{{ productInfo.price.toFixed(2) }}</div>
        </div>
        <div class="actions">
            <el-button type="primary" icon="el-icon-plus" circle @click="add2Cart"></el-button>
        </div>  
    </div>
</template>

<style scoped lang="less">
.product-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
    img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 5px;
    }
    .infos {
        flex: 1;
        margin-left: 10px;
        .label {
            font-size: 16px;
            font-weight: bold;
        }
        .price {
            margin-top: 5px;
            color: #f56c6c;
            font-size: 14px;
        }
    }
    .actions {
        align-self: flex-end;
    }
}
</style>