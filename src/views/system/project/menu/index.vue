<script lang="ts" setup>
import MenuProduct from './components/MenuProduct.vue'
import MenuContent from './components/MenuContent.vue'

const activeCode = ref('')
</script>

<template>
  <div class="menu-container flex p-[12px]">
    <MenuProduct v-model:code="activeCode" />
    <MenuContent v-model:code="activeCode" />
  </div>
</template>
