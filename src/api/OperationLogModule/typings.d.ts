declare namespace OperationLogModule {
  interface QueryOperationLogDto {
    page?: number
    pageSize?: number
    keyword?: string
    method?: string
  }

  interface OperationLogItem {
    id: string
    operatorUserId?: string | null
    operatorPhoneNumber?: string | null
    moduleName?: string | null
    method: string
    path: string
    statusCode: number
    durationMs: number
    ip?: string | null
    userAgent?: string | null
    requestSummary?: string | null
    responseSummary?: string | null
    createdAt: string
  }

  interface OperationLogListResult {
    items: OperationLogItem[]
    total: number
    page: number
    pageSize: number
  }
}
