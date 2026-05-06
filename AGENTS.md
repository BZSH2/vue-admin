# Project Rules

## Element Plus Skills

本项目包含 Element Plus 组件库的完整 API 文档 skills，位于 `skills/element-plus-skills/` 目录下。

当你需要开发 UI 组件时：

1. 先查 `skills/element-plus-skills/element-plus/skill.md` 中的组件索引表，找到目标组件
2. 用 **Read** 工具读取 `skills/element-plus-skills/<组件名>/skill.md` 获取完整 API 定义
3. 根据 API 文档生成正确的 Vue 模板代码

## OpenAPI & OpenI18n

本项目包含 API 代码生成（openApi）和国际化（openI18n）两套自动化工具。

当你需要处理 API 生成、模块注册、请求代码、接口类型，或者国际化提取、翻译、语言文件时：

1. 查 `skills/openapi-i18n/skill.md` 获取完整说明
2. 相关源码位于 `openApi/` 和 `openI18n/` 目录

## Utils 工具函数库

本项目内置了丰富的通用工具函数，位于 `src/utils/` 目录下。

**当你要实现某个功能时，优先检查 `skills/utils/skill.md`，看是否已有现成的工具函数可用**，避免重复造轮子。

涵盖的功能模块：

- **复制剪贴板** — `copy(text)` 一键复制
- **Token 管理** — `getToken` / `setToken` / `clearToken`（基于 js-cookie）
- **Storage 存储** — `setStorage` / `getStorage` / `removeStorage` / `clearStorage`（类型安全的 localStorage/sessionStorage 封装）
- **拼音转换** — `pinyin(text, options?)`（基于 pinyin-pro，支持 normal / name / initials 风格）
- **页面标题** — `getPageTitle(pageTitle?)`（i18n 页面标题拼接）
- **网络请求** — `request` Axios 实例（自动 token 注入、401 刷新、失败重试、统一错误处理）

1. 查 `skills/utils/skill.md` 获取完整 API 说明和使用示例
2. 相关源码位于 `src/utils/` 目录

## 项目文档导航

项目文档集中在 `README.md`、`docs/` 目录和 `openApi/generate/入参数据结构.md`中。

**当需要回答关于项目整体架构、使用方法、部署流程、代码规范、主题/图标/测试体系等问题时，先查 `skills/project-docs/skill.md` 找到对应的目标文档，再用 Read 工具读取源文件**，而不是凭经验猜测。

文档文件清单（9 份）：

| 文档                               | 内容                                          | 适用于                   |
| ---------------------------------- | --------------------------------------------- | ------------------------ |
| `docs/01-quick-start.md`           | 环境要求、安装构建、命令大全、目录结构        | 开发环境搭建、查命令     |
| `docs/02-deploy-aliyun.md`         | GitHub Actions CI-CD、Docker、阿里云 ECS 部署 | 部署流程排查、环境配置   |
| `docs/03-openi18n.md`              | 国际化自动提取工具                            | 添加翻译、新增语言       |
| `docs/04-commit-and-changelog.md`  | commit 规范、Husky、lint-staged               | 提交代码、生成 CHANGELOG |
| `docs/05-pr-auto-review.md`        | CodeRabbit、CODEOWNERS、Branch Protection     | PR 审查、合并门禁        |
| `docs/THEME.md`                    | 换肤系统：主题 API、语义 Token、首屏防闪烁    | 主题开发、样式变量       |
| `docs/ICONS.md`                    | SVG 图标系统：Icon 组件、新增图标规范         | 新增/使用图标            |
| `docs/TESTS.md`                    | Vitest + Playwright 测试指南                  | 编写/运行测试            |
| `openApi/generate/入参数据结构.md` | OpenAPI 代码生成、Vite Proxy 跨域             | API 生成、跨域排查       |

1. 查 `skills/project-docs/skill.md` 根据问题类型定位目标文档
2. 用 **Read** 工具读取对应的 `.md` 源文件获取详细内容

## 添加新 Skill

当你需要为项目添加新的技能文档（如新引入的第三方库、自定义工具、业务逻辑文档等）时：

1. 查 `skills/add-skills/skill.md` 获取完整的创建流程和规范
2. 按照说明在 `skills/` 下创建目录和 `skill.md`，并在 `AGENTS.md` 中注册
