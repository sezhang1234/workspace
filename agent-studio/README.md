# Agent Studio

一个功能完整的智能代理开发平台，类似于 Dify 和 Coze，基于 React、ReactFlow 和 Material-UI 构建。

## 🚀 功能特性

### 核心功能
- **可视化工作流编辑器** - 使用 ReactFlow 构建直观的节点连接界面
- **丰富的节点类型** - 支持输入、输出、LLM、工具、条件判断等多种节点
- **实时属性面板** - 动态配置节点参数和属性
- **拖拽式节点库** - 分类展示各种可用节点，支持搜索和拖拽

### 代理管理
- **代理列表** - 网格布局展示所有代理，支持搜索和筛选
- **代理创建** - 模板化创建流程，支持多种代理类型
- **版本管理** - 完整的版本历史和发布管理

### 知识库管理
- **文档上传** - 支持多种格式的文档上传和处理
- **数据集管理** - 结构化和非结构化数据管理
- **URL 集成** - 外部知识源集成

### 工具集成
- **内置工具** - 网络搜索、计算器、文件操作等
- **API 集成** - 外部 API 调用和配置
- **数据库连接** - 多种数据库支持
- **自定义工具** - 支持自定义代码执行

### 变量管理
- **环境变量** - 全局配置管理
- **上下文变量** - 会话级变量管理
- **系统变量** - 系统级配置

### 调试功能
- **实时聊天测试** - 内置聊天界面进行代理测试
- **执行日志** - 详细的执行过程日志
- **性能监控** - 响应时间和成功率统计

### 发布部署
- **多环境部署** - 开发、测试、生产环境管理
- **版本控制** - 完整的版本发布历史
- **流量管理** - 支持蓝绿部署和流量分配
- **健康检查** - 自动健康监控和告警

## 🛠️ 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI 组件库**: Material-UI (MUI) v7
- **工作流引擎**: ReactFlow v11
- **状态管理**: Zustand
- **开发语言**: TypeScript
- **样式方案**: Emotion + Tailwind CSS

## 📦 安装和运行

### 环境要求
- Node.js 18+ 
- npm 或 yarn

### 安装依赖
```bash
cd agent-studio
npm install
```

### 开发模式
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本
```bash
npm run build
npm start
```

## 🏗️ 项目结构

```
agent-studio/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── agents/            # 代理相关页面
│   │   │   ├── [id]/          # 代理详情页面
│   │   │   │   ├── knowledge/ # 知识库管理
│   │   │   │   ├── tools/     # 工具管理
│   │   │   │   ├── variables/ # 变量管理
│   │   │   │   ├── debug/     # 调试功能
│   │   │   │   └── publish/   # 发布管理
│   │   │   ├── new/           # 创建新代理
│   │   │   └── page.tsx       # 代理列表
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 首页
│   ├── components/            # React 组件
│   │   ├── layout/           # 布局组件
│   │   │   ├── AppShell.tsx  # 主应用外壳
│   │   │   └── TopBar.tsx    # 顶部导航栏
│   │   ├── flow/             # 工作流相关组件
│   │   │   ├── NodePalette.tsx    # 节点面板
│   │   │   └── customNodes.tsx    # 自定义节点
│   │   ├── AgentCanvas.tsx   # 工作流画布
│   │   └── InspectorPanel.tsx # 属性面板
│   └── store/                # 状态管理
│       └── flowStore.ts      # 工作流状态
├── public/                   # 静态资源
├── package.json             # 项目配置
└── README.md               # 项目文档
```

## 🎨 组件说明

### 核心组件

#### AgentCanvas
工作流画布组件，基于 ReactFlow 实现：
- 支持节点拖拽和连接
- 实时节点选择和编辑
- 画布缩放和平移
- 小地图和控制器

#### NodePalette
节点库面板，提供可拖拽的节点：
- 分类展示节点类型
- 搜索和筛选功能
- 拖拽到画布创建节点

#### InspectorPanel
属性面板，用于配置选中节点：
- 动态表单生成
- 节点类型特定配置
- 实时属性更新

### 节点类型

#### 基础节点
- **输入节点** - 接收用户输入或数据
- **输出节点** - 返回结果给用户
- **LLM 节点** - 大语言模型处理

#### 逻辑节点
- **条件判断** - 根据条件分支执行
- **循环节点** - 重复执行指定逻辑

#### 工具节点
- **网络搜索** - 搜索网络信息
- **计算器** - 数学计算和公式
- **文件读取** - 读取和处理文件
- **API 调用** - 调用外部 API
- **数据库** - 数据库操作
- **代码执行** - 执行自定义代码

## 🔧 配置说明

### 环境变量
```env
# 开发环境配置
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Agent Studio
```

### 主题配置
项目使用 Material-UI 主题系统，可以在 `src/app/layout.tsx` 中自定义主题。

## 🚀 部署

### Vercel 部署
1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 自动部署

### Docker 部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📝 开发计划

### 已完成功能
- ✅ 基础工作流编辑器
- ✅ 节点库和拖拽功能
- ✅ 属性面板
- ✅ 代理管理界面
- ✅ 知识库管理
- ✅ 工具集成
- ✅ 变量管理
- ✅ 调试功能
- ✅ 发布部署

### 计划功能
- 🔄 后端 API 集成
- 🔄 实时协作编辑
- 🔄 插件系统
- 🔄 高级分析功能
- 🔄 移动端适配
- 🔄 多语言支持

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [ReactFlow](https://reactflow.dev/) - 优秀的工作流引擎
- [Material-UI](https://mui.com/) - 强大的 UI 组件库
- [Next.js](https://nextjs.org/) - React 全栈框架
- [Zustand](https://zustand-demo.pmnd.rs/) - 轻量级状态管理

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件
- 参与讨论

---

**Agent Studio** - 让智能代理开发变得简单高效 🚀
