<template>
  <ax-form v-if="formItems && formItems.length" ref="formRef" class="ax-search-bar" :config="config" v-bind="omitKeys(config, ['formItems'])" @submit="submit">
    <template v-for="(slotKey, idx) in slotKeys" :key="idx" #[computedAxFormSlotKey(slotKey)]="slotProps">
      <slot :name="slotKey" v-bind="slotProps"></slot>
    </template>
    <template #operationsFormItem="{ onSubmit, onReset }">
      <slot name="operationsFormItemQuery">
        <a-form-item v-bind="config.operationsFormItem">
          <slot name="operationsQuery" v-bind="{ onSubmit, onReset }">
            <a-button type="primary" @click="onSubmit">搜索</a-button>
            <a-button style="margin-left: 15px;" @click="onReset">重置</a-button>
          </slot>
        </a-form-item>
      </slot>
    </template>
  </ax-form>
</template>

<script>
import { computed, defineComponent, reactive, toRefs, nextTick } from 'vue'
import { useOmitKeys } from '@/utils/hooks/useObject'
import AxForm from '../form/AxForm'
export default defineComponent({
  components: {
    AxForm
  },
  props: {
    config: Object,
    formItems: Array,
    searchQuery: Object,
  },
  emits: ['search', 'reset'],
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
    this.$refs.formRef.setFormModel({...this.searchQuery, ...this.$route.query})
    nextTick(() => {
      this.$emit('search', {...this.$refs.formRef.formModel, ...this.$route.query})
    })
  },
  methods: {
    submit(formData) {
      this.$emit('search', formData)
    }
  }
})
</script>

<style lang="scss" scoped>
.ax-search-bar {
  ::v-deep(.ant-form-item) {
    margin-bottom: 15px;
  }
}
</style>