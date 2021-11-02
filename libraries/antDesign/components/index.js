import 'ant-design-vue/dist/antd.css'
import ext from './ext'
export default {
  install(app) {
    app.use(ext)
  }
}