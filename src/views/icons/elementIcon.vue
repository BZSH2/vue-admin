<script setup lang="ts">
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Icons from '@/components/Icons/index.vue'

// --- 1. 数据准备 ---
const iconList = Object.keys(ElementPlusIconsVue).map((name) => ({
  name,
  component: markRaw((ElementPlusIconsVue as Record<string, any>)[name]),
}))
</script>

<template>
  <Icons type="element" :iconList="iconList" />
</template>
