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
      <div class="error-code">403</div>
      <div class="error-title">访问受限</div>
      <div class="error-desc">抱歉，您没有权限访问该页面</div>
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
  height: 100vh;
  background-color: var(--el-bg-color);

  .error-content {
    padding: 40px;
    text-align: center;

    .error-code {
      font-size: 120px;
      font-weight: bold;
      line-height: 1.2;
      color: var(--el-color-warning);
      text-shadow: 2px 2px 4px rgb(0, 0, 0, 0.1);
      opacity: 0.8;
    }

    .error-title {
      margin: 20px 0 10px;
      font-size: 24px;
      font-weight: 500;
      color: var(--el-text-color-primary);
    }

    .error-desc {
      margin-bottom: 30px;
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }

    .error-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
    }
  }
}
</style>
