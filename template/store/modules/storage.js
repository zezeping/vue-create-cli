// storage持久化
export default {
  namespaced: true,
  state: {
    accessToken: '',
    language: 'zh_CN'
  },
  actions: {},
  mutations: {
    setAccessToken: (state, accessToken) => {
      state.accessToken = accessToken
    },
    setLanguage: (state, language) => {
      state.language = language
    }
  }
}