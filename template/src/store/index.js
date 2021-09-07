import { createStore } from 'vuex'
// import plugins from './plugins'

import app from './modules/app'
import user from './modules/user'
// import session from './modules/session'
// import storage from './modules/storage'

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    app,
    user,
    // session,
    // storage
  },
  plugins: [
    // ...plugins
  ]
})
