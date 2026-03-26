<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import {
  rolesControllerGetOptions,
  rolesControllerGetUserRole,
  rolesControllerUpdateUserRole,
} from '@/api/RoleModule/Roles'
import PageContainer from '@/components/PageContainer.vue'
import { $baseMessage } from '@/composables/useMessage'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const queryFormRef = ref<FormInstance>()
const updateFormRef = ref<FormInstance>()
const loadingOptions = ref(false)
const queryingUser = ref(false)
const savingRole = ref(false)
const roleOptions = ref<RoleModule.RoleOptionDto[]>([])
const roleDetail = ref<RoleModule.UserRoleDetailDto | null>(null)

const queryForm = reactive({
  userId: '',
})

const updateForm = reactive<{
  role: RoleModule.UserRoleDetailDto['role'] | ''
}>({
  role: '',
})

const currentUserId = computed(() =>
  userStore.profile?.id === undefined || userStore.profile?.id === null
    ? ''
    : String(userStore.profile.id)
)
const roleChanged = computed(() =>
  Boolean(roleDetail.value && updateForm.role !== roleDetail.value.role)
)
const availableRoleText = computed(
  () => roleOptions.value.map((item) => item.label).join(' / ') || '暂未加载'
)
const roleTagTypeMap: Record<string, 'danger' | 'info'> = {
  admin: 'danger',
  user: 'info',
}

const queryRules: FormRules = {
  userId: [{ required: true, message: '请输入要查询的用户 ID', trigger: 'blur' }],
}

const updateRules: FormRules = {
  role: [{ required: true, message: '请选择目标角色', trigger: 'change' }],
}

async function loadRoleOptions() {
  loadingOptions.value = true
  try {
    const result = (await rolesControllerGetOptions({
      showError: false,
      retry: 0,
    })) as unknown as RoleModule.RoleOptionDto[]

    roleOptions.value = Array.isArray(result) ? result : []
  } catch (error) {
    console.error(error)
  } finally {
    loadingOptions.value = false
  }
}

async function queryUserRole() {
  try {
    await queryFormRef.value?.validate()
    queryingUser.value = true

    const result = (await rolesControllerGetUserRole(
      { userId: queryForm.userId.trim() },
      { retry: 0 }
    )) as unknown as RoleModule.UserRoleDetailDto

    roleDetail.value = result
    updateForm.role = result?.role || ''
  } catch (error) {
    roleDetail.value = null
    updateForm.role = ''
    console.error(error)
  } finally {
    queryingUser.value = false
  }
}

async function updateUserRole() {
  if (!roleDetail.value) {
    return
  }

  try {
    await updateFormRef.value?.validate()
    savingRole.value = true

    const result = (await rolesControllerUpdateUserRole(
      { userId: roleDetail.value.userId },
      { role: updateForm.role as RoleModule.UpdateUserRoleDto['role'] },
      { retry: 0 }
    )) as unknown as RoleModule.UserRoleDetailDto

    roleDetail.value = result
    updateForm.role = result.role
    $baseMessage('角色更新成功', 'success')

    if (currentUserId.value && result.userId === currentUserId.value) {
      await userStore.ensureProfile(true)
    }
  } catch (error) {
    console.error(error)
  } finally {
    savingRole.value = false
  }
}

function useCurrentUserId() {
  if (currentUserId.value) {
    queryForm.userId = currentUserId.value
  }
}

function resetResult() {
  roleDetail.value = null
  updateForm.role = ''
}

onMounted(async () => {
  await Promise.all([loadRoleOptions(), userStore.ensureProfile()])

  if (!queryForm.userId && currentUserId.value) {
    queryForm.userId = currentUserId.value
  }
})
</script>

<template>
  <PageContainer fluid>
    <div class="system-role-page">
      <section class="hero-card">
        <div>
          <p class="eyebrow">SYSTEM ROLE</p>
          <h1 class="hero-title">角色管理</h1>
          <p class="hero-desc">
            当前文档只提供“按用户 ID
            查询角色”和“更新指定用户角色”，所以这里的交互重点是快速定位单个用户并完成角色调整。
          </p>
        </div>
        <div class="hero-side">
          <span class="hero-caption">可用角色</span>
          <strong>{{ availableRoleText }}</strong>
        </div>
      </section>

      <div class="content-grid">
        <section class="panel">
          <div class="panel-head">
            <div>
              <h2>查询目标用户</h2>
              <p>接口需要管理员权限，且必须传入明确的用户 ID。</p>
            </div>
          </div>

          <ElAlert
            type="warning"
            :closable="false"
            title="当前接口不包含用户列表，所以这里采用“输入用户 ID 后单查”的管理方式。"
          />

          <ElForm
            ref="queryFormRef"
            class="query-form"
            label-position="top"
            :model="queryForm"
            :rules="queryRules"
          >
            <ElFormItem label="用户 ID" prop="userId">
              <ElInput
                v-model="queryForm.userId"
                clearable
                placeholder="请输入要查询的用户 ID"
                @keyup.enter="queryUserRole"
              >
                <template #append>
                  <ElButton :loading="queryingUser" @click="queryUserRole">查询</ElButton>
                </template>
              </ElInput>
            </ElFormItem>

            <div class="query-actions">
              <ElButton :disabled="!currentUserId" @click="useCurrentUserId"
                >使用我的用户 ID</ElButton
              >
              <ElButton :disabled="!roleDetail" @click="resetResult">清空结果</ElButton>
            </div>
          </ElForm>

          <div class="role-chip-list">
            <span class="chip-label">角色选项</span>
            <ElSkeleton :loading="loadingOptions" animated>
              <template #template>
                <div class="chip-skeleton-row">
                  <ElSkeletonItem variant="button" />
                  <ElSkeletonItem variant="button" />
                </div>
              </template>

              <template #default>
                <div class="chip-wrap">
                  <ElTag
                    v-for="item in roleOptions"
                    :key="item.value"
                    :type="roleTagTypeMap[item.value] || 'info'"
                    effect="light"
                    round
                  >
                    {{ item.label }} ({{ item.value }})
                  </ElTag>
                </div>
              </template>
            </ElSkeleton>
          </div>
        </section>

        <section class="panel result-panel">
          <div class="panel-head">
            <div>
              <h2>角色详情与更新</h2>
              <p>先查询，再修改。保存成功后，本页会自动同步展示最新角色。</p>
            </div>
          </div>

          <ElSkeleton :loading="queryingUser" animated>
            <template #template>
              <div class="result-skeleton">
                <ElSkeletonItem variant="text" />
                <ElSkeletonItem variant="h3" />
                <ElSkeletonItem variant="text" />
                <ElSkeletonItem variant="text" />
              </div>
            </template>

            <template #default>
              <template v-if="roleDetail">
                <div class="user-summary">
                  <div class="summary-main">
                    <div class="summary-name">{{
                      roleDetail.nickname || roleDetail.phoneNumber
                    }}</div>
                    <div class="summary-subtitle">用户 ID {{ roleDetail.userId }}</div>
                    <div class="summary-subtitle">手机号 {{ roleDetail.phoneNumber }}</div>
                  </div>
                  <ElTag :type="roleTagTypeMap[roleDetail.role] || 'info'" effect="dark">
                    当前角色：{{ roleDetail.role }}
                  </ElTag>
                </div>

                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">昵称</span>
                    <span class="detail-value">{{ roleDetail.nickname || '未提供' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">头像地址</span>
                    <span class="detail-value">{{ roleDetail.avatar || '未提供' }}</span>
                  </div>
                </div>

                <ElForm
                  ref="updateFormRef"
                  class="update-form"
                  label-position="top"
                  :model="updateForm"
                  :rules="updateRules"
                >
                  <ElFormItem label="目标角色" prop="role">
                    <ElSelect v-model="updateForm.role" placeholder="请选择目标角色">
                      <ElOption
                        v-for="item in roleOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </ElSelect>
                  </ElFormItem>

                  <div class="query-actions">
                    <ElButton
                      :disabled="!roleChanged || savingRole"
                      @click="updateForm.role = roleDetail.role"
                    >
                      恢复当前角色
                    </ElButton>
                    <ElButton
                      type="primary"
                      :disabled="!roleChanged"
                      :loading="savingRole"
                      @click="updateUserRole"
                    >
                      保存角色
                    </ElButton>
                  </div>
                </ElForm>
              </template>

              <ElEmpty description="输入用户 ID 后查询角色详情" />
            </template>
          </ElSkeleton>
        </section>
      </div>
    </div>
  </PageContainer>
</template>

<style scoped lang="scss">
.system-role-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-card,
.panel {
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--el-color-danger-light-9) 64%, transparent),
      transparent 56%
    ),
    var(--el-bg-color-overlay);
  border: 1px solid color-mix(in srgb, var(--el-border-color-light) 86%, transparent);
  border-radius: var(--va-radius-lg);
  box-shadow: var(--va-shadow-card);
}

.hero-card {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
  padding: clamp(20px, 4vw, 28px);
}

.eyebrow {
  margin: 0 0 8px;
  font-size: var(--va-font-size-xs);
  font-weight: 700;
  color: var(--el-color-danger);
  letter-spacing: 0.22em;
}

.hero-title,
.panel-head h2 {
  margin: 0;
  font-size: clamp(24px, 4vw, 32px);
  line-height: 1.1;
  color: var(--el-text-color-primary);
}

.hero-desc,
.panel-head p {
  margin: 10px 0 0;
  line-height: 1.7;
  color: var(--el-text-color-regular);
}

.hero-side {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 180px;
  padding: 14px 16px;
  background: color-mix(in srgb, var(--el-fill-color-light) 82%, transparent);
  border: 1px solid color-mix(in srgb, var(--el-border-color-lighter) 76%, transparent);
  border-radius: var(--va-radius-md);
}

.hero-caption,
.detail-label,
.chip-label {
  font-size: var(--va-font-size-xs);
  font-weight: 700;
  color: var(--el-text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(320px, 0.92fr) minmax(0, 1.08fr);
  gap: 16px;
}

.panel {
  min-width: 0;
  padding: 20px;
}

.panel-head {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 18px;
}

.query-form,
.update-form {
  margin-top: 18px;
}

.query-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.role-chip-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 18px;
}

.chip-wrap,
.chip-skeleton-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.result-skeleton {
  display: grid;
  gap: 12px;
}

.user-summary {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px;
  margin-bottom: 16px;
  background: color-mix(in srgb, var(--el-fill-color-light) 76%, transparent);
  border: 1px solid color-mix(in srgb, var(--el-border-color-lighter) 70%, transparent);
  border-radius: var(--va-radius-md);
}

.summary-main {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.summary-name {
  font-size: var(--va-font-size-xl);
  font-weight: 700;
  color: var(--el-text-color-primary);
  overflow-wrap: anywhere;
}

.summary-subtitle,
.detail-value {
  line-height: 1.6;
  color: var(--el-text-color-regular);
  overflow-wrap: anywhere;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 14px;
  background: color-mix(in srgb, var(--el-bg-color) 72%, transparent);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--va-radius-md);
}

@media (width <= 960px) {
  .content-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (width <= 768px) {
  .system-role-page {
    gap: 12px;
  }

  .hero-card,
  .panel {
    padding: 16px;
    border-radius: var(--va-radius-md);
  }

  .hero-side {
    min-width: 0;
    padding: 16px;
    border-radius: var(--va-radius-md);
  }

  .hero-card,
  .panel-head,
  .user-summary,
  .query-actions {
    flex-direction: column;
  }

  .hero-card,
  .panel-head {
    align-items: stretch;
  }

  .detail-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .query-actions > * {
    width: 100%;
  }
}
</style>
