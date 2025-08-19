import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Zap } from 'lucide-react'

const CustomActionNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-blue-50 border-2 border-blue-200">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 bg-blue-500 flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold text-blue-800">{data.label}</div>
          <div className="text-xs text-blue-600">{data.actionType || '动作'}</div>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500"
      />
    </div>
  )
}

export default memo(CustomActionNode)