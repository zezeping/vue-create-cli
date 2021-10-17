import axios from 'axios'
import apiAxios from '@/utils/apiAxios'

export * as usersApi from './modules/users'

export default {
  install (vueInstance) {
    Object.defineProperty(vueInstance.config.globalProperties, '$axios', {
      get: () => axios,
    })
    Object.defineProperty(vueInstance.config.globalProperties, '$apiAxios', {
      get: () => apiAxios,
    })
  },
}