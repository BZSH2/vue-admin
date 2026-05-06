declare namespace SystemConfigModule {
  type ValueType = 'string' | 'number' | 'boolean' | 'json'

  interface QuerySystemConfigDto {
    page?: number
    pageSize?: number
    keyword?: string
    groupName?: string
  }

  interface CreateSystemConfigDto {
    key: string
    name: string
    valueType: ValueType
    value: string
    groupName?: string | null
    isSystem?: boolean
    remark?: string | null
  }

  interface UpdateSystemConfigDto extends Partial<CreateSystemConfigDto> {}

  interface SystemConfigItem extends CreateSystemConfigDto {
    id: string
    createdAt: string
    updatedAt: string
  }

  type SystemConfig = SystemConfigItem

  interface SystemConfigListResult {
    items: SystemConfigItem[]
    total: number
    page: number
    pageSize: number
  }

  interface OperationMessageDto {
    message: string
  }
}
