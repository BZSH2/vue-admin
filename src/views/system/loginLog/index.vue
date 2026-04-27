<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { loginLogsControllerFindAll } from '@/api/LoginLogModule/LoginLog'

const loading = ref(false)
const list = ref<LoginLogModule.LoginLogItem[]>([])
const total = ref(0)
const query = reactive<LoginLogModule.QueryLoginLogDto>({ page: 1, pageSize: 10, keyword: '' })

const successValue = computed({
  get: () => (typeof query.success === 'boolean' ? String(query.success) : ''),
  set: (value: string) => {
    query.success = value === '' ? undefined : value === 'true'
  },
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
    const res = await loginLogsControllerFindAll(query)
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
  query.success = undefined
  fetchList()
}

onMounted(fetchList)
</script>

<template>
  <div class="page-shell">
    <ElCard shadow="never" class="toolbar-card">
      <div class="page-header"
        ><div
          ><div class="page-title">登录日志</div
          ><div class="page-desc">查看登录成功与失败记录，辅助排查账号安全问题。</div></div
        ></div
      >
      <div class="search-bar">
        <ElInput
          v-model="query.keyword"
          class="search-keyword"
          placeholder="搜索手机号/IP"
          @keyup.enter="handleSearch"
        />
        <ElSelect v-model="successValue" class="search-status">
          <ElOption label="全部" value="" />
          <ElOption label="成功" value="true" />
          <ElOption label="失败" value="false" />
        </ElSelect>
        <ElButton @click="handleSearch">查询</ElButton>
        <ElButton @click="handleReset">重置</ElButton>
      </div>
    </ElCard>
    <ElCard shadow="never">
      <ElTable :data="list" v-loading="loading" border>
        <ElTableColumn prop="phoneNumber" label="手机号" min-width="140" />
        <ElTableColumn label="结果" width="100"
          ><template #default="{ row }"
            ><ElTag :type="row.success ? 'success' : 'danger'">{{
              row.success ? '成功' : '失败'
            }}</ElTag></template
          ></ElTableColumn
        >
        <ElTableColumn prop="ip" label="IP" min-width="140"
          ><template #default="{ row }">{{ row.ip || '-' }}</template></ElTableColumn
        >
        <ElTableColumn prop="failureReason" label="失败原因" min-width="180"
          ><template #default="{ row }">{{ row.failureReason || '-' }}</template></ElTableColumn
        >
        <ElTableColumn prop="userAgent" label="User-Agent" min-width="220" show-overflow-tooltip />
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
