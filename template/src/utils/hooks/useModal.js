import { createApp, h, reactive, provide, onUnmounted, getCurrentInstance } from 'vue'
import { Modal } from 'ant-design-vue'

const createAntDesignModal = (options) => {
  const { slots, caller, ...otherOptions } = options
  const div = document.createElement('div')
  document.body.appendChild(div)
  
  const modalInstance = createApp({
    setup (_props, _ctx) {
      if (caller) {
        const compInstance = getCurrentInstance()
        compInstance.appContext = caller.appContext
      }
      
      const modalState = reactive({
        visible: true,
        ...otherOptions,
        'onUpdate:visible'(value) {
          modalState.visible = value
          if (typeof options['onUpdate:visible'] === 'function') {
            options['onUpdate:visible'](...arguments)
          }
        },
        afterClose() {
          if (typeof modalState.onAfterClose === 'function') {
            modalState.onAfterClose()
          }
          modalInstance.unmount()
        }
      })
      
      onUnmounted(() => {
        div.parentNode?.removeChild(div)
      })
      
      const modalSlots = reactive(slots)
      provide('modalState', modalState)
      provide('modalSlots', modalSlots)
      
      return {
        modalState,
        modalSlots,
        close() {
          modalState.visible = false
        }
      }
    },
    render() {
      return h(Modal, this.modalState, this.modalSlots)
    }
  })
  modalInstance.mount(div)
  modalInstance.close = () => {
    modalInstance._instance.ctx.close()
  }
  return modalInstance
}

/* usage */
//import { createVNode } from 'vue'
//const instance = useModal({
//  caller: /* getCurrentInstance() */,
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