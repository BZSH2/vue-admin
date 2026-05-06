<script setup lang="ts">
import { requestAnimationFrame, cancelAnimationFrame } from './requestAnimationFrame'

interface CountToProps {
  /** 起始值 */
  startVal?: number
  /** 结束值 */
  endVal?: number
  /** 动画持续时间（毫秒） */
  duration?: number
  /** 是否自动播放 */
  autoplay?: boolean
  /** 保留小数位数 */
  decimals?: number
  /** 小数点符号 */
  decimal?: string
  /** 千分位分隔符 */
  separator?: string
  /** 数字前缀 */
  prefix?: string
  /** 数字后缀 */
  suffix?: string
  /** 是否启用缓动效果 */
  useEasing?: boolean
  /** 自定义缓动函数 */
  easingFn?: (t: number, b: number, c: number, d: number) => number
}

const props = withDefaults(defineProps<CountToProps>(), {
  startVal: 0,
  endVal: 2017,
  duration: 3000,
  autoplay: true,
  decimals: 0,
  decimal: '.',
  separator: ',',
  prefix: '',
  suffix: '',
  useEasing: true,
  easingFn: (t: number, b: number, c: number, d: number) =>
    (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b,
})

const emit = defineEmits<{
  /** 动画完成回调 */
  'callback': []
  /** 组件挂载完成回调 */
  'mounted-callback': []
}>()

/** 内部起始值（支持暂停恢复） */
const localStartVal = ref(props.startVal)
/** 格式化后的显示文本 */
const displayValue = ref(formatNumber(props.startVal))
/** 当前未格式化的原始数值 */
const printVal = ref<number | null>(null)
/** 是否处于暂停状态 */
const paused = ref(false)
/** 内部动画时长（暂停恢复后截取剩余时长） */
const localDuration = ref(props.duration)
/** 动画起始时间戳 */
const startTime = ref<number | null>(null)
/** 动画剩余时长 */
const remaining = ref<number | null>(null)
/** requestAnimationFrame 句柄 */
const rAF = ref<number | null>(null)

/** 是否为倒计时（起始值 > 结束值） */
const countDown = computed(() => props.startVal > props.endVal)

/**
 * 格式化数字
 * - 支持千分位分隔符（如：1,234,567）
 * - 支持自定义小数点符号
 * - 支持前后缀
 */
function formatNumber(num: number): string {
  num = Number(num.toFixed(props.decimals))
  const parts = String(num).split('.')
  let intPart = parts[0] ?? ''
  const decPart = parts.length > 1 ? `${props.decimal}${parts[1] ?? ''}` : ''

  const rgx = /(\d+)(\d{3})/
  if (props.separator && isNaN(Number(props.separator))) {
    while (rgx.test(intPart)) {
      intPart = intPart.replace(rgx, `$1${props.separator}$2`)
    }
  }

  return `${props.prefix}${intPart}${decPart}${props.suffix}`
}

/** 启动动画 */
function start() {
  localStartVal.value = props.startVal
  startTime.value = null
  localDuration.value = props.duration
  paused.value = false
  rAF.value = requestAnimationFrame(count) as number
}

/** 暂停动画 */
function pause() {
  if (rAF.value !== null) {
    cancelAnimationFrame(rAF.value)
  }
}

/** 恢复动画 */
function resume() {
  startTime.value = null
  localDuration.value = Number(remaining.value)
  localStartVal.value = Number(printVal.value)
  requestAnimationFrame(count)
}

/** 切换暂停/恢复 */
function pauseResume() {
  if (paused.value) {
    resume()
    paused.value = false
  } else {
    pause()
    paused.value = true
  }
}

/** 重置到起始值 */
function reset() {
  startTime.value = null
  if (rAF.value !== null) {
    cancelAnimationFrame(rAF.value)
  }
  displayValue.value = formatNumber(props.startVal)
}

/** 动画帧回调（由 requestAnimationFrame 驱动） */
function count(timestamp: number) {
  if (startTime.value === null) {
    startTime.value = timestamp
  }

  const progress = timestamp - startTime.value
  remaining.value = localDuration.value - progress

  let currentVal: number
  if (props.useEasing) {
    if (countDown.value) {
      currentVal =
        localStartVal.value -
        props.easingFn(progress, 0, localStartVal.value - props.endVal, localDuration.value)
    } else {
      currentVal = props.easingFn(
        progress,
        localStartVal.value,
        props.endVal - localStartVal.value,
        localDuration.value
      )
    }
  } else {
    const ratio = progress / localDuration.value
    if (countDown.value) {
      currentVal = localStartVal.value - (localStartVal.value - props.endVal) * ratio
    } else {
      currentVal = localStartVal.value + (props.endVal - localStartVal.value) * ratio
    }
  }

  printVal.value = countDown.value
    ? Math.max(currentVal, props.endVal)
    : Math.min(currentVal, props.endVal)

  displayValue.value = formatNumber(printVal.value)

  if (progress < localDuration.value) {
    rAF.value = requestAnimationFrame(count)
  } else {
    emit('callback')
  }
}

watch(
  () => props.startVal,
  () => {
    if (props.autoplay) {
      start()
    }
  }
)

watch(
  () => props.endVal,
  () => {
    if (props.autoplay) {
      start()
    }
  }
)

onMounted(() => {
  if (props.autoplay) {
    start()
  }
  emit('mounted-callback')
})

onUnmounted(() => {
  if (rAF.value !== null) {
    cancelAnimationFrame(rAF.value)
  }
})

defineExpose({
  start,
  pauseResume,
  pause,
  resume,
  reset,
  displayValue,
})
</script>

<template>
  <span>{{ displayValue }}</span>
</template>
