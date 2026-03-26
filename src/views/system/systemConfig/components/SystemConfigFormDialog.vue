<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    loading?: boolean
    mode: 'create' | 'edit'
    item?: SystemConfigModule.SystemConfigItem | null
  }>(),
  { loading: false, item: null }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [payload: SystemConfigModule.CreateSystemConfigDto | SystemConfigModule.UpdateSystemConfigDto]
}>()

const formRef = ref<FormInstance>()
const form = reactive<SystemConfigModule.CreateSystemConfigDto>({
  key: '',
  name: '',
  valueType: 'string',
  value: '',
  groupName: '',
  isSystem: false,
  remark: '',
})

const rules: FormRules = {
  key: [{ required: true, message: '请输入配置键', trigger: 'blur' }],
  name: [{ required: true, message: '请输入配置名称', trigger: 'blur' }],
  value: [{ required: true, message: '请输入配置值', trigger: 'blur' }],
}

watch(
  () => [props.modelValue, props.item, props.mode],
  ([visible]) => {
    if (!visible) return
    if (props.mode === 'create' || !props.item) {
      form.key = ''
      form.name = ''
      form.valueType = 'string'
      form.value = ''
      form.groupName = ''
      form.isSystem = false
      form.remark = ''
    } else {
      form.key = props.item.key
      form.name = props.item.name
      form.valueType = props.item.valueType
      form.value = props.item.value
      form.groupName = props.item.groupName || ''
      form.isSystem = props.item.isSystem ?? false
      form.remark = props.item.remark || ''
    }
    formRef.value?.clearValidate()
  },
  { immediate: true }
)

function closeDialog() { emit('update:modelValue', false) }
async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  emit('submit', {
    ...form,
    key: form.key.trim(),
    name: form.name.trim(),
    value: form.value,
    groupName: form.groupName?.trim() || null,
    remark: form.remark?.trim() || null,
  })
}
</script>

<template>
  <ElDialog :model-value="modelValue" :title="mode === 'create' ? '新增系统参数' : '编辑系统参数'" width="680px" @close="closeDialog">
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="96px">
      <ElFormItem label="配置键" prop="key"><ElInput v-model="form.key" :disabled="mode === 'edit' && item?.isSystem" /></ElFormItem>
      <ElFormItem label="配置名称" prop="name"><ElInput v-model="form.name" /></ElFormItem>
      <ElFormItem label="值类型" prop="valueType">
        <ElSelect v-model="form.valueType">
          <ElOption label="字符串" value="string" />
          <ElOption label="数字" value="number" />
          <ElOption label="布尔" value="boolean" />
          <ElOption label="JSON" value="json" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="配置值" prop="value"><ElInput v-model="form.value" type="textarea" :rows="3" /></ElFormItem>
      <ElFormItem label="分组"><ElInput v-model="form.groupName" /></ElFormItem>
      <ElFormItem label="系统内置"><ElSwitch v-model="form.isSystem" /></ElFormItem>
      <ElFormItem label="备注"><ElInput v-model="form.remark" type="textarea" :rows="2" /></ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer"><ElButton @click="closeDialog">取消</ElButton><ElButton type="primary" :loading="loading" @click="handleSubmit">保存</ElButton></div>
    </template>
  </ElDialog>
</template>

<style scoped lang="scss">
.dialog-footer { display:flex; justify-content:flex-end; gap:12px; }
</style>
