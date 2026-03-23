<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { authControllerLogin, authControllerRegister } from '@/api/LoginModule/Auth'
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

// Login Form
const form = reactive({
  phoneNumber: '13488888888',
  password: '123456',
})

// Register Form
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
      validator: (rule, value, callback) => {
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
    // result is likely the data object directly due to interceptor
    const token = result?.accessToken || result?.token || ''

    if (token) {
      setToken(String(token))
      $baseMessage(t('登录成功'), 'success')

      const redirect = (route.query?.redirect as string) || '/'
      router.replace(redirect)
    } else {
      // Handle case where token is missing in successful response if needed
      $baseMessage(t('登录失败，未获取到令牌'), 'error')
    }
  } catch (e: any) {
    // Error handled by interceptor or here
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
  // Reset forms
  formRef.value?.resetFields()
  registerFormRef.value?.resetFields()
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="title">{{ isLogin ? t('系统登录') : t('用户注册') }}</div>

      <!-- Login Form -->
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

      <!-- Register Form -->
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
</template>

<style scoped lang="scss">
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: var(--el-bg-color);
  background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
}

.login-card {
  width: min(400px, 92vw);
  padding: 32px;
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgb(0, 0, 0, 0.08);
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
  margin-top: -10px; /* Adjust spacing as needed */
}

@media (width <= 768px) {
  .login-container {
    padding: 20px 12px;
    background-position: center 80px;
    background-size: auto 70%;
  }

  .login-card {
    padding: 20px 16px;
    border-radius: 10px;
  }

  .title {
    margin-bottom: 16px;
    font-size: 20px;
  }
}
</style>
