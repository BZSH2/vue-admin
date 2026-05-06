# 如何为项目添加新 Skill

本项目支持通过 Markdown 文档建立知识库（skills），让 Trae AI 在需要时自动读取并按指引执行任务。

---

## 一、Skill 结构

每个 skill 是一个独立的目录，里面放一个 `skill.md` 文件：

```
skills/
├── element-plus-skills/          # 已有：Element Plus 组件库
│   ├── element-plus/skill.md     # 总索引
│   ├── button/skill.md
│   ├── form/skill.md
│   └── ...
├── openapi-i18n/skill.md         # 已有：API 代码生成 & 国际化
└── <你的 skill>/skill.md          # 新建
```

## 二、创建步骤

### 第 1 步：新建目录和文件

```
skills/<skill-name>/skill.md
```

例如创建一个关于 VxeTable 的 skill：

```
skills/vxe-table/
└── skill.md
```

### 第 2 步：编写 skill.md 内容

skill.md 的内容结构建议包含：

- **概述** — 这个 skill 覆盖什么知识
- **目录结构** — 相关源码的组织方式
- **关键配置** — 配置文件位置、关键字段说明
- **API / 方法说明** — 核心 API 的签名、参数、返回值
- **使用示例** — 项目中实际的代码示例
- **常见问题** — 踩坑记录、注意事项
- **参考资源** — 官方文档链接

具体内容没有固定格式，根据知识复杂度灵活组织。可以参考 `skills/openapi-i18n/skill.md` 的写法。

### 第 3 步：在 AGENTS.md 中注册

在 `AGENTS.md` 中添加一条引用，告诉 AI 这个 skill 的存在：

```markdown
## <你的 Skill 名称>

当你需要 <触发场景描述> 时：

1. 查 `skills/<skill-name>/skill.md` 获取完整说明
2. 相关源码位于 <源码路径>
```

参考已有的条目格式：

```markdown
## OpenAPI & OpenI18n

本项目包含 API 代码生成（openApi）和国际化（openI18n）两套自动化工具。

当你需要处理 API 生成、模块注册、请求代码、接口类型，或者国际化提取、翻译、语言文件时：

1. 查 `skills/openapi-i18n/skill.md` 获取完整说明
2. 相关源码位于 `openApi/` 和 `openI18n/` 目录
```

## 三、编写规范

- **语言**：使用中文编写，保持和项目其他文档一致
- **代码示例**：优先使用项目中真实存在的代码片段
- **路径**：使用相对路径（相对于项目根目录）
- **文件引用**：对单个文件使用反引号，如 `src/config/index.ts`
- **重点关注**：突出 AI 容易用错或容易踩坑的地方
- **Keep it simple**：只包含必要信息，不要过度堆砌

## 四、什么时候应该添加 Skill

| 场景                         | 示例                                      |
| ---------------------------- | ----------------------------------------- |
| 项目中引入了一个新的第三方库 | `vxe-table`、`lodash-es`、`echarts`       |
| 项目中有自定义的工具/配置    | `openApi` 代码生成器、权限控制模块        |
| 有复杂的业务逻辑需要文档化   | 路由守卫逻辑、全局状态管理方案            |
| 团队有固定的编码规范         | Git 提交规范、组件命名规范                |
| 有高频踩坑点需要记录         | ECharts 初始化时机、ElPagination 隐藏规则 |

## 五、完整示例

假设要添加一个 **VxeTable** 的 skill：

```bash
mkdir skills/vxe-table
```

`skills/vxe-table/skill.md`：

```markdown
# VxeTable 使用指南

## 概述

VxeTable 是一个功能强大的 Vue 表格组件，支持虚拟滚动、列拖拽、
编辑、导出等功能。

## 项目中的使用

...

## 常见问题

- 列模板必须使用 `#default="{ row }"` 获取行数据
- ...
```

`AGENTS.md` 中添加：

```markdown
## VxeTable 表格

当你需要使用 VxeTable 表格组件（列配置、自定义模板、事件处理等）时：

1. 查 `skills/vxe-table/skill.md` 获取完整说明
2. 相关源码位于 `src/components/Table/` 目录
```
