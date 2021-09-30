<template>
	<el-form class="elx-form" :model="formModel" v-bind="{...$attrs, ...formAttrs}" ref="formRef">
		<slot>
			<template v-for="(formItem, idx) in config.formItems" :key="idx">
				<slot :name="`${formItem.prop}FormItem`" v-bind="{ formItemAttrs: formItemAttrs(formItem), formModel, formItem, onSubmit, onReset, onCancel }">
					<el-form-item v-bind="formItemAttrs(formItem)" v-if="slotKeys.indexOf(`${formItem.name}FormItem`) === -1">
						<slot :name="formItem.prop" v-bind="{ formItem, formModel, onSubmit, onReset, onCancel }">
							<component :is="formItem.type" v-model="formItem.value" v-bind="formItem.attrs"></component>
						</slot>
					</el-form-item>
				</slot>
			</template>
		</slot>
		<slot name="operationsFormItem" v-bind="{ config, formModel, onSubmit, onReset, onCancel, submitLoading }">
			<el-form-item class="operations-form-item" v-bind="config.operationsFormItem" v-if="slotKeys.indexOf(`operationsFormItem`) === -1">
				<slot name="operations" v-bind="{ config, formModel, onSubmit, onReset, onCancel, submitLoading }">
					<el-button type="primary" @click="onSubmit">提交</el-button>
					<el-button @click="onCancel">取消</el-button>
					<el-button @click="onReset">重置</el-button>
				</slot>
			</el-form-item>
		</slot>
	</el-form>
</template>

<script>
import { reactive, toRefs, defineComponent, computed, nextTick } from 'vue'
import { ElInput, ElSelect, ElCheckbox } from 'element-plus'
import { useOmitKeys } from '@/utils/hooks/useObject'
import { useLoading } from '@/utils/hooks/useLoading'
import ElxSelect from './ElxSelect'
import ElxCheckboxGroup from './ElxCheckboxGroup'
export default defineComponent({
	inheritAttrs: false,
	components: {
		ElInput,
		ElSelect,
		ElCheckbox,
		ElxSelect,
		ElxCheckboxGroup,
	},
	props: {
		// keys: model, formItems
		config: {
			type: Object,
			required: true
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
			formModel: computed(() => {
				if (context.attrs.model) {
					return context.attrs.model
				}
				const form = props.config.model || {}
				for (const formItem of (props.config.formItems || [])) {
					form[formItem.prop] = typeof formItem.getValue === 'function' ? formItem.getValue(formItem, form) : formItem.value
				}
				return {...state.defaultFormModel, ...form}
			}),
			validate: () => state.formRef.validate(),
			setDefaultFormModel(defaultFormModel) {
				for (const formItem of (props.config.formItems || [])) {
					if (typeof formItem.setValue === 'function') {
						formItem.setValue(formItem, defaultFormModel[formItem.prop], defaultFormModel)
					} else {
						formItem.value = defaultFormModel[formItem.prop]
					}
				}
				state.defaultFormModel = defaultFormModel
			}
		})
		state.setDefaultFormModel(state.formModel)

		const onCancel = () => context.emit('cancel')
		return {
			...toRefs(state),
			omitKeys: useOmitKeys(),
			onSubmit() {
				state.formRef.validate((valid) => {
					if (valid) {
						context.emit('submit', {...state.formModel}, { submitLoading: state.submitLoading, onCancel })
					}
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
})
</script>

<!--<template>-->
<!--	<div class="home">-->
<!--		<elx-form :config="formConfig" ref="formRef">-->
<!--&lt;!&ndash;			<template v-slot:usernameFormItem="{ formItem }">&ndash;&gt;-->
<!--&lt;!&ndash;				自定义FormItem{{ formItem }}&ndash;&gt;-->
<!--&lt;!&ndash;			</template>&ndash;&gt;-->
<!--&lt;!&ndash;			<template v-slot:username="{ formItem }">&ndash;&gt;-->
<!--&lt;!&ndash;				自定义input: {{ formItem }}&ndash;&gt;-->
<!--&lt;!&ndash;			</template>&ndash;&gt;-->
<!--		</elx-form>-->
<!--	</div>-->
<!--</template>-->
<!--<script>-->
<!--import { reactive, toRefs, defineComponent, computed } from 'vue'-->
<!--export default defineComponent({-->
<!--	setup (props, context) {-->
<!--		const state = reactive({-->
<!--			formConfig: {-->
<!--				labelWidth: '120px',-->
<!--				formItems: [-->
<!--					{-->
<!--						prop: 'username', value: '',-->
<!--						label: '用户名', width: '100px',-->
<!--						type: 'el-input',-->
<!--						rules: [{required: true, message: '请输入手机号', trigger: ['change', 'blur']}],-->
<!--						attrs: {-->
<!--							placeholder: '请输入用户名',-->
<!--						}-->
<!--					}, {-->
<!--						prop: 'loveFruits', value: [],-->
<!--						label: '喜欢的水果', width: '100px',-->
<!--						type: 'elx-checkbox-group',-->
<!--						attrs: {-->
<!--							options: [-->
<!--								{ label: '苹果', value: 'apple' },-->
<!--								{ label: '橙子', value: 'orange' },-->
<!--							]-->
<!--						}-->
<!--					}, {-->
<!--						prop: 'rememberMe', value: true,-->
<!--						label: '记住我',-->
<!--						type: 'el-checkbox',-->
<!--						attrs: { label: '记住' }-->
<!--					}-->
<!--				],-->
<!--				operationsFormItem: {-->
<!--				}-->
<!--			},-->
<!--		})-->
<!--		return { ...toRefs(state) }-->
<!--	},-->
<!--})-->
<!--</script>-->
<!--<style lang="scss" scoped>-->
<!--</style>-->
