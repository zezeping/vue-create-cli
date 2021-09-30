import NProgress from 'nprogress'

export const useLoader = (componentLoader, options = {}) => {
  return () => {
    NProgress.start()
    return componentLoader.finally(() => {
      NProgress.done()
    })
  }
}