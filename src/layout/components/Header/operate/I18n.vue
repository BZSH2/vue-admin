<script setup lang="ts">
import { setLang, loadLocale } from '@/i18n'
import { langDict } from '@/config'
const showCheckIcon = computed(() => (item: { code: string }) => item.code === loadLocale())
</script>

<template>
  <ElDropdown
    @command="setLang"
    class="h-full flex items-center"
    trigger="click"
    popper-class="i18n-dropdown"
  >
    <span class="el-dropdown-link">
      <Icon name="translate" :size="16" class="p-x-10px" />
    </span>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem v-for="item in langDict" :key="item.code" :command="item.code">
          <div class="w-full flex items-center justify-between">
            <span class="p-x-10px">{{ item.name }}</span>
            <Icon name="check" :size="16" v-show="showCheckIcon(item)" />
          </div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
