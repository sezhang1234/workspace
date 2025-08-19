import React from 'react'
import { useParams } from 'react-router-dom'
import { Workflow, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const WorkflowEditorPage: React.FC = () => {
  const { id } = useParams()
  const isNew = id === 'new'

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/workflows"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? '创建工作流' : '编辑工作流'}
            </h1>
            <p className="text-gray-600">
              {isNew ? '使用可视化编辑器设计自动化工作流' : '修改工作流配置和节点'}
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="card text-center py-12">
        <Workflow className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">工作流编辑器</h3>
        <p className="text-gray-500 mb-6">
          此功能正在开发中，将包含可视化工作流设计器、节点配置、流程编排等功能
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
          <span>• 拖拽式设计</span>
          <span>• 节点配置</span>
          <span>• 流程编排</span>
          <span>• 执行监控</span>
        </div>
      </div>
    </div>
  )
}

export default WorkflowEditorPage