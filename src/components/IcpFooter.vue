<script setup lang="ts">
import { SITE_META } from '@/config/site'

const { icpText, icpUrl } = SITE_META
</script>

<template>
  <footer class="icp-footer">
    <a :href="icpUrl" target="_blank" rel="noreferrer">{{ icpText }}</a>
  </footer>
</template>

<style scoped lang="scss">
.icp-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px 16px;
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
  color: var(--el-text-color-secondary);
}

.icp-footer a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.icp-footer a:hover {
  color: var(--el-color-primary);
}
</style>
