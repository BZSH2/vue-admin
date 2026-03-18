# 测试指南

本项目测试体系分成两层：

- **单元测试**：Vitest + Vue Test Utils
- **端到端测试**：Playwright

## 1. 单元测试

运行全部单元测试：

```bash
pnpm test
```

只运行一次：

```bash
pnpm test run
```

查看覆盖率：

```bash
pnpm test --coverage
```

## 2. 端到端测试

运行 E2E：

```bash
pnpm test:e2e
```

首次运行前如果缺浏览器，可执行：

```bash
npx playwright install
```

## 3. 测试目录

```text
src/__tests__/   # 单元测试
e2e/             # Playwright 端到端测试
```

## 4. 推荐策略

### 适合优先补单元测试的内容

- 工具函数
- 请求封装
- 纯展示组件
- 通用业务组件

### 适合补 E2E 的内容

- 登录流程
- 路由跳转
- 菜单权限
- 关键页面交互

## 5. 常见建议

- 单元测试关注逻辑正确性
- E2E 测试关注真实用户路径
- 核心链路优先补测试，不要只追求覆盖率数字

如果你想先跑通项目，再回到 [快速开始](docs/01-quick-start.md)。
