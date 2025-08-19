import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { MessageSquare, Bot, Sparkles, Target, Zap, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

const CustomAnswerNode: React.FC<NodeProps> = ({ data, selected }) => {
  const getAnswerIcon = (answerType: string) => {
    switch (answerType) {
      case 'llm_generation':
        return <Bot className="w-4 h-4 text-white" />
      case 'template_based':
        return <MessageSquare className="w-4 h-4 text-white" />
      case 'rule_based':
        return <Target className="w-4 h-4 text-white" />
      case 'hybrid':
        return <Sparkles className="w-4 h-4 text-white" />
      case 'context_aware':
        return <Zap className="w-4 h-4 text-white" />
      default:
        return <MessageSquare className="w-4 h-4 text-white" />
    }
  }

  const getAnswerColor = (answerType: string) => {
    switch (answerType) {
      case 'llm_generation':
        return 'from-indigo-500 to-purple-500'
      case 'template_based':
        return 'from-blue-500 to-cyan-500'
      case 'rule_based':
        return 'from-emerald-500 to-teal-500'
      case 'hybrid':
        return 'from-pink-500 to-rose-500'
      case 'context_aware':
        return 'from-orange-500 to-amber-500'
      default:
        return 'from-slate-500 to-gray-500'
    }
  }

  const getAnswerTypeLabel = (answerType: string) => {
    switch (answerType) {
      case 'llm_generation':
        return 'LLM 生成'
      case 'template_based':
        return '模板生成'
      case 'rule_based':
        return '规则生成'
      case 'hybrid':
        return '混合生成'
      case 'context_aware':
        return '上下文感知'
      default:
        return '答案生成'
    }
  }

  return (
    <div className={`
      relative px-6 py-4 shadow-2xl rounded-2xl bg-gradient-to-br ${getAnswerColor(data.answerType || 'default')} 
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
                {getAnswerIcon(data.answerType || 'default')}
              </div>
              {/* Generation animation */}
              <div className="absolute inset-0 w-10 h-10 bg-white/30 rounded-xl animate-pulse" />
            </div>
            <div>
              <div className="text-lg font-bold text-white drop-shadow-lg">{data.label}</div>
              <div className="text-xs text-white/80 font-medium">
                {getAnswerTypeLabel(data.answerType || 'default')}
              </div>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              data.status === 'generating' ? 'bg-yellow-400 animate-pulse' : 
              data.status === 'completed' ? 'bg-green-400' : 
              data.status === 'error' ? 'bg-red-400' : 'bg-white'
            }`} />
            <span className="text-xs text-white/80 font-medium">
              {data.status === 'generating' ? '生成中' : 
               data.status === 'completed' ? '已完成' : 
               data.status === 'error' ? '生成失败' : '等待执行'}
            </span>
          </div>
        </div>

        {/* Input context */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
          <div className="text-xs text-white/90 font-medium mb-2">输入上下文</div>
          <div className="text-xs text-white/70 font-mono bg-white/10 p-2 rounded border border-white/20">
            {data.inputContext || '用户问题和检索到的知识...'}
          </div>
        </div>

        {/* Generation configuration */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
          <div className="text-xs text-white/90 font-medium mb-2">生成配置</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/70">
              <span>生成类型:</span>
              <span className="capitalize">{data.answerType || 'default'}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>最大长度:</span>
              <span>{data.maxLength || 500}字</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>温度:</span>
              <span>{data.temperature || 0.7}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>超时时间:</span>
              <span>{data.timeout || 60}s</span>
            </div>
          </div>
        </div>

        {/* Generated answer preview */}
        {data.generatedAnswer && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
            <div className="text-xs text-white/90 font-medium mb-2">生成结果</div>
            <div className="text-xs text-white/70 bg-white/10 p-2 rounded border border-white/20 max-h-20 overflow-y-auto">
              {data.generatedAnswer}
            </div>
          </div>
        )}

        {/* Quality metrics */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">相关性</div>
            <div className="text-sm font-bold text-white">{data.relevanceScore || 0}%</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">完整性</div>
            <div className="text-sm font-bold text-white">{data.completenessScore || 0}%</div>
          </div>
        </div>

        {/* Performance metrics */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
          <div className="text-xs text-white/90 font-medium mb-2">性能指标</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/70">
              <span>生成耗时:</span>
              <span>{data.generationTime || 0}ms</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>Token 使用:</span>
              <span>{data.tokensUsed || 0}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>成功率:</span>
              <span>{data.successRate || 100}%</span>
            </div>
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
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 bg-white border-2 border-white/30 shadow-lg hover:scale-125 transition-transform duration-200"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />
      
      {/* Node type badge */}
      <div className="absolute -top-3 -left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-gray-700 shadow-lg">
        答案生成
      </div>
    </div>
  )
}

export default memo(CustomAnswerNode)