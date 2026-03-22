<script setup lang="ts">
import Logo from './Logo.vue'
import Menu from './Menu.vue'

const props = withDefaults(
  defineProps<{
    collapsed: boolean
    showCollapseControl?: boolean
  }>(),
  {
    showCollapseControl: true,
  }
)

const emit = defineEmits<{
  toggle: []
  navigate: []
}>()
</script>

<template>
  <div class="sidebar" :class="{ collapsed: props.collapsed }">
    <Logo :collapsed="props.collapsed" />

    <ElScrollbar class="aside-scroll">
      <Menu :collapsed="props.collapsed" @navigate="emit('navigate')" />
    </ElScrollbar>

    <div
      v-if="props.showCollapseControl"
      class="control flex cursor-pointer items-center justify-center"
      @click="emit('toggle')"
    >
      <Icon
        name="layout-fold"
        :size="16"
        :class="props.collapsed ? 'transform-scale-x--100' : ''"
        class="py-10px"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}

.control {
  display: flex;
  min-height: 48px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.aside-scroll {
  flex: 1;
  overflow-y: hidden;
}
</style>
