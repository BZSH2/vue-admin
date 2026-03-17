<script lang="ts" setup>
import type { ResolvedTheme, ThemeMode } from '@/composables/useTheme'

const props = defineProps<{
  themeMode: ThemeMode
  resolvedTheme: ResolvedTheme
}>()

const emit = defineEmits<{
  change: [mode: ThemeMode]
}>()

function onModeChange(mode: string | number | boolean | undefined) {
  if (mode === undefined) {
    return
  }
  emit('change', mode as ThemeMode)
}
</script>

<template>
  <div class="theme-row">
    <div class="theme-title">主题模式</div>
    <ElRadioGroup :model-value="themeMode" @change="onModeChange">
      <ElRadioButton label="浅色" value="light" />
      <ElRadioButton label="深色" value="dark" />
      <ElRadioButton label="跟随系统" value="system" />
    </ElRadioGroup>
  </div>
</template>

<style lang="scss" scoped>
.theme-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.theme-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
</style>
