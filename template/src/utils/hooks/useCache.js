import { reactive, computed } from 'vue'

class Cache {
  constructor() {
    this._storage = reactive({})
  }
  setDefaultValue(cacheKey, options) {
    if (!Object.prototype.hasOwnProperty.call(this._storage, cacheKey) || options.forceReload || this._storage[cacheKey].checksum !== options.checksum) {
      this._storage[cacheKey] = {
        checksum: options.checksum,
        value: options.defaultValue,
        loaded: false
      }
    }
  }
  getValue(cacheKey, dataLoader, options) {
    console.assert(typeof dataLoader === 'function', 'dataLoader必须为返回Promise的函数')
    this.setDefaultValue(cacheKey, options)
    return computed(() => {
      // 只有使用到该变量才去获取数据
      if (!this._storage[cacheKey].loaded) {
        this._storage[cacheKey].loaded = true
        const loaderPromise = dataLoader()
        console.assert(loaderPromise && Object.prototype.toString.call(loaderPromise) === '[object Promise]', 'dataLoader must be a promise')
        loaderPromise.then(value => {
          this._storage[cacheKey].value = value
        })
      }
      return this._storage[cacheKey].value
    })
  }
}

const cache = new Cache()

export const useCache = (cacheKey, dataLoader, options) => {
  /**
   * @type {{defaultValue: null, checksum: string, forceReload: boolean}}
   * defaultValue: 异步获取数据前的默认值
   * forceReload: 强制刷新缓存
   * checksum: 根据校验码是否相同判断之前缓存是否过期
   */
  options = { forceReload: false, defaultValue: null, checksum: '', ...options }
  console.assert(typeof dataLoader === 'function', 'dataLoader must be a function')
  return cache.getValue(cacheKey, dataLoader, options)
}