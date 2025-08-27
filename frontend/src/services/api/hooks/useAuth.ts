import { useMutation, useQuery, useQueryClient } from 'react-query'
import AuthService from '../authService'
import { useAuthStore } from '../../../stores/useAuthStore'
import { LoginRequest } from '../types'

// 认证相关的React Query hooks

// 用户登录
export const useLogin = () => {
  const queryClient = useQueryClient()
  const { login } = useAuthStore()

  return useMutation(
    (credentials: LoginRequest) => AuthService.login(credentials),
    {
      onSuccess: (response) => {
              if (response.success && response.data) {
        // 登录成功，更新认证状态
        const user = {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          avatar: response.data.user.avatar,
          role: response.data.user.role as 'admin' | 'user' | 'developer',
          permissions: response.data.user.permissions
        }
        login(user, response.data.token)
        
        // 清除相关查询缓存
        queryClient.clear()
        
        // 重新获取用户资料
        queryClient.invalidateQueries(['user', 'profile'])
      }
      },
      onError: (error) => {
        console.error('登录失败:', error)
      },
    }
  )
}

// 用户注册
export const useRegister = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (userData: {
      username: string
      email: string
      password: string
      firstName?: string
      lastName?: string
    }) => AuthService.register(userData),
    {
      onSuccess: () => {
        // 注册成功后可以清除相关缓存
        queryClient.invalidateQueries(['auth'])
      },
      onError: (error) => {
        console.error('注册失败:', error)
      },
    }
  )
}

// 用户登出
export const useLogout = () => {
  const queryClient = useQueryClient()
  const { logout } = useAuthStore()

  return useMutation(
    () => AuthService.logout(),
    {
      onSuccess: () => {
        // 登出成功，清除认证状态
        logout()
        
        // 清除所有查询缓存
        queryClient.clear()
      },
      onError: (error) => {
        console.error('登出失败:', error)
        // 即使API调用失败，也要清除本地状态
        logout()
        queryClient.clear()
      },
    }
  )
}

// 获取用户资料
export const useProfile = () => {
  return useQuery(
    ['user', 'profile'],
    () => AuthService.getProfile(),
    {
      staleTime: 5 * 60 * 1000, // 5分钟内不重新获取
      cacheTime: 10 * 60 * 1000, // 缓存10分钟
      retry: 2,
      retryDelay: 1000,
      onError: (error) => {
        console.error('获取用户资料失败:', error)
      },
    }
  )
}

// 更新用户资料
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation(
    (userData: Partial<{
      id: string
      username: string
      email: string
      firstName?: string
      lastName?: string
      avatar?: string
      role: 'admin' | 'user' | 'developer'
      permissions: string[]
    }>) => AuthService.updateProfile(userData),
    {
      onSuccess: (response) => {
        if (response.success && response.data) {
          // 更新成功后，更新缓存中的用户资料
          queryClient.setQueryData(['user', 'profile'], response)
          
          // 重新获取用户资料
          queryClient.invalidateQueries(['user', 'profile'])
        }
      },
      onError: (error) => {
        console.error('更新用户资料失败:', error)
      },
    }
  )
}

// 修改密码
export const useChangePassword = () => {
  return useMutation(
    (passwordData: {
      currentPassword: string
      newPassword: string
      confirmPassword: string
    }) => AuthService.changePassword(passwordData),
    {
      onError: (error) => {
        console.error('修改密码失败:', error)
      },
    }
  )
}

// 验证token有效性
export const useValidateToken = () => {
  return useQuery(
    ['auth', 'validate'],
    () => AuthService.validateToken(),
    {
      staleTime: 1 * 60 * 1000, // 1分钟内不重新验证
      cacheTime: 2 * 60 * 1000, // 缓存2分钟
      retry: 1,
      retryDelay: 2000,
      onError: (error) => {
        console.error('Token验证失败:', error)
      },
    }
  )
}

// 检查用户权限
export const useCheckPermission = (permission: string) => {
  return useQuery(
    ['auth', 'permission', permission],
    () => AuthService.checkPermission(permission),
    {
      staleTime: 5 * 60 * 1000, // 5分钟内不重新检查
      cacheTime: 10 * 60 * 1000, // 缓存10分钟
      retry: 1,
      retryDelay: 1000,
      onError: (error) => {
        console.error('权限检查失败:', error)
      },
    }
  )
}

// 获取用户角色
export const useUserRole = () => {
  return useQuery(
    ['auth', 'role'],
    () => AuthService.getUserRole(),
    {
      staleTime: 5 * 60 * 1000, // 5分钟内不重新获取
      cacheTime: 10 * 60 * 1000, // 缓存10分钟
      retry: 1,
      retryDelay: 1000,
      onError: (error) => {
        console.error('获取用户角色失败:', error)
      },
    }
  )
}

// 忘记密码
export const useForgotPassword = () => {
  return useMutation(
    (email: string) => AuthService.forgotPassword(email),
    {
      onError: (error) => {
        console.error('忘记密码请求失败:', error)
      },
    }
  )
}

// 重置密码
export const useResetPassword = () => {
  return useMutation(
    (data: { token: string; newPassword: string }) =>
      AuthService.resetPassword(data.token, data.newPassword),
    {
      onError: (error) => {
        console.error('重置密码失败:', error)
      },
    }
  )
}

// 验证邮箱
export const useVerifyEmail = () => {
  return useMutation(
    (token: string) => AuthService.verifyEmail(token),
    {
      onSuccess: () => {
        // 邮箱验证成功后，可以重新获取用户资料
        // 这里可以根据需要添加逻辑
      },
      onError: (error) => {
        console.error('邮箱验证失败:', error)
      },
    }
  )
}

// 重新发送验证邮件
export const useResendVerificationEmail = () => {
  return useMutation(
    (email: string) => AuthService.resendVerificationEmail(email),
    {
      onError: (error) => {
        console.error('重新发送验证邮件失败:', error)
      },
    }
  )
}


