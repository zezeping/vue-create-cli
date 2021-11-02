<template>
  <a-select style="min-width: 150px;">
    <template #default>
      <slot v-bind="{...$attrs, ...props}">
        <template v-for="(item, idx) in options" :key="idx">
          <a-select-option :value="item[valueKey]">{{ item[labelKey] }}</a-select-option>
        </template>
      </slot>
    </template>
  </a-select>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  components: {},
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