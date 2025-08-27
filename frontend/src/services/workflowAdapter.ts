// 工作流适配器 - 将现有的本地数据转换为API格式，并集成新的API框架

import { Workflow as LocalWorkflow } from './workflowService'
import { Workflow as ApiWorkflow, CreateWorkflowRequest, UpdateWorkflowRequest } from './api/types'
import { WorkflowService } from './api'

// 将本地工作流数据转换为API格式
export const convertLocalToApiWorkflow = (localWorkflow: LocalWorkflow): ApiWorkflow => {
  return {
    id: localWorkflow.id,
    name: localWorkflow.name,
    description: localWorkflow.description,
    status: localWorkflow.status as any,
    trigger: localWorkflow.trigger as any,
    lastRunAt: localWorkflow.lastRun,
    nextRunAt: localWorkflow.nextRun,
    successRate: localWorkflow.successRate,
    averageExecutionTime: parseFloat(localWorkflow.executionTime.replace(/[^\d.]/g, '')) * 1000, // 转换为毫秒
    nodeCount: localWorkflow.nodes,
    tags: localWorkflow.tags,
    isActive: localWorkflow.status !== 'stopped' && localWorkflow.status !== 'error',
    createdBy: 'current-user', // 默认值
    createdAt: localWorkflow.createdAt,
    updatedAt: localWorkflow.createdAt, // 使用创建时间作为默认值
    workflowData: localWorkflow.workflowData
  }
}

// 将API工作流数据转换为本地格式
export const convertApiToLocalWorkflow = (apiWorkflow: ApiWorkflow): LocalWorkflow => {
  return {
    id: apiWorkflow.id,
    name: apiWorkflow.name,
    description: apiWorkflow.description,
    status: apiWorkflow.status as any,
    trigger: apiWorkflow.trigger as any,
    lastRun: apiWorkflow.lastRunAt || '从未运行',
    nextRun: apiWorkflow.nextRunAt || '手动触发',
    successRate: apiWorkflow.successRate,
    executionTime: `${Math.round(apiWorkflow.averageExecutionTime / 1000 * 10) / 10}s`,
    nodes: apiWorkflow.nodeCount,
    tags: apiWorkflow.tags,
    createdAt: apiWorkflow.createdAt,
    workflowData: apiWorkflow.workflowData
  }
}

// 混合工作流服务 - 结合本地数据和API调用
export class HybridWorkflowService {
  // 获取所有工作流（优先使用API，失败时回退到本地数据）
  static async getAllWorkflows() {
    try {
      const response = await WorkflowService.getWorkflows()
      if (response.success && response.data) {
        return response.data.items.map(convertApiToLocalWorkflow)
      }
    } catch (error) {
      console.warn('API调用失败，使用本地数据:', error)
    }
    
    // 回退到本地数据
    const { getAllWorkflows } = await import('./workflowService')
    return getAllWorkflows()
  }

  // 根据ID获取工作流
  static async getWorkflowById(id: string) {
    try {
      const response = await WorkflowService.getWorkflowById(id)
      if (response.success && response.data) {
        return convertApiToLocalWorkflow(response.data)
      }
    } catch (error) {
      console.warn('API调用失败，使用本地数据:', error)
    }
    
    // 回退到本地数据
    const { getWorkflowById } = await import('./workflowService')
    return getWorkflowById(id)
  }

  // 创建工作流
  static async createWorkflow(workflowData: CreateWorkflowRequest) {
    try {
      const response = await WorkflowService.createWorkflow(workflowData)
      if (response.success && response.data) {
        return convertApiToLocalWorkflow(response.data)
      }
    } catch (error) {
      console.warn('API调用失败，使用本地数据:', error)
    }
    
    // 回退到本地数据
    const { addWorkflow } = await import('./workflowService')
    const localWorkflow = {
      name: workflowData.name,
      description: workflowData.description,
      status: 'stopped' as const,
      trigger: workflowData.trigger,
      lastRun: '从未运行',
      nextRun: '手动触发',
      successRate: 0,
      executionTime: '0s',
      nodes: workflowData.workflowData?.nodes?.length || 0,
      tags: workflowData.tags || [],
      workflowData: workflowData.workflowData
    }
    return addWorkflow(localWorkflow)
  }

  // 更新工作流
  static async updateWorkflow(id: string, updates: UpdateWorkflowRequest) {
    try {
      const response = await WorkflowService.updateWorkflow(id, updates)
      if (response.success && response.data) {
        return convertApiToLocalWorkflow(response.data)
      }
    } catch (error) {
      console.warn('API调用失败，使用本地数据:', error)
    }
    
    // 回退到本地数据
    const { updateWorkflow } = await import('./workflowService')
    return updateWorkflow(id, updates as any)
  }

  // 删除工作流
  static async deleteWorkflow(id: string) {
    try {
      const response = await WorkflowService.deleteWorkflow(id)
      if (response.success && response.data?.deleted) {
        return true
      }
    } catch (error) {
      console.warn('API调用失败，使用本地数据:', error)
    }
    
    // 回退到本地数据
    const { deleteWorkflow } = await import('./workflowService')
    return deleteWorkflow(id)
  }

  // 执行工作流
  static async executeWorkflow(id: string, input?: Record<string, any>) {
    try {
      const response = await WorkflowService.executeWorkflow(id, { input })
      if (response.success && response.data) {
        return response.data
      }
    } catch (error) {
      console.warn('API调用失败:', error)
      throw error
    }
  }

  // 获取工作流状态
  static async getWorkflowStatus(id: string) {
    try {
      const response = await WorkflowService.getWorkflowStatus(id)
      if (response.success && response.data) {
        return response.data
      }
    } catch (error) {
      console.warn('API调用失败:', error)
      throw error
    }
  }

  // 保存工作流（兼容现有接口）
  static async saveWorkflow(
    name: string, 
    description: string, 
    workflowData: any, 
    tags: string[] = [],
    existingId?: string
  ) {
    if (existingId) {
      return this.updateWorkflow(existingId, {
        name,
        description,
        workflowData,
        tags
      })
    } else {
      return this.createWorkflow({
        name,
        description,
        trigger: 'manual',
        workflowData,
        tags
      })
    }
  }
}

// 导出默认实例
export default HybridWorkflowService
