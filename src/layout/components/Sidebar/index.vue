<script setup lang="ts">
import Logo from './Logo.vue'
import Menu from './Menu.vue'
defineProps<{
  /** 是否折叠状态 */
  collapsed: boolean
  showControl: boolean
}>()
const emit = defineEmits<{
  /** 切换折叠状态事件 */
  toggle: []
}>()
</script>

<template>
  <div class="sidebar" :class="{ collapsed }">
    <Logo :collapsed="collapsed" />

    <ElScrollbar class="aside-scroll">
      <Menu :collapsed="collapsed" />
    </ElScrollbar>

    <div
      v-if="showControl"
      class="control flex cursor-pointer items-center justify-center"
      @click="emit('toggle')"
    >
      <Icon
        name="layout-fold"
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

.control {
  display: flex;
  border-top: 1px solid var(--el-border-color-lighter);
}

.aside-scroll {
  flex: 1;
  overflow-y: hidden;
}
</style>
