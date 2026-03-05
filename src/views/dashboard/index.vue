<script setup lang="ts">
function handleClick() {
  throw new Error('测试错误')
}
</script>

<template>
  <div>
    <ElButton type="primary" @click="handleClick">{{ $t('测试') }}</ElButton>
    <div>{{ $t('哈哈哈哈') }}</div>
    <Icon name="aixin" />
    <h1>{{ $t('你好, 这是一个测试') }}</h1>
  </div>
</template>
