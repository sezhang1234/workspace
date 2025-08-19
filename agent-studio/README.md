# Agent Studio - AI 代理构建平台

一个专业的 AI 代理构建和管理平台，类似于 Dify 和 Coze，支持可视化流程设计、多模型集成和智能对话。

## ✨ 主要特性

### 🎨 可视化流程设计
- **拖拽式节点编辑器**: 基于 ReactFlow 的可视化流程设计
- **丰富的节点类型**: 支持输入输出、LLM、工具、条件控制等多种节点
- **实时预览**: 实时查看和编辑节点属性
- **流程验证**: 自动检测流程中的错误和问题

### 🤖 AI 模型集成
- **多模型支持**: 支持 GPT-3.5、GPT-4、Claude 等主流模型
- **参数调优**: 可调节温度、最大令牌数等模型参数
- **系统提示**: 支持自定义系统提示词
- **RAG 支持**: 检索增强生成功能

### 🛠️ 工具集成
- **API 调用**: 支持 REST API 集成
- **自定义函数**: 支持 JavaScript 函数编写
- **数据库操作**: 支持数据库查询和操作
- **Webhook**: 支持外部服务集成

### 💬 智能对话
- **实时聊天**: 支持与代理的实时对话
- **消息历史**: 完整的对话历史记录
- **Markdown 渲染**: 支持代码高亮和格式化
- **对话导出**: 支持导出对话记录

### 📊 管理功能
- **代理管理**: 创建、编辑、删除、发布代理
- **状态管理**: 草稿、已发布、已归档状态
- **标签系统**: 支持代理分类和标签
- **搜索过滤**: 强大的搜索和过滤功能

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 安装依赖

```bash
cd agent-studio
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
agent-studio/
├── src/
│   ├── app/                    # Next.js 应用路由
│   │   ├── agents/            # 代理管理页面
│   │   ├── chat/              # 聊天界面
│   │   └── layout.tsx         # 根布局
│   ├── components/            # React 组件
│   │   ├── agents/           # 代理相关组件
│   │   ├── flow/             # 流程编辑器组件
│   │   ├── layout/           # 布局组件
│   │   └── providers/        # 全局提供者
│   └── store/                # 状态管理
│       ├── agentStore.ts     # 代理状态管理
│       └── flowStore.ts      # 流程状态管理
├── public/                   # 静态资源
└── package.json             # 项目配置
```

## 🎯 核心功能

### 1. 代理创建和管理

- **创建代理**: 通过可视化界面创建新的 AI 代理
- **编辑配置**: 设置代理名称、描述、标签等基本信息
- **模型配置**: 选择 AI 模型并调整参数
- **状态管理**: 管理代理的发布状态

### 2. 流程设计

- **节点库**: 丰富的预定义节点类型
- **拖拽操作**: 直观的拖拽式流程设计
- **连接管理**: 自动处理节点间的连接关系
- **属性编辑**: 详细的节点属性配置面板

### 3. 对话测试

- **实时对话**: 与代理进行实时对话测试
- **消息格式**: 支持 Markdown 和代码高亮
- **历史记录**: 完整的对话历史保存
- **导出功能**: 支持对话记录导出

### 4. 工具集成

- **API 工具**: 集成外部 API 服务
- **函数工具**: 支持自定义 JavaScript 函数
- **数据库工具**: 数据库查询和操作
- **Webhook**: 外部服务回调

## 🛠️ 技术栈

### 前端框架
- **Next.js 14**: React 全栈框架
- **React 18**: 用户界面库
- **TypeScript**: 类型安全的 JavaScript

### UI 组件
- **Material-UI (MUI)**: 现代化 UI 组件库
- **ReactFlow**: 可视化流程图编辑器
- **Emotion**: CSS-in-JS 样式解决方案

### 状态管理
- **Zustand**: 轻量级状态管理
- **React Hook Form**: 表单处理
- **Zod**: 数据验证

### 工具库
- **date-fns**: 日期处理
- **axios**: HTTP 客户端
- **react-markdown**: Markdown 渲染
- **react-syntax-highlighter**: 代码高亮

## 🎨 界面预览

### 代理管理页面
- 网格布局展示所有代理
- 搜索和过滤功能
- 状态指示器和操作按钮

### 流程编辑器
- 左侧节点库面板
- 中央画布区域
- 右侧属性编辑面板

### 聊天界面
- 现代化的聊天 UI
- 消息气泡设计
- 实时输入和响应

## 🔧 配置说明

### 环境变量

创建 `.env.local` 文件：

```env
# API 配置
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# 模型配置
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_key

# 数据库配置
DATABASE_URL=your_database_url
```

### 主题配置

在 `src/components/providers/LayoutProvider.tsx` 中自定义主题：

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    // 更多配置...
  },
});
```

## 📝 开发指南

### 添加新节点类型

1. 在 `src/components/flow/customNodes.tsx` 中定义新节点组件
2. 在 `src/components/flow/NodePalette.tsx` 中添加节点到面板
3. 在 `src/components/InspectorPanel.tsx` 中添加属性编辑支持

### 扩展状态管理

1. 在 `src/store/` 目录下创建新的 store 文件
2. 使用 Zustand 定义状态和操作
3. 在组件中使用 store

### 自定义主题

1. 修改 `LayoutProvider.tsx` 中的主题配置
2. 使用 MUI 的 `sx` 属性进行样式覆盖
3. 创建自定义组件样式

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [ReactFlow](https://reactflow.dev/) - 流程图编辑器
- [Material-UI](https://mui.com/) - UI 组件库
- [Zustand](https://zustand-demo.pmnd.rs/) - 状态管理
- [Next.js](https://nextjs.org/) - React 框架

## 📞 联系我们

- 项目主页: [GitHub Repository]
- 问题反馈: [Issues]
- 邮箱: support@agentstudio.com

---

**Agent Studio** - 让 AI 代理开发变得简单高效 🚀
