import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite の設定: React プラグインを有効化
export default defineConfig({
  plugins: [react()],
  // GitHub Pages は /task_board/ 配下で公開されるため、ビルド時のみパスを合わせる
  base: process.env.NODE_ENV === 'production' ? '/task_board/' : '/',
})
