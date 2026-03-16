# 自动部署到阿里云 ECS（含多环境 / CI-CD）

本文档说明当前项目的真实部署链路，以及分支与环境的对应关系。

## 1. 当前工作流结构

### 入口工作流

- `.github/workflows/deploy.yml`

作用：

- 监听分支推送
- 按分支把任务分发到不同环境
- `master` 还会额外发布 GitHub Pages

### 复用工作流

- `.github/workflows/deploy-aliyun.yml`

作用：

- 接收 `environment` 入参
- 构建 Docker 镜像
- 推送到阿里云 ACR
- SSH 到 ECS 执行部署脚本

## 2. 分支与环境的关系

当前约定：

- `develop` → `dev`
- `test` → `test`
- `uat` → `uat`
- `master` → `prod`

也就是说，不同分支推送后，会自动部署到不同环境。

## 3. 构建命令与环境文件

项目已经支持多环境构建：

```bash
pnpm build:dev
pnpm build:test
pnpm build:uat
pnpm build:prod
```

常见对应关系：

- `pnpm dev` → 本地开发
- `pnpm build:dev` → 开发环境构建
- `pnpm build:test` → 测试环境构建
- `pnpm build:uat` → UAT 构建
- `pnpm build:prod` → 生产环境构建

## 4. 自动部署流程

每次命中部署分支后，会自动执行：

1. 拉取仓库代码
2. 使用 Docker Buildx 构建前端镜像
3. 推送镜像到阿里云 ACR
4. 通过 SSH 创建远程部署目录
5. 上传 `docker-compose.prod.yml` 和 `deploy.sh`
6. 在 ECS 上执行部署脚本
7. 用本机健康检查确认首页和 API 代理链路正常

## 5. 和部署相关的关键文件

- `Dockerfile`
  - 第一阶段用 Node 构建前端
  - 第二阶段用 Nginx 托管静态产物
- `deploy/nginx.conf`
  - 提供前端页面
  - 将 `/api` 和 `/docs` 反向代理到宿主机后端
- `docker-compose.prod.yml`
  - 定义容器与端口映射
- `deploy/deploy.sh`
  - 在 ECS 上执行拉镜像、启动、健康检查

## 6. GitHub Secrets / Environments 怎么配

建议在 GitHub 里使用 **Environments**，不同环境配置不同 secrets。

### 建议环境名

- `dev`
- `test`
- `uat`
- `prod`

### 每个环境至少要有这些 Secrets

#### 阿里云 ACR

- `ALIYUN_REGISTRY`
- `ALIYUN_NAMESPACE`
- `ALIYUN_REPO`
- `ALIYUN_USERNAME`
- `ALIYUN_PASSWORD`

#### ECS 部署

- `DEPLOY_HOST`
- `DEPLOY_PORT`
- `DEPLOY_USER`
- `DEPLOY_SSH_KEY`
- `DEPLOY_PATH`（可选）

## 7. ECS 服务器需要准备什么

- 安装 Docker
- 安装 Docker Compose v2
- 提前创建部署目录，或允许 workflow 自动创建
- 放行对外访问端口：
  - `80`：前端页面
  - `443`：后续如接 HTTPS
- 宿主机上的后端服务需要可被前端 Nginx 访问

## 8. 当前线上访问方式

当前生产环境推荐：

- 首页：`http://vue.admin.bzsh.fun/`
- 接口文档：`http://vue.admin.bzsh.fun/docs`

说明：

- 当前已切到 **80 端口访问**
- 不再推荐使用带 `:25000` 的历史方式

## 9. 健康检查逻辑

`deploy/deploy.sh` 当前会校验：

- `http://127.0.0.1/`
- `http://127.0.0.1/api`

只有这两个都正常，才视为前端容器与 API 代理链路恢复。

## 10. 常见问题

### 1）GitHub Actions 成功，但页面打不开

优先检查：

- ECS 安全组是否放行 `80`
- 域名是否解析到正确 IP
- `docker ps` 看容器是否正常

### 2）首页可以打开，但接口 404 / 500

优先检查：

- `deploy/nginx.conf` 中 `/api` 代理目标是否正确
- 宿主机后端是否真的在运行
- 后端健康检查是否正常

### 3）推送后部署失败，提示目录权限问题

优先检查：

- 部署用户对目标目录是否有写权限
- 是否提前创建好了部署目录
- 是否使用了正确的 `DEPLOY_PATH`

## 11. 建议的后续优化

- 给域名补 HTTPS（80/443 + 证书）
- 在 workflow 末尾增加公网 smoke check
- 仓库变多后，把这套流程抽成 reusable workflow 模板
