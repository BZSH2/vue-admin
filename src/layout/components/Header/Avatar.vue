<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()

const avatarText = computed(() => {
  const name = userStore.displayName || 'U'
  return String(name).slice(0, 1)
})

async function onCommand(cmd: string) {
  if (cmd === 'github') {
    window.open('https://github.com/BZSH2/vue-admin', '_blank')
    return
  }
  if (cmd === 'logout') {
    await authStore.logout()
    userStore.reset()
    router.push({ name: 'Login' })
  }
}
</script>

<template>
  <ElDropdown @command="onCommand" trigger="click">
    <span>
      <ElAvatar size="small" class="cursor-pointer">{{ avatarText }}</ElAvatar>
    </span>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem command="github">GitHub</ElDropdownItem>
        <ElDropdownItem divided command="logout">{{ $t('退出登录') }}</ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
