import createPersistedState from 'vuex-persistedstate'

// state 持久化，防止f5刷新，导致数据消失
const plugin = createPersistedState({
  storage: window.localStorage,
  key: 'storage',
  reducer: state => ({
    // 整个module字段都持久化
    storage: state.storage,
    // 持久化部分module字段
     user: {
      authInfo: state.user.authInfo,
      userInfo: state.user.userInfo,
    }
  })
})

export default plugin
