import type { ThemeFontSizeLevel } from '@/shared/theme/font-size.js'
import type { ThemeMode, ThemeSnapshot } from './theme'

declare global {
  namespace Storage {
    /**
     * 存储键值映射：
     * 以 { key: value } 方式统一维护各存储项的数据类型，
     * 便于通过 key 自动推导 value 类型，强化 set/get 的类型安全。
     */
    interface StorageValueMap {
      /** 用于接口鉴权 */
      token: string
      /** 用户信息 (name, avatar, roles 等) */
      userInfo: Record<string, unknown>
      /** 系统语言 (zh-CN | en) */
      language: string
      /** 侧边栏折叠状态 (1: 折叠, 0: 展开) */
      sidebarStatus: 0 | 1
      /** 元素尺寸配置 (default | medium | small | mini) */
      size: 'default' | 'medium' | 'small' | 'mini'
      /** 主题模式 (light | dark | system) */
      themeMode: ThemeMode
      /** 用户自定义主色（统一存储为 #rrggbb） */
      themePrimaryColor: string
      /** 全局字体大小档位 */
      themeFontSizeLevel: ThemeFontSizeLevel
      /** 主题快照（首屏回放用的 CSS 变量映射） */
      themeSnapshot: ThemeSnapshot
    }

    /** 存储键名（由 StorageValueMap 自动推导） */
    type StorageKey = keyof StorageValueMap
    /** 指定 key 对应的值类型 */
    type StorageValue<K extends StorageKey> = StorageValueMap[K]

    /**
     * 存储类型
     * - 'local': localStorage (持久存储，关闭浏览器后保留)
     * - 'session': sessionStorage (会话存储，关闭标签页后清除)
     */
    type StorageType = 'local' | 'session'
  }
}

export {}
