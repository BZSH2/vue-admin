<script lang="ts" setup>
import * as echarts from 'echarts'
import ChartTitle from './ChartTitle.vue'
import { debounce } from 'lodash-es'

const props = withDefaults(defineProps<ChartProps>(), {
  className: '',
  width: '100%',
  height: '400px',
})

interface ChartProps {
  /** 图表容器类名 */
  className?: string
  /** 图表宽度 */
  width?: string | number
  /** 图表高度 */
  height?: string | number
  /** 图表标题 */
  title?: string
  /** 图表配置项 */
  options?: Record<string, any>
}

/** 图表容器 DOM 引用 */
const chartRef = ref<HTMLDivElement | null>(null)
/** ECharts 实例（使用 shallowRef 避免深层响应式代理干扰 ECharts 内部状态） */
const chartInstance = shallowRef<echarts.ECharts | null>(null)
/** 容器尺寸变化观察器 */
let resizeObserver: ResizeObserver | null = null
/** 侧边栏元素引用，用于监听折叠动画 */
let sidebarElm: Element | null = null

/** 创建 ECharts 实例并挂载到容器 */
function createChartInstance() {
  if (!chartRef.value) {
    return null
  }
  const instance = echarts.init(chartRef.value)
  chartInstance.value = instance
  return instance
}

/** 销毁当前 ECharts 实例，释放资源 */
function destroyChartInstance() {
  const instance = chartInstance.value
  if (instance) {
    instance.dispose()
    chartInstance.value = null
  }
}

/** 初始化图表 */
function initChart(options: Record<string, any>) {
  if (!chartRef.value) {
    return
  }

  destroyChartInstance()
  const instance = createChartInstance()
  if (instance) {
    instance.setOption(options || {})
  }
  initResizeObserver()
  addCollapseEvent()
}

/** 刷新图表（销毁重建，确保坐标系完全重置） */
function refreshChart(options: Record<string, any>) {
  if (!chartRef.value) {
    return
  }

  destroyChartInstance()
  const instance = createChartInstance()
  if (instance) {
    instance.setOption(options || {})
  }
}

/** 防抖 resize，避免频繁触发导致性能问题 */
const resizeChart = debounce(() => {
  if (chartInstance.value && chartRef.value) {
    try {
      chartInstance.value.resize()
    } catch {
      console.warn('ECharts resize error ignored')
    }
  }
}, 500)

/** 监听容器尺寸变化，自动调整图表大小 */
function initResizeObserver() {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  resizeObserver = new ResizeObserver(() => {
    resizeChart()
  })
  resizeObserver.observe(chartRef.value as Element)
}

/** 监听侧边栏折叠动画结束，重新适配图表尺寸 */
function addCollapseEvent() {
  sidebarElm = document.querySelector('.aside-box')
  sidebarElm?.addEventListener('transitionend', resizeChart)
}

/** 移除侧边栏折叠监听 */
function removeCollapseEvent() {
  sidebarElm?.removeEventListener('transitionend', resizeChart)
}

onMounted(() => {
  if (props.options) {
    initChart(props.options)
  }
})

onUnmounted(() => {
  destroyChartInstance()
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  removeCollapseEvent()
})

defineExpose({
  initChart,
  refreshChart,
})
</script>

<template>
  <div class="custom-chart" :class="className">
    <ChartTitle v-if="title" :title="title" />
    <div ref="chartRef" class="chart-box" :class="className" :style="{ height, width }" />
  </div>
</template>

<style lang="scss" scoped>
.custom-chart {
  background-color: #fff;
  border-radius: var(--va-radius-md);

  .chart-box {
    overflow: hidden;
  }
}
</style>
