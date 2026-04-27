<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {
  systemConfigsControllerCreate,
  systemConfigsControllerFindAll,
  systemConfigsControllerRemove,
  systemConfigsControllerUpdate,
} from '@/api/SystemConfigModule/SystemConfig'
import { $asyncBaseConfirm, $baseMessage } from '@/composables/useMessage'
import SystemConfigFormDialog from './components/SystemConfigFormDialog.vue'

const loading = ref(false)
const submitLoading = ref(false)
const actionId = ref('')
const list = ref<SystemConfigModule.SystemConfigItem[]>([])
const total = ref(0)
const query = reactive<SystemConfigModule.QuerySystemConfigDto>({
  page: 1,
  pageSize: 10,
  keyword: '',
})
const formVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const currentItem = ref<SystemConfigModule.SystemConfigItem | null>(null)

function formatTime(value?: string | null) {
  if (!value) {
    return '-'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
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
  loading.value = true
  try {
    const res = await systemConfigsControllerFindAll(query)
    list.value = res.items || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formMode.value = 'create'
  currentItem.value = null
  formVisible.value = true
}
function openEdit(item: SystemConfigModule.SystemConfigItem) {
  formMode.value = 'edit'
  currentItem.value = item
  formVisible.value = true
}
function handleSearch() {
  query.page = 1
  fetchList()
}
function handleReset() {
  query.page = 1
  query.pageSize = 10
  query.keyword = ''
  query.groupName = ''
  fetchList()
}

async function handleSubmit(
  payload: SystemConfigModule.CreateSystemConfigDto | SystemConfigModule.UpdateSystemConfigDto
) {
  submitLoading.value = true
  try {
    if (formMode.value === 'create') {
      await systemConfigsControllerCreate(payload as SystemConfigModule.CreateSystemConfigDto)
      $baseMessage('参数创建成功')
    } else if (currentItem.value?.id) {
      await systemConfigsControllerUpdate(currentItem.value.id, payload)
      $baseMessage('参数更新成功')
    }
    formVisible.value = false
    await fetchList()
  } finally {
    submitLoading.value = false
  }
}

async function handleRemove(item: SystemConfigModule.SystemConfigItem) {
  const ok = await $asyncBaseConfirm({
    title: '删除系统参数',
    content: `确认删除「${item.name}」吗？`,
  })
  if (!ok) {
    return
  }
  actionId.value = item.id
  try {
    await systemConfigsControllerRemove(item.id)
    $baseMessage('参数删除成功')
    await fetchList()
  } finally {
    actionId.value = ''
  }
}

onMounted(fetchList)
</script>

<template>
  <div class="page-shell">
    <ElCard shadow="never" class="toolbar-card">
      <div class="page-header">
        <div
          ><div class="page-title">系统参数</div
          ><div class="page-desc">维护运行时可调整的后台参数配置。</div></div
        >
        <ElButton type="primary" @click="openCreate">新增参数</ElButton>
      </div>
      <div class="search-bar">
        <ElInput
          v-model="query.keyword"
          class="search-keyword"
          placeholder="搜索配置键/名称"
          @keyup.enter="handleSearch"
        />
        <ElInput
          v-model="query.groupName"
          class="search-status"
          placeholder="分组"
          @keyup.enter="handleSearch"
        />
        <ElButton @click="handleSearch">查询</ElButton>
        <ElButton @click="handleReset">重置</ElButton>
      </div>
    </ElCard>
    <ElCard shadow="never">
      <ElTable :data="list" v-loading="loading" border>
        <ElTableColumn prop="name" label="参数名称" min-width="140" />
        <ElTableColumn prop="key" label="配置键" min-width="180" />
        <ElTableColumn prop="valueType" label="值类型" width="100" />
        <ElTableColumn prop="value" label="配置值" min-width="220" show-overflow-tooltip />
        <ElTableColumn prop="groupName" label="分组" width="120"
          ><template #default="{ row }">{{ row.groupName || '-' }}</template></ElTableColumn
        >
        <ElTableColumn label="属性" width="100"
          ><template #default="{ row }"
            ><ElTag :type="row.isSystem ? 'danger' : 'info'">{{
              row.isSystem ? '系统' : '普通'
            }}</ElTag></template
          ></ElTableColumn
        >
        <ElTableColumn prop="updatedAt" label="更新时间" min-width="160"
          ><template #default="{ row }">{{ formatTime(row.updatedAt) }}</template></ElTableColumn
        >
        <ElTableColumn label="操作" min-width="140" fixed="right">
          <template #default="{ row }">
            <ElButton link type="primary" @click="openEdit(row)">编辑</ElButton>
            <ElButton
              link
              type="danger"
              :disabled="row.isSystem"
              :loading="actionId === row.id"
              @click="handleRemove(row)"
              >删除</ElButton
            >
          </template>
        </ElTableColumn>
      </ElTable>
      <div class="pagination-bar"
        ><ElPagination
          v-model:current-page="query.page"
          v-model:page-size="query.pageSize"
          background
          layout="total, prev, pager, next, sizes"
          :page-sizes="[10, 20, 50]"
          :total="total"
          @change="fetchList"
      /></div>
    </ElCard>
  </div>

  <SystemConfigFormDialog
    v-model="formVisible"
    :mode="formMode"
    :item="currentItem"
    :loading="submitLoading"
    @submit="handleSubmit"
  />
</template>

<style scoped lang="scss">
.page-shell {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  font-size: 24px;
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

.pagination-bar {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

@media (width <= 768px) {
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
