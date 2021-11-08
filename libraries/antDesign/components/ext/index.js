import AxForm from './form/AxForm'
import AxSelect from './form/AxSelect'
import AxCheckboxGroup from './form/AxCheckboxGroup'

import AxSearchBar from './list/AxSearchBar'
import AxPagination from './list/AxPagination'
import AxTable from './list/AxTable'
export default {
  install(app) {
    app.component('AxForm', AxForm)
    app.component('AxSelect', AxSelect)
    app.component('AxCheckboxGroup', AxCheckboxGroup)
    
    app.component('AxSearchBar', AxSearchBar)
    app.component('AxPagination', AxPagination)
    app.component('AxTable', AxTable)
  }
}