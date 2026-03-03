# vue-admin

This template should help get you started developing with Vue 3 in Vite.

## 在线预览

- https://bzsh2.github.io/vue-admin/#/

## 快速开始

- 环境要求
  - Node：^20.19.0 或 ≥22.12.0（见 engines）
  - 包管理器：pnpm（建议最新版）
- 安装依赖

```sh
pnpm install
```

- 本地开发

```sh
pnpm dev
```

- 构建产物

```sh
pnpm build
```

## 常用脚本

- 开发与构建
  - pnpm dev：启动本地开发
  - pnpm build：类型检查 + 产物构建
  - pnpm preview：本地预览构建产物
- 质量与规范
  - pnpm lint：运行 ESLint 检查
  - pnpm lint:fix：ESLint 自动修复
  - pnpm lint:all：Oxlint + ESLint 全量检查
  - pnpm typecheck：TypeScript 类型检查
  - pnpm cz：规范化提交（cz-git）
  - pnpm test：运行单元测试 ([文档](file:///d:/demo/vue-admin/TESTS.md))
- 自动化
  - pnpm openI18n：扫描并生成多语言 JSON
  - pnpm openApi：依据 OpenAPI 生成 api 代码
  - pnpm changelog：生成/更新 CHANGELOG.md

## 国际化自动提取与生成（openI18n）

通过一条命令扫描项目中的国际化键并为所有支持的语言生成占位翻译，便于快速起步与增量维护。

- 使用命令
  - 运行：`pnpm openI18n`
- 工作流程
  - 扫描范围：`src/**/*.vue` 中的以下用法
    - **Template**: `$t('xxx')`、`v-t="'xxx'"`、`{{ $t('xxx') }}`
    - **Script**: `$t('xxx')`、`t('xxx')`、`I18n.t('xxx')`
    - **Custom Block**: `<i18n>` 块中的 JSON 内容
  - 语言配置来源：在 [lang.ts](file:///d:/vue-admin/src/config/lang.ts) 中维护 `langDict`（如 zh-CN、en、ja 等）
  - 输出位置：在 [src/i18n/lang](file:///d:/vue-admin/src/i18n/lang) 下生成各语言的 `*.json`
  - 覆盖行为：命令会先清空 `src/i18n/lang` 再重新生成
  - 翻译实现：依赖 `google-translate-api-x` 为新键生成机器翻译（网络可达时生效）
- 关键实现
  - 扫描与生成逻辑见 [openI18n/index.ts](file:///d:/vue-admin/openI18n/index.ts) 与 [extract.ts](file:///d:/vue-admin/openI18n/extract.ts)
  - 语言列表来自 [src/config/lang.ts](file:///d:/vue-admin/src/config/lang.ts)
- 使用建议
  - 首次生成后请在业务中逐步修正机器翻译
  - 新增/修改语言时先更新 `langDict` 再运行命令

### 企业级翻译中台优先覆盖

在企业与团队协作场景下，建议对“机翻不准”的内容由专业人员在内部“国际化中台”进行统一维护与校对。openI18n 可在运行时优先使用中台返回的已审核翻译，保证关键术语、品牌词与敏感文案的准确性。

- 设计思路
  - 中台维护“已审核翻译字典”，结构示例：
    - `{ "welcome.title": { "zh-CN": "欢迎", "en": "Welcome", "ja": "ようこそ" } }`
  - 执行 openI18n 时，先通过接口拉取这份字典
  - 生成语言文件时采用如下优先级：
    - 中台已审核翻译 > 既有语言文件值 > 机器翻译
  - 未命中的键再回退到机器翻译填充，确保新键不丢失
- 接入建议
  - 在 openI18n 的入口逻辑（如 [openI18n/index.ts](file:///d:/vue-admin/openI18n/index.ts)）中增加：
    - 拉取中台字典的 API 调用（含鉴权）
    - 将中台字典注入生成流程，按“中台优先”的策略合并
  - 将接口地址、鉴权方式与语言列表与项目配置统一管理（如结合 [src/config/lang.ts](file:///d:/vue-admin/src/config/lang.ts)）
  - 中台端建议支持术语表、品牌词与高频文案的分类管理与审核流程
  - 为防止不必要覆盖，保留“仅补全缺失键”的策略可作为可选开关

### i18n 使用示例

- **视图中使用 (Template)**

```vue
<template>
  <div>{{ $t('welcome.title') }}</div>
  <button v-t="'actions.confirm'"></button>
</template>
```

- **脚本中使用 (Script)**

```ts
// Composition API
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const msg = t('message.hello')

// Global I18n instance (outside components)
import i18n from '@/i18n'
const msg2 = i18n.global.t('message.world')
```

- **自定义块中使用 (Custom Block)**

```vue
<i18n>
{
  "en": {
    "hello": "hello world!"
  },
  "zh-CN": {
    "hello": "你好，世界！"
  }
}
</i18n>
```

- 语言包结构（示例：en.json）

```json
{
  "welcome": {
    "title": "Welcome"
  },
  "actions": {
    "confirm": "Confirm"
  }
}
```

- 注意事项
  - 运行 openI18n 会清空并重新生成 `src/i18n/lang`，请务必将翻译内容纳入版本管理
  - 机器翻译仅作占位与参考，生产建议手动校对
  - 如果网络不可达，翻译会降级为 key 本身

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
pnpm build

# Runs the end-to-end tests
pnpm test:e2e
# Runs the tests only on Chromium
pnpm test:e2e --project=chromium
# Runs the tests of a specific file
pnpm test:e2e tests/example.spec.ts
# Runs the tests in debug mode
pnpm test:e2e --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

## 目录结构

- 核心目录
  - src：业务代码、样式、路由、i18n 配置与语言包
  - openI18n：i18n 键扫描与语言包生成工具
  - openApi：OpenAPI 生成器与模板
  - .github/workflows：CI/CD 工作流
  - .husky：Git 钩子

## SVG 图标组件 (Icon)

基于 `vite-plugin-svg-icons` 的全自动图标管理方案，无需繁琐的 Import。

- **文档与示例**：[ICONS.md](file:///d:/demo/vue-admin/ICONS.md)
- **添加图标**：将 `.svg` 文件放入 `src/icons/svg` 目录即可
- **使用方式**：直接在模板中使用 `<Icon name="icon-name" />`

## OpenAPI 自动代码生成（openApi）

从 OpenAPI 描述生成类型与接口请求封装，规范前后端契约并减少手写样板代码。

- 使用命令
  - 运行：`pnpm openApi`
- 数据来源
  - 当前示例通过 Apifox mock 接口获取 OpenAPI JSON
  - 入参与模块组织见 [openApi/modules](file:///d:/vue-admin/openApi/modules) 与 [openApi/index.ts](file:///d:/vue-admin/openApi/index.ts)
- 产物说明
  - 输出目录：默认生成到 [src/api](file:///d:/demo/vue-admin/src/api) 下，按服务名分目录
  - 生成内容：TypeScript 类型定义、请求方法封装
  - 模板位置： [templates](file:///d:/demo/vue-admin/openApi/generate/generateTemplate/templates)（nunjucks，可自定义）
- 更多配置
  - [OpenAPI 入参结构与本地跨域指南](https://github.com/BZSH2/vue-admin/blob/master/openApi/generate/入参数据结构.md)
- 核心实现
  - 入口与调度：[openApi/generate/index.ts](file:///d:/vue-admin/openApi/generate/index.ts)
  - 类型与请求生成：`generateTsType.ts`、`generateRequest.ts`
- 使用建议
  - 调整模板适配你的接口风格（如统一响应体、错误码处理）
  - 多服务/多模块场景可在 `modules` 中分组管理

### 自定义模板与模块

- 模板目录
  - [openApi/generate/generateTemplate/templates](file:///d:/vue-admin/openApi/generate/generateTemplate/templates)
  - 可根据团队规范修改 `interface.njk`、`serviceController.njk` 等
- 模块组织
  - 在 [openApi/modules](file:///d:/vue-admin/openApi/modules) 中配置不同域/服务
  - Apifox/后端提供的 OpenAPI JSON 可按模块组合返回

## 自动化部署（GitHub Actions）

已内置 GitHub Actions 工作流，push 到指定分支后自动构建并发布到 GitHub Pages。

- 工作流文件
  - [deploy.yml](file:///d:/vue-admin/.github/workflows/deploy.yml)
- 触发条件
  - 推送到 `master` 分支触发
- 构建与发布
  - Node 与 pnpm 环境初始化 → `pnpm install` → `pnpm build`
  - 使用 `peaceiris/actions-gh-pages` 将 `dist` 发布到 `gh-pages` 分支
- 必要配置
  - 在仓库 Settings → Secrets 配置 `VUE_ADMIN`（GitHub Token）
  - 在 Pages 中选择 `gh-pages` 作为发布分支
  - 若为子路径部署（如 username.github.io/repo），请在 vite.config 中设置 `base` 并在路由中适配
- 本地预览
  - 构建后使用 `pnpm preview` 在本地验证发布内容

## AI 代码审查 (CodeRabbit)

本项目推荐使用 [CodeRabbit AI](https://coderabbit.ai/) 进行自动化的 Pull Request 代码审查，提升代码质量并减少人工审查负担。

- **核心功能**
  - **自动摘要**：为 PR 生成详细的变更摘要与上下文说明
  - **深度审查**：识别潜在 Bug、性能瓶颈与安全漏洞
  - **交互式对话**：在评论区直接与 AI 讨论代码逻辑
  - **一键建议**：提供可直接应用的改进代码块
- **使用方式**
  1. 访问 [CodeRabbit](https://coderabbit.ai/) 并为仓库安装 GitHub App
  2. 发起 Pull Request 即可自动触发审查
  3. 在 PR 评论区回复 `@coderabbitai` 进行进一步交互（如解释代码、请求优化建议）

## 提交前检查与规范

提交时会自动执行 ESLint/格式化/类型检查，确保代码质量一致。

- 提交钩子（Husky）
  - pre-commit：执行 `npm run lint:all`（Oxlint + ESLint）与 `npm run typecheck`
    - 钩子脚本见 [.husky/pre-commit](file:///d:/vue-admin/.husky/pre-commit)
  - pre-push：自动生成并提交 `CHANGELOG.md`
- 分段检查（lint-staged）
  - 配置见 [lint-staged.config.ts](file:///d:/vue-admin/lint-staged.config.ts)
  - JS/TS/Vue：`prettier → oxlint → eslint`
  - 样式文件：`stylelint → prettier`
  - Markdown/JSON：`prettier`
- 常用命令
  - 运行全部 Lint：`pnpm lint:all`
  - 仅修复：`pnpm lint:fix`
  - 交互式提交（规范化 commit）：`pnpm cz`

## 提交规范与变更日志

- 提交规范
  - 使用 `pnpm cz` 发起规范化提交（集成 cz-git）
  - commitlint 校验规范，避免不合规提交信息
- 变更日志
  - push 前会通过 `.husky/pre-push` 自动生成/更新 `CHANGELOG.md`
  - 可手动执行 `pnpm changelog`

## 常见问题

- openI18n 翻译失败
  - 检查网络连通性；失败时会使用 key 作为占位翻译
  - 可多次运行命令增量生成
- openApi 生成为空或结构异常
  - 确认 Apifox/后端返回的 OpenAPI JSON 合规，查看 [openApi/index.ts](file:///d:/vue-admin/openApi/index.ts) 的接口配置
  - 根据需要调整模板或 `modules` 组织方式
- Node 版本不匹配
  - 按 `package.json` 中 `engines` 要求使用 Node 20.19.0 或 22.12.0+
