<template>
  <teleport to="body">
    <div v-show="menuSwitch" ref="contextMenuRef" class="context-menu" :style="contextMenuStyle">
      <slot></slot>
    </div>
  </teleport>
</template>

<script>
import {defineComponent, ref, onMounted, onBeforeUnmount} from 'vue'

export default defineComponent({
  name: 'ContextMenu',
  setup(_props, _ctx) {
    const menuSwitch = ref(false)
    const contextMenuRef = ref(null)
    const contextMenuStyle = ref({})

    // 根据点击的坐标点计算位置
    const getPosition = (x, y) => {
      const position = {left: x, top: y}
      const {innerWidth, innerHeight} = window
      const {offsetWidth: elWidth, offsetHeight: elHeight} = contextMenuRef.value
      if (y + elHeight > innerHeight) {
        position.top -= elHeight
      }
      if (x + elWidth > innerWidth) {
        position.left -= elWidth
      }
      if (position.top < 0) {
        position.top = elHeight < innerHeight ? (innerHeight - elHeight) / 2 : 0
      }
      if (position.left < 0) {
        position.left = elWidth < innerWidth ? (innerWidth - elWidth) / 2 : 0
      }
      return position
    }

    const openMenu = (event) => {
      event = event || window.event
      const {clientX, clientY, pageX, pageY} = event
      const x = clientX || pageX
      const y = clientY || pageY
      const position = getPosition(x, y)
      const {left, top} = position
      contextMenuStyle.value = {left: `${left}px`, top: `${top}px`}
      menuSwitch.value = true
    }

    const closeMenu = () => {
      menuSwitch.value = false
    }
    onMounted(() => {
      document.addEventListener('click', closeMenu)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('click', closeMenu)
    })

    return {
      menuSwitch,
      contextMenuRef,
      contextMenuStyle,
      openMenu,
      closeMenu
    }
  }
})
</script>

<style lang="scss" scoped>
.context-menu {
  position: fixed;
  border: 1px solid #333;
  border-radius: 2px;
  box-shadow: 0 0 0 -2px rgb(0 0 0 / 20%), 0 1px 3px 0 rgb(0 0 0 / 12%);
  font-size: 12px;
  line-height: 1.2;
  user-select: none;
}
</style>