<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { loginUser } from '@/api/Pet/user/user'
import { setToken } from '@/utils/token'
import { $baseMessage } from '@/composables/useMessage'

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()
const loading = ref(false)
const form = ref({
  username: 'admin',
  password: '123456',
})

const rules: FormRules = {
  username: [{ required: true, message: $t('请输入用户名'), trigger: 'blur' }],
  password: [{ required: true, message: $t('请输入密码'), trigger: 'blur' }],
}

async function onSubmit() {
  try {
    loading.value = true
    await formRef.value?.validate()
    const token = await loginUser({
      username: form.value.username,
      password: form.value.password,
    })
    // 登录成功，保存 token
    setToken(String(token || ''))
    $baseMessage('登录成功', 'success')

    // 读取重定向地址（如存在）
    const redirect = (route.query?.redirect as string) || '/'
    // 为确保路由守卫拿到最新 token，使用硬跳转
    window.location.replace(redirect)
  } catch (e: any) {
    if (e?.message) {
      $baseMessage(e.message, 'error')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="title">{{ $t('系统登录') }}</div>
      <ElForm ref="formRef" :model="form" :rules="rules" label-position="top">
        <ElFormItem :label="$t('用户名')" prop="username">
          <ElInput v-model="form.username" :placeholder="$t('请输入用户名')" clearable />
        </ElFormItem>
        <ElFormItem :label="$t('密码')" prop="password">
          <ElInput
            v-model="form.password"
            :placeholder="$t('请输入密码')"
            show-password
            clearable
            type="password"
          />
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" :loading="loading" class="w-full" @click="onSubmit">
            {{ $t('登录') }}
          </ElButton>
        </ElFormItem>
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
}

.login-card {
  width: 360px;
  padding: 28px 24px 8px;
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgb(0, 0, 0, 0.08);
}

.title {
  margin-bottom: 18px;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  text-align: center;
}

.w-full {
  width: 100%;
}
</style>
