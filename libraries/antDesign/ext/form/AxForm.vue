<template>
	<a-form class="ax-form" :model="formModel" v-bind="{...$attrs, ...formAttrs}" ref="formRef">
		<slot>
			<template v-for="(formItem, idx) in config.formItems" :key="idx">
				<slot :name="`${formItem.name}FormItem`" v-bind="{ formItemAttrs: formItemAttrs(formItem), formItem, formModel, onSubmit, onReset, onCancel }">
					<a-form-item v-bind="formItemAttrs(formItem)" v-if="slotKeys.indexOf(`${formItem.name}FormItem`) === -1">
						<slot :name="formItem.name" v-bind="{ formItem, formModel, onSubmit, onReset, onCancel }">
							<template v-if="'a-checkbox' === formItem.type">
								<component is="a-checkbox" v-model:checked="formItem.value" v-bind="formItem.attrs">{{ formItem.attrs.label || formItem.value }}</component>
							</template>
							<template v-else>
								<component :is="formItem.type" v-model:value="formItem.value" v-bind="formItem.attrs"></component>
							</template>
						</slot>
					</a-form-item>
				</slot>
			</template>
		</slot>
		<slot name="operationsFormItem" v-bind="{ config, formModel, onSubmit, onReset, onCancel, submitLoading }">
			<a-form-item class="operations-form-item" v-bind="config.operationsFormItem" v-if="slotKeys.indexOf(`operationsFormItem`) === -1">
				<slot name="operations" v-bind="{ config, formModel, onSubmit, onReset, onCancel, submitLoading }">
					<a-button type="primary" @click="onSubmit" style="margin: 0 5px;">提交</a-button>
					<a-button @click="onCancel" style="margin: 0 5px;">取消</a-button>
					<a-button @click="onReset" style="margin: 0 5px;">重置</a-button>
				</slot>
			</a-form-item>
		</slot>
	</a-form>
</template>

<script>
import { computed, reactive, toRefs, nextTick } from 'vue'
import { Input, Select, Checkbox, Textarea } from 'ant-design-vue'
import { useOmitKeys } from '@/utils/hooks/useObject'
import { useLoading } from '@/utils/hooks/useLoading'
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
		// keys: model, formItems, operations
		config: {
			type: Object,
			default: () => ({})
		}
	},
	emits: ['submit', 'reset', 'cancel'],
	setup(props, context) {
		const omitKeys = useOmitKeys()
		const state = reactive({
			submitLoading: useLoading(),
			slotKeys: computed(() => Object.keys(context.slots)),
			formAttrs: computed(() => omitKeys.value(props.config, ['model', 'formItems'])),
			formItemAttrs: computed(() => (formItem) => omitKeys.value(formItem, ['type', 'attrs', 'value'])),
			formRef: null,
			defaultFormModel: null,
			validate: () => state.formRef.validate(),
			formModel: computed(() => {
				if (context.attrs.model) {
					return context.attrs.model
				}
				const form = props.config.model || {}
				for (const formItem of (props.config.formItems || [])) {
					form[formItem.name] = typeof formItem.getValue === 'function' ? formItem.getValue(formItem, form) : formItem.value
				}
				return {...state.defaultFormModel, ...form}
			}),
			setDefaultFormModel(defaultFormModel) {
				for (const formItem of (props.config.formItems || [])) {
					if (typeof formItem.setValue === 'function') {
						formItem.setValue(formItem, defaultFormModel[formItem.name], defaultFormModel)
					} else {
						formItem.value = defaultFormModel[formItem.name]
					}
				}
				state.defaultFormModel = defaultFormModel
			}
		})
		state.setDefaultFormModel(state.formModel)

		const onCancel = () => context.emit('cancel')
		return {
			...toRefs(state),
			onSubmit() {
				state.formRef.validate().then(async () => {
					context.emit('submit', {...state.formModel}, { submitLoading: state.submitLoading, onCancel })
				})
			},
			onReset() {
				state.setDefaultFormModel(state.defaultFormModel)
				nextTick(() => {
					state.formRef.resetFields()
					context.emit('reset')
				})
			},
			onCancel
		}
	}
}
</script>

<!--<template>-->
<!--	<div class="home">-->
<!--		<ax-form :config="formConfig" ref="formRef">-->
<!--&lt;!&ndash;						<template v-slot:usernameFormItem="{ formItem }">&ndash;&gt;-->
<!--&lt;!&ndash;							自定义FormItem{{ formItem }}&ndash;&gt;-->
<!--&lt;!&ndash;						</template>&ndash;&gt;-->
<!--&lt;!&ndash;						<template v-slot:username="{field}">&ndash;&gt;-->
<!--&lt;!&ndash;							自定义input: {{ field }}&ndash;&gt;-->
<!--&lt;!&ndash;						</template>&ndash;&gt;-->
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
