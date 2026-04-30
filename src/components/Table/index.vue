<script lang="ts" setup>
import { VxeTable, VxeColumn } from 'vxe-table'
import dayjs from 'dayjs'
import 'vxe-table/styles/cssvar.scss'
import 'vxe-table/lib/style.css'

interface TableProps {
  /**操作列宽度*/
  actionWidth?: number
  /**是否显示操作列*/
  showAction?: boolean
  /**接口*/
  api?: Function
  /**分页大小*/
  defaultPageSize?: number
  /**表格列*/
  columns?: Array<any>
}

const props = withDefaults(defineProps<TableProps>(), {
  actionWidth: 120,
  showAction: false,
  defaultPageSize: 50,
})

const emit = defineEmits<{
  add: []
  edit: [item: any]
  delete: [item: any]
}>()

/** 当前页 */
const currentPage = ref(1)
/** 总数 */
const total = ref(0)

const tableData = ref([])
/** 初始化接口数据 */
async function initApi() {
  if (props.api) {
    const { total: totalCount, items } = await props.api({
      page: currentPage.value,
      pageSize: props.defaultPageSize,
    })

    total.value = totalCount
    tableData.value = items
  }
}

watch(() => currentPage.value, initApi)

/** 新增 */
function clickAdd() {
  emit('add')
}

/** 编辑 */
function edit(item: any) {
  emit('edit', item)
}

/** 删除 */
function deleteItem(item: any) {
  emit('delete', item)
}

function reload() {
  initApi()
}

onMounted(() => {
  initApi()
})

defineExpose({
  reload,
})
</script>

<template>
  <div class="table-box">
    <div class="table-content">
      <div class="table-content-header">
        <ElButton type="primary" @click="clickAdd">新增</ElButton>
      </div>
      <div class="table-content-box">
        <VxeTable :data="tableData" size="small" border :scroll-x="{ enabled: true }" height="100%">
          <VxeColumn type="seq" width="60" title="序号" align="center" fixed="left"></VxeColumn>
          <VxeColumn
            v-for="item in columns"
            :key="item.prop"
            :field="item.prop"
            :width="item.width"
            :title="item.label"
          >
            <template #default="{ row }">
              <div class="column-wrapper">
                <template v-if="item.type === 'date'">{{
                  dayjs(row[item.prop]).format('YYYY-MM-DD HH:mm:ss')
                }}</template>
                <template v-else-if="item.type === 'status'">
                  {{ row[item.prop] ? '正常' : '停用' }}
                </template>
                <template v-else>
                  {{ row[item.prop] }}
                </template>
              </div>
            </template>
          </VxeColumn>
          <VxeColumn
            :width="actionWidth"
            title="操作"
            fixed="right"
            v-if="$slots.action || showAction"
          >
            <template #default="{ row }">
              <slot name="action" :row="row" v-if="$slots.action"></slot>
              <template v-else>
                <ElButton type="primary" text size="small" @click="edit(row)">编辑</ElButton>
                <ElButton type="danger" text size="small" @click="deleteItem(row)">删除</ElButton>
              </template>
            </template>
          </VxeColumn>
        </VxeTable>
      </div>
      <div class="table-pagination">
        <ElPagination
          v-model:current-page="currentPage"
          :page-size="defaultPageSize"
          size="small"
          background
          layout="total, prev, pager, next, jumper"
          :total="total"
          :hide-on-single-page="false"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-box {
  height: 100%;
  padding: 12px;
}

.table-content {
  height: 100%;
  background: #fff;
  border-radius: var(--va-radius-md);

  .table-content-header {
    padding: 12px 12px 0;
  }

  .table-content-box {
    height: calc(100% - 90px);
    padding: 12px 12px 0;
  }

  .table-pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 46px;
    padding-right: 4px;

    :deep(.el-pagination) {
      margin-top: 0;
    }
  }

  .column-wrapper {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
