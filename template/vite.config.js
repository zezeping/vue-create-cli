import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import eslintPlugin from 'vite-plugin-eslint'
// import stylelintPlugin from '@amatlash/vite-plugin-stylelint'
// https://github.com/antfu/unplugin-vue-components
import Components from 'unplugin-vue-components/vite'
import {
  // AntDesignVueResolver,
  // ElementPlusResolver,
  // VantResolver,
} from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import visualizer from "rollup-plugin-visualizer"

function pathResolve() {
  return resolve(__dirname, '.', ...arguments)
}

const plugins = [
  vue(),
  vueJsx(),
  // eslintPlugin({ cache: false }),
  // stylelintPlugin(),
  Icons({
    compiler: 'vue3',
    customCollections: {
      // <i-svg-help style="font-size: 50px; fill: red;" />
      svg: FileSystemIconLoader('src/assets/images/svg-icons'),
      'svg-inline': {
        // <i-svg-inline-foo />
        // <i-svg2-foo />
        foo: `<svg viewBox="0 0 100 100"><rect x="0" y="0" width="100%" height="100%"/><circle cx="50%" cy="50%" r="50" fill="white"/></svg>`,
      },
    },
  }),
  Components({
    resolvers: [
      // AntDesignVueResolver({ importStyle: false, resolveIcons: true }),
      // ElementPlusResolver({ importStyle: false }),
      // VantResolver({ importStyle: false }),
      IconsResolver({
        alias: {
          svg2: 'svg-inline',
        },
        customCollections: ['svg', 'svg-inline'],
      }),
    ],
  }),
]
if (process.env.FOR_ANALYTICS) {
  plugins.push(visualizer({
    open: true,
    gzipSize: true,
    brotliSize: true,
  }))
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
          charset: false,
          // additionalData: `$injectedColor: orange;`
          additionalData: '@import "@/assets/stylesheets/globalInjectedData.scss";'
        }
      }
    },
    plugins,
    build: {
      rollupOptions: {
        output:{
          manualChunks: {
            //moment: ['moment'],
            //'lodash-es': ['lodash-es'],
            //'ant-design-vue': ['ant-design-vue'],
            //'element-plus': ['element-plus'],
            //vant: ['vant'],
          }
        }
      }
    }
  }
})
