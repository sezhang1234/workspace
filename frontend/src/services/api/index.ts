// API服务主入口文件

// 导出配置
export * from './config'

// 导出类型定义
export * from './types'

// 导出基础客户端
export * from './client'

// 导出服务类
export { default as AuthService } from './authService'
export { default as WorkflowService } from './workflowService'

// 导出认证相关hooks
export * from './hooks/useAuth'

// 导出工作流相关hooks
export * from './hooks/useWorkflow'

// 导出所有hooks的命名空间版本
import * as AuthHooks from './hooks/useAuth'
import * as WorkflowHooks from './hooks/useWorkflow'

export const hooks = {
  auth: AuthHooks,
  workflow: WorkflowHooks,
}

// 导出默认配置
export const defaultConfig = {
  // 可以在这里设置一些默认配置
  retry: {
    maxRetries: 3,
    retryDelay: 1000,
  },
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5分钟
  },
}

// 导出工具函数
export const utils = {
  // 构建查询字符串
  buildQueryString: (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, String(item)))
        } else {
          searchParams.append(key, String(value))
        }
      }
    })
    
    return searchParams.toString()
  },

  // 构建URL参数
  buildUrl: (baseUrl: string, params?: Record<string, any>): string => {
    if (!params) return baseUrl
    
    const queryString = utils.buildQueryString(params)
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  },

  // 替换URL中的参数占位符
  replaceUrlParams: (url: string, params: Record<string, string | number>): string => {
    let result = url
    
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(`:${key}`, String(value))
    })
    
    return result
  },

  // 格式化日期
  formatDate: (date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string => {
    const d = new Date(date)
    
    if (format === 'short') {
      return d.toLocaleDateString('zh-CN')
    } else if (format === 'long') {
      return d.toLocaleString('zh-CN')
    } else if (format === 'relative') {
      const now = new Date()
      const diff = now.getTime() - d.getTime()
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      
      if (minutes < 1) return '刚刚'
      if (minutes < 60) return `${minutes}分钟前`
      if (hours < 24) return `${hours}小时前`
      if (days < 7) return `${days}天前`
      return d.toLocaleDateString('zh-CN')
    }
    
    return d.toLocaleDateString('zh-CN')
  },

  // 格式化文件大小
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // 验证邮箱格式
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },



  // 生成唯一ID
  generateId: (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
  },
}

// 导出错误处理工具
export const errorHandler = {
  // 处理API错误
  handleApiError: (error: any): string => {
    if (error.name === 'ApiError') {
      return error.message || 'API请求失败'
    } else if (error.name === 'NetworkError') {
      return '网络连接失败，请检查网络设置'
    } else if (error.name === 'RequestError') {
      return '请求配置错误'
    } else {
      return error.message || '未知错误'
    }
  },

  // 显示错误提示
  showError: (error: any, title: string = '错误') => {
    const message = errorHandler.handleApiError(error)
    console.error(`${title}:`, message)
    
    // 这里可以集成UI组件库的提示组件
    // 例如: message.error(message) 或 toast.error(message)
  },

  // 显示成功提示
  showSuccess: (message: string, title: string = '成功') => {
    console.log(`${title}:`, message)
    
    // 这里可以集成UI组件库的提示组件
    // 例如: message.success(message) 或 toast.success(message)
  },
}

// 导出默认实例
export default {
  hooks,
  utils,
  errorHandler,
  defaultConfig,
}
