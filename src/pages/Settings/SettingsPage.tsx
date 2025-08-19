import React, { useState } from 'react'
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Database, 
  Globe,
  Palette,
  Key,
  Users,
  Zap,
  Save,
  X
} from 'lucide-react'

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)

  const tabs = [
    { id: 'general', name: '通用设置', icon: Settings },
    { id: 'profile', name: '个人资料', icon: User },
    { id: 'security', name: '安全设置', icon: Shield },
    { id: 'notifications', name: '通知设置', icon: Bell },
    { id: 'models', name: '模型配置', icon: Database },
    { id: 'appearance', name: '外观设置', icon: Palette },
    { id: 'api', name: 'API设置', icon: Key },
    { id: 'team', name: '团队管理', icon: Users },
    { id: 'performance', name: '性能设置', icon: Zap }
  ]

  const handleSave = async () => {
    setIsSaving(true)
    // 模拟保存操作
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">平台设置</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              平台名称
            </label>
            <input
              type="text"
              defaultValue="Jiuwen Agent Studio"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              平台描述
            </label>
            <textarea
              rows={3}
              defaultValue="专业的LLM智能体开发和管理平台"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              时区设置
            </label>
            <select className="input-field">
              <option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</option>
              <option value="UTC">UTC (UTC+0)</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              语言设置
            </label>
            <select className="input-field">
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">功能开关</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">启用工作流功能</p>
              <p className="text-sm text-gray-500">允许用户创建和管理工作流</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">启用提示词管理</p>
              <p className="text-sm text-gray-500">允许用户创建和管理提示词模板</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">启用团队协作</p>
              <p className="text-sm text-gray-500">允许多用户协作开发智能体</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">密码设置</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              当前密码
            </label>
            <input
              type="password"
              placeholder="输入当前密码"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              新密码
            </label>
            <input
              type="password"
              placeholder="输入新密码"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              确认新密码
            </label>
            <input
              type="password"
              placeholder="再次输入新密码"
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">安全选项</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">启用双因素认证</p>
              <p className="text-sm text-gray-500">使用手机验证码或认证器应用</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">会话超时</p>
              <p className="text-sm text-gray-500">自动登出空闲用户</p>
            </div>
            <select className="input-field w-32">
              <option value="30">30分钟</option>
              <option value="60">1小时</option>
              <option value="120">2小时</option>
              <option value="480">8小时</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderModelSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">默认模型配置</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              默认LLM模型
            </label>
            <select className="input-field">
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="claude-3">Claude-3</option>
              <option value="gemini-pro">Gemini Pro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              最大Token限制
            </label>
            <input
              type="number"
              defaultValue="4096"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              温度设置
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              defaultValue="0.7"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>保守 (0.0)</span>
              <span>平衡 (0.7)</span>
              <span>创意 (2.0)</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">API配置</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              placeholder="sk-..."
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anthropic API Key
            </label>
            <input
              type="password"
              placeholder="sk-ant-..."
              className="input-field"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings()
      case 'security':
        return renderSecuritySettings()
      case 'models':
        return renderModelSettings()
      default:
        return (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">功能开发中</h3>
            <p className="text-gray-500">此功能正在开发中，敬请期待</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
          <p className="text-gray-600">配置平台参数和个性化选项</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-secondary flex items-center space-x-2">
            <X className="w-4 h-4" />
            <span>重置</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? '保存中...' : '保存设置'}</span>
          </button>
        </div>
      </div>

      {/* Settings tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage