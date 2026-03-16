# PR 自动 Review / Merge 前质量门禁

这份文档回答两个问题：

1. **PR 自动 Review** 怎么实现（AI / 自动请求审查人）
2. **Merge 前强制 Review** 怎么配置（不通过审查不允许合并）

> 说明：Markdown 文档本身不会“开启自动 review”，它只是说明书。真正的自动化来自 **GitHub 配置 + GitHub App + 工作流**。

---

## 1. 你想要的“自动 review”通常包含 3 件事

### A) AI 自动 Review（例如 CodeRabbit）

- PR 创建/更新后，AI 自动在 PR 评论区输出审查意见
- 优点：零人力、覆盖面广
- 缺点：**不等于强制门禁**（它只是给建议）

### B) 自动请求人工 Review（CODEOWNERS）

- 改到某些目录文件时，GitHub 自动请求对应的人来 review
- 优点：很实用、稳定
- 缺点：需要维护 CODEOWNERS

### C) Merge 前强制门禁（Branch Protection）

- 配置后：没有通过 check / 没有足够 approvals 就无法合并
- 优点：这是“真正能卡住质量”的东西
- 缺点：需要 repo 管理员权限配置

---

## 2. AI 自动 Review：CodeRabbit（推荐用法）

### 2.1 安装 / 授权

1. 在 GitHub 安装 CodeRabbit 的 GitHub App（对本仓库授权）
2. 确保它能读取 PR 内容并写入评论（Comment）

> 安装完成后，**PR 打开/更新**通常就会自动触发审查。

### 2.2 使用方式

- 正常提 PR
- 等 CodeRabbit 自动评论
- 需要追问时，在 PR 评论区回复：
  - `@coderabbitai 请解释这个建议的原因`
  - `@coderabbitai 给一个更安全的改法`

### 2.3 常见问题

- **为什么没触发？**
  - 看看 GitHub App 是否安装到仓库
  - 看看 PR 是否来自 fork（有些 App 对 fork 权限受限）
  - 看看 App 是否被禁用或权限不足

---

## 3. 自动请求人工 Review：CODEOWNERS

如果你希望“改到某块代码就自动叫对应的人来 review”，建议加：

> `.github/CODEOWNERS`

示例（请把 `@your-github-id` 替换成你的 GitHub 用户名/团队）：

```text
# 所有变更默认请求某人 review
* @your-github-id

# 核心工程化配置
/.github/ @your-github-id
/vite.config.ts @your-github-id

# 后端接口生成与请求层
/openApi/ @your-github-id
/src/utils/request/ @your-github-id

# 部署脚本
/deploy/ @your-github-id
/docker-compose.prod.yml @your-github-id
/Dockerfile @your-github-id
```

---

## 4. Merge 前强制门禁：Branch Protection（强烈建议）

GitHub：`Settings -> Branches -> Branch protection rules -> Add rule`

建议对 `master`（或 `main`）开启：

- Require a pull request before merging
- Require approvals（至少 1 个）
- Require status checks to pass（勾选 CI）
- (可选) Restrict who can push

> 这样才能保证“没有 review/没有 CI 通过，就绝对合不进去”。

---

## 5. 建议补一个 PR CI（让 status checks 有东西可卡）

为了让上面的“Require status checks”真正生效，建议新增一个 `ci.yml`：

- `on: pull_request`
- 跑：`pnpm install --frozen-lockfile` + `pnpm lint:all` + `pnpm typecheck` + `pnpm test`

这样 PR 在 merge 前就会有明确的绿灯/红灯。

---

## 6. 推荐组合（最稳）

- CODEOWNERS：自动叫人
- CI（pull_request）：自动跑检查
- Branch protection：强制门禁
- CodeRabbit：AI 提建议

---

回到项目首页：[README](../README.md)
