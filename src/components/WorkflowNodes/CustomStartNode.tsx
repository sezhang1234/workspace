import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Play, Zap, Clock, Bell } from 'lucide-react'

const CustomStartNode: React.FC<NodeProps> = ({ data, selected }) => {
  const getTriggerIcon = (triggerType: string) => {
    switch (triggerType) {
      case 'webhook':
        return <Zap className="w-4 h-4 text-white" />
      case 'schedule':
        return <Clock className="w-4 h-4 text-white" />
      case 'manual':
        return <Bell className="w-4 h-4 text-white" />
      default:
        return <Play className="w-4 h-4 text-white" />
    }
  }

  const getTriggerColor = (triggerType: string) => {
    switch (triggerType) {
      case 'webhook':
        return 'from-purple-500 to-pink-500'
      case 'schedule':
        return 'from-blue-500 to-cyan-500'
      case 'manual':
        return 'from-orange-500 to-red-500'
      default:
        return 'from-green-500 to-emerald-500'
    }
  }

  return (
    <div className={`
      relative px-2 py-1.5 shadow-md rounded-lg bg-gradient-to-br ${getTriggerColor(data.trigger || 'manual')} 
      border border-white/20 backdrop-blur-sm transition-all duration-300 ease-in-out
      ${selected ? 'scale-105 shadow-lg ring-1 ring-white/30' : 'hover:scale-102 hover:shadow-md'}
      min-w-[80px] max-w-[120px]
    `}>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg" />
      
      {/* Main content */}
      <div className="relative z-10">
        {/* Header with icon and status */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-1">
            <div className="relative">
              <div className="w-4 h-4 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center border border-white/30">
                {getTriggerIcon(data.trigger || 'manual')}
              </div>
              {/* Pulse animation */}
              <div className="absolute inset-0 w-4 h-4 bg-white/30 rounded animate-ping" />
            </div>
            <div>
              <div className="text-xs font-bold text-white drop-shadow-sm">{data.label}</div>
              <div className="text-[10px] text-white/80 font-medium">
                {data.trigger === 'webhook' ? 'Webhook' : 
                 data.trigger === 'schedule' ? '定时' : 
                 data.trigger === 'manual' ? '手动' : '触发'}
              </div>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center space-x-0.5">
            <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] text-white/80 font-medium">就绪</span>
          </div>
        </div>

        {/* Trigger details */}
        <div className="bg-white/10 backdrop-blur-sm rounded p-1 border border-white/20 mb-1">
          <div className="text-[10px] text-white/90 font-medium mb-0.5">触发条件</div>
          <div className="text-[10px] text-white/70">
            {data.trigger === 'webhook' ? 'HTTP 请求' :
             data.trigger === 'schedule' ? '计划执行' :
             data.trigger === 'manual' ? '手动触发' : '自动触发'}
          </div>
        </div>

        {/* Execution stats */}
        <div className="flex items-center justify-between text-[10px] text-white/80">
          <span>执行: {data.executionCount || 0}</span>
          <span>最后: {data.lastExecuted || '从未'}</span>
        </div>
      </div>

      {/* Connection handles */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 bg-white border border-white/30 shadow-sm hover:scale-125 transition-transform duration-200"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />
      
      {/* Node type badge */}
      <div className="absolute -top-1 -left-1 bg-white/90 backdrop-blur-sm px-1 py-0.5 rounded text-[10px] font-bold text-gray-700 shadow-sm">
        开始
      </div>
    </div>
  )
}

export default memo(CustomStartNode)