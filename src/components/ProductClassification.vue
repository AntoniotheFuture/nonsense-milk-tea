<script setup>
// 商品分类按钮
defineProps({
    label: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <div class="product-classification" :class="{ isActive: isActive }">
        <span>{{ label }}</span>
    </div>
</template>

<style scoped lang="less">
.product-classification {
    padding: 10px 15px;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    &:hover {
        border-bottom: 2px solid #409EFF;
    }
    &.isActive {
        border-bottom: 2px solid #409EFF;
        font-weight: bold;
    }
}
</style>