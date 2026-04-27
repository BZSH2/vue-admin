<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  roleControllerCreate,
  roleControllerFindAll,
  roleControllerRemove,
  roleControllerUpdate,
  roleControllerUpdateStatus,
} from '@/api/RoleModule/Role'
import { $asyncBaseConfirm, $baseMessage } from '@/composables/useMessage'
import RoleFormDialog from './components/RoleFormDialog.vue'
import RoleMembersDialog from './components/RoleMembersDialog.vue'

const loading = ref(false)
const submitLoading = ref(false)
const actionRoleId = ref('')
const list = ref<RoleModule.RoleDetailDto[]>([])
const total = ref(0)
const query = reactive<RoleModule.QueryRoleDto>({
  page: 1,
  pageSize: 10,
  keyword: '',
})

const formVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const currentRole = ref<RoleModule.RoleDetailDto | null>(null)
const memberVisible = ref(false)
const currentMemberRole = ref<RoleModule.RoleDetailDto | null>(null)

const statusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: 'true' },
  { label: '停用', value: 'false' },
]

const statusValue = computed({
  get: () => {
    if (typeof query.enabled === 'boolean') {
      return String(query.enabled)
    }
    return ''
  },
  set: (value: string) => {
    if (value === '') {
      query.enabled = undefined
      return
    }
    query.enabled = value === 'true'
  },
})

function formatTime(value?: string) {
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
    const res = await roleControllerFindAll(query)
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
  query.enabled = undefined
  fetchList()
}

function openCreate() {
  formMode.value = 'create'
  currentRole.value = null
  formVisible.value = true
}

function openEdit(role: RoleModule.RoleDetailDto) {
  formMode.value = 'edit'
  currentRole.value = role
  formVisible.value = true
}

function openMembers(role: RoleModule.RoleDetailDto) {
  currentMemberRole.value = role
  memberVisible.value = true
}

async function handleSubmit(payload: RoleModule.CreateRoleDto | RoleModule.UpdateRoleDto) {
  submitLoading.value = true
  try {
    if (formMode.value === 'create') {
      await roleControllerCreate(payload as RoleModule.CreateRoleDto)
      $baseMessage('角色创建成功')
    } else if (currentRole.value?.id) {
      await roleControllerUpdate(currentRole.value.id, payload)
      $baseMessage('角色更新成功')
    }

    formVisible.value = false
    await fetchList()
  } finally {
    submitLoading.value = false
  }
}

async function handleToggleStatus(role: RoleModule.RoleDetailDto) {
  actionRoleId.value = role.id
  try {
    await roleControllerUpdateStatus(role.id, { enabled: !role.enabled })
    $baseMessage(role.enabled ? '角色已停用' : '角色已启用')
    await fetchList()
  } finally {
    actionRoleId.value = ''
  }
}

async function handleRemove(role: RoleModule.RoleDetailDto) {
  const ok = await $asyncBaseConfirm({
    title: '删除角色',
    content: `确认删除角色「${role.name}」吗？`,
  })
  if (!ok) {
    return
  }

  actionRoleId.value = role.id
  try {
    await roleControllerRemove(role.id)
    $baseMessage('角色删除成功')
    await fetchList()
  } finally {
    actionRoleId.value = ''
  }
}

onMounted(() => {
  fetchList()
})
</script>

<template>
  <div class="role-management-page">
    <ElCard shadow="never" class="toolbar-card">
      <div class="page-header">
        <div>
          <div class="page-title">角色管理</div>
          <div class="page-desc">支持角色列表、创建编辑、启停控制和成员管理。</div>
        </div>
        <ElButton type="primary" @click="openCreate">新增角色</ElButton>
      </div>

      <div class="search-bar">
        <ElInput
          v-model="query.keyword"
          clearable
          placeholder="搜索角色名称或编码"
          class="search-bar__keyword"
          @keyup.enter="handleSearch"
        />
        <ElSelect v-model="statusValue" class="search-bar__status">
          <ElOption
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </ElSelect>
        <ElButton @click="handleSearch">查询</ElButton>
        <ElButton @click="handleReset">重置</ElButton>
      </div>
    </ElCard>

    <ElCard shadow="never">
      <ElTable :data="list" v-loading="loading" border>
        <ElTableColumn prop="name" label="角色名称" min-width="160" />
        <ElTableColumn prop="code" label="角色编码" min-width="160" />
        <ElTableColumn label="状态" width="100" align="center">
          <template #default="{ row }">
            <ElTag :type="row.enabled ? 'success' : 'info'">
              {{ row.enabled ? '启用' : '停用' }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="属性" min-width="180">
          <template #default="{ row }">
            <div class="tag-group">
              <ElTag v-if="row.isSystem" type="danger" effect="plain">系统角色</ElTag>
              <ElTag v-if="row.isDefault" type="warning" effect="plain">默认角色</ElTag>
              <span v-if="!row.isSystem && !row.isDefault" class="text-muted">普通角色</span>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="memberCount" label="成员数" width="100" align="center" />
        <ElTableColumn prop="description" label="描述" min-width="220">
          <template #default="{ row }">
            {{ row.description || '-' }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="updatedAt" label="更新时间" min-width="180">
          <template #default="{ row }">
            {{ formatTime(row.updatedAt) }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" min-width="260" fixed="right">
          <template #default="{ row }">
            <div class="action-group">
              <ElButton link type="primary" @click="openEdit(row)">编辑</ElButton>
              <ElButton link type="primary" @click="openMembers(row)">成员</ElButton>
              <ElButton
                link
                :type="row.enabled ? 'warning' : 'success'"
                :loading="actionRoleId === row.id"
                @click="handleToggleStatus(row)"
              >
                {{ row.enabled ? '停用' : '启用' }}
              </ElButton>
              <ElButton
                link
                type="danger"
                :disabled="row.isSystem"
                :loading="actionRoleId === row.id"
                @click="handleRemove(row)"
              >
                删除
              </ElButton>
            </div>
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
  </div>

  <RoleFormDialog
    v-model="formVisible"
    :mode="formMode"
    :role="currentRole"
    :loading="submitLoading"
    @submit="handleSubmit"
  />

  <RoleMembersDialog v-model="memberVisible" :role="currentMemberRole" @changed="fetchList" />
</template>

<style scoped lang="scss">
.role-management-page {
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
  align-items: flex-start;
  justify-content: space-between;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--el-text-color-primary);
}

.page-desc {
  margin-top: 8px;
  color: var(--el-text-color-regular);
}

.search-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;

  &__keyword {
    width: min(280px, 100%);
  }

  &__status {
    width: 140px;
  }
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.text-muted {
  color: var(--el-text-color-secondary);
}

.action-group {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  align-items: center;
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

  .search-bar {
    align-items: stretch;

    &__keyword,
    &__status {
      width: 100%;
    }
  }

  .pagination-bar {
    justify-content: center;
  }
}
</style>
