<script lang="ts" setup>
import Icons from '@/components/Icons/index.vue'
const svgDir = '/src/icons/svg/'

const icons = ref<Record<string, any[]>>({})
const reloadScroll = inject('reloadScroll') as () => void

function initIcon() {
  const modules = import.meta.glob('/src/icons/svg/**', { eager: true, query: '?import' })
  const result: Record<string, any[]> = {}

  for (const [filePath] of Object.entries(modules)) {
    const parts = filePath.replace(svgDir, '').split('/')
    const name = (parts[parts.length - 1] || '').replace('.svg', '')
    const category = parts.length > 1 ? parts[0] || '' : '默认目录'

    if (!result[category]) {
      result[category] = []
    }
    result[category].push({
      name,
      path: filePath.replace(svgDir, '').replace('.svg', '').split('/').join('-'),
    })
  }

  icons.value = result
}

/** 切换tab时，重新加载滚动条 */
function tabChange() {
  nextTick(() => {
    reloadScroll()
  })
}

onMounted(() => {
  initIcon()
})
</script>

<template>
  <div class="icons-tabs p-[12px]" style="min-height: 100%">
    <ElTabs type="border-card" @tab-change="tabChange">
      <ElTabPane v-for="(list, category) in icons" :key="category" :label="category">
        <Icons type="custom" :iconList="list" />
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<style scoped lang="scss">
.icons-tabs {
  display: flex;
  min-height: 100%;
  padding: 12px;

  :deep(.el-tabs) {
    display: flex;
    flex: 1;
    border-radius: 0 0 var(--va-radius-md) var(--va-radius-md);

    .el-tabs__content {
      flex: 1;
      padding: 0;
    }
  }
}
</style>
