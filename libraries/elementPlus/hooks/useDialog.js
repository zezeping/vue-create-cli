import { getCurrentInstance, createVNode, defineComponent, reactive, ref, provide, h } from 'vue'
import { ElDialog } from 'element-plus'

const ModalComponent = defineComponent({
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { slots = {}, ...otherOptions } = props.options
    const dialogState = reactive({
      ...otherOptions,
      'onUpdate:modelValue'(value) {
        dialogState.modelValue = value
        if (typeof otherOptions['onUpdate:modelValue'] === 'function') {
          otherOptions['onUpdate:modelValue'](...arguments)
        }
      },
    })
    const dialogSlots = reactive(slots)
    provide('modalState', dialogState)
    provide('modalSlots', dialogSlots)
    
    return {
      dialogState,
      dialogSlots,
      close() {
        dialogState.visible = false
      }
    }
  },
  render() {
    return h(ElDialog, this.dialogState, this.dialogSlots)
  }
})

/* usage */
//import { createVNode } from 'vue'
// const dialog = useDialog()
//const instance = dialog.create({
//  title: '新建仓库',
//  slots: {
//    default: () => createVNode(New, {
//      onCancel: () => {
//        //instance.unmount() // 直接移除
//        instance.close() // 弹出框完全关闭后移除
//      }
//    })
//  }
//})

export const useDialog = (options) => {
  const instance = getCurrentInstance()
  console.assert(!instance, 'getCurrentInstance无法获取到实例，请检查')
  const app = instance.appContext.app
  
  return {
    create (options) {
      const div = document.createElement('div')
      div.setAttribute('class', 'ant-modal-container')
      document.body.appendChild(div)
      
      const modelValue = ref(true)
  
      const modalVNode = createVNode(ModalComponent, {
        options: {
          getContainer: div,
          ...options,
          modelValue,
          onClosed() {
            app.render(null, div)
            div.parentNode.removeChild(div)
            if (typeof options.onClosed === 'function') {
              options.onClosed()
            }
          }
        }
      })
      app.render(modalVNode, div)
      
      return {
        close () {
          modelValue.value = false
          // modalVNode.component.setupState.close()
        }
      }
    }
  }
}