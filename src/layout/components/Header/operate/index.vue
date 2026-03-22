<script lang="ts" setup>
import I18n from './I18n.vue'
import Screen from './Screen.vue'
import Settings from './Settings.vue'

defineProps<{
  isMobile: boolean
}>()
</script>

<template>
  <div class="operate">
    <Screen v-if="!isMobile" />
    <I18n />
    <Settings :is-mobile="isMobile" />
  </div>
</template>

<style scoped lang="scss">
.operate {
  display: flex;
  flex-shrink: 0;
  align-items: center;
}
</style>
