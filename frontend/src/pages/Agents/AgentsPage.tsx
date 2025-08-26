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
  status: 'active' | 'inactive' | 'error' | 'unpublished'
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
      status: 'inactive',
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
    },
    {
      id: '4',
      name: '智能翻译器',
      description: '多语言翻译智能体，支持实时翻译和语言学习',
      avatar: '🌐',
      status: 'unpublished',
      model: 'Claude-3',
      lastActive: '未激活',
      usageCount: 0,
      tags: ['翻译', '多语言', '学习'],
      createdAt: '2024-01-25'
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
      case 'error': return 'bg-red-100 text-red-800'
      case 'unpublished': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '运行中'
      case 'inactive': return '已停止'
      case 'error': return '异常'
      case 'unpublished': return '未发布'
      default: return '未知'
    }
  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      {/* Page header */}
      <div className="text-center mb-8">

        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 mb-2">
          智能体开发
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          创建、管理和监控您的AI智能体，构建强大的智能助手生态系统
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            <input
              type="text"
              placeholder="搜索智能体名称、描述或标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Status filter */}
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white"
          >
            <option value="all">所有状态</option>
            <option value="active">运行中</option>
            <option value="inactive">已停止</option>
            <option value="error">异常</option>
            <option value="unpublished">未发布</option>
          </select>
        </div>

        {/* Sort by */}
        <div className="sm:w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white"
          >
            <option value="name">按名称排序</option>
            <option value="created">按创建时间排序</option>
            <option value="usage">按使用次数排序</option>
            <option value="lastActive">按最后活跃时间排序</option>
          </select>
        </div>

        {/* Create Agent Button */}
        <Link
          to="/dashboard/agents/new"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>创建智能体</span>
        </Link>
      </div>

      {/* Agents grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent, index) => (
          <div 
            key={agent.id} 
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient top border */}
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
            
            {/* Agent header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{agent.avatar}</div>
                  <div>
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">{agent.model}</p>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{agent.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {agent.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Status and stats */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(agent.status)}`}>
                  {getStatusText(agent.status)}
                </span>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium">使用次数</p>
                  <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-blue-700">
                    {agent.usageCount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Last active */}
              <p className="text-xs text-gray-500 mb-4 font-medium">最后活跃: {agent.lastActive}</p>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {agent.status === 'active' ? (
                    <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
                      <Pause className="w-4 h-4" />
                    </button>
                  ) : (
                    <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200">
                      <Play className="w-4 h-4" />
                    </button>
                  )}
                  <Link
                    to={`/dashboard/agents/${agent.id}`}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredAgents.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 mb-3">
            没有找到智能体
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'all' 
              ? '尝试调整搜索条件或筛选器来找到您需要的智能体'
              : '开始创建您的第一个智能体，构建强大的AI助手生态系统'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Link
              to="/dashboard/agents/new"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>创建智能体</span>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default AgentsPage