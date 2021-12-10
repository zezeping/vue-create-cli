<template>
  <slot v-bind="{onChange: onDelayChange}"></slot>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent, nextTick } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  emits: ['change'],
  setup (_props, ctx) {
    const state = reactive({
      onDelayChange() {
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