import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Bot } from 'lucide-react'

const CustomLLMNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div className={`
      relative bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200
      ${selected ? 'ring-2 ring-blue-500 ring-offset-2 shadow-md' : 'hover:shadow-md hover:border-gray-300'}
      min-w-[160px] max-w-[220px]
    `}>
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
            <Bot className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {data.label || 'LLM'}
            </div>
            <div className="text-xs text-gray-500">
              {data.model || 'GPT-4'}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 py-2 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">温度</span>
          <span className="text-xs text-gray-600">{data.temperature || 0.7}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">最大令牌</span>
          <span className="text-xs text-gray-600">{data.maxTokens || 1000}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">状态</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">就绪</span>
          </div>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-white bg-gray-400 hover:bg-gray-500 transition-colors"
        style={{ 
          left: -6,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
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

export default memo(CustomLLMNode)