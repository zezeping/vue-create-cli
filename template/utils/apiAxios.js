import axios from 'template/utils/apiAxios'
// import store from '../store'

// 创建 api 实例
const apiAxios = axios.create({
    baseURL: import.meta.env.VUE_APP_API_BASE_URL || '/', // process.env.NODE_ENV === 'development' ? '' : process.env.VUE_APP_API_BASE_URL,
    timeout: 1000 * 60
})

// 设置 post 请求头
apiAxios.defaults.headers.post['Content-Type'] = 'application/json'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

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
    return Promise.reject(error)
})

export default apiAxios