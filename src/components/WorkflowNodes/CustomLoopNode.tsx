import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Repeat, RotateCcw, ArrowRight, Hash, Clock, Database, List } from 'lucide-react'

const CustomLoopNode: React.FC<NodeProps> = ({ data, selected }) => {
  const getLoopIcon = (loopType: string) => {
    switch (loopType) {
      case 'for':
        return <Hash className="w-4 h-4 text-white" />
      case 'while':
        return <RotateCcw className="w-4 h-4 text-white" />
      case 'foreach':
        return <List className="w-4 h-4 text-white" />
      case 'do_while':
        return <ArrowRight className="w-4 h-4 text-white" />
      case 'timed':
        return <Clock className="w-4 h-4 text-white" />
      case 'data_driven':
        return <Database className="w-4 h-4 text-white" />
      default:
        return <Repeat className="w-4 h-4 text-white" />
    }
  }

  const getLoopColor = (loopType: string) => {
    switch (loopType) {
      case 'for':
        return 'from-violet-500 to-purple-500'
      case 'while':
        return 'from-cyan-500 to-blue-500'
      case 'foreach':
        return 'from-emerald-500 to-teal-500'
      case 'do_while':
        return 'from-orange-500 to-amber-500'
      case 'timed':
        return 'from-pink-500 to-rose-500'
      case 'data_driven':
        return 'from-indigo-500 to-blue-500'
      default:
        return 'from-purple-500 to-indigo-500'
    }
  }

  const getLoopTypeLabel = (loopType: string) => {
    switch (loopType) {
      case 'for':
        return 'For 循环'
      case 'while':
        return 'While 循环'
      case 'foreach':
        return 'ForEach 循环'
      case 'do_while':
        return 'Do-While 循环'
      case 'timed':
        return '定时循环'
      case 'data_driven':
        return '数据驱动循环'
      default:
        return '循环节点'
    }
  }

  return (
    <div className={`
      relative px-6 py-4 shadow-2xl rounded-2xl bg-gradient-to-br ${getLoopColor(data.loopType || 'default')} 
      border-2 border-white/20 backdrop-blur-sm transition-all duration-300 ease-in-out
      ${selected ? 'scale-105 shadow-3xl ring-4 ring-white/30' : 'hover:scale-102 hover:shadow-3xl'}
      min-w-[240px] max-w-[320px]
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
                {getLoopIcon(data.loopType || 'default')}
              </div>
              {/* Loop animation */}
              <div className="absolute inset-0 w-10 h-10 bg-white/30 rounded-xl animate-pulse" />
            </div>
            <div>
              <div className="text-lg font-bold text-white drop-shadow-lg">{data.label}</div>
              <div className="text-xs text-white/80 font-medium">
                {getLoopTypeLabel(data.loopType || 'default')}
              </div>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              data.status === 'running' ? 'bg-yellow-400 animate-pulse' : 
              data.status === 'completed' ? 'bg-green-400' : 'bg-white'
            }`} />
            <span className="text-xs text-white/80 font-medium">
              {data.status === 'running' ? '循环中' : 
               data.status === 'completed' ? '已完成' : '等待执行'}
            </span>
          </div>
        </div>

        {/* Loop configuration */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
          <div className="text-xs text-white/90 font-medium mb-2">循环配置</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/70">
              <span>循环类型:</span>
              <span className="capitalize">{data.loopType || 'default'}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>最大次数:</span>
              <span>{data.maxIterations || '∞'}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>超时时间:</span>
              <span>{data.timeout || 300}s</span>
            </div>
          </div>
        </div>

        {/* Current iteration info */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">当前迭代</div>
            <div className="text-sm font-bold text-white">{data.currentIteration || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">总迭代</div>
            <div className="text-sm font-bold text-white">{data.totalIterations || 0}</div>
          </div>
        </div>

        {/* Loop condition */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
          <div className="text-xs text-white/90 font-medium mb-2">循环条件</div>
          <div className="text-xs text-white/70 font-mono bg-white/10 p-2 rounded border border-white/20">
            {data.condition || 'while (condition) { ... }'}
          </div>
        </div>

        {/* Loop variables */}
        {data.variables && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
            <div className="text-xs text-white/90 font-medium mb-2">循环变量</div>
            <div className="space-y-1">
              {data.variables.map((variable: string, index: number) => (
                <div key={index} className="text-xs text-white/70 bg-white/10 px-2 py-1 rounded">
                  {variable}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance metrics */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">平均耗时</div>
            <div className="text-sm font-bold text-white">{data.avgIterationTime || 0}ms</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">成功率</div>
            <div className="text-sm font-bold text-white">{data.successRate || 100}%</div>
          </div>
        </div>

        {/* Execution stats */}
        <div className="flex items-center justify-between text-xs text-white/80">
          <span>执行次数: {data.executionCount || 0}</span>
          <span>最后执行: {data.lastExecuted || '从未'}</span>
        </div>
      </div>

      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 bg-white border-2 border-white/30 shadow-lg hover:scale-125 transition-transform duration-200"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />
      
      {/* Loop body handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="loop_body"
        className="w-4 h-4 bg-purple-400 border-2 border-white/30 shadow-lg hover:scale-125 transition-transform duration-200"
        style={{ top: '30%' }}
      />
      
      {/* Loop exit handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="loop_exit"
        className="w-4 h-4 bg-green-400 border-2 border-white/30 shadow-lg hover:scale-125 transition-transform duration-200"
        style={{ top: '70%' }}
      />
      
      {/* Node type badge */}
      <div className="absolute -top-3 -left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-gray-700 shadow-lg">
        循环
      </div>
    </div>
  )
}

export default memo(CustomLoopNode)