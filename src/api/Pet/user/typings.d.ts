declare namespace user {
  /** 用户账号信息。 */
  interface User {
    /** 用户唯一标识。 */
    id?: number
    /** 用户名。 */
    username?: string
    /** 用户名。 */
    firstName?: string
    /** 用户姓。 */
    lastName?: string
    /** 用户邮箱。 */
    email?: string
    /** 用户密码（哈希值）。 */
    password?: string
    /** 用户手机号。 */
    phone?: string
    /** 用户状态（0:正常，1:管理员，-1:已封禁） */
    userStatus?: 0 | 1 | -1
  }
}
