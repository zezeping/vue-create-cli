import ElxForm from './form/ElxForm'
import ElxSelect from './form/ElxSelect'

import ElxSearchBar from './list/ElxSearchBar'
import ElxTable from './list/ElxTable'
import ElxPagination from './list/ElxPagination'

export default {
  install(app) {
    app.component('ElxForm', ElxForm)
    app.component('ElxSelect', ElxSelect)
    
    app.component('ElxSearchBar', ElxSearchBar)
    app.component('ElxTable', ElxTable)
    app.component('ElxPagination', ElxPagination)
  }
}