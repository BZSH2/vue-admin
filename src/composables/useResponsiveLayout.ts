import { computed, ref, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'

export const MOBILE_BREAKPOINT = 768
export const COMPACT_HEADER_BREAKPOINT = 992
export const SIDEBAR_COLLAPSE_BREAKPOINT = 1200

export function useResponsiveLayout() {
  const { width } = useWindowSize()
  const isMobile = computed(() => width.value < MOBILE_BREAKPOINT)
  const isCompactHeader = computed(() => width.value < COMPACT_HEADER_BREAKPOINT)
  const desktopCollapsed = ref(width.value < SIDEBAR_COLLAPSE_BREAKPOINT)
  const mobileSidebarVisible = ref(false)

  watch(
    width,
    (nextWidth, previousWidth) => {
      if (
        nextWidth < SIDEBAR_COLLAPSE_BREAKPOINT &&
        (previousWidth === undefined || previousWidth >= SIDEBAR_COLLAPSE_BREAKPOINT)
      ) {
        desktopCollapsed.value = true
      }

      if (
        nextWidth >= SIDEBAR_COLLAPSE_BREAKPOINT &&
        (previousWidth === undefined || previousWidth < SIDEBAR_COLLAPSE_BREAKPOINT)
      ) {
        desktopCollapsed.value = false
      }

      if (nextWidth >= MOBILE_BREAKPOINT) {
        mobileSidebarVisible.value = false
      }
    },
    { immediate: true }
  )

  const mobileSidebarWidth = computed(() => (width.value < 420 ? '82vw' : '280px'))

  function toggleSidebar() {
    if (isMobile.value) {
      mobileSidebarVisible.value = !mobileSidebarVisible.value
      return
    }

    desktopCollapsed.value = !desktopCollapsed.value
  }

  function closeMobileSidebar() {
    mobileSidebarVisible.value = false
  }

  return {
    isMobile,
    isCompactHeader,
    desktopCollapsed,
    mobileSidebarVisible,
    mobileSidebarWidth,
    toggleSidebar,
    closeMobileSidebar,
  }
}
