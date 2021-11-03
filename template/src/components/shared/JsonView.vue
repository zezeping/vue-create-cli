<template>
  <pre class="json-view" v-html="computedJson"></pre>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'JsonView',
  props: {
    data: {
      type: [Array, Object]
    },
    space: {
      type: Number,
      default: 2
    },
    colored: {
      type: Boolean,
      default: true
    }
  },
  setup (props, _ctx) {
    const state = reactive({
      syntaxHighlight (jsonString) {
        const json = jsonString.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\\-]?\d+)?)/g, function (match) {
          let cls = 'pre-number'
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'pre-key'
            } else {
              cls = 'pre-string'
            }
          } else if (/true|false/.test(match)) {
            cls = 'pre-boolean'
          } else if (/null/.test(match)) {
            cls = 'pre-null'
          }
          return '<span class="' + cls + '">' + match + '</span>'
        })
      },
      computedJson: computed(() => {
        let jsonString = JSON.stringify(props.data || {}, function replacer (key, value) {
          return value
        }, props.space)
        if (props.colored) {
          return state.syntaxHighlight(jsonString)
        }
        return jsonString
      })
    })
    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
.json-view {
  margin: 5px;
  padding: 5px;
  line-height: 1.2;
  border: 1px solid #f2f2f2;
  overflow: hidden;

  ::v-deep(.pre-string) { color: green; }
  ::v-deep(.pre-number) { color: darkorange; }
  ::v-deep(.pre-boolean) { color: blue; }
  ::v-deep(.pre-null) { color: magenta; }
  ::v-deep(.pre-key) { color: red; }
}
</style>