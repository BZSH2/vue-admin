<script lang="ts" setup>
const props = defineProps<{
  isDark: boolean
}>()

const emit = defineEmits<{
  toggle: []
  reset: []
}>()
</script>

<template>
  <div class="theme-row">
    <div class="theme-title">一键换肤</div>
    <div class="actions">
      <ElButton type="primary" plain @click="emit('toggle')">
        {{ props.isDark ? '切换到浅色' : '切换到深色' }}
      </ElButton>
      <ElButton plain @click="emit('reset')">恢复默认</ElButton>
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

.actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
