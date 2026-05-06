<script setup lang="ts">
import { ref } from 'vue'
import MenuProduct from './components/MenuProduct.vue'
import MenuContent from './components/MenuContent.vue'

type ProductOption = Pick<ProductModule.Product, 'id' | 'name' | 'code' | 'status'>

const activeProduct = ref<ProductOption | null>(null)
</script>

<template>
  <div class="menu-page">
    <MenuProduct v-model:product="activeProduct" />
    <MenuContent :product="activeProduct" />
  </div>
</template>

<style scoped lang="scss">
.menu-page {
  display: flex;
  gap: 12px;
  min-height: calc(100vh - 180px);
}

@media (width <= 960px) {
  .menu-page {
    flex-direction: column;
    min-height: auto;
  }
}
</style>
