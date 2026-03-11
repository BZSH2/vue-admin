declare namespace LoginModule {
  interface RegisterDto {
    /** 手机号 */
    phoneNumber: string
    /** 密码 */
    password: string
    /** 昵称 */
    nickname?: string
  }

  interface LoginDto {
    /** 手机号 */
    phoneNumber: string
    /** 密码 */
    password: string
  }
}
