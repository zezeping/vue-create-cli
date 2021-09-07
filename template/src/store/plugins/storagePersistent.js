import createPersistedState from 'vuex-persistedstate'

// state 持久化，防止f5刷新，导致数据消失
const plugin = createPersistedState({
  storage: window.localStorage,
  key: 'storage',
  reducer: state => {
    return {
      // 只保存module storage内部所有变量持久化
      storage: state.storage
    }
  }
})

export default plugin
