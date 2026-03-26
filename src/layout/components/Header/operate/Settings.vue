<script lang="ts" setup>
import { computed } from 'vue'
import { useTheme, type ThemeFontSizeLevel, type ThemeMode } from '@/composables/useTheme'
import ThemeActionsSection from './settings/ThemeActionsSection.vue'
import ThemeColorSection from './settings/ThemeColorSection.vue'
import ThemeFontSizeSection from './settings/ThemeFontSizeSection.vue'
import ThemeModeSection from './settings/ThemeModeSection.vue'
import ThemeTokenPreviewSection from './settings/ThemeTokenPreviewSection.vue'

const props = defineProps<{
  isMobile: boolean
}>()

const showDrawer = ref(false)
const drawerSize = computed(() => (props.isMobile ? '100%' : '360px'))
const {
  themeMode,
  isDark,
  resolvedTheme,
  activeBrand,
  primaryColor,
  fontSizeLevel,
  semanticTokens,
  presetThemeColors,
  fontSizeOptions,
  setThemeMode,
  setPrimaryColor,
  setFontSizeLevel,
  toggleTheme,
  resetTheme,
} = useTheme()

function onModeChange(mode: string | number | boolean) {
  setThemeMode(mode as ThemeMode)
}

function onFontSizeLevelChange(level: string | number | boolean) {
  setFontSizeLevel(level as ThemeFontSizeLevel)
}
</script>

<template>
  <ElTooltip :content="$t('设置')" :disabled="props.isMobile">
    <div class="va-header-action settings-trigger" @click="showDrawer = true">
      <Icon name="layout-setting" :size="16" />
    </div>
  </ElTooltip>
  <ElDrawer v-model="showDrawer" class="theme-settings-drawer" title="外观设置" :size="drawerSize">
    <div class="theme-settings">
      <ThemeModeSection
        :theme-mode="themeMode"
        :resolved-theme="resolvedTheme"
        @change="onModeChange"
      />
      <ThemeFontSizeSection
        :font-size-level="fontSizeLevel"
        :font-size-options="fontSizeOptions"
        @change="onFontSizeLevelChange"
      />
      <ThemeActionsSection :is-dark="isDark" @toggle="toggleTheme" @reset="resetTheme" />
      <ThemeColorSection
        :primary-color="primaryColor"
        :preset-theme-colors="presetThemeColors"
        @change="setPrimaryColor"
      />
      <ThemeTokenPreviewSection :active-brand="activeBrand" :semantic-tokens="semanticTokens" />
    </div>
  </ElDrawer>
</template>

<style lang="scss" scoped>
.theme-settings {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-bottom: max(8px, env(safe-area-inset-bottom));
}

:deep(.theme-settings-drawer .el-drawer__header) {
  padding: 20px 16px 12px;
  margin-bottom: 0;
}

:deep(.theme-settings-drawer .el-drawer__body) {
  padding: 0 16px 20px;
  overflow-y: auto;
}

@media (width <= 768px) {
  :deep(.theme-settings-drawer .el-drawer__header) {
    padding-top: max(16px, env(safe-area-inset-top));
  }
}

@media (width <= 420px) {
  .settings-trigger {
    margin-right: 1px;
  }
}
</style>
