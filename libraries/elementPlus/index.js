import 'element-plus/dist/index.css'
import { ElLoading } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import ext from './ext'

export default {
  install(app) {
    app.config.globalProperties.$ELEMENT = { locale: zhCn, size: 'small', zIndex: 3000 }
    app.use(ElLoading)
    app.use(ext)
  }
}