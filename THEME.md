# 换肤系统说明

本文档介绍项目中的主题/换肤能力，包括：

- 实现了哪些功能
- 核心实现原理
- 在业务中如何正确使用

## 功能概览

当前换肤系统已支持以下能力：

- 主题模式切换：`light / dark / system`
- 主色自定义：支持 `hex` 与 `rgb/rgba` 输入
- 业务语义色自动推导：`success / warning / danger / info`
- 自动对比度：主色文本与边框自动计算对比
- 主题快照首屏回放：减少刷新时的主题闪烁
- 第三方桥接：图表/地图/iframe 等组件可跟随主题

## 关键实现文件

- 主题核心引擎：  
  [useTheme.ts](file:///d:/demo/vue-admin/src/composables/useTheme.ts)
- 首屏预加载脚本：  
  [theme-preload.ts](file:///d:/demo/vue-admin/src/theme-preload.ts)
- 主题插件入口：  
  [theme.ts](file:///d:/demo/vue-admin/src/plugins/theme.ts)
- 设置入口组件：  
  [Settings.vue](file:///d:/demo/vue-admin/src/layout/components/Header/operate/Settings.vue)
- 设置子组件（拆分后）：  
  [ThemeModeSection.vue](file:///d:/demo/vue-admin/src/layout/components/Header/operate/settings/ThemeModeSection.vue)  
  [ThemeActionsSection.vue](file:///d:/demo/vue-admin/src/layout/components/Header/operate/settings/ThemeActionsSection.vue)  
  [ThemeColorSection.vue](file:///d:/demo/vue-admin/src/layout/components/Header/operate/settings/ThemeColorSection.vue)  
  [ThemeTokenPreviewSection.vue](file:///d:/demo/vue-admin/src/layout/components/Header/operate/settings/ThemeTokenPreviewSection.vue)
- 全局主题样式桥接：  
  [index.scss](file:///d:/demo/vue-admin/src/styles/index.scss)

## 实现原理

### 1) 主题状态与模式决策

主题运行时维护：

- `themeMode`: 用户选择（light/dark/system）
- `isDark`: 当前是否深色（system 时由系统媒体查询决定）
- `resolvedTheme`: 最终解析后的 light/dark
- `primaryColor`: 当前主色

系统模式下会监听 `prefers-color-scheme` 变化，并在变化时同步主题变量。

### 2) 颜色标准化与推导

输入颜色统一标准化为 `#rrggbb`，支持：

- `#RGB`
- `#RRGGBB`
- `rgb(...) / rgba(...)`

标准化后，通过混色算法自动推导业务色与色阶变量：

- `--el-color-primary` 及 light/dark 阶梯
- `--el-color-success / warning / danger / info` 及阶梯

### 3) 语义 Token 层

除了基础色，系统还生成语义变量（`--va-*`）：

- 背景层：`--va-bg-page / --va-bg-card / --va-bg-elevated`
- 文本层：`--va-text-primary / --va-text-secondary`
- 边框层：`--va-border-soft`
- 对比层：`--va-on-primary` 等

这样业务组件只依赖“语义”，不直接绑定具体色值，便于后续扩展。

### 4) 首屏性能与无闪烁

运行时会把最终变量表存为 `themeSnapshot`。  
页面刷新时，`theme-preload.ts` 在主应用挂载前优先回放快照，快速恢复：

- `dark` class
- `data-theme-*` 属性
- 所有 CSS 变量

当快照无效时，降级为仅按 `themeMode` 恢复深浅模式，确保稳定。

### 5) 第三方组件桥接

主题系统会分发 `va-theme-change` 事件，并输出第三方变量：

- `--va-thirdparty-*`
- `--va-chart-*`
- `--va-map-accent`

图表/地图等组件可通过事件订阅或 CSS 变量读取实现联动。

## 如何使用

### A. 在组件中使用主题 API

在 `setup` 中使用：

```ts
import { useTheme } from '@/composables/useTheme'

const { themeMode, isDark, primaryColor, setThemeMode, setPrimaryColor, toggleTheme } = useTheme()
```

常用操作：

- `setThemeMode('light' | 'dark' | 'system')`
- `setPrimaryColor('#1684fc')`
- `toggleTheme()`
- `resetTheme()`

### B. 在样式中使用变量

优先使用语义变量（业务层推荐）：

```scss
.card {
  background: var(--va-bg-card);
  color: var(--va-text-primary);
  border: 1px solid var(--va-border-soft);
}
```

Element Plus 对齐场景使用 `--el-*`：

```scss
.cta {
  background: var(--el-color-primary);
  color: var(--va-on-primary);
}
```

### C. 第三方组件跟随主题

如果是纯样式容器，可加桥接属性：

```html
<div data-third-party="chart"></div>
```

如果是 JS 驱动组件（图表实例），可订阅主题事件并重绘：

```ts
import { useThemeBridge } from '@/composables/useTheme'

useThemeBridge((payload) => {
  // payload.chartPalette / payload.mapAccent / payload.semantic
  // 在这里更新图表/地图配置并触发重绘
})
```

## 使用建议

- 业务 UI 优先用 `--va-*`，减少未来重构成本
- 避免组件内硬编码颜色，统一走主题变量
- 第三方组件尽量实现“事件订阅 + 局部重绘”，不要整页刷新
- 新增主题能力时，保持 `theme-preload.ts` 与 `useTheme.ts` 语义一致
