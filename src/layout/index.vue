<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useResponsiveLayout } from '@/composables/useResponsiveLayout'
import RouterViewKeepAlive from './components/RouterViewKeepAlive.vue'
import Header from './components/Header/index.vue'
import Sidebar from './components/Sidebar/index.vue'
import { scrollConfig } from '@/config'

const { scrollEndPathName } = scrollConfig

const route = useRoute()
const {
  isMobile,
  isCompactHeader,
  isNarrowMobile,
  desktopCollapsed,
  mobileSidebarVisible,
  mobileSidebarWidth,
  toggleSidebar,
  closeMobileSidebar,
} = useResponsiveLayout()
/** 此数值变化时 说明触发了触底事件 */
const scrollEndDirection = ref(0)
const scrollbarRef = ref<InstanceType<typeof ElScrollbar> | null>(null)
const layoutStyle = computed(() => ({
  '--va-header-height': isMobile.value ? '42px' : '46px',
}))

function onScrollEnd(direction: string) {
  if (direction === 'bottom' && scrollEndPathName.includes(route.name as string)) {
    scrollEndDirection.value++
    nextTick(() => {
      reloadScroll()
    })
  }
}

function reloadScroll() {
  scrollbarRef.value?.update()
}

provide('scrollEnd', scrollEndDirection)
provide('reloadScroll', reloadScroll)

watch(
  () => route.fullPath,
  () => {
    closeMobileSidebar()
  }
)
</script>

<template>
  <ElContainer class="layout" :style="layoutStyle">
    <ElAside
      v-if="!isMobile"
      :width="desktopCollapsed ? '65px' : '220px'"
      class="aside aside-box"
      :class="{ collapsed: desktopCollapsed }"
    >
      <Sidebar :collapsed="desktopCollapsed" @toggle="toggleSidebar" />
    </ElAside>

    <ElDrawer
      v-model="mobileSidebarVisible"
      append-to-body
      class="mobile-sidebar-drawer"
      direction="ltr"
      :size="mobileSidebarWidth"
      :with-header="false"
    >
      <Sidebar :collapsed="false" :show-collapse-control="false" @navigate="closeMobileSidebar" />
    </ElDrawer>

    <ElContainer class="main-wrap">
      <ElHeader class="header">
        <Header
          :compact="isCompactHeader"
          :is-mobile="isMobile"
          :is-narrow-mobile="isNarrowMobile"
          @toggle-sidebar="toggleSidebar"
        />
      </ElHeader>
      <ElMain class="main">
        <ElScrollbar
          class="content-scroll"
          @end-reached="onScrollEnd"
          :distance="300"
          ref="scrollbarRef"
        >
          <RouterViewKeepAlive />
        </ElScrollbar>
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<style lang="scss" scoped>
.layout {
  height: var(--va-app-height);
  background-color: var(--va-bg-page);
}

.aside {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--el-bg-color-overlay);
  border-right: 1px solid var(--el-border-color-lighter);
  transition: width 220ms var(--el-transition-function-fast-bezier, cubic-bezier(0.23, 1, 0.32, 1));
}

.main-wrap {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

.header {
  display: flex;
  align-items: center;
  height: var(--va-header-height);
  padding: 0 max(16px, env(safe-area-inset-right)) 0 max(12px, env(safe-area-inset-left));
  background-color: var(--el-bg-color-overlay);
  box-shadow: 0 1px 4px #00152914;
}

.main {
  min-height: 0;
  padding: 0;
  background-color: var(--va-bg-page);
}

.content-scroll {
  height: calc(var(--va-app-height) - var(--va-header-height));

  :deep(.el-scrollbar__view) {
    height: 100%;
  }
}

:deep(.mobile-sidebar-drawer .el-drawer) {
  background-color: var(--el-bg-color-overlay);
}

:deep(.mobile-sidebar-drawer .el-drawer__body) {
  display: flex;
  padding: 0;
  overflow: hidden;
}

@media (width <= 768px) {
  .header {
    padding-right: max(12px, env(safe-area-inset-right));
    padding-left: max(8px, env(safe-area-inset-left));
  }
}
</style>
