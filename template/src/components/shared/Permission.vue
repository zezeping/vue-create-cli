<template>
  <slot :hasPermission="hasPermission"></slot>
</template>

<script>
import { computed, reactive, toRefs, defineComponent } from 'vue'

export default defineComponent({
  props: {
    for: [String],
  },
  setup (props, context) {
    const state = reactive({
      hasPermission: computed(() => {
        return true
      })
    })
    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
</style>