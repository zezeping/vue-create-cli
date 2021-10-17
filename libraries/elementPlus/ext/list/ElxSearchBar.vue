<template>
  <elx-form v-if="formItems && formItems.length" ref="formRef" class="elx-search-bar" :config="config" v-bind="omitKeys(config, ['formItems'])" @submit="submit">
    <template v-for="(slotKey, idx) in slotKeys" :key="idx" #[computedAxFormSlotKey(slotKey)]="slotProps">
      <slot :name="slotKey" v-bind="slotProps"></slot>
    </template>
    <template #operationsFormItem="{ onSubmit, onReset }">
      <slot name="operationsFormItemQuery">
        <el-form-item v-bind="config.operationsFormItem">
          <slot name="operationsQuery" v-bind="{ onSubmit, onReset }">
            <el-button type="primary" @click="onSubmit">搜索</el-button>
            <el-button @click="onReset">重置</el-button>
          </slot>
        </el-form-item>
      </slot>
    </template>
  </elx-form>
</template>

<script>
import { computed, defineComponent, reactive, toRefs } from 'vue'
import ElxForm from '../form/ElxForm'
import { useOmitKeys } from '@/utils/hooks/useObject'
export default defineComponent({
  components: {
    ElxForm,
  },
  props: {
    config: Object,
    formItems: Array,
    searchQuery: Object,
  },
  emits: ['search'],
  setup(props, ctx) {
    const state = reactive({
      omitKeys: useOmitKeys(),
      formRef: null,
      computedAxFormSlotKey: computed(() => (slotKey) => slotKey.replace(/Query$/, '')),
      slotKeys: computed(() => Object.keys(ctx.slots).filter(key => key !== 'operationsQuery')),
    })
    return {
      ...toRefs(state)
    }
  },
  mounted () {
    this.$refs.formRef.setDefaultFormModel(this.searchQuery || {})
  },
  methods: {
    submit(formData) {
      this.$emit('search', formData)
    }
  }
})
</script>