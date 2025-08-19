import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Zap, Database, MessageSquare, Globe, FileText, Cpu, Bot, Code } from 'lucide-react'

const CustomActionNode: React.FC<NodeProps> = ({ data, selected }) => {
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'api_call':
        return <Globe className="w-4 h-4 text-white" />
      case 'database':
        return <Database className="w-4 h-4 text-white" />
      case 'llm':
        return <Bot className="w-4 h-4 text-white" />
      case 'code':
        return <Code className="w-4 h-4 text-white" />
      case 'message':
        return <MessageSquare className="w-4 h-4 text-white" />
      case 'file':
        return <FileText className="w-4 h-4 text-white" />
      case 'processing':
        return <Cpu className="w-4 h-4 text-white" />
      default:
        return <Zap className="w-4 h-4 text-white" />
    }
  }

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'api_call':
        return 'from-indigo-500 to-purple-500'
      case 'database':
        return 'from-blue-500 to-cyan-500'
      case 'llm':
        return 'from-emerald-500 to-teal-500'
      case 'code':
        return 'from-orange-500 to-red-500'
      case 'message':
        return 'from-pink-500 to-rose-500'
      case 'file':
        return 'from-amber-500 to-yellow-500'
      case 'processing':
        return 'from-slate-500 to-gray-500'
      default:
        return 'from-blue-500 to-indigo-500'
    }
  }

  const getActionTypeLabel = (actionType: string) => {
    switch (actionType) {
      case 'api_call':
        return 'API 调用'
      case 'database':
        return '数据库操作'
      case 'llm':
        return 'AI 模型'
      case 'code':
        return '代码执行'
      case 'message':
        return '消息处理'
      case 'file':
        return '文件操作'
      case 'processing':
        return '数据处理'
      default:
        return '动作节点'
    }
  }

  return (
    <div className={`
      relative px-6 py-4 shadow-2xl rounded-2xl bg-gradient-to-br ${getActionColor(data.actionType || 'default')} 
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
                {getActionIcon(data.actionType || 'default')}
              </div>
              {/* Processing animation */}
              <div className="absolute inset-0 w-10 h-10 bg-white/30 rounded-xl animate-pulse" />
            </div>
            <div>
              <div className="text-lg font-bold text-white drop-shadow-lg">{data.label}</div>
              <div className="text-xs text-white/80 font-medium">
                {getActionTypeLabel(data.actionType || 'default')}
              </div>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${data.status === 'running' ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
            <span className="text-xs text-white/80 font-medium">
              {data.status === 'running' ? '执行中' : '就绪'}
            </span>
          </div>
        </div>

        {/* Action details */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
          <div className="text-xs text-white/90 font-medium mb-2">执行配置</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/70">
              <span>超时时间:</span>
              <span>{data.timeout || 30}s</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>重试次数:</span>
              <span>{data.retries || 3}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>优先级:</span>
              <span className="capitalize">{data.priority || 'normal'}</span>
            </div>
          </div>
        </div>

        {/* Performance metrics */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">平均耗时</div>
            <div className="text-sm font-bold text-white">{data.avgDuration || 0}ms</div>
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
      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 bg-white border-2 border-white/30 shadow-lg hover:scale-125 transition-transform duration-200"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />
      
      {/* Node type badge */}
      <div className="absolute -top-3 -left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-gray-700 shadow-lg">
        动作
      </div>
    </div>
  )
}

export default memo(CustomActionNode)