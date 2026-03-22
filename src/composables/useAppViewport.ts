import { tryOnMounted, tryOnScopeDispose } from '@vueuse/core'

const APP_HEIGHT_VAR = '--va-app-height'

function getViewportHeight() {
  if (typeof window === 'undefined') {
    return 0
  }

  return Math.round(window.visualViewport?.height || window.innerHeight)
}

export function useAppViewportHeight() {
  if (typeof window === 'undefined') {
    return
  }

  const updateAppHeight = () => {
    document.documentElement.style.setProperty(APP_HEIGHT_VAR, `${getViewportHeight()}px`)
  }

  tryOnMounted(() => {
    updateAppHeight()
    window.addEventListener('resize', updateAppHeight, { passive: true })
    window.addEventListener('orientationchange', updateAppHeight, { passive: true })
    window.visualViewport?.addEventListener('resize', updateAppHeight)
    window.visualViewport?.addEventListener('scroll', updateAppHeight)
  })

  tryOnScopeDispose(() => {
    window.removeEventListener('resize', updateAppHeight)
    window.removeEventListener('orientationchange', updateAppHeight)
    window.visualViewport?.removeEventListener('resize', updateAppHeight)
    window.visualViewport?.removeEventListener('scroll', updateAppHeight)
  })
}
