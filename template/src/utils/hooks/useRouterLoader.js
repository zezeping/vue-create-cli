import NProgress from 'nprogress'

export const useLoader = (componentLoader, _options = {}) => {
  console.assert(typeof componentLoader === 'function', 'componentLoader not a function!')
  return () => {
    NProgress.start()
    return componentLoader().finally(() => {
      NProgress.done()
    })
  }
}