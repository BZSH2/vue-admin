<script lang="ts" setup>
import type { ThemeFontSizeLevel, ThemeFontSizeOption } from '@/shared/theme/font-size.js'

const props = defineProps<{
  fontSizeLevel: ThemeFontSizeLevel
  fontSizeOptions: readonly ThemeFontSizeOption[]
}>()

const emit = defineEmits<{
  change: [level: ThemeFontSizeLevel]
}>()

function onFontSizeChange(level: ThemeFontSizeLevel) {
  emit('change', level)
}
</script>

<template>
  <div class="theme-row">
    <div class="theme-title">全局文字大小</div>
    <div class="font-size-grid">
      <button
        v-for="option in props.fontSizeOptions"
        :key="option.value"
        type="button"
        class="font-size-card"
        :class="{ active: option.value === props.fontSizeLevel }"
        @click="onFontSizeChange(option.value)"
      >
        <span class="font-size-card__label">{{ option.label }}</span>
        <span class="font-size-card__desc">{{ option.description }}</span>
        <span class="font-size-card__sample" :data-size="option.value">Aa 预览文本</span>
      </button>
    </div>
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

.font-size-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  gap: 10px;
}

.font-size-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  min-width: 0;
  padding: 12px;
  color: var(--el-text-color-primary);
  cursor: pointer;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--va-radius-md);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.font-size-card:hover {
  border-color: var(--el-color-primary-light-5);
  transform: translateY(-1px);
}

.font-size-card.active {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--el-color-primary) 30%, transparent);
}

.font-size-card__label {
  font-size: var(--va-font-size-sm);
  font-weight: 600;
}

.font-size-card__desc {
  font-size: var(--va-font-size-xs);
  line-height: 1.6;
  color: var(--el-text-color-regular);
  text-align: left;
}

.font-size-card__sample {
  line-height: 1.4;
  color: var(--el-text-color-primary);
}

.font-size-card__sample[data-size='small'] {
  font-size: var(--el-font-size-small);
}

.font-size-card__sample[data-size='default'] {
  font-size: var(--va-font-size-sm);
}

.font-size-card__sample[data-size='large'] {
  font-size: var(--va-font-size-md);
}

@media (width <= 640px) {
  .font-size-grid {
    grid-template-columns: 1fr;
  }
}
</style>
