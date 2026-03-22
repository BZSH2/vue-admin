<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Avatar from './Avatar.vue'
import Operate from './operate/index.vue'

const props = defineProps<{
  compact: boolean
  isMobile: boolean
  isNarrowMobile: boolean
}>()

const emit = defineEmits<{
  'toggle-sidebar': []
}>()

const route = useRoute()
const routeTrail = computed(() =>
  route.matched
    .filter((item) => item.meta?.title && item.meta?.breadcrumbHidden !== true)
    .map((item) => ({ title: item.meta.title as string, path: item.path }))
)

const currentTitle = computed(() => {
  const lastRoute = routeTrail.value[routeTrail.value.length - 1]
  return lastRoute?.title || (route.meta.title as string) || '首页'
})
</script>

<template>
  <div class="header-left">
    <button
      v-if="props.isMobile"
      type="button"
      class="nav-trigger"
      aria-label="打开菜单"
      @click="emit('toggle-sidebar')"
    >
      <Icon name="layout-fold" :size="18" />
    </button>

    <div v-if="props.isMobile" class="page-title" :title="$t(currentTitle)">
      {{ $t(currentTitle) }}
    </div>

    <ElBreadcrumb v-else-if="!props.compact" class="breadcrumb" separator="/">
      <ElBreadcrumbItem v-for="(item, index) in routeTrail" :key="`${item.path}-${index}`">
        <RouterLink :to="item.path">{{ $t(item.title) }}</RouterLink>
      </ElBreadcrumbItem>
    </ElBreadcrumb>

    <div v-else class="page-title" :title="$t(currentTitle)">
      {{ $t(currentTitle) }}
    </div>
  </div>

  <div class="header-right">
    <Operate :is-mobile="props.isMobile" :compact="props.isNarrowMobile" />
    <Avatar />
  </div>
</template>

<style scoped lang="scss">
.header-left {
  display: flex;
  flex: 1;
  gap: 12px;
  align-items: center;
  min-width: 0;
  overflow: hidden;
}

.nav-trigger {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  color: var(--el-text-color-primary);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 12px;
}

.nav-trigger:active {
  background-color: var(--el-fill-color-light);
}

.breadcrumb {
  min-width: 0;
  overflow: hidden;
}

.page-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  white-space: nowrap;
}

.header-right {
  display: flex;
  flex-shrink: 0;
  gap: 4px;
  align-items: center;
  min-width: 0;
}

@media (width <= 768px) {
  .header-left {
    gap: 8px;
  }

  .nav-trigger {
    width: 36px;
    height: 36px;
    border-radius: 10px;
  }

  .page-title {
    font-size: 15px;
  }

  .header-right {
    gap: 2px;
  }
}

@media (width <= 420px) {
  .header-left {
    gap: 6px;
  }

  .page-title {
    font-size: 14px;
  }
}
</style>
