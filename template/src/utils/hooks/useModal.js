import { h, reactive, defineComponent, createApp, createVNode } from 'vue'
import { Modal } from 'ant-design-vue'
import Hello from '../../views/Hello'

const createAntDesignModal = (options) => {
  const { slots, ...otherOptions } = options
  let instance = null
  const div = document.createElement('div')
  document.body.appendChild(div)
  const ModalComponent = defineComponent({
    setup() {
      const modalOptions = reactive({
        visible: true,
        'onUpdate:visible': value => {
          if (!value) {
            instance.unmount()
            div.parentNode.removeChild(div)
          }
        },
        ...otherOptions
      })
      const modalSlots = reactive({...slots})
      return {
        modalOptions,
        modalSlots
      }
    },
    render() {
      return h(Modal, this.modalOptions, this.modalSlots)
    }
  })
  instance = createApp(ModalComponent)
  instance.mount(div)
  return instance
}

/* usage
 //import { useModal } from '@/utils/hooks/useModal'
 //const instance = useModal({
 //  slots: {
 //    default: () => createVNode(Hello)
 //  }
 //})
 */
export const useModal = (options) => {
  createAntDesignModal(options)
}