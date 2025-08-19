import React, { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Database, FunctionSquare, Calculator, Target, Zap, Clock, CheckCircle, AlertTriangle, Layers, Hash } from 'lucide-react'

const CustomVariableAggregatorNode: React.FC<NodeProps> = ({ data, selected }) => {
  const getAggregatorIcon = (aggregatorType: string) => {
    switch (aggregatorType) {
      case 'sum':
        return <Calculator className="w-4 h-4 text-white" />
      case 'average':
        return <FunctionSquare className="w-4 h-4 text-white" />
      case 'count':
        return <Hash className="w-4 h-4 text-white" />
      case 'min_max':
        return <Target className="w-4 h-4 text-white" />
      case 'custom_function':
        return <Zap className="w-4 h-4 text-white" />
      case 'data_transform':
        return <Layers className="w-4 h-4 text-white" />
      default:
        return <Database className="w-4 h-4 text-white" />
    }
  }

  const getAggregatorColor = (aggregatorType: string) => {
    switch (aggregatorType) {
      case 'sum':
        return 'from-green-500 to-emerald-500'
      case 'average':
        return 'from-blue-500 to-cyan-500'
      case 'count':
        return 'from-purple-500 to-violet-500'
      case 'min_max':
        return 'from-orange-500 to-amber-500'
      case 'custom_function':
        return 'from-pink-500 to-rose-500'
      case 'data_transform':
        return 'from-indigo-500 to-blue-500'
      default:
        return 'from-slate-500 to-gray-500'
    }
  }

  const getAggregatorTypeLabel = (aggregatorType: string) => {
    switch (aggregatorType) {
      case 'sum':
        return '求和聚合'
      case 'average':
        return '平均值聚合'
      case 'count':
        return '计数聚合'
      case 'min_max':
        return '最值聚合'
      case 'custom_function':
        return '自定义函数'
      case 'data_transform':
        return '数据转换'
      default:
        return '变量聚合'
    }
  }

  return (
    <div className={`
      relative px-6 py-4 shadow-2xl rounded-2xl bg-gradient-to-br ${getAggregatorColor(data.aggregatorType || 'default')} 
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
                {getAggregatorIcon(data.aggregatorType || 'default')}
              </div>
              {/* Aggregation animation */}
              <div className="absolute inset-0 w-10 h-10 bg-white/30 rounded-xl animate-pulse" />
            </div>
            <div>
              <div className="text-lg font-bold text-white drop-shadow-lg">{data.label}</div>
              <div className="text-xs text-white/80 font-medium">
                {getAggregatorTypeLabel(data.aggregatorType || 'default')}
              </div>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              data.status === 'processing' ? 'bg-yellow-400 animate-pulse' : 
              data.status === 'completed' ? 'bg-green-400' : 
              data.status === 'error' ? 'bg-red-400' : 'bg-white'
            }`} />
            <span className="text-xs text-white/80 font-medium">
              {data.status === 'processing' ? '处理中' : 
               data.status === 'completed' ? '已完成' : 
               data.status === 'error' ? '处理失败' : '等待执行'}
            </span>
          </div>
        </div>

        {/* Input variables */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
          <div className="text-xs text-white/90 font-medium mb-2">输入变量</div>
          <div className="space-y-1">
            {data.inputVariables && data.inputVariables.map((variable: string, index: number) => (
              <div key={index} className="text-xs text-white/70 bg-white/10 px-2 py-1 rounded">
                {variable}
              </div>
            ))}
            {!data.inputVariables && (
              <div className="text-xs text-white/70 bg-white/10 px-2 py-1 rounded">
                等待输入变量...
              </div>
            )}
          </div>
        </div>

        {/* Aggregation configuration */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
          <div className="text-xs text-white/90 font-medium mb-2">聚合配置</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/70">
              <span>聚合类型:</span>
              <span className="capitalize">{data.aggregatorType || 'default'}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>分组字段:</span>
              <span>{data.groupBy || '无'}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>过滤条件:</span>
              <span>{data.filterCondition || '无'}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>超时时间:</span>
              <span>{data.timeout || 30}s</span>
            </div>
          </div>
        </div>

        {/* Custom function */}
        {data.customFunction && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
            <div className="text-xs text-white/90 font-medium mb-2">自定义函数</div>
            <div className="text-xs text-white/70 font-mono bg-white/10 p-2 rounded border border-white/20">
              {data.customFunction}
            </div>
          </div>
        )}

        {/* Aggregation results */}
        {data.aggregationResults && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
            <div className="text-xs text-white/90 font-medium mb-2">聚合结果</div>
            <div className="space-y-2">
              {Object.entries(data.aggregationResults).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between bg-white/10 p-2 rounded">
                  <span className="text-xs text-white/70">{key}</span>
                  <span className="text-xs text-white/90 font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processing metrics */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">处理记录数</div>
            <div className="text-sm font-bold text-white">{data.recordsProcessed || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">处理耗时</div>
            <div className="text-sm font-bold text-white">{data.processingTime || 0}ms</div>
          </div>
        </div>

        {/* Data quality metrics */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-3">
          <div className="text-xs text-white/90 font-medium mb-2">数据质量</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/70">
              <span>有效数据:</span>
              <span>{data.validRecords || 0}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>缺失数据:</span>
              <span>{data.missingRecords || 0}</span>
            </div>
            <div className="flex justify-between text-xs text-white/70">
              <span>异常数据:</span>
              <span>{data.anomalyRecords || 0}</span>
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
              <span>内存使用:</span>
              <span>{data.memoryUsage || 0}MB</span>
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
        变量聚合
      </div>
    </div>
  )
}

export default memo(CustomVariableAggregatorNode)