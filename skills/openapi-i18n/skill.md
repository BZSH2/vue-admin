# OpenAPI & OpenI18n 工具集

本项目提供两套自动化工具：**openApi**（代码生成）和 **openI18n**（国际化）。位于项目根目录的 `openApi/` 和 `openI18n/` 文件夹。

---

## 一、openApi — 接口模块代码生成

### 概述

基于 Swagger/OpenAPI 文档自动生成 TypeScript 接口请求代码 + 类型定义，减少手动编写 API 层代码。

### 目录结构

```
openApi/
├── index.ts                        # 入口，执行"一键生成"命令
├── genModules.ts                   # 模块注册 + 生成逻辑
├── generate/
│   ├── index.ts                    # 生成协调层
│   ├── utils.ts                    # 通用工具（文件写入、命名转换等）
│   ├── generateRequest.ts          # 生成 API 调用函数（基于 njk 模板）
│   ├── generateTsType.ts           # 生成 TypeScript 类型定义
│   └── generateTemplate/
│       ├── index.ts                # Nunjucks 模板渲染引擎封装
│       └── templates/              # Nunjucks 模板文件
│           ├── interface.njk       # TS 接口定义模板
│           ├── serviceController.njk  # API 请求函数模板
│           ├── openApiModule.njk   # 模块索引模板
│           ├── index.njk           # 总索引模板
│           └── uniapptemplate.njk  # uni-app 平台模板
└── modules/
    ├── index.ts                    # 所有模块统一导出
    └── generated/                  # 生成的代码（不要手动修改）
        ├── openAPI.ts              # 顶层类型定义
        ├── auth.ts                 # 认证模块
        ├── products.ts             # 产品模块
        ├── menus.ts                # 菜单模块
        ├── roles.ts                # 角色模块
        ├── ...                     # 其他业务模块
```

### 工作流程

```
Swagger JSON URL / 本地 JSON
        │
        ▼
  genModules.ts 读取模块配置
        │
        ▼
  generateTsType.ts 解析类型 → 生成 .d.ts / interface
        │
        ▼
  generateRequest.ts 解析接口 → 生成 serviceController
        │
        ▼
  generateTemplate/index.ts 用 Nunjucks 渲染 .njk 模板
        │
        ▼
  modules/generated/*.ts 输出文件
```

### 使用方式

```bash
# 一键生成所有注册模块的 API 代码
pnpm gen:api
```

### 生成的代码示例

```typescript
// modules/generated/products.ts

/** 获取产品列表 GET /api/products */
export function productsControllerFindAll(
  params: {
    page?: number
    pageSize?: number
  },
  options?: { [key: string]: any }
) {
  return request<{ items: Product[]; total: number }>({
    url: `/api/products`,
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  })
}
```

### 注册新模块

在 `genModules.ts` 中添加模块配置：

```typescript
{
  name: '模块名（用于目录和文件名）',
  url: 'Swagger JSON 地址',
  path: '/api/controller-path',
  title: '模块中文描述',
}
```

### 关键文件说明

| 文件                                  | 作用                                                        |
| ------------------------------------- | ----------------------------------------------------------- |
| `openApi/index.ts`                    | 执行入口，调用整个生成流程                                  |
| `openApi/genModules.ts`               | 注册所有需要生成的模块及 Swagger 地址                       |
| `openApi/generate/generateTsType.ts`  | 解析 Swagger 的 `#/components/schemas` 生成 TS 类型         |
| `openApi/generate/generateRequest.ts` | 解析 Swagger 的 `paths` 生成 API 请求函数                   |
| `openApi/generate/utils.ts`           | `writeFile()`, `toCamelCase()`, `toPascalCase()` 等工具函数 |
| `openApi/modules/index.ts`            | 所有生成模块的统一导出入口                                  |

### 模板定制

模板使用 **Nunjucks** 渲染引擎：

- `interface.njk` — 控制 TS 接口/类型的输出格式
- `serviceController.njk` — 控制 API 请求函数的输出格式
- `index.njk` — 控制总索引文件的输出格式

---

## 二、openI18n — 国际化工具

### 概述

基于 vue-i18n 的国际化解决方案，支持：

1. 一键扫描项目中所有 `$t()` / `t()` / `v-t` 调用
2. 自动提取 i18n key 生成语言文件
3. 支持 Google Translate / Bing Translate 自动翻译
4. 支持 9 种语言

### 目录结构

```
openI18n/
├── index.ts            # 执行入口，扫描 + 生成语言文件
├── extract.ts          # I18nExtractor 类：扫描源码、提取 key、生成语言文件
└── ...
src/
├── config/
│   └── lang.ts         # 语言配置（langDict、languages、defaultLang）
└── i18n/
    └── lang/           # 生成的语言文件目录
        ├── zh-CN.ts
        ├── zh-TW.ts
        ├── en.ts
        ├── ja.ts
        └── ...
```

### 支持的语言

| 代码    | 语言       |
| ------- | ---------- |
| `zh-CN` | 中文(简体) |
| `zh-TW` | 中文(繁體) |
| `en`    | English    |
| `ja`    | 日本語     |
| `ko`    | 한국어     |
| `fr`    | Français   |
| `de`    | Deutsch    |
| `ru`    | Русский    |
| `es`    | Español    |

### 使用方式

```bash
# 扫描所有 vue/ts 文件中的 $t() 调用，生成语言文件
pnpm gen:i18n
```

### 提取规则

`I18nExtractor` 类会从以下位置提取 i18n key：

| 上下文          | 匹配模式            | 示例                             |
| --------------- | ------------------- | -------------------------------- |
| Template        | `$t('key')`         | `{{ $t('common.submit') }}`      |
| Template        | `v-t="'key'"`       | `<span v-t="'title'" />`         |
| Script          | `$t('key')`         | `$t('login.username')`           |
| Script          | `t('key')`          | `t('menu.home')`                 |
| Script          | `I18n.t('key')`     | `I18n.t('error.404')`            |
| 路由            | `meta.title: 'key'` | `title: 'route.dashboard'`       |
| SFC `<i18n>` 块 | JSON 中所有 key     | `<i18n>{ "en": { ... } }</i18n>` |

### 翻译引擎

自动翻译通过 `google-translate-api-x` 和 `bing-translate-api` 实现：

```typescript
import { translate as googleTranslate } from 'google-translate-api-x'
import { translate as bingTranslate } from 'bing-translate-api'
```

在 `extract.ts` 的 `generateLangFile()` 方法中，以 `zh-CN` 为源语言，翻译到其他目标语言。

### 项目中的使用

```vue
<template>
  <div>
    <span>{{ $t('common.submit') }}</span>
    <el-button v-t="'common.cancel'" />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
console.log(t('login.title'))
</script>
```

### 关键文件说明

| 文件                  | 作用                                                   |
| --------------------- | ------------------------------------------------------ |
| `openI18n/index.ts`   | 执行入口：扫描全部 `.vue` + `.ts` 文件，生成各语言文件 |
| `openI18n/extract.ts` | `I18nExtractor` 类：正则扫描、提取、翻译、生成         |
| `src/config/lang.ts`  | 语言列表配置（langDict、languages、defaultLang）       |
| `src/i18n/lang/`      | 生成的语言文件存储目录                                 |

### 配置项

`src/config/lang.ts`:

```typescript
export const langDict = [
  { code: 'zh-CN', name: '中文(简体)', flag: 'cn' },
  { code: 'en', name: 'English', flag: 'us' },
  // ...
]

export const languages = langDict.map((item) => item.code)
export const defaultLang = settingConfig.i18n
```

---

## 三、相关命令

```bash
pnpm gen:api    # 一键生成所有 API 模块代码
pnpm gen:i18n   # 扫描并生成国际化语言文件
```

## 四、参考资源

- Swagger/OpenAPI: https://swagger.io/specification/
- vue-i18n: https://vue-i18n.intlify.dev/
- Nunjucks 模板引擎: https://mozilla.github.io/nunjucks/
- `openApi/generate/入参数据结构.md` — API 生成入参数据结构的详细说明
