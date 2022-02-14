<template>
  <slot v-bind="{showConfirmModal}"></slot>
</template>

<script lang='jsx'>
import { reactive, toRefs, defineComponent, createVNode, markRaw, inject } from 'vue'
import { useModal } from '@/utils/hooks/useModal'
import { useLoading } from '@/utils/hooks/useLoading'

export default defineComponent({
  inheritAttrs: false,
  props: {
    config: {
      type: Object,
      default: () => ({
        type: 'warning',
        //title: '',
        message: '确认执行?',
        //okText: '确定',
        //cancelText: '取消',
        //icon: true,
      })
    }
  },
  //emits: ['confirm', 'cancel'],
  setup (props, ctx) {
    const modal = useModal()
    const state = reactive({
      confirmLoading: useLoading(),
      showConfirmModal(config, modalConfig) {
        const { type, title, message, okText = '确定', cancelText = '取消', icon = true } = {...props.config, ...config}
        modal.create({
          width: '400px',
          footer: false,
          closable: false,
          maskClosable: true,
          ...modalConfig,
          slots: {
            title: () => modalConfig?.title ? modalConfig.title : (title ? title : null),
            default: () => createVNode(defineComponent({
              render() {
                const modalState = inject('modalState', null)
                const onSubmit = () => {
                  if (typeof ctx.attrs.onConfirm === 'function') {
                    state.confirmLoading.load(async () => {
                      await ctx.attrs.onConfirm()
                      modalState?.close()
                    })
                  } else {
                    modalState?.close()
                  }
                }
                const onClose = () => {
                  modalState?.close()
                  this.$emit('cancel')
                }
                const config = {
                  _is: 'div',
                  _children: [
                    {
                      _is: 'div',
                      _children: [
                        {
                          _is: `div`,
                          class: 'message',
                          _children: [
                            {
                              vIf: type,
                              class: `svg-icon ${ type }`,
                              _render: () => {
                                let svgIcon = icon
                                if (icon && typeof icon === 'boolean') {
                                  svgIcon = type === 'info' ?
                                      <i-svg-info-circle class="svg-icon" style="margin: 3px 5px;"></i-svg-info-circle>
                                      :
                                      <i-svg-warning-circle class="svg-icon" style="margin: 3px 5px;"></i-svg-warning-circle>
                                }
                                return svgIcon
                              }
                            }, {
                              _is: 'span',
                              vIf: message,
                              _render: () => <span>{ message }</span>,
                            },
                          ],
                        }, {
                          _render: () => <div style="text-align: right; margin-top: 15px;">
                            <a-space>
                              <a-button size="small" onClick={onClose}>{cancelText}</a-button>
                              <a-button type="primary" danger={ type === 'danger' } size="small" onClick={onSubmit} loading={ state.confirmLoading.value }>{okText}</a-button>
                            </a-space>
                          </div>,
                        },
                      ],
                    },
                  ],
                }
                return <ui-define config={config}></ui-define>
              }
            }))
          }
        })
      }
    })
    return { ...toRefs(state) }
  },
})
</script>

<style lang="scss" scoped>
</style>