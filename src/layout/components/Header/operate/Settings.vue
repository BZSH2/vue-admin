<script lang="ts" setup>
const showDrawer = ref(false)
</script>

<template>
  <ElTooltip :content="$t('设置')">
    <div class="hover-bg-color h-full flex cursor-pointer items-center" @click="showDrawer = true">
      <Icon name="setting" :size="16" class="p-x-10px" />
    </div>
  </ElTooltip>
  <ElDrawer v-model="showDrawer" title="I am the title">
    <span>Hi there!</span>
  </ElDrawer>
</template>
