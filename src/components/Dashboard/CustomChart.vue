<script lang="ts" setup>
import * as echarts from 'echarts'
import { debounce } from 'lodash-es'
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

/** 图表容器 DOM 引用 */
const chartRef = ref<HTMLDivElement | null>(null)
/** ECharts 实例（使用 shallowRef 避免深层响应式代理干扰 ECharts 内部状态） */
const chartInstance = shallowRef<echarts.ECharts | null>(null)
/** 容器尺寸变化观察器 */
let resizeObserver: ResizeObserver | null = null
/** 侧边栏元素引用，用于监听折叠动画 */
let sidebarElm: Element | null = null

/** 创建或复用 ECharts 实例 */
function createChartInstance() {
  if (!chartRef.value) {
    return null
  }

  const currentInstance = echarts.getInstanceByDom(chartRef.value)
  if (currentInstance) {
    chartInstance.value = currentInstance
    return currentInstance
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

/** 将配置写入图表实例 */
function applyChartOptions(options: Record<string, any>) {
  const instance = chartInstance.value ?? createChartInstance()
  if (!instance) {
    return
  }

  instance.setOption(options || {}, {
    notMerge: true,
    lazyUpdate: true,
  })
  instance.resize()
}

/** 初始化图表 */
async function initChart(options: Record<string, any>) {
  if (!chartRef.value) {
    return
  }

  await nextTick()
  requestAnimationFrame(() => {
    if (!chartRef.value) {
      return
    }

    applyChartOptions(options)
    initResizeObserver()
    addCollapseEvent()
  })
}

/** 刷新图表（复用实例，避免重新初始化造成闪动） */
function refreshChart(options: Record<string, any>) {
  if (!chartRef.value) {
    return
  }

  applyChartOptions(options)
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
}, 80)

/** 监听容器尺寸变化，自动调整图表大小 */
function initResizeObserver() {
  if (!chartRef.value) {
    return
  }

  if (resizeObserver) {
    resizeObserver.disconnect()
  }

  resizeObserver = new ResizeObserver(() => {
    resizeChart()
  })
  resizeObserver.observe(chartRef.value)
}

function onSidebarTransitionEnd(event: Event) {
  if (!(event instanceof TransitionEvent) || event.propertyName !== 'width') {
    return
  }

  resizeChart()
}

/** 监听侧边栏折叠动画结束，重新适配图表尺寸 */
function addCollapseEvent() {
  removeCollapseEvent()
  sidebarElm = document.querySelector('.aside-box')
  sidebarElm?.addEventListener('transitionend', onSidebarTransitionEnd)
}

/** 移除侧边栏折叠监听 */
function removeCollapseEvent() {
  sidebarElm?.removeEventListener('transitionend', onSidebarTransitionEnd)
  sidebarElm = null
}

onMounted(() => {
  if (props.options) {
    void initChart(props.options)
  }
})

onUnmounted(() => {
  destroyChartInstance()
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  resizeChart.cancel()
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
