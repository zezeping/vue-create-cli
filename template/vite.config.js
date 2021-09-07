import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    extensions: ['.json', '.js', '.vue', '.ts'],
    alias: {
      '@': resolve('src')
    }
  },
  // https://vitejs.dev/config/#server-options
  server: {
    host: 'localhost',
    port: 8800,
    // strictPort: false,
    // https: false,
    // open: '/',
    // https://vitejs.dev/config/#server-proxy
    proxy: {
      // '/api': 'http://127.0.0.1:3000',
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `$injectedColor: orange;`
        additionalData: '@import "@/assets/stylesheets/globalInjectedData.scss";'
      }
    }
  },
  plugins: [vue()]
})
