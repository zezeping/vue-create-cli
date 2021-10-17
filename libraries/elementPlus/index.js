import 'element-plus/dist/index.css'
import { ElLoading } from 'element-plus'
import ext from './ext'

export default {
  install(app) {
    app.config.globalProperties.$ELEMENT = { size: 'small', zIndex: 3000 }
    app.use(ElLoading)
    app.use(ext)
  }
}