import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/nonsense-milk-tea/', // GitHub Pages 仓库路径
  server: {
    allowedHosts: ['antoniomacbook.local','localhost'],
    port: 3000, // 使用3000端口避免冲突
    host: true,
    open: true
  }
})