<template>
  <div class="login-page">
    <h1>{{ $t('system_name') }}</h1>
    <!-- 登录表单 -->
    <el-form v-if="isLogin" ref="loginFormRef" label-width="100px" :rules="loginRules">
      <el-form-item :label="$t('username')">
        <el-input v-model="loginFormData.username" :placeholder="$t('username_placeholder')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('password')">
        <el-input v-model="loginFormData.password" type="password" :placeholder="$t('password_placeholder')"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submitLogin">{{ $t('login') }}</el-button>
      <el-button @click="isLogin = false">{{ $t('register') }}</el-button>
    </el-form>
    <!-- 注册表单 -->
    <el-form v-else ref="registerFormRef" label-width="100px" :rules="registerRules">
      <el-form-item :label="$t('username')">
        <el-input v-model="registerFormData.username" :placeholder="$t('username_placeholder')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('password')">
        <el-input v-model="registerFormData.password" type="password" :placeholder="$t('password_placeholder')"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submitRegister">{{ $t('register') }}</el-button>
      <el-button @click="isLogin = true">{{ $t('back2Login') }}</el-button>
    </el-form>
  </div>
</template>

<script setup>
import { useTemplateRef, ref } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import { state } from '../store/state.js'
import { fa } from 'element-plus/es/locales.mjs'
const emit = defineEmits(['showError', 'goToHome'])

const loginFormRef = useTemplateRef('loginFormRef')
const registerFormRef = useTemplateRef('registerFormRef')

const isLogin = ref(true)
let errorCount = 0

let loginFormData = ref({
  username: '',
  password: ''
})

let registerFormData = ref({
  username: '',
  password: ''
})

const loginRules = reactive < FormRules < RuleForm >> ({
  username: [
    { required: true, message: $t('username_required'), trigger: 'blur' },
    // 长度校验
    { min: 4, max: 20, message: $t('username_length_error'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: $t('password_required'), trigger: 'blur' },
    // 长度校验
    { min: 20, max: 40, message: $t('password_length_error'), trigger: 'blur' }
  ]
})

const registerRules = reactive < FormRules < RuleForm >> ({
  username: [
    { required: true, message: $t('username_required'), trigger: 'blur' },
    // 长度校验
    { min: 4, max: 20, message: $t('username_length_error'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: $t('password_required'), trigger: 'blur' },
    // 长度校验
    { min: 20, max: 40, message: $t('password_length_error'), trigger: 'blur' }
  ]
})

// 校验表单并提交登陆
const submitLogin = () => {
    if (!loginFormRef) return
    await loginFormRef.validate((valid, fields) => {
        if (valid) {
            login()
        } else {
            errorCount ++
            // 输错3次触发关不掉的错误弹窗
            if (errorCount === 3) {
                emit('showError')
            }
            console.log('error submit!', fields)
        }
    })
}

const submitRegister = () => {
    if (!registerFormRef) return
    await registerFormRef.validate((valid, fields) => {
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
        text: $t('logging_in'),
        background: 'rgba(0, 0, 0, 0.7)',
    })
    setTimeout(() => {
        loading.close()
        // 匹配ls里的用户信息确定是否登录成功
        let lsKey = 'milk_tea_users' + loginFormData.value.username
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
        $emit('goToHome')
    }, 500)

    state.registerUser({
        username: username.value,
        password: password.value
    })
}

const showNotExistOrPasswordError = () => {
    ElMessage({
        message: $t('user_not_exist_or_password_error'),
        type: 'error',
    })
}

// 将注册信息写入localStorage模拟注册用户，用用户名做key
const register = () => {
    let lsKey = 'milk_tea_users' + registerFormData.value.username
    localStorage.setItem(lsKey, JSON.stringify(registerFormData.value))
    const loading = ElLoading.service({
        lock: true,
        text: $t('registering'),
        background: 'rgba(0, 0, 0, 0.7)',
    })
    setTimeout(() => {
        loading.close()
        isLogin.value = true
        ElMessage({
            message: $t('register_success'),
            type: 'success',
        })
    }, 500)
}
</script>

<i18n>
{
  "en": {
    "system_name": "Nonsense Milk Tea Ordering System V1.0 (Practice Edition)",
    "username": "Username", 
    "login": "Login",
    "register": "Register",
    "password": "Password",
    "password_placeholder": "Enter a 20-character password",
    "password_length_error": "Password must be exactly 20 characters long.",
    "username_required": "Username is required.",
    "username_length_error": "Username length must be between 4 and 20 characters.",
    "logging_in": "Logging in...",
    "user_not_exist_or_password_error": "User does not exist or password is incorrect.",
    "registering": "Registering...",
    "register_success": "Registration successful! You can now log in.",
    "back2Login": "Back to Login"
  },
  "zh": {
    "system_name": "奶茶点单系统 V1.0（练手版）",
    "username": "用户名",
    "login": "登录",
    "register": "注册"
    "password": "密码",
    "password_placeholder": "请输入20位密码",
    "password_length_error": "密码长度必须为20位。",
    "username_required": "用户名为必填项。",
    "username_length_error": "用户名长度必须在4到20位之间。",
    "logging_in": "正在登录...",
    "user_not_exist_or_password_error": "用户不存在或密码错误。",
    "registering": "正在注册...",
    "register_success": "注册成功！现在您可以登录了。",
    "back2Login": "返回登录"
  }
}
</i18n>