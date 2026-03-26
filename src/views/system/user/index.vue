<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { authControllerChangePassword } from '@/api/ProfileModule/Auth'
import PageContainer from '@/components/PageContainer.vue'
import { $baseMessage } from '@/composables/useMessage'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const loadingProfile = ref(false)
const savingPassword = ref(false)
const passwordFormRef = ref<FormInstance>()
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const profile = computed(() => userStore.profile)
const profileInitial = computed(() => {
  const source = profile.value?.nickname || profile.value?.phoneNumber || 'User'
  return source.trim().charAt(0).toUpperCase()
})
const roleLabel = computed(() => {
  if (profile.value?.role === 'admin') {
    return '管理员'
  }
  if (profile.value?.role === 'user') {
    return '普通用户'
  }
  return '未设置'
})
const roleTagType = computed(() => (profile.value?.role === 'admin' ? 'danger' : 'info'))
const profileRows = computed(() => [
  { label: '用户 ID', value: profile.value?.id ? String(profile.value.id) : '未提供' },
  { label: '手机号', value: profile.value?.phoneNumber || '未提供' },
  { label: '昵称', value: profile.value?.nickname || '未提供' },
  { label: '角色', value: roleLabel.value },
  { label: '创建时间', value: formatDateTime(profile.value?.createdAt) },
  { label: '更新时间', value: formatDateTime(profile.value?.updatedAt) },
])

const passwordRules: FormRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度需为 6-20 位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入新密码'))
          return
        }
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的新密码不一致'))
          return
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
}

function formatDateTime(value?: string | Date | null) {
  if (!value) {
    return '未提供'
  }

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

async function loadProfile(force = false) {
  loadingProfile.value = true
  try {
    await userStore.ensureProfile(force)
  } catch (error) {
    console.error(error)
  } finally {
    loadingProfile.value = false
  }
}

async function handleChangePassword() {
  try {
    await passwordFormRef.value?.validate()
    savingPassword.value = true

    const result = (await authControllerChangePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    })) as unknown as ProfileModule.OperationMessageDto

    $baseMessage(result?.message || '密码修改成功', 'success')
    passwordFormRef.value?.resetFields()
  } catch (error) {
    console.error(error)
  } finally {
    savingPassword.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <PageContainer fluid>
    <div class="system-user-page">
      <section class="hero-card">
        <div>
          <p class="eyebrow">SYSTEM USER</p>
          <h1 class="hero-title">用户管理</h1>
          <p class="hero-desc">
            当前接口文档只开放了个人资料与修改密码能力，所以这里优先把“当前登录用户”的信息维护链路做完整。
          </p>
        </div>
        <ElButton :loading="loadingProfile" plain type="primary" @click="loadProfile(true)">
          刷新资料
        </ElButton>
      </section>

      <div class="content-grid">
        <section class="panel profile-panel">
          <div class="panel-head">
            <div>
              <h2>当前用户资料</h2>
              <p>数据来自 `/api/auth/profile`，会在进入系统后自动拉取，也支持这里手动刷新。</p>
            </div>
            <ElTag :type="roleTagType" effect="dark">{{ roleLabel }}</ElTag>
          </div>

          <ElSkeleton :loading="loadingProfile" animated>
            <template #template>
              <div class="profile-skeleton">
                <div class="profile-skeleton-avatar" />
                <div class="profile-skeleton-lines">
                  <ElSkeletonItem variant="h3" />
                  <ElSkeletonItem variant="text" />
                  <ElSkeletonItem variant="text" />
                  <ElSkeletonItem variant="text" />
                </div>
              </div>
            </template>

            <template #default>
              <template v-if="profile">
                <div class="profile-summary">
                  <div class="avatar-shell">
                    <img
                      v-if="profile.avatar"
                      :src="profile.avatar"
                      alt="用户头像"
                      class="avatar-image"
                    />
                    <span v-else class="avatar-fallback">{{ profileInitial }}</span>
                  </div>

                  <div class="summary-copy">
                    <div class="summary-name">{{
                      profile.nickname || profile.phoneNumber || '未命名用户'
                    }}</div>
                    <div class="summary-subtitle">手机号 {{ profile.phoneNumber || '未提供' }}</div>
                    <div class="summary-role">角色标识：{{ profile.role || '未设置' }}</div>
                  </div>
                </div>

                <div class="info-grid">
                  <div v-for="item in profileRows" :key="item.label" class="info-item">
                    <span class="info-label">{{ item.label }}</span>
                    <span class="info-value">{{ item.value }}</span>
                  </div>
                </div>
              </template>

              <ElEmpty v-else description="暂未获取到当前用户信息" />
            </template>
          </ElSkeleton>
        </section>

        <section class="panel password-panel">
          <div class="panel-head">
            <div>
              <h2>修改密码</h2>
              <p>调用 `/api/auth/change-password`。提交成功后会清空表单，便于继续其他操作。</p>
            </div>
          </div>

          <ElAlert
            type="info"
            :closable="false"
            title="新密码长度需为 6-20 位，建议包含数字与大小写字母。"
          />

          <ElForm
            ref="passwordFormRef"
            class="password-form"
            label-position="top"
            :model="passwordForm"
            :rules="passwordRules"
          >
            <ElFormItem label="旧密码" prop="oldPassword">
              <ElInput
                v-model="passwordForm.oldPassword"
                clearable
                show-password
                type="password"
                placeholder="请输入旧密码"
              />
            </ElFormItem>

            <ElFormItem label="新密码" prop="newPassword">
              <ElInput
                v-model="passwordForm.newPassword"
                clearable
                show-password
                type="password"
                placeholder="请输入新密码"
              />
            </ElFormItem>

            <ElFormItem label="确认新密码" prop="confirmPassword">
              <ElInput
                v-model="passwordForm.confirmPassword"
                clearable
                show-password
                type="password"
                placeholder="请再次输入新密码"
                @keyup.enter="handleChangePassword"
              />
            </ElFormItem>

            <div class="form-actions">
              <ElButton :disabled="savingPassword" @click="passwordFormRef?.resetFields()">
                重置
              </ElButton>
              <ElButton type="primary" :loading="savingPassword" @click="handleChangePassword">
                保存新密码
              </ElButton>
            </div>
          </ElForm>
        </section>
      </div>
    </div>
  </PageContainer>
</template>

<style scoped lang="scss">
.system-user-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-card,
.panel {
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--el-color-primary-light-9) 72%, transparent),
      transparent 58%
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
  color: var(--el-color-primary);
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

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
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

.profile-summary {
  display: flex;
  gap: 16px;
  align-items: center;
  min-width: 0;
  padding: 16px;
  margin-bottom: 16px;
  background: color-mix(in srgb, var(--el-fill-color-light) 78%, transparent);
  border: 1px solid color-mix(in srgb, var(--el-border-color-lighter) 72%, transparent);
  border-radius: var(--va-radius-md);
}

.avatar-shell,
.profile-skeleton-avatar {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 72px;
  height: 72px;
  overflow: hidden;
  color: var(--el-color-white);
  background:
    radial-gradient(
      circle at top,
      color-mix(in srgb, var(--el-color-primary-light-3) 70%, #fff),
      transparent 62%
    ),
    linear-gradient(
      135deg,
      var(--el-color-primary),
      color-mix(in srgb, var(--el-color-primary-dark-2) 76%, #000)
    );
  border-radius: 24px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  font-size: 28px;
  font-weight: 700;
}

.summary-copy {
  display: flex;
  flex: 1;
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
.summary-role {
  line-height: 1.6;
  color: var(--el-text-color-regular);
  overflow-wrap: anywhere;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 14px;
  background: color-mix(in srgb, var(--el-bg-color) 72%, transparent);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--va-radius-md);
}

.info-label {
  font-size: var(--va-font-size-xs);
  font-weight: 600;
  color: var(--el-text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.info-value {
  font-size: 15px;
  line-height: 1.6;
  color: var(--el-text-color-primary);
  overflow-wrap: anywhere;
}

.profile-skeleton {
  display: flex;
  gap: 16px;
  align-items: center;
}

.profile-skeleton-lines {
  display: grid;
  flex: 1;
  gap: 12px;
}

.password-form {
  margin-top: 18px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

@media (width <= 900px) {
  .content-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (width <= 768px) {
  .system-user-page {
    gap: 12px;
  }

  .hero-card,
  .panel {
    padding: 16px;
    border-radius: var(--va-radius-md);
  }

  .hero-card,
  .panel-head,
  .profile-summary,
  .form-actions {
    flex-direction: column;
  }

  .hero-card,
  .panel-head {
    align-items: stretch;
  }

  .info-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .avatar-shell,
  .profile-skeleton-avatar {
    width: 64px;
    height: 64px;
    border-radius: 20px;
  }

  .summary-name {
    font-size: var(--el-font-size-extra-large);
  }

  .form-actions > * {
    width: 100%;
  }
}
</style>
