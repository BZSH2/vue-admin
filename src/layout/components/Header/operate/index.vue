<script lang="ts" setup>
import I18n from './I18n.vue'
import Screen from './Screen.vue'
import Settings from './Settings.vue'

defineProps<{
  isMobile: boolean
}>()
</script>

<template>
  <div class="operate h-full flex items-center">
    <Screen v-if="!isMobile" />
    <I18n />
    <Settings />
  </div>
</template>
