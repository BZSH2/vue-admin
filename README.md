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
- [换肤系统说明](THEME.md)
- [SVG 图标系统](ICONS.md)
- [测试指南（Vitest + Playwright）](TESTS.md)

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

## 推荐阅读顺序

1. 先看 [快速开始](docs/01-quick-start.md)
2. 再看 [OpenAPI 代码生成与本地跨域代理](openApi/generate/入参数据结构.md)
3. 接着看 [自动部署到阿里云 ECS](docs/02-deploy-aliyun.md)
4. 最后按需查看换肤、图标、测试、国际化、提交规范等专题文档
