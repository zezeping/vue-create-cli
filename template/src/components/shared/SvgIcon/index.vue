<template>
  <component :is="componentName" class="svg-icon" :class="{'inherit-color': inheritColor}" viewbox="0 0 130 130">
    <slot></slot>
  </component>
</template>

<script>
import { defineComponent } from 'vue'
// 异步导入， 等价asyncDefineComponent
// const modules = import.meta.glob('./svg/*.svg')
// 同步导入
const modules = import.meta.globEager('./svg/*.svg')
import {computed} from 'vue'
export default defineComponent({
  name: 'SvgIcon',
  // https://vitejs.dev/guide/features.html#glob-import
  components: {
    ...Object.assign({}, ...Object.keys(modules).map(key => {
      const iconName = key.match(/([\w|-]+).svg$/i)[1]
      const componentName = `${iconName}-icon`
      return { [componentName]: modules[key].default }
    }))
  },
  props: {
    name: {
      type: String,
      required: true
    },
    inheritColor: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    return {
      componentName: computed(() => `${props.name}-icon`)
    }
  }
})
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;

  &.inherit-color {
    ::v-deep(path) {
      fill: currentColor;
    }
  }

  &.btn {
    cursor: pointer;
  }
}
</style>