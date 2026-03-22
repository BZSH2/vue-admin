<script setup lang="ts">
import ErrorState from './components/ErrorState.vue'
</script>

<template>
  <ErrorState
    code="401"
    title="待审核"
    description="当前账号尚未通过审核，请联系管理员处理。"
    accent="var(--el-color-info)"
  />
</template>
