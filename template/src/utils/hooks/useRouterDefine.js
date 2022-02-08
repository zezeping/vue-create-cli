import NProgress from 'nprogress'

export const useDefine = (options = {}) => {
  const { component, ...finalOptions } = options
  if (typeof options['component'] === 'function') {
    finalOptions['component'] = () => {
      const result = options['component']()
      if (typeof result === 'object' && typeof result.then === 'function') {
        NProgress.start()
        result.finally(() => {
          NProgress.done()
        })
      }
      return result
    }
  } else {
    finalOptions['component'] = component
  }
  return finalOptions
}