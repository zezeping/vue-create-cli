export const regex = (options) => {
  const regexValidator = (rule, value, callback) => new Promise( (resolve, reject) => {
    if (options.regex && value && !value.match(options.regex)) {
      callback && callback(new Error('匹配失败'))
      reject(new Error('匹配失败'))
      return
    } else {
      callback && callback()
      resolve()
    }
  })
  return Object.assign({ validator: regexValidator, message: '匹配错误', trigger: 'blur' }, options)
}

export default {
  install (app, varName = '$validators') {
    app.config.globalProperties[varName] = {
      // this.$validators.regex({regex: '...', message: '不匹配'})
      regex
    }
  }
}
