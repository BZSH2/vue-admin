declare namespace RoleModule {
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
