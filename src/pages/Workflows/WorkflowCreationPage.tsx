import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Play, 
  Settings, 
  Plus,
  Bot,
  CheckCircle
} from 'lucide-react'
import { 
  Button, 
  TextField, 
  Switch, 
  FormControlLabel,
  Typography,
  Card,
  CardContent,
  Chip
} from '@mui/material'

interface WorkflowFormData {
  name: string
  description: string
  trigger: string
  isActive: boolean
  tags: string[]
}

const WorkflowCreationPage: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<WorkflowFormData>({
    name: '',
    description: '',
    trigger: 'webhook',
    isActive: true,
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
    // Navigate to the workflow editor with the form data
    navigate('/dashboard/workflows/editor', { 
      state: { 
        isNew: true, 
        workflowData: formData 
      } 
    })
  }

  const handleCancel = () => {
    navigate('/dashboard/workflows')
  }



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="outlined"
                startIcon={<ArrowLeft />}
                onClick={handleCancel}
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                返回
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">创建工作流</h1>
                <p className="text-sm text-gray-600">配置工作流基本信息，然后进入可视化编辑器</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Workflow Form */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 h-full">
              <CardContent className="p-6">
                <Typography variant="h6" className="text-gray-800 font-semibold mb-4">
                  基本信息
                </Typography>
                
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
                      className="bg-white"
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
                      className="bg-white"
                    />
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
                        className="bg-white flex-1"
                      />
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={handleAddTag}
                        className="border-gray-300 text-gray-700"
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
                          className="bg-blue-100 text-blue-800"
                          size="small"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Advanced Settings */}
                  <div>
                    <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium">
                      高级设置
                    </Typography>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Typography variant="caption" className="text-gray-600">
                          超时时间 (秒)
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          value={formData.timeout}
                          onChange={(e) => handleInputChange('timeout', parseInt(e.target.value))}
                          className="bg-white mt-1"
                        />
                      </div>
                      <div>
                        <Typography variant="caption" className="text-gray-600">
                          重试次数
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          value={formData.retryCount}
                          onChange={(e) => handleInputChange('retryCount', parseInt(e.target.value))}
                          className="bg-white mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Active Switch */}
                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isActive}
                          onChange={(e) => handleInputChange('isActive', e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="subtitle2" className="text-gray-700 font-medium">
                          启用工作流
                        </Typography>
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Demonstration Image */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 h-full">
              <CardContent className="p-6">
                <Typography variant="h6" className="text-gray-800 font-semibold mb-4">
                  工作流画布预览
                </Typography>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-dashed border-blue-200 p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-blue-600" />
                  </div>
                  <Typography variant="h6" className="text-blue-800 font-semibold mb-2">
                    可视化工作流编辑器
                  </Typography>
                  <Typography variant="body2" className="text-blue-600 mb-4">
                    拖拽节点，连接流程，构建智能自动化工作流
                  </Typography>
                  
                  {/* Sample Workflow Preview */}
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-center space-x-8 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="w-2 h-8 bg-blue-300 rounded-full"></div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Settings className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="w-2 h-8 bg-blue-300 rounded-full"></div>
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                    <Typography variant="caption" className="text-gray-500">
                      开始 → 处理 → 结束
                    </Typography>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <Typography variant="body2" className="text-gray-600 text-center">
                    创建完成后，您将进入功能完整的可视化编辑器，<br/>
                    可以添加节点、配置参数、测试运行和保存工作流。
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="outlined"
            onClick={handleCancel}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            取消
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!formData.name.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
            startIcon={<Plus />}
          >
            创建工作流
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WorkflowCreationPage