import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  //publicDir: 'public',  // 静态资源服务的文件夹, 默认"public"
  plugins: [vue()],
})
