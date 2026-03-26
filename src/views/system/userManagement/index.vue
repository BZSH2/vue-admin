<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  usersControllerCreate,
  usersControllerFindAll,
  usersControllerResetPassword,
  usersControllerUpdate,
  usersControllerUpdateStatus,
} from '@/api/UserModule/User'
import PageContainer from '@/components/PageContainer.vue'
import { $asyncBaseConfirm, $baseMessage } from '@/composables/useMessage'
import ResetPasswordDialog from './components/ResetPasswordDialog.vue'
import UserFormDialog from './components/UserFormDialog.vue'

const loading = ref(false)
const submitLoading = ref(false)
const actionUserId = ref('')
const list = ref<UserModule.UserListItem[]>([])
const total = ref(0)
const query = reactive<UserModule.QueryUserDto>({
  page: 1,
  pageSize: 10,
  keyword: '',
})

const formVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const currentUser = ref<UserModule.UserListItem | null>(null)
const resetVisible = ref(false)
const resetTarget = ref<UserModule.UserListItem | null>(null)

const statusValue = computed({
  get: () => {
    if (typeof query.status === 'boolean') return String(query.status)
    return ''
  },
  set: (value: string) => {
    query.status = value === '' ? undefined : value === 'true'
  },
})

function formatTime(value?: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function roleLabel(role?: string | null) {
  return role === 'admin' ? '管理员' : role === 'user' ? '普通用户' : '未设置'
}

function roleTagType(role?: string | null) {
  return role === 'admin' ? 'danger' : 'info'
}

async function fetchList() {
  loading.value = true
  try {
    const res = await usersControllerFindAll(query)
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
  query.status = undefined
  fetchList()
}

function openCreate() {
  formMode.value = 'create'
  currentUser.value = null
  formVisible.value = true
}

function openEdit(user: UserModule.UserListItem) {
  formMode.value = 'edit'
  currentUser.value = user
  formVisible.value = true
}

function openResetPassword(user: UserModule.UserListItem) {
  resetTarget.value = user
  resetVisible.value = true
}

async function handleSubmit(payload: UserModule.CreateUserDto | UserModule.UpdateUserDto) {
  submitLoading.value = true
  try {
    if (formMode.value === 'create') {
      await usersControllerCreate(payload as UserModule.CreateUserDto)
      $baseMessage('用户创建成功')
    } else if (currentUser.value?.id) {
      await usersControllerUpdate(currentUser.value.id, payload)
      $baseMessage('用户更新成功')
    }
    formVisible.value = false
    await fetchList()
  } finally {
    submitLoading.value = false
  }
}

async function handleToggleStatus(user: UserModule.UserListItem) {
  actionUserId.value = user.id
  try {
    await usersControllerUpdateStatus(user.id, { status: !user.status })
    $baseMessage(user.status ? '用户已禁用' : '用户已启用')
    await fetchList()
  } finally {
    actionUserId.value = ''
  }
}

async function handleResetPassword(payload: UserModule.ResetUserPasswordDto) {
  if (!resetTarget.value?.id) return
  submitLoading.value = true
  try {
    await usersControllerResetPassword(resetTarget.value.id, payload)
    $baseMessage('密码重置成功')
    resetVisible.value = false
  } finally {
    submitLoading.value = false
  }
}

async function handleDisableConfirm(user: UserModule.UserListItem) {
  const ok = await $asyncBaseConfirm({
    title: user.status ? '禁用用户' : '启用用户',
    content: `确认${user.status ? '禁用' : '启用'}用户「${user.nickname || user.phoneNumber}」吗？`,
  })
  if (!ok) return
  await handleToggleStatus(user)
}

onMounted(() => {
  fetchList()
})
</script>

<template>
  <PageContainer fluid>
    <div class="page-shell">
      <ElCard shadow="never" class="toolbar-card">
        <div class="page-header">
          <div>
            <div class="page-title">用户管理</div>
            <div class="page-desc">支持用户查询、创建编辑、启停控制与密码重置。</div>
          </div>
          <ElButton type="primary" @click="openCreate">新增用户</ElButton>
        </div>
        <div class="search-bar">
          <ElInput v-model="query.keyword" placeholder="搜索手机号/昵称" class="search-keyword" @keyup.enter="handleSearch" />
          <ElSelect v-model="statusValue" class="search-status">
            <ElOption label="全部" value="" />
            <ElOption label="启用" value="true" />
            <ElOption label="禁用" value="false" />
          </ElSelect>
          <ElButton @click="handleSearch">查询</ElButton>
          <ElButton @click="handleReset">重置</ElButton>
        </div>
      </ElCard>

      <ElCard shadow="never">
        <ElTable :data="list" v-loading="loading" border>
          <ElTableColumn prop="phoneNumber" label="手机号" min-width="140" />
          <ElTableColumn prop="nickname" label="昵称" min-width="120">
            <template #default="{ row }">{{ row.nickname || '-' }}</template>
          </ElTableColumn>
          <ElTableColumn label="角色" width="100" align="center">
            <template #default="{ row }">
              <ElTag :type="roleTagType(row.role)">{{ roleLabel(row.role) }}</ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn label="状态" width="100" align="center">
            <template #default="{ row }">
              <ElTag :type="row.status ? 'success' : 'info'">{{ row.status ? '启用' : '禁用' }}</ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="lastLoginAt" label="最近登录" min-width="160">
            <template #default="{ row }">{{ formatTime(row.lastLoginAt) }}</template>
          </ElTableColumn>
          <ElTableColumn prop="lastLoginIp" label="登录IP" min-width="140">
            <template #default="{ row }">{{ row.lastLoginIp || '-' }}</template>
          </ElTableColumn>
          <ElTableColumn prop="remark" label="备注" min-width="160">
            <template #default="{ row }">{{ row.remark || '-' }}</template>
          </ElTableColumn>
          <ElTableColumn label="操作" min-width="260" fixed="right">
            <template #default="{ row }">
              <div class="action-group">
                <ElButton link type="primary" @click="openEdit(row)">编辑</ElButton>
                <ElButton link type="primary" @click="openResetPassword(row)">重置密码</ElButton>
                <ElButton link :type="row.status ? 'warning' : 'success'" :loading="actionUserId === row.id" @click="handleDisableConfirm(row)">
                  {{ row.status ? '禁用' : '启用' }}
                </ElButton>
              </div>
            </template>
          </ElTableColumn>
        </ElTable>
        <div class="pagination-bar">
          <ElPagination v-model:current-page="query.page" v-model:page-size="query.pageSize" background layout="total, prev, pager, next, sizes" :page-sizes="[10,20,50]" :total="total" @change="fetchList" />
        </div>
      </ElCard>
    </div>

    <UserFormDialog v-model="formVisible" :mode="formMode" :user="currentUser" :loading="submitLoading" @submit="handleSubmit" />
    <ResetPasswordDialog v-model="resetVisible" :user="resetTarget" :loading="submitLoading" @submit="handleResetPassword" />
  </PageContainer>
</template>

<style scoped lang="scss">
.page-shell { display: flex; flex-direction: column; gap: 16px; }
.toolbar-card :deep(.el-card__body) { display: flex; flex-direction: column; gap: 16px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.page-title { font-size: 24px; font-weight: 600; }
.page-desc { margin-top: 8px; color: var(--el-text-color-regular); }
.search-bar { display: flex; flex-wrap: wrap; gap: 12px; }
.search-keyword { width: min(260px, 100%); }
.search-status { width: 140px; }
.action-group { display: flex; flex-wrap: wrap; gap: 4px 8px; }
.pagination-bar { display: flex; justify-content: flex-end; margin-top: 16px; }
@media (width <= 768px) {
  .page-header { flex-direction: column; }
  .search-keyword, .search-status { width: 100%; }
  .pagination-bar { justify-content: center; }
}
</style>
