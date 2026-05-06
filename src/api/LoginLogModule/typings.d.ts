declare namespace LoginLogModule {
  interface QueryLoginLogDto {
    page?: number
    pageSize?: number
    keyword?: string
    success?: boolean
  }

  interface LoginLogItem {
    id: string
    phoneNumber: string
    success: boolean
    ip?: string | null
    failureReason?: string | null
    userAgent?: string | null
    createdAt: string | Date
  }

  interface LoginLogListResult {
    items: LoginLogItem[]
    total: number
    page: number
    pageSize: number
  }
}
