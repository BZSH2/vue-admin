# 换肤系统说明

本文档介绍项目中的主题 / 换肤能力，包括：

- 已实现的功能
- 核心实现原理
- 在业务中如何正确使用

## 功能概览

当前换肤系统已支持：

- 主题模式切换：`light / dark / system`
- 主色自定义：支持 `hex` 与 `rgb/rgba` 输入
- 业务语义色自动推导：`success / warning / danger / info`
- 自动对比度：主色文本与边框自动计算对比
- 首屏主题快照回放：减少刷新时的闪烁
- 第三方桥接：图表 / 地图 / iframe 等组件可跟随主题

## 关键实现文件

- `src/composables/useTheme.ts`
- `src/theme-preload.ts`
- `src/plugins/theme.ts`
- `src/layout/components/Header/operate/Settings.vue`
- `src/layout/components/Header/operate/settings/ThemeModeSection.vue`
- `src/layout/components/Header/operate/settings/ThemeActionsSection.vue`
- `src/layout/components/Header/operate/settings/ThemeColorSection.vue`
- `src/layout/components/Header/operate/settings/ThemeTokenPreviewSection.vue`
- `src/styles/index.scss`

## 实现原理

### 1. 主题状态与模式决策

运行时维护这些核心状态：

- `themeMode`
- `isDark`
- `resolvedTheme`
- `primaryColor`

当模式为 `system` 时，会监听系统主题变化并自动同步。

### 2. 颜色标准化与派生

输入颜色会统一标准化成 `#rrggbb`，然后自动推导：

- `--el-color-primary` 及其 light / dark 阶梯
- `--el-color-success / warning / danger / info`
- 业务侧使用的语义 token

### 3. 语义 Token 层

除了 Element Plus 变量，还会生成一层 `--va-*` 语义变量，比如：

- `--va-bg-page`
- `--va-bg-card`
- `--va-text-primary`
- `--va-text-secondary`
- `--va-border-soft`
- `--va-on-primary`

这样业务组件不直接依赖具体色值，后续扩展更轻松。

### 4. 首屏无闪烁

主题变量会以快照形式缓存，页面刷新时优先回放，减少首屏闪烁。

### 5. 第三方组件桥接

主题系统会分发主题变化事件，并输出第三方变量，方便图表、地图、iframe 等外部组件同步更新。

## 如何使用

### 在组件中使用主题 API

```ts
import { useTheme } from '@/composables/useTheme'

const { themeMode, isDark, primaryColor, setThemeMode, setPrimaryColor, toggleTheme } = useTheme()
```

常用操作：

- `setThemeMode('light' | 'dark' | 'system')`
- `setPrimaryColor('#1684fc')`
- `toggleTheme()`
- `resetTheme()`

### 在样式中使用变量

优先使用语义变量：

```scss
.card {
  background: var(--va-bg-card);
  color: var(--va-text-primary);
  border: 1px solid var(--va-border-soft);
}
```

如果要和 Element Plus 组件配合，也可以直接使用 `--el-*` 变量。

### 给第三方组件同步主题

如果是 JS 驱动组件，可以监听主题变化事件后触发局部重绘。

## 使用建议

- 业务 UI 优先使用 `--va-*` 语义变量
- 避免在组件里硬编码颜色
- 第三方组件尽量做“事件订阅 + 局部重绘”
- 新增主题能力时，保持 `theme-preload.ts` 和 `useTheme.ts` 语义一致

如果你想先看项目总览，回到 [README](README.md)。
