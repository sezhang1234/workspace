import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Workflow, 
  Plus, 
  Search, 
  Play, 
  Pause, 
  Edit, 
  Trash2,
  MoreVertical,
  Settings,
  Copy,
  Clock,
  CheckCircle,
  AlertCircle,
  PauseCircle
} from 'lucide-react'

interface Workflow {
  id: string
  name: string
  description: string
  status: 'running' | 'stopped' | 'scheduled' | 'error' | 'completed'
  trigger: string
  lastRun: string
  nextRun: string
  successRate: number
  executionTime: string
  nodes: number
  tags: string[]
  createdAt: string
}

const WorkflowsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')

  const workflows: Workflow[] = [
    {
      id: '1',
      name: '订单处理流程',
      description: '自动化订单处理和状态更新，包括库存检查、支付验证和发货通知',
      status: 'running',
      trigger: 'Webhook',
      lastRun: '5分钟前',
      nextRun: '实时',
      successRate: 98.5,
      executionTime: '2.3s',
      nodes: 12,
      tags: ['订单', '自动化', '电商'],
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: '用户反馈分析',
      description: '收集和分析用户反馈数据，自动生成洞察报告和优先级建议',
      status: 'completed',
      trigger: '定时',
      lastRun: '1小时前',
      nextRun: '每天 9:00',
      successRate: 100,
      executionTime: '45s',
      nodes: 8,
      tags: ['分析', '反馈', '报告'],
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      name: '数据同步流程',
      description: '多系统数据同步和备份，确保数据一致性和完整性',
      status: 'scheduled',
      trigger: '定时',
      lastRun: '6小时前',
      nextRun: '每4小时',
      successRate: 95.2,
      executionTime: '5.1s',
      nodes: 15,
      tags: ['同步', '备份', '数据'],
      createdAt: '2024-01-10'
    },
    {
      id: '4',
      name: '营销活动自动化',
      description: '根据用户行为自动触发营销活动，包括邮件、短信和推送通知',
      status: 'running',
      trigger: '事件',
      lastRun: '10分钟前',
      nextRun: '实时',
      successRate: 97.8,
      executionTime: '1.8s',
      nodes: 20,
      tags: ['营销', '自动化', '个性化'],
      createdAt: '2024-01-25'
    },
    {
      id: '5',
      name: '系统监控告警',
      description: '实时监控系统性能指标，异常时自动发送告警通知',
      status: 'running',
      trigger: '实时',
      lastRun: '持续',
      nextRun: '持续',
      successRate: 99.9,
      executionTime: '0.5s',
      nodes: 6,
      tags: ['监控', '告警', '运维'],
      createdAt: '2024-01-08'
    },
    {
      id: '6',
      name: '内容审核流程',
      description: '自动审核用户生成内容，识别不当内容并采取相应措施',
      status: 'error',
      trigger: '事件',
      lastRun: '2小时前',
      nextRun: '暂停',
      successRate: 89.3,
      executionTime: '3.2s',
      nodes: 18,
      tags: ['审核', '内容', '安全'],
      createdAt: '2024-01-18'
    }
  ]

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800'
      case 'stopped': return 'bg-gray-100 text-gray-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return '运行中'
      case 'stopped': return '已停止'
      case 'scheduled': return '已计划'
      case 'error': return '错误'
      case 'completed': return '已完成'
      default: return '未知'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="w-4 h-4" />
      case 'stopped': return <Pause className="w-4 h-4" />
      case 'scheduled': return <Clock className="w-4 h-4" />
      case 'error': return <AlertCircle className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      default: return <PauseCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">工作流管理</h1>
          <p className="text-gray-600">设计、管理和监控您的自动化工作流</p>
        </div>
        <Link
          to="/dashboard/workflows/new"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>创建工作流</span>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索工作流名称、描述或标签..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">所有状态</option>
              <option value="running">运行中</option>
              <option value="stopped">已停止</option>
              <option value="scheduled">已计划</option>
              <option value="error">错误</option>
              <option value="completed">已完成</option>
            </select>
          </div>

          {/* Sort by */}
          <div className="sm:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">按名称排序</option>
              <option value="created">按创建时间排序</option>
              <option value="status">按状态排序</option>
              <option value="successRate">按成功率排序</option>
              <option value="lastRun">按最后运行时间排序</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workflows grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkflows.map((workflow) => (
          <div key={workflow.id} className="card hover:shadow-lg transition-shadow duration-200">
            {/* Workflow header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Workflow className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                  <p className="text-sm text-gray-500">{workflow.trigger}</p>
                </div>
              </div>
              <div className="relative">
                <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">{workflow.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {workflow.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">节点数量</p>
                <p className="text-sm font-medium text-gray-900">{workflow.nodes}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">执行时间</p>
                <p className="text-sm font-medium text-gray-900">{workflow.executionTime}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">成功率</p>
                <p className="text-sm font-medium text-gray-900">{workflow.successRate}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">最后运行</p>
                <p className="text-sm font-medium text-gray-900">{workflow.lastRun}</p>
              </div>
            </div>

            {/* Status and next run */}
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                {getStatusIcon(workflow.status)}
                <span className="ml-1">{getStatusText(workflow.status)}</span>
              </span>
              <div className="text-right">
                <p className="text-xs text-gray-500">下次运行</p>
                <p className="text-sm font-medium text-gray-900">{workflow.nextRun}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                {workflow.status === 'running' ? (
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Pause className="w-4 h-4" />
                  </button>
                ) : (
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Play className="w-4 h-4" />
                  </button>
                )}
                <Link
                  to={`/dashboard/workflows/${workflow.id}`}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredWorkflows.length === 0 && (
        <div className="text-center py-12">
          <Workflow className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到工作流</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? '尝试调整搜索条件或筛选器'
              : '开始创建您的第一个自动化工作流'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Link
              to="/dashboard/workflows/new"
              className="btn-primary"
            >
              创建工作流
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default WorkflowsPage