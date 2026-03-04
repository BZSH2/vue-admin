<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core'

const { isFullscreen, toggle } = useFullscreen()
</script>

<template>
  <ElTooltip :content="isFullscreen ? $t('还原') : $t('全屏')">
    <div class="hover-bg-color h-full flex cursor-pointer items-center" @click="toggle">
      <Icon :name="isFullscreen ? 'screen_full' : 'screen'" :size="16" class="p-x-10px" />
    </div>
  </ElTooltip>
</template>
