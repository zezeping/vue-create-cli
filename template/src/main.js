import 'normalize.css/normalize.css'
import './assets/stylesheets/application.scss'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import extComponents from './components/ext'
import api from './api'

const app = createApp(App)
app.use(extComponents)
app.use(router)
app.use(api)
app.mount('#app')
