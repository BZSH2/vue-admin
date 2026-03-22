<script lang="ts" setup>
import I18n from './I18n.vue'
import Screen from './Screen.vue'
import Settings from './Settings.vue'

defineProps<{
  isMobile: boolean
  compact: boolean
}>()
</script>

<template>
  <div class="operate" :class="{ compact }">
    <Screen v-if="!isMobile" />
    <I18n v-if="!compact" />
    <Settings :is-mobile="isMobile" />
  </div>
</template>

<style scoped lang="scss">
.operate {
  display: flex;
  flex-shrink: 0;
  align-items: center;
}

.operate.compact {
  margin-right: 2px;
}
</style>
