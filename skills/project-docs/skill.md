# 项目文档导航规则

## 文档存放位置

所有项目文档集中在以下位置：

| 位置         | 用途                                                                  |
| ------------ | --------------------------------------------------------------------- |
| `README.md`  | 项目总览：功能点、目录一句话说明、常用命令速查、推荐阅读顺序          |
| `docs/` 目录 | 专题文档：快速开始、部署、国际化、提交规范、PR 门禁、换肤、图标、测试 |

## 文档文件清单

```
docs/
├── 01-quick-start.md           # 环境要求、安装构建、命令大全、目录结构
├── 02-deploy-aliyun.md         # GitHub Actions CI-CD、Docker 镜像、多环境部署
├── 03-openi18n.md              # 国际化自动提取工具说明
├── 04-commit-and-changelog.md  # commit 规范、Husky、lint-staged、changelog 生成
├── 05-pr-auto-review.md        # CodeRabbit、CODEOWNERS、Branch Protection
├── THEME.md                    # 换肤系统：主题模式、语义 Token、首屏防闪烁
├── ICONS.md                    # SVG 图标系统：Icon 组件、新增图标规范
├── TESTS.md                    # 测试指南：Vitest 单元测试、Playwright E2E
└── SKILLS.md                   # 当前项目集成的 skills 索引

openApi/generate/
└── 入参数据结构.md              # OpenAPI 代码生成、Vite Proxy 跨域配置

CHANGELOG.md                    # 变更日志（由 changelogen 自动生成）
```

## 根据问题选文档

遇到以下问题时，去对应的文档中查找答案：

| 问题类型                                 | 目标文档                           |
| ---------------------------------------- | ---------------------------------- |
| 项目总览、有哪些功能点、目录结构         | `README.md`                        |
| 开发环境搭建、安装依赖、构建命令         | `docs/01-quick-start.md`           |
| 部署流程、CI-CD 配置、Docker、阿里云 ECS | `docs/02-deploy-aliyun.md`         |
| 国际化提取、新增语言、语言文件生成       | `docs/03-openi18n.md`              |
| 提交规范、Husky、lint-staged 配置        | `docs/04-commit-and-changelog.md`  |
| PR 自动 Review、CODEOWNERS、分支保护     | `docs/05-pr-auto-review.md`        |
| 换肤/主题 API、语义变量、主色自定义      | `docs/THEME.md`                    |
| SVG 图标使用、新增图标                   | `docs/ICONS.md`                    |
| 单元测试 / E2E 测试的编写与运行          | `docs/TESTS.md`                    |
| API 代码生成、跨域代理配置               | `openApi/generate/入参数据结构.md` |
| Skills 集成概览、各 skill 触发场景       | `docs/SKILLS.md`                   |
| 代码变更历史、版本发布记录               | `CHANGELOG.md`                     |

## 规则

1. **不要凭经验猜测**：当遇到上述问题时，先去对应文档中查找，而不是凭记忆回答
2. **不要直接复制整个文档内容到 skill 中**：本文档只提供导航规则，详细内容请通过 Read 工具读取源文件
3. **文档只增不改**：`docs/` 下的文档只新增不删除，废弃内容打标记即可
4. **新增/修改文档必须同步 README**：所有 `docs/` 下的专题文档都必须在 `README.md` → **功能点** 列表中有一个对应的链接，新增文档时添加，重命名或废弃时更新
5. **文档与 Skill 联动**：
   - 新增一份 `docs/` 文档 → 检查是否需要为该文档创建或更新对应的 skill（参考 `skills/add-skills/skill.md`）
   - 新增/修改一个 skill → 检查 `docs/SKILLS.md` 中的索引表是否需要同步更新
   - skill 是给 AI 读的指引规则，`docs/` 下的文档是给人读的详细说明，两者互补而非替代
