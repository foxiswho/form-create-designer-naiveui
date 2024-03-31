import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
// 可以动态处理html文件内容的
import { createHtmlPlugin } from 'vite-plugin-html'
import { resolve } from 'path'
const extnedsPlugins = [];
// https://vitejs.dev/config/
export default defineConfig(({ command, mode })=>{
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  if ( 'build'=== command) {
    console.log("生产环境")
  }else if ( 'serve'=== command) {
    console.log("开发环境")
    extnedsPlugins.push(createHtmlPlugin({
      inject:{
        data:{
          // 定义了一个title 变量，可以被html中进行引用
          title:env.VITE_APP_TITLE,
        }
      }
    }))
  }
  return {
    // vite 配置
    define: {
      __APP_ENV__: JSON.stringify(env),
    },
    base: './',
    plugins: [vue(), ...extnedsPlugins]}
})
