import { createApp, getCurrentInstance, onUnmounted, h, reactive, defineComponent, provide } from 'vue'
import { Modal } from 'ant-design-vue'
import store from '@/store'
import router from '@/router'

const createAntDesignModal = (options) => {
  const { slots, ...otherOptions } = options
  let appInstance = null
  let componentInstance = null
  const div = document.createElement('div')
  document.body.appendChild(div)
  const ModalComponent = defineComponent({
    emits: ['afterClose'],
    setup(props, ctx) {
      componentInstance = getCurrentInstance()
      const state = reactive({
        visible: true,
        ...otherOptions,
        'onUpdate:visible'(value) {
          state.visible = value
          if (typeof options['onUpdate:visible'] === 'function') {
            options['onUpdate:visible'](...arguments)
          }
        },
        afterClose() {
          if (typeof state.onAfterClose === 'function') {
            state.onAfterClose()
          }
          ctx.emit('afterClose')
        }
      })
      const slots = reactive(options.slots)
      
      provide('modalState', state)
      provide('modalSlots', slots)
      
      onUnmounted(() => {
        div.parentNode?.removeChild(div)
      })
      
      return {
        modalState: state,
        modalSlots: slots
      }
    },
    render() {
      return h(Modal, this.modalState, this.modalSlots)
    }
  })
  appInstance = createApp(ModalComponent, {
    onAfterClose() {
      appInstance.unmount()
    }
  })
  appInstance.use(store)
  appInstance.use(router)
  appInstance.mount(div)
  appInstance.close = () => {
    componentInstance.ctx.modalState.visible = false
  }
  return appInstance
}

/* usage */
//import { createVNode } from 'vue'
//const instance = useModal({
//  title: '新建仓库',
//  footer: null,
//  slots: {
//    default: () => createVNode(New, {
//      onCancel: () => {
//        //instance.unmount() // 直接移除
//        instance.close() // 弹出框完全关闭后移除
//      }
//    })
//  }
//})

export const useModal = (options) => {
  return createAntDesignModal(options)
}