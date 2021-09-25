import { computed } from 'vue'
export function useOmitKeys() {
  return computed(() => {
    return (object, omitKeys = []) => {
      const obj = { ...object }
      for (const key of omitKeys) {
        delete obj[key]
      }
      return obj
    }
  })
}