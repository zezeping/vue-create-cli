<template>
  <div ref="rootRef" class="ext-sticky" :style="rootStyle">
    <slot></slot>
  </div>
</template>

<script>
import {defineComponent, ref, reactive, computed, onMounted, onUnmounted, nextTick} from 'vue'
import {getScrollParent} from './utils/getScrollParent'
import {getRect} from './utils/getRect'

export default defineComponent({
  name: 'Sticky',
  props: {
    offset: {
      type: Object,
      default: () => ({top: 0, bottom: 0, left: 0, right: 0})
    },
    positions: {
      type: [Array],
      default: () => ['top', 'bottom', 'left', 'right']
    },
    container: Element
  },
  setup(props) {
    const rootRef = ref(null)
    const state = reactive({
      // horizontal
      horizontalFixed: false,
      onFixedHorizontalDirection: '',
      onFixedHorizontalScrollTop: 0,
      onFixedHorizontalScrollLeft: 0,
      left: 0,
      leftShrink: 0,
      // vertical
      verticalFixed: false,
      onFixedVerticalDirection: '',
      onFixedVerticalScrollLeft: 0,
      onFixedVerticalScrollTop: 0,
      top: 0,
      topShrink: 0
    })
    const propsOffset = computed(() => {
      return Object.assign({top: 0, bottom: 0, left: 0, right: 0}, props.offset)
    })
    const rootStyle = computed(() => {
      const rootStyle = {}
      let {left, top, topShrink, leftShrink, horizontalFixed, verticalFixed} = state
      if (verticalFixed || horizontalFixed) {
        // const style = {position: 'fixed', left: `${left}px`, top: `${top}px`}
        if (props.container) {
          // let translateX = 0
          // let translateY = 0
          if (state.verticalFixed) {
            switch (state.onFixedVerticalDirection) {
            case 'top':
              // translateY = -topShrink
              top = top - topShrink
              break
            case 'bottom':
              // translateY = topShrink
              top = top + topShrink
              break
            }
          }
          if (state.horizontalFixed) {
            switch (state.onFixedHorizontalDirection) {
            case 'left':
              // translateX = -leftShrink
              left = left - leftShrink
              break
            case 'right':
              // translateX = leftShrink
              left = left + leftShrink
              break
            }
          }
          // style.transform = `translate(${translateX}px, ${translateY}px)`
        }
        Object.assign(rootStyle, {position: 'fixed', left: `${left}px`, top: `${top}px`})
      }
      return rootStyle
    })

    let onScroll = null
    onMounted(() => {
      const el = rootRef.value
      const scrollParent = getScrollParent(el)
      const getContainerShrink = (direct) => {
        if (props.container) {
          const elRect = getRect(el)
          const containerEl = props.container
          const containerElRect = getRect(containerEl)
          const scrollParentRect = getRect(scrollParent)
          switch (direct) {
          case 'top':
            return Math.max(state.top + elRect.height - (containerElRect.top - scrollParentRect.top + containerElRect.height), 0)
          case 'bottom':
            return Math.max((containerElRect.top - scrollParentRect.top) - state.top, 0)
          case 'left':
            return Math.max(state.left + elRect.width - (containerElRect.left - scrollParentRect.left + containerElRect.width), 0)
          case 'right':
            return Math.max((containerElRect.left - scrollParentRect.left) - state.left, 0)
          }
        }
        return 0
      }
      let beforeScrollTop = 0
      let beforeScrollLeft = 0
      onScroll = (event, firstInitialize) => {
        const scrollParentRect = getRect(scrollParent)
        const elRect = getRect(el)
        const {scrollTop, scrollLeft} = scrollParent
        // 判断滚动方向
        let scrollDirection = ''
        if (scrollTop !== beforeScrollTop) {
          beforeScrollTop = scrollTop
          beforeScrollLeft = scrollLeft
          scrollDirection = 'vertical'
        } else if (scrollLeft !== beforeScrollLeft) {
          beforeScrollTop = scrollTop
          beforeScrollLeft = scrollLeft
          scrollDirection = 'horizontal'
        }
        // vertical
        if (firstInitialize || scrollDirection === 'vertical') {
          if (state.verticalFixed) {
            const {onFixedVerticalScrollTop, onFixedVerticalDirection} = state
            const {scrollTop} = scrollParent
            switch (onFixedVerticalDirection) {
            case 'top':
              if (scrollTop <= onFixedVerticalScrollTop) {
                state.verticalFixed = false
              } else {
                state.topShrink = getContainerShrink('top')
              }
              break
            case 'bottom':
              if (scrollTop >= onFixedVerticalScrollTop) {
                state.verticalFixed = false
              } else {
                state.topShrink = getContainerShrink('bottom')
              }
              break
            }
          } else {
            // top bottom
            const onFixedVerticalScrollTop = scrollParent.scrollTop + elRect.top - scrollParentRect.top
            const onFixedVerticalScrollTopForTop = onFixedVerticalScrollTop - propsOffset.value.top
            const onFixedVerticalScrollTopForBottom = onFixedVerticalScrollTop - scrollParentRect.height + elRect.height + propsOffset.value.bottom
            if (props.positions.indexOf('top') !== -1 && scrollParent.scrollTop > onFixedVerticalScrollTopForTop) {
              if (!state.verticalFixed) {
                state.onFixedVerticalScrollTop = onFixedVerticalScrollTopForTop
                state.onFixedVerticalScrollLeft = scrollParent.scrollLeft
              }
              let left = state.horizontalFixed ? state.left : elRect.left - scrollParentRect.left
              Object.assign(state, {verticalFixed: true, onFixedVerticalDirection: 'top', top: scrollParentRect.top + propsOffset.value.top, left})
              if (firstInitialize) { onScroll(null, true) }
            } else if (props.positions.indexOf('bottom') !== -1 && scrollParent.scrollTop < onFixedVerticalScrollTopForBottom) {
              if (!state.verticalFixed) {
                state.onFixedVerticalScrollTop = onFixedVerticalScrollTopForBottom
                state.onFixedVerticalScrollLeft = scrollParent.scrollLeft
              }
              let left = state.horizontalFixed ? state.left : elRect.left - scrollParentRect.left
              Object.assign(state, {verticalFixed: true, onFixedVerticalDirection: 'bottom', top: scrollParentRect.top + scrollParentRect.height - elRect.height - propsOffset.value.bottom, left})
              if (firstInitialize) { onScroll(null, true) }
            } else if (state.horizontalFixed) {
              state.top = state.top - (scrollParent.scrollTop - state.onFixedHorizontalScrollTop)
              state.onFixedHorizontalScrollTop = scrollParent.scrollTop
            }
          }
        }
        // horizontal
        if (firstInitialize || scrollDirection === 'horizontal') {
          if (state.horizontalFixed) {
            const {onFixedHorizontalScrollLeft, onFixedHorizontalDirection} = state
            const {scrollLeft} = scrollParent
            switch (onFixedHorizontalDirection) {
            case 'left':
              if (scrollLeft <= onFixedHorizontalScrollLeft) {
                state.horizontalFixed = false
              } else {
                state.leftShrink = getContainerShrink('left')
              }
              break
            case 'right':
              if (scrollLeft >= onFixedHorizontalScrollLeft) {
                state.horizontalFixed = false
              } else {
                state.leftShrink = getContainerShrink('right')
              }
              break
            }
          } else {
            // left right
            const onFixedHorizontalScrollLeft = scrollParent.scrollLeft + elRect.left - scrollParentRect.left
            const onFixedHorizontalScrollTop = onFixedHorizontalScrollLeft - propsOffset.value.left
            const onFixedVerticalScrollTopForRight = onFixedHorizontalScrollLeft - scrollParentRect.width + elRect.width + propsOffset.value.right
            if (props.positions.indexOf('left') !== -1 && scrollParent.scrollLeft > onFixedHorizontalScrollTop) {
              if (!state.horizontalFixed) {
                state.onFixedHorizontalScrollLeft = onFixedHorizontalScrollTop
                state.onFixedHorizontalScrollTop = scrollParent.scrollTop
              }
              let top = state.verticalFixed ? state.top : elRect.top - scrollParentRect.top
              Object.assign(state, {horizontalFixed: true, onFixedHorizontalDirection: 'left', left: scrollParentRect.left + propsOffset.value.left, top})
              if (firstInitialize) { onScroll(null, true) }
            }
            else if (props.positions.indexOf('right') !== -1 && scrollParent.scrollLeft < onFixedVerticalScrollTopForRight) {
              if (!state.horizontalFixed) {
                state.onFixedHorizontalScrollLeft = onFixedVerticalScrollTopForRight
                state.onFixedHorizontalScrollTop = scrollParent.scrollTop
              }
              let top = state.verticalFixed ? state.top : elRect.top - scrollParentRect.top
              Object.assign(state, {horizontalFixed: true, onFixedHorizontalDirection: 'right', left: scrollParentRect.left + scrollParentRect.width - elRect.width - propsOffset.value.right, top})
              if (firstInitialize) { onScroll(null, true) }
            } else if (state.verticalFixed) {
              state.left = state.left - (scrollParent.scrollLeft - state.onFixedVerticalScrollLeft)
              state.onFixedVerticalScrollLeft = scrollParent.scrollLeft
            }
          }
        }
      }
      // 需要放在nextTick才能拿到props.container
      nextTick(() => {
        scrollParent.addEventListener('scroll', onScroll)
        onScroll(null, true)
      })
    })
    onUnmounted(() => {
      const el = rootRef.value
      const scrollParent = getScrollParent(el)
      scrollParent.removeEventListener('scroll', onScroll)
    })

    return {
      rootRef,
      rootStyle,
      state
    }
  }
})
</script>

<style lang="scss" scoped>
.ext-sticky {}
</style>