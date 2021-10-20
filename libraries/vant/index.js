import 'vant/lib/index.css'
import ext from './ext'

export default {
  install(app) {
    app.use(ext)
  }
}