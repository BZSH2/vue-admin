<script lang="ts" setup>
import CountTo from '@/components/CountTo/index.vue'

defineProps({
  content: {
    type: String,
    default: () => '',
  },
  title: {
    type: String,
    default: () => '',
  },
  color: {
    type: String,
    default: () => '',
  },
  icon: {
    type: String,
    default: () => '',
  },
  active: {
    type: Boolean,
    default: () => false,
  },
})
</script>

<template>
  <div class="panel-item">
    <div class="panel-item-icon" :style="{ background: active ? color : 'transparent' }">
      <Icon :name="icon" :size="48" :color="active ? '#fff' : color" />
    </div>
    <div class="panel-item-content">
      <div class="title">{{ title }}</div>
      <div class="content">
        <CountTo :startVal="0" :endVal="Number(content)" :duration="2000" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.panel-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  margin-right: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  background: #fff;
  border-radius: var(--va-radius-md);

  .panel-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    min-width: 80px;
    height: 80px;
    border-radius: var(--va-radius-md);
  }

  .panel-item-content {
    padding-left: 12px;

    .title {
      margin-bottom: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: var(--va-font-size-md);
      line-height: 18px;
      color: rgb(0, 0, 0, 0.45);
      white-space: nowrap;
    }

    .content {
      font-size: var(--va-font-size-lg);
      font-weight: 700;
      line-height: 24px;
      color: rgb(0, 0, 0, 0.85);
    }
  }
}
</style>
