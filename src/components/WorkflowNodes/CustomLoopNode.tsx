import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Repeat } from 'lucide-react'

const CustomLoopNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div className={`
      relative bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200
      ${selected ? 'ring-2 ring-blue-500 ring-offset-2 shadow-md' : 'hover:shadow-md hover:border-gray-300'}
      min-w-[160px] max-w-[220px]
    `}>
      {/* Main content */}
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
          <Repeat className="w-4 h-4 text-white" />
        </div>
        <div className="text-sm font-medium text-white truncate">
          {data.label || '循环节点'}
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-purple-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-purple-500"
      />
    </div>
  )
}

export default memo(CustomLoopNode)