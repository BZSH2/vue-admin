# 提交规范与 CHANGELOG

为了让多人协作更顺、版本记录更清晰，项目里已经接入了提交规范、提交前检查和变更日志生成。

## 1. 规范化提交

推荐使用：

```bash
pnpm cz
```

作用：

- 交互式选择提交类型
- 自动生成更规范的 commit message
- 方便后续生成 CHANGELOG

## 2. 提交前会自动做什么

项目通过 Husky 接管 Git Hook。

### pre-commit

会执行：

- `npm run lint:lint-staged`
- `npm run typecheck`

目标：

- 提前拦住明显的格式、Lint、类型错误

### pre-push

当前没有强制执行额外打包逻辑，避免把构建产物误带进提交。

## 3. lint-staged 做了什么

已配置 `lint-staged`，只检查暂存区文件。

常见处理规则：

- JS / TS / Vue: `prettier --write` + `oxlint --fix` + `eslint --fix`
- 样式文件: `stylelint --fix` + `prettier --write`
- Markdown / JSON: `prettier --write`

## 4. 常用命令

```bash
pnpm lint
pnpm lint:fix
pnpm lint:all
pnpm typecheck
pnpm changelog
pnpm changelog:release
```

## 5. CHANGELOG 是怎么来的

当前项目通过 `changelogen` 生成：

- 普通生成：`pnpm changelog`
- 发布版本：`pnpm changelog:release`

所以想要 changelog 可读，前提就是 commit message 足够规范。

## 6. 推荐实践

- 日常开发优先用 `pnpm cz`
- 小改动也尽量写清楚 commit 语义
- 提交前先本地跑一遍 `pnpm lint:all && pnpm typecheck`
- 发布前确认 `CHANGELOG.md` 内容是否符合预期

## 7. Git 相关限制

- `pnpm cz` 现在只负责启动 Commitizen，不再自动执行 `git pull` 和 `git add .`
- `dist/`、`dist-electron/`、安装包 `.exe`、`.blockmap` 等产物文件不要提交到 Git
- 提交前先执行 `git status --short`，确认暂存区里只有你真正想提交的源码、配置和文档
- 安装包产物建议放到 Release、制品库或 CI 制品中，不要直接提交进仓库
