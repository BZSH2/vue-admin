<script setup lang="ts">
import ErrorState from './components/ErrorState.vue'
</script>

<template>
  <ErrorState
    code="403"
    title="访问受限"
    description="抱歉，您没有权限访问该页面"
    accent="var(--el-color-warning)"
  />
</template>
