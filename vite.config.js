import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    assetsDir: 'assets',
    // 确保构建时复制 public 目录下的文件
    copyPublicDir: true
  }
})
