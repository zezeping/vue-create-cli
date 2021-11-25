<template>
  <a-form ref="formRef" class="ax-form" :model="formModel" v-bind="{...$attrs, ...formAttrs}">
    <slot v-bind="{...$attrs , config, formModel, setFormModel, onSubmit, onReset, onCancel}">
      <template v-for="(formItem, idx) in config.formItems" :key="idx">
        <slot :name="`${formItem.name}FormItem`" v-bind="{ formItemAttrs: formItemAttrs(formItem), formItem, formModel, onSubmit, onReset, onCancel }">
          <a-form-item v-if="slotKeys.indexOf(`${formItem.name}FormItem`) === -1" v-bind="formItemAttrs(formItem)">
            <slot :name="formItem.name" v-bind="{ formItem, formModel, onSubmit, onReset, onCancel }">
              <template v-if="'a-checkbox' === formItem.type">
                <a-checkbox v-model:checked="formItem.value" v-bind="formItem.attrs">{{ formItem.attrs.label || formItem.value }}</a-checkbox>
              </template>
              <template v-else>
                <component :is="formItem.type" v-model:value="formItem.value" v-bind="formItem.attrs"></component>
              </template>
            </slot>
          </a-form-item>
        </slot>
      </template>
    </slot>
    <slot name="operationsFormItem" v-bind="{ config, formModel, onSubmit, onReset, onCancel, submitLoading }">
      <a-form-item v-if="slotKeys.indexOf(`operationsFormItem`) === -1" class="operations-form-item" v-bind="config.operationsFormItem">
        <slot name="operations" v-bind="{ config, formModel, onSubmit, onReset, onCancel, submitLoading }">
          <a-button type="primary" style="margin: 0 5px;" @click="onSubmit" :loading="submitLoading.value">提交</a-button>
          <a-button style="margin: 0 5px;" @click="onCancel">取消</a-button>
          <a-button style="margin: 0 5px;" @click="onReset">重置</a-button>
        </slot>
      </a-form-item>
    </slot>
  </a-form>
</template>

<script>
import { computed, reactive, toRefs, nextTick } from 'vue'
import { Input, Select, Checkbox, Textarea } from 'ant-design-vue'
import { useOmitKeys } from '@/utils/hooks/useObject'
import { useLoading } from '@/utils/hooks/useLoading'
import AxInput from './AxInput'
import AxSelect from './AxSelect'
import AxCheckboxGroup from './AxCheckboxGroup'
export default {
  name: 'AxForm',
  components: {
    [Input.name]: Input,
    [Select.name]: Select,
    [Checkbox.name]: Checkbox,
    [Textarea.name]: Textarea,
    AxInput,
    AxSelect,
    AxCheckboxGroup,
  },
  inheritAttrs: false,
  props: {
    // keys: model, formItems, operations
    config: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['submit', 'reset', 'cancel'],
  setup(props, ctx) {
    const omitKeys = useOmitKeys()
    const state = reactive({
      submitLoading: useLoading(),
      slotKeys: computed(() => Object.keys(ctx.slots)),
      formAttrs: computed(() => omitKeys.value(props.config, ['model', 'formItems'])),
      formItemAttrs: computed(() => (formItem) => omitKeys.value(formItem, ['type', 'attrs', 'value'])),
      formRef: null,
      defaultFormModel: null,
      validate: () => state.formRef.validate(),
      formModel: computed(() => {
        if (ctx.attrs.model) {
          return ctx.attrs.model
        }
        const form = { ...state.defaultFormModel, ...props.config.model }
        for (const formItem of (props.config.formItems || [])) {
          form[formItem.name] = typeof formItem.getValue === 'function' ? formItem.getValue(formItem, form) : formItem.value
        }
        return form
      }),
      setFormModel(formModel) {
        for (const formItem of (props.config.formItems || [])) {
          if (typeof formItem.setValue === 'function') {
            formItem.setValue(formItem, formModel)
          } else if (Object.prototype.hasOwnProperty.call(formModel, formItem.name)) {
            formItem.value = formModel[formItem.name]
          }
        }
      },
      setDefaultFormModel(defaultFormModel) {
        state.setFormModel(defaultFormModel)
        state.defaultFormModel = defaultFormModel
      }
    })
    state.setDefaultFormModel(state.formModel)

    const onCancel = () => ctx.emit('cancel')
    return {
      ...toRefs(state),
      onSubmit() {
        state.formRef.validate().then(async () => {
          ctx.emit('submit', {...state.formModel}, { submitLoading: state.submitLoading, onCancel })
        })
      },
      onReset() {
        // state.formRef.resetFields()
        nextTick(() => {
          state.setFormModel(state.defaultFormModel)
          ctx.emit('reset', {...state.formModel})
        })
      },
      onCancel
    }
  }
}
</script>