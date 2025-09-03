// API配置文件
export const API_CONFIG = {
  // 基础API URL - 根据环境配置
  BASE_URL: 'http://localhost:8000/api/v1',
  
  // 请求超时时间（毫秒）
  TIMEOUT: 30000,
  
  // 重试次数
  MAX_RETRIES: 3,
  
  // 重试延迟（毫秒）
  RETRY_DELAY: 1000,
  
  // 请求头配置
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // 认证相关配置
  AUTH: {
    TOKEN_KEY: 'auth_token',
    REFRESH_TOKEN_KEY: 'refresh_token',
    TOKEN_EXPIRY_KEY: 'token_expiry',
  },
  
  // 分页配置
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
  
  // 缓存配置
  CACHE: {
    DEFAULT_TTL: 5 * 60 * 1000, // 5分钟
    MAX_CACHE_SIZE: 100,
  },
  
  // 环境配置
  IS_DEV: true,
  IS_PROD: false,
  IS_TEST: false,
}

// API端点常量
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    ACCOUNT: 'auth/me',
  },
  
  // 用户管理
  USERS: {
    LIST: '/users',
    DETAIL: '/users/:id',
    CREATE: '/users',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
    ROLES: '/users/roles',
    PERMISSIONS: '/users/permissions',
  },
  
  // 工作流管理
  WORKFLOWS: {
    LIST: '/workflows',
    DETAIL: '/workflows/:id',
    CREATE: '/workflows',
    UPDATE: '/workflows/:id',
    DELETE: '/workflows/:id',
    EXECUTE: '/workflows/:id/execute',
    STATUS: '/workflows/:id/status',
    LOGS: '/workflows/:id/logs',
    EXPORT: '/workflows/:id/export',
    IMPORT: '/workflows/import',
  },
  
  // 代理管理
  AGENTS: {
    LIST: '/agents',
    DETAIL: '/agents/:id',
    CREATE: '/agents',
    UPDATE: '/agents/:id',
    DELETE: '/agents/:id',
    EXECUTE: '/agents/:id/execute',
    TRAIN: '/agents/:id/train',
    DEPLOY: '/agents/:id/deploy',
  },
  
  // 模型管理
  MODELS: {
    LIST: '/models',
    DETAIL: '/models/:id',
    CREATE: '/models',
    UPDATE: '/models/:id',
    DELETE: '/models/:id',
    TEST: '/models/:id/test',
    METRICS: '/models/:id/metrics',
  },
  

  
  // 系统设置
  SETTINGS: {
    SYSTEM: '/settings/system',
    SECURITY: '/settings/security',
    NOTIFICATIONS: '/settings/notifications',
    INTEGRATIONS: '/settings/integrations',
  },
  
  // 文件管理
  FILES: {
    UPLOAD: '/files/upload',
    DOWNLOAD: '/files/:id/download',
    DELETE: '/files/:id',
    LIST: '/files',
    METADATA: '/files/:id/metadata',
  },
  
  // 日志管理
  LOGS: {
    SYSTEM: '/logs/system',
    WORKFLOW: '/logs/workflow',
    USER: '/logs/user',
    ERROR: '/logs/error',
    AUDIT: '/logs/audit',
  }
}

// HTTP状态码常量
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const

// 错误类型常量
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  AUTH: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  SERVER: 'SERVER_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
} as const
