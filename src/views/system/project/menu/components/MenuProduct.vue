<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { productsControllerFindAll } from '@/api/ProductModule/Products'

type ProductOption = Pick<ProductModule.Product, 'id' | 'name' | 'code' | 'status'>

const props = defineProps<{
  product: ProductOption | null
}>()

const emit = defineEmits<{
  'update:product': [product: ProductOption | null]
}>()

const loading = ref(false)
const sourceData = ref<ProductOption[]>([])
const ITEM_HEIGHT = 56
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

  return Array.from({ length: end - start }, (_, offset) => {
    const index = start + offset
    return { data: sourceData.value[index], index }
  })
})

function handleScroll({ scrollTop: st }: { scrollTop: number }) {
  scrollTop.value = st
  if (scrollbarRef.value?.wrapRef) {
    containerHeight.value = scrollbarRef.value.wrapRef.clientHeight
  }
}

function handleClick(product: ProductOption) {
  emit('update:product', product)
}

async function initData() {
  loading.value = true
  try {
    const res = await productsControllerFindAll({
      page: 1,
      pageSize: 99999,
    })
    const items = (Array.isArray(res?.items) ? res.items : []) as ProductOption[]
    sourceData.value = items
    await nextTick()
    if (scrollbarRef.value?.wrapRef) {
      containerHeight.value = scrollbarRef.value.wrapRef.clientHeight
    }

    if (!items.length) {
      emit('update:product', null)
      return
    }

    const current = items.find((item) => item.id === props.product?.id) ?? items[0]
    handleClick(current)
  } finally {
    loading.value = false
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
  <div class="menu-product-panel">
    <div class="panel-header">
      <div class="panel-title">产品列表</div>
      <div class="panel-desc">选择产品后管理该产品下的菜单。</div>
    </div>

    <ElSkeleton v-if="loading" :rows="6" animated class="panel-skeleton" />

    <ElEmpty v-else-if="!sourceData.length" description="暂无产品数据" :image-size="88" />

    <ElScrollbar v-else ref="scrollbarRef" class="menu-product" @scroll="handleScroll">
      <div :style="{ height: `${totalHeight}px`, position: 'relative' }">
        <div
          v-for="item in visibleData"
          :key="item.data.id"
          :style="{
            position: 'absolute',
            top: `${item.index * ITEM_HEIGHT}px`,
            height: `${ITEM_HEIGHT}px`,
            left: 0,
            right: 0,
          }"
          class="menu-product-item"
          :class="{ active: item.data.id === product?.id }"
          @click="handleClick(item.data)"
        >
          <div class="product-main">
            <div class="product-name">{{ item.data.name }}</div>
            <div class="product-code">{{ item.data.code }}</div>
          </div>
          <div class="product-side">
            <ElTag size="small" :type="item.data.status ? 'success' : 'info'">
              {{ item.data.status ? '启用' : '停用' }}
            </ElTag>
          </div>
        </div>
      </div>
    </ElScrollbar>
  </div>
</template>

<style lang="scss" scoped>
.menu-product-panel {
  display: flex;
  flex-direction: column;
  width: 260px;
  min-width: 260px;
  background: #fff;
  border-radius: var(--va-radius-md);
}

.panel-header {
  padding: 16px 16px 12px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
}

.panel-desc {
  margin-top: 6px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.panel-skeleton {
  padding: 16px;
}

.menu-product {
  flex: 1;
  min-height: 360px;
}

.menu-product-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 16px;
  cursor: pointer;
  border-bottom: 1px dashed #f0f0f0;
  transition: all 0.2s ease;

  &:hover {
    background: var(--el-fill-color-light);
  }

  &.active {
    background: rgb(var(--el-color-primary-rgb) / 8%);

    .product-name {
      color: var(--el-color-primary);
    }
  }
}

.product-main {
  min-width: 0;
}

.product-name {
  font-size: var(--va-font-size-sm);
  font-weight: 600;
}

.product-code {
  margin-top: 4px;
  overflow: hidden;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (width <= 960px) {
  .menu-product-panel {
    width: 100%;
    min-width: 0;
  }

  .menu-product {
    min-height: 240px;
  }
}
</style>
