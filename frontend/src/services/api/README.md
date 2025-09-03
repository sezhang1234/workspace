# API框架使用说明

这是一个简化的前端API调用框架，基于Axios和React Query构建。

## 快速开始

### 1. 导入和使用

```tsx
import { useWorkflows, useCreateWorkflow } from '@/services/api'

function WorkflowList() {
  const workflows = useWorkflows()
  const createWorkflow = useCreateWorkflow()
  
  // 使用数据...
}
```

### 2. 服务类使用

```tsx
import { WorkflowService } from '@/services/api'

const workflows = await WorkflowService.getWorkflows()
```

### 3. 工具函数

```tsx
import { utils } from '@/services/api'

const queryString = utils.buildQueryString({ page: 1, size: 20 })
const formattedDate = utils.formatDate(new Date(), 'relative')
```

## 主要功能

- **认证服务**: 登录、注册、权限管理等
- **工作流服务**: CRUD操作、执行、状态管理等
- **React Query Hooks**: 智能缓存和状态管理
- **工具函数**: URL构建、日期格式化等
- **错误处理**: 统一的错误处理机制

## 配置要求

1. 设置环境变量 `VITE_API_BASE_URL`
2. 安装依赖 `axios` 和 `react-query`
3. 配置React Query的QueryClient

## 文件结构

```
src/services/api/
├── config.ts          # API配置
├── types.ts           # 类型定义
├── client.ts          # HTTP客户端
├── authService.ts     # 认证服务
├── workflowService.ts # 工作流服务
├── hooks/             # React Query hooks
└── index.ts           # 主入口
```
