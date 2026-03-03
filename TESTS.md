# 单元测试文档 (Unit Tests)

本项目使用 [Vitest](https://vitest.dev/) 作为单元测试框架，结合 [Vue Test Utils](https://test-utils.vuejs.org/) 进行组件测试。

## 1. 目录结构

测试文件统一存放于 `src/__tests__` 目录下，保持与源码目录结构一致：

```text
src/
├── __tests__/
│   ├── components/       # 组件测试
│   │   └── Icon.spec.ts
│   ├── utils/            # 工具函数测试
│   │   ├── pinyin.spec.ts
│   │   ├── request.spec.ts
│   │   └── token.spec.ts
│   └── App.spec.ts       # 根组件测试
```

## 2. 运行测试

### 运行所有测试

```bash
pnpm test
```

### 运行特定文件的测试

```bash
pnpm test src/__tests__/utils/pinyin.spec.ts
```

### 监听模式 (Watch Mode)

默认情况下 `pnpm test` 会以监听模式运行。如需仅运行一次：

```bash
pnpm test run
```

### 查看测试覆盖率

```bash
pnpm test --coverage
```

## 3. 测试配置

配置文件位于根目录的 [vitest.config.ts](file:///d:/demo/vue-admin/vitest.config.ts)。

- **环境**：`jsdom` (模拟浏览器环境)
- **配置继承**：自动继承 `vite.config.ts` 的配置（包括 Alias、插件等），确保测试环境与开发环境一致。
- **自动导入**：已配置 `unplugin-auto-import` 支持，测试文件中无需手动导入 Vue API（如 `ref`, `computed`）。

## 4. 编写指南

### 工具函数测试示例

```typescript
import { describe, it, expect } from 'vitest'
import { add } from '@/utils/math'

describe('Math Utils', () => {
  it('should add two numbers', () => {
    expect(add(1, 2)).toBe(3)
  })
})
```

### 组件测试示例

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('renders properly', () => {
    const wrapper = mount(MyComponent, {
      props: { msg: 'Hello' },
    })
    expect(wrapper.text()).toContain('Hello')
  })
})
```

### 常见 Mock 技巧

- **Mock 全局组件**（如 RouterView）：

```typescript
const wrapper = mount(App, {
  global: {
    stubs: {
      RouterView: { template: '<div>Mock View</div>' },
    },
  },
})
```

- **Mock 外部依赖**（如 axios）：

```typescript
import { vi } from 'vitest'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: {} })),
  },
}))
```

## 5. 最佳实践：AI 生成 vs 手写测试

在实际项目开发中，合理分配 AI 生成与手写测试的比例，可以最大化开发效率与代码质量。

### ✅ 适合 AI 生成的场景 (80%)

AI 擅长处理模式化、覆盖率导向的任务，能快速生成大量样板代码。

- **工具函数 (Utils)**：
  - 纯函数（Pure Functions）的输入输出测试。
  - 边界情况（空值、非法值、超长字符串）的覆盖。
  - 正则表达式验证。
  - **示例**：`pinyin.ts`、`formatDate.ts` 等逻辑独立的函数。

- **基础 UI 组件**：
  - 验证 Props 是否正确渲染（如 `v-if`、`class` 绑定）。
  - 验证 Slot 内容是否显示。
  - **示例**：`Icon.vue`、`Button.vue` 等展示型组件。

- **API 接口定义**：
  - 验证 API 函数是否调用了正确的 URL 和 Method（结合 Mock）。

### ✍️ 必须手写/人工校验的场景 (20%)

AI 往往难以理解复杂的业务上下文和特定的交互逻辑，这部分需要开发者深度介入。

- **复杂业务逻辑**：
  - 涉及多个 Store 状态流转、权限校验、登录跳转流程。
  - 需要模拟特定用户行为序列（点击 -> 等待接口 -> 状态变更 -> 界面更新）。

- **关键路径测试 (Critical Path)**：
  - 支付流程、订单提交等核心业务，必须由人工编写并仔细审查断言逻辑，确保**业务意图**正确，而不仅仅是代码不报错。

- **复杂的 Mock 场景**：
  - 当需要模拟极其复杂的第三方库行为，或需要精细控制 `vi.mock` 的时序和返回值时，人工编写往往比调试 AI 生成的错误代码更快。

### 🚀 推荐工作流

1.  **AI 初稿**：将代码文件发给 AI，指令如“请为这个工具函数生成单元测试，覆盖所有边界情况”。
2.  **人工审查**：
    - 检查测试描述（`describe`/`it`）是否清晰表达了业务含义。
    - 检查 Mock 数据是否符合真实业务场景。
    - **警惕虚假通过**：确保断言（`expect`）真正验证了逻辑，而不是仅仅检查了 `true` 为 `true`。
3.  **补充完善**：手动补充 AI 遗漏的复杂交互测试用例。

## 6. 注意事项

- **E2E 测试**：端到端测试（Playwright）位于 `e2e/` 目录，不包含在 `pnpm test` 运行范围内。
- **异步操作**：测试异步逻辑时，请使用 `async/await`。
- **DOM 模拟**：依赖 `jsdom`，绝大多数浏览器 API 可用，但布局相关（如 `offsetWidth`）可能不准确。
