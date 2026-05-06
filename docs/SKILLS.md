# 项目 Skill 集成索引

AI 开发辅助知识库（skills）集成说明。

---

## 什么是 Skill

Skill 是放置在 `skills/` 目录下的 Markdown 文档集合，用于指导 AI 在开发时按项目实际情况执行任务。当 AI 遇到对应场景时，会自动读取相应的 skill 文档，避免凭通用知识猜测。

---

## Skill 列表

### 1. Element Plus 组件库

- **目录**: `skills/element-plus-skills/`
- **覆盖**: 74 个 Element Plus 组件的完整 API 定义
- **触发场景**: 开发 UI 组件时
- **使用方式**: 查索引表 → 找到目标组件 → 读取对应 skill.md 获取 API 定义
- **注册位置**: `AGENTS.md` → Element Plus Skills

### 2. OpenAPI 代码生成 & OpenI18n 国际化

- **目录**: `skills/openapi-i18n/skill.md`
- **覆盖**: openApi（代码生成）和 openI18n（国际化提取）两套自动化工具的完整说明
- **触发场景**: 处理 API 生成、模块注册、请求代码、接口类型、国际化提取、翻译、语言文件
- **使用方式**: 读取 skill.md 获取工作流和使用命令
- **注册位置**: `AGENTS.md` → OpenAPI & OpenI18n

### 3. Utils 工具函数库

- **目录**: `skills/utils/skill.md`
- **覆盖**: `src/utils/` 下的全部工具函数，包括剪贴板、Token 管理、Storage 存储、拼音转换、页面标题、网络请求封装
- **触发场景**: 实现某个功能时，优先检查是否有现成工具函数
- **使用方式**: 根据分类找到目标函数 → 读取签名和示例
- **注册位置**: `AGENTS.md` → Utils 工具函数库

### 4. 项目文档导航

- **目录**: `skills/project-docs/skill.md`
- **覆盖**: `README.md` 和 `docs/` 目录下所有文档的定位规则
- **触发场景**: 需要回答关于项目架构、使用方法、部署流程、代码规范、主题/图标/测试体系等问题
- **使用方式**: 根据问题类型 → 定位目标文档 → Read 读取源文件
- **注册位置**: `AGENTS.md` → 项目文档导航

### 5. 添加新 Skill

- **目录**: `skills/add-skills/skill.md`
- **覆盖**: 创建新 skill 的完整流程和规范
- **触发场景**: 需要为项目添加新的技能文档（第三方库、自定义工具、业务逻辑等）
- **使用方式**: 按指南在 `skills/` 下创建目录和 skill.md，并在 AGENTS.md 中注册
- **注册位置**: `AGENTS.md` → 添加新 Skill

---

## 文件结构总览

```
skills/
├── element-plus-skills/       # Element Plus 组件库 API（75 个组件）
│   ├── element-plus/skill.md  # 组件索引表
│   ├── button/skill.md
│   ├── form/skill.md
│   └── ...
├── openapi-i18n/
│   └── skill.md               # openApi 代码生成 & openI18n 国际化
├── utils/
│   └── skill.md               # 工具函数库（6 大模块）
├── project-docs/
│   └── skill.md               # 项目文档导航规则
└── add-skills/
    └── skill.md               # 添加新 Skill 指南
```

---

## 使用流程

```
遇到开发需求
        │
        ▼
  AGENTS.md 中的规则自动触发
        │
        ▼
  找到对应的 skill 目录
        │
        ▼
  读取 skill.md 获取指引
        │
        ▼
  执行开发任务
```

如果当前没有 skill 覆盖你的需求，可以按照 `skills/add-skills/skill.md` 的指引新建。
