import React from 'react'
import { useParams } from 'react-router-dom'
import { Brain, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const AgentEditorPage: React.FC = () => {
  const { id } = useParams()
  const isNew = id === 'new'

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/agents"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? '创建智能体' : '编辑智能体'}
            </h1>
            <p className="text-gray-600">
              {isNew ? '开始构建您的AI智能体' : '修改智能体配置和参数'}
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="card text-center py-12">
        <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">智能体编辑器</h3>
        <p className="text-gray-500 mb-6">
          此功能正在开发中，将包含智能体配置、模型选择、提示词编辑等功能
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
          <span>• 模型配置</span>
          <span>• 提示词管理</span>
          <span>• 参数调优</span>
          <span>• 测试调试</span>
        </div>
      </div>
    </div>
  )
}

export default AgentEditorPage