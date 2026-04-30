<script lang="ts" setup>
import Table from '@/components/Table/index.vue'
import { productsControllerFindAll, productsControllerRemove } from '@/api/ProductModule/Products'
import EditModal from './components/EditModal.vue'

const tableRef = ref<InstanceType<typeof Table>>()
const editModalRef = ref<InstanceType<typeof EditModal>>()

const columns = reactive([
  {
    label: '产品名称',
    prop: 'name',
  },
  {
    label: '产品编码',
    prop: 'code',
  },
  {
    label: '产品描述',
    prop: 'description',
  },
  {
    label: '状态',
    prop: 'status',
    type: 'status',
  },
  {
    label: '创建时间',
    prop: 'createdAt',
    type: 'date',
  },
  {
    label: '更新时间',
    prop: 'updatedAt',
    type: 'date',
  },
])

/** 新增 */
function add() {
  editModalRef.value?.open()
}

/** 编辑 */
function edit(item: any) {
  editModalRef.value?.open(item)
}

/** 删除 */
async function deleteItem(item: any) {
  await productsControllerRemove({ id: item.id })
  $baseMessage('删除成功')
  reload()
}

/** reload */
function reload() {
  tableRef.value?.reload()
}
</script>

<template>
  <Table
    ref="tableRef"
    showAction
    :columns="columns"
    :api="productsControllerFindAll"
    @add="add"
    @edit="edit"
    @delete="deleteItem"
  />
  <EditModal ref="editModalRef" @reload="reload" />
</template>

<style lang="scss" scoped>
.product {
  // padding: 20px;
}
</style>
