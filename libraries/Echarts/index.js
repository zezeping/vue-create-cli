import { defineAsyncComponent } from 'vue'

export default {
  install(app) {
    app.component('Echarts', defineAsyncComponent(() => import('./Echarts')))
  }
}