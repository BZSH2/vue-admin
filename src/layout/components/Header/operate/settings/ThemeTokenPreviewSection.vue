<script lang="ts" setup>
import type { BrandTheme, ThemeSemanticTokens } from '@/composables/useTheme'

defineProps<{
  activeBrand: Readonly<BrandTheme>
  semanticTokens: Readonly<ThemeSemanticTokens>
}>()
</script>

<template>
  <div class="theme-row">
    <div class="theme-title">语义 Token 预览</div>
    <div class="token-grid">
      <div class="token-card" :style="{ backgroundColor: semanticTokens.pageBg }">
        <span>页面底色</span>
      </div>
      <div class="token-card" :style="{ backgroundColor: semanticTokens.cardBg }">
        <span>卡片底色</span>
      </div>
      <div
        class="token-card token-strong"
        :style="{
          backgroundColor: activeBrand.primary,
          color: semanticTokens.onPrimary,
          borderColor: semanticTokens.borderOnPrimary,
        }"
      >
        <span>主按钮对比</span>
      </div>
      <div
        class="token-card token-strong"
        :style="{
          backgroundColor: activeBrand.warning,
          color: semanticTokens.onWarning,
          borderColor: semanticTokens.borderOnWarning,
        }"
      >
        <span>警告对比</span>
      </div>
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
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.token-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.token-card {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-size: 12px;
  color: var(--va-text-primary);
  border: 1px solid var(--va-border-soft);
  border-radius: 8px;
}

.token-strong {
  border-width: 1px;
}

@media (width <= 640px) {
  .token-grid {
    grid-template-columns: 1fr;
  }
}
</style>
