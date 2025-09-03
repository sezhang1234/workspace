import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Workflow as WorkflowIcon, 
  Plus, 
  Search, 
  Play, 
  Pause, 
  Edit, 
  Trash2,
  MoreVertical,
  Copy
} from 'lucide-react'
import { getAllWorkflows, deleteWorkflow, type Workflow } from '../../services/workflowService'
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button as MuiButton,
  Typography,
  Alert
} from '@mui/material'

const WorkflowsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const [sortBy, setSortBy] = useState<string>('name')
  const [workflows, setWorkflows] = useState<Workflow[]>(getAllWorkflows())
  
  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    workflowId: string
    workflowName: string
  }>({
    open: false,
    workflowId: '',
    workflowName: ''
  })

  // Refresh workflows list
  const refreshWorkflows = () => {
    setWorkflows(getAllWorkflows())
  }

  // Handle workflow deletion
  const handleDeleteWorkflow = (workflowId: string, workflowName: string) => {
    setDeleteDialog({
      open: true,
      workflowId,
      workflowName
    })
  }

  // Confirm workflow deletion
  const confirmDeleteWorkflow = () => {
    const { workflowId, workflowName } = deleteDialog
    const success = deleteWorkflow(workflowId)
    
    if (success) {
      // Update local state immediately for better UX
      setWorkflows(prev => prev.filter(workflow => workflow.id !== workflowId))
      setDeleteDialog({ open: false, workflowId: '', workflowName: '' })
      
      // Show success message (you could add a toast notification here)
      console.log(`工作流"${workflowName}"删除成功`)
    } else {
      console.error(`删除工作流"${workflowName}"失败`)
    }
  }

  // Cancel workflow deletion
  const cancelDeleteWorkflow = () => {
    setDeleteDialog({ open: false, workflowId: '', workflowName: '' })
  }

  // Refresh workflows when returning from canvas
  const location = useLocation()
  useEffect(() => {
    refreshWorkflows()
  }, [location.pathname])

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesSearch
  })



  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      {/* Page header */}
      <div className="text-center mb-8">

        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 mb-2">
          工作流编排
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          设计、管理和监控您的自动化工作流，构建高效的业务流程
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
              placeholder="搜索工作流名称、描述或标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>
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
            <option value="lastRun">按最后运行时间排序</option>
          </select>
        </div>

        {/* Create Workflow Button */}
        <Link
          to="/dashboard/workflows/new"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>创建工作流</span>
        </Link>
      </div>

      {/* Workflows grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkflows.map((workflow, index) => (
          <div 
            key={workflow.id} 
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient top border */}
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
            
            {/* Workflow header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-blue-200">
                    <WorkflowIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">
                      {workflow.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">{workflow.trigger}</p>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{workflow.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {workflow.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">节点数量</p>
                  <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-blue-700">
                    {workflow.nodes}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">最后运行</p>
                  <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-blue-700">
                    {workflow.lastRun}
                  </p>
                </div>
              </div>


            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {workflow.status === 'running' ? (
                    <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
                      <Pause className="w-4 h-4" />
                    </button>
                  ) : (
                    <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200">
                      <Play className="w-4 h-4" />
                    </button>
                  )}
                  <Link
                    to={`/dashboard/workflows/editor?id=${workflow.id}`}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                    onClick={() => handleDeleteWorkflow(workflow.id, workflow.name)}
                    title="删除工作流"
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
      {filteredWorkflows.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <WorkflowIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 mb-3">
            没有找到工作流
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            {searchTerm 
              ? '尝试调整搜索条件来找到您需要的工作流'
              : '开始创建您的第一个自动化工作流，构建高效的业务流程'
            }
          </p>
          {!searchTerm && (
            <Link
              to="/dashboard/workflows/new"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>创建工作流</span>
            </Link>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={cancelDeleteWorkflow}
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
          确认删除工作流
        </DialogTitle>
        
        <DialogContent sx={{ pb: 2, px: 3 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            您确定要删除工作流 <strong>"{deleteDialog.workflowName}"</strong> 吗？此操作无法撤销。
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ pb: 2, px: 3, justifyContent: 'center', gap: 1 }}>
          <MuiButton
            onClick={cancelDeleteWorkflow}
            variant="outlined"
            size="medium"
          >
            取消
          </MuiButton>
          <MuiButton
            onClick={confirmDeleteWorkflow}
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

export default WorkflowsPage