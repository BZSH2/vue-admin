# 快速开始

## 1. 环境要求

- Node: `^20.19.0 || >=22.12.0`
- 包管理器: `pnpm`

推荐先执行：

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

## 4. 构建 Web 端

### 清理构建产物

```bash
pnpm clean:build
```

会统一清理以下目录，适合重新打包前执行：

- `dist/`
- `dist-electron/`
- `.output/`
- `release/` 与 `release-*`

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

Web 构建产物统一输出到 `dist/`。

## 5. 预览 Web 构建结果

```bash
pnpm preview
pnpm preview-https
```

## 6. Electron 相关命令

```bash
pnpm build:electron:renderer
pnpm preview:electron
pnpm build:electron:unpacked
pnpm build:electron
```

Electron 相关产物统一输出到 `dist-electron/`。

如果是安装后的 Electron 应用：

- 不要继续使用 Web 部署里的同域 `/api` 思路
- 首次启动后会在用户目录生成 `runtime-config.json`
- 当前默认后端地址是 `http://8.133.21.62:35000`
- 如果需要切换环境，再把里面的 `apiBaseUrl` 改成新的绝对地址

详细说明见：[Electron 打包与产物说明](./06-electron-packaging.md)

## 7. 常用命令速查

### 开发与构建

```bash
pnpm dev
pnpm clean:build
pnpm build
pnpm build:dev
pnpm build:test
pnpm build:uat
pnpm build:prod
pnpm preview
pnpm analyze
```

### Electron 打包

```bash
pnpm build:electron:renderer
pnpm preview:electron
pnpm build:electron:unpacked
pnpm build:electron
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

测试详细说明见：[测试指南](./TESTS.md)

## 8. 目录结构

```text
vue-admin/
├── src/                   # 业务代码
├── electron/              # Electron 主进程 / preload / 打包配置
├── openApi/               # OpenAPI 代码生成器
├── openI18n/              # 国际化扫描与生成工具
├── deploy/                # Nginx 与部署脚本
├── dist/                  # Web 构建产物
├── dist-electron/         # Electron 构建产物
├── .github/workflows/     # CI/CD 工作流
├── docs/                  # 项目文档
└── README.md              # 项目首页导航
```

## 9. 新人建议阅读顺序

1. 先跑通 `pnpm install && pnpm dev`
2. 阅读 [Electron 打包与产物说明](./06-electron-packaging.md)
3. 阅读 [OpenAPI 代码生成与本地跨域代理](../openApi/generate/入参数据结构.md)
4. 再按需查看部署、换肤、图标、测试、国际化等专题文档
