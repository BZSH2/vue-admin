<script setup lang="ts">
import RouterViewKeepAlive from './components/RouterViewKeepAlive.vue'
import Header from './components/Header/index.vue'
import Sidebar from './components/Sidebar.vue'
const collapsed = ref(false)
function toggle() {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <ElContainer class="layout">
    <ElAside :width="collapsed ? '64px' : '200px'" class="aside" :class="[{ collapsed }]">
      <Sidebar :collapsed="collapsed" @toggle="toggle" />
    </ElAside>
    <ElContainer class="main-wrap">
      <ElHeader class="header">
        <Header />
      </ElHeader>
      <ElMain class="main">
        <ElScrollbar class="content-scroll">
          <RouterViewKeepAlive />
        </ElScrollbar>
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<style lang="scss" scoped>
.layout {
  height: 100vh;
  background-color: var(--el-bg-color);
}

.aside {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--el-bg-color-overlay);
  border-right: 1px solid var(--el-border-color-lighter);
  transition: width 220ms var(--el-transition-function-fast-bezier, cubic-bezier(0.23, 1, 0.32, 1));
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.logo-text {
  transition:
    opacity 200ms ease-in-out,
    transform 200ms ease-in-out;
}

.aside.collapsed .logo-text {
  opacity: 0.95;
  transform: scale(0.98);
}

.aside-scroll {
  height: calc(100vh - 56px);
  padding: 8px;
}

.aside-placeholder {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.main-wrap {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.header {
  display: flex;
  gap: 12px;
  align-items: center;
  height: 56px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.spacer {
  flex: 1;
}

.user {
  display: flex;
  gap: 10px;
  align-items: center;
}

.main {
  padding: 0;

  // background-color: var(--el-bg-color);
}

.content-scroll {
  box-sizing: border-box;
  height: calc(100vh - 56px);
}
</style>
