<script lang="ts" setup>
const props = defineProps<{
  primaryColor: string
  presetThemeColors: string[]
}>()

const emit = defineEmits<{
  change: [color: string]
}>()

function onPickerChange(color: string | null) {
  if (color) {
    emit('change', color)
  }
}
</script>

<template>
  <div class="theme-row">
    <div class="theme-title">主题色</div>
    <ElColorPicker
      :model-value="props.primaryColor"
      :predefine="props.presetThemeColors"
      @change="onPickerChange"
    />

    <div class="preset-colors">
      <button
        v-for="color in props.presetThemeColors"
        :key="color"
        type="button"
        class="color-dot"
        :class="{ active: color === props.primaryColor }"
        :style="{ backgroundColor: color }"
        @click="emit('change', color)"
      />
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

.preset-colors {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(28px, 1fr));
  gap: 10px;
  justify-items: center;
}

.color-dot {
  width: 28px;
  height: 28px;
  padding: 0;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.color-dot.active {
  box-shadow: 0 0 0 2px var(--el-color-primary-light-7);
  transform: scale(1.05);
}
</style>
