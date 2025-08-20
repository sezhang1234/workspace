import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Play, Zap, Clock, Bell } from 'lucide-react'

const CustomStartNode: React.FC<NodeProps> = ({ data, selected }) => {
  const getTriggerIcon = (triggerType: string) => {
    switch (triggerType) {
      case 'webhook':
        return <Zap className="w-4 h-4" />
      case 'schedule':
        return <Clock className="w-4 h-4" />
      case 'manual':
        return <Bell className="w-4 h-4" />
      default:
        return <Play className="w-4 h-4" />
    }
  }

  const getTriggerColor = (triggerType: string) => {
    switch (triggerType) {
      case 'webhook':
        return 'text-purple-600 bg-purple-50'
      case 'schedule':
        return 'text-blue-600 bg-blue-50'
      case 'manual':
        return 'text-orange-600 bg-orange-50'
      default:
        return 'text-green-600 bg-green-50'
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
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${getTriggerColor(data.trigger || 'manual')}`}>
            {getTriggerIcon(data.trigger || 'manual')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {data.label || '开始'}
            </div>
            <div className="text-xs text-gray-500">
              {data.trigger === 'webhook' ? 'Webhook触发' : 
               data.trigger === 'schedule' ? '定时触发' : 
               data.trigger === 'manual' ? '手动触发' : '事件触发'}
            </div>
          </div>
        </div>
      </div>

      {/* Input Parameters */}
      <div className="px-3 py-2">
        <div className="text-xs text-gray-500 mb-1">输入参数</div>
        <div className="text-xs text-gray-600">
          {data.inputParameters && data.inputParameters.length > 0 ? (
            <div className="truncate" title={data.inputParameters.map((param: any) => param.name || '未命名参数').join(', ')}>
              {data.inputParameters.map((param: any, index: number) => (
                <span key={index}>
                  {param.name || `参数${index + 1}`}
                  {index < data.inputParameters.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400">无输入参数</span>
          )}
        </div>
      </div>

      {/* Connection handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-white bg-gray-400 hover:bg-gray-500 transition-colors"
        style={{ 
          right: -6,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
    </div>
  )
}

export default memo(CustomStartNode)