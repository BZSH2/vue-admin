<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'MenuItem',
})

const props = defineProps<{
  item: Route.RouteRecord
  basePath: string
  collapse: boolean
}>()

const iconSize = computed(() => (props.collapse ? 20 : 14))

/**
 * 判断是否为外部链接
 */
function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 解析路径
 */
function resolvePath(routePath: string) {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  // 如果是绝对路径，直接返回
  if (routePath.startsWith('/')) {
    return routePath
  }
  // 拼接路径
  const base = props.basePath.replace(/\/+$/, '')
  return base ? `${base}/${routePath}` : `/${routePath}`
}

/**
 * 计算当前节点的完整路径
 */
const fullPath = computed(() => resolvePath(props.item.path || ''))

/**
 * 判断是否有子菜单
 * levelHidden 的节点虽然有 children，但逻辑上是展开的，这里主要用于判断是否显示 ElSubMenu
 */
const hasChildren = computed(() => {
  const { children, meta } = props.item
  if (meta?.levelHidden) {
    return false // levelHidden 节点不渲染为 SubMenu，而是直接渲染子项（由模板处理）
  }
  // 过滤掉 hidden 的子节点
  const showingChildren = children?.filter((item) => !item.meta?.hidden)
  return showingChildren && showingChildren.length > 0
})
</script>

<template>
  <!-- 如果当前节点 hidden，则不渲染 -->
  <template v-if="!item.meta?.hidden">
    <!-- Case 1: levelHidden - 扁平化渲染子节点 -->
    <template v-if="item.meta?.levelHidden">
      <MenuItem
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="fullPath"
        :collapse="collapse"
      />
    </template>

    <!-- Case 2: SubMenu - 有子节点且不隐藏 -->
    <template v-else-if="hasChildren">
      <ElSubMenu :index="fullPath">
        <template #title>
          <Icon v-if="item.meta?.icon" :name="item.meta.icon" :size="iconSize" />
          <span class="ml-5px">{{ $t(item.meta?.title || '') }}</span>
        </template>
        <MenuItem
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :base-path="fullPath"
          :collapse="collapse"
        />
      </ElSubMenu>
    </template>

    <!-- Case 3: MenuItem - 叶子节点 -->
    <template v-else>
      <ElMenuItem :index="fullPath">
        <Icon v-if="item.meta?.icon" :name="item.meta.icon" :size="iconSize" />
        <template #title>
          <span class="ml-5px">{{ $t(item.meta?.title || '') }}</span>
        </template>
      </ElMenuItem>
    </template>
  </template>
</template>

<style scoped>
.el-menu-item,
.el-sub-menu__title {
  display: flex;
  align-items: center;
}
</style>
