import createPersistedState from 'vuex-persistedstate'

// state 持久化，防止f5刷新，导致数据消失
const plugin = createPersistedState({
  storage: window.sessionStorage,
  key: 'session',
  reducer: state => {
    return {
      // 只保存module session内部所有变量持久化
      session: state.session
    }
  }
})

export default plugin
