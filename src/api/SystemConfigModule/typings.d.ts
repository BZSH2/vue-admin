declare namespace SystemConfigModule {
  interface CreateSystemConfigDto {
    key: string
    name: string
    valueType: 'string' | 'number' | 'boolean' | 'json'
    value: string
    groupName?: string | null
    isSystem?: boolean
    remark?: string | null
  }

  interface SystemConfig {
    id: string
    key: string
    name: string
    valueType: Record<string, any>
    value: string
    groupName: string | null
    isSystem: boolean
    remark: string | null
    createdAt: string | Date
    updatedAt: string | Date
    deletedAt: string | Date | null
  }

  interface UpdateSystemConfigDto {
    key?: string
    name?: string
    valueType?: 'string' | 'number' | 'boolean' | 'json'
    value?: string
    groupName?: string | null
    isSystem?: boolean
    remark?: string | null
  }

  interface QuerySystemConfigDto {
    page?: number
    pageSize?: number
    keyword?: string
    groupName?: string
  }

  interface SystemConfigItem extends CreateSystemConfigDto {
    id: string
    createdAt: string | Date
    updatedAt: string | Date
  }

  interface SystemConfigListResult {
    items: SystemConfigItem[]
    total: number
    page: number
    pageSize: number
  }
}
