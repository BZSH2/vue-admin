<script setup lang="ts">
import { setLang } from '@/i18n'
import { langDict } from '@/config'
import { getPetById } from '@/api/Pet/petsAPI/pet'
import { postdefaultpostOpenApiJson } from '@/api/openApiJSONshuju/__openAPI__default'

// import { postOpenApiJSON } from '@/api/google'

function changeLang(code: string) {
  setLang(code)
  const a = '测试'
}

onMounted(() => {
  getPetById({ id: '1' }).then((res) => {
    console.log('aaaaaaaaaaaaaaaa', res)
  })
  postdefaultpostOpenApiJson({
    coke: '[{"prefix":"pets","service":[]},{"prefix":"store","service":[]}] ',
  }).then((res) => {
    console.log('postdefaultpostOpenApiJson', res)
  })
  // postOpenApiJSON({
  //   coke: '[{"prefix":"pets","service":[]},{"prefix":"store","service":[]}] ',
  // })
})
</script>

<template>
  <div>
    <ElButton type="primary">{{ $t('测试') }}</ElButton>
    <div>{{ $t('哈哈哈哈') }}</div>
    <Icon name="aixin" />
    <h1>{{ $t('你好, 这是一个测试') }}</h1>
    <div
      class="ai-dice1"
      v-for="item in langDict"
      :key="item.code"
      @click="changeLang(item.code)"
      >{{ item.name }}</div
    >
  </div>
</template>

<style scoped></style>
