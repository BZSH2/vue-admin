declare namespace ProfileModule {
  interface ChangePasswordDto {
    /** 旧密码 */
    oldPassword: string
    /** 新密码 */
    newPassword: string
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
}
