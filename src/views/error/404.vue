<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-code">404</div>
      <div class="error-title">页面未找到</div>
      <div class="error-desc">抱歉，您访问的页面不存在或已被移除</div>
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
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--el-bg-color);

  .error-content {
    text-align: center;
    padding: 40px;

    .error-code {
      font-size: 120px;
      font-weight: bold;
      color: var(--el-color-primary);
      line-height: 1.2;
      opacity: 0.8;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }

    .error-title {
      font-size: 24px;
      color: var(--el-text-color-primary);
      margin: 20px 0 10px;
      font-weight: 500;
    }

    .error-desc {
      font-size: 14px;
      color: var(--el-text-color-secondary);
      margin-bottom: 30px;
    }

    .error-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
    }
  }
}
</style>
