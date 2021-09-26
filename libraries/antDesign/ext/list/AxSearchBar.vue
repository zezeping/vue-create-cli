<template>
	<a-form class="ax-search-bar" ref="formRef" :model="form" @submit="submit" v-bind="omitKeys(config, ['queryList'])" v-if="queryList && queryList.length">
		<template v-for="(query, idx) in queryList" :key="idx">
			<slot :name="query.slot || `${query.key}Query`" :query="query">
				<a-form-item :name="query.key" :label="query.label" :rules="query.rules">
					<a-input v-model="query.value" v-bind="query.attrs" v-if="query.type === 'input'"></a-input>
					<ax-select v-model="query.value" v-bind="query.attrs" v-else-if="query.type === 'select'">
						<template v-slot:default="{ options, labelKey, valueKey }">
							<template v-for="(option, idx) in options" :key="idx">
								<a-select-option :value="option[valueKey]">{{ option[labelKey] }}</a-select-option>
							</template>
						</template>
					</ax-select>
				</a-form-item>
			</slot>
		</template>
		<a-form-item>
			<slot name="operations" :submit="submit" :reset="reset">
				<el-button type="primary" @click="submit">搜索</el-button>
				<el-button @click="reset">重置</el-button>
			</slot>
		</a-form-item>
	</a-form>
</template>

<script>
import { defineComponent } from 'vue'
import { useOmitKeys } from '@/utils/hooks/useObject'
import AxSelect from '../form/AxSelect'
export default defineComponent({
	components: {
		AxSelect
	},
	props: {
		config: Object,
		queryList: Array,
		getTableQuery: Function
	},
	emits: ['search', 'reset'],
	setup() {
		return {
			omitKeys: useOmitKeys()
		}
	},
 	computed: {
		form() {
			return this.getTableQuery()
		}
	},
	methods: {
		submit() {
			this.$refs['formRef'].validate().then(() => {
				this.$emit('search', this.form)
			}).catch(e => {
				console.log(e)
			})
		},
		reset() {
			this.$emit('reset', this.$refs['formRef'])
		}
	}
})
</script>