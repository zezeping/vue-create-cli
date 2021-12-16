<template>
  <div class="ax-table">
    <ax-search-bar :formItems="tableQueryFormList" :config="config.searchBar" :searchQuery="searchQuery" :enableAutoFetch="enableAutoFetch" @search="onSearch" @reset="onResetSearch">
      <template #default="slotProps">
        <slot name="searchBar" :formItems="tableQueryFormList" :searchQuery="searchQuery" :fetchLoading="fetchLoading" :onSearch="onSearch" :onResetSearch="onResetSearch" v-bind="slotProps"></slot>
      </template>
      <template v-for="(slotName, idx) in querySlotNames" :key="idx" #[slotName]="slotData">
        <slot :name="slotName" v-bind="slotData" :fetchLoading="fetchLoading"></slot>
      </template>
    </ax-search-bar>
    <slot v-bind="{ dataList: tableData, fetchLoading }">
      <a-table :columns="tableColumns" :dataSource="tableData" :loading="fetchLoading.value" :pagination="!tablePagination" @change="onPageInfoChange" v-bind="$attrs">
        <template v-for="(column, idx) in tableColumns" :key="idx" #[column.slots.customRender]="{ record, index }">
          <slot :name="column.slots.customRender || `${column.dataIndex}Column`" v-bind="{ record, index, column, row: record, $index: index }">{{ record[column.dataIndex] }}</slot>
        </template>
      </a-table>
    </slot>
    <slot v-if="enablePagination && !fetchLoading.value" name="pagination" v-bind="{ pagination, mapKeys }">
      <ax-pagination :mapKeys="mapKeys" :config="pagination" @change="onPageInfoChange"></ax-pagination>
    </slot>
  </div>
</template>

<script>
import { computed, watch, reactive, toRefs, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import AxSearchBar from './AxSearchBar'
import { useLoading } from '@/utils/hooks/useLoading'

export default defineComponent({
  components: {
    AxSearchBar
  },
  inheritAttrs: false,
  expose: ['fetchData', 'refreshTableData'],
  props: {
    enablePagination: {
      type: Boolean,
    },
    enableAutoFetch: {
      type: Boolean,
      default: true
    },
    mapKeys: {
      type: Object,
      default: () => ({
        pageNo: 'pageNo', // 当前页
        pageSize: 'pageSize', // 每页数量
        pageCount: 'pageCount', // 总页数（和total二选一, pageCount优先级高）
        total: 'total', // 总条目数
        data: 'list', // 列表
      })
    },
    /**
     * keys: fetchData, columns, data, pagination, searchBar
     */
    config: {
      type: Object,
      default: () => ({}),
      //pagination: {
      //	type: [Object],
      //	default: () => ({})
      //}
    },
  },
  setup (props, ctx) {
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      fetchLoading: useLoading(),
      fetchTimes: 0,
      searchQuery: props.config.searchBar?.searchQuery || {},
      onPageInfoChange(pagination, _filters, _sorter, { _currentDataSource }) {
        state.fetchData({
          [props.mapKeys.pageNo]: pagination.current,
          [props.mapKeys.pageSize]: pagination.pageSize
        })
      },
      // tableData
      data: [],
      // paginationData
      pagination: {
        [props.mapKeys.pageNo]: route.query[props.mapKeys.pageNo] || 1,
        [props.mapKeys.pageSize]: route.query[props.mapKeys.pageSize] || 20,
        [props.mapKeys.total]: 0,
      },
      tableQueryFormList: computed(() => props.config.searchBar?.formItems || []),
      tableColumns: computed(() => props.config.columns?.filter(item => !item.hidden).map(item => ({slots: { customRender: `${item.dataIndex}Column` }, ...item, })) || []),
      tableData: computed(() => {
        const data = ctx.attrs.dataSource || props.config.data || state.data
        return data.map((item, idx) => ({ key: item.id || idx, ...item}))
      }),
      // 不会填充到url链接上的参数key
      omitUrlParamsKeys: computed(() => {
        const omitUrlParamsKeys = (props.config.searchBar?.omitUrlParamsKeys || [])
        return [...omitUrlParamsKeys/*, 'qs_sorts'*/]
      }),
      tablePagination: computed(() => ({ ...state.pagination, current: state.pagination[props.mapKeys.pageNo] })),
      slotNames: computed(() => Object.keys(ctx.slots)),
      columnSlotNames: computed(() => state.slotNames.filter(item => /Column$/.test(item))),
      querySlotNames: computed(() => state.slotNames.filter(item => /Query$/.test(item))),
      async refreshTableData() {
        await state.fetchData(route.query)
      },
      async fetchData(query = {}) {
        state.fetchTimes += 1
        const { [props.mapKeys.pageNo]: pageNo, [props.mapKeys.pageSize]: pageSize, ...otherQuery } = query
        const pagination =  {
          [props.mapKeys.pageNo]: Number(pageNo || state.pagination[props.mapKeys.pageNo]),
          [props.mapKeys.pageSize]: Number(pageSize || state.pagination[props.mapKeys.pageSize]),
        }
        Object.assign(state.pagination, pagination)
        let searchQuery = { ...state.searchQuery, ...pagination, ...otherQuery }
        let omitBlankSearchQuery = {}
        for (const key in searchQuery) {
          if ([undefined, null, ''].indexOf(searchQuery[key]) === -1) {
            omitBlankSearchQuery[key] = searchQuery[key]
          }
        }
        searchQuery = omitBlankSearchQuery
        state.searchQuery = searchQuery

        const writeToUrlParams = {}
        for (const key in searchQuery) {
          if (state.omitUrlParamsKeys.indexOf(key) === -1) {
            writeToUrlParams[key] = searchQuery[key]
          }
        }
        await router.replace({ query: writeToUrlParams })

        if (!props.config.fetchData) {
          return
        }
        state.fetchLoading.load(async () => {
          await props.config.fetchData(searchQuery).then((resp) => {
            state.data = resp.data[props.mapKeys.data]
            for (const key in state.pagination) {
              state.pagination[key] = resp.data[key]
            }
          })
        })
      },
      async onSearch(formModel) {
        state.searchQuery = {
          ...formModel,
          [props.mapKeys.pageNo]: state.searchQuery[props.mapKeys.pageNo],
          [props.mapKeys.pageSize]: state.searchQuery[props.mapKeys.pageSize],
        }
        await state.fetchData(state.searchQuery)
      },
      async onResetSearch(formModel) {
        state.searchQuery = {
          ...formModel,
          [props.mapKeys.pageNo]: 1,
          [props.mapKeys.pageSize]: state.searchQuery[props.mapKeys.pageSize],
        }
        await state.fetchData(state.searchQuery)
      }
    })

    watch(() => props.config.pagination, nv => {
      Object.assign(state.pagination, nv)
    }, { immediate: true })

    return {
      ...toRefs(state)
    }
  },
})
</script>

<style lang="scss" scoped>
.ax-table {
  margin: 15px;
}
</style>

