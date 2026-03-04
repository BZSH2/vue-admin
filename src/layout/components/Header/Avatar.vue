<script setup lang="ts">
import { clearToken } from '@/utils/token'
const router = useRouter()
function onCommand(cmd: string) {
  if (cmd === 'github') {
    window.open('https://github.com/BZSH2/vue-admin', '_blank')
  } else if (cmd === 'logout') {
    clearToken()
    router.push({ name: 'Login' })
  }
}
</script>

<template>
  <ElDropdown @command="onCommand" trigger="click">
    <span class="el-dropdown-link">
      <ElAvatar size="small" class="cursor-pointer">U</ElAvatar>
    </span>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem command="github">GitHub</ElDropdownItem>
        <ElDropdownItem divided command="logout">退出登录</ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
