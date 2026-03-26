<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    mode: 'create' | 'edit'
    loading?: boolean
    role?: RoleModule.RoleDetailDto | null
  }>(),
  {
    loading: false,
    role: null,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [payload: RoleModule.CreateRoleDto | RoleModule.UpdateRoleDto]
}>()

const formRef = ref<FormInstance>()
const form = reactive<RoleModule.CreateRoleDto>({
  code: '',
  name: '',
  description: '',
  sort: 0,
  enabled: true,
  isDefault: false,
})

const rules: FormRules = {
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_-]+$/,
      message: '角色编码仅支持字母、数字、下划线和中划线',
      trigger: 'blur',
    },
  ],
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
}

const dialogTitle = computed(() => (props.mode === 'create' ? '新增角色' : '编辑角色'))
const isSystemRole = computed(() => Boolean(props.role?.isSystem))

function resetForm() {
  form.code = ''
  form.name = ''
  form.description = ''
  form.sort = 0
  form.enabled = true
  form.isDefault = false
}

function syncForm() {
  if (!props.role || props.mode === 'create') {
    resetForm()
    return
  }

  form.code = props.role.code || ''
  form.name = props.role.name || ''
  form.description = props.role.description || ''
  form.sort = props.role.sort || 0
  form.enabled = props.role.enabled ?? true
  form.isDefault = props.role.isDefault ?? false
}

watch(
  () => [props.modelValue, props.role, props.mode],
  ([visible]) => {
    if (!visible) {
      return
    }
    syncForm()
    formRef.value?.clearValidate()
  },
  { immediate: true }
)

function closeDialog() {
  emit('update:modelValue', false)
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  emit('submit', {
    code: form.code.trim(),
    name: form.name.trim(),
    description: form.description?.trim() || '',
    sort: Number(form.sort || 0),
    enabled: Boolean(form.enabled),
    isDefault: Boolean(form.isDefault),
  })
}
</script>

<template>
  <ElDialog
    :model-value="modelValue"
    :title="dialogTitle"
    width="640px"
    destroy-on-close
    @close="closeDialog"
  >
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="96px">
      <ElFormItem label="角色名称" prop="name">
        <ElInput v-model="form.name" maxlength="50" show-word-limit placeholder="请输入角色名称" />
      </ElFormItem>
      <ElFormItem label="角色编码" prop="code">
        <ElInput
          v-model="form.code"
          :disabled="isSystemRole"
          maxlength="50"
          show-word-limit
          placeholder="例如 content_admin"
        />
      </ElFormItem>
      <ElFormItem label="角色描述" prop="description">
        <ElInput
          v-model="form.description"
          type="textarea"
          :rows="3"
          maxlength="255"
          show-word-limit
          placeholder="请输入角色描述"
        />
      </ElFormItem>
      <ElFormItem label="排序" prop="sort">
        <ElInputNumber v-model="form.sort" :min="0" :max="9999" class="w-full" />
      </ElFormItem>
      <ElFormItem label="启用状态" prop="enabled">
        <ElSwitch v-model="form.enabled" />
      </ElFormItem>
      <ElFormItem label="默认角色" prop="isDefault">
        <ElSwitch v-model="form.isDefault" />
      </ElFormItem>
      <ElAlert
        v-if="isSystemRole"
        title="系统内置角色编码不可编辑，停用/删除也会受到保护规则限制。"
        type="info"
        :closable="false"
        show-icon
      />
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
.w-full {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
