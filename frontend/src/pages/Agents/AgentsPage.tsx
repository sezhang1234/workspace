import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllAgents, deleteAgent, type Agent } from '../../services/agentService'
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button as MuiButton,
  Typography
} from '@mui/material'
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
  apiEndpoint: string
}

const AgentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')

  const [agents, setAgents] = useState<Agent[]>([])
  
  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    agentId: string
    agentName: string
  }>({
    open: false,
    agentId: '',
    agentName: ''
  })
  
  // Load agents from service
  useEffect(() => {
    setAgents(getAllAgents())
  }, [])
  
  // Refresh agents when component gains focus
  useEffect(() => {
    const handleFocus = () => {
      setAgents(getAllAgents())
    }
    
    // Also refresh when navigating back to this page
    const handlePopState = () => {
      setTimeout(() => setAgents(getAllAgents()), 100)
    }
    
    window.addEventListener('focus', handleFocus)
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])
  
  // Handle agent deletion
  const handleDeleteAgent = (agentId: string, agentName: string) => {
    setDeleteDialog({
      open: true,
      agentId,
      agentName
    })
  }
  
  // Confirm agent deletion
  const confirmDeleteAgent = () => {
    const { agentId, agentName } = deleteDialog
    const success = deleteAgent(agentId)
    
    if (success) {
      // Update local state immediately for better UX
      setAgents(prev => prev.filter(agent => agent.id !== agentId))
      setDeleteDialog({ open: false, agentId: '', agentName: '' })
      
      // Show success message (you could add a toast notification here)
      console.log(`智能体"${agentName}"删除成功`)
    } else {
      console.error(`删除智能体"${agentName}"失败`)
    }
  }
  
  // Cancel agent deletion
  const cancelDeleteAgent = () => {
    setDeleteDialog({ open: false, agentId: '', agentName: '' })
  }

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
              
              {/* API Endpoint - Only show for published agents */}
              {agent.status !== 'unpublished' && (
                <div className="mb-4">
                  <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">智能体 API</p>
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-mono flex-1 truncate">
                      {agent.apiEndpoint}
                    </code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(agent.apiEndpoint)}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200"
                      title="复制API地址"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
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
                  <button 
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                    onClick={() => handleDeleteAgent(agent.id, agent.name)}
                    title="删除智能体"
                  >
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
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={cancelDeleteAgent}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          color: 'text.primary',
          fontWeight: 800,
          fontSize: '1rem'
        }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: '#fef2f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Trash2 size={16} color="#dc2626" />
          </div>
          确认删除智能体
        </DialogTitle>
        
        <DialogContent sx={{ pb: 2, px: 3 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            您确定要删除智能体 <strong>"{deleteDialog.agentName}"</strong> 吗？此操作无法撤销。
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ pb: 2, px: 3, justifyContent: 'center', gap: 1 }}>
          <MuiButton
            onClick={cancelDeleteAgent}
            variant="outlined"
            size="medium"
          >
            取消
          </MuiButton>
          <MuiButton
            onClick={confirmDeleteAgent}
            variant="contained"
            color="error"
            size="medium"
            autoFocus
          >
            确认删除
          </MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AgentsPage