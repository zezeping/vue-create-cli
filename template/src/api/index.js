import axios from 'axios'
import apiAxios from '@/utils/apiAxios'
import * as users from './modules/users'

export { users }

export default {
    install (vueInstance) {
        Object.defineProperty(vueInstance.config.globalProperties, '$axios', {
            get: () => axios,
        })
        Object.defineProperty(vueInstance.config.globalProperties, '$apiAxios', {
            get: () => apiAxios,
        })
    }
}