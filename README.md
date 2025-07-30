# Team Task Manager

这是一个使用 Next.js 构建的团队任务管理应用。它提供用户认证、任务分配和管理等功能，旨在帮助团队更高效地协作。

## ✨ 功能特性

*   **用户认证**: 支持用户注册、登录和会话管理 (NextAuth.js)。
*   **任务管理**: 创建、查看、更新和删除任务。
*   **用户管理**: 管理系统中的所有用户。
*   **管理后台**: 为管理员提供专属的管理界面。
*   **动态主题**: 支持明亮/黑暗模式切换。
*   **颜色定制**: 允许用户通过颜色选择器自定义界面颜色。

## 🛠️ 技术栈

*   **框架**: [Next.js](https://nextjs.org/) 15
*   **UI**: [React](https://react.dev/) 19
*   **样式**: [Tailwind CSS](https://tailwindcss.com/) 4
*   **认证**: [NextAuth.js](https://next-auth.js.org/)
*   **动画**: [Framer Motion](https://www.framer.com/motion/)
*   **语言**: [TypeScript](https://www.typescriptlang.org/)

## 🚀 如何开始

### 1. 环境准备

确保你的开发环境已安装 [Node.js](https://nodejs.org/) (版本 >= 20) 和 npm。

### 2. 克隆项目

```bash
git clone https://github.com/CTW-Studio-CN/team_task_manager.git
cd team_task_manager
```

### 3. 安装依赖

在项目根目录下运行以下命令来安装所有依赖：

```bash
npm install
```

### 4. 配置环境变量

复制 `.env.local.example` (如果存在的话) 为 `.env.local`，并根据需要填写环境变量。至少需要配置 `NEXTAUTH_SECRET` 和 `NEXTAUTH_URL`。

```env
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET= # 在这里生成一个安全的随机字符串
```

### 5. 启动开发服务器

运行以下命令来启动开发服务器：

```bash
npm run dev
```

现在，在浏览器中打开 [http://localhost:3000](http://localhost:3000) 即可看到应用。

## 🐳 使用 Docker 部署

你也可以使用 Docker 快速启动应用。

### 1. 拉取 Docker 镜像

从 Docker Hub 拉取最新的镜像：

```bash
docker pull freebird2913/team_task_manager:latest
```

### 2. 运行 Docker 容器

使用以下命令在后台运行容器：

```bash
docker run -d -p 3000:3000 --name team-task-manager freebird2913/team_task_manager
```

应用将在 [http://localhost:3000](http://localhost:3000) 上可用。

## 📜 可用脚本

*   `npm run dev`: 启动开发服务器 (使用 Turbopack)。
*   `npm run build`: 构建生产版本的应用。
*   `npm run start`: 启动生产服务器。
*   `npm run lint`: 运行 ESLint 进行代码检查。

## 📁 项目结构

```
/
├── data/                 # 存放 JSON 格式的模拟数据
│   ├── tasks.json
│   └── users.json
├── public/               # 存放静态资源
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API 路由
│   │   ├── components/   # 可复用的组件
│   │   ├── lib/          # 辅助函数和工具库
│   │   ├── (pages)/      # 页面路由 (如 login, admin)
│   │   └── layout.tsx    # 全局布局
│   │   └── page.tsx      # 主页
│   └── ...
├── .env.local            # 本地环境变量
├── next.config.ts        # Next.js 配置文件
├── package.json          # 项目依赖和脚本
└── README.md             # 项目说明文档


