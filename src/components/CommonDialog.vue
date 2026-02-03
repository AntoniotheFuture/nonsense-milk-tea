<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="width"
    :show-close="false"
    :modal="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleBeforeClose"
    class="common-dialog"
  >
    <div class="dialog-content">
      <slot></slot>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          v-if="showCancel"
          @click="handleCancel"
          class="cancel-button"
        >
          {{ cancelText }}
        </el-button>
        <el-button
          v-if="showConfirm"
          type="primary"
          @click="handleConfirm"
          class="confirm-button"
        >
          {{ confirmText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '提示'
  },
  width: {
    type: String,
    default: '300px'
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  showConfirm: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmText: {
    type: String,
    default: '确定'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'before-close'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleConfirm = () => {
  emit('confirm')
  dialogVisible.value = false
}

const handleCancel = () => {
  emit('cancel')
  dialogVisible.value = false
}

const handleBeforeClose = (done) => {
  emit('before-close', done)
}
</script>

<style scoped>
.common-dialog .el-dialog__header {
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 20px;
}

.common-dialog .el-dialog__title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.common-dialog .el-dialog__body {
  padding: 30px 20px;
  font-size: 16px;
  line-height: 1.5;
  color: #666;
}

.common-dialog .el-dialog__footer {
  background-color: #fff;
  border-top: 1px solid #f0f0f0;
  padding: 15px 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button {
  border: 1px solid #dcdfe6;
  color: #606266;
  font-size: 14px;
  padding: 8px 20px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.confirm-button {
  background-color: #ff6b6b;
  border-color: #ff6b6b;
  color: #fff;
  font-size: 14px;
  padding: 8px 20px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.confirm-button:hover {
  background-color: #ff5252;
  border-color: #ff5252;
}
</style>