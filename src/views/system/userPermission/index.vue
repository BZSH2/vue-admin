<script setup lang="ts">
import PageContainer from '@/components/PageContainer.vue'
</script>

<template>
  <PageContainer>
    <div class="user-permission">
      <div class="user-permission-title">用户权限</div>
      <div class="user-permission-desc">当前页面内容较少，已补统一页边距与小屏阅读宽度。</div>
    </div>
  </PageContainer>
</template>

<style scoped lang="scss">
.user-permission {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-permission-title {
  font-size: clamp(24px, 5vw, 32px);
  font-weight: 600;
  line-height: 1.2;
  color: var(--el-text-color-primary);
}

.user-permission-desc {
  max-width: 680px;
  line-height: 1.7;
  color: var(--el-text-color-regular);
}
</style>
