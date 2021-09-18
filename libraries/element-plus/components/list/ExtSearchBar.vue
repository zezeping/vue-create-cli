<template>
	<div class="ext-search-bar" v-if="queryList && queryList.length">
		<el-form ref="formRef" :model="form" inline @submit="submit">
			<template v-for="(query, idx) in queryList" :key="idx">
				<slot :name="query.slot || `${query.key}Query`" :query="query">
					<el-form-item :prop="query.key" :label="query.label" :rules="query.rules">
						<el-input v-model="query.value" v-bind="query.attrs" v-if="query.type === 'input'"></el-input>
						<el-select v-model="query.value" v-bind="query.attrs" v-else-if="query.type === 'select'">
							<template v-for="(option, idx) in query.options" :key="idx">
								<el-option :value="option.value" :label="option.label"></el-option>
							</template>
						</el-select>
					</el-form-item>
				</slot>
			</template>
			<el-form-item>
				<slot name="operations" :submit="submit" :reset="reset">
					<el-button type="primary" @click="submit">搜索</el-button>
					<el-button @click="reset">重置</el-button>
				</slot>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import { ElForm, ElFormItem, ElInput, ElSelect } from 'element-plus'
export default {
	components: {
		[ElForm.name]: ElForm,
		[ElFormItem.name]: ElFormItem,
		[ElInput.name]: ElInput,
		[ElSelect.name]: ElSelect,
	},
	props: {
		config: Object,
		queryList: Array,
		getTableQuery: Function
	},
	emits: ['search', 'reset'],
	computed: {
		form() {
			return this.getTableQuery()
		}
	},
	methods: {
		submit() {
			this.$refs['formRef'].validate((valid) => {
				if (valid) {
					this.$emit('search', this.form)
				}
			})
		},
		reset() {
			this.$emit('reset', this.$refs['formRef'])
		}
	}
}
</script>