<template>
  <a-input @change="onChange"></a-input>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent, nextTick } from 'vue'

export default defineComponent({
  emits: ['change'],
  setup (props, ctx) {
    const state = reactive({
      // 修复AxForms使用computed属性校验时无法得到最新数据
      onChange() {
        nextTick(() => {
          ctx.emit('change', ...arguments)
        })
      }
    })
    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
</style>