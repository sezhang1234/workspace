import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Zap } from 'lucide-react'

const CustomActionNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div className={`
      relative px-4 py-3 shadow-lg rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 
      border border-white/20 transition-all duration-200 ease-in-out
      ${selected ? 'ring-2 ring-blue-300 shadow-xl' : 'hover:shadow-md'}
      min-w-[120px] max-w-[160px]
    `}>
      {/* Main content */}
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div className="text-sm font-medium text-white truncate">
          {data.label || '动作节点'}
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-blue-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-blue-500"
      />
    </div>
  )
}

export default memo(CustomActionNode)