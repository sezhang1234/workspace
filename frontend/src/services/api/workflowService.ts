import { apiRequest, apiUtils } from './client'
import { API_ENDPOINTS } from './config'
import {
  Workflow,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  ExecuteWorkflowRequest,
  WorkflowExecution,
  WorkflowLog,
  ListQueryParams,
  ListResponse,
  DetailResponse,
  CreateResponse,
  UpdateResponse,
  DeleteResponse,
  ExecuteResponse,
  ApiResponse,
} from './types'

// 工作流服务
export class WorkflowService {
  // 获取工作流列表
  static async getWorkflows(params?: ListQueryParams): Promise<ListResponse<Workflow>> {
    const queryString = apiUtils.buildQueryString(params || {})
    const url = queryString ? `${API_ENDPOINTS.WORKFLOWS.LIST}?${queryString}` : API_ENDPOINTS.WORKFLOWS.LIST
    return apiRequest.get<ListResponse<Workflow>>(url)
  }

  // 根据ID获取工作流详情
  static async getWorkflowById(id: string): Promise<DetailResponse<Workflow>> {
    const url = apiUtils.replaceUrlParams(API_ENDPOINTS.WORKFLOWS.DETAIL, { id })
    return apiRequest.get<DetailResponse<Workflow>>(url)
  }

  // 创建工作流
  static async createWorkflow(workflowData: CreateWorkflowRequest): Promise<CreateResponse<Workflow>> {
    return apiRequest.post<CreateResponse<Workflow>>(API_ENDPOINTS.WORKFLOWS.CREATE, workflowData)
  }

  // 更新工作流
  static async updateWorkflow(id: string, workflowData: UpdateWorkflowRequest): Promise<UpdateResponse<Workflow>> {
    const url = apiUtils.replaceUrlParams(API_ENDPOINTS.WORKFLOWS.UPDATE, { id })
    return apiRequest.put<UpdateResponse<Workflow>>(url, workflowData)
  }

  // 删除工作流
  static async deleteWorkflow(id: string): Promise<DeleteResponse> {
    const url = apiUtils.replaceUrlParams(API_ENDPOINTS.WORKFLOWS.DELETE, { id })
    return apiRequest.delete<DeleteResponse>(url)
  }

  // 执行工作流
  static async executeWorkflow(id: string, executionData?: ExecuteWorkflowRequest): Promise<ExecuteResponse<WorkflowExecution>> {
    const url = apiUtils.replaceUrlParams(API_ENDPOINTS.WORKFLOWS.EXECUTE, { id })
    return apiRequest.post<ExecuteResponse<WorkflowExecution>>(url, executionData || {})
  }

  // 获取工作流状态
  static async getWorkflowStatus(id: string): Promise<ApiResponse<{
    status: string
    lastRunAt?: string
    nextRunAt?: string
    successRate: number
    averageExecutionTime: number
    totalExecutions: number
    lastExecution?: WorkflowExecution
  }>> {
    const url = apiUtils.replaceUrlParams(API_ENDPOINTS.WORKFLOWS.STATUS, { id })
    return apiRequest.get<ApiResponse<{
      status: string
      lastRunAt?: string
      nextRunAt?: string
      successRate: number
      averageExecutionTime: number
      totalExecutions: number
      lastExecution?: WorkflowExecution
    }>>(url)
  }

  // 获取工作流执行日志
  static async getWorkflowLogs(
    id: string,
    params?: {
      page?: number
      pageSize?: number
      level?: 'debug' | 'info' | 'warning' | 'error'
      startDate?: string
      endDate?: string
    }
  ): Promise<ApiResponse<{
    logs: WorkflowLog[]
    pagination: {
      page: number
      pageSize: number
      total: number
      totalPages: number
    }
  }>> {
    const queryString = apiUtils.buildQueryString(params || {})
    const baseUrl = apiUtils.replaceUrlParams(API_ENDPOINTS.WORKFLOWS.LOGS, { id })
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl
    return apiRequest.get<ApiResponse<{
      logs: WorkflowLog[]
      pagination: {
        page: number
        pageSize: number
        total: number
        totalPages: number
      }
    }>>(url)
  }

  // 获取工作流执行历史
  static async getWorkflowExecutions(
    id: string,
    params?: {
      page?: number
      pageSize?: number
      status?: string
      startDate?: string
      endDate?: string
    }
  ): Promise<ApiResponse<{
    executions: WorkflowExecution[]
    pagination: {
      page: number
      pageSize: number
      total: number
      totalPages: number
    }
  }>> {
    const queryString = apiUtils.buildQueryString(params || {})
    const url = queryString ? `/workflows/${id}/executions?${queryString}` : `/workflows/${id}/executions`
    return apiRequest.get<ApiResponse<{
      executions: WorkflowExecution[]
      pagination: {
        page: number
        pageSize: number
        total: number
        totalPages: number
      }
    }>>(url)
  }

  // 获取执行详情
  static async getExecutionDetails(workflowId: string, executionId: string): Promise<ApiResponse<WorkflowExecution>> {
    return apiRequest.get<ApiResponse<WorkflowExecution>>(`/workflows/${workflowId}/executions/${executionId}`)
  }

  // 取消工作流执行
  static async cancelWorkflowExecution(workflowId: string, executionId: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest.post<ApiResponse<{ message: string }>>(`/workflows/${workflowId}/executions/${executionId}/cancel`)
  }

  // 暂停工作流
  static async pauseWorkflow(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest.post<ApiResponse<{ message: string }>>(`/workflows/${id}/pause`)
  }

  // 恢复工作流
  static async resumeWorkflow(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest.post<ApiResponse<{ message: string }>>(`/workflows/${id}/resume`)
  }

  // 停止工作流
  static async stopWorkflow(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest.post<ApiResponse<{ message: string }>>(`/workflows/${id}/stop`)
  }

  // 启动工作流
  static async startWorkflow(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest.post<ApiResponse<{ message: string }>>(`/workflows/${id}/start`)
  }

  // 导出工作流
  static async exportWorkflow(id: string, format: 'json' | 'yaml' | 'xml' = 'json'): Promise<Blob> {
    const url = apiUtils.replaceUrlParams(API_ENDPOINTS.WORKFLOWS.EXPORT, { id })
    const response = await apiRequest.download(`${url}?format=${format}`)
    return response.data
  }

  // 导入工作流
  static async importWorkflow(file: File, options?: {
    overwrite?: boolean
    validateOnly?: boolean
  }): Promise<ApiResponse<Workflow>> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    return apiRequest.upload<ApiResponse<Workflow>>(API_ENDPOINTS.WORKFLOWS.IMPORT, formData)
  }

  // 克隆工作流
  static async cloneWorkflow(id: string, newName: string, newDescription?: string): Promise<CreateResponse<Workflow>> {
    return apiRequest.post<CreateResponse<Workflow>>(`/workflows/${id}/clone`, {
      name: newName,
      description: newDescription,
    })
  }

  // 获取工作流统计信息
  static async getWorkflowStats(params?: {
    startDate?: string
    endDate?: string
    groupBy?: 'day' | 'week' | 'month'
  }): Promise<ApiResponse<{
    totalWorkflows: number
    activeWorkflows: number
    totalExecutions: number
    successRate: number
    averageExecutionTime: number
    executionsByStatus: Record<string, number>
    executionsByDate: Array<{
      date: string
      count: number
      successCount: number
      failureCount: number
    }>
  }>> {
    const queryString = apiUtils.buildQueryString(params || {})
    const url = queryString ? `/workflows/stats?${queryString}` : '/workflows/stats'
    return apiRequest.get<ApiResponse<{
      totalWorkflows: number
      activeWorkflows: number
      totalExecutions: number
      successRate: number
      averageExecutionTime: number
      executionsByStatus: Record<string, number>
      executionsByDate: Array<{
        date: string
        count: number
        successCount: number
        failureCount: number
      }>
    }>>(url)
  }

  // 搜索工作流
  static async searchWorkflows(query: string, params?: {
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<Workflow>> {
    const searchParams = {
      q: query,
      ...params,
    }
    const queryString = apiUtils.buildQueryString(searchParams)
    const url = queryString ? `/workflows/search?${queryString}` : '/workflows/search'
    return apiRequest.get<ListResponse<Workflow>>(url)
  }

  // 获取工作流模板
  static async getWorkflowTemplates(category?: string): Promise<ApiResponse<{
    templates: Array<{
      id: string
      name: string
      description: string
      category: string
      tags: string[]
      workflowData: any
      usageCount: number
      rating: number
    }>
  }>> {
    const queryString = category ? `?category=${encodeURIComponent(category)}` : ''
    const url = `/workflows/templates${queryString}`
    return apiRequest.get<ApiResponse<{
      templates: Array<{
        id: string
        name: string
        description: string
        category: string
        tags: string[]
        workflowData: any
        usageCount: number
        rating: number
      }>
    }>>(url)
  }

  // 验证工作流配置
  static async validateWorkflow(workflowData: any): Promise<ApiResponse<{
    isValid: boolean
    errors: Array<{
      field: string
      message: string
      code: string
    }>
    warnings: Array<{
      field: string
      message: string
      code: string
    }>
  }>> {
    return apiRequest.post<ApiResponse<{
      isValid: boolean
      errors: Array<{
        field: string
        message: string
        code: string
      }>
      warnings: Array<{
        field: string
        message: string
        code: string
      }>
    }>>('/workflows/validate', workflowData)
  }


}

// 导出工作流服务实例
export default WorkflowService
