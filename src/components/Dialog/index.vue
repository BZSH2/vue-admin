<script lang="ts" setup>
import { CloseBold } from '@element-plus/icons-vue'
interface DialogProps {
  /** 弹窗标题 */
  title?: string
  /** 弹窗宽度 */
  width?: string
  /** 是否可拖动 */
  draggable?: boolean
}

const props = withDefaults(defineProps<DialogProps>(), {
  title: '',
  width: '500',
  draggable: true,
})

const emit = defineEmits<{
  submit: []
}>()
/** 弹窗是否显示 */
const visible = ref(false)

function open() {
  visible.value = !visible.value
}

function submit() {
  emit('submit')
  nextTick(() => {
    open()
  })
}

defineExpose({
  open,
})
</script>

<template>
  <ElDialog
    v-model="visible"
    :width="width"
    :draggable="draggable"
    class="dialog-wrapper custom-dialog-wrapper"
  >
    <div class="custom-dialog-header">
      <span class="title">{{ props.title }}</span>
      <span class="close-icon" @click="open">
        <ElIcon class="icon-svg"><CloseBold /></ElIcon>
      </span>
    </div>
    <div class="custom-dialog-content">
      <slot></slot>
    </div>
    <div class="custom-dialog-footer">
      <ElButton @click="open">取消</ElButton>
      <ElButton type="primary" @click="submit">确定</ElButton>
    </div>
  </ElDialog>
</template>

<style lang="scss">
.dialog-wrapper.custom-dialog-wrapper {
  padding: 0;

  .el-dialog__header {
    display: none;
  }
}
</style>

<style scoped lang="scss">
.custom-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 12px;
  border-bottom: 1px solid #e2eaee;

  .title {
    font-size: var(--va-font-size-xs);
    font-weight: bold;
  }

  .close-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: var(--va-radius-md);

    &:hover {
      background-color: var(--el-fill-color-light);
    }
  }

  .icon-svg {
    font-size: var(--va-font-size-lg);
    cursor: pointer;
  }
}

.custom-dialog-content {
  padding: 12px 12px 0;
}

.custom-dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 0 12px 12px;
}
</style>
