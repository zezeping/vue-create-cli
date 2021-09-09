<template>
  <div class="drag-size-container" ref="dragSizeContainer">
    <div class="resize l" data-type="l" v-if="directions.indexOf('l') !== -1"></div>
    <div class="resize t" data-type="t" v-if="directions.indexOf('t') !== -1"></div>
    <div class="resize r" data-type="r" v-if="directions.indexOf('r') !== -1"></div>
    <div class="resize b" data-type="b" v-if="directions.indexOf('b') !== -1"></div>
    <div class="resize lt" data-type="lt" v-if="directions.indexOf('lt') !== -1"></div>
    <div class="resize lb" data-type="lb" v-if="directions.indexOf('lb') !== -1"></div>
    <div class="resize rt" data-type="rt" v-if="directions.indexOf('rt') !== -1"></div>
    <div class="resize rb" data-type="rb" v-if="directions.indexOf('rb') !== -1"></div>
    <slot></slot>
  </div>
</template>

<script>
import { onMounted, onUpdated, ref } from 'vue'
export default {
  name: 'DragSizeContainer',
  props: {
    minWidth: { type: Number, default: 0 },
    minHeight: { type: Number, default: 0 },
    maxWidth: { type: Number, default: 999999 },
    maxHeight: { type: Number, default: 999999 },
    directions: {
      type: Array,
      //  左   上    右   下    左上   在下  右上   右下
      // ['l', 't', 'r', 'b', 'lt', 'lb', 'rt', 'rb']
      default: () => []
    }
  },
  setup(props, context) {
    const dragSizeContainer = ref(null)
    const bindDragListener = () => {
      const rootEl = dragSizeContainer.value

      function getOriginSize() {
        return { width: rootEl.offsetWidth, height: rootEl.offsetHeight }
      }

      const resizeEls = Array.prototype.filter.call(rootEl.children, node => node.classList.contains('resize'))
      resizeEls.forEach((resizeEl) => {
        resizeEl.onmousedown = (event) => {
          const mousedownEvent = event || window.event
          // console.log('mousedown')
          let originSize = getOriginSize()
          let dragType = resizeEl.dataset.type

          const mousemove = (event) => {
            // console.log('mousemove')
            event = event || window.event

            if (['r', 'rt', 'rb'].indexOf(dragType) !== -1) {
              let width = originSize.width + event.clientX - mousedownEvent.clientX
              const min = props.minWidth
              const max = props.maxWidth
              width < min && (width = min)
              width > max && (width = max)
              rootEl.style.width = `${ width }px`
            }
            if (['b', 'lb', 'rb'].indexOf(dragType) !== -1) {
              let height = originSize.height + event.clientX - mousedownEvent.clientX
              const min = props.minHeight
              const max = props.maxHeight
              height < min && (height = min)
              height > max && (height = max)
              rootEl.style.height = `${ height }px`
            }
            if (['l', 'lt', 'lb'].indexOf(dragType) !== -1) {
              let width = originSize.width + mousedownEvent.clientX - event.clientX
              const min = props.minWidth
              const max = props.maxWidth
              width < min && (width = min)
              width > max && (width = max)
              rootEl.style.width = `${ width }px`
            }
            if (['t', 'lt', 'rt'].indexOf(dragType) !== -1) {
              let height = originSize.height + mousedownEvent.clientY - event.clientY
              const min = props.minHeight
              const max = props.maxHeight
              height < min && (height = min)
              height > max && (height = max)
              rootEl.style.height = `${ height }px`
            }
          }
          document.addEventListener('mousemove', mousemove)

          const mouseup = () => {
            document.removeEventListener('mousemove', mousemove)
            document.removeEventListener('mouseup', mouseup)
          }
          document.addEventListener('mouseup', mouseup)
        }
      })
    }
    onMounted(() => { bindDragListener() })
    onUpdated(() => { bindDragListener() })

    return {
      dragSizeContainer
    }
  }
}
</script>

<style lang="scss" scoped>
.drag-size-container {
  position: relative;
  .resize {
    position: absolute;
    min-width: 1px;
    min-height: 1px;
    background: transparent;
    z-index: 1;
    &.l { left: 0; top: 0; bottom: 0; cursor: ew-resize; }
    &.r { right: 0; top: 0; bottom: 0; cursor: ew-resize; }
    &.t { top: 0; left: 0; right: 0; cursor: ns-resize; }
    &.b { bottom: 0; left: 0; right: 0; cursor: ns-resize; }
    &.lt { left: 0; top: 0; cursor: nw-resize; }
    &.lb { left: 0; bottom: 0; cursor: sw-resize; }
    &.rt { top: 0; right: 0; cursor: ne-resize; }
    &.rb { right: 0; bottom: 0; cursor: se-resize; }
  }
}
</style>
