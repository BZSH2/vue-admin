<script lang="ts" setup>
import { productsControllerCreate, productsControllerUpdate } from '@/api/ProductModule/Products'
import Dialog from '@/components/Dialog/index.vue'
import type { FormInstance, FormRules } from 'element-plus'
const emit = defineEmits<{
  reload: []
}>()

const dialogRef = ref<InstanceType<typeof Dialog>>()

const ruleFormRef = ref<FormInstance>()
const isEdit = ref(false)
const id = ref('')
const form = reactive<ProductModule.CreateProductDto>({
  name: '',
  code: '',
  description: '',
  status: true,
})
const rules = reactive<FormRules<typeof form>>({
  name: [{ required: true, message: $t('请输入'), trigger: 'blur' }],
  code: [{ required: true, message: $t('请输入'), trigger: 'blur' }],
  description: [{ required: true, message: $t('请输入'), trigger: 'blur' }],
  status: [{ required: true, message: $t('请选择'), trigger: 'blur' }],
})

function open(item?: any) {
  dialogRef.value?.open()
  if (item) {
    isEdit.value = true
    id.value = item.id
    form.name = item.name
    form.code = item.code
    form.description = item.description
    form.status = item.status
  } else {
    form.name = ''
    form.code = ''
    form.description = ''
    form.status = true
    id.value = ''
    isEdit.value = false
  }
}

async function submit() {
  const valid = await ruleFormRef.value?.validate()
  if (!valid) {
    return
  }
  if (isEdit.value) {
    await productsControllerUpdate(
      {
        id: id.value,
      },
      {
        ...form,
      }
    )
    $baseMessage($t('编辑成功'))
  } else {
    await productsControllerCreate(form)
    $baseMessage($t('新增成功'))
  }
  emit('reload')
}

defineExpose({
  open,
})
</script>

<template>
  <Dialog ref="dialogRef" title="产品" @submit="submit">
    <ElForm
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="form"
      status-icon
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      label-position="top"
    >
      <ElFormItem label="产品名称" prop="name">
        <ElInput v-model="form.name" autocomplete="off" />
      </ElFormItem>
      <ElFormItem label="产品编码" prop="code">
        <ElInput v-model="form.code" autocomplete="off" :disabled="isEdit" />
      </ElFormItem>
      <ElFormItem label="产品描述" prop="description">
        <ElInput v-model="form.description" autocomplete="off" />
      </ElFormItem>
      <ElFormItem label="状态" prop="status">
        <ElRadioGroup v-model="form.status">
          <ElRadio :value="true" size="large">正常</ElRadio>
          <ElRadio :value="false" size="large">停用</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
    </ElForm>
  </Dialog>
</template>
