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
import { ElCheckbox, ElCheckboxGroup } from 'element-plus'
export default defineComponent({
	components: {
		ElCheckbox,
		ElCheckboxGroup
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