<script lang="ts" setup>
import logo from '@/assets/logo.png'

defineProps({
  collapsed: {
    type: Boolean,
    default: () => false,
  },
})
</script>

<template>
  <div class="logo">
    <span v-if="collapsed">
      <ElImage :src="logo" style="width: 28px" />
    </span>
    <span v-else>Vue Admin</span>
  </div>
</template>

<style scoped lang="scss">
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  border-bottom: 1px solid var(--el-border-color-lighter);
}
</style>
