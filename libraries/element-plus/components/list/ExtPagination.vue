<template>
	<el-pagination class="ext-pagination"
		:layout="layout"
		:page-sizes="pageSizes"
		:pager-count="data[mapKeys.pageCount]"
		:total="data[mapKeys.total]"
		v-model:page-size="data[mapKeys.pageSize]"
		v-model:current-page="data[mapKeys.pageNo]"
		@current-change="handlePageNoChange"
		@size-change="handlePageSizeChange"
	></el-pagination>
</template>

<script>
import { ElPagination } from 'element-plus'
export default {
	components: {
		ElPagination
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
			default: () => [10, 20, 50, 100, 200]
		},
		layout: {
			type: String,
			default: 'total, sizes, prev, pager, next, jumper'
		}
	},
	emits: ['search'],
	methods: {
		handlePageNoChange(pageNo) {
			this.$emit('search', { ...this.data, [this.mapKeys.pageNo]: pageNo })
		},
		handlePageSizeChange(pageSize) {
			this.$emit('search', { ...this.data, [this.mapKeys.pageSize]: pageSize })
		}
	}
}
</script>

<style lang="scss" scoped>
.ext-pagination {
	display: flex;
	justify-content: flex-end;
	margin-top: 15px;
}
</style>