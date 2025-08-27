import { useMutation, useQuery, useQueryClient } from 'react-query'
import WorkflowService from '../workflowService'
import {
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  ExecuteWorkflowRequest,
  ListQueryParams,
} from '../types'

// 工作流相关的React Query hooks

// 获取工作流列表
export const useWorkflows = (params?: ListQueryParams) => {
  return useQuery(
    ['workflows', 'list', params],
    () => WorkflowService.getWorkflows(params),
    {
      staleTime: 2 * 60 * 1000, // 2分钟内不重新获取
      cacheTime: 5 * 60 * 1000, // 缓存5分钟
      retry: 2,
      retryDelay: 1000,
      onError: (error) => {
        console.error('获取工作流列表失败:', error)
      },
    }
  )
}

// 根据ID获取工作流详情
export const useWorkflow = (id: string) => {
  return useQuery(
    ['workflows', 'detail', id],
    () => WorkflowService.getWorkflowById(id),
    {
      enabled: !!id, // 只有当id存在时才执行查询
      staleTime: 1 * 60 * 1000, // 1分钟内不重新获取
      cacheTime: 3 * 60 * 1000, // 缓存3分钟
      retry: 2,
      retryDelay: 1000,
      onError: (error) => {
        console.error('获取工作流详情失败:', error)
      },
    }
  )
}

// 创建工作流
export const useCreateWorkflow = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (workflowData: CreateWorkflowRequest) => WorkflowService.createWorkflow(workflowData),
    {
      onSuccess: (response) => {
        if (response.success) {
          // 创建成功后，清除工作流列表缓存，重新获取
          queryClient.invalidateQueries(['workflows', 'list'])
          
          // 可以显示成功提示
          console.log('工作流创建成功')
        }
      },
      onError: (error) => {
        console.error('创建工作流失败:', error)
      },
    }
  )
}

// 更新工作流
export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient()

  return useMutation(
    ({ id, workflowData }: { id: string; workflowData: UpdateWorkflowRequest }) =>
      WorkflowService.updateWorkflow(id, workflowData),
    {
      onSuccess: (response, variables) => {
        if (response.success) {
          // 更新成功后，更新缓存中的工作流详情
          queryClient.setQueryData(['workflows', 'detail', variables.id], response)
          
          // 清除工作流列表缓存，重新获取
          queryClient.invalidateQueries(['workflows', 'list'])
          
          // 可以显示成功提示
          console.log('工作流更新成功')
        }
      },
      onError: (error) => {
        console.error('更新工作流失败:', error)
      },
    }
  )
}

// 删除工作流
export const useDeleteWorkflow = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (id: string) => WorkflowService.deleteWorkflow(id),
    {
      onSuccess: (response, id) => {
        if (response.success) {
          // 删除成功后，从缓存中移除工作流详情
          queryClient.removeQueries(['workflows', 'detail', id])
          
          // 清除工作流列表缓存，重新获取
          queryClient.invalidateQueries(['workflows', 'list'])
          
          // 可以显示成功提示
          console.log('工作流删除成功')
        }
      },
      onError: (error) => {
        console.error('删除工作流失败:', error)
      },
    }
  )
}

// 执行工作流
export const useExecuteWorkflow = () => {
  const queryClient = useQueryClient()

  return useMutation(
    ({ id, executionData }: { id: string; executionData?: ExecuteWorkflowRequest }) =>
      WorkflowService.executeWorkflow(id, executionData),
    {
      onSuccess: (response, variables) => {
        if (response.success) {
          // 执行成功后，重新获取工作流状态
          queryClient.invalidateQueries(['workflows', 'status', variables.id])
          
          // 重新获取执行历史
          queryClient.invalidateQueries(['workflows', 'executions', variables.id])
          
          // 可以显示成功提示
          console.log('工作流执行成功')
        }
      },
      onError: (error) => {
        console.error('执行工作流失败:', error)
      },
    }
  )
}

// 获取工作流状态
export const useWorkflowStatus = (id: string) => {
  return useQuery(
    ['workflows', 'status', id],
    () => WorkflowService.getWorkflowStatus(id),
    {
      enabled: !!id,
      staleTime: 30 * 1000, // 30秒内不重新获取
      cacheTime: 1 * 60 * 1000, // 缓存1分钟
      retry: 2,
      retryDelay: 1000,
      refetchInterval: 10 * 1000, // 每10秒自动刷新
      onError: (error) => {
        console.error('获取工作流状态失败:', error)
      },
    }
  )
}

// 获取工作流执行日志
export const useWorkflowLogs = (
  id: string,
  params?: {
    page?: number
    pageSize?: number
    level?: 'debug' | 'info' | 'warning' | 'error'
    startDate?: string
    endDate?: string
  }
) => {
  return useQuery(
    ['workflows', 'logs', id, params],
    () => WorkflowService.getWorkflowLogs(id, params),
    {
      enabled: !!id,
      staleTime: 1 * 60 * 1000, // 1分钟内不重新获取
      cacheTime: 2 * 60 * 1000, // 缓存2分钟
      retry: 2,
      retryDelay: 1000,
      onError: (error) => {
        console.error('获取工作流日志失败:', error)
      },
    }
  )
}

// 获取工作流执行历史
export const useWorkflowExecutions = (
  id: string,
  params?: {
    page?: number
    pageSize?: number
    status?: string
    startDate?: string
    endDate?: string
  }
) => {
  return useQuery(
    ['workflows', 'executions', id, params],
    () => WorkflowService.getWorkflowExecutions(id, params),
    {
      enabled: !!id,
      staleTime: 2 * 60 * 1000, // 2分钟内不重新获取
      cacheTime: 5 * 60 * 1000, // 缓存5分钟
      retry: 2,
      retryDelay: 1000,
      onError: (error) => {
        console.error('获取工作流执行历史失败:', error)
      },
    }
  )
}

// 获取执行详情
export const useExecutionDetails = (workflowId: string, executionId: string) => {
  return useQuery(
    ['workflows', 'executions', workflowId, executionId],
    () => WorkflowService.getExecutionDetails(workflowId, executionId),
    {
      enabled: !!(workflowId && executionId),
      staleTime: 1 * 60 * 1000, // 1分钟内不重新获取
      cacheTime: 3 * 60 * 1000, // 缓存3分钟
      retry: 2,
      retryDelay: 1000,
      onError: (error) => {
        console.error('获取执行详情失败:', error)
      },
    }
  )
}

// 取消工作流执行
export const useCancelWorkflowExecution = () => {
  const queryClient = useQueryClient()

  return useMutation(
    ({ workflowId, executionId }: { workflowId: string; executionId: string }) =>
      WorkflowService.cancelWorkflowExecution(workflowId, executionId),
    {
      onSuccess: (response, variables) => {
        if (response.success) {
          // 取消成功后，重新获取执行详情
          queryClient.invalidateQueries(['workflows', 'executions', variables.workflowId, variables.executionId])
          
          // 重新获取工作流状态
          queryClient.invalidateQueries(['workflows', 'status', variables.workflowId])
          
          // 可以显示成功提示
          console.log('工作流执行取消成功')
        }
      },
      onError: (error) => {
        console.error('取消工作流执行失败:', error)
      },
    }
  )
}

// 暂停工作流
export const usePauseWorkflow = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (id: string) => WorkflowService.pauseWorkflow(id),
    {
      onSuccess: (response, id) => {
        if (response.success) {
          // 暂停成功后，重新获取工作流状态
          queryClient.invalidateQueries(['workflows', 'status', id])
          
          // 可以显示成功提示
          console.log('工作流暂停成功')
        }
      },
      onError: (error) => {
        console.error('暂停工作流失败:', error)
      },
    }
  )
}

// 恢复工作流
export const useResumeWorkflow = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (id: string) => WorkflowService.resumeWorkflow(id),
    {
      onSuccess: (response, id) => {
        if (response.success) {
          // 恢复成功后，重新获取工作流状态
          queryClient.invalidateQueries(['workflows', 'status', id])
          
          // 可以显示成功提示
          console.log('工作流恢复成功')
        }
      },
      onError: (error) => {
        console.error('恢复工作流失败:', error)
      },
    }
  )
}

// 停止工作流
export const useStopWorkflow = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (id: string) => WorkflowService.stopWorkflow(id),
    {
      onSuccess: (response, id) => {
        if (response.success) {
          // 停止成功后，重新获取工作流状态
          queryClient.invalidateQueries(['workflows', 'status', id])
          
          // 可以显示成功提示
          console.log('工作流停止成功')
        }
      },
      onError: (error) => {
        console.error('停止工作流失败:', error)
      },
    }
  )
}

// 启动工作流
export const useStartWorkflow = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (id: string) => WorkflowService.startWorkflow(id),
    {
      onSuccess: (response, id) => {
        if (response.success) {
          // 启动成功后，重新获取工作流状态
          queryClient.invalidateQueries(['workflows', 'status', id])
          
          // 可以显示成功提示
          console.log('工作流启动成功')
        }
      },
      onError: (error) => {
        console.error('启动工作流失败:', error)
      },
    }
  )
}

// 导出工作流
export const useExportWorkflow = () => {
  return useMutation(
    ({ id, format }: { id: string; format?: 'json' | 'yaml' | 'xml' }) =>
      WorkflowService.exportWorkflow(id, format),
    {
      onSuccess: (blob, variables) => {
        // 导出成功后，可以触发下载
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `workflow-${variables.id}.${variables.format || 'json'}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        console.log('工作流导出成功')
      },
      onError: (error) => {
        console.error('导出工作流失败:', error)
      },
    }
  )
}

// 导入工作流
export const useImportWorkflow = () => {
  const queryClient = useQueryClient()

  return useMutation(
    ({ file, options }: { file: File; options?: { overwrite?: boolean; validateOnly?: boolean } }) =>
      WorkflowService.importWorkflow(file, options),
    {
      onSuccess: (response) => {
        if (response.success) {
          // 导入成功后，清除工作流列表缓存，重新获取
          queryClient.invalidateQueries(['workflows', 'list'])
          
          // 可以显示成功提示
          console.log('工作流导入成功')
        }
      },
      onError: (error) => {
        console.error('导入工作流失败:', error)
      },
    }
  )
}

// 克隆工作流
export const useCloneWorkflow = () => {
  const queryClient = useQueryClient()

  return useMutation(
    ({ id, newName, newDescription }: { id: string; newName: string; newDescription?: string }) =>
      WorkflowService.cloneWorkflow(id, newName, newDescription),
    {
      onSuccess: (response) => {
        if (response.success) {
          // 克隆成功后，清除工作流列表缓存，重新获取
          queryClient.invalidateQueries(['workflows', 'list'])
          
          // 可以显示成功提示
          console.log('工作流克隆成功')
        }
      },
      onError: (error) => {
        console.error('克隆工作流失败:', error)
      },
    }
  )
}

// 获取工作流统计信息
export const useWorkflowStats = (params?: {
  startDate?: string
  endDate?: string
  groupBy?: 'day' | 'week' | 'month'
}) => {
  return useQuery(
    ['workflows', 'stats', params],
    () => WorkflowService.getWorkflowStats(params),
    {
      staleTime: 5 * 60 * 1000, // 5分钟内不重新获取
      cacheTime: 10 * 60 * 1000, // 缓存10分钟
      retry: 2,
      retryDelay: 1000,
      onError: (error) => {
        console.error('获取工作流统计信息失败:', error)
      },
    }
  )
}

// 搜索工作流
export const useSearchWorkflows = (
  query: string,
  params?: {
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }
) => {
  return useQuery(
    ['workflows', 'search', query, params],
    () => WorkflowService.searchWorkflows(query, params),
    {
      enabled: !!query.trim(), // 只有当查询字符串不为空时才执行搜索
      staleTime: 2 * 60 * 1000, // 2分钟内不重新获取
      cacheTime: 5 * 60 * 1000, // 缓存5分钟
      retry: 2,
      retryDelay: 1000,
      onError: (error) => {
        console.error('搜索工作流失败:', error)
      },
    }
  )
}

// 获取工作流模板
export const useWorkflowTemplates = (category?: string) => {
  return useQuery(
    ['workflows', 'templates', category],
    () => WorkflowService.getWorkflowTemplates(category),
    {
      staleTime: 10 * 60 * 1000, // 10分钟内不重新获取
      cacheTime: 20 * 60 * 1000, // 缓存20分钟
      retry: 2,
      retryDelay: 1000,
      onError: (error) => {
        console.error('获取工作流模板失败:', error)
      },
    }
  )
}

// 验证工作流配置
export const useValidateWorkflow = () => {
  return useMutation(
    (workflowData: any) => WorkflowService.validateWorkflow(workflowData),
    {
      onError: (error) => {
        console.error('验证工作流配置失败:', error)
      },
    }
  )
}


