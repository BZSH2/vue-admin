<script lang="ts" setup>
interface ChartTitleProps {
  /** 图表标题 */
  title?: string
}

const props = defineProps<ChartTitleProps>()
</script>

<template>
  <div class="chart-title">{{ title }}</div>
</template>

<style lang="scss" scoped>
.chart-title {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  font-size: var(--va-font-size-md);
  font-weight: 700;
  color: var(--va-color-text-1);
  border-bottom: 1px solid #ededed;
}
</style>
