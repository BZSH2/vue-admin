declare namespace UserModule {
  interface QueryUserDto {
    page?: number
    pageSize?: number
    keyword?: string
  }

  interface UserListItem {
    id: string
    phoneNumber: string
    role?: 'admin' | 'user' | null
    nickname?: string | null
    avatar?: string | null
    createdAt?: string
    updatedAt?: string
  }

  interface UserListResult {
    items: UserListItem[]
    total: number
    page: number
    pageSize: number
  }
}
