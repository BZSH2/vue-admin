declare namespace LoginModule {
  interface RegisterDto {
    /** 手机号 */
    phoneNumber: string
    /** 密码 */
    password: string
    /** 昵称 */
    nickname?: string
  }

  interface AuthProfileDto {
    /** 用户ID */
    id: string
    /** 手机号 */
    phoneNumber: string
    /** 昵称 */
    nickname?: string | null
    /** 头像地址 */
    avatar?: string | null
    /** 当前用户角色 */
    role: 'admin' | 'user'
    /** 创建时间 */
    createdAt?: string | Date
    /** 更新时间 */
    updatedAt?: string | Date
  }

  interface AuthProfileResponseDto {
    /** 业务状态码 */
    code: number
    /** 响应消息 */
    message: string
    data: AuthProfileDto
  }

  interface LoginDto {
    /** 手机号 */
    phoneNumber: string
    /** 密码 */
    password: string
  }

  interface AuthTokensDto {
    /** 访问令牌 */
    accessToken: string
    /** 刷新令牌 */
    refreshToken: string
  }

  interface AuthTokensResponseDto {
    /** 业务状态码 */
    code: number
    /** 响应消息 */
    message: string
    data: AuthTokensDto
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
}
