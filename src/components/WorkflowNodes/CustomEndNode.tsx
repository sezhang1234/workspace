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
      relative px-6 py-4 shadow-2xl rounded-2xl bg-gradient-to-br ${getEndColor(data.endType || 'default')} 
      border-2 border-white/20 backdrop-blur-sm transition-all duration-300 ease-in-out
      ${selected ? 'scale-105 shadow-3xl ring-4 ring-white/30' : 'hover:scale-102 hover:shadow-3xl'}
      min-w-[200px] max-w-[280px]
    `}>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
      
      {/* Main content */}
      <div className="relative z-10">
        {/* Header with icon and status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                {getEndIcon(data.endType || 'default')}
              </div>
              {/* Completion animation */}
              <div className="absolute inset-0 w-10 h-10 bg-white/30 rounded-xl animate-pulse" />
            </div>
            <div>
              <div className="text-lg font-bold text-white drop-shadow-lg">{data.label}</div>
              <div className="text-xs text-white/80 font-medium">
                {getEndTypeLabel(data.endType || 'default')}
              </div>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              data.endType === 'success' ? 'bg-green-400' : 
              data.endType === 'error' ? 'bg-red-400' : 
              data.endType === 'warning' ? 'bg-yellow-400' : 'bg-white'
            }`} />
            <span className="text-xs text-white/80 font-medium">
              {data.endType === 'success' ? '已完成' : 
               data.endType === 'error' ? '已失败' : 
               data.endType === 'warning' ? '已警告' : '已结束'}
            </span>
          </div>
        </div>

        {/* Completion details */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
          <div className="text-xs text-white/90 font-medium mb-2">完成详情</div>
          <div className="text-xs text-white/70">
            {data.description || '工作流执行完成'}
          </div>
        </div>

        {/* Final results */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">执行状态</div>
            <div className="text-sm font-bold text-white capitalize">
              {data.endType || 'completed'}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">总耗时</div>
            <div className="text-sm font-bold text-white">{data.totalDuration || 0}ms</div>
          </div>
        </div>

        {/* Output summary */}
        {data.output && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
            <div className="text-xs text-white/90 font-medium mb-2">输出结果</div>
            <div className="text-xs text-white/70 font-mono bg-white/10 p-2 rounded border border-white/20 truncate">
              {data.output}
            </div>
          </div>
        )}

        {/* Execution summary */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
          <div className="text-xs text-white/90 font-medium mb-2">执行统计</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/70">
              <span>总节点数:</span>
              <span>{data.totalNodes || 0}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>成功节点:</span>
              <span>{data.successNodes || 0}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>失败节点:</span>
              <span>{data.failedNodes || 0}</span>
            </div>
          </div>
        </div>

        {/* Execution stats */}
        <div className="flex items-center justify-between text-xs text-white/80">
          <span>完成时间: {data.completedAt || '刚刚'}</span>
          <span>执行次数: {data.executionCount || 1}</span>
        </div>
      </div>

      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 bg-white border-2 border-white/30 shadow-lg hover:scale-125 transition-transform duration-200"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />
      
      {/* Node type badge */}
      <div className="absolute -top-3 -left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-gray-700 shadow-lg">
        结束
      </div>
    </div>
  )
}

export default memo(CustomEndNode)