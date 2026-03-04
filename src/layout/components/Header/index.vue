<script setup lang="ts">
import Avatar from './Avatar.vue'
import Operate from './operate/index.vue'

defineProps<{}>()

const route = useRoute()
const breadcrumbs = computed(() =>
  route.matched
    .filter((r) => r.meta?.title)
    .map((r) => ({ title: r.meta.title as string, path: r.path }))
)
</script>

<template>
  <ElBreadcrumb separator="/">
    <ElBreadcrumbItem v-for="(b, i) in breadcrumbs" :key="i">
      <RouterLink :to="b.path">{{ $t(b.title) }}</RouterLink>
    </ElBreadcrumbItem>
  </ElBreadcrumb>
  <div class="spacer" />
  <Operate />
  <Avatar />
</template>

<style scoped lang="scss">
.header {
  display: flex;
  gap: 12px;
  align-items: center;
  height: 56px;
}

.spacer {
  flex: 1;
}
</style>
