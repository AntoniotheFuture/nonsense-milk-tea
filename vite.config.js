import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    allowedHosts: ['antoniomacbook.local','localhost'],
    port: 3000, // 使用3000端口避免冲突
    host: true,
    open: true
  }
})