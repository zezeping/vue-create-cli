//import 'ant-design-vue/dist/antd.css'
import 'ant-design-vue/dist/antd.less'
import AFormDefine from './AFormDefine'
import ATableDefine from './ATableDefine'
import ConfirmModal from './modals/ConfirmModal'
export default {
  install(app) {
    app.component('AFormDefine', AFormDefine)
    app.component('ATableDefine', ATableDefine)
    app.component('ConfirmModal', ConfirmModal)
  }
}