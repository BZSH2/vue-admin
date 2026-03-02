# SVG 图标组件 (Icon)

本项目采用 `vite-plugin-svg-icons` 插件实现全自动的 SVG 图标方案，支持按需加载、颜色跟随、缩放自如。

## 1. 核心原理

- **插件支持**：使用 `vite-plugin-svg-icons` 将 `src/icons/svg` 目录下的所有 `.svg` 文件自动注入到 HTML body 中作为 `<symbol>` 节点。
- **组件实现**：通过 [Icon.vue](file:///d:/demo/vue-admin/src/icons/Icon.vue) 组件，使用 `<use>` 标签引用对应的 `symbolId`。

## 2. 目录结构

```text
src/icons/
├── svg/              # 存放所有原始 .svg 图标文件
│   └── aixin.svg     # 示例图标
└── Icon.vue          # 通用图标组件
```

## 3. 使用方法

### 添加图标

只需将新的 `.svg` 文件放入 `src/icons/svg` 目录下即可。文件名即为图标名。

### 在代码中使用

由于配置了 `unplugin-vue-components` 自动导入，您可以在任何 Vue 模板中直接使用 `<Icon />` 组件，无需手动 import。

```vue
<!-- 基本使用 -->
<Icon name="aixin" />

<!-- 自定义样式 -->
<Icon name="aixin" class="my-custom-icon" />
<Icon name="aixin" style="color: red; font-size: 24px;" />
```

## 4. 属性说明

| 属性名      | 类型     | 默认值 | 说明                                 |
| :---------- | :------- | :----- | :----------------------------------- |
| `name`      | `string` | `''`   | **必填**。图标文件名（不含扩展名）。 |
| `className` | `string` | `''`   | 额外的类名。                         |

## 5. 注意事项

- **颜色填充**：SVG 图标默认 `fill: currentColor`，这意味着它会继承父元素的文本颜色。如果图标自带颜色且无法修改，请检查 SVG 源码中是否存在硬编码的 `fill` 属性，并将其改为 `currentColor` 或删除。
- **命名规范**：建议使用小写字母、数字和中划线命名（如 `user-avatar.svg`）。
