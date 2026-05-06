declare namespace LoginLogModule {
  interface QueryLoginLogDto {
    page?: number
    pageSize?: number
    keyword?: string
    success?: boolean
  }

  interface LoginLogItem {
    id: string
    userId?: string | null
    phoneNumber: string
    success: boolean
    ip?: string | null
    userAgent?: string | null
    failureReason?: string | null
    createdAt: string
  }

  interface LoginLogListResult {
    items: LoginLogItem[]
    total: number
    page: number
    pageSize: number
  }
}
