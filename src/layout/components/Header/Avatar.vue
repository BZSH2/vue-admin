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
    <span class="avatar-trigger">
      <ElAvatar size="small" class="avatar-trigger__avatar">{{ avatarText }}</ElAvatar>
    </span>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem command="github">GitHub</ElDropdownItem>
        <ElDropdownItem divided command="logout">{{ $t('退出登录') }}</ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<style scoped lang="scss">
.avatar-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 10px;
}

.avatar-trigger:active {
  background-color: var(--el-fill-color-light);
}

.avatar-trigger__avatar {
  font-size: var(--va-font-size-xs);
  font-weight: 600;
}

@media (width <= 420px) {
  .avatar-trigger {
    width: 36px;
    height: 36px;
  }
}
</style>
