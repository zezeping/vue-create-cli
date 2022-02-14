<template>
  <ui-table-define class="a-table-define" ref="tableRef" :config="tableConfig">
    <template #searchBar="{ query, loading: fetchLoading, ...otherTableDefineState }">
      <slot name="searchBar" v-bind="{ query, fetchLoading, ...otherTableDefineState }">
        <div>query: {{ query }}</div>
      </slot>
    </template>
    <template #default="{ data, loading: fetchLoading, ...otherTableDefineState }">
      <slot name="default" v-bind="{data, fetchLoading, ...otherTableDefineState}">
        <WithBlankFragment :loading="!data && fetchLoading.value" :isBlank="!data || !data.length">
          <slot name="content" v-bind="{data, fetchLoading, ...otherTableDefineState}">
            <a-table :data-source="data" :loading="fetchLoading.value" v-bind="tableAttrs">
              <template v-for="(column, idx) in tableAttrs.columns" :key="idx" #[column.slots.title]>
                <slot :name="column.slots.title || `${column.dataIndex}ColumnTitle`" v-bind="{ column }">{{ column.title }}</slot>
              </template>
              <template v-for="(column, idx) in tableAttrs.columns" :key="`${idx}-column`" #[column.slots.customRender]="{ record, index }">
                <slot :name="column.slots.customRender || `${column.dataIndex}Column`" v-bind="{ record, index, column, row: record, $index: index }">{{ $lodash.get(record, column.dataIndex) }}</slot>
              </template>
            </a-table>
          </slot>
        </WithBlankFragment>
      </slot>
    </template>
    <template #pagination="{ pagination, loading: fetchLoading, ...otherTableDefineState }">
      <slot name="pagination" v-bind="{pagination, fetchLoading, ...otherTableDefineState}">
        <!--<div>pagination: {{ pagination }}</div>-->
        <a-pagination show-size-changer :disabled="fetchLoading.value" v-model:current="pagination.pageNo" v-model:pageSize="pagination.pageSize" :total="pagination.totalCount" @change="onPaginationChange" @showSizeChange="onPaginationChange" :pageSizeOptions="['10', '20', '50', '100', '300']" />
      </slot>
    </template>
  </ui-table-define>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent, computed } from 'vue'
import WithBlankFragment from './WithBlankFragment'

export default defineComponent({
  inheritAttrs: false,
  components: {
    WithBlankFragment
  },
  props: {
    config: [Object],
  },
  setup (props, ctx) {
    const { fetchData, ...otherConfig } = props.config
    const state = reactive({
      tableRef: null,
      tableConfig: {
        _is: 'div',
        async _fetchData(query) {
          if (fetchData) {
            return await fetchData(query)
          }
          console.warn('table config fetchData(query) method not found')
          return {
            data: [],
            totalCount: 0
          }
        },
      },
      tableAttrs: computed(() => {
        const attrs = {
          pagination: false,
          rowKey: (record, index) => index,
        }
        for (const key in otherConfig) {
          if (!/^(_)/.test(key)) {
            if (key === 'columns') {
              const columns = ctx.attrs.columns || props.config.columns || []
              attrs[key] = columns.filter(item => !item.hidden).map((item, idx) => ({slots: { title: `${item.dataIndex}ColumnTitle`,customRender: `${item.dataIndex}Column` }, ...item, }))
            } else {
              attrs[key] = ctx.attrs[key]
            }
          }
        }
        return attrs
      }),
      onPaginationChange(pageNo, pageSize) {
        state.tableRef?.fetchData({pageNo, pageSize})
      },
    })
    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
.a-table-define {
  padding: 1px;
  .ant-pagination {
    margin: 15px;
    text-align: right;
  }
}
</style>