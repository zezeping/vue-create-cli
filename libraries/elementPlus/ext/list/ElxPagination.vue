<template>
  <el-pagination v-model:page-size="currentPageSize" v-model:current-page="currentPage"
                 :layout="layout"
                 :page-sizes="pageSizes"
                 :pager-count="data[mapKeys.pageCount]"
                 :total="data[mapKeys.total]"
                 class="elx-pagination"
                 @current-change="handlePageNoChange"
                 @size-change="handlePageSizeChange"
  ></el-pagination>
</template>

<script>
import { defineComponent } from 'vue'
import { ElPagination } from 'element-plus'

export default defineComponent({
  components: {
    ElPagination,
  },
  props: {
    mapKeys: {
      type: [Object],
      required: true,
    },
    data: {
      type: [Object],
      required: true,
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100, 200],
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper',
    },
  },
  emits: ['search', 'update:data'],
  computed: {
    currentPage: {
      get () {
        return this.data[this.mapKeys.pageNo]
      },
      set (nv) {
        this.$emit('update:data', {
          ...this.data,
          [this.mapKeys.pageNo]: nv,
        })
      },
    },
    currentPageSize: {
      get () {
        return this.data[this.mapKeys.pageSize]
      },
      set (nv) {
        this.$emit('update:data', {
          ...this.data,
          [this.mapKeys.pageSize]: nv,
        })
      },
    },
  },
  methods: {
    handlePageNoChange (pageNo) {
      this.$emit('search', {
        ...this.data,
        [this.mapKeys.pageNo]: pageNo,
      })
    },
    handlePageSizeChange (pageSize) {
      this.$emit('search', {
        ...this.data,
        [this.mapKeys.pageSize]: pageSize,
      })
    },
  },
})
</script>

<style lang="scss" scoped>
.elx-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}
</style>