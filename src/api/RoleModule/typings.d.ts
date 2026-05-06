declare namespace RoleModule {
  interface RoleDetailDto {
    /** 角色ID */
    id: string
    /** 角色编码 */
    code: string
    /** 角色名称 */
    name: string
    /** 角色描述 */
    description?: string | null
    /** 排序值 */
    sort: number
    /** 是否启用 */
    enabled: boolean
    /** 是否系统内置角色 */
    isSystem: boolean
    /** 是否默认角色 */
    isDefault: boolean
    /** 绑定成员数 */
    memberCount: number
    /** 创建时间 */
    createdAt: string | Date
    /** 更新时间 */
    updatedAt: string | Date
  }

  interface RoleListDto {
    items: RoleDetailDto[]
    total: number
    page: number
    pageSize: number
  }

  interface RoleListResponseDto {
    /** 业务状态码 */
    code: number
    /** 响应消息 */
    message: string
    data: RoleListDto
  }

  interface CreateRoleDto {
    /** 角色编码，仅支持字母、数字、下划线和中划线 */
    code: string
    /** 角色名称 */
    name: string
    /** 角色描述 */
    description?: string
    /** 排序值 */
    sort?: number
    /** 是否启用 */
    enabled?: boolean
    /** 是否默认角色 */
    isDefault?: boolean
  }

  interface RoleDetailResponseDto {
    /** 业务状态码 */
    code: number
    /** 响应消息 */
    message: string
    data: RoleDetailDto
  }

  interface RoleOptionDto {
    /** 角色值 */
    value: 'admin' | 'user'
    /** 角色展示名称 */
    label: string
  }

  interface RoleOptionsResponseDto {
    /** 业务状态码 */
    code: number
    /** 响应消息 */
    message: string
    data: RoleOptionDto[]
  }

  interface OperationMessageDto {
    /** 操作结果消息 */
    message: string
  }

  interface OperationMessageResponseDto {
    /** 业务状态码 */
    code: number
    /** 响应消息 */
    message: string
    data: OperationMessageDto
  }

  interface UpdateRoleDto {
    /** 角色编码，仅支持字母、数字、下划线和中划线 */
    code?: string
    /** 角色名称 */
    name?: string
    /** 角色描述 */
    description?: string
    /** 排序值 */
    sort?: number
    /** 是否启用 */
    enabled?: boolean
    /** 是否默认角色 */
    isDefault?: boolean
  }

  interface UpdateRoleStatusDto {
    /** 是否启用 */
    enabled: boolean
  }

  interface RoleMemberDto {
    /** 用户ID */
    userId: string
    /** 手机号 */
    phoneNumber: string
    /** 昵称 */
    nickname?: string | null
    /** 头像地址 */
    avatar?: string | null
    /** 关联时间 */
    assignedAt: string | Date
  }

  interface RoleMemberListDto {
    items: RoleMemberDto[]
    total: number
    page: number
    pageSize: number
  }

  interface RoleMemberListResponseDto {
    /** 业务状态码 */
    code: number
    /** 响应消息 */
    message: string
    data: RoleMemberListDto
  }

  interface CreateRoleUserDto {
    /** 用户ID */
    userId: string
  }

  interface UserRoleDetailDto {
    /** 用户ID */
    userId: string
    /** 手机号 */
    phoneNumber: string
    /** 昵称 */
    nickname?: string | null
    /** 头像地址 */
    avatar?: string | null
    /** 当前角色 */
    role: 'admin' | 'user'
  }

  interface UserRoleDetailResponseDto {
    /** 业务状态码 */
    code: number
    /** 响应消息 */
    message: string
    data: UserRoleDetailDto
  }

  interface UpdateUserRoleDto {
    /** 目标角色 */
    role: 'admin' | 'user'
  }
}
