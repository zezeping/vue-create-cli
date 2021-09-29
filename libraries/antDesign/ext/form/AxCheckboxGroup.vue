<template>
	<a-checkbox-group>
		<template v-slot>
			<slot v-bind="{...$attrs, ...props}">
				<template v-for="(item, idx) in options" :key="idx">
					<a-checkbox :value="item[valueKey]">{{ item[labelKey] }}</a-checkbox>
				</template>
			</slot>
		</template>
	</a-checkbox-group>
</template>

<script>
import { defineComponent } from 'vue'
import { Checkbox, CheckboxGroup } from 'ant-design-vue'
export default defineComponent({
	components: {
		[Checkbox.name]: Checkbox,
		[CheckboxGroup.name]: CheckboxGroup,
	},
	props: {
		labelKey: {
			type: String,
			default: 'label'
		},
		valueKey: {
			type: String,
			default: 'value'
		},
		options: [Array]
	},
	setup(props) {
		return {
			props
		}
	}
})
</script>