import { getCurrentInstance, createVNode, defineComponent, reactive, ref, provide, h } from 'vue'
import { Modal } from 'ant-design-vue'

/* usage */
//import { createVNode } from 'vue'
//const modal = useModal()
//const instance = modal.create({
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


const ModalComponent = defineComponent({
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { slots = {}, ...otherOptions } = props.options
    const modalState = reactive({
      ...otherOptions,
      'onUpdate:visible'(value) {
        modalState.visible = value
        if (typeof otherOptions['onUpdate:visible'] === 'function') {
          otherOptions['onUpdate:visible'](...arguments)
        }
      }
    })
    const modalSlots = reactive(slots)
    provide('modalState', new Proxy(modalState, {
      get(target, key, ...args) {
        if (key === 'close') {
          return () => target['onUpdate:visible'](false)
        }
        return Reflect.get(...arguments)
      }
    }))
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

export const useModal = (defaultOptions) => {
  const instance = getCurrentInstance()
  console.assert(!!instance, 'getCurrentInstance无法获取到实例，请检查')
  const app = instance.appContext.app
  
  return {
    create (options) {
      const div = document.createElement('div')
      div.setAttribute('class', 'ant-modal-container')
      document.body.appendChild(div)
      
      const visible = ref(true)
  
      const modalVNode = createVNode(ModalComponent, {
        options: {
          getContainer: div,
          ...defaultOptions,
          ...options,
          visible,
          afterClose() {
            app.render(null, div)
            div.parentNode.removeChild(div)
            if (typeof options.onAfterClose === 'function') {
              options.onAfterClose()
            }
          },
        }
      })
      app.render(modalVNode, div)
      
      return {
        close () {
          visible.value = false
          // modalVNode.component.setupState.close()
        }
      }
    }
  }
}