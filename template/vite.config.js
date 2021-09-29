import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// https://github.com/antfu/unplugin-vue-components
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver, ElementPlusResolver, VantResolver } from 'unplugin-vue-components/resolvers'
// https://github.com/jpkleemans/vite-svg-loader
import svgLoader from 'vite-svg-loader'

function pathResolve() {
  return resolve(__dirname, '.', ...arguments)
}

// https://vitejs.dev/config/
export default defineConfig(params => {
  const { command, mode } = params
  const ENV = loadEnv(mode, process.cwd())
  console.info(`--- running mode: ${mode}, command: ${command}, ENV: ${JSON.stringify(ENV)} ---`)
  return {
    resolve: {
      extensions: ['.json', '.js', '.vue', '.ts'],
      alias: {
        '@': pathResolve('src')
      }
    },
    // https://vitejs.dev/config/#server-options
    server: {
      host: 'localhost',
      port: 8800,
      // strictPort: false,
      // https: false,
      // open: '/',
      disableHostCheck: true, // 解决127.0.0.1指向其他域名时出现"Invalid Host header"问题
      // https://vitejs.dev/config/#server-proxy
      // proxy: { '/api': 'http://127.0.0.1:3000', },
      proxy: {
        '^/api': {
          target: '<url>',
          changOrigin: true // 配置跨域
          // ws: true, // 配置ws跨域
          // secure: false, // https协议才设置
          // loglevel: 'debug',
          // rewrite: path => path.replace(/^\/api/, '')
        }
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
    plugins: [
      vue(),
      vueJsx(),
      Components({
        resolvers: [
          AntDesignVueResolver({ importStyle: false }),
          ElementPlusResolver({ importStyle: false }),
          VantResolver({ importStyle: false })
        ],
      }),
      svgLoader({
        svgoConfig: {
          multipass: true
        }
      })
    ]
  }
})
