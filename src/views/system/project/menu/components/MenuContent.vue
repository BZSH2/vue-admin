<script setup lang="ts">
const props = defineProps<{
  code: string
}>()
</script>

<template>
  <div class="menu-content">{{ code }}</div>
</template>

<style scoped lang="scss">
.menu-content {
  flex: 1;
  height: 100%;
  margin-left: 12px;
  background: #fff;
  border-radius: var(--va-radius-md);
}
</style>
