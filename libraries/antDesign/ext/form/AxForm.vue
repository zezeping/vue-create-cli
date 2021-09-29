<template>
	<a-form class="ax-form" :model="formModel" v-bind="{...$attrs, ...omitKeys(config, ['model', 'formItems'])}" ref="formRef">
		<slot>
			<template v-for="(field, idx) in config.formItems" :key="idx">
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
			<slot name="operationsFormItem" v-bind="{ config, onSubmit, onReset, onCancel, formItemConfig: omitKeys(config.operationsFormItem, ['onSubmit', 'onReset', 'onCancel']) }">
				<a-form-item class="operations-form-item" v-bind="config.operationsFormItem">
					<slot name="operations" v-bind="{ config, onSubmit, onReset, onCancel }">
						<a-button type="primary" @click="onSubmit" style="margin: 0 5px;">提交</a-button>
						<a-button @click="onCancel" style="margin: 0 5px;">取消</a-button>
						<a-button @click="onReset" style="margin: 0 5px;">重置</a-button>
					</slot>
				</a-form-item>
			</slot>
		</slot>
	</a-form>
</template>

<script>
import { computed, reactive, toRefs, nextTick } from 'vue'
import { Input, Select, Checkbox, Textarea } from 'ant-design-vue'
import { useOmitKeys } from '@/utils/hooks/useObject'
import AxSelect from './AxSelect'
import AxCheckboxGroup from './AxCheckboxGroup'
export default {
	inheritAttrs: false,
	components: {
		[Input.name]: Input,
		[Select.name]: Select,
		[Checkbox.name]: Checkbox,
		[Textarea.name]: Textarea,
		AxSelect,
		AxCheckboxGroup,
	},
	props: {
		// keys: formItems
		config: {
			type: Object,
			default: () => ({})
		}
	},
	emits: ['submit', 'reset', 'cancel'],
	setup(props, context) {
		const state = reactive({
			formRef: null,
			defaultFormModel: null,
			validate: () => state.formRef.validate(),
			formModel: computed(() => {
				if (context.attrs.model) {
					return context.attrs.model
				}
				const form = props.config.model || {}
				for (const field of (props.config.formItems || [])) {
					form[field.name] = typeof field.getValue === 'function' ? field.getValue(field, form) : field.value
				}
				return {...state.defaultFormModel, ...form}
			}),
			setDefaultFormModel(defaultFormModel) {
				for (const field of (props.config.formItems || [])) {
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
					context.emit('submit', {...state.formModel})
				})
			},
			onReset() {
				state.setDefaultFormModel(state.defaultFormModel)
				nextTick(() => {
					state.formRef.resetFields()
					context.emit('reset')
				})
			},
			onCancel() {
				context.emit('cancel')
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
<!--				formItems: [-->
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
<!--				operationsFormItem: {-->
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
