<script lang="ts" setup>
import CustomChart from './CustomChart.vue'

const props = defineProps<{
  active: number
}>()

const chartRef = ref<InstanceType<typeof CustomChart> | null>(null)
const lineChartData = [
  {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145],
  },
  {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130],
  },
  {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130],
  },
  {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130],
  },
]

watch(
  () => props.active,
  () => {
    chartRef.value?.refreshChart(getOptions())
  }
)

function initChart() {
  chartRef.value?.initChart(getOptions())
}

function getOptions() {
  return {
    xAxis: {
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      boundaryGap: false,
      axisTick: {
        show: false,
      },
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 20,
      top: 50,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      padding: [5, 10],
    },
    yAxis: {
      axisTick: {
        show: false,
      },
    },
    legend: {
      data: ['expected', 'actual'],
      top: 10,
    },
    series: [
      {
        name: 'expected',
        itemStyle: {
          color: '#FF005A',
        },
        lineStyle: {
          color: '#FF005A',
          width: 2,
        },
        smooth: true,
        type: 'line',
        data: lineChartData[props.active]?.expectedData,
        animationDuration: 2800,
        animationEasing: 'cubicInOut',
      },
      {
        name: 'actual',
        smooth: true,
        type: 'line',
        itemStyle: {
          color: '#3888fa',
        },
        lineStyle: {
          color: '#3888fa',
          width: 2,
        },
        areaStyle: {
          color: '#f3f8ff',
        },
        data: lineChartData[props.active]?.actualData,
        animationDuration: 2800,
        animationEasing: 'quadraticOut',
      },
    ],
  }
}

onMounted(() => {
  initChart()
})
</script>

<template>
  <CustomChart :title="$t('折线图')" ref="chartRef" class="mx-[12px]" />
</template>
