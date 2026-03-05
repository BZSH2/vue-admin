import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies
const mockAxiosInstance = {
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  },
  request: vi.fn(),
}

const mockAxiosCreate = vi.fn(() => mockAxiosInstance)

vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    // @ts-ignore
    ...actual,
    default: {
      // @ts-ignore
      ...actual.default,
      create: mockAxiosCreate,
    },
  }
})

vi.mock('element-plus', () => ({
  ElMessage: {
    error: vi.fn(),
  },
}))

vi.mock('@/composables/useMessage', () => ({
  $baseMessage: vi.fn(),
}))

vi.mock('@/utils/token', () => ({
  getToken: vi.fn(() => 'mock-token'),
  clearToken: vi.fn(),
  setToken: vi.fn(),
}))

describe('Request Utils', () => {
  let request: any

  beforeEach(async () => {
    vi.clearAllMocks()
    // Reset modules to re-execute the file and create a new axios instance
    vi.resetModules()
    // Import the module under test
    const module = await import('@/utils/request')
    request = module.default
  })

  it('should create axios instance with correct config', () => {
    expect(mockAxiosCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: expect.any(String),
        timeout: 10000,
        headers: expect.objectContaining({
          'Content-Type': 'application/json;charset=utf-8',
        }),
      })
    )
  })

  it('should setup interceptors', () => {
    expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled()
    expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled()
  })

  it('request function should call service.request', async () => {
    const config = { url: '/test', method: 'get' }
    await request(config)
    expect(mockAxiosInstance.request).toHaveBeenCalledWith(config)
  })
})
