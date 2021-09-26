<template>
	<div class="ax-table">
		<slot name="searchBar" :queryList="tableQueryList" :config="config.searchBar" :getTableQuery="getTableQuery">
			<ax-search-bar :queryList="tableQueryList" :config="config.searchBar" :getTableQuery="getTableQuery" @search="fetchData" @reset="resetSearch">
				<template v-for="(slotName, idx) in querySlotNames" :key="idx" v-slot:[slotName]="{ query }">
					<slot :name="slotName" v-bind="{ query }"></slot>
				</template>
				<template v-slot:operations="{submit, reset}">
					<slot name="searchBarOperations" v-bind="{submit, reset}"></slot>
				</template>
			</ax-search-bar>
		</slot>
		<a-table :columns="tableColumns" :dataSource="tableData" :pagination="tablePagination" :loading="loading" @change="onChange">
			<template v-for="(column, idx) in tableColumns" :key="idx" v-slot:[column.slots.customRender]="{ record, index }">
				 <slot :name="column.slots.customRender || `${column.dataIndex}Column`" v-bind="{ record, index, column, row: record, $index: index }">{{ record[column.dataIndex] }}</slot>
			</template>
		</a-table>
	</div>
</template>

<script>
import { nextTick, computed, watch, reactive, toRefs, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AxSearchBar from './AxSearchBar'

export default defineComponent({
	inheritAttrs: false,
	components: {
		AxSearchBar
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
		},
	},
	emits: ['change'],
	setup (props, context) {
		const route = useRoute()
		const router = useRouter()
		const state = reactive({
			// tableQuery
			defaultQuery: {},
			queryList: [],
			// tableData
			data: [],
			loading: false,
			// paginationData
			pagination: {
				[props.mapKeys.pageNo]: 1,
				[props.mapKeys.pageSize]: 20,
				[props.mapKeys.total]: 0,
			},
			tableQueryList: computed(() => props.config.searchBar?.queryList || state.queryList),
			tableColumns: computed(() => props.config.columns?.filter(item => !item.hidden).map(item => ({slots: { customRender: `${item.dataIndex}Column` }, ...item, })) || []),
			tableData: computed(() => {
				const data = context.attrs.dataSource || props.config.data || state.data
				return data.map((item, idx) => ({ key: item.id || idx, ...item}))
			}),
			tableRowSelection: computed(() => props.config.rowSelection),
			tablePagination: computed(() => ({ ...state.pagination, current: state.pagination[props.mapKeys.pageNo] })),
			slotNames: computed(() => Object.keys(context.slots)),
			columnSlotNames: computed(() => state.slotNames.filter(item => /Column$/.test(item))),
			querySlotNames: computed(() => state.slotNames.filter(item => /Query$/.test(item))),
			getTableQuery() {
				const { [props.mapKeys.pageNo]: pageNo, [props.pageSize]: pageSize, ...other } = state.pagination
				const form = {}
				for (const item of (state.tableQueryList || [])) {
					form[item.key] = item.getValue ? item.getValue(item, form) : item.value
				}
				return Object.assign({
					[props.mapKeys.pageNo]: pageNo,
					[props.mapKeys.pageSize]: pageSize
				}, form)
			},
			async fetchData(query = {}) {
				const { [props.mapKeys.pageNo]: pageNo, [props.mapKeys.pageSize]: pageSize, ...otherQuery } = query
				const pagination =  {
					[props.mapKeys.pageNo]: Number(pageNo || state.pagination[props.mapKeys.pageNo]),
					[props.mapKeys.pageSize]: Number(pageSize || state.pagination[props.mapKeys.pageSize]),
				}
				Object.assign(state.pagination, pagination)
				for (const key in otherQuery) {
					const query = state.tableQueryList.find(item => item.key === key)
					if (query && query.value != otherQuery[key]) {
						if (query.setValue) {
							query.setValue(query, otherQuery)
						} else {
							query.value = otherQuery[key]
						}
					}
				}
				let searchQuery = { ...state.getTableQuery(), ...pagination }
				let omitBlankSearchQuery = {}
				for (const key in searchQuery) {
					if (searchQuery[key] !== '') {
						omitBlankSearchQuery[key] = searchQuery[key]
					}
				}
				searchQuery = omitBlankSearchQuery
				await router.replace({ query: searchQuery })

				if (!props.config.fetchData) return;
				state.loading = true
				await props.config.fetchData(searchQuery).then((resp) => {
					state.data = resp.data[props.mapKeys.data]
					for (const key in state.pagination) {
						state.pagination[key] = resp.data[key]
					}
				}).finally(() => {
					state.loading = false
				})
			},
			resetSearch(formRef) {
				for (const query of state.tableQueryList) {
					if (state.defaultQuery.hasOwnProperty(query.key)) {
						if (query.setValue) {
							query.setValue(query, state.defaultQuery)
						} else {
							query.value = state.defaultQuery[query.key]
						}
					}
				}
				nextTick(() => {
					formRef.validate(async (valid) => {
						if (valid) {
							await state.fetchData({
								[props.mapKeys.pageNo]: 1
							})
						} else {
							state.data = []
						}
					})
				})
			}
		})

		watch(() => props.config.pagination, (nv) => {
			Object.assign(state.pagination, nv)
		}, {immediate: true})

		state.defaultQuery = state.getTableQuery()
		state.fetchData({...route.query})

		return {
			...toRefs(state),
			onChange(pagination, filters, sorter, { currentDataSource }) {
				state.pagination[props.mapKeys.pageNo] = pagination.current
				state.pagination[props.mapKeys.pageSize] = pagination.pageSize
				state.fetchData(state.pagination)
				context.emit('change', ...arguments)
			}
		}
	},
})
</script>

<style lang="scss" scoped>
.ax-table {
	margin: 15px;
}
</style>

<!--<template>-->
<!--	<div class="home">-->
<!--		<ax-table :config="tableConfig" style="width: 100%" @selection-change="selectionChange">-->
<!--			&lt;!&ndash;			自定义SearchBar &ndash;&gt;-->
<!--			&lt;!&ndash;			<template v-slot:searchBar="{queryList, config, getTableQuery}">&ndash;&gt;-->
<!--			&lt;!&ndash;				<div>自定义SearchBar: {{ queryList }} - {{ config }} - {{ getTableQuery }}</div>&ndash;&gt;-->
<!--			&lt;!&ndash;			</template>&ndash;&gt;-->
<!--			&lt;!&ndash;searchBar query item slot`&ndash;&gt;-->
<!--			<template v-slot:nameQuery="{query}">-->
<!--				<a-form-item :name="query.key" :rules="query.rules" :label="query.label">-->
<!--					<a-input v-model="query.value" :placeholder="query.attrs.placeholder"></a-input>-->
<!--				</a-form-item>-->
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
<!--		</ax-table>-->
<!--	</div>-->
<!--</template>-->
<!--<script>-->
<!--export default {-->
<!--	data() {-->
<!--		return {-->
<!--			tableConfig: {-->
<!--				searchBar: {-->
<!--					layout: 'inline',-->
<!--					queryList: [-->
<!--						{ key: 'name', value: '', label: '手机号', type: 'input',-->
<!--							rules: [{ required: true, message: '请输入手机号', trigger: ['blur', 'change'] }],-->
<!--							attrs: { placeholder: '请输入姓名' }, // 绑定到type组件上的属性-->
<!--						},-->
<!--						{-->
<!--							key: 'gender', value: '', label: '性别', type: 'select',-->
<!--							attrs: { placeholder: '请选择性别', options: [{label: '男', value: 'male'}, {label: '女', value: 'female'}], style: { 'min-width': '500px' }, },-->
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
<!--									{ date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄', key: 10 },-->
<!--									{ date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄', },-->
<!--								]-->
<!--							},-->
<!--						})-->
<!--					}, 3000)-->
<!--				}),-->
<!--				columns: [-->
<!--					//{ type: 'selection', width: 55 },-->
<!--					{ title: '日期', dataIndex: 'date', },-->
<!--					{ title: '姓名', dataIndex: 'name', },-->
<!--					{ title: '地址', dataIndex: 'address', },-->
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
