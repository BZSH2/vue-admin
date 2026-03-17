<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MenuItem from './MenuItem.vue'
import { appRoutes } from '@/router/routes'

defineProps<{
  collapsed: boolean
}>()

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta?.activeMenu) {
    return meta.activeMenu
  }
  return path
})

/**
 * 菜单选择事件
 */
const handleSelect = (index: string) => {
  if (/^(https?:|mailto:|tel:)/.test(index)) {
    window.open(index, '_blank')
  } else {
    router.push(index)
  }
}

/**
 * 过滤隐藏的路由
 * @param r 路由记录
 */
function filterHidden(r: Route.RouteRecord): boolean {
  return r.meta?.hidden !== true
}

/**
 * 递归将路由转换为菜单节点
 * @param r 路由记录
 * @returns 菜单节点或 null
 */
function toMenuNode(r: Route.RouteRecord): Route.RouteRecord | null {
  if (!filterHidden(r)) {
    return null
  }

  const children = r.children?.map(toMenuNode).filter(Boolean) as Route.RouteRecord[]

  // 保留 levelHidden 逻辑：如果是 levelHidden，确保返回 children 数组（即使为空）
  if (r.meta?.levelHidden) {
    return { ...r, children: children || [] }
  }

  // 常规节点
  return {
    ...r,
    children: children?.length ? children : undefined,
  }
}

const menus = computed<Route.RouteRecord[]>(
  () => appRoutes.map(toMenuNode).filter(Boolean) as Route.RouteRecord[]
)
</script>

<template>
  <ElMenu
    :default-active="activeMenu"
    :collapse="collapsed"
    :unique-opened="false"
    :collapse-transition="false"
    mode="vertical"
    class="menu"
    @select="handleSelect"
  >
    <MenuItem
      v-for="menu in menus"
      :key="menu.path"
      :item="menu"
      :collapse="collapsed"
      base-path=""
    />
  </ElMenu>
</template>

<style scoped lang="scss">
.menu {
  border-right: none;

  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    &.is-active {
      background-color: var(--el-menu-hover-bg-color);
    }
  }
}
</style>
