<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = withDefaults(
  defineProps<{
    code: string
    title: string
    description: string
    accent?: string
  }>(),
  {
    accent: 'var(--el-color-primary)',
  }
)

const router = useRouter()

function goHome() {
  router.push('/')
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="error-container va-fullscreen-page">
    <div class="error-content">
      <div class="error-code" :style="{ color: props.accent }">{{ props.code }}</div>
      <div class="error-title">{{ props.title }}</div>
      <div class="error-desc">{{ props.description }}</div>
      <div class="error-actions">
        <ElButton type="primary" size="large" @click="goHome">返回首页</ElButton>
        <ElButton size="large" @click="goBack">返回上一页</ElButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-bg-color);
}

.error-content {
  width: min(100%, 480px);
  padding: clamp(24px, 5vw, 40px);
  text-align: center;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 20px;
  box-shadow: 0 16px 40px rgb(15, 23, 42, 0.08);
}

.error-code {
  font-size: clamp(84px, 18vw, 120px);
  font-weight: 700;
  line-height: 1;
  text-shadow: 2px 2px 4px rgb(0, 0, 0, 0.08);
  opacity: 0.9;
}

.error-title {
  margin: 20px 0 10px;
  font-size: clamp(22px, 5vw, 24px);
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.error-desc {
  margin-bottom: 30px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--el-text-color-secondary);
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.error-actions :deep(.el-button + .el-button) {
  margin-left: 0;
}

@media (width <= 640px) {
  .error-actions {
    flex-direction: column;
  }

  .error-actions :deep(.el-button) {
    width: 100%;
  }
}
</style>
