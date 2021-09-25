<template>
	<el-select>
		<template v-slot>
			<slot v-bind="{...$attrs, ...props}">
				<template v-for="(item, idx) in options" :key="idx">
					<el-option :label="item[labelKey]" :value="item[valueKey]"></el-option>
				</template>
			</slot>
		</template>
	</el-select>
</template>

<script>
import { defineComponent } from 'vue'
import { ElSelect, ElOption } from 'element-plus'
export default defineComponent({
	components: {
		ElSelect,
		ElOption
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