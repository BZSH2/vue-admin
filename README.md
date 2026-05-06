# 手把手带你撸后台

> 一个基于 **Vue 3 + Vite + Element Plus** 的后台管理前端模板，内置 **多环境构建、换肤系统、OpenAPI 代码生成、国际化、测试体系、阿里云自动部署**。

## 在线预览

- GitHub Pages：<https://bzsh2.github.io/vue-admin/#/>
- ECS 演示：<http://vue.admin.bzsh.fun/>
- 接口文档：<http://vue.admin.bzsh.fun/docs>

## 功能点

- [快速开始](docs/01-quick-start.md)
- [自动部署到阿里云 ECS（含多环境 / CI-CD）](docs/02-deploy-aliyun.md)
- [OpenAPI 代码生成与本地跨域代理](openApi/generate/入参数据结构.md)
- [国际化自动提取（openI18n）](docs/03-openi18n.md)
- [提交规范与 CHANGELOG](docs/04-commit-and-changelog.md)
- [PR 自动 Review / Merge 前门禁（CodeRabbit + CODEOWNERS + 分支保护）](docs/05-pr-auto-review.md)
- [换肤系统说明](docs/THEME.md)
- [SVG 图标系统](docs/ICONS.md)
- [测试指南（Vitest + Playwright）](docs/TESTS.md)
- [AI Skill 集成说明](docs/SKILLS.md)

## 项目一句话目录

- `src/`：业务代码、页面、路由、状态管理、样式、i18n
- `openApi/`：OpenAPI 生成器、模板、模块配置
- `openI18n/`：国际化扫描与语言包生成工具
- `deploy/`：Nginx 与 ECS 部署脚本
- `.github/workflows/`：GitHub Actions 工作流

## 常用命令

```bash
pnpm install
pnpm dev
pnpm build
pnpm build:dev
pnpm build:test
pnpm build:uat
pnpm build:prod
pnpm test
pnpm test:e2e
pnpm openApi
pnpm openI18n
```

## Sentry 相关说明

- 当前 `master` 分支默认不包含 Sentry 监控初始化、sourcemap 上传插件和对应环境变量。
- 如果项目需要前端错误监控和发布后的堆栈还原，请将 `sentry` 分支合并到当前分支。
- 推荐直接在常用 Git 客户端中执行分支合并，这样更容易看清 `package.json`、`vite.config.ts`、`src/main.ts`、运行时配置和 `.env` 文件里的差异。
- 之所以把 Sentry 能力拆到独立分支，是因为这部分改动不仅包含 SDK 依赖，还会同步影响构建上传、运行时开关、类型声明和部署配置。默认放在 `master` 之外，可以让不需要监控的 Web 场景保持更轻、更干净。

## Electron 相关说明

- 当前 `master` 分支默认聚焦 Web 管理后台，不直接包含 Electron 客户端打包与运行时兼容逻辑。
- 如果项目需要 Electron 相关功能，例如 Windows 客户端打包、`file://` 路由兼容、桌面端请求桥接，请将 `electron` 分支合并到当前分支即可。
- 推荐直接在常用 Git 客户端中执行分支合并，这样更容易看清共享文件差异和冲突位置。
- 之所以把 Electron 能力放在独立分支，是因为这部分改动不仅包含新增目录和打包脚本，还会影响 `package.json`、`vite.config.ts`、路由、请求层和 token 持久化逻辑。默认拆开维护，可以让纯 Web 场景保持更轻、更稳定；只有真正需要桌面端时再合并，会更清晰也更容易控制风险。

## 推荐阅读顺序

1. 先看 [快速开始](docs/01-quick-start.md)
2. 再看 [OpenAPI 代码生成与本地跨域代理](openApi/generate/入参数据结构.md)
3. 接着看 [自动部署到阿里云 ECS](docs/02-deploy-aliyun.md)
4. 最后按需查看换肤、图标、测试、国际化、提交规范等专题文档
