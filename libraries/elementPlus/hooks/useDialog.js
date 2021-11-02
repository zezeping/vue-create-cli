import { createApp, h, reactive, provide, onUnmounted, getCurrentInstance } from 'vue'
import { ElDialog } from 'element-plus'

const createElementPlusDialog = (options) => {
  const { slots = {}, caller, ...otherOptions } = options
  const div = document.createElement('div')
  document.body.appendChild(div)
  
  const dialogInstance = createApp({
    setup (_props, _ctx) {
      if (caller) {
        const compInstance = getCurrentInstance()
        compInstance.appContext = caller.appContext
      }
      
      const dialogState = reactive({
        modelValue: true,
        ...otherOptions,
        'onUpdate:modelValue'(value) {
          dialogState.modelValue = value
          if (typeof options['onUpdate:modelValue'] === 'function') {
            options['onUpdate:modelValue'](...arguments)
          }
        },
        onClosed() {
          if (typeof options.onClosed === 'function') {
            options.onClosed()
          }
          dialogInstance.unmount()
        }
      })
      
      onUnmounted(() => {
        div.parentNode?.removeChild(div)
      })
      
      const dialogSlots = reactive(slots)
      provide('dialogState', dialogState)
      provide('dialogSlots', dialogSlots)
      
      return {
        dialogState,
        dialogSlots,
        close() {
          dialogState.modelValue = false
        }
      }
    },
    render() {
      return h(ElDialog, this.dialogState, this.dialogSlots)
    }
  })
  dialogInstance.mount(div)
  dialogInstance.close = () => {
    dialogInstance._instance.ctx.close()
  }
  return dialogInstance
}

/* usage */
//import { createVNode } from 'vue'
//const instance = useDialog({
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

export const useDialog = (options) => {
  return createElementPlusDialog(options)
}