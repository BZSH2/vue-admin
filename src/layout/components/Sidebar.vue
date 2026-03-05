<script setup lang="ts">
defineProps<{
  collapsed: boolean
}>()
const emit = defineEmits<{ toggle: [] }>()

import { appRoutes } from '@/router/routes'
const route = useRoute()
const router = useRouter()

type MenuNode = {
  title: string
  path?: string
  children?: MenuNode[]
  hidden?: boolean
  levelHidden?: boolean
}

function filterHidden(r: Route.RouteRecord): boolean {
  return r.meta?.hidden !== true
}

function toMenuNode(r: Route.RouteRecord): MenuNode | null {
  if (!filterHidden(r)) {
    return null
  }
  if (r.meta?.levelHidden) {
    const children = (r.children || []).map(toMenuNode).filter(Boolean) as MenuNode[]
    return { title: r.meta?.title || '', children, levelHidden: true }
  }
  const node: MenuNode = {
    title: r.meta?.title || r.name,
    path: r.path,
  }
  if (r.children && r.children.length) {
    node.children = r.children.map(toMenuNode).filter(Boolean) as MenuNode[]
  }
  return node
}

const menus = computed<MenuNode[]>(() => appRoutes.map(toMenuNode).filter(Boolean) as MenuNode[])

const activePath = computed(() => route.path)
function onSelect(path: string) {
  if (path) {
    router.push(path)
  }
}
</script>

<template>
  <div class="sidebar" :class="{ collapsed }">
    <div class="logo">
      <span class="logo-text">{{ collapsed ? 'VA' : 'Vue Admin' }}</span>
    </div>

    <ElScrollbar class="aside-scroll">
      <ElMenu :collapse="collapsed" :default-active="activePath" class="menu" @select="onSelect">
        <template v-for="(m, i) in menus" :key="i">
          <template v-if="m.levelHidden && m.children?.length">
            <template v-for="(c, j) in m.children" :key="j">
              <ElSubMenu v-if="c.children?.length" :index="c.title">
                <template #title>
                  <span class="menu-text">{{ $t(c.title) }}</span>
                </template>
                <ElMenuItem v-for="(gc, k) in c.children" :key="k" :index="gc.path || gc.title">
                  <span class="menu-text">{{ $t(gc.title) }}</span>
                </ElMenuItem>
              </ElSubMenu>
              <ElMenuItem v-else :index="c.path || c.title">
                <span class="menu-text">{{ $t(c.title) }}</span>
              </ElMenuItem>
            </template>
          </template>
          <ElSubMenu v-else-if="m.children?.length" :index="m.title">
            <template #title>
              <span class="menu-text">{{ $t(m.title) }}</span>
            </template>
            <ElMenuItem v-for="(c, j) in m.children" :key="j" :index="c.path || c.title">
              <span class="menu-text">{{ $t(c.title) }}</span>
            </ElMenuItem>
          </ElSubMenu>
          <ElMenuItem v-else :index="m.path || m.title">
            <span class="menu-text">{{ $t(m.title) }}</span>
          </ElMenuItem>
        </template>
      </ElMenu>
    </ElScrollbar>

    <div class="control flex cursor-pointer items-center justify-center" @click="emit('toggle')">
      <Icon
        name="fold"
        :size="16"
        :class="collapsed ? 'transform-scale-x--100' : ''"
        class="py-10px"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.menu {
  border-right: none;
}

.control {
  display: flex;
  border-top: 1px solid var(--el-border-color-lighter);
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

.collapsed .logo-text {
  opacity: 0.95;
  transform: scale(0.98);
}

.aside-scroll {
  flex: 1;
  padding: 8px;
}

.aside-placeholder {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
</style>
