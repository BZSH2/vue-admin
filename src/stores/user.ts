import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { authControllerGetProfile } from '@/api/ProfileModule/Auth'

export type UserProfile = {
  id?: number | string
  phoneNumber?: string
  nickname?: string
  avatar?: string
  roles?: string[]
  [key: string]: any
}

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile | null>(null)
  const loaded = ref(false)

  const displayName = computed(() => {
    return profile.value?.nickname || profile.value?.phoneNumber || ''
  })

  function reset() {
    profile.value = null
    loaded.value = false
  }

  /** 拉取个人信息（/api/auth/profile） */
  async function fetchProfile() {
    const res = await authControllerGetProfile({ showError: false, retry: 0 })
    profile.value = (res || null) as any
    loaded.value = true
    return profile.value
  }

  /**
   * 确保 profile 已加载。
   *
   * - 成功：返回 profile
   * - 失败：返回 null（不抛出，避免影响路由首屏进入）
   */
  async function ensureProfile(force = false): Promise<UserProfile | null> {
    if (loaded.value && !force) {
      return profile.value
    }
    try {
      return await fetchProfile()
    } catch {
      loaded.value = true
      return null
    }
  }

  return {
    profile,
    loaded,
    displayName,
    reset,
    fetchProfile,
    ensureProfile,
  }
})
