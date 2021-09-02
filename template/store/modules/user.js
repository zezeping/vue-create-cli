export default {
  namespaced: true,
  state: {
    userInfo: null
  },
  actions: {},
  mutations: {
    setUserInfo: (state, userInfo) => {
      state.userInfo = userInfo
    }
  }
}