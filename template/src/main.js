import 'normalize.css/normalize.css'
// import 'lib-flexible'
import './assets/stylesheets/application.scss'
import { createApp, render } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import i18n from './i18n'

import sharedComponents from './components/shared'
import api from './api'

const app = createApp(App)
app.use(sharedComponents)
app.use(router)
app.use(store)
app.use(api)
// app.use(i18n)
app.mount('#app')

app.render = (vnode, rootContainer) => {
  if (vnode) vnode.appContext = app._context
  render(vnode, rootContainer)
}
