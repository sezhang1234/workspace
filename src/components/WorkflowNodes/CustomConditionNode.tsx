import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Settings, GitBranch, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react'

const CustomConditionNode: React.FC<NodeProps> = ({ data, selected }) => {
  const getConditionIcon = (conditionType: string) => {
    switch (conditionType) {
      case 'comparison':
        return <CheckCircle className="w-4 h-4 text-white" />
      case 'validation':
        return <AlertTriangle className="w-4 h-4 text-white" />
      case 'time':
        return <Clock className="w-4 h-4 text-white" />
      case 'custom':
        return <Settings className="w-4 h-4 text-white" />
      default:
        return <GitBranch className="w-4 h-4 text-white" />
    }
  }

  const getConditionColor = (conditionType: string) => {
    switch (conditionType) {
      case 'comparison':
        return 'from-amber-500 to-orange-500'
      case 'validation':
        return 'from-red-500 to-pink-500'
      case 'time':
        return 'from-cyan-500 to-blue-500'
      case 'custom':
        return 'from-purple-500 to-indigo-500'
      default:
        return 'from-yellow-500 to-amber-500'
    }
  }

  const getConditionTypeLabel = (conditionType: string) => {
    switch (conditionType) {
      case 'comparison':
        return '比较条件'
      case 'validation':
        return '验证条件'
      case 'time':
        return '时间条件'
      case 'custom':
        return '自定义条件'
      default:
        return '条件判断'
    }
  }

  return (
    <div className={`
      relative px-6 py-4 shadow-2xl rounded-2xl bg-gradient-to-br ${getConditionColor(data.conditionType || 'default')} 
      border-2 border-white/20 backdrop-blur-sm transition-all duration-300 ease-in-out
      ${selected ? 'scale-105 shadow-3xl ring-4 ring-white/30' : 'hover:scale-102 hover:shadow-3xl'}
      min-w-[220px] max-w-[300px]
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
                {getConditionIcon(data.conditionType || 'default')}
              </div>
              {/* Decision animation */}
              <div className="absolute inset-0 w-10 h-10 bg-white/30 rounded-xl animate-pulse" />
            </div>
            <div>
              <div className="text-lg font-bold text-white drop-shadow-lg">{data.label}</div>
              <div className="text-xs text-white/80 font-medium">
                {getConditionTypeLabel(data.conditionType || 'default')}
              </div>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-xs text-white/80 font-medium">等待判断</span>
          </div>
        </div>

        {/* Condition logic */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
          <div className="text-xs text-white/90 font-medium mb-2">判断逻辑</div>
          <div className="text-xs text-white/70 font-mono bg-white/10 p-2 rounded border border-white/20">
            {data.condition || 'if (condition) { ... }'}
          </div>
        </div>

        {/* Branch paths */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-2 text-center border border-green-500/30">
            <div className="text-xs text-green-200 font-medium">真值路径</div>
            <div className="text-sm font-bold text-green-100">{data.truePath || '继续执行'}</div>
          </div>
          <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-2 text-center border border-red-500/30">
            <div className="text-xs text-red-200 font-medium">假值路径</div>
            <div className="text-sm font-bold text-red-100">{data.falsePath || '跳过执行'}</div>
          </div>
        </div>

        {/* Condition details */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
          <div className="text-xs text-white/90 font-medium mb-2">条件详情</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/70">
              <span>条件类型:</span>
              <span className="capitalize">{data.conditionType || 'default'}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>优先级:</span>
              <span className="capitalize">{data.priority || 'normal'}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>超时时间:</span>
              <span>{data.timeout || 10}s</span>
            </div>
          </div>
        </div>

        {/* Execution stats */}
        <div className="flex items-center justify-between text-xs text-white/80">
          <span>判断次数: {data.evaluationCount || 0}</span>
          <span>最后判断: {data.lastEvaluated || '从未'}</span>
        </div>
      </div>

      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 bg-white border-2 border-white/30 shadow-lg hover:scale-125 transition-transform duration-200"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="true"
        className="w-4 h-4 bg-green-400 border-2 border-white/30 shadow-lg hover:scale-125 transition-transform duration-200"
        style={{ left: '25%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="w-4 h-4 bg-red-400 border-2 border-white/30 shadow-lg hover:scale-125 transition-transform duration-200"
        style={{ left: '75%' }}
      />
      
      {/* Node type badge */}
      <div className="absolute -top-3 -left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-gray-700 shadow-lg">
        条件
      </div>
    </div>
  )
}

export default memo(CustomConditionNode)