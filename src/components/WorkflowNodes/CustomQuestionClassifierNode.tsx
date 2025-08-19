import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Brain, Target, Zap, Clock, CheckCircle, AlertTriangle, Hash, Tag } from 'lucide-react'

const CustomQuestionClassifierNode: React.FC<NodeProps> = ({ data, selected }) => {
  const getClassifierIcon = (classifierType: string) => {
    switch (classifierType) {
      case 'intent_classification':
        return <Target className="w-4 h-4 text-white" />
      case 'topic_classification':
        return <Hash className="w-4 h-4 text-white" />
      case 'sentiment_analysis':
        return <Brain className="w-4 h-4 text-white" />
      case 'complexity_analysis':
        return <Zap className="w-4 h-4 text-white" />
      case 'multi_label':
        return <Tag className="w-4 h-4 text-white" />
      default:
        return <Brain className="w-4 h-4 text-white" />
    }
  }

  const getClassifierColor = (classifierType: string) => {
    switch (classifierType) {
      case 'intent_classification':
        return 'from-blue-500 to-indigo-500'
      case 'topic_classification':
        return 'from-emerald-500 to-teal-500'
      case 'sentiment_analysis':
        return 'from-pink-500 to-rose-500'
      case 'complexity_analysis':
        return 'from-orange-500 to-amber-500'
      case 'multi_label':
        return 'from-purple-500 to-violet-500'
      default:
        return 'from-slate-500 to-gray-500'
    }
  }

  const getClassifierTypeLabel = (classifierType: string) => {
    switch (classifierType) {
      case 'intent_classification':
        return '意图分类'
      case 'topic_classification':
        return '主题分类'
      case 'sentiment_analysis':
        return '情感分析'
      case 'complexity_analysis':
        return '复杂度分析'
      case 'multi_label':
        return '多标签分类'
      default:
        return '问题分类'
    }
  }

  return (
    <div className={`
      relative px-6 py-4 shadow-2xl rounded-2xl bg-gradient-to-br ${getClassifierColor(data.classifierType || 'default')} 
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
                {getClassifierIcon(data.classifierType || 'default')}
              </div>
              {/* Classification animation */}
              <div className="absolute inset-0 w-10 h-10 bg-white/30 rounded-xl animate-pulse" />
            </div>
            <div>
              <div className="text-lg font-bold text-white drop-shadow-lg">{data.label}</div>
              <div className="text-xs text-white/80 font-medium">
                {getClassifierTypeLabel(data.classifierType || 'default')}
              </div>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              data.status === 'classifying' ? 'bg-yellow-400 animate-pulse' : 
              data.status === 'completed' ? 'bg-green-400' : 
              data.status === 'error' ? 'bg-red-400' : 'bg-white'
            }`} />
            <span className="text-xs text-white/80 font-medium">
              {data.status === 'classifying' ? '分类中' : 
               data.status === 'completed' ? '已完成' : 
               data.status === 'error' ? '分类失败' : '等待执行'}
            </span>
          </div>
        </div>

        {/* Input question */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
          <div className="text-xs text-white/90 font-medium mb-2">输入问题</div>
          <div className="text-xs text-white/70 font-mono bg-white/10 p-2 rounded border border-white/20">
            {data.inputQuestion || '用户输入的问题...'}
          </div>
        </div>

        {/* Classification configuration */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
          <div className="text-xs text-white/90 font-medium mb-2">分类配置</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/70">
              <span>分类类型:</span>
              <span className="capitalize">{data.classifierType || 'default'}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>置信度阈值:</span>
              <span>{data.confidenceThreshold || 0.8}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>最大标签数:</span>
              <span>{data.maxLabels || 5}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>超时时间:</span>
              <span>{data.timeout || 30}s</span>
            </div>
          </div>
        </div>

        {/* Classification results */}
        {data.classificationResults && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
            <div className="text-xs text-white/90 font-medium mb-2">分类结果</div>
            <div className="space-y-2">
              {data.classificationResults.map((result: any, index: number) => (
                <div key={index} className="flex items-center justify-between bg-white/10 p-2 rounded">
                  <span className="text-xs text-white/70">{result.label}</span>
                  <span className="text-xs text-white/90 font-medium">{result.confidence}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Classification metrics */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">置信度</div>
            <div className="text-sm font-bold text-white">{data.topConfidence || 0}%</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">分类耗时</div>
            <div className="text-sm font-bold text-white">{data.classificationTime || 0}ms</div>
          </div>
        </div>

        {/* Model information */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
          <div className="text-xs text-white/90 font-medium mb-2">模型信息</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/70">
              <span>模型名称:</span>
              <span>{data.modelName || 'default'}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>模型版本:</span>
              <span>{data.modelVersion || '1.0.0'}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>准确率:</span>
              <span>{data.accuracy || 95}%</span>
            </div>
          </div>
        </div>

        {/* Performance metrics */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
          <div className="text-xs text-white/90 font-medium mb-2">性能指标</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/70">
              <span>平均响应时间:</span>
              <span>{data.avgResponseTime || 0}ms</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>成功率:</span>
              <span>{data.successRate || 100}%</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>缓存命中率:</span>
              <span>{data.cacheHitRate || 0}%</span>
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
        问题分类
      </div>
    </div>
  )
}

export default memo(CustomQuestionClassifierNode)