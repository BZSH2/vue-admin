<script lang="ts" setup>
import type { ResolvedTheme, ThemeMode } from '@/types/theme'

defineProps<{
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
      <ElRadioButton label="浅色" value="light" :span="8" />
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
  font-size: var(--va-font-size-sm);
  font-weight: 600;
  color: var(--el-text-color-primary);
}

:deep(.el-radio-group) {
  display: flex;

  .el-radio-button {
    flex: 1;
  }
}

:deep(.el-radio-button__inner) {
  width: 100%;
}
</style>
