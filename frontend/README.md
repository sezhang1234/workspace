# Jiuwen Agent Studio - 智能体开发平台

Jiuwen Agent Studio 是一个专业的LLM智能体开发和管理平台，类似于开源的 Dify 和 Coze 项目。该平台提供了完整的智能体开发生态，从模型配置到工作流编排，从提示词优化到智能体部署，一站式解决AI应用开发的所有需求。

## 🚀 主要功能

### 核心功能
- **智能体开发与管理** - 创建、训练和部署智能AI代理
- **工作流编排** - 可视化工作流设计器，拖拽式节点配置，智能自动布局
- **提示词管理** - 专业的提示词编辑器，支持版本控制和A/B测试
- **模型配置** - 灵活配置各种LLM模型参数，支持自定义模型接入
- **工作流画布** - 基于FlowGram.AI的高级工作流编辑器，支持多种节点类型和智能布局

### 平台特性
- **性能优化** - 智能缓存、并发控制、成本优化
- **安全可靠** - 企业级安全防护，数据加密，权限管理
- **团队协作** - 多用户协作开发，角色权限管理
- **数据分析** - 详细的性能分析报告和监控
- **智能布局** - 自动层次化布局算法，最小化边交叉

## 🛠️ 技术栈

### 前端技术
- **React 18** - 现代化的React框架
- **TypeScript** - 类型安全的JavaScript
- **Zustand** - 轻量级状态管理
- **TailwindCSS** - 实用优先的CSS框架
- **Material-UI (MUI)** - React组件库
- **React Router** - 客户端路由
- **React Hook Form** - 表单处理
- **React Query** - 数据获取和缓存
- **FlowGram.AI** - 专业的工作流编辑器框架

### 构建工具
- **Vite** - 快速的构建工具
- **PostCSS** - CSS后处理器
- **ESLint** - 代码质量检查

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── Layout/         # 布局组件
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx


├── pages/              # 页面组件
│   ├── WelcomePage.tsx # 欢迎页面
│   ├── Auth/           # 认证相关页面
│   │   └── LoginPage.tsx
│   ├── Dashboard/      # 仪表板页面
│   │   └── DashboardPage.tsx
│   ├── Agents/         # 智能体管理页面
│   │   ├── AgentsPage.tsx
│   │   └── AgentEditorPage.tsx
│   ├── Workflows/      # 工作流管理页面
│   │   ├── WorkflowsPage.tsx
│   │   └── WorkflowCreationPage.tsx
│   ├── Prompts/        # 提示词管理页面
│   │   ├── PromptsPage.tsx
│   │   └── PromptEditorPage.tsx
│   └── Settings/       # 设置页面
│       ├── SettingsPage.tsx
│       └── ProfilePage.tsx
├── stores/             # 状态管理
│   └── useAuthStore.ts # 认证状态管理
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 🚀 快速开始

### 环境要求
- Node.js 16+ 
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 🔧 配置说明

### 环境变量
项目使用 Vite 作为构建工具，可以在 `.env` 文件中配置环境变量：

```env
VITE_APP_TITLE=Jiuwen Agent Studio
VITE_API_BASE_URL=http://localhost:3000/api
```

### TailwindCSS 配置
TailwindCSS 配置文件位于 `tailwind.config.js`，可以自定义主题、颜色和组件样式。

### TypeScript 配置
TypeScript 配置文件位于 `tsconfig.json`，已配置路径别名 `@/*` 指向 `src/*` 目录。

## 🎨 设计系统

### 颜色方案
- **主色调**: 蓝色系 (#3b82f6)
- **辅助色**: 灰色系 (#64748b)
- **成功色**: 绿色系 (#10b981)
- **警告色**: 黄色系 (#f59e0b)
- **错误色**: 红色系 (#ef4444)

### 组件样式
项目使用 TailwindCSS 和 MUI 的组合，提供了丰富的预设样式类：
- `.btn-primary` - 主要按钮样式
- `.btn-secondary` - 次要按钮样式
- `.card` - 卡片容器样式
- `.input-field` - 输入框样式

## 📱 响应式设计

项目采用移动优先的响应式设计，支持以下断点：
- **sm**: 640px+
- **md**: 768px+
- **lg**: 1024px+
- **xl**: 1280px+

## 🔐 认证系统

### 功能特性
- 用户注册和登录
- JWT Token 认证
- 角色权限管理
- 会话管理
- 密码重置

### 状态管理
使用 Zustand 进行状态管理，支持：
- 用户信息持久化
- 认证状态管理
- 权限控制

## 🎯 工作流画布功能

### 核心特性
- **统一控制面板** - 所有控制功能集成在一个面板中
- **智能自动布局** - 层次化布局算法，自动优化节点位置
- **多种连接样式** - 支持平滑曲线和直线连接
- **实时节点配置** - 浮动配置面板，支持实时编辑

### 控制面板功能
- **节点管理** - 添加、删除、配置节点
- **视图控制** - 缩放、适应视图、撤销/重做
- **自动布局** - 一键优化工作流布局
- **快速操作** - 基础流程、AI问答等预设模板

### 节点类型
- **触发器节点** - 开始节点（支持Webhook、定时、手动、事件触发）
- **AI处理节点** - LLM节点、知识检索、问题分类、答案生成
- **逻辑控制节点** - 条件节点、循环节点
- **数据处理节点** - 变量聚合节点
- **输出节点** - 结束节点

### LLM节点配置
- **模型选择** - 支持GPT-4、Claude-3、Gemini、Qwen、Llama等主流模型
- **提示词管理** - 系统提示词、用户提示词配置
- **智能生成** - 魔法棒按钮自动生成系统提示词
- **参数配置** - 温度、最大令牌数等模型参数
- **输出变量** - 自定义输出变量名称

### 画布特性
- **智能布局** - 三阶段布局算法，最小化边交叉
- **连接优化** - 水平连接优先，平滑曲线过渡
- **自动缩放** - 加载时自动适应视图
- **统一尺寸** - 所有节点保持一致的300x100px尺寸
- **简化显示** - 节点只显示核心信息（名称、模型、图标）

## 🚧 开发计划

### 已完成功能
- ✅ 用户认证系统
- ✅ 基础页面框架
- ✅ 响应式布局
- ✅ 状态管理
- ✅ 路由系统
- ✅ 工作流画布
- ✅ 统一控制面板
- ✅ 智能自动布局
- ✅ LLM节点配置
- ✅ 多种节点类型
- ✅ 平滑连接样式

### 开发中功能
- 🔄 智能体编辑器
- 🔄 提示词编辑器
- 🔄 模型管理

### 计划功能
- 📋 团队协作
- 📋 数据分析
- 📋 API管理
- 📋 部署管理
- 📋 监控告警

## 🤝 贡献指南

### 开发流程
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 编写清晰的组件文档

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

- 项目主页: [Jiuwen Agent Studio](https://github.com/jiuwen/agent-studio)
- 问题反馈: [Issues](https://github.com/jiuwen/agent-studio/issues)
- 功能建议: [Discussions](https://github.com/jiuwen/agent-studio/discussions)

## 🙏 致谢

感谢以下开源项目的支持：
- [React](https://reactjs.org/)
- [FlowGram.AI](https://github.com/flowgram-ai/flowgram)
- [TailwindCSS](https://tailwindcss.com/)
- [Material-UI](https://mui.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Vite](https://vitejs.dev/)

---

**Jiuwen Agent Studio** - 让AI开发更简单，让创新更高效 🚀