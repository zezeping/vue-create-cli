<template>
  <div ref="contextMenuItemRef" class="context-menu-item" :class="{'sub-menu': existsSubMenu}" @mouseover="onMouseOver" @mouseleave="onMouseLeave" @click.stop="onClick">
    <slot></slot>
    <div v-show="subMenuSwitch" class="context-sub-menu" :style="{ left: `${elWidth}px`, top: 0 }">
      <slot name="sub-menu"></slot>
    </div>
  </div>
</template>

<script>
import {defineComponent, ref, watch} from 'vue'

export default defineComponent({
  name: 'ContextMenuItem',
  setup(props, {slots: $slots}) {
    const contextMenuItemRef = ref(null)
    const elWidth = ref(0)
    const subMenuSwitch = ref(false)
    const existsSubMenu = $slots['sub-menu']

    watch(subMenuSwitch, (nv) => {
      if (nv) {
        elWidth.value = contextMenuItemRef.value.offsetWidth
      }
    })

    return {
      contextMenuItemRef,
      elWidth,
      existsSubMenu,
      subMenuSwitch
    }
  },
  methods: {
    onMouseOver() {
      if (this.existsSubMenu) {
        this.subMenuSwitch = true
      }
    },
    onMouseLeave() {
      this.subMenuSwitch = false
    },
    onClick() {
      if (!this.existsSubMenu) {
        let parent = this.$parent
        while (parent) {
          if (parent.$options.name === 'ContextMenu') {
            parent.closeMenu()
            break
          }
          parent = parent.$parent
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.context-menu-item {
  color: #fff;
  background: #4a4a4a;

  &:last-child {
    border-bottom: 1px solid #404040;
  }

  padding: 2px 15px 2px 5px;

  &:hover {
    background: #666;
  }

  &.sub-menu {
    //transform: translate(0, 0);

    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &::after {
      content: '';
      width: 5px;
      height: 5px;
      font-weight: 500;
      border-bottom: 1.5px solid;
      border-right: 1.5px solid;
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translateY(-50%) rotate(-45deg);
      opacity: 0.6;
    }

    .context-sub-menu {
      position: absolute;
      border: 1px solid #333;
    }
  }
}
</style>