declare namespace RoleModule {
  interface QueryRoleDto {
    page?: number
    pageSize?: number
    keyword?: string
    enabled?: boolean
  }

  interface CreateRoleDto {
    code: string
    name: string
    description?: string
    sort?: number
    enabled?: boolean
    isDefault?: boolean
  }

  interface UpdateRoleDto extends Partial<CreateRoleDto> {}

  interface UpdateRoleStatusDto {
    enabled: boolean
  }

  interface CreateRoleUserDto {
    userId: string
  }

  interface UpdateUserRoleDto {
    role: 'admin' | 'user'
  }

  interface RoleDetailDto {
    id: string
    code: string
    name: string
    description?: string | null
    sort: number
    enabled: boolean
    isSystem: boolean
    isDefault: boolean
    memberCount: number
    createdAt: string
    updatedAt: string
  }

  interface RoleListResult {
    items: RoleDetailDto[]
    total: number
    page: number
    pageSize: number
  }

  interface RoleMemberDto {
    userId: string
    phoneNumber: string
    nickname?: string | null
    avatar?: string | null
    assignedAt: string
  }

  interface RoleMemberListResult {
    items: RoleMemberDto[]
    total: number
    page: number
    pageSize: number
  }

  interface UserRoleDetailDto {
    userId: string
    phoneNumber: string
    nickname?: string | null
    avatar?: string | null
    role: 'admin' | 'user'
  }

  type UserRoleDetailResponseDto = UserRoleDetailDto

  interface OperationMessageDto {
    message: string
  }

  type RoleOptionDto = {
    value: 'admin' | 'user'
    label: string
  }

  type RoleOptionsResponseDto = RoleOptionDto[]
}
