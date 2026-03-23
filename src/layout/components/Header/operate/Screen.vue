<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core'

const { isFullscreen, toggle } = useFullscreen()
</script>

<template>
  <ElTooltip :content="isFullscreen ? $t('还原') : $t('全屏')">
    <div class="va-header-action" @click="toggle">
      <Icon :name="isFullscreen ? 'layout-screen_full' : 'layout-screen'" :size="16" />
    </div>
  </ElTooltip>
</template>
