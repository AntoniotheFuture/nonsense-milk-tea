<template>
  <div class="address-edit-page">
    <div class="address-edit-header">
      <BackButton @click="goBack" />
      <h1>修改配送地址</h1>
    </div>
    
    <div class="address-edit-content">
      <el-form :model="addressForm" :rules="addressRules" ref="addressFormRef" label-width="80px">
        <el-form-item label="收货人" prop="name">
          <el-input v-model="addressForm.name" placeholder="请输入收货人姓名" />
        </el-form-item>
        
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addressForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        
        <el-form-item label="所在地区" prop="region">
          <el-cascader
            v-model="addressForm.region"
            :options="regionOptions"
            placeholder="请选择省/市/区"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input
            v-model="addressForm.detailAddress"
            type="textarea"
            placeholder="请输入详细地址"
            :rows="3"
          />
        </el-form-item>
        
        <el-form-item label="邮编" prop="zipCode">
          <el-input v-model="addressForm.zipCode" placeholder="请输入邮编" />
        </el-form-item>
        
        <el-form-item label="标签">
          <div class="address-tags">
            <div 
              v-for="tag in addressTags" 
              :key="tag"
              class="address-tag"
              :class="{ active: selectedTag === tag }"
              @click="selectedTag = tag"
            >
              {{ tag }}
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="address-edit-footer">
      <el-button type="primary" size="large" @click="saveAddress" style="width: 100%; background-color: #ff6b6b; border-color: #ff6b6b;">
        保存修改
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import BackButton from '../components/BackButton.vue'

// 返回上一页
const goBack = () => {
  window.history.back()
}

// 地址表单
const addressForm = ref({
  name: '张三',
  phone: '13800138000',
  region: ['广东省', '深圳市', '南山区'],
  detailAddress: '深南大道10000号',
  zipCode: '518000'
})

// 地址标签
const addressTags = ['家', '公司', '学校', '其他']
const selectedTag = ref('家')

// 地区选项（简化版）
const regionOptions = ref([
  {
    value: '广东省',
    label: '广东省',
    children: [
      {
        value: '深圳市',
        label: '深圳市',
        children: [
          { value: '南山区', label: '南山区' },
          { value: '福田区', label: '福田区' },
          { value: '罗湖区', label: '罗湖区' },
          { value: '宝安区', label: '宝安区' },
          { value: '龙岗区', label: '龙岗区' }
        ]
      }
    ]
  }
])

// 表单验证规则
const addressRules = {
  name: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  region: [
    { required: true, message: '请选择所在地区', trigger: 'change' }
  ],
  detailAddress: [
    { required: true, message: '请输入详细地址', trigger: 'blur' }
  ]
}

// 表单引用
const addressFormRef = ref(null)

// 保存地址
const saveAddress = () => {
  if (addressFormRef.value) {
    addressFormRef.value.validate((valid) => {
      if (valid) {
        // 模拟保存地址
        setTimeout(() => {
          ElMessage.success('地址修改成功！')
          // 保存成功后返回上一页
          setTimeout(() => {
            goBack()
          }, 1000)
        }, 1000)
      } else {
        ElMessage.error('请检查表单信息！')
      }
    })
  }
}

// 初始化
onMounted(() => {
  // 可以从路由参数或localStorage中获取当前地址信息
  // 这里简化处理，直接使用默认值
})
</script>

<style lang="less" scoped>
.address-edit-page {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.address-edit-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  .back-button {
    font-size: 16px;
    margin-right: 20px;
  }
  
  h1 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
}

.address-edit-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.address-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.address-tag {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ff6b6b;
    color: #ff6b6b;
  }
  
  &.active {
    background-color: #ff6b6b;
    color: #fff;
    border-color: #ff6b6b;
  }
}

.address-edit-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  z-index: 100;
}
</style>