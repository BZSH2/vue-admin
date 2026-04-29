<script lang="ts" setup>
import { copy } from '@/utils'

type IconType = 'element' | 'custom' // 饿了么图标 | 自定义图标
interface IconItem {
  name: string
  component?: any
  path: string
}

const props = withDefaults(
  defineProps<{
    type: IconType
    iconList: IconItem[]
  }>(),
  {
    type: 'element',
    iconList: () => [],
  }
)

const icons = ref(props.iconList.slice(0, 100))
const scrollEnd = inject('scrollEnd')

/** 滚动条 触底事件 */
watch(scrollEnd as any, () => {
  const len = icons.value.length
  const end = props.iconList.length
  if (len < end) {
    icons.value.push(...props.iconList.slice(len, len + 50))
  }
})

// 复制图标名称到剪贴板
async function copyIcon(data: IconItem) {
  const text =
    props.type === 'element'
      ? `<ElIcon class="icon-svg"><${data.name} /></ElIcon>`
      : `<Icon name="${data.path}" class="icon-svg" />`
  await copy(text)
  $baseMessage('复制成功')
}
</script>

<template>
  <div class="icons-wrapper">
    <!-- 循环渲染可视区域的数据 -->
    <div v-for="(data, index) in icons" :key="index" class="icon-item" @click="copyIcon(data)">
      <ElIcon v-if="type === 'element'" class="icon-svg"><component :is="data.component" /></ElIcon>
      <Icon v-else :name="data.path" class="icon-svg" :size="24" />
      <div class="icon-title">{{ data.name }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.icons-wrapper {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  padding: 12px;
}

@media (width >= 350px) {
  .icons-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (width >= 500px) {
  .icons-wrapper {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (width >= 650px) {
  .icons-wrapper {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (width >= 800px) {
  .icons-wrapper {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (width >= 950px) {
  .icons-wrapper {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (width >= 1100px) {
  .icons-wrapper {
    grid-template-columns: repeat(7, 1fr);
  }
}

.icon-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  cursor: pointer;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: var(--va-radius-md);
  transition: all 0.3s;

  .icon-svg {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -10px;
    font-size: 24px;
    transform: translate(-50%, -50%);
  }

  .icon-title {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    font-size: var(--va-font-size-xs);
    font-weight: bold;
    line-height: 36px;
    color: #606266;
    text-align: center;
  }

  &:hover {
    color: #409eff;
    background-color: #ecf5ff;
    border-color: #409eff;
  }
}
</style>
