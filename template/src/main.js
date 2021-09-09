import './assets/stylesheets/application.scss'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import extComponents from './components/ext'
import api from './api'

const vue = createApp(App)
vue.use(router)
vue.use(extComponents)
vue.use(api)
vue.mount('#app')
