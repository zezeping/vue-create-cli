<template>
	<div class="ext-table">
		<slot name="searchBar" :queryList="tableQueryList" :config="config.searchBar" :getTableQuery="getTableQuery">
			<ext-search-bar :queryList="tableQueryList" :config="config.searchBar" :getTableQuery="getTableQuery" @search="fetchData" @reset="resetSearch">
				<template v-for="(slotName, idx) in querySlotNames" :key="idx" v-slot:[slotName]="{ query }">
					<slot :name="slotName" v-bind="{ query }"></slot>
				</template>
				<template v-slot:operations="{submit, reset}">
					<slot name="searchBarOperations" v-bind="{submit, reset}"></slot>
				</template>
			</ext-search-bar>
		</slot>
		<el-table :data="tableData" v-loading="loading" v-bind="$attrs">
			<template v-for="(column, idx) in tableColumns" :key="idx">
				<el-table-column v-bind="column">
					<template v-slot:default="{row, column: slotColumn, $index}" v-if="column.type !== 'selection'">
						<slot :name="column.slot || `${column.prop}Column`" v-bind="{row, column: slotColumn, $index}">{{ row[column.prop] }}</slot>
					</template>
				</el-table-column>
			</template>
		</el-table>
		<slot name="pagination" :data="pagination" :mapKeys="mapKeys">
			<ext-pagination :data="pagination" :mapKeys="mapKeys" :layout="config.pagination?.layout" :pageSizes="config.pagination?.pageSizes" @search="fetchData"></ext-pagination>
		</slot>
	</div>
</template>

<script>
import { useSlots, defineComponent } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'
import ExtPagination from './ElxPagination'
import ExtSearchBar from './ElxSearchBar'
export default defineComponent({
	inheritAttrs: false,
	components: {
		[ElTable.name]: ElTable,
		[ElTableColumn.name]: ElTableColumn,
		ExtPagination,
		ExtSearchBar,
	},
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
		}
	},
	data() {
		return {
			// tableQuery
			defaultQuery: {},
			queryList: [],
			// tableData
			data: [],
			loading: false,
			// paginationData
			pagination: {
				[this.mapKeys.pageNo]: 1,
				[this.mapKeys.pageSize]: 20,
				[this.mapKeys.total]: 0,
			}
		}
	},
	computed: {
		tableQueryList() {
			return this.config.searchBar?.queryList || this.queryList
		},
		tableColumns() {
			return this.config.columns || []
		},
		tableData() {
			return this.$attrs.data || this.config.data || this.data
		},
		slotNames() {
			const slots = useSlots()
			return Object.keys(slots)
		},
		querySlotNames() {
			return this.slotNames.filter(item => /Query$/.test(item))
		}
	},
	watch: {
		'config.pagination': {
			handler(nv) {
				Object.assign(this.pagination, nv)
			},
			immediate: true
		}
	},
	methods: {
		getTableQuery() {
			const { [this.mapKeys.pageNo]: pageNo, [this.mapKeys.pageSize]: pageSize, ...other } = this.pagination
			const form = {}
			for (const item of (this.tableQueryList || [])) {
				form[item.key] = item.getValue ? item.getValue(item, form) : item.value
			}
			return Object.assign({
				[this.mapKeys.pageNo]: pageNo,
				[this.mapKeys.pageSize]: pageSize
			}, form)
		},
		async fetchData(query = {}) {
			const { [this.mapKeys.pageNo]: pageNo, [this.mapKeys.pageSize]: pageSize, ...otherQuery } = query
			const pagination =  {
				[this.mapKeys.pageNo]: Number(pageNo || this.pagination[this.mapKeys.pageNo]),
				[this.mapKeys.pageSize]: Number(pageSize || this.pagination[this.mapKeys.pageSize]),
			}
			Object.assign(this.pagination, pagination)
			for (const key in otherQuery) {
				const query = this.tableQueryList.find(item => item.key === key)
				if (query && query.value != otherQuery[key]) {
					if (query.setValue) {
						query.setValue(query, otherQuery)
					} else {
						query.value = otherQuery[key]
					}
				}
			}
			let searchQuery = { ...this.getTableQuery(), ...pagination }
			let omitBlankSearchQuery = {}
			for (const key in searchQuery) {
				if (searchQuery[key] !== '') {
					omitBlankSearchQuery[key] = searchQuery[key]
				}
			}
			searchQuery = omitBlankSearchQuery
			await this.$router.replace({ query: searchQuery })

			if (!this.config.fetchData) return;
			this.loading = true
			await this.config.fetchData(searchQuery).then((resp) => {
				this.data = resp.data[this.mapKeys.data]
				for (const key in this.pagination) {
					this.pagination[key] = resp.data[key]
				}
			}).finally(() => {
				this.loading = false
			})
		},
		resetSearch(formRef) {
			for (const query of this.tableQueryList) {
				if (this.defaultQuery.hasOwnProperty(query.key)) {
					if (query.setValue) {
						query.setValue(query, this.defaultQuery)
					} else {
						query.value = this.defaultQuery[query.key]
					}
				}
			}
			this.$nextTick(() => {
				formRef.validate(async (valid) => {
					if (valid) {
						await this.fetchData({
							[this.mapKeys.pageNo]: 1
						})
					} else {
						this.data = []
					}
				})
			})
		}
	},
	created() {
		this.defaultQuery = this.getTableQuery()
		this.fetchData({...this.$route.query})
	}
})
</script>

<style lang="scss" scoped>
.ext-table {
	margin: 15px;
}
</style>

<!--<template>-->
<!--	<div class="home">-->
<!--		<elx-table :config="tableConfig" style="width: 100%" @selection-change="selectionChange">-->
<!--			&lt;!&ndash;			自定义SearchBar &ndash;&gt;-->
<!--			&lt;!&ndash;			<template v-slot:searchBar="{queryList, config, getTableQuery}">&ndash;&gt;-->
<!--			&lt;!&ndash;				<div>自定义SearchBar: {{ queryList }} - {{ config }} - {{ getTableQuery }}</div>&ndash;&gt;-->
<!--			&lt;!&ndash;			</template>&ndash;&gt;-->
<!--			&lt;!&ndash;searchBar query item slot`&ndash;&gt;-->
<!--			<template v-slot:nameQuery="{query}">-->
<!--				<el-form-item :prop="query.key" :rules="query.rules" :label="query.label">-->
<!--					<el-input v-model="query.value" :placeholder="query.placeholder"></el-input>-->
<!--				</el-form-item>-->
<!--			</template>-->
<!--			&lt;!&ndash;		  自定义searchBar 按钮组&ndash;&gt;-->
<!--			&lt;!&ndash;		  <template v-slot:searchBarOperations="{submit, reset}">&ndash;&gt;-->
<!--			&lt;!&ndash;			  <div>自定义searchBar, 操作按钮组</div>&ndash;&gt;-->
<!--			&lt;!&ndash;			  <el-button type="primary" @click="submit">搜索1</el-button>&ndash;&gt;-->
<!--			&lt;!&ndash;			  <el-button @click="reset">重置1</el-button>&ndash;&gt;-->
<!--			&lt;!&ndash;		  </template>&ndash;&gt;-->
<!--			&lt;!&ndash;table column item slot&ndash;&gt;-->
<!--			<template v-slot:nameColumn="{row, column, $index}">-->
<!--				<el-button>{{ row }} - {{ column }} - {{ $index }}</el-button>-->
<!--			</template>-->
<!--			&lt;!&ndash;		  自定义pagination&ndash;&gt;-->
<!--			&lt;!&ndash;		  <template v-slot:pagination="{data, mapKeys}">&ndash;&gt;-->
<!--			&lt;!&ndash;			  <div>{{ data }} - {{ mapKeys }}</div>&ndash;&gt;-->
<!--			&lt;!&ndash;		  </template>&ndash;&gt;-->
<!--		</elx-table>-->
<!--	</div>-->
<!--</template>-->
<!--<script>-->
<!--export default {-->
<!--	data() {-->
<!--		return {-->
<!--			tableConfig: {-->
<!--				searchBar: {-->
<!--					queryList: [-->
<!--						{ key: 'name', value: '', label: '手机号', type: 'input',-->
<!--							rules: [{ required: true, message: '请输入手机号', trigger: ['blur', 'change'] }],-->
<!--							attrs: { placeholder: '请输入姓名' }, // 绑定到type组件上的属性-->
<!--						},-->
<!--						{-->
<!--							key: 'gender', value: '', label: '性别', type: 'select',-->
<!--							attrs: { placeholder: '请选择性别', options: [{label: '男', value: 'male'}, {label: '女', value: 'female'}], },-->
<!--						},-->
<!--						{ key: 'isAdult', value: '', label: '是否成年', type: 'select',-->
<!--							attrs: { placeholder: '请选择类型', clearable: true, options: [{label: '成年', value: 'true'}, {label: '未成年', value: 'false'}], },-->
<!--							getValue(queryItem, form) {-->
<!--								// 根据当前搜索的值，给搜索form添加额外搜索字段-->
<!--								if (/true|false/.test(queryItem.value)) {-->
<!--									form.hi = queryItem.value === 'true' ? 'hello' : 'world'-->
<!--								}-->
<!--                // 搜索一般都是get请求所以boolean值数字最后都要转为字符串，所以这里直接用字符串表识一般情况下并没有什么问题-->
<!--								return queryItem.value === 'true' ? '1' : queryItem.value === 'false' ? '0' : ''-->
<!--							},-->
<!--							setValue(queryItem, form) {-->
<!--								queryItem.value = form[queryItem.key] === '1' ? 'true' : form[queryItem.key] === '0' ? 'false' : ''-->
<!--							}-->
<!--							//customHandleValue: (form, item) => {-->
<!--							//	form[item.key] = item.value === true ? 1 : 0-->
<!--							//}-->
<!--						},-->
<!--					]-->
<!--				},-->
<!--				fetchData: (query) => new Promise((resolve, reject) => {-->
<!--					console.log(123, 'fetchData', query)-->
<!--					setTimeout(() => {-->
<!--						resolve({-->
<!--							data: {-->
<!--								pageNo: query.pageNo || 1,-->
<!--								pageSize: query.pageSize || 10,-->
<!--								total: 99,-->
<!--								list: [-->
<!--									{ date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄', },-->
<!--									{ date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄', },-->
<!--								]-->
<!--							},-->
<!--						})-->
<!--					}, 3000)-->
<!--				}),-->
<!--				columns: [-->
<!--					{ type: 'selection', width: 55 },-->
<!--					{ label: '日期', prop: 'date' },-->
<!--					{ label: '姓名', prop: 'name' },-->
<!--					{ label: '地址', prop: 'address' },-->
<!--				],-->
<!--				// 优先级: (<elx-table :data="data" />) > config.data > config.fetchData()-->
<!--				//data: [-->
<!--				//	{ date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄', },-->
<!--				//	{ date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄', },-->
<!--				//],-->
<!--			},-->
<!--		}-->
<!--	},-->
<!--	methods: {-->
<!--		selectionChange(items) {-->
<!--			console.log('selectedItems', items)-->
<!--		}-->
<!--	}-->
<!--}-->
<!--</script>-->
