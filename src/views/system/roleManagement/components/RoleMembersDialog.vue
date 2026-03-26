<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
  roleControllerAddUser,
  roleControllerFindUsers,
  roleControllerRemoveUser,
} from '@/api/RoleModule/Role'
import { usersControllerFindAll } from '@/api/UserModule/User'
import { $asyncBaseConfirm, $baseMessage } from '@/composables/useMessage'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    role?: RoleModule.RoleDetailDto | null
  }>(),
  {
    role: null,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'changed': []
}>()

const loading = ref(false)
const actionLoading = ref(false)
const members = ref<RoleModule.RoleMemberDto[]>([])
const total = ref(0)
const query = reactive<RoleModule.QueryRoleDto>({
  page: 1,
  pageSize: 10,
  keyword: '',
})

const selectedUserId = ref('')
const userSearchLoading = ref(false)
const userOptions = ref<UserModule.UserListItem[]>([])

const dialogTitle = computed(() => `角色成员 · ${props.role?.name || '-'}`)

function closeDialog() {
  emit('update:modelValue', false)
}

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

async function fetchMembers() {
  if (!props.role?.id) {
    return
  }
  loading.value = true
  try {
    const res = await roleControllerFindUsers(props.role.id, query)
    members.value = res.items || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

async function searchUsers(keyword: string) {
  userSearchLoading.value = true
  try {
    const res = await usersControllerFindAll({
      page: 1,
      pageSize: 20,
      keyword,
    })
    const existingIds = new Set(members.value.map((item) => item.userId))
    userOptions.value = (res.items || []).filter((item) => !existingIds.has(item.id))
  } finally {
    userSearchLoading.value = false
  }
}

async function handleAddUser() {
  if (!props.role?.id || !selectedUserId.value) {
    $baseMessage('请先选择要添加的用户', 'warning')
    return
  }

  actionLoading.value = true
  try {
    await roleControllerAddUser(props.role.id, { userId: selectedUserId.value })
    $baseMessage('成员添加成功')
    selectedUserId.value = ''
    userOptions.value = []
    emit('changed')
    await fetchMembers()
  } finally {
    actionLoading.value = false
  }
}

function handleReset() {
  query.keyword = ''
  query.page = 1
  fetchMembers()
}

async function handleRemoveUser(user: RoleModule.RoleMemberDto) {
  if (!props.role?.id) {
    return
  }

  const ok = await $asyncBaseConfirm({
    title: '移除成员',
    content: `确认将 ${user.nickname || user.phoneNumber} 从当前角色移除吗？`,
  })
  if (!ok) {
    return
  }

  actionLoading.value = true
  try {
    await roleControllerRemoveUser(props.role.id, user.userId)
    $baseMessage('成员移除成功')
    emit('changed')
    await fetchMembers()
  } finally {
    actionLoading.value = false
  }
}

watch(
  () => props.modelValue,
  async (visible) => {
    if (!visible) {
      return
    }
    query.page = 1
    query.keyword = ''
    selectedUserId.value = ''
    userOptions.value = []
    await fetchMembers()
  }
)
</script>

<template>
  <ElDialog
    :model-value="modelValue"
    :title="dialogTitle"
    width="980px"
    destroy-on-close
    @close="closeDialog"
  >
    <div class="member-panel">
      <ElCard shadow="never" class="member-toolbar-card">
        <div class="member-toolbar">
          <ElInput
            v-model="query.keyword"
            clearable
            placeholder="搜索当前成员（手机号/昵称）"
            class="member-toolbar__search"
            @keyup.enter="fetchMembers"
          />
          <ElButton @click="fetchMembers">查询</ElButton>
          <ElButton @click="handleReset">重置</ElButton>
          <div class="member-toolbar__spacer" />
          <ElSelect
            v-model="selectedUserId"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="搜索并选择要添加的用户"
            :remote-method="searchUsers"
            :loading="userSearchLoading"
            class="member-toolbar__user-select"
          >
            <ElOption
              v-for="user in userOptions"
              :key="user.id"
              :label="`${user.nickname || '未命名用户'}（${user.phoneNumber}）`"
              :value="user.id"
            />
          </ElSelect>
          <ElButton type="primary" :loading="actionLoading" @click="handleAddUser"
            >添加成员</ElButton
          >
        </div>
      </ElCard>

      <ElCard shadow="never">
        <ElTable :data="members" v-loading="loading" border>
          <ElTableColumn prop="phoneNumber" label="手机号" min-width="160" />
          <ElTableColumn prop="nickname" label="昵称" min-width="140">
            <template #default="{ row }">
              {{ row.nickname || '-' }}
            </template>
          </ElTableColumn>
          <ElTableColumn prop="assignedAt" label="关联时间" min-width="180">
            <template #default="{ row }">
              {{ formatTime(row.assignedAt) }}
            </template>
          </ElTableColumn>
          <ElTableColumn label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <ElButton link type="danger" :loading="actionLoading" @click="handleRemoveUser(row)">
                移除
              </ElButton>
            </template>
          </ElTableColumn>
        </ElTable>

        <div class="member-pagination">
          <ElPagination
            v-model:current-page="query.page"
            v-model:page-size="query.pageSize"
            background
            layout="total, prev, pager, next, sizes"
            :page-sizes="[10, 20, 50]"
            :total="total"
            @change="fetchMembers"
          />
        </div>
      </ElCard>
    </div>
  </ElDialog>
</template>

<style scoped lang="scss">
.member-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.member-toolbar-card :deep(.el-card__body) {
  padding: 16px;
}

.member-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;

  &__search {
    width: min(260px, 100%);
  }

  &__user-select {
    width: min(320px, 100%);
  }

  &__spacer {
    flex: 1;
  }
}

.member-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

@media (width <= 768px) {
  .member-toolbar {
    align-items: stretch;

    &__search,
    &__user-select {
      width: 100%;
    }

    &__spacer {
      display: none;
    }
  }

  .member-pagination {
    justify-content: center;
  }
}
</style>
