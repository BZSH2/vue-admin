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

## 6. 常用命令速查

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
pnpm lint
pnpm lint:fix
pnpm lint:all
pnpm typecheck
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

## 7. 目录结构

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

## 8. 新人建议阅读顺序

1. 先跑通 `pnpm install && pnpm dev`
2. 了解 [OpenAPI 代码生成与本地跨域代理](../openApi/generate/入参数据结构.md)
3. 了解 [自动部署到阿里云 ECS](./02-deploy-aliyun.md)
4. 再按需看换肤、图标、测试、国际化文档
