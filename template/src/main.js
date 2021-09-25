import 'normalize.css/normalize.css'
import './assets/stylesheets/application.scss'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import sharedComponents from './components/shared'
import api from './api'

const app = createApp(App)
app.use(sharedComponents)
app.use(router)
app.use(store)
app.use(api)
app.mount('#app')
