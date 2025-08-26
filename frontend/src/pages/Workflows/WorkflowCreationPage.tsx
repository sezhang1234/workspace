import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Plus
} from 'lucide-react'
import { 
  Button, 
  TextField, 
  Typography,
  Chip,
  Card
} from '@mui/material'
import { addWorkflow } from '../../services/workflowService'

interface WorkflowFormData {
  name: string
  description: string
  trigger: string
  tags: string[]
}

const WorkflowCreationPage: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<WorkflowFormData>({
    name: '',
    description: '',
    trigger: 'schedule',
    tags: []
  })

  const [newTag, setNewTag] = useState('')

  const handleInputChange = (field: keyof WorkflowFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove))
  }

  const handleCreate = () => {
    // Create the workflow immediately
    const newWorkflow = addWorkflow({
      name: formData.name,
      description: formData.description,
      status: 'stopped',
      trigger: formData.trigger,
      lastRun: '从未运行',
      nextRun: '手动触发',
      successRate: 0,
      executionTime: '0s',
      nodes: 0, // Will be updated when workflow is saved in canvas
      tags: formData.tags,
      workflowData: null // Will be populated when saved in canvas
    })
    
    // Navigate to the workflow editor with the new workflow ID
    navigate(`/dashboard/workflows/editor/${newWorkflow.id}`)
  }

  const handleCancel = () => {
    navigate('/dashboard/workflows')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Button
            variant="outlined"
            startIcon={<ArrowLeft />}
            onClick={handleCancel}
            className="border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
          >
            返回
          </Button>
        </div>

        {/* Main content */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4">
            <div className="flex items-center justify-center">
              <Typography variant="h5" className="text-white font-semibold">
                工作流配置向导
              </Typography>
            </div>
          </div>
          
          <div className="p-8">
            <div className="space-y-6">
              {/* Workflow Form */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    <Typography variant="h6" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">
                      基本信息
                    </Typography>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {/* Workflow Name */}
                      <div>
                        <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium">
                          工作流名称 *
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="输入工作流名称"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="[& .MuiOutlinedInput-root]:rounded-xl [& .MuiOutlinedInput-root]:border-gray-200 [& .MuiOutlinedInput-root]:focus:border-blue-300 [& .MuiOutlinedInput-root]:focus:ring-blue-500"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium">
                          工作流描述
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          multiline
                          rows={6}
                          placeholder="描述工作流的功能和用途..."
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          className="[& .MuiOutlinedInput-root]:rounded-xl [& .MuiOutlinedInput-root]:border-gray-200 [& .MuiOutlinedInput-root]:focus:border-blue-300 [& .MuiOutlinedInput-root]:focus:ring-blue-500"
                        />
                      </div>

                      {/* Trigger Type */}
                      <div>
                        <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium">
                          触发类型
                        </Typography>
                        <select
                          value={formData.trigger}
                          onChange={(e) => handleInputChange('trigger', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white"
                        >
                          <option value="schedule">定时触发</option>
                          <option value="manual">手动触发</option>
                          <option value="event">事件触发</option>
                        </select>
                      </div>

                      {/* Tags */}
                      <div>
                        <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium">
                          标签
                        </Typography>
                        <div className="flex items-center space-x-2 mb-3">
                          <TextField
                            size="small"
                            placeholder="添加标签"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                            className="flex-1 [& .MuiOutlinedInput-root]:rounded-xl [& .MuiOutlinedInput-root]:border-gray-200 [& .MuiOutlinedInput-root]:focus:border-blue-300 [& .MuiOutlinedInput-root]:focus:ring-blue-500"
                          />
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={handleAddTag}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 px-4 py-2 rounded-lg transition-all duration-200"
                          >
                            添加
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              onDelete={() => handleRemoveTag(tag)}
                              className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all duration-200"
                              size="small"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            {/* Bottom Action Buttons */}
            <div className="flex justify-end space-x-6 pt-8">
              <Button
                variant="outlined"
                size="large"
                startIcon={<ArrowLeft />}
                onClick={handleCancel}
                className="px-8 py-3 text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              >
                取消
              </Button>
              
              <Button
                variant="contained"
                size="large"
                startIcon={<Plus />}
                onClick={handleCreate}
                disabled={!formData.name.trim()}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                创建工作流
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default WorkflowCreationPage