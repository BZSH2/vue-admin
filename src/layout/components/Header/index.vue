<script setup lang="ts">
import Avatar from './Avatar.vue'
import Operate from './operate/index.vue'

const props = defineProps<{
  isMobile: boolean
}>()
const emit = defineEmits<{
  'toggle-menu': []
}>()

const route = useRoute()
const breadcrumbs = computed(() =>
  route.matched
    .filter((r) => r.meta?.title)
    .map((r) => ({ title: r.meta.title as string, path: r.path }))
)
</script>

<template>
  <div
    v-if="props.isMobile"
    class="menu-trigger h-full flex cursor-pointer items-center"
    @click="emit('toggle-menu')"
  >
    <Icon name="layout-fold" :size="18" class="p-x-10px" />
  </div>
  <ElBreadcrumb class="breadcrumb" separator="/">
    <ElBreadcrumbItem v-for="(b, i) in breadcrumbs" :key="i">
      <RouterLink :to="b.path">{{ $t(b.title) }}</RouterLink>
    </ElBreadcrumbItem>
  </ElBreadcrumb>
  <div class="spacer" />
  <Operate :is-mobile="props.isMobile" />
  <Avatar />
</template>

<style scoped lang="scss">
.header {
  display: flex;
  gap: 12px;
  align-items: center;
  height: 56px;
}

.breadcrumb {
  @media (width <= 768px) {
    display: none;
  }
}

.spacer {
  flex: 1;
}

.menu-trigger {
  color: var(--el-text-color-primary);
}
</style>
