<template>
  <a-upload @change="selectFileChange" :beforeUpload="() => false" :show-upload-list="false">
    <slot></slot>
  </a-upload>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent } from 'vue'

export default defineComponent({
  setup (_props, _ctx) {
    const state = reactive({
      selectFileChange({file, fileList}) {
        console.log(...arguments)
      },
    })
    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
</style>