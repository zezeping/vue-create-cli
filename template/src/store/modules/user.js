export default {
  namespaced: true,
  state: {
    authInfo: null,
    userInfo: null,
  },
  actions: {},
  mutations: {
    setAuthInfo: (state, authInfo) => {
      state.authInfo = { ...state.authInfo, ...authInfo }
    },
    setUserInfo: (state, userInfo) => {
      state.userInfo = { ...userInfo }
    },
    clearLoginInfo(state) {
      state.authInfo = null
      state.userInfo = null
    }
  }
}