import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Play } from 'lucide-react'

const CustomStartNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-green-50 border-2 border-green-200">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 bg-green-500 flex items-center justify-center">
          <Play className="w-4 h-4 text-white" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold text-green-800">{data.label}</div>
          <div className="text-xs text-green-600">{data.trigger || '触发器'}</div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  )
}

export default memo(CustomStartNode)