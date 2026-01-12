import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zh from './i18n/zh.js'
import en from './i18n/en.js'

const message = {
    zh: zh,
    en: en,
}

const i18n = createI18n({
    // something vue-i18n options here ...
    locale: 'zh', // 设置语言类型
    legacy: false, // 如果要支持compositionAPI，此项必须设置为false;
    globalInjection: true, // 全局注册$t方法
    messages: message,
})

const app = createApp(App)
// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(i18n)
app.use(ElementPlus)
app.mount('#app')
