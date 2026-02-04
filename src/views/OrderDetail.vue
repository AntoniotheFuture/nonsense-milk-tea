<template>
  <div class="order-detail">
    <h2>订单详情</h2>
    <p>订单号: {{ orderId }}</p>
    <p>商品名称: {{ productName }}</p>
    <p>数量: {{ quantity }}</p>
    <p>总价: ¥{{ totalPrice }}</p>
    <p>下单时间: {{ orderTime }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const orderId = ref('1234567890')
const productName = ref('五彩珍珠奶茶')
const quantity = ref(2)
const totalPrice = ref(30.00)
const orderTime = ref('2024-06-15 14:30:00')
</script>