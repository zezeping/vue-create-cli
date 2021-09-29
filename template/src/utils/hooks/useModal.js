import {
  createApp,
  getCurrentInstance,
  onUnmounted,
  h,
  reactive,
  defineComponent,
  watch,
  nextTick,
  createVNode,
} from 'vue'
import { Modal } from 'ant-design-vue'
import New from '../../views/repositories/New'

const createAntDesignModal = (options) => {
  const { slots, ...otherOptions } = options
  let appInstance = null
  let componentInstance = null
  const div = document.createElement('div')
  document.body.appendChild(div)
  const ModalComponent = defineComponent({
    props: {
      afterClose: Function,
    },
    emits: ['afterClose'],
    setup(props, ctx) {
      componentInstance = getCurrentInstance()
      const modalOptions = reactive({
        visible: true,
        ...otherOptions,
        'onUpdate:visible': value => {
          if (typeof otherOptions['onUpdate:visible'] === 'function') {
            otherOptions['onUpdate:visible']()
          }
          if (!value) {
            modalOptions.visible = false
          }
        },
        afterClose() {
          if (typeof otherOptions.onAfterClose === 'function') {
            otherOptions.onAfterClose()
          }
          props.afterClose()
        }
      })
      const modalSlots = reactive({...slots})
      
      onUnmounted(() => {
        div.parentNode?.removeChild(div)
      })
      
      return {
        modalOptions,
        modalSlots
      }
    },
    render() {
      return h(Modal, this.modalOptions, this.modalSlots)
    }
  })
  appInstance = createApp(ModalComponent, {
    afterClose() {
      appInstance.unmount()
    }
  })
  appInstance.mount(div)
  appInstance.close = () => {
    componentInstance.ctx.modalOptions.visible = false
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