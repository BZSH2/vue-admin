<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
  menusControllerCreate,
  menusControllerFindAll,
  menusControllerFindTree,
  menusControllerRemove,
  menusControllerUpdate,
} from '@/api/MenuModule/Menu'
import { $asyncBaseConfirm, $baseMessage } from '@/composables/useMessage'
import MenuFormDialog from '../../../menuManagement/components/MenuFormDialog.vue'

type ProductOption = Pick<ProductModule.Product, 'id' | 'name' | 'code' | 'status'>

const props = defineProps<{
  product: ProductOption | null
}>()

const loading = ref(false)
const submitLoading = ref(false)
const actionId = ref('')
const list = ref<MenuModule.MenuItem[]>([])
const total = ref(0)
const tree = ref<MenuModule.MenuItem[]>([])
const query = reactive<MenuModule.QueryMenuDto>({ page: 1, pageSize: 10, keyword: '' })
const formVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const currentMenu = ref<MenuModule.MenuItem | null>(null)

const hasProduct = computed(() => !!props.product?.id)
const panelTitle = computed(() => {
  if (!props.product) {
    return '产品菜单管理'
  }
  return `${props.product.name} · 菜单管理`
})

const parentOptions = computed(() => {
  const items: Array<{ label: string; value: string }> = []
  const walk = (nodes: MenuModule.MenuItem[], prefix = '') => {
    nodes.forEach((node) => {
      items.push({ label: `${prefix}${node.name}`, value: node.id })
      if (node.children?.length) {
        walk(node.children, `${prefix}└ `)
      }
    })
  }
  walk(tree.value)
  return items
})

function resetState() {
  list.value = []
  tree.value = []
  total.value = 0
  actionId.value = ''
  currentMenu.value = null
  formVisible.value = false
}

function formatTime(value?: string | Date | null) {
  if (!value) {
    return '-'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return String(value)
  }
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

async function fetchList() {
  if (!props.product?.id) {
    resetState()
    return
  }
  loading.value = true
  try {
    const params = { ...query, productId: props.product.id }
    const [listRes, treeRes] = await Promise.all([
      menusControllerFindAll(params),
      menusControllerFindTree(params),
    ])
    list.value = listRes.items || []
    total.value = listRes.total || 0
    tree.value = treeRes || []
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  query.page = 1
  fetchList()
}

function handleReset() {
  query.page = 1
  query.pageSize = 10
  query.keyword = ''
  query.type = undefined
  query.enabled = undefined
  fetchList()
}

function openCreate() {
  if (!props.product?.id) {
    return
  }
  formMode.value = 'create'
  currentMenu.value = null
  formVisible.value = true
}

function openEdit(item: MenuModule.MenuItem) {
  formMode.value = 'edit'
  currentMenu.value = item
  formVisible.value = true
}

async function handleSubmit(payload: MenuModule.CreateMenuDto | MenuModule.UpdateMenuDto) {
  if (!props.product?.id) {
    return
  }
  submitLoading.value = true
  try {
    const body = {
      ...payload,
      productId: props.product.id,
    }

    if (formMode.value === 'create') {
      await menusControllerCreate(body as MenuModule.CreateMenuDto)
      $baseMessage('菜单创建成功')
    } else if (currentMenu.value?.id) {
      await menusControllerUpdate({ id: currentMenu.value.id }, body)
      $baseMessage('菜单更新成功')
    }
    formVisible.value = false
    await fetchList()
  } finally {
    submitLoading.value = false
  }
}

async function handleRemove(item: MenuModule.MenuItem) {
  const ok = await $asyncBaseConfirm({
    title: '删除菜单',
    content: `确认删除菜单「${item.name}」吗？`,
  })
  if (!ok) {
    return
  }
  actionId.value = item.id
  try {
    await menusControllerRemove({ id: item.id })
    $baseMessage('菜单删除成功')
    await fetchList()
  } finally {
    actionId.value = ''
  }
}

watch(
  () => props.product?.id,
  () => {
    query.page = 1
    query.keyword = ''
    query.type = undefined
    query.enabled = undefined
    fetchList()
  },
  { immediate: true }
)
</script>

<template>
  <div class="menu-content-panel">
    <template v-if="hasProduct">
      <ElCard shadow="never" class="toolbar-card">
        <div class="page-header">
          <div>
            <div class="page-title">{{ panelTitle }}</div>
            <div class="page-desc">
              当前产品编码：{{ product?.code }}，此处菜单新增/编辑都会固定绑定到当前产品。
            </div>
          </div>
          <ElButton type="primary" @click="openCreate">新增菜单</ElButton>
        </div>
        <div class="search-bar">
          <ElInput
            v-model="query.keyword"
            class="search-keyword"
            placeholder="搜索菜单名称/编码/权限标识"
            @keyup.enter="handleSearch"
          />
          <ElSelect v-model="query.type" clearable class="search-status" placeholder="全部类型">
            <ElOption label="目录" value="directory" />
            <ElOption label="菜单" value="menu" />
            <ElOption label="按钮" value="button" />
          </ElSelect>
          <ElSelect v-model="query.enabled" clearable class="search-status" placeholder="全部状态">
            <ElOption :value="true" label="启用" />
            <ElOption :value="false" label="停用" />
          </ElSelect>
          <ElButton @click="handleSearch">查询</ElButton>
          <ElButton @click="handleReset">重置</ElButton>
        </div>
      </ElCard>

      <ElCard shadow="never" class="table-card">
        <ElTable :data="list" v-loading="loading" border>
          <ElTableColumn prop="name" label="菜单名称" min-width="160" />
          <ElTableColumn prop="code" label="菜单编码" min-width="160" />
          <ElTableColumn prop="type" label="类型" width="100" />
          <ElTableColumn prop="permission" label="权限标识" min-width="180">
            <template #default="{ row }">{{ row.permission || '-' }}</template>
          </ElTableColumn>
          <ElTableColumn prop="path" label="路由路径" min-width="180">
            <template #default="{ row }">{{ row.path || '-' }}</template>
          </ElTableColumn>
          <ElTableColumn label="状态" width="120">
            <template #default="{ row }">
              <ElTag :type="row.enabled ? 'success' : 'info'">
                {{ row.enabled ? '启用' : '停用' }}
              </ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="updatedAt" label="更新时间" min-width="160">
            <template #default="{ row }">{{ formatTime(row.updatedAt) }}</template>
          </ElTableColumn>
          <ElTableColumn label="操作" min-width="140" fixed="right">
            <template #default="{ row }">
              <ElButton link type="primary" @click="openEdit(row)">编辑</ElButton>
              <ElButton
                link
                type="danger"
                :loading="actionId === row.id"
                @click="handleRemove(row)"
              >
                删除
              </ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
        <div class="pagination-bar">
          <ElPagination
            v-model:current-page="query.page"
            v-model:page-size="query.pageSize"
            background
            layout="total, prev, pager, next, sizes"
            :page-sizes="[10, 20, 50]"
            :total="total"
            @change="fetchList"
          />
        </div>
      </ElCard>
    </template>

    <ElCard v-else shadow="never" class="empty-card">
      <ElEmpty description="请先在左侧选择产品" :image-size="96" />
    </ElCard>
  </div>

  <MenuFormDialog
    v-model="formVisible"
    :mode="formMode"
    :menu="currentMenu"
    :parent-options="parentOptions"
    :loading="submitLoading"
    @submit="handleSubmit"
  />
</template>

<style scoped lang="scss">
.menu-content-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.toolbar-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  display: flex;
  gap: 16px;
  justify-content: space-between;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
}

.page-desc {
  margin-top: 8px;
  color: var(--el-text-color-regular);
}

.search-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.search-keyword {
  width: min(280px, 100%);
}

.search-status {
  width: 140px;
}

.table-card,
.empty-card {
  flex: 1;
}

.pagination-bar {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.empty-card :deep(.el-card__body) {
  display: flex;
  min-height: 420px;
  align-items: center;
  justify-content: center;
}

@media (width <= 960px) {
  .page-header {
    flex-direction: column;
  }

  .search-keyword,
  .search-status {
    width: 100%;
  }

  .pagination-bar {
    justify-content: center;
  }
}
</style>
