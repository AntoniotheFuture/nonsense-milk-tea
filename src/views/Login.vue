<template>
  <div class="login-page">
    <!-- 场景图 -->
    <div class="scene-image" v-if="isLogin">
      <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20style%20cat%20with%20milk%20tea%20transparent%20background&image_size=landscape_16_9" alt="登录场景" />
    </div>
    <div class="scene-image" v-else>
      <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20style%20cat%20drinking%20milk%20tea%20transparent%20background&image_size=landscape_16_9" alt="注册场景" />
    </div>
    
    <!-- 表单容器 -->
    <div class="form-container">
      <h1>{{ $t('system_name') }}</h1>
      
      <!-- 登录表单 -->
      <el-form v-if="isLogin" ref="loginFormRef" label-position="top" :model="loginFormData" :rules="loginRules">
        <el-form-item :label="$t('username')" prop="username">
          <el-input v-model="loginFormData.username" :placeholder="$t('username_placeholder')" class="custom-input"></el-input>
        </el-form-item>
        <el-form-item :label="$t('password')" prop="password">
          <el-input v-model="loginFormData.password" type="password" :placeholder="$t('password_placeholder')" class="custom-input"></el-input>
        </el-form-item>
        <div class="form-actions">
          <el-button type="primary" @click="submitLogin" class="primary-button">{{ $t('login') }}</el-button>
          <el-button @click="isLogin = false" class="secondary-button">{{ $t('register') }}</el-button>
        </div>
      </el-form>
      
      <!-- 注册表单 -->
      <el-form v-else ref="registerFormRef" label-position="top" :model="registerFormData" :rules="registerRules">
        <el-form-item :label="$t('username')" prop="username">
          <el-input v-model="registerFormData.username" :placeholder="$t('username_placeholder')" class="custom-input"></el-input>
        </el-form-item>
        <el-form-item :label="$t('password')" prop="password">
          <el-input v-model="registerFormData.password" type="password" :placeholder="$t('password_placeholder')" class="custom-input"></el-input>
        </el-form-item>
        <div class="form-actions">
          <el-button type="primary" @click="submitRegister" class="primary-button">{{ $t('register') }}</el-button>
          <el-button @click="isLogin = true" class="secondary-button">{{ $t('back2Login') }}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { useTemplateRef, ref, reactive } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import { state } from '../store/state.js'

const emit = defineEmits(['showError', 'goToHome'])

const loginFormRef = useTemplateRef('loginFormRef')
const registerFormRef = useTemplateRef('registerFormRef')

const isLogin = ref(true)
let errorCount = 0

const loginFormData = ref({
  username: '',
  password: ''
})

const registerFormData = ref({
  username: '',
  password: ''
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 20, message: '用户名长度在4到20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 20, message: '密码长度至少20个字符', trigger: 'blur' }
  ]
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 20, message: '用户名长度在4到20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 20, message: '密码长度至少20个字符', trigger: 'blur' }
  ]
}

// 校验表单并提交登陆
const submitLogin = () => {
  if (!loginFormRef.value) return
  loginFormRef.value.validate((valid, fields) => {
    if (valid) {
      login()
    } else {
      errorCount++
      // 输错3次触发关不掉的错误弹窗
      if (errorCount === 3) {
        emit('showError')
      }
      console.log('error submit!', fields)
    }
  })
}

const submitRegister = () => {
  if (!registerFormRef.value) return
  registerFormRef.value.validate((valid, fields) => {
    if (valid) {
      register()
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 全局state记录用户（模拟）
const login = () => {
  // 用el-loading模拟登录加载
  const loading = ElLoading.service({
    lock: true,
    text: '登录中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  setTimeout(() => {
    loading.close()
    // 匹配ls里的用户信息确定是否登录成功
    let lsKey = 'milk_tea_users_' + loginFormData.value.username
    let storedUser = localStorage.getItem(lsKey)
    if (!storedUser) {
      showNotExistOrPasswordError()
      return
    }
    let userInfo = JSON.parse(storedUser)
    if (userInfo.password !== loginFormData.value.password) {
      showNotExistOrPasswordError()
      return
    }
    state.isLogin = true
    state.userInfo.username = loginFormData.value.username
    // 使用hash导航跳转到首页
    window.location.hash = '/'
  }, 500)
}

const showNotExistOrPasswordError = () => {
  ElMessage({
    message: '用户不存在或密码错误',
    type: 'error',
  })
}

// 将注册信息写入localStorage模拟注册用户，用用户名做key
const register = () => {
  let lsKey = 'milk_tea_users_' + registerFormData.value.username
  localStorage.setItem(lsKey, JSON.stringify(registerFormData.value))
  const loading = ElLoading.service({
    lock: true,
    text: '注册中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  setTimeout(() => {
    loading.close()
    isLogin.value = true
    ElMessage({
      message: '注册成功',
      type: 'success',
    })
  }, 500)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

/* 场景图样式 */
.scene-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

/* 表单容器样式 */
.form-container {
  flex: 1;
  max-width: 400px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
}

/* 标题样式 */
.form-container h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #ff6b6b;
  font-size: 24px;
  font-weight: 600;
}

/* 自定义输入框样式 */
.custom-input {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #ff6b6b;
    box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2);
  }
}

/* 表单操作按钮样式 */
.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.primary-button {
  flex: 1;
  border-radius: 8px;
  padding: 15px 0;
  font-size: 16px;
  font-weight: 600;
  background-color: #ff6b6b;
  border: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #ff5252;
    transform: translateY(-2px);
  }
}

.secondary-button {
  flex: 1;
  border-radius: 8px;
  padding: 15px 0;
  font-size: 16px;
  font-weight: 600;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ff6b6b;
    color: #ff6b6b;
    transform: translateY(-2px);
  }
}

/* 响应式设计 */
@media (min-width: 768px) {
  .login-page {
    flex-direction: row;
  }
  
  .scene-image {
    width: 50%;
    height: 100vh;
  }
  
  .form-container {
    width: 50%;
    max-width: none;
  }
}
</style>