import { getCurrentInstance, onBeforeMount, createVNode, defineComponent, reactive, ref, provide, inject, h } from 'vue'
import { Modal, ConfigProvider } from 'ant-design-vue'

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
    },
    configProvider: [Object]
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
    const modal = h(Modal, this.modalState, this.modalSlots)
    return this.configProvider ? h(ConfigProvider, {
      locale: this.configProvider.locale,
    }, {
      default: () => modal
    }) : modal
  }
})

export const useModal = (defaultOptions) => {
  const instance = getCurrentInstance()
  const configProvider = inject('configProvider', null)
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
          maskClosable: false,
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
        },
        configProvider
      })
      modalVNode.appContext = instance.appContext
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