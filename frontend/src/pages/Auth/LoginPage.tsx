import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../stores/useAuthStore'
import JiuwenLogo from '../../components/Common/JiuwenLogo'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { AuthService } from '../../services/api/authService'


interface LoginForm {
  email: string
  password: string
}

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoadingLogin, setIsLoadingLogin] = useState(false)
  const [isLoadingRegister, setIsLoadingRegister] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    getValues, // 添加getValues的解构
  } = useForm<LoginForm>()

  // 页面加载时检查是否有保存的凭据
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail')
    const savedPassword = localStorage.getItem('rememberedPassword')
    const savedRemember = localStorage.getItem('rememberMe')
    
    if (savedEmail && savedRemember === 'true') {
      setValue('email', savedEmail)
      setRememberMe(true)
    }
    if (savedPassword && savedRemember === 'true') {
      setValue('password', savedPassword)
    }
  }, [setValue])

  // 处理登录
  const handleLogin = (data: LoginForm) => {
    setIsLoadingLogin(true)


    try {
      // 调用AuthService的login方法
      // const response = await AuthService.login(data)

      login({
        id: '1',
        username: data.email,
        email: data.email,
        avatar: 'https://picsum.photos/200',
        role: 'developer',
        permissions: ['read', 'write', 'admin']
      }, 'mock_jwt_token_' + Date.now())

      // 保存凭据（如果勾选了记住我）
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', data.email)
        localStorage.setItem('rememberedPassword', data.password)
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('rememberedEmail')
        localStorage.removeItem('rememberedPassword')
        localStorage.removeItem('rememberMe')
      }

      // 使用响应数据登录
      navigate('/dashboard')
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: '登录失败，请检查您的邮箱和密码'
      })
    } finally {
      setIsLoadingLogin(false)
    }
  }

  // 处理注册
  const handleRegister = async () => {
    setIsLoadingRegister(true)

    try {
      // 获取表单数据
      const email = getValues('email')
      const password = getValues('password')

      // 验证输入
      if (!email || !password) {
        setError('root', {
          type: 'manual',
          message: '请输入邮箱地址和密码'
        })
        return
      }

      // 调用AuthService的register方法
      await AuthService.register({
        email,
        password
      })

      // 注册成功提示
      setError('root', {
        type: 'manual',
        message: '注册成功！请使用您的账户登录'
      })
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: '注册失败，请稍后重试'
      })
    } finally {
      setIsLoadingRegister(false)
    }
  }

  // 处理表单提交（回车键触发登录）
  const onFormSubmit = (data: LoginForm) => {
    handleLogin(data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 px-4">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 flex items-center justify-center">
              <JiuwenLogo width={64} height={64} />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            欢迎回到 Jiuwen
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            登录您的账户以继续使用智能体开发平台
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onFormSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址
              </label>
              <input
                {...register('email', {
                  required: '请输入邮箱地址',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '请输入有效的邮箱地址'
                  }
                })}
                type="email"
                id="email"
                className="input-field w-full"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative w-full">
                <input
                  {...register('password', {
                    required: '请输入密码',
                    minLength: {
                      value: 6,
                      message: '密码至少需要6个字符'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="input-field w-full pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center w-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{errors.root.message}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                记住我
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                忘记密码？
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoadingLogin}
              className="w-full btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingLogin ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>登录中...</span>
                </div>
              ) : (
                '登录'
              )}
            </button>
          </div>

          <div>
            <button
              type="button"
              disabled={isLoadingRegister}
              onClick={handleRegister}
              className="w-full btn-secondary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingRegister ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>注册中...</span>
                </div>
              ) : (
                '注册'
              )}
            </button>
          </div>
        </form>

        {/* Demo Credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">演示账户</h3>
          <p className="text-xs text-blue-700">
            邮箱: demo@jiuwen.com<br />
            密码: 123456
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage