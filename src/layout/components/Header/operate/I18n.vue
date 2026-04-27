<script setup lang="ts">
import i18n, { setLang } from '@/i18n'
import { langDict } from '@/config'

const activeLocale = computed(() => i18n.global.locale.value)
</script>

<template>
  <ElDropdown @command="setLang" popper-class="i18n-dropdown" trigger="click">
    <span class="va-header-action i18n-trigger">
      <Icon name="layout-translate" :size="16" />
    </span>
    <template #dropdown>
      <ElDropdownItem v-for="item in langDict" :key="item.code" :command="item.code">
        <div class="w-full flex items-center justify-between">
          <span class="p-x-[10px]">{{ item.name }}</span>
          <Icon name="layout-check" :size="14" v-show="item.code === activeLocale" />
        </div>
      </ElDropdownItem>
    </template>
  </ElDropdown>
</template>
