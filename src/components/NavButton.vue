<template>
  <div class="nav-button" :class="{ active: active }" @click="emit('click')">
    <el-icon :size="20" :color="color">
      <slot name="el-icon"></slot>
    </el-icon>
    <span class="label">{{ label }}</span>
  </div>
</template>

<script setup>
const emit = defineEmits(['adEnd'])

defineProps({
  label: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#000'
  },
  active: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="less">
.nav-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  &.active {
    .label {
      color: aqua;
    }
  }
}
.label {
  margin-top: 4px;
  font-size: 12px;
  color: #333;
}
</style>