## Agent Studio（类似 Dify 的前端）

基于 Next.js + TypeScript 的前端应用，提供类似 Dify Agent 平台的工作流画布。使用 React Flow 实现可视化编排，UI 采用 MUI（Material UI）。

### 技术栈
- Next.js 14（App Router）+ TypeScript
- MUI（Material UI）组件与主题
- React Flow 画布编排
- Zustand 作为轻量状态管理
- Tailwind（来自脚手架，当前使用较少）

### 路由与结构
- `/`：主页（快速入口）
- `/agents`：Agent 列表占位页
- `/agents/[id]`：画布 + 右侧属性面板布局

核心组件：
- `src/components/AgentCanvas.tsx`：React Flow 画布
- `src/components/InspectorPanel.tsx`：节点属性编辑面板
- `src/components/layout/TopBar.tsx`：顶栏导航
- `src/components/providers/ClientThemeProvider.tsx`：全局 MUI 主题
- `src/store/flowStore.ts`：Zustand 存储（节点与连线）

### 本地开发
安装依赖并启动开发服务器：
```bash
npm install
npm run dev
```
打开 http://localhost:3000 预览。

### 构建与启动
```bash
npm run build
npm run start
```

### 开发说明
- 画布内预置了一个简易示例图。点击节点后，可在右侧面板编辑标签。
- 全局 MUI 主题通过 `src/app/layout.tsx` 中的 `ClientThemeProvider` 生效。

### 部署
可部署到任意支持 Node.js 的平台。以 Vercel 为例：
```bash
npm run build
# 在 Vercel 连接此仓库后进行部署
```

### 许可证
MIT（如需可自行调整）
