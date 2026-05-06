declare namespace OperationLogModule {
  interface QueryOperationLogDto {
    page?: number
    pageSize?: number
    keyword?: string
    method?: string
  }

  interface OperationLogItem {
    id: string
    moduleName?: string | null
    operatorPhoneNumber?: string | null
    method: string
    path: string
    statusCode: number
    durationMs: number
    createdAt: string | Date
  }

  interface OperationLogListResult {
    items: OperationLogItem[]
    total: number
    page: number
    pageSize: number
  }
}
