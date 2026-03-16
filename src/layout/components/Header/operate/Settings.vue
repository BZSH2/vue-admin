<script lang="ts" setup>
import { useTheme, type ThemeMode } from '@/composables/useTheme'
import ThemeActionsSection from './settings/ThemeActionsSection.vue'
import ThemeColorSection from './settings/ThemeColorSection.vue'
import ThemeModeSection from './settings/ThemeModeSection.vue'
import ThemeTokenPreviewSection from './settings/ThemeTokenPreviewSection.vue'

const showDrawer = ref(false)
const {
  themeMode,
  isDark,
  resolvedTheme,
  activeBrand,
  primaryColor,
  semanticTokens,
  presetThemeColors,
  setThemeMode,
  setPrimaryColor,
  toggleTheme,
  resetTheme,
} = useTheme()

function onModeChange(mode: string | number | boolean) {
  setThemeMode(mode as ThemeMode)
}
</script>

<template>
  <ElTooltip :content="$t('设置')">
    <div class="hover-bg-color h-full flex cursor-pointer items-center" @click="showDrawer = true">
      <Icon name="setting" :size="16" class="p-x-10px" />
    </div>
  </ElTooltip>
  <ElDrawer v-model="showDrawer" title="外观设置" size="360px">
    <div class="theme-settings">
      <ThemeModeSection
        :theme-mode="themeMode"
        :resolved-theme="resolvedTheme"
        @change="onModeChange"
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
}
</style>
