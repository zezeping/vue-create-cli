import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import ExtSearchBar from './list/ExtSearchBar'
import ExtTable from './list/ExtTable'
import ExtPagination from './list/ExtPagination'

export default {
  install(app) {
    app.use(ElementPlus, { locale: zhCn, size: 'small', zIndex: 3000 })
    
    app.component('ExtSearchBar', ExtSearchBar)
    app.component('ExtTable', ExtTable)
    app.component('ExtPagination', ExtPagination)
  }
}