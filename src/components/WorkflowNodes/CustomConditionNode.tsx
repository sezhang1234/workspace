import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Settings } from 'lucide-react'

const CustomConditionNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-yellow-50 border-2 border-yellow-200">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 bg-yellow-500 flex items-center justify-center">
          <Settings className="w-4 h-4 text-white" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold text-yellow-800">{data.label}</div>
          <div className="text-xs text-yellow-600">{data.conditionType || '条件'}</div>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-yellow-500"
      />
      <Handle
        type="source"
        position={Position.Top}
        className="w-3 h-3 bg-yellow-500"
        id="true"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-yellow-500"
        id="false"
      />
    </div>
  )
}

export default memo(CustomConditionNode)