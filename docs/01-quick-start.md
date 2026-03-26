# 快速开始

## 1. 环境要求

- Node：`^20.19.0 || >=22.12.0`
- 包管理器：`pnpm`
- 推荐先执行：

```bash
corepack enable
```

## 2. 安装依赖

```bash
pnpm install
```

## 3. 启动开发环境

```bash
pnpm dev
```

默认会启动 Vite 本地开发服务。

## 4. 构建生产包

### 默认构建

```bash
pnpm build
```

当前默认等价于：

```bash
pnpm build:dev
```

### 指定环境构建

```bash
pnpm build:dev
pnpm build:test
pnpm build:uat
pnpm build:prod
```

## 5. 本地预览构建结果

```bash
pnpm preview
```

## 6. Sentry 使用说明

当前 `master` 分支默认不带 Sentry 监控能力。

如果你需要下面这些内容：

- 前端错误监控
- 构建时 sourcemap 上传
- 运行时 Sentry 开关与 DSN 配置
- 发布后的堆栈还原能力

请直接把 `sentry` 分支合并到当前分支。

推荐做法：

- 直接在常用 Git 客户端里执行合并
- 合并后再查看 `package.json`、`vite.config.ts`、`src/main.ts` 和 `.env.*` 中的 Sentry 相关改动

这样设计的原因是：

- Sentry 改动不仅是多一个 SDK 依赖，还会连带影响初始化入口、构建插件、运行时配置和环境变量
- 对没有监控需求的项目来说，这些内容不是默认必需项
- 把这部分能力放在独立分支里，可以让主线保持更轻量；真正需要监控时，再一次性合并整套能力，维护成本和冲突范围会更可控

## 7. Electron 使用说明

当前 `master` 分支默认只保留 Web 管理后台所需内容。

如果你需要下面这些 Electron 能力：

- Windows 客户端打包
- `file://` 场景下的路由兼容
- Electron 主进程请求桥接
- Electron 环境下的 token 持久化与运行时配置

请直接把 `electron` 分支合并到当前分支。

推荐做法：

- 直接在常用 Git 客户端里执行合并
- 合并后再查看 Electron 相关脚本、目录和补充文档

这样设计的原因是：

- Electron 改动不只是新增一个 `electron/` 目录，还会同步调整构建脚本、Vite 配置、路由模式、请求层和登录态处理
- 对纯 Web 场景来说，这些依赖和兼容代码并不是必需项
- 把 Electron 能力放在独立分支，可以让主线保持更轻量；真正需要桌面端时，再通过一次合并把整套能力带进来，维护成本和冲突范围都更可控

## 8. 常用命令速查

### 开发与构建

```bash
pnpm dev
pnpm build
pnpm build:dev
pnpm build:test
pnpm build:uat
pnpm build:prod
pnpm preview
pnpm analyze
```

### 质量检查

```bash
pnpm lint:oxlint
pnpm lint
pnpm lint:fix
pnpm lint:ci
pnpm lint:all
```

### 自动化能力

```bash
pnpm openApi
pnpm openApi:modules
pnpm openI18n
pnpm changelog
```

### 测试

```bash
pnpm test
pnpm test:e2e
```

测试详细说明见：[测试指南](../TESTS.md)

## 9. 目录结构

```text
vue-admin/
├── src/                  # 业务代码
├── openApi/              # OpenAPI 代码生成器
├── openI18n/             # 国际化扫描与生成工具
├── deploy/               # Nginx 与部署脚本
├── .github/workflows/    # CI/CD 工作流
├── THEME.md              # 换肤系统说明
├── TESTS.md              # 测试文档
├── ICONS.md              # 图标文档
└── README.md             # 项目首页导航
```

## 10. 新人建议阅读顺序

1. 先跑通 `pnpm install && pnpm dev`
2. 了解 [OpenAPI 代码生成与本地跨域代理](../openApi/generate/入参数据结构.md)
3. 了解 [自动部署到阿里云 ECS](./02-deploy-aliyun.md)
4. 再按需看换肤、图标、测试、国际化文档
