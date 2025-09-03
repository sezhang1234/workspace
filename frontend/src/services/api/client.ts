import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { API_CONFIG, HTTP_STATUS, ERROR_TYPES } from './config'
import { ApiResponse, ErrorResponse } from './types'
import { useAuthStore } from '../../stores/useAuthStore'

// 创建axios实例
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
  })

  // 请求拦截器
  client.interceptors.request.use(
    (config) => {
      // 添加认证token
      const token = useAuthStore.getState().token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // 添加请求ID用于追踪
      config.headers['X-Request-ID'] = generateRequestId()

      // 开发环境日志
      if (API_CONFIG.IS_DEV) {
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data,
          headers: config.headers,
        })
      }

      return config
    },
    (error) => {
      console.error('❌ Request Interceptor Error:', error)
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  client.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      // 开发环境日志
      if (API_CONFIG.IS_DEV) {
        console.log('✅ API Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data,
        })
      }

      // 检查业务层面的成功状态
      if (response.data && !response.data.success) {
        const error = new Error(response.data.message || 'API请求失败')
        error.name = 'ApiError'
        return Promise.reject(error)
      }

      return response
    },
    async (error: AxiosError<ErrorResponse>) => {
      // 开发环境日志
      if (API_CONFIG.IS_DEV) {
        console.error('❌ API Response Error:', {
          status: error.response?.status,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
        })
      }

      // 处理401未授权错误 - 尝试刷新token
      if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
        const authStore = useAuthStore.getState()
        if (authStore.token) {
          try {
            // 这里可以添加token刷新逻辑
            // const newToken = await refreshToken()
            // authStore.updateToken(newToken)
            // 重试原请求
            // return client.request(error.config!)
          } catch (refreshError) {
            // 刷新失败，清除认证状态
            authStore.logout()
            return Promise.reject(createApiError(error, ERROR_TYPES.AUTH))
          }
        }
      }

      // 处理其他HTTP错误
      return Promise.reject(createApiError(error, ERROR_TYPES.UNKNOWN))
    }
  )

  return client
}

// 创建API错误
const createApiError = (error: AxiosError<ErrorResponse>, type: string): Error => {
  const apiError = new Error()
  
  if (error.response) {
    // 服务器响应了错误状态码
    const { status, data } = error.response
    
    apiError.name = 'ApiError'
    apiError.message = data?.message || `HTTP ${status}: ${getHttpStatusText(status)}`
    
    // 添加额外信息
    ;(apiError as any).status = status
    ;(apiError as any).code = data?.code
    ;(apiError as any).type = type
    ;(apiError as any).details = data?.details
    ;(apiError as any).validationErrors = data?.validationErrors
  } else if (error.request) {
    // 请求已发出但没有收到响应
    apiError.name = 'NetworkError'
    apiError.message = '网络请求失败，请检查网络连接'
    ;(apiError as any).type = ERROR_TYPES.NETWORK
  } else {
    // 请求配置出错
    apiError.name = 'RequestError'
    apiError.message = error.message || '请求配置错误'
    ;(apiError as any).type = ERROR_TYPES.UNKNOWN
  }

  return apiError
}

// 获取HTTP状态码文本
const getHttpStatusText = (status: number): string => {
  const statusTexts: Record<number, string> = {
    [HTTP_STATUS.BAD_REQUEST]: '请求参数错误',
    [HTTP_STATUS.UNAUTHORIZED]: '未授权访问',
    [HTTP_STATUS.FORBIDDEN]: '禁止访问',
    [HTTP_STATUS.NOT_FOUND]: '资源不存在',
    [HTTP_STATUS.CONFLICT]: '资源冲突',
    [HTTP_STATUS.UNPROCESSABLE_ENTITY]: '请求数据验证失败',
    [HTTP_STATUS.INTERNAL_SERVER_ERROR]: '服务器内部错误',
    [HTTP_STATUS.BAD_GATEWAY]: '网关错误',
    [HTTP_STATUS.SERVICE_UNAVAILABLE]: '服务不可用',
  }
  return statusTexts[status] || '未知错误'
}

// 生成请求ID
const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 创建API客户端实例
export const apiClient = createApiClient()

// 导出axios类型，方便使用
export type { AxiosRequestConfig, AxiosResponse, AxiosError }

// 通用请求方法
export const apiRequest = {
  // GET请求
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then(response => response.data),

  // POST请求
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then(response => response.data),

  // PUT请求
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then(response => response.data),

  // PATCH请求
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config).then(response => response.data),

  // DELETE请求
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then(response => response.data),

  // 文件上传
  upload: <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => response.data),

  // 文件下载
  download: (url: string, filename?: string, config?: AxiosRequestConfig) =>
    apiClient.get(url, {
      ...config,
      responseType: 'blob',
    }).then(response => {
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      return response
    }),
}

// 工具函数
export const apiUtils = {
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
    
    const queryString = apiUtils.buildQueryString(params)
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

  // 延迟函数
  delay: (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms)),

  // 重试函数
  retry: async <T>(
    fn: () => Promise<T>,
    maxRetries: number = API_CONFIG.MAX_RETRIES,
    delay: number = API_CONFIG.RETRY_DELAY
  ): Promise<T> => {
    try {
      return await fn()
    } catch (error) {
      if (maxRetries > 0) {
        await apiUtils.delay(delay)
        return apiUtils.retry(fn, maxRetries - 1, delay * 2)
      }
      throw error
    }
  },
}
