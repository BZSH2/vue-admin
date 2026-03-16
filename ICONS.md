# SVG 图标系统

本项目使用 `vite-plugin-svg-icons` + 通用 `Icon` 组件实现 SVG 图标方案。

## 1. 目录结构

```text
src/icons/
├── svg/       # 原始 svg 文件
└── Icon.vue   # 通用图标组件
```

## 2. 怎么新增图标

直接把 `.svg` 文件放进：

```text
src/icons/svg/
```

文件名就是图标名，比如：

```text
src/icons/svg/user.svg
```

## 3. 怎么使用

```vue
<Icon name="user" />
<Icon name="user" class="text-primary" />
<Icon name="user" style="font-size: 20px; color: #409eff" />
```

## 4. 设计规则

- 图标建议使用小写字母、中划线命名
- 建议去掉 SVG 里写死的 `fill` 颜色
- 推荐让图标跟随 `currentColor`

## 5. 适合什么场景

- 菜单图标
- 按钮图标
- 状态图标
- 后台管理系统里的通用 UI 图标

如果你想看项目整体说明，回到 [README](README.md)。
