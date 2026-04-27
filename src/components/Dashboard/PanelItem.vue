<script lang="ts" scoped>
withDefaults(defineProps<Components.DashboardPanelItem>(), {
  content: '',
  title: '',
  color: '',
})
</script>

<template>
  <div class="panel-item">
    <div class="panel-item-icon">
      <Icon name="components-dashboardPanel1" />
    </div>
  </div>
</template>
