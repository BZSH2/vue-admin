<script lang="ts" setup>
import PanelItem from './PanelItem.vue'

const panelList = ref<Components.DashboardPanelItem[]>([
  {
    title: 'New Visits',
    content: '102400',
    color: '#40c9c6',
  },
  {
    title: 'Messages',
    content: '81212',
    color: '#36a3f7',
  },
  {
    title: 'Purchases',
    content: '9280',
    color: '#f4516c',
  },
  {
    title: 'Shoppings',
    content: '13600',
    color: '#34bfa3',
  },
])
</script>

<template>
  <div class="panel">
    <PanelItem
      v-for="item in panelList"
      :key="item.title"
      :title="item.title"
      :content="item.content"
      :color="item.color"
    />
  </div>
</template>
