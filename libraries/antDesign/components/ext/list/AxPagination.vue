<template>
  <a-pagination v-if="config[mapKeys['total']]" show-size-changer v-model:current="currentPageNo" v-model:pageSize="currentPageSize" :total="config[mapKeys.total]"/>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    config: Object,
    mapKeys: Object,
  },
  emits: ['change'],
  setup (props, ctx) {
    const state = reactive({
      currentPageNo: computed({
        get() {
          return props.config[props.mapKeys['pageNo']]
        },
        set(nv) {
          if (nv !== state.currentPageNo) {
            ctx.emit('change', { current: nv, pageSize: state.currentPageSize })
          }
        }
      }),
      currentPageSize: computed({
        get() {
          return props.config[props.mapKeys['pageSize']]
        },
        set(nv) {
          if (nv !==state.currentPageSize) {
            ctx.emit('change', { current: 1, pageSize: nv })
          }
        }
      }),
    })
    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
.ant-pagination {
  margin-bottom: 15px;
}
</style>