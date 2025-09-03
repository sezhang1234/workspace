// API相关类型定义

// 基础响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: string
  timestamp: string
  requestId?: string
}

// 分页请求参数
export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 分页响应数据
export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// 列表查询参数
export interface ListQueryParams extends PaginationParams {
  search?: string
  filters?: Record<string, any>
  include?: string[]
  exclude?: string[]
}

// 列表响应
export interface ListResponse<T> extends ApiResponse<PaginatedResponse<T>> {}

// 详情响应
export interface DetailResponse<T> extends ApiResponse<T> {}

// 创建响应
export interface CreateResponse<T> extends ApiResponse<T> {}

// 更新响应
export interface UpdateResponse<T> extends ApiResponse<T> {}

// 删除响应
export interface DeleteResponse extends ApiResponse<{ deleted: boolean }> {}

// 执行响应
export interface ExecuteResponse<T = any> extends ApiResponse<T> {}

// 错误响应
export interface ErrorResponse extends ApiResponse<null> {
  success: false
  error: string
  code: string
  details?: Record<string, any>
  validationErrors?: ValidationError[]
}

// 验证错误
export interface ValidationError {
  field: string
  message: string
  code: string
  value?: any
}

// 认证相关类型
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse extends ApiResponse<{
  user_id_str: string
  name: string,
  user_unique_name: string,
  email: string,
  description: string,
  avatar_url: string,
  screen_name: string,
  locale: string,
  user_create_time: number
}> {}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse extends ApiResponse<{
  token: string
  expiresAt: string
}> {}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// 用户相关类型
export interface User {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  avatar?: string
  role: UserRole
  permissions: string[]
  status: UserStatus
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export type UserRole = 'admin' | 'user' | 'developer' | 'viewer'
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending'

export interface CreateUserRequest {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
  role: UserRole
  permissions?: string[]
}

export interface UpdateUserRequest {
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  role?: UserRole
  permissions?: string[]
  status?: UserStatus
}

// 工作流相关类型
export interface Workflow {
  id: string
  name: string
  description: string
  status: WorkflowStatus
  trigger: WorkflowTrigger
  lastRunAt?: string
  nextRunAt?: string
  successRate: number
  averageExecutionTime: number
  nodeCount: number
  tags: string[]
  isActive: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  workflowData?: any
}

export type WorkflowStatus = 'running' | 'stopped' | 'scheduled' | 'error' | 'completed' | 'paused'
export type WorkflowTrigger = 'manual' | 'webhook' | 'schedule' | 'event' | 'api'

export interface CreateWorkflowRequest {
  name: string
  description: string
  trigger: WorkflowTrigger
  workflowData: any
  tags?: string[]
  schedule?: string
}

export interface UpdateWorkflowRequest {
  name?: string
  description?: string
  trigger?: WorkflowTrigger
  workflowData?: any
  tags?: string[]
  schedule?: string
  isActive?: boolean
}

export interface ExecuteWorkflowRequest {
  input?: Record<string, any>
  parameters?: Record<string, any>
  timeout?: number
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  input?: Record<string, any>
  output?: Record<string, any>
  error?: string
  startedAt?: string
  completedAt?: string
  executionTime?: number
  logs?: WorkflowLog[]
}

export interface WorkflowLog {
  id: string
  executionId: string
  level: 'debug' | 'info' | 'warning' | 'error'
  message: string
  timestamp: string
  nodeId?: string
  metadata?: Record<string, any>
}

// 代理相关类型
export interface Agent {
  id: string
  name: string
  description: string
  type: AgentType
  model: string
  status: AgentStatus
  capabilities: string[]
  configuration: Record<string, any>
  performance: AgentPerformance
  createdBy: string
  createdAt: string
  updatedAt: string
}

export type AgentType = 'conversational' | 'task' | 'analytical' | 'creative' | 'custom'
export type AgentStatus = 'draft' | 'active' | 'inactive' | 'training' | 'deployed'

export interface AgentPerformance {
  totalExecutions: number
  successRate: number
  averageResponseTime: number
  lastExecutedAt?: string
}

export interface CreateAgentRequest {
  name: string
  description: string
  type: AgentType
  model: string
  capabilities: string[]
  configuration: Record<string, any>
}

export interface UpdateAgentRequest {
  name?: string
  description?: string
  type?: AgentType
  model?: string
  capabilities?: string[]
  configuration?: Record<string, any>
  status?: AgentStatus
}

// 模型相关类型
export interface Model {
  id: string
  name: string
  description: string
  type: ModelType
  provider: string
  version: string
  status: ModelStatus
  capabilities: string[]
  parameters: ModelParameters
  performance: ModelPerformance
  cost: ModelCost
  createdBy: string
  createdAt: string
  updatedAt: string
}

export type ModelType = 'llm' | 'embedding' | 'vision' | 'audio' | 'multimodal'
export type ModelStatus = 'available' | 'maintenance' | 'deprecated' | 'custom'

export interface ModelParameters {
  contextLength: number
  maxTokens: number
  temperature: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
}

export interface ModelPerformance {
  accuracy: number
  latency: number
  throughput: number
  lastTestedAt?: string
}

export interface ModelCost {
  inputTokens: number
  outputTokens: number
  currency: string
}

export interface CreateModelRequest {
  name: string
  description: string
  type: ModelType
  provider: string
  version: string
  capabilities: string[]
  parameters: ModelParameters
  cost: ModelCost
}

export interface UpdateModelRequest {
  name?: string
  description?: string
  capabilities?: string[]
  parameters?: Partial<ModelParameters>
  cost?: Partial<ModelCost>
  status?: ModelStatus
}

// 提示词相关类型
export interface Prompt {
  id: string
  name: string
  description: string
  content: string
  type: PromptType
  category: string
  tags: string[]
  variables: PromptVariable[]
  examples: PromptExample[]
  isTemplate: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

export type PromptType = 'instruction' | 'conversation' | 'completion' | 'question' | 'template'

export interface PromptVariable {
  name: string
  description: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  required: boolean
  defaultValue?: any
  validation?: string
}

export interface PromptExample {
  input: Record<string, any>
  output: string
  description?: string
}

export interface CreatePromptRequest {
  name: string
  description: string
  content: string
  type: PromptType
  category: string
  tags?: string[]
  variables?: PromptVariable[]
  examples?: PromptExample[]
  isTemplate?: boolean
}

export interface UpdatePromptRequest {
  name?: string
  description?: string
  content?: string
  type?: PromptType
  category?: string
  tags?: string[]
  variables?: PromptVariable[]
  examples?: PromptExample[]
  isTemplate?: boolean
}



// 通用查询参数
export interface DateRangeParams {
  startDate?: string
  endDate?: string
  timezone?: string
}

export interface SearchParams {
  query: string
  fields?: string[]
  fuzzy?: boolean
  highlight?: boolean
}

// 文件相关类型
export interface FileMetadata {
  id: string
  filename: string
  originalName: string
  size: number
  mimeType: string
  url: string
  uploadedBy: string
  uploadedAt: string
  tags?: string[]
  metadata?: Record<string, any>
}

// 通知相关类型
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  severity: 'info' | 'warning' | 'error' | 'success'
  isRead: boolean
  createdAt: string
  metadata?: Record<string, any>
}

export type NotificationType = 'system' | 'workflow' | 'user' | 'security' | 'performance'
