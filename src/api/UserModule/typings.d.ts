declare namespace UserModule {
  interface QueryUserDto {
    page?: number
    pageSize?: number
    keyword?: string
    status?: boolean
  }

  interface CreateUserDto {
    phoneNumber: string
    password: string
    nickname?: string
    avatar?: string
    status?: boolean
    remark?: string
  }

  interface UpdateUserDto extends Partial<CreateUserDto> {}

  interface UpdateUserStatusDto {
    status: boolean
  }

  interface ResetUserPasswordDto {
    newPassword: string
  }

  interface UserListItem {
    id: string
    phoneNumber: string
    role?: 'admin' | 'user' | null
    nickname?: string | null
    avatar?: string | null
    status: boolean
    remark?: string | null
    lastLoginAt?: string | null
    lastLoginIp?: string | null
    passwordUpdatedAt?: string | null
    createdAt?: string
    updatedAt?: string
  }

  interface UserListResult {
    items: UserListItem[]
    total: number
    page: number
    pageSize: number
  }

  interface OperationMessageDto {
    message: string
  }
}
