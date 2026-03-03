import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setToken, getToken, clearToken } from '@/utils/token'
import Cookies from 'js-cookie'

// Mock js-cookie
vi.mock('js-cookie', () => {
  return {
    default: {
      set: vi.fn(),
      get: vi.fn(),
      remove: vi.fn(),
    },
  }
})

describe('Token Utils', () => {
  const TEST_TOKEN = 'test-token-value'
  const TOKEN_KEY = 'admin_token'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('setToken should call Cookies.set with correct arguments', () => {
    setToken(TEST_TOKEN)
    expect(Cookies.set).toHaveBeenCalledWith(TOKEN_KEY, TEST_TOKEN)
  })

  it('getToken should call Cookies.get with correct arguments', () => {
    ;(Cookies.get as any).mockReturnValue(TEST_TOKEN)
    const token = getToken()
    expect(Cookies.get).toHaveBeenCalledWith(TOKEN_KEY)
    expect(token).toBe(TEST_TOKEN)
  })

  it('clearToken should call Cookies.remove with correct arguments', () => {
    clearToken()
    expect(Cookies.remove).toHaveBeenCalledWith(TOKEN_KEY)
  })
})
