<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {
  systemConfigsControllerCreate,
  systemConfigsControllerFindAll,
  systemConfigsControllerRemove,
  systemConfigsControllerUpdate,
} from '@/api/SystemConfigModule/SystemConfig'
import { $asyncBaseConfirm, $baseMessage } from '@/composables/useMessage'
import SystemConfigFormDialog from './components/SystemConfigFormDialog.vue'

const loading = ref(false)
const submitLoading = ref(false)
const actionId = ref('')
const list = ref<SystemConfigModule.SystemConfigItem[]>([])
const total = ref(0)
const query = reactive<SystemConfigModule.QuerySystemConfigDto>({
  page: 1,
  pageSize: 10,
  keyword: '',
})
const formVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const currentItem = ref<SystemConfigModule.SystemConfigItem | null>(null)

function formatTime(value?: string | null) {
  if (!value) {
    return '-'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

async function fetchList() {
  loading.value = true
  try {
    const res = await systemConfigsControllerFindAll(query)
    list.value = res.items || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formMode.value = 'create'
  currentItem.value = null
  formVisible.value = true
}
function openEdit(item: SystemConfigModule.SystemConfigItem) {
  formMode.value = 'edit'
  currentItem.value = item
  formVisible.value = true
}
function handleSearch() {
  query.page = 1
  fetchList()
}
function handleReset() {
  query.page = 1
  query.pageSize = 10
  query.keyword = ''
  query.groupName = ''
  fetchList()
}

async function handleSubmit(
  payload: SystemConfigModule.CreateSystemConfigDto | SystemConfigModule.UpdateSystemConfigDto
) {
  submitLoading.value = true
  try {
    if (formMode.value === 'create') {
      await systemConfigsControllerCreate(payload as SystemConfigModule.CreateSystemConfigDto)
      $baseMessage('参数创建成功')
    } else if (currentItem.value?.id) {
      await systemConfigsControllerUpdate({ id: currentItem.value.id }, payload)
      $baseMessage('参数更新成功')
    }
    formVisible.value = false
    await fetchList()
  } finally {
    submitLoading.value = false
  }
}

async function handleRemove(item: SystemConfigModule.SystemConfigItem) {
  const ok = await $asyncBaseConfirm({
    title: '删除系统参数',
    content: `确认删除「${item.name}」吗？`,
  })
  if (!ok) {
    return
  }
  actionId.value = item.id
  try {
    await systemConfigsControllerRemove({ id: item.id })
    $baseMessage('参数删除成功')
    await fetchList()
  } finally {
    actionId.value = ''
  }
}

onMounted(fetchList)
</script>

<template>
  <div class="system-config-container">
    1111
    <!-- <SystemConfigItem /> -->
  </div>
</template>
