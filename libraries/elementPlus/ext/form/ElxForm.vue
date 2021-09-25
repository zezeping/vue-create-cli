<template>
	<el-form class="elx-form" v-bind="{...$attrs, ...omitKeys(config, ['fields'])}">
		<template v-for="(field, idx) in config.fields" :key="idx">
			<slot :name="field.prop" v-bind="{ field }">
				<el-form-item v-bind="omitKeys(field, ['type', 'attrs'])">
					<component :is="field.type" v-model="$attrs['model'][field.prop]" v-bind="field.attrs"></component>
				</el-form-item>
			</slot>
		</template>
	</el-form>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { ElInput, ElSelect, ElCheckbox } from 'element-plus'
import { useOmitKeys } from '@/utils/hooks/useObject'
import ElxSelect from './ElxSelect'
import ElxCheckboxGroup from './ElxCheckboxGroup'
export default {
	inheritAttrs: false,
	components: {
		ElInput,
		ElSelect,
		ElCheckbox,
		ElxSelect,
		ElxCheckboxGroup,
	},
	props: {
		config: {
			type: Object,
			required: true
		}
	},
	setup() {
		const state = reactive({
		})
		return {
			...toRefs(state),
			omitKeys: useOmitKeys(),
		}
	}
}
</script>

<!--<template>-->
<!--	<div class="home">-->
<!--		<elx-form :model="form" :config="formConfig" ref="formRef"></elx-form>-->
<!--	</div>-->
<!--</template>-->
<!--<script>-->
<!--export default {-->
<!--	data() {-->
<!--		return {-->
<!--			form: {-->
<!--				username: '',-->
<!--				password: '',-->
<!--				loveFruits: [],-->
<!--				rememberMe: false-->
<!--			},-->
<!--			formConfig: {-->
<!--				labelWidth: '120px',-->
<!--				fields: [-->
<!--					{-->
<!--						prop: 'username', label: '用户名', width: '100px',-->
<!--						type: 'el-input',-->
<!--						attrs: {-->
<!--							placeholder: '请输入用户名',-->
<!--						}-->
<!--					}, {-->
<!--						prop: 'loveFruits', label: '喜欢的水果', width: '100px',-->
<!--						type: 'elx-checkbox-group',-->
<!--						value: [],-->
<!--						attrs: {-->
<!--							options: [-->
<!--								{ label: '苹果', value: 'apple' },-->
<!--								{ label: '橙子', value: 'orange' },-->
<!--							]-->
<!--						}-->
<!--					}, {-->
<!--						prop: 'rememberMe',-->
<!--						type: 'el-checkbox',-->
<!--						attrs: { label: '记住我', checked: true }-->
<!--					}-->
<!--				]-->
<!--			},-->
<!--		}-->
<!--	}-->
<!--}-->
<!--</script>-->
