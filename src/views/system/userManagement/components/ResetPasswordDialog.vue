<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    loading?: boolean
    user?: UserModule.UserListItem | null
  }>(),
  {
    loading: false,
    user: null,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [payload: UserModule.ResetUserPasswordDto]
}>()

const formRef = ref<FormInstance>()
const form = reactive({
  newPassword: '',
  confirmPassword: '',
})

const rules: FormRules = {
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度需为 6-20 位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (!value) {
          callback(new Error('请确认新密码'))
          return
        }
        if (value !== form.newPassword) {
          callback(new Error('两次输入的密码不一致'))
          return
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
}

watch(
  () => props.modelValue,
  (visible) => {
    if (!visible) return
    form.newPassword = ''
    form.confirmPassword = ''
    formRef.value?.clearValidate()
  }
)

function closeDialog() {
  emit('update:modelValue', false)
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  emit('submit', { newPassword: form.newPassword })
}
</script>

<template>
  <ElDialog :model-value="modelValue" title="重置密码" width="480px" @close="closeDialog">
    <ElAlert
      :title="`即将为 ${user?.nickname || user?.phoneNumber || '该用户'} 重置密码`"
      type="warning"
      :closable="false"
      show-icon
    />
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="96px" class="mt-4">
      <ElFormItem label="新密码" prop="newPassword">
        <ElInput v-model="form.newPassword" show-password type="password" placeholder="请输入新密码" />
      </ElFormItem>
      <ElFormItem label="确认密码" prop="confirmPassword">
        <ElInput v-model="form.confirmPassword" show-password type="password" placeholder="请再次输入新密码" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="closeDialog">取消</ElButton>
        <ElButton type="primary" :loading="loading" @click="handleSubmit">确认重置</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style scoped lang="scss">
.mt-4 {
  margin-top: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
