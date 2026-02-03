<template>
  <div class="nav-button" :class="{ active: active }" @click="handleClick">
    <el-icon :size="20" color="#000">
      <slot name="el-icon"></slot>
    </el-icon>
    <span class="label">{{ label }}</span>
  </div>
</template>

<script setup>
const emit = defineEmits(['click'])

defineProps({
  label: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
})

const handleClick = () => {
  emit('click')
}
</script>

<style scoped lang="less">
.nav-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  cursor: pointer;
  &.active {
    .label {
      color: #ff6b6b;
      font-weight: bold;
    }
  }
}
.label {
  margin-top: 4px;
  font-size: 12px;
  color: #000;
}
</style>