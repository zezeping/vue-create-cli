import { reactive } from 'vue'
export function useLoading() {
  const loading = reactive({
    value: false,
    async load(executor) {
      console.assert(!!executor, '必须传递执行器')
      try {
        loading.value = true
        if (typeof executor === 'object' && typeof executor.then === 'function') {
          await executor
        } else if (typeof executor === 'function') {
          await executor()
        }
      } finally {
        loading.value = false
      }
    }
  })
  return loading
}

//import { useLoading } from '@/utils/hooks/useLoading'
//const loading = useLoading()
//console.log(loading.value)
//loading.load(async() => {})