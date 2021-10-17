import NProgress from 'nprogress'

export const useLoader = (componentLoader, _options = {}) => {
  return () => {
    NProgress.start()
    return componentLoader.finally(() => {
      NProgress.done()
    })
  }
}