import { apiRequest } from './client'
import { API_ENDPOINTS } from './config'
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ChangePasswordRequest,
  User,
  ApiResponse,
} from './types'

// 认证服务
export class AuthService {
  // 用户登录
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiRequest.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)
  }

  // 用户注册
  static async register(userData: {
    email: string
    password: string
  }): Promise<ApiResponse<User>> {
    return apiRequest.post<ApiResponse<LoginResponse>>(API_ENDPOINTS.AUTH.REGISTER, userData)
  }

  // 用户登出
  static async logout(): Promise<ApiResponse<null>> {
    return apiRequest.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT)
  }

  // 刷新访问token
  static async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const request: RefreshTokenRequest = { refreshToken }
    return apiRequest.post<RefreshTokenResponse>(API_ENDPOINTS.AUTH.REFRESH, request)
  }

  // 获取用户资料
  static async getProfile(): Promise<ApiResponse<User>> {
    return apiRequest.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.PROFILE)
  }

  // 更新用户资料
  static async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiRequest.put<ApiResponse<User>>(API_ENDPOINTS.AUTH.PROFILE, userData)
  }

  // 修改密码
  static async changePassword(passwordData: ChangePasswordRequest): Promise<ApiResponse<null>> {
    return apiRequest.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData)
  }

  // 验证token有效性
  static async validateToken(): Promise<ApiResponse<{ valid: boolean; user?: User }>> {
    try {
      const profile = await this.getProfile()
      return {
        success: true,
        data: { valid: true, user: profile.data },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        data: { valid: false },
        error: 'Token验证失败',
        timestamp: new Date().toISOString(),
      }
    }
  }

  // 检查用户权限
  static async checkPermission(permission: string): Promise<ApiResponse<{ hasPermission: boolean }>> {
    try {
      const profile = await this.getProfile()
      const hasPermission = profile.data?.permissions?.includes(permission) || false
      
      return {
        success: true,
        data: { hasPermission },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        data: { hasPermission: false },
        error: '权限检查失败',
        timestamp: new Date().toISOString(),
      }
    }
  }

  // 获取用户角色
  static async getUserRole(): Promise<ApiResponse<{ role: string }>> {
    try {
      const profile = await this.getProfile()
      return {
        success: true,
        data: { role: profile.data?.role || 'user' },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        data: { role: 'user' },
        error: '获取用户角色失败',
        timestamp: new Date().toISOString(),
      }
    }
  }

  // 忘记密码
  static async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest.post<ApiResponse<{ message: string }>>('/auth/forgot-password', { email })
  }

  // 重置密码
  static async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest.post<ApiResponse<{ message: string }>>('/auth/reset-password', {
      token,
      newPassword,
    })
  }

  // 验证邮箱
  static async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest.post<ApiResponse<{ message: string }>>('/auth/verify-email', { token })
  }

  // 重新发送验证邮件
  static async resendVerificationEmail(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest.post<ApiResponse<{ message: string }>>('/auth/resend-verification', { email })
  }


}

// 导出认证服务实例
export default AuthService
