<script setup lang="ts">
interface Props {
  /** 图标名称 */
  name: string
  /** 类名  */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
})

const iconName = computed(() => `#icon-${props.name}`)
</script>

<template>
  <svg class="svg-icon" :class="[`icon-${name}`, className]" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<style scoped lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  overflow: hidden;
  vertical-align: -0.15em;
  fill: currentcolor;
}

.svg-external-icon {
  display: inline-block;
  background-color: currentcolor;
  mask-size: cover !important;
}
</style>
