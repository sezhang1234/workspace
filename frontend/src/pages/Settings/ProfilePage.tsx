import React, { useState } from 'react'
import { useAuthStore } from '../../stores/useAuthStore'
import { 
  Save,
  Camera,
  Edit3,
  Shield,
  Bell,
  Globe
} from 'lucide-react'

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: '张',
    lastName: '三',
    phone: '+86 138 0013 8000',
    location: '北京市朝阳区',
    bio: '热爱AI技术，专注于智能体开发。拥有5年以上的软件开发经验，擅长Python、JavaScript和机器学习。',
    website: 'https://github.com/jiuwen',
    company: 'Jiuwen科技有限公司',
    position: '高级AI工程师',
    skills: ['Python', 'JavaScript', 'React', 'Machine Learning', 'LLM', 'AI Agent'],
    interests: ['人工智能', '机器学习', '自然语言处理', '智能体开发', '开源项目']
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 更新用户信息
      updateUser({
        username: formData.username,
        email: formData.email
      })
      
      setIsEditing(false)
    } catch (error) {
      console.error('保存失败:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      firstName: '张',
      lastName: '三',
      phone: '+86 138 0013 8000',
      location: '北京市朝阳区',
      bio: '热爱AI技术，专注于智能体开发。拥有5年以上的软件开发经验，擅长Python、JavaScript和机器学习。',
              website: 'https://github.com/jiuwen',
        company: 'Jiuwen科技有限公司',
      position: '高级AI工程师',
      skills: ['Python', 'JavaScript', 'React', 'Machine Learning', 'LLM', 'AI Agent'],
      interests: ['人工智能', '机器学习', '自然语言处理', '智能体开发', '开源项目']
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      {/* Page header */}
      <div className="text-center mb-8">

        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 mb-2">
          个人资料
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          管理您的个人信息和账户设置
        </p>
        <div className="flex items-center justify-end space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-700 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition-all duration-200 border border-gray-300 hover:border-gray-400"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? '保存中...' : '保存'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>编辑资料</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            {/* Avatar */}
            <div className="relative mb-6">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gradient-to-r from-blue-100 to-indigo-100 border-4 border-white shadow-lg">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                  alt={user?.username}
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Basic info */}
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800 mb-1">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-gray-600 mb-2 font-medium">{formData.position}</p>
            <p className="text-sm text-gray-500 mb-6">{formData.company}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">12</p>
                <p className="text-xs text-gray-500 font-medium">智能体</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">8</p>
                <p className="text-xs text-gray-500 font-medium">工作流</p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <button className="w-full text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-2 rounded-lg transition-all duration-200 font-medium">
                <Shield className="w-4 h-4 inline mr-2" />
                安全设置
              </button>
              <button className="w-full text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-2 rounded-lg transition-all duration-200 font-medium">
                <Bell className="w-4 h-4 inline mr-2" />
                通知设置
              </button>
              <button className="w-full text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-2 rounded-lg transition-all duration-200 font-medium">
                <Globe className="w-4 h-4 inline mr-2" />
                隐私设置
              </button>
            </div>
          </div>
        </div>

        {/* Profile content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">基本信息</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  用户名
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  姓
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  名
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  电话
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  位置
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">职业信息</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  公司
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  职位
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  个人网站
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">个人简介</h3>
            </div>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
              placeholder="介绍一下您自己..."
            />
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">技能标签</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all duration-200"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => {
                        const newSkills = formData.skills.filter((_, i) => i !== index)
                        handleInputChange('skills', JSON.stringify(newSkills))
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <button className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-gray-100 to-blue-100 text-gray-700 border border-gray-200 hover:from-gray-200 hover:to-blue-200 transition-all duration-200">
                  + 添加技能
                </button>
              )}
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">兴趣爱好</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 hover:from-green-200 hover:to-emerald-200 transition-all duration-200"
                >
                  {interest}
                  {isEditing && (
                    <button
                      onClick={() => {
                        const newInterests = formData.interests.filter((_, i) => i !== index)
                        handleInputChange('interests', JSON.stringify(newInterests))
                      }}
                      className="ml-2 text-green-600 hover:text-green-800 hover:bg-green-200 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <button className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-gray-100 to-green-100 text-gray-700 border border-gray-200 hover:from-gray-200 hover:to-green-200 transition-all duration-200">
                  + 添加兴趣
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage