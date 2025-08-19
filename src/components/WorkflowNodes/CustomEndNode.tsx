import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { CheckCircle } from 'lucide-react'

const CustomEndNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-red-50 border-2 border-red-200">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 bg-red-500 flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold text-red-800">{data.label}</div>
          <div className="text-xs text-red-600">{data.result || '结果'}</div>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-red-500"
      />
    </div>
  )
}

export default memo(CustomEndNode)