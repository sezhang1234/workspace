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
      relative px-4 py-3 shadow-xl rounded-xl bg-gradient-to-br ${getTriggerColor(data.trigger || 'manual')} 
      border-2 border-white/20 backdrop-blur-sm transition-all duration-300 ease-in-out
      ${selected ? 'scale-105 shadow-2xl ring-2 ring-white/30' : 'hover:scale-102 hover:shadow-xl'}
      min-w-[160px] max-w-[220px]
    `}>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
      
      {/* Main content */}
      <div className="relative z-10">
        {/* Header with icon and status */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                {getTriggerIcon(data.trigger || 'manual')}
              </div>
              {/* Pulse animation */}
              <div className="absolute inset-0 w-8 h-8 bg-white/30 rounded-lg animate-ping" />
            </div>
            <div>
              <div className="text-sm font-bold text-white drop-shadow-lg">{data.label}</div>
              <div className="text-xs text-white/80 font-medium">
                {data.trigger === 'webhook' ? 'Webhook 触发器' : 
                 data.trigger === 'schedule' ? '定时触发器' : 
                 data.trigger === 'manual' ? '手动触发器' : '触发器'}
              </div>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-xs text-white/80 font-medium">就绪</span>
          </div>
        </div>

        {/* Trigger details */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20 mb-2">
          <div className="text-xs text-white/90 font-medium mb-1">触发条件</div>
          <div className="text-xs text-white/70">
            {data.trigger === 'webhook' ? '等待 HTTP 请求' :
             data.trigger === 'schedule' ? '按计划执行' :
             data.trigger === 'manual' ? '用户手动触发' : '自动触发'}
          </div>
        </div>

        {/* Execution stats */}
        <div className="flex items-center justify-between text-xs text-white/80">
          <span>执行: {data.executionCount || 0}</span>
          <span>最后: {data.lastExecuted || '从未'}</span>
        </div>
      </div>

      {/* Connection handles */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-white/30 shadow-lg hover:scale-125 transition-transform duration-200"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />
      
      {/* Node type badge */}
      <div className="absolute -top-2 -left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-gray-700 shadow-lg">
        开始
      </div>
    </div>
  )
}

export default memo(CustomStartNode)