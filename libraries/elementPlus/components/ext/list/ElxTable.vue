<template>
  <div class="elx-table">
    <slot name="searchBar" :formItems="tableQueryFormList" :config="config.searchBar" :searchQuery="searchQuery">
      <elx-search-bar v-if="config.searchBar" :formItems="tableQueryFormList" :config="config.searchBar" :searchQuery="searchQuery" @search="onSearch" @reset="onResetSearch">
        <template v-for="(slotName, idx) in querySlotNames" :key="idx" #[slotName]="slotData">
          <slot :name="slotName" v-bind="slotData"></slot>
        </template>
      </elx-search-bar>
    </slot>
    <el-table v-loading="fetchLoading.value" :data="tableData" v-bind="$attrs">
      <template v-for="(column, idx) in tableColumns" :key="idx">
        <el-table-column v-bind="column">
          <template v-if="column.type !== 'selection'" #default="{row, column: slotColumn, $index}">
            <slot :name="column.slot || `${column.prop}Column`" v-bind="{row, column: slotColumn, $index}">{{ row[column.prop] }}</slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <slot name="pagination" :data="pagination" :mapKeys="mapKeys">
      <elx-pagination v-model:data="pagination" :mapKeys="mapKeys" :layout="config.pagination?.layout" :pageSizes="config.pagination?.pageSizes" @search="onPageInfoChange"></elx-pagination>
    </slot>
  </div>
</template>

<script>
import { computed, watch, reactive, toRefs, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLoading } from '@/utils/hooks/useLoading'
import { ElTable, ElTableColumn } from 'element-plus'
import ElxPagination from './ElxPagination'
import ElxSearchBar from './ElxSearchBar'
export default defineComponent({
  components: {
    [ElTable.name]: ElTable,
    [ElTableColumn.name]: ElTableColumn,
    ElxPagination,
    ElxSearchBar,
  },
  inheritAttrs: false,
  props: {
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
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      fetchLoading: useLoading(),
      searchQuery: props.config.searchBar?.searchQuery || {},
      onPageInfoChange(pagination) {
        Object.assign(state.pagination, {
          [props.mapKeys.pageNo]: pagination[props.mapKeys.pageNo],
          [props.mapKeys.pageSize]: pagination[props.mapKeys.pageSize]
        })
        state.fetchData()
      },
      // tableData
      data: [],
      // paginationData
      pagination: {
        [props.mapKeys.pageNo]: 1,
        [props.mapKeys.pageSize]: 20,
        [props.mapKeys.total]: 0,
      },
      tableQueryFormList: computed(() => props.config.searchBar?.formItems || []),
      tableColumns: computed(() => props.config.columns?.filter(item => !item.hidden).map(item => ({slots: { customRender: `${item.dataIndex}Column` }, ...item, })) || []),
      tableData: computed(() => {
        const data = ctx.attrs.data || props.config.data || state.data
        return data.map((item, idx) => ({ key: item.id || idx, ...item}))
      }),
      slotNames: computed(() => Object.keys(ctx.slots)),
      columnSlotNames: computed(() => state.slotNames.filter(item => /Column$/.test(item))),
      querySlotNames: computed(() => state.slotNames.filter(item => /Query$/.test(item))),
      async fetchData(query = {}) {
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
        await router.replace({ query: searchQuery })

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

    state.fetchData({ ...route.query })

    return {
      ...toRefs(state)
    }
  },
})
</script>

<style lang="scss" scoped>
.elx-table {
  margin: 15px;
}
</style>

