<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { operationLogsControllerFindAll } from '@/api/OperationLogModule/OperationLog'

const loading = ref(false)
const list = ref<OperationLogModule.OperationLogItem[]>([])
const total = ref(0)
const query = reactive<OperationLogModule.QueryOperationLogDto>({
  page: 1,
  pageSize: 10,
  keyword: '',
  method: '',
})

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
    const res = await operationLogsControllerFindAll({
      ...query,
      method: query.method || undefined,
    })
    list.value = res.items || []
    total.value = res.total || 0
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
  query.method = ''
  fetchList()
}

onMounted(fetchList)
</script>

<template>
  <div class="page-shell">
    <ElCard shadow="never" class="toolbar-card">
      <div class="page-header"
        ><div
          ><div class="page-title">操作日志</div
          ><div class="page-desc">追踪后台关键操作，便于审计与问题回溯。</div></div
        ></div
      >
      <div class="search-bar">
        <ElInput
          v-model="query.keyword"
          class="search-keyword"
          placeholder="搜索路径/模块/手机号"
          @keyup.enter="handleSearch"
        />
        <ElSelect v-model="query.method" class="search-status" clearable placeholder="请求方法">
          <ElOption label="POST" value="POST" />
          <ElOption label="PATCH" value="PATCH" />
          <ElOption label="PUT" value="PUT" />
          <ElOption label="DELETE" value="DELETE" />
        </ElSelect>
        <ElButton @click="handleSearch">查询</ElButton>
        <ElButton @click="handleReset">重置</ElButton>
      </div>
    </ElCard>
    <ElCard shadow="never">
      <ElTable :data="list" v-loading="loading" border>
        <ElTableColumn prop="moduleName" label="模块" min-width="120"
          ><template #default="{ row }">{{ row.moduleName || '-' }}</template></ElTableColumn
        >
        <ElTableColumn prop="operatorPhoneNumber" label="操作人" min-width="140"
          ><template #default="{ row }">{{
            row.operatorPhoneNumber || '-'
          }}</template></ElTableColumn
        >
        <ElTableColumn prop="method" label="方法" width="100" />
        <ElTableColumn prop="path" label="路径" min-width="220" show-overflow-tooltip />
        <ElTableColumn prop="statusCode" label="状态码" width="100" />
        <ElTableColumn prop="durationMs" label="耗时(ms)" width="100" />
        <ElTableColumn prop="createdAt" label="时间" min-width="160"
          ><template #default="{ row }">{{ formatTime(row.createdAt) }}</template></ElTableColumn
        >
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
  .search-keyword,
  .search-status {
    width: 100%;
  }

  .pagination-bar {
    justify-content: center;
  }
}
</style>
