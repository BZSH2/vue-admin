<script lang="ts" setup>
import * as echarts from 'echarts'
import ChartTitle from './ChartTitle.vue'

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

/** 图表容器 */
const chartRef = ref<HTMLDivElement | null>(null)
/** 图表实例 */
const chartInstance = ref<echarts.ECharts | null>(null)
/** ResizeObserver 实例 */
let resizeObserver: ResizeObserver | null = null
/** 容器 */
let sidebarElm: Element | null = null

/** 初始化图表 */
function initChart(options: Record<string, any>) {
  if (!chartRef.value) {
    return
  }

  if (!chartInstance.value) {
    chartInstance.value = echarts.init(chartRef.value)
    chartInstance.value.setOption(options || {})
  }

  initResizeObserver()
  addCollapseEvent()
}

/** 刷新图表 */
function refreshChart(options: Record<string, any>) {
  if (chartInstance.value) {
    chartInstance.value.setOption(options || {})
  }
}

function initResizeObserver() {
  resizeObserver = new ResizeObserver(() => {
    resizeChart()
  })

  resizeObserver.observe(chartRef.value as Element)
}

function resizeChart() {
  if (chartInstance.value) {
    chartInstance.value.resize()
  }
}

function addCollapseEvent() {
  sidebarElm = document.querySelector('.aside-box')
  sidebarElm?.addEventListener('transitionend', resizeChart)
}

function removeCollapseEvent() {
  sidebarElm?.removeEventListener('transitionend', resizeChart)
}

onMounted(() => {
  if (props.options) {
    initChart(props.options)
  }
})

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose()
    chartInstance.value = null
    removeCollapseEvent()
  }
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
