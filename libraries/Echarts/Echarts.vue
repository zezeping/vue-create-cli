<template>
  <div ref="chartRef" class="echarts"></div>
</template>

<script>
import { defineComponent, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as Echarts from 'echarts'
// 支持水波纹：npm install echarts-liquidfill -S
// import 'echarts-liquidfill'
// 支持gl: npm install echarts-gl
// import 'echarts-gl'
export default defineComponent({
  props: {
    options: {
      type: [Object]
    },
    loadingOptions: {
      type: Object,
      default: () => ({text: 'Loading...'})
    }
  },
  emits: ['click'],
  setup(props, _ctx) {
    const chartRef = ref(null)
    let chartInstance = null

    const handleResizeWindow = () => {
      chartInstance.resize()
    }

    const setOptions = () => {
      if (props.options) {
        chartInstance.hideLoading()
        chartInstance.clear()
        chartInstance.setOption(props.options)
      }
    }

    onMounted(() => {
      chartInstance = Echarts.init(chartRef.value)
      chartInstance.showLoading(props.loadingOptions)
      chartInstance.on('click', (params) => {
        console.log('click chart', params)
        this.$emit('click', params)
      })
      watch(() => props.options, () => {
        setOptions()
      }, { immediate: true })
      window.addEventListener('resize', handleResizeWindow)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResizeWindow)
      chartInstance.dispose()
    })

    return {
      chartRef
    }
  }
})
</script>

<style lang="scss" scoped>
.echarts {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 50px;
  min-height: 50px;
}
</style>