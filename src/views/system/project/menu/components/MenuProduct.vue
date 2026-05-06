<script lang="ts" setup>
import { productsControllerFindAll } from '@/api/ProductModule/Products'

const props = defineProps({
  code: {
    type: String,
    default: () => '',
  },
})

const emit = defineEmits<{
  'update:code': [code: string]
}>()
const sourceData = ref<any[]>([])
const ITEM_HEIGHT = 50
const OVERSCAN = 10

const scrollbarRef = ref<InstanceType<typeof ElScrollbar> | null>(null)
const scrollTop = ref(0)
const containerHeight = ref(0)

const totalHeight = computed(() => sourceData.value.length * ITEM_HEIGHT)

const visibleData = computed(() => {
  if (!sourceData.value.length || !containerHeight.value) {
    return []
  }

  const start = Math.max(0, Math.floor(scrollTop.value / ITEM_HEIGHT) - OVERSCAN)
  const end = Math.min(
    sourceData.value.length,
    Math.ceil((scrollTop.value + containerHeight.value) / ITEM_HEIGHT) + OVERSCAN
  )

  const items = []
  for (let i = start; i < end; i++) {
    items.push({ data: sourceData.value[i], index: i })
  }
  return items
})

function handleScroll({ scrollTop: st }: { scrollTop: number }) {
  scrollTop.value = st
  if (scrollbarRef.value?.wrapRef) {
    containerHeight.value = scrollbarRef.value.wrapRef.clientHeight
  }
}

function handleClick(code: string) {
  emit('update:code', code)
}

async function initData() {
  const { items } = await productsControllerFindAll({
    page: 1,
    pageSize: 99999,
  })
  sourceData.value = items
  await nextTick()
  if (scrollbarRef.value?.wrapRef) {
    containerHeight.value = scrollbarRef.value.wrapRef.clientHeight
  }
  if (items.length) {
    handleClick(items[0].code)
  }
}

onMounted(() => {
  if (scrollbarRef.value?.wrapRef) {
    containerHeight.value = scrollbarRef.value.wrapRef.clientHeight
  }
  initData()
})
</script>

<template>
  <ElScrollbar ref="scrollbarRef" class="menu-product" @scroll="handleScroll">
    <div :style="{ height: `${totalHeight}px`, position: 'relative' }">
      <div
        v-for="item in visibleData"
        :key="item.index"
        :style="{
          position: 'absolute',
          top: `${item.index * ITEM_HEIGHT}px`,
          height: `${ITEM_HEIGHT}px`,
          left: 0,
          right: 0,
        }"
        class="scrollbar-demo-item"
        :class="{ active: item.data.code === code }"
        @click="handleClick(item.data.code)"
      >
        <span>{{ item.data.name }}</span>
        <span><Icon name="layout-check" class="icon-svg" /></span>
      </div>
    </div>
  </ElScrollbar>
</template>

<style lang="scss" scoped>
.menu-product {
  width: 200px;
  height: 100%;
  background: #fff;
  border-radius: var(--va-radius-md);
}

.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  font-size: var(--va-font-size-sm);
  font-weight: 500;
  cursor: pointer;
  border-bottom: 1px dashed #f0f0f0;

  &:hover {
    color: var(--va-color-primary);
  }

  .icon-svg {
    display: none;
  }

  &.active {
    color: var(--va-color-primary);

    .icon-svg {
      display: inline-block;
    }
  }
}
</style>
