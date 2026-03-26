<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { authControllerLogin, authControllerRegister } from '@/api/LoginModule/Auth'
import IcpFooter from '@/components/IcpFooter.vue'
import { setToken } from '@/utils/token'
import { $baseMessage } from '@/composables/useMessage'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()
const loading = ref(false)
const isLogin = ref(true)

const form = reactive({
  phoneNumber: '13488888888',
  password: '123456',
})

const registerForm = reactive({
  phoneNumber: '13488888888',
  password: '',
  confirmPassword: '',
  nickname: '',
})

const rules: FormRules = {
  phoneNumber: [{ required: true, message: t('请输入手机号'), trigger: 'blur' }],
  password: [{ required: true, message: t('请输入密码'), trigger: 'blur' }],
}

const registerRules: FormRules = {
  phoneNumber: [{ required: true, message: t('请输入手机号'), trigger: 'blur' }],
  password: [{ required: true, message: t('请输入密码'), trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: t('请再次输入密码'), trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error(t('两次输入密码不一致')))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

async function onLogin() {
  try {
    loading.value = true
    await formRef.value?.validate()
    const result = await authControllerLogin({
      phoneNumber: form.phoneNumber,
      password: form.password,
    })
    const token = result?.accessToken || result?.token || ''

    if (token) {
      setToken(String(token))
      $baseMessage(t('登录成功'), 'success')

      const redirect = (route.query?.redirect as string) || '/'
      router.replace(redirect)
    } else {
      $baseMessage(t('登录失败，未获取到令牌'), 'error')
    }
  } catch (e: any) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function onRegister() {
  try {
    loading.value = true
    await registerFormRef.value?.validate()
    await authControllerRegister({
      phoneNumber: registerForm.phoneNumber,
      password: registerForm.password,
      nickname: registerForm.nickname,
    })
    $baseMessage(t('注册成功，请登录'), 'success')
    toggleMode()
  } catch (e: any) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function toggleMode() {
  isLogin.value = !isLogin.value
  formRef.value?.resetFields()
  registerFormRef.value?.resetFields()
}
</script>

<template>
  <div class="login-page">
    <div class="login-container va-fullscreen-page">
      <div class="login-card">
        <div class="title">{{ isLogin ? t('系统登录') : t('用户注册') }}</div>

        <ElForm
          v-if="isLogin"
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          size="large"
        >
          <ElFormItem :label="t('手机号')" prop="phoneNumber">
            <ElInput v-model="form.phoneNumber" :placeholder="t('请输入手机号')" clearable />
          </ElFormItem>
          <ElFormItem :label="t('密码')" prop="password">
            <ElInput
              v-model="form.password"
              :placeholder="t('请输入密码')"
              show-password
              clearable
              type="password"
              @keyup.enter="onLogin"
            />
          </ElFormItem>
          <ElFormItem>
            <ElButton type="primary" :loading="loading" class="w-full" @click="onLogin">
              {{ t('登录') }}
            </ElButton>
          </ElFormItem>
          <div class="form-footer">
            <ElLink type="primary" @click="toggleMode">{{ t('没有账号？去注册') }}</ElLink>
          </div>
        </ElForm>

        <ElForm
          v-else
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          label-position="top"
          size="large"
        >
          <ElFormItem :label="t('手机号')" prop="phoneNumber">
            <ElInput v-model="registerForm.phoneNumber" :placeholder="t('请输入手机号')" clearable />
          </ElFormItem>
          <ElFormItem :label="t('昵称')" prop="nickname">
            <ElInput v-model="registerForm.nickname" :placeholder="t('请输入昵称')" clearable />
          </ElFormItem>
          <ElFormItem :label="t('密码')" prop="password">
            <ElInput
              v-model="registerForm.password"
              :placeholder="t('请输入密码')"
              show-password
              clearable
              type="password"
            />
          </ElFormItem>
          <ElFormItem :label="t('确认密码')" prop="confirmPassword">
            <ElInput
              v-model="registerForm.confirmPassword"
              :placeholder="t('请再次输入密码')"
              show-password
              clearable
              type="password"
              @keyup.enter="onRegister"
            />
          </ElFormItem>
          <ElFormItem>
            <ElButton type="primary" :loading="loading" class="w-full" @click="onRegister">
              {{ t('注册') }}
            </ElButton>
          </ElFormItem>
          <div class="form-footer">
            <ElLink type="primary" @click="toggleMode">{{ t('已有账号？去登录') }}</ElLink>
          </div>
        </ElForm>
      </div>
    </div>

    <IcpFooter class="login-icp" />
  </div>
</template>

<style scoped lang="scss">
.login-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--el-bg-color);
}

.login-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-bg-color);
  background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
  background-repeat: no-repeat;
  background-position: center 88px;
  background-size: min(100%, 1200px);
}

.login-card {
  width: min(100%, 420px);
  padding: clamp(24px, 5vw, 32px);
  background: color-mix(in srgb, var(--el-bg-color-overlay) 88%, transparent);
  border: 1px solid color-mix(in srgb, var(--el-border-color-lighter) 80%, transparent);
  border-radius: var(--va-radius-lg);
  box-shadow: var(--va-shadow-elevated);
  backdrop-filter: blur(12px);
}

.title {
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  text-align: center;
}

.w-full {
  width: 100%;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
}

.login-icp {
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
}

@media (width <= 768px) {
  .login-container {
    align-items: flex-start;
    padding: 20px 12px;
    background-position: center 80px;
    background-size: auto 70%;
  }

  .login-card {
    padding: 20px 16px;
    margin-top: clamp(56px, 12vh, 112px);
    border-radius: var(--va-radius-md);
    backdrop-filter: blur(8px);
  }

  .title {
    margin-bottom: 16px;
    font-size: 20px;
  }

  .form-footer {
    justify-content: center;
  }
}

@supports not (
  (
    backdrop-filter: blur(2px),
  )
) {
  .login-card {
    background: var(--el-bg-color-overlay);
  }
}
</style>
