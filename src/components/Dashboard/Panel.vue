<script lang="ts" setup>
import PanelItem from './PanelItem.vue'

const emit = defineEmits<{
  'update:active': [index: number]
}>()
defineModel('active')
const panelList = ref<Components.DashboardPanelItem[]>([
  {
    title: 'New Visits',
    content: '102400',
    color: '#40c9c6',
    icon: 'components-dashboardPanel1',
  },
  {
    title: 'Messages',
    content: '81212',
    color: '#36a3f7',
    icon: 'components-dashboardPanel2',
  },
  {
    title: 'Purchases',
    content: '9280',
    color: '#f4516c',
    icon: 'components-dashboardPanel3',
  },
  {
    title: 'Shoppings',
    content: '13600',
    color: '#34bfa3',
    icon: 'components-dashboardPanel4',
  },
])
</script>

<template>
  <div class="panel">
    <PanelItem
      v-for="(item, index) in panelList"
      :active="active === index"
      :key="item.title"
      :title="item.title"
      :content="item.content"
      :color="item.color"
      :icon="item.icon"
      @click="emit('update:active', index)"
    />
  </div>
</template>

<style lang="scss" scoped>
.panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: 0 0 0 12px;
}

/* 1. 移动端 (0 ~ 468px) */
@media screen and (width <= 419px) {
  .panel-item {
    justify-content: center;
    width: calc(100% - 12px);

    :deep(.panel-item-content) {
      display: none;
    }
  }
}

/* 2. 平板端 (469px ~ 992px) */
@media screen and (width >= 420px) and (width <= 992px) {
  .panel-item {
    width: calc(50% - 12px);
  }
}

/* 3. 桌面端 (> 992px) */
@media screen and (width >= 993px) {
  .panel-item {
    width: calc(25% - 12px);
  }
}
</style>
