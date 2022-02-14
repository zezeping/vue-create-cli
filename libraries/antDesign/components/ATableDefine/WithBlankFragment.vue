<template>
	<slot name="loading" v-if="loading">
		<a-spin />
	</slot>
  <div class="blank-view" v-else-if="isBlank">
    <slot name="blank">
      <a-empty />
    </slot>
  </div>
	<slot v-else></slot>
</template>

<script>
import { reactive, toRefs, defineComponent } from 'vue'

export default defineComponent({
	name: 'ViewFragment',
	props: {
		loading: [Boolean],
		isBlank: [Boolean],
	},
	setup (props, ctx) {
		const state = reactive({})
		return { ...toRefs(state) }
	},
})
</script>

<style lang="scss" scoped>
.ant-spin {
	display: block;
	margin: 100px auto;
}

.blank-view {
  .ant-empty {
    display: block;
    margin: 100px auto;
  }

  ::v-deep(.blank-placeholder)  {
    margin: 100px auto;
    font-size: 14px;
    color: #bbb;
    img { display: block; margin: 0 auto; }
    p { text-align: center; margin: 20px 0; }
  }
}

</style>