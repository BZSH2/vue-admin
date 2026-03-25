# Electron 打包与产物说明

本文说明 Electron 相关文件结构、当前的产物目录拆分方式、几个打包命令的区别，以及提交到 Git 时需要注意的限制。

## 1. 相关文件结构

```text
vue-admin/
├── electron/
│   ├── builder.yml           # electron-builder 配置
│   ├── main.mjs              # Electron 主进程入口
│   └── preload.mjs           # Electron preload 入口
├── dist/                     # Web 构建产物
├── dist-electron/            # Electron 相关构建产物
│   ├── renderer/             # Electron 渲染进程产物
│   └── release/              # Electron 安装包 / unpacked 目录
└── docs/
    └── 06-electron-packaging.md
```

这样拆分后的规则是：

- `pnpm build` 只负责 Web 端，不参与 Electron 打包
- Web 产物固定输出到 `dist/`
- Electron 相关的渲染进程产物、unpacked 目录、安装包统一输出到 `dist-electron/`
- Web 和 Electron 两条构建链路彼此隔离，不会互相覆盖
- `pnpm clean:build` 会统一清理当前产物目录，以及旧版遗留输出目录，便于重新打包

## 2. 打包输出路径

| 类型                    | 路径                                  | 说明                                                                                |
| ----------------------- | ------------------------------------- | ----------------------------------------------------------------------------------- |
| Web 构建产物            | `dist/`                               | `pnpm build` / `pnpm build:prod` 等 Web 构建命令输出目录                            |
| Electron 渲染进程产物   | `dist-electron/renderer/`             | `pnpm build:electron:renderer` 输出目录                                             |
| Electron 解包目录       | `dist-electron/release/win-unpacked/` | `pnpm build:electron:unpacked` 或 `pnpm pack:electron` 产物                         |
| Electron Windows 安装包 | `dist-electron/release/*.exe`         | `pnpm build:electron:installer` / `pnpm dist:electron` / `pnpm build:electron` 产物 |

额外补充：

- `pnpm clean:build` 会清理 `dist/`、`dist-electron/`，以及历史遗留的 `.output/`、`release/`、`release-*`
- 如果你刚调整过构建配置、打包模式或产物目录，建议先执行一次清理再重新构建

## 3. 几个打包命令的区别

### Web 相关

- `pnpm build`
  - 只打包 Web 端
  - 产物输出到 `dist/`
  - 当前仍沿用项目原有逻辑，等价于 `pnpm build:dev`

- `pnpm build:prod`
  - 走生产模式的 Web 构建
  - 同样输出到 `dist/`，会覆盖上一次 Web 产物

- `pnpm preview`
  - 预览 `dist/` 中的 Web 构建结果

### Electron 相关

- `pnpm build:electron:renderer`
  - 只构建 Electron 用的前端页面
  - 产物输出到 `dist-electron/renderer/`
  - 不会生成 `.exe`

- `pnpm preview:electron`
  - 先构建 Electron 渲染进程，再直接启动本地 Electron 预览
  - 适合检查窗口、路由、IPC、外链打开等 Electron 运行效果
  - 不会生成安装包

- `pnpm build:electron:unpacked`
  - 先构建渲染进程，再让 `electron-builder` 输出解包目录
  - 最终会得到 `dist-electron/release/win-unpacked/`

- `pnpm pack:electron`
  - `pnpm build:electron:unpacked` 的兼容别名

- `pnpm build:electron:installer`
  - 先构建渲染进程，再生成 Windows NSIS 安装包
  - 会产出 `.exe` 安装器和 `.blockmap` 文件

- `pnpm dist:electron`
  - `pnpm build:electron:installer` 的兼容别名

- `pnpm build:electron`
  - 当前默认等价于 `pnpm build:electron:installer`
  - 这是最直接的“生成 Windows 安装包”命令

## 4. 推荐使用流程

### 只打 Web

```bash
pnpm clean:build
pnpm build
```

### 本地预览 Electron

```bash
pnpm clean:build
pnpm preview:electron
```

### 只要 unpacked 目录

```bash
pnpm clean:build
pnpm build:electron:unpacked
```

### 直接生成 Windows 安装包

```bash
pnpm clean:build
pnpm build:electron
```

## 5. 安装后的接口配置

Electron 安装包和 Web 部署的接口访问方式不一样：

- Web 端可以用同域 `/api`，再交给 Nginx 反向代理
- Electron 安装包是 `file://` 启动，不能再依赖同域 `/api`
- 安装包内部会改走 Electron 主进程发请求，避免浏览器侧的 CORS 限制

首次启动 Electron 安装包后，会自动在用户目录生成一个运行时配置文件：

- Windows 示例：`%APPDATA%/Vue Admin/runtime-config.json`

默认内容类似这样：

```json
{
  "apiBaseUrl": "http://8.133.21.62:35000"
}
```

当前项目已经内置默认后端地址：

```json
{
  "apiBaseUrl": "http://8.133.21.62:35000"
}
```

如果你需要切到别的环境，再把 `apiBaseUrl` 改成对应后端的绝对地址，例如：

```json
{
  "apiBaseUrl": "http://127.0.0.1:3000"
}
```

注意：

- 这里建议填写“后端服务根地址”或“可直接访问 API 的服务地址”
- 当前项目里的请求路径本身已经带有 `/api/...`
- 如果你把 `apiBaseUrl` 也写成带 `/api` 的地址，最终可能会拼出重复的 `/api/api/...`

如果安装包里看到“网络连接异常”或“缺少可用的 API 地址”，优先检查这个文件。

## 6. Git 相关限制与建议

### 不要提交的内容

- `dist/`
- `dist-electron/`
- 安装包 `.exe`
- `.blockmap`
- 本地调试时生成的临时解包目录

这些内容都属于可重复生成文件，应该通过打包命令重新产出，而不是直接提交到仓库。

### `pnpm cz` 现在做了什么

现在的 `pnpm cz` 只负责启动 Commitizen，不再自动执行下面这些危险动作：

- `git pull`
- `git add .`

这样可以避免把本地产物、临时文件或未确认改动一起带进提交。

### 更安全的提交流程

```bash
git status --short
git add <你确认过的文件>
pnpm cz
```

### 提交前建议

- 先确认 `dist/` 和 `dist-electron/` 没有被加入暂存区
- 提交前运行 `pnpm lint:all && pnpm typecheck`
- 安装包产物建议放在 Release、制品库或 CI 制品中，不要直接提交进 Git

## 7. 和部署的关系

- Docker / Nginx Web 部署读取的是 `dist/`
- Electron 安装包读取的是 `dist-electron/renderer/`
- Electron 安装包运行时接口配置读取的是用户目录下的 `runtime-config.json`
- 两条产物链路彼此隔离，不会互相覆盖
