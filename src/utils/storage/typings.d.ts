/**
 * 全局存储相关类型定义  用于 src/utils/storage 工具库
 */
declare namespace Storage {
  /**
   * 存储键名枚举 所有存入 Storage 的 Key 必须在此定义，以保证类型安全
   */
  type StorageKey =
    /** 用于接口鉴权 */
    | 'token'
    /** 用户信息 (name, avatar, roles 等) */
    | 'userInfo'
    /** 系统语言 (zh-CN | en) */
    | 'language'
    /** 侧边栏折叠状态 (1: 折叠, 0: 展开) */
    | 'sidebarStatus'
    /** 元素尺寸配置 (default | medium | small | mini) */
    | 'size'
    | 'themeMode'
    | 'themePrimaryColor'
    | 'themeSnapshot'

  /**
   * 存储类型
   * - 'local': localStorage (持久存储，关闭浏览器后保留)
   * - 'session': sessionStorage (会话存储，关闭标签页后清除)
   */
  type StorageType = 'local' | 'session'
}
