# Sentry 使用说明

本文说明当前 `sentry` 分支里前端监控的接入位置、环境变量、构建上传和运行时覆盖方式。

## 1. 当前分支包含什么

这个分支已经接入了以下能力：

- `src/main.ts` 中会调用 `setupSentry(app)`
- `src/plugins/sentry.ts` 负责按配置初始化 `@sentry/vue`
- `vite.config.ts` 中集成了 `@sentry/vite-plugin`，用于构建时上传 sourcemap
- `public/runtime-config.js` 支持在部署后动态覆盖 Sentry 开关和 DSN

也就是说，只要使用这个分支，并补齐对应配置，就可以直接启用前端监控。

## 2. 代码入口

- 初始化入口：[src/main.ts](../src/main.ts)
- 监控插件：[src/plugins/sentry.ts](../src/plugins/sentry.ts)
- 运行时配置：[public/runtime-config.js](../public/runtime-config.js)
- 构建上传插件：[vite.config.ts](../vite.config.ts)
- 运行时配置读取：[src/config/runtime.ts](../src/config/runtime.ts)

## 3. 运行时开关

前端初始化时会同时读取两类配置：

- 构建期：`.env.*` / `import.meta.env`
- 运行期：`public/runtime-config.js`

优先级是运行期高于构建期，所以线上如果不想重新构建，也可以直接调整 `dist/runtime-config.js`。

### 环境变量

项目当前使用这几个前端变量：

```env
VITE_SENTRY_ENABLE=true
VITE_SENTRY_DSN=https://xxxx@xxxx.ingest.sentry.io/xxxx
VITE_SENTRY_ENV=production
```

含义：

- `VITE_SENTRY_ENABLE`：是否初始化 Sentry
- `VITE_SENTRY_DSN`：前端上报 DSN
- `VITE_SENTRY_ENV`：环境标识，例如 `dev`、`test`、`uat`、`production`

### 运行时覆盖

如果要在线上快速开关，可以在 `public/runtime-config.js` 或部署后的 `dist/runtime-config.js` 中配置：

```js
window.__RUNTIME_CONFIG__ = {
  apiBaseUrl: '/',
  sentry: {
    enable: true,
    dsn: 'https://xxxx@xxxx.ingest.sentry.io/xxxx',
    env: 'production',
  },
}
```

## 4. 构建时上传 sourcemap

仅初始化前端 SDK 还不够。如果希望线上错误堆栈能正确还原源码，还需要在构建时上传 sourcemap。

当前构建插件会读取这些环境变量：

```env
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-auth-token
SENTRY_RELEASE=your-release
```

说明：

- `SENTRY_ORG`：Sentry 组织
- `SENTRY_PROJECT`：项目名
- `SENTRY_AUTH_TOKEN`：上传 sourcemap 所需 token
- `SENTRY_RELEASE`：本次发布版本号，建议和发布流水线保持一致

如果没有这些变量，前端构建仍可进行，但 sourcemap 上传能力无法正常发挥作用。

## 5. 推荐使用方式

### 本地开发

如果只是本地调试业务逻辑，通常建议先关闭：

```env
VITE_SENTRY_ENABLE=false
```

这样可以避免本地开发噪音进入监控平台。

### 测试或生产环境

推荐做法：

1. 在对应 `.env.*` 中开启 `VITE_SENTRY_ENABLE`
2. 配置正确的 `VITE_SENTRY_DSN` 和 `VITE_SENTRY_ENV`
3. 在 CI 或构建环境中注入 `SENTRY_ORG`、`SENTRY_PROJECT`、`SENTRY_AUTH_TOKEN`、`SENTRY_RELEASE`
4. 执行常规构建命令，例如 `pnpm build:prod`

## 6. 常见排查

### 页面没有上报

优先检查：

- `VITE_SENTRY_ENABLE` 是否为 `true`
- `VITE_SENTRY_DSN` 是否为空
- 线上 `runtime-config.js` 是否把 `sentry.enable` 覆盖成了 `false`

### 线上堆栈没有还原

优先检查：

- 构建时是否注入了 `SENTRY_AUTH_TOKEN`
- `SENTRY_RELEASE` 是否和实际发布版本一致
- sourcemap 上传是否成功

### 想完全移除 Sentry

如果当前项目不需要监控，建议直接基于 `master` 分支开发；`master` 会保持不带 Sentry 依赖和初始化逻辑的默认形态。
