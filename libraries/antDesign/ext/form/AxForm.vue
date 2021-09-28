<template>
	<a-form class="ax-form" :model="formModel" v-bind="{...$attrs, ...omitKeys(config, ['model', 'fields'])}" ref="formRef">
		<template v-for="(field, idx) in config.fields" :key="idx">
			<slot :name="`${field.name}FormItem`" v-bind="{ field }">
				<a-form-item v-bind="omitKeys(field, ['type', 'attrs'])">
					<slot :name="field.name" v-bind="{ field }">
						<template v-if="'a-checkbox' === field.type">
							<component is="a-checkbox" v-model:checked="field.value" v-bind="omitKeys(field.attrs, ['label'])">{{ field.attrs.label || field.value }}</component>
						</template>
						<template v-else>
							<component :is="field.type" v-model:value="field.value" v-bind="field.attrs"></component>
						</template>
					</slot>
				</a-form-item>
			</slot>
		</template>
		<slot name="operations" v-bind="{ config, onSubmit, onReset }">
			<a-form-item v-bind="omitKeys(config.operations, ['onSubmit', 'onReset', 'onCancel'])">
				<a-button type="primary" @click="onSubmit">提交</a-button>
				<a-button @click="onReset" style="margin-left: 10px">重置</a-button>
			</a-form-item>
		</slot>
	</a-form>
</template>

<script>
import { computed, reactive, toRefs, nextTick } from 'vue'
import { Input, Select, Checkbox } from 'ant-design-vue'
import { useOmitKeys } from '@/utils/hooks/useObject'
import AxSelect from './AxSelect'
import AxCheckboxGroup from './AxCheckboxGroup'
export default {
	inheritAttrs: false,
	components: {
		[Input.name]: Input,
		[Select.name]: Select,
		[Checkbox.name]: Checkbox,
		AxSelect,
		AxCheckboxGroup,
	},
	props: {
		// keys: model, fields
		config: {
			type: Object,
			required: true
		}
	},
	setup(props) {
		const state = reactive({
			formRef: null,
			defaultFormModel: null,
			formModel: computed(() => {
				const form = props.config.model || {}
				for (const field of (props.config.fields || [])) {
					form[field.name] = typeof field.getValue === 'function' ? field.getValue(field, form) : field.value
				}
				return {...state.defaultFormModel, ...form}
			}),
			setDefaultFormModel(defaultFormModel) {
				for (const field of props.config.fields) {
					if (typeof field.setValue === 'function') {
						field.setValue(field, defaultFormModel[field.name], defaultFormModel)
					} else {
						field.value = defaultFormModel[field.name]
					}
				}
				state.defaultFormModel = defaultFormModel
			}
		})
		state.setDefaultFormModel(state.formModel)
		return {
			...toRefs(state),
			omitKeys: useOmitKeys(),
			onSubmit() {
				state.formRef.validate().then(() => {
					props.config.operations?.onSubmit({...state.formModel})
				})
			},
			onReset() {
				state.setDefaultFormModel(state.defaultFormModel)
				nextTick(() => {
					state.formRef.resetFields()
				})
			}
		}
	}
}
</script>

<!--<template>-->
<!--	<div class="home">-->
<!--		<ax-form :config="formConfig" ref="formRef">-->
<!--			&lt;!&ndash;			<template v-slot:usernameFormItem="{ field }">&ndash;&gt;-->
<!--			&lt;!&ndash;				自定义FormItem{{ field }}&ndash;&gt;-->
<!--			&lt;!&ndash;			</template>&ndash;&gt;-->
<!--			&lt;!&ndash;			<template v-slot:username="{field}">&ndash;&gt;-->
<!--			&lt;!&ndash;				自定义input: {{ field }}&ndash;&gt;-->
<!--			&lt;!&ndash;			</template>&ndash;&gt;-->
<!--		</ax-form>-->
<!--	</div>-->
<!--</template>-->
<!--<script>-->
<!--import { reactive, toRefs, defineComponent, computed } from 'vue'-->
<!--export default defineComponent({-->
<!--	setup (props, context) {-->
<!--		const state = reactive({-->
<!--			formConfig: {-->
<!--				labelCol: { span: 2 },-->
<!--				fields: [-->
<!--					{-->
<!--						name: 'username', value: '',-->
<!--						label: '用户名', width: '100px',-->
<!--						type: 'a-input',-->
<!--						rules: [{required: true, message: '请输入手机号', trigger: ['change', 'blur']}],-->
<!--						attrs: {-->
<!--							placeholder: '请输入用户名',-->
<!--						}-->
<!--					}, {-->
<!--						name: 'loveFruits', value: [],-->
<!--						label: '喜欢的水果', width: '100px',-->
<!--						type: 'ax-checkbox-group',-->
<!--						attrs: {-->
<!--							options: [-->
<!--								{ label: '苹果', value: 'apple' },-->
<!--								{ label: '橙子', value: 'orange' },-->
<!--							]-->
<!--						}-->
<!--					}, {-->
<!--						name: 'rememberMe', value: true,-->
<!--						label: '记住我',-->
<!--						type: 'a-checkbox',-->
<!--						attrs: { label: '记住' }-->
<!--					}-->
<!--				],-->
<!--				operations: {-->
<!--					wrapperCol: { offset: 2 },-->
<!--				}-->
<!--			},-->
<!--		})-->
<!--		return { ...toRefs(state) }-->
<!--	},-->
<!--})-->
<!--</script>-->
<!--<style lang="scss" scoped>-->
<!--</style>-->
