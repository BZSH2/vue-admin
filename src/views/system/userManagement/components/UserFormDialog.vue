<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    loading?: boolean
    mode: 'create' | 'edit'
    user?: UserModule.UserListItem | null
  }>(),
  {
    loading: false,
    user: null,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [payload: UserModule.CreateUserDto | UserModule.UpdateUserDto]
}>()

const formRef = ref<FormInstance>()
const form = reactive<UserModule.CreateUserDto>({
  phoneNumber: '',
  password: '',
  nickname: '',
  avatar: '',
  status: true,
  remark: '',
})

const rules: FormRules = {
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  nickname: [{ min: 2, max: 20, message: '昵称长度需为 2-20 位', trigger: 'blur' }],
}

const dialogTitle = computed(() => (props.mode === 'create' ? '新增用户' : '编辑用户'))
const passwordRequired = computed(() => props.mode === 'create')

function syncForm() {
  if (props.mode === 'create' || !props.user) {
    form.phoneNumber = ''
    form.password = ''
    form.nickname = ''
    form.avatar = ''
    form.status = true
    form.remark = ''
    return
  }

  form.phoneNumber = props.user.phoneNumber || ''
  form.password = ''
  form.nickname = props.user.nickname || ''
  form.avatar = props.user.avatar || ''
  form.status = props.user.status ?? true
  form.remark = props.user.remark || ''
}

watch(
  () => [props.modelValue, props.user, props.mode],
  ([visible]) => {
    if (!visible) return
    syncForm()
    formRef.value?.clearValidate()
  },
  { immediate: true }
)

function closeDialog() {
  emit('update:modelValue', false)
}

async function handleSubmit() {
  if (props.mode === 'edit' && !form.password) {
    rules.password = []
  } else {
    rules.password = [{ required: true, message: '请输入密码', trigger: 'blur' }]
  }

  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  const payload: UserModule.CreateUserDto | UserModule.UpdateUserDto = {
    phoneNumber: form.phoneNumber.trim(),
    nickname: form.nickname?.trim() || '',
    avatar: form.avatar?.trim() || '',
    status: Boolean(form.status),
    remark: form.remark?.trim() || '',
  }

  if (props.mode === 'create' || form.password) {
    payload.password = form.password
  }

  emit('submit', payload)
}
</script>

<template>
  <ElDialog :model-value="modelValue" :title="dialogTitle" width="640px" @close="closeDialog">
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="96px">
      <ElFormItem label="手机号" prop="phoneNumber">
        <ElInput v-model="form.phoneNumber" :disabled="mode === 'edit'" placeholder="请输入手机号" />
      </ElFormItem>
      <ElFormItem :label="passwordRequired ? '密码' : '密码（留空不改）'" prop="password">
        <ElInput v-model="form.password" show-password type="password" placeholder="请输入密码" />
      </ElFormItem>
      <ElFormItem label="昵称" prop="nickname">
        <ElInput v-model="form.nickname" placeholder="请输入昵称" />
      </ElFormItem>
      <ElFormItem label="头像" prop="avatar">
        <ElInput v-model="form.avatar" placeholder="请输入头像 URL" />
      </ElFormItem>
      <ElFormItem label="状态" prop="status">
        <ElSwitch v-model="form.status" />
      </ElFormItem>
      <ElFormItem label="备注" prop="remark">
        <ElInput v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="closeDialog">取消</ElButton>
        <ElButton type="primary" :loading="loading" @click="handleSubmit">保存</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style scoped lang="scss">
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
