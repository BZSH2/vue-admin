<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MenuItem from './MenuItem.vue'
import { appRoutes } from '@/router/routes'

const props = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  navigate: []
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

function handleSelect(index: string) {
  emit('navigate')

  if (/^(https?:|mailto:|tel:)/.test(index)) {
    window.open(index, '_blank')
    return
  }

  void router.push(index)
}

function filterHidden(r: Route.RouteRecord): boolean {
  return r.meta?.hidden !== true
}

function toMenuNode(r: Route.RouteRecord): Route.RouteRecord | null {
  if (!filterHidden(r)) {
    return null
  }

  const children = r.children?.map(toMenuNode).filter(Boolean) as Route.RouteRecord[]

  if (r.meta?.levelHidden) {
    return { ...r, children: children || [] }
  }

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
    :collapse="props.collapsed"
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
      :collapse="props.collapsed"
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
