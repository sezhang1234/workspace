import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Search, Database, FileText, BookOpen, Brain, Target, Zap, Clock } from 'lucide-react'

const CustomKnowledgeRetrievalNode: React.FC<NodeProps> = ({ data, selected }) => {
  const getRetrievalIcon = (retrievalType: string) => {
    switch (retrievalType) {
      case 'vector_search':
        return <Target className="w-4 h-4 text-white" />
      case 'semantic_search':
        return <Brain className="w-4 h-4 text-white" />
      case 'keyword_search':
        return <Search className="w-4 h-4 text-white" />
      case 'document_search':
        return <FileText className="w-4 h-4 text-white" />
      case 'knowledge_graph':
        return <BookOpen className="w-4 h-4 text-white" />
      case 'hybrid_search':
        return <Zap className="w-4 h-4 text-white" />
      default:
        return <Database className="w-4 h-4 text-white" />
    }
  }

  const getRetrievalColor = (retrievalType: string) => {
    switch (retrievalType) {
      case 'vector_search':
        return 'from-emerald-500 to-teal-500'
      case 'semantic_search':
        return 'from-blue-500 to-indigo-500'
      case 'keyword_search':
        return 'from-orange-500 to-amber-500'
      case 'document_search':
        return 'from-purple-500 to-violet-500'
      case 'knowledge_graph':
        return 'from-pink-500 to-rose-500'
      case 'hybrid_search':
        return 'from-cyan-500 to-blue-500'
      default:
        return 'from-slate-500 to-gray-500'
    }
  }

  const getRetrievalTypeLabel = (retrievalType: string) => {
    switch (retrievalType) {
      case 'vector_search':
        return '向量搜索'
      case 'semantic_search':
        return '语义搜索'
      case 'keyword_search':
        return '关键词搜索'
      case 'document_search':
        return '文档搜索'
      case 'knowledge_graph':
        return '知识图谱'
      case 'hybrid_search':
        return '混合搜索'
      default:
        return '知识检索'
    }
  }

  return (
    <div className={`
      relative px-6 py-4 shadow-2xl rounded-2xl bg-gradient-to-br ${getRetrievalColor(data.retrievalType || 'default')} 
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
                {getRetrievalIcon(data.retrievalType || 'default')}
              </div>
              {/* Search animation */}
              <div className="absolute inset-0 w-10 h-10 bg-white/30 rounded-xl animate-pulse" />
            </div>
            <div>
              <div className="text-lg font-bold text-white drop-shadow-lg">{data.label}</div>
              <div className="text-xs text-white/80 font-medium">
                {getRetrievalTypeLabel(data.retrievalType || 'default')}
              </div>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              data.status === 'searching' ? 'bg-yellow-400 animate-pulse' : 
              data.status === 'completed' ? 'bg-green-400' : 'bg-white'
            }`} />
            <span className="text-xs text-white/80 font-medium">
              {data.status === 'searching' ? '搜索中' : 
               data.status === 'completed' ? '已完成' : '等待执行'}
            </span>
          </div>
        </div>

        {/* Query information */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
          <div className="text-xs text-white/90 font-medium mb-2">查询信息</div>
          <div className="text-xs text-white/70 font-mono bg-white/10 p-2 rounded border border-white/20">
            {data.query || '用户查询内容...'}
          </div>
        </div>

        {/* Search configuration */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
          <div className="text-xs text-white/90 font-medium mb-2">搜索配置</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/70">
              <span>搜索类型:</span>
              <span className="capitalize">{data.retrievalType || 'default'}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>最大结果数:</span>
              <span>{data.maxResults || 10}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>相似度阈值:</span>
              <span>{data.similarityThreshold || 0.8}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>超时时间:</span>
              <span>{data.timeout || 30}s</span>
            </div>
          </div>
        </div>

        {/* Knowledge sources */}
        {data.sources && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
            <div className="text-xs text-white/90 font-medium mb-2">知识源</div>
            <div className="space-y-1">
              {data.sources.map((source: string, index: number) => (
                <div key={index} className="text-xs text-white/70 bg-white/10 px-2 py-1 rounded">
                  {source}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search results summary */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">找到结果</div>
            <div className="text-sm font-bold text-white">{data.resultsFound || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">搜索耗时</div>
            <div className="text-sm font-bold text-white">{data.searchTime || 0}ms</div>
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
        知识检索
      </div>
    </div>
  )
}

export default memo(CustomKnowledgeRetrievalNode)