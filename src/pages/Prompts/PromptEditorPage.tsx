import React from 'react'
import { useParams } from 'react-router-dom'
import { MessageSquare, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const PromptEditorPage: React.FC = () => {
  const { id } = useParams()
  const isNew = id === 'new'

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/prompts"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? '创建提示词' : '编辑提示词'}
            </h1>
            <p className="text-gray-600">
              {isNew ? '开始编写您的AI提示词模板' : '修改提示词内容和参数'}
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="card text-center py-12">
        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">提示词编辑器</h3>
        <p className="text-gray-500 mb-6">
          此功能正在开发中，将包含提示词编写、参数配置、版本管理、A/B测试等功能
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
          <span>• 提示词编写</span>
          <span>• 参数配置</span>
          <span>• 版本管理</span>
          <span>• A/B测试</span>
        </div>
      </div>
    </div>
  )
}

export default PromptEditorPage