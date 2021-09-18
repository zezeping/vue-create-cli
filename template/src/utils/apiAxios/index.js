import axios from 'axios'
import supportMetaCancelToken from './supportMetaCancelToken'
// import store from '../store'

// 创建 api 实例
const apiAxios = axios.create({
  // https://cn.vitejs.dev/guide/env-and-mode.html
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || '/',
  timeout: 1000 * 60
})
apiAxios.CancelToken = axios.CancelToken
apiAxios.isCancel = axios.isCancel
// 设置 post 请求头
apiAxios.defaults.headers.post['Content-Type'] = 'application/json'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

supportMetaCancelToken(apiAxios)

// 请求拦截
apiAxios.interceptors.request.use(config => {
  // let accessToken = store.state.user.accessToken
  // if (accessToken) {
  //   config.headers.Authorization = `Bearer ${ accessToken }`
  // }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截
apiAxios.interceptors.response.use(res => {
  // 请求成功
  return Promise.resolve(res)
}, error => {
  // 请求失败
  if (axios.isCancel(error)) {
    console.error('主动取消')
  }
  return Promise.reject(error)
})
export default apiAxios