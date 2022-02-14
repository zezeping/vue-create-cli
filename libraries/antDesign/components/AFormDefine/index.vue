<template>
  <a-form ref="formRef" class="ant-form-define" v-bind="formAttrs">
    <template #default>
      <slot name="default" v-bind="{formRef, submitLoading, ...formAttrs}">
        <template v-for="(child, idx) in (config?._children || [])" :key="idx">
          <ui-define :config="child"></ui-define>
        </template>
      </slot>
    </template>
  </a-form>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent, computed, inject, onMounted } from 'vue'
import { useLoading } from 'ui-define'

export default defineComponent({
  inheritAttrs: false,
  props: {
    config: [Object],
  },
  expose: ['formRef'],
  //emits: ['submit', 'cancel', 'reset'],
  setup (props, ctx) {
    const modalState = inject('modalState', null)
    const state = reactive({
      submitLoading: useLoading(),
      formRef: null,
      formAttrs: computed(() => {
        const attrs = {}
        for (const key in ctx.attrs) {
          if (!/^(_|onSubmit|onCancel|onReset)/.test(key)) {
            attrs[key] = ctx.attrs[key]
          }
        }
        // onSubmit
        attrs['onSubmit'] = (...args) => {
          state.formRef.validate().then(async () => {
            state.submitLoading.load(async () => {
              //await new Promise(resolve => {
              //  setTimeout(() => {
              //    resolve()
              //  }, 3000)
              //})
              if (ctx.attrs['onSubmit']) {
                args = args.length ? args : [props.config?.model || ctx.attrs.model || {}]
                await ctx.attrs['onSubmit'](...args)
              }
            })
          })
        }
        // onCancel
        attrs['onCancel'] = (...args) => {
          if (modalState?.close) { modalState.close() }
          if (ctx.attrs['onCancel']) { ctx.attrs['onCancel'](...args) }
        }
        // onReset
        attrs['onReset'] = (...args) => {
          state.formRef.resetFields()
          if (ctx.attrs['onReset']) { ctx.attrs['onReset'](...args) }
        }
        attrs.model = attrs.model || props.config?.model || {}
        return props.config ? Object.assign(props.config, attrs) : attrs
      }),
    })
    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
.ant-form-define {
  padding: 15px 15px 5px;

  &.ant-form-inline {
    ::v-deep(.ant-form-item) {
      margin-bottom: 10px;
    }
  }

  ::v-deep(.ant-select) {
    min-width: 100px;
  }
  ::v-deep(.ant-input-number) {
    min-width: 100px;
  }
}
</style>