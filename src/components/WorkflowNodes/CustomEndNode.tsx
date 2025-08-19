import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { CheckCircle, XCircle, AlertTriangle, Clock, Flag, Trophy } from 'lucide-react'

const CustomEndNode: React.FC<NodeProps> = ({ data, selected }) => {
  const getEndIcon = (endType: string) => {
    switch (endType) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-white" />
      case 'error':
        return <XCircle className="w-4 h-4 text-white" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-white" />
      case 'timeout':
        return <Clock className="w-4 h-4 text-white" />
      case 'manual':
        return <Flag className="w-4 h-4 text-white" />
      default:
        return <Trophy className="w-4 h-4 text-white" />
    }
  }

  const getEndColor = (endType: string) => {
    switch (endType) {
      case 'success':
        return 'from-green-500 to-emerald-500'
      case 'error':
        return 'from-red-500 to-rose-500'
      case 'warning':
        return 'from-yellow-500 to-amber-500'
      case 'timeout':
        return 'from-orange-500 to-red-500'
      case 'manual':
        return 'from-purple-500 to-indigo-500'
      default:
        return 'from-gray-500 to-slate-500'
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
      relative px-2 py-1.5 shadow-md rounded-lg bg-gradient-to-br ${getEndColor(data.endType || 'default')} 
      border border-white/20 backdrop-blur-sm transition-all duration-300 ease-in-out
      ${selected ? 'scale-105 shadow-lg ring-1 ring-white/30' : 'hover:scale-102 hover:shadow-md'}
      min-w-[80px] max-w-[120px]
    `}>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg" />
      
      {/* Main content */}
      <div className="relative z-10">
        {/* Simple header with icon and label */}
        <div className="flex items-center justify-center mb-1">
          <div className="relative">
            <div className="w-4 h-4 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center border border-white/30">
              {getEndIcon(data.endType || 'default')}
            </div>
            {/* Completion animation */}
            <div className="absolute inset-0 w-4 h-4 bg-white/30 rounded animate-pulse" />
          </div>
        </div>

        {/* Simple label */}
        <div className="text-center">
          <div className="text-xs font-bold text-white drop-shadow-sm">{data.label}</div>
          <div className="text-[10px] text-white/80 font-medium">
            {getEndTypeLabel(data.endType || 'default')}
          </div>
        </div>
      </div>

      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 bg-white border border-white/30 shadow-sm hover:scale-125 transition-transform duration-200"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />
      
      {/* Node type badge */}
      <div className="absolute -top-1 -left-1 bg-white/90 backdrop-blur-sm px-1 py-0.5 rounded text-[10px] font-bold text-gray-700 shadow-sm">
        结束
      </div>
    </div>
  )
}

export default memo(CustomEndNode)