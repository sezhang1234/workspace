import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Brain, 
  Plus, 
  Search, 
  Play, 
  Pause, 
  Edit, 
  Trash2,
  MoreVertical,
  Settings,
  Copy
} from 'lucide-react'

interface Agent {
  id: string
  name: string
  description: string
  avatar: string
  status: 'active' | 'inactive' | 'training' | 'error'
  model: string
  lastActive: string
  usageCount: number
  tags: string[]
  createdAt: string
}

const AgentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')

  const agents: Agent[] = [
    {
      id: '1',
      name: '客服助手',
      description: '智能客服机器人，支持多轮对话和问题解答',
      avatar: '🤖',
      status: 'active',
      model: 'GPT-4',
      lastActive: '2小时前',
      usageCount: 1234,
      tags: ['客服', '对话', '多轮'],
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: '数据分析师',
      description: '数据分析智能体，自动生成报告和洞察',
      avatar: '📊',
      status: 'training',
      model: 'Claude-3',
      lastActive: '1天前',
      usageCount: 567,
      tags: ['数据分析', '报告', '洞察'],
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      name: '代码助手',
      description: '编程辅助智能体，代码审查和优化建议',
      avatar: '💻',
      status: 'active',
      model: 'GPT-4',
      lastActive: '3小时前',
      usageCount: 890,
      tags: ['编程', '代码审查', '优化'],
      createdAt: '2024-01-10'
    }
  ]

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'training': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '运行中'
      case 'inactive': return '已停止'
      case 'training': return '训练中'
      case 'error': return '错误'
      default: return '未知'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">智能体管理</h1>
          <p className="text-gray-600">创建、管理和监控您的AI智能体</p>
        </div>
        <Link
          to="/dashboard/agents/new"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>创建智能体</span>
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
                placeholder="搜索智能体名称、描述或标签..."
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
              <option value="active">运行中</option>
              <option value="inactive">已停止</option>
              <option value="training">训练中</option>
              <option value="error">错误</option>
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
              <option value="usage">按使用次数排序</option>
              <option value="lastActive">按最后活跃时间排序</option>
            </select>
          </div>
        </div>
      </div>

      {/* Agents grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className="card hover:shadow-lg transition-shadow duration-200">
            {/* Agent header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{agent.avatar}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                  <p className="text-sm text-gray-500">{agent.model}</p>
                </div>
              </div>
              <div className="relative">
                <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">{agent.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {agent.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Status and stats */}
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                {getStatusText(agent.status)}
              </span>
              <div className="text-right">
                <p className="text-xs text-gray-500">使用次数</p>
                <p className="text-sm font-medium text-gray-900">{agent.usageCount.toLocaleString()}</p>
              </div>
            </div>

            {/* Last active */}
            <p className="text-xs text-gray-400 mb-4">最后活跃: {agent.lastActive}</p>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                {agent.status === 'active' ? (
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Pause className="w-4 h-4" />
                  </button>
                ) : (
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Play className="w-4 h-4" />
                  </button>
                )}
                <Link
                  to={`/dashboard/agents/${agent.id}`}
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
      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到智能体</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? '尝试调整搜索条件或筛选器'
              : '开始创建您的第一个智能体'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Link
              to="/dashboard/agents/new"
              className="btn-primary"
            >
              创建智能体
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default AgentsPage