<template>
	<el-form class="elx-form" :model="formModel" v-bind="{...$attrs, ...omitKeys(config, ['model', 'formItems'])}" ref="formRef">
		<slot>
			<template v-for="(field, idx) in config.formItems" :key="idx">
				<slot :name="`${field.prop}FormItem`" v-bind="{ field }">
					<el-form-item v-bind="omitKeys(field, ['type', 'attrs'])">
						<slot :name="field.prop" v-bind="{ field }">
							<component :is="field.type" v-model="field.value" v-bind="field.attrs"></component>
						</slot>
					</el-form-item>
				</slot>
			</template>
			<slot name="operationsFormItem" v-bind="{ config, onSubmit, onReset, config }">
				<el-form-item v-bind="config.operationsField">
					<slot name="operations" v-bind="{ config, onSubmit, onReset, onCancel }">
						<el-button type="primary" @click="onSubmit">提交</el-button>
						<el-button @click="onCancel">取消</el-button>
						<el-button @click="onReset">重置</el-button>
					</slot>
				</el-form-item>
			</slot>
		</slot>
	</el-form>
</template>

<script>
import { reactive, toRefs, defineComponent, computed, nextTick } from 'vue'
import { ElInput, ElSelect, ElCheckbox } from 'element-plus'
import { useOmitKeys } from '@/utils/hooks/useObject'
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
		const state = reactive({
			slotKeys: Object.keys(context.slots),
			formRef: null,
			defaultFormModel: null,
			formModel: computed(() => {
				if (context.attrs.model) {
					return context.attrs.model
				}
				const form = props.config.model || {}
				for (const field of (props.config.formItems || [])) {
					form[field.prop] = typeof field.getValue === 'function' ? field.getValue(field, form) : field.value
				}
				return {...state.defaultFormModel, ...form}
			}),
			validate: () => state.formRef.validate(),
			setDefaultFormModel(defaultFormModel) {
				for (const field of (props.config.formItems || [])) {
					if (typeof field.setValue === 'function') {
						field.setValue(field, defaultFormModel[field.prop], defaultFormModel)
					} else {
						field.value = defaultFormModel[field.prop]
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
				state.formRef.validate((valid) => {
					if (valid) {
						context.emit('submit', {...state.formModel})
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
			onCancel() {
				context.emit('cancel')
			}
		}
	}
})
</script>

<!--<template>-->
<!--	<div class="home">-->
<!--		<elx-form :config="formConfig" ref="formRef">-->
<!--&lt;!&ndash;			<template v-slot:usernameFormItem="{ field }">&ndash;&gt;-->
<!--&lt;!&ndash;				自定义FormItem{{ field }}&ndash;&gt;-->
<!--&lt;!&ndash;			</template>&ndash;&gt;-->
<!--&lt;!&ndash;			<template v-slot:username="{field}">&ndash;&gt;-->
<!--&lt;!&ndash;				自定义input: {{ field }}&ndash;&gt;-->
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
<!--	mounted() {-->
<!--		this.$apiAxios.get('http://baidu2.com/api/paht').catch(er => console.log(er, 33))-->
<!--	}-->
<!--})-->
<!--</script>-->
<!--<style lang="scss" scoped>-->
<!--</style>-->
