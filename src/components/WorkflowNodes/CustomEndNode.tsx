import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { CheckCircle, XCircle, AlertTriangle, Clock, Flag, Trophy } from 'lucide-react'

const CustomEndNode: React.FC<NodeProps> = ({ data, selected }) => {
  const getEndIcon = (endType: string) => {
    switch (endType) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />
      case 'error':
        return <XCircle className="w-4 h-4" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />
      case 'timeout':
        return <Clock className="w-4 h-4" />
      case 'manual':
        return <Flag className="w-4 h-4" />
      default:
        return <Trophy className="w-4 h-4" />
    }
  }

  const getEndColor = (endType: string) => {
    switch (endType) {
      case 'success':
        return 'text-green-600 bg-green-50'
      case 'error':
        return 'text-red-600 bg-red-50'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50'
      case 'timeout':
        return 'text-orange-600 bg-orange-50'
      case 'manual':
        return 'text-purple-600 bg-purple-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getEndTypeLabel = (endType: string) => {
    switch (endType) {
      case 'success':
        return '成功完成'
      case 'error':
        return '执行失败'
      case 'warning':
        return '警告完成'
      case 'timeout':
        return '超时结束'
      case 'manual':
        return '手动停止'
      default:
        return '工作流结束'
    }
  }

  return (
    <div className={`
      relative bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200
      ${selected ? 'ring-2 ring-blue-500 ring-offset-2 shadow-md' : 'hover:shadow-md hover:border-gray-300'}
      w-[300px] h-[100px]
    `}>
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getEndColor(data.endType || 'default')}`}>
            {getEndIcon(data.endType || 'default')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {data.label || '结束'}
            </div>
            <div className="text-xs text-gray-500">
              {getEndTypeLabel(data.endType || 'default')}
            </div>
          </div>
        </div>
      </div>

      {/* Output Parameters */}
      <div className="px-3 py-2">
        <div className="text-xs text-gray-500 mb-1">输出参数</div>
        <div className="text-xs text-gray-600">
          {data.outputParameters && data.outputParameters.length > 0 ? (
            <div className="truncate" title={data.outputParameters.map((param: any) => param.name || '未命名参数').join(', ')}>
              {data.outputParameters.map((param: any, index: number) => (
                <span key={index}>
                  {param.name || `参数${index + 1}`}
                  {index < data.outputParameters.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400">无输出参数</span>
          )}
        </div>
      </div>

      {/* Connection handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 border-2 border-white bg-gray-400 hover:bg-[#3B82F6] hover:scale-125 transition-all duration-200 ease-out cursor-crosshair"
        style={{ 
          left: -8,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
    </div>
  )
}

export default memo(CustomEndNode)