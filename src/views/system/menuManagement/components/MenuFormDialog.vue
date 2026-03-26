<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    loading?: boolean
    mode: 'create' | 'edit'
    menu?: MenuModule.MenuItem | null
    parentOptions?: Array<{ label: string; value: string }>
  }>(),
  {
    loading: false,
    menu: null,
    parentOptions: () => [],
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [payload: MenuModule.CreateMenuDto | MenuModule.UpdateMenuDto]
}>()

const formRef = ref<FormInstance>()
const form = reactive<MenuModule.CreateMenuDto>({
  code: '',
  name: '',
  parentId: null,
  type: 'menu',
  path: '',
  component: '',
  permission: '',
  icon: '',
  sort: 0,
  visible: true,
  enabled: true,
  remark: '',
})

const rules: FormRules = {
  code: [{ required: true, message: '请输入菜单编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
}

const dialogTitle = computed(() => (props.mode === 'create' ? '新增菜单' : '编辑菜单'))

watch(
  () => [props.modelValue, props.menu, props.mode],
  ([visible]) => {
    if (!visible) return
    if (props.mode === 'create' || !props.menu) {
      form.code = ''
      form.name = ''
      form.parentId = null
      form.type = 'menu'
      form.path = ''
      form.component = ''
      form.permission = ''
      form.icon = ''
      form.sort = 0
      form.visible = true
      form.enabled = true
      form.remark = ''
    } else {
      form.code = props.menu.code
      form.name = props.menu.name
      form.parentId = props.menu.parentId || null
      form.type = props.menu.type
      form.path = props.menu.path || ''
      form.component = props.menu.component || ''
      form.permission = props.menu.permission || ''
      form.icon = props.menu.icon || ''
      form.sort = props.menu.sort || 0
      form.visible = props.menu.visible ?? true
      form.enabled = props.menu.enabled ?? true
      form.remark = props.menu.remark || ''
    }
    formRef.value?.clearValidate()
  },
  { immediate: true }
)

function closeDialog() {
  emit('update:modelValue', false)
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  emit('submit', {
    ...form,
    code: form.code.trim(),
    name: form.name.trim(),
    parentId: form.parentId || null,
    path: form.path?.trim() || null,
    component: form.component?.trim() || null,
    permission: form.permission?.trim() || null,
    icon: form.icon?.trim() || null,
    remark: form.remark?.trim() || null,
  })
}
</script>

<template>
  <ElDialog :model-value="modelValue" :title="dialogTitle" width="720px" @close="closeDialog">
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="96px">
      <ElFormItem label="菜单名称" prop="name"><ElInput v-model="form.name" /></ElFormItem>
      <ElFormItem label="菜单编码" prop="code"><ElInput v-model="form.code" /></ElFormItem>
      <ElFormItem label="父级菜单" prop="parentId">
        <ElSelect v-model="form.parentId" clearable placeholder="顶级菜单">
          <ElOption v-for="item in parentOptions" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="菜单类型" prop="type">
        <ElRadioGroup v-model="form.type">
          <ElRadioButton label="directory" value="directory">目录</ElRadioButton>
          <ElRadioButton label="menu" value="menu">菜单</ElRadioButton>
          <ElRadioButton label="button" value="button">按钮</ElRadioButton>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="路由路径"><ElInput v-model="form.path" /></ElFormItem>
      <ElFormItem label="组件路径"><ElInput v-model="form.component" /></ElFormItem>
      <ElFormItem label="权限标识"><ElInput v-model="form.permission" /></ElFormItem>
      <ElFormItem label="图标"><ElInput v-model="form.icon" /></ElFormItem>
      <ElFormItem label="排序"><ElInputNumber v-model="form.sort" :min="0" :max="9999" class="w-full" /></ElFormItem>
      <ElFormItem label="显示状态"><ElSwitch v-model="form.visible" /></ElFormItem>
      <ElFormItem label="启用状态"><ElSwitch v-model="form.enabled" /></ElFormItem>
      <ElFormItem label="备注"><ElInput v-model="form.remark" type="textarea" :rows="3" /></ElFormItem>
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
.w-full { width: 100%; }
.dialog-footer { display: flex; justify-content: flex-end; gap: 12px; }
</style>
