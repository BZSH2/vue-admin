<script setup lang="ts">
const include = computed(() => true)
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <KeepAlive v-if="!route.meta?.noKeepAlive && include">
      <component :is="Component" :key="route.fullPath" />
    </KeepAlive>
    <component v-else :is="Component" :key="route.fullPath" />
  </RouterView>
</template>
