# 项目工具函数库 (`src/utils/`)

## 概述

本项目中所有通用工具函数集中在 `src/utils/` 目录下。**当需要实现某个功能时，优先使用这里已有的方法**，避免重复造轮子。

## 目录结构

```
src/utils/
├── index.ts              # 入口：导出 copy() 及 re-export system, token
├── token/
│   └── index.ts          # Token 管理（基于 js-cookie）
├── storage/
│   └── index.ts          # 类型安全的 Storage 封装（localStorage / sessionStorage）
├── system/
│   ├── index.ts          # re-export i18n
│   └── i18n.ts           # 页面标题国际化
├── pinyin/
│   └── index.ts          # 中文转拼音（基于 pinyin-pro）
└── request/
    ├── index.ts          # 导出 request 实例 + 注入函数
    ├── constants.ts      # 默认重试次数 / 延迟 / HTTP 状态码文案
    ├── state.ts          # 运行时状态（refreshToken 回调、错误回调）
    ├── helpers.ts        # 响应解析、错误处理、重试判断等辅助函数
    ├── instance.ts       # Axios 实例 + 拦截器（token 注入、401 刷新、重试）
    └── types.ts          # 请求相关的类型定义
```

---

## 1. 剪贴板操作

**文件**: `src/utils/index.ts`

```typescript
import { useClipboard } from '@vueuse/core'

/** 复制文本到剪贴板 */
export async function copy(text: string): Promise<void>
```

**使用示例**:

```vue
<template>
  <el-button @click="handleCopy">复制</el-button>
</template>

<script setup lang="ts">
import { copy } from '@/utils'

async function handleCopy() {
  await copy('要复制的文本')
}
</script>
```

---

## 2. Token 管理

**文件**: `src/utils/token/index.ts`

基于 `js-cookie` 封装，cookie 名 `admin_token`。

```typescript
/** 设置 token */
export function setToken(token: string): string | undefined

/** 获取 token */
export function getToken(): string | undefined

/** 移除 token */
export function clearToken(): string | undefined
```

**使用示例**:

```typescript
import { getToken, setToken, clearToken } from '@/utils'

// 登录后保存
setToken('xxx-token')

// 请求时读取
const token = getToken()

// 退出登录清除
clearToken()
```

---

## 3. 存储管理 (Storage)

**文件**: `src/utils/storage/index.ts`
**类型定义**: `src/types/storage.d.ts`

对 `localStorage` / `sessionStorage` 的类型安全封装，自动处理 JSON 序列化/反序列化。

### 类型安全机制

所有存储键和值类型在 `src/types/storage.d.ts` 的 `Storage.StorageValueMap` 中统一维护：

```typescript
interface StorageValueMap {
  token: string
  userInfo: Record<string, unknown>
  language: string
  sidebarStatus: 0 | 1
  size: 'default' | 'medium' | 'small' | 'mini'
  themeMode: ThemeMode
  themePrimaryColor: string
  themeFontSizeLevel: ThemeFontSizeLevel
  themeSnapshot: ThemeSnapshot
}
```

### API

```typescript
/**
 * 设置存储
 * @param key   键名（自动推导 value 类型）
 * @param value 值（对象自动转 JSON）
 * @param type  存储类型，默认 'local'
 */
export function setStorage<K extends Storage.StorageKey>(
  key: K,
  value: Storage.StorageValue<K>,
  type?: Storage.StorageType
): void

/**
 * 获取存储
 * @param key  键名
 * @param type 存储类型，默认 'local'
 * @returns 解析后的数据，失败或不存在返回 null
 */
export function getStorage<K extends Storage.StorageKey>(
  key: K,
  type?: Storage.StorageType
): Storage.StorageValue<K> | null

/**
 * 移除存储
 */
export function removeStorage(key: Storage.StorageKey, type?: Storage.StorageType): void

/**
 * 清空所有存储
 */
export function clearStorage(type?: Storage.StorageType): void
```

**使用示例**:

```typescript
import { setStorage, getStorage, removeStorage } from '@/utils'

// 自动推导类型：value 类型为 'default' | 'medium' | 'small' | 'mini'
setStorage('size', 'small')

// 自动推导返回类型为 'default' | 'medium' | 'small' | 'mini' | null
const size = getStorage('size')

// 使用 sessionStorage
setStorage('userInfo', { name: 'admin' }, 'session')

// 移除
removeStorage('token')
```

---

## 4. 系统工具

### 页面标题国际化

**文件**: `src/utils/system/i18n.ts`

```typescript
/**
 * 获取页面标题（格式：页面名 + 分隔符 + 网站名）
 * @param pageTitle 页面标题的 i18n key（可选）
 * @returns 完整的页面标题字符串
 *
 * @example
 * getPageTitle('menu.dashboard') // '仪表盘 - Vue Admin'
 * getPageTitle(undefined)        // 'Vue Admin'（只返回站点名）
 */
export function getPageTitle(pageTitle: string | undefined): string
```

> 从 `@/config` 读取 `settingConfig.title`（站点名）和 `settingConfig.titleSeparator`（分隔符）。

---

## 5. 拼音工具

**文件**: `src/utils/pinyin/index.ts`

基于 `pinyin-pro` 库封装，支持中英文混合字符串。

```typescript
/**
 * 中文转拼音
 * @param text    要转换的字符串（支持中英文混合）
 * @param options 转换配置
 * @returns 转换后的拼音字符串
 *
 * @example
 * pinyin('张三')                // 'zhang san'
 * pinyin('张三', { style: 'name' })     // 'zhangsan'
 * pinyin('李四', { style: 'initials' }) // 'ls'
 */
export default function pinyin(
  text: string,
  options?: {
    style?: 'normal' | 'name' | 'initials'
    config?: Parameters<typeof pinyinUtil>[1]
  }
): string
```

**style 说明**:
| 值 | 效果 | 示例 |
|---|---|---|
| `normal` (默认) | 带空格分隔 | `'zhang san'` |
| `name` | 连续无空格 | `'zhangsan'` |
| `initials` | 首字母小写 | `'zs'` |

**使用示例**:

```typescript
import pinyin from '@/utils/pinyin'

pinyin('张三') // 'zhang san'
pinyin('张三', { style: 'name' }) // 'zhangsan'
pinyin('Hello 世界', { style: 'initials' }) // 'hs'
```

---

## 6. 网络请求 (Request)

**文件**: `src/utils/request/`

基于 Axios 的完整请求层封装，支持：

- 请求/响应拦截器（自动注入 token）
- 401 自动刷新 token 并重试
- 请求失败自动重试
- 统一的响应体解析
- 错误处理回调注入

### 6.1 导出

```typescript
import request from '@/utils/request'

// 或按需导入：
import request, { setRefreshTokenHandler, setRequestErrorHandler } from '@/utils/request'
```

#### `request`

默认导出的 **AxiosInstance**，已配置好所有拦截器。直接使用 GET / POST / PUT / DELETE 等方法：

```typescript
// GET 请求
const { data } = await request.get('/api/users', { params: { page: 1 } })

// POST 请求
const { data } = await request.post('/api/login', { username, password })

// 自定义配置
const { data } = await request({
  method: 'get',
  url: '/api/users',
  params: { page: 1 },
  /** 请求层面的错误提示开关（默认 true），设置为 false 则不提示错误 */
  showErrorMessage: false,
  /** 是否跳过自动重试（默认 false），设置为 true 则出错不重试 */
  skipRetry: true,
})
```

#### `setRefreshTokenHandler(handler)`

注入刷新 token 的回调函数。通常在登录模块初始化时调用：

```typescript
import { setRefreshTokenHandler } from '@/utils/request'
import { refreshTokenApi } from '@/api/login'

// 注入刷新 token 的逻辑
setRefreshTokenHandler(async () => {
  const res = await refreshTokenApi()
  return res.data.token
})
```

#### `setRequestErrorHandler(handler)`

注入请求错误回调（例如显示 ElMessage 错误提示）：

```typescript
import { setRequestErrorHandler } from '@/utils/request'

// 注入 UI 层面的错误提示
setRequestErrorHandler((message: string) => {
  ElMessage.error(message)
})
```

### 6.2 辅助函数（内部使用，可复用）

**文件**: `src/utils/request/helpers.ts`

```typescript
/**
 * 解析统一响应体
 * 假设后端返回 { code: number, data: T, message: string } 格式
 */
export function resolveResponse<T>(data: { code: number; data: T; message: string }): T

/** 判断是否需要显示错误提示（根据请求配置） */
export function shouldShowError(config?: { showErrorMessage?: boolean }): boolean

/** 创建请求错误对象（标准化的错误结构） */
export function createRequestError(payload: { message: string; code?: number }): Error

/** 从 HTTP 状态码解析错误文案 */
export function resolveErrorMessage(error: { response?: { status: number } }): string

/** 判断请求是否应该重试 */
export function shouldRetry(error: any, config?: { skipRetry?: boolean }): boolean

/** 重定向到登录页（携带当前路由作为 redirect 参数） */
export function redirectToLogin(): void
```

**使用示例**（在 API 模块中直接使用 `request` 即可，一般无需手动调用 helper）:

```typescript
import { resolveResponse } from '@/utils/request/helpers'

// 如果直接使用 axios 而非 request 实例，可用 resolveResponse 解析响应体
const data = resolveResponse(response.data)
```

### 6.3 常量

**文件**: `src/utils/request/constants.ts`

```typescript
export const DEFAULT_RETRY = 1 // 默认重试次数
export const DEFAULT_RETRY_DELAY = 300 // 默认重试延迟（ms）

export const HTTP_STATUS_MSG: Record<number, string> = {
  400: '请求参数错误',
  401: '登录已过期，请重新登录',
  403: '拒绝访问',
  404: '请求资源不存在',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
}
```

---

## 使用原则

1. **优先使用**：当需要实现某个功能时，优先检查本 skill 文档，看 `src/utils/` 中是否已有对应方法
2. **不要重复封装**：例如不要自己封装 localStorage 操作，直接用 `setStorage` / `getStorage`
3. **请求用 request**：所有 API 调用使用 `@/utils/request` 的默认导出，不要直接用 axios
4. **token 操作**：通过 `@/utils` 导出的 `getToken` / `setToken` / `clearToken`，不要直接操作 cookie
