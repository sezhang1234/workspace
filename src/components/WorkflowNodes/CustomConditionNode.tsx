import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { GitBranch } from 'lucide-react'

const CustomConditionNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div className={`
      relative bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200
      ${selected ? 'ring-2 ring-blue-500 ring-offset-2 shadow-md' : 'hover:shadow-md hover:border-gray-300'}
      min-w-[160px] max-w-[220px]
    `}>
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
            <GitBranch className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {data.label || '条件'}
            </div>
            <div className="text-xs text-gray-500">
              {data.conditionType || '逻辑判断'}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 py-2 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">条件</span>
          <span className="text-xs text-gray-600 truncate max-w-[80px]">
            {data.condition || 'x > 0'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">分支</span>
          <span className="text-xs text-gray-600">True / False</span>
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
        className="w-4 h-4 border-2 border-white bg-gray-400 hover:bg-gray-600 hover:scale-125 transition-all duration-200 ease-out cursor-crosshair"
        style={{ 
          left: -8,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
      
      {/* True branch handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        className="w-4 h-4 border-2 border-white bg-green-500 hover:bg-green-700 hover:scale-125 transition-all duration-200 ease-out cursor-crosshair"
        style={{ 
          right: -8,
          top: '35%',
          transform: 'translateY(-50%)'
        }}
      />
      
      {/* False branch handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        className="w-4 h-4 border-2 border-white bg-red-500 hover:bg-red-700 hover:scale-125 transition-all duration-200 ease-out cursor-crosshair"
        style={{ 
          right: -8,
          top: '65%',
          transform: 'translateY(-50%)'
        }}
      />

      {/* Branch labels */}
      <div className="absolute right-2 top-[30%] text-[10px] text-green-600 font-medium bg-white px-1 rounded">
        True
      </div>
      <div className="absolute right-2 top-[60%] text-[10px] text-red-600 font-medium bg-white px-1 rounded">
        False
      </div>
    </div>
  )
}

export default memo(CustomConditionNode)