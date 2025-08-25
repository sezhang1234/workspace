import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Check,
  X,
  Sparkles,
  Edit3,
  Bot
} from 'lucide-react'
import { 
  TextField, 
  Button, 
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Card,
  Alert,
  IconButton,
  InputAdornment,
  Box,
  Divider
} from '@mui/material'

interface AgentEntryData {
  editMode: 'manual' | 'ai'
  name: string
  description: string
  icon: string
}

const AgentEditorEntryPage: React.FC = () => {
  const navigate = useNavigate()
  const [agentData, setAgentData] = useState<AgentEntryData>({
    editMode: 'manual',
    name: '',
    description: '',
    icon: '🤖'
  })

  const [errors, setErrors] = useState<Partial<AgentEntryData>>({})

  // Predefined icon options
  const iconOptions = [
    '🤖', '🧠', '💡', '🔧', '📊', '💬', '🎯', '🚀', '🌟', '⚡',
    '🎨', '📝', '🔍', '💻', '🌍', '💰', '🏥', '🎓', '🏠', '🛒'
  ]

  const validateForm = (): boolean => {
    const newErrors: Partial<AgentEntryData> = {}
    
    if (!agentData.name.trim()) {
      newErrors.name = '请输入智能体名称'
    }
    
    if (!agentData.description.trim()) {
      newErrors.description = '请输入智能体描述'
    }
    
    if (agentData.description.trim().length < 10) {
      newErrors.description = '描述至少需要10个字符'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleConfirm = () => {
    if (validateForm()) {
      // Navigate to the main editor page with the entry data
      navigate('/dashboard/agents/editor', { 
        state: { 
          agentEntryData: agentData,
          isNew: true
        } 
      })
    }
  }

  const handleCancel = () => {
    navigate('/dashboard/agents')
  }

  const handleIconSelect = (icon: string) => {
    setAgentData(prev => ({ ...prev, icon }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="outlined"
              startIcon={<ArrowLeft />}
              onClick={handleCancel}
              className="border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
            >
              返回
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              创建智能体
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              选择编辑模式并配置智能体基本信息，开始构建您的AI智能体
            </p>
          </div>
        </div>

        {/* Main content */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-center space-x-2">
              <Bot className="w-8 h-8 text-white" />
              <Typography variant="h4" className="text-white font-semibold">
                智能体配置向导
              </Typography>
            </div>
          </div>
          
          <div className="p-8">
            <div className="space-y-10">
              {/* Edit Mode Selection */}
              <div>
                <Typography variant="h5" className="mb-6 flex items-center text-gray-800">
                  <Edit3 className="mr-3 w-6 h-6 text-blue-600" />
                  选择编辑模式
                </Typography>
                
                <FormControl component="fieldset" className="w-full">
                  <RadioGroup
                    value={agentData.editMode}
                    onChange={(e) => setAgentData(prev => ({ 
                      ...prev, 
                      editMode: e.target.value as 'manual' | 'ai' 
                    }))}
                    className="grid grid-cols-2 gap-6"
                  >
                    <FormControlLabel
                      value="manual"
                      control={<Radio className="text-blue-600" />}
                      label={
                        <div className="flex items-center space-x-4 p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                          <div className="p-4 bg-blue-100 rounded-lg">
                            <Edit3 className="text-blue-600 w-8 h-8" />
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-gray-900 mb-1">手动编辑</div>
                            <div className="text-sm text-gray-600 max-w-xs">
                              手动配置所有参数，完全控制智能体行为
                            </div>
                          </div>
                        </div>
                      }
                      className="m-0"
                    />
                    
                    <FormControlLabel
                      value="ai"
                      control={<Radio className="text-purple-600" />}
                      label={
                        <div className="flex items-center space-x-4 p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 cursor-pointer">
                          <div className="p-4 bg-purple-100 rounded-lg">
                            <Sparkles className="text-purple-600 w-8 h-8" />
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-gray-900 mb-1">AI 辅助编辑</div>
                            <div className="text-sm text-gray-600 max-w-xs">
                              基于描述自动生成配置，AI 辅助优化参数
                            </div>
                          </div>
                        </div>
                      }
                      className="m-0"
                    />
                  </RadioGroup>
                </FormControl>
              </div>

              <Divider className="my-8" />

              {/* Agent Basic Information */}
              <div>
                <Typography variant="h5" className="mb-6 flex items-center text-gray-800">
                  <Bot className="mr-3 w-6 h-6 text-green-600" />
                  智能体基本信息
                </Typography>
                
                <div className="space-y-8">
                  {/* Agent Name */}
                  <div>
                    <Typography variant="subtitle1" className="mb-3 text-gray-700 font-medium">
                      智能体名称
                    </Typography>
                    <TextField
                      fullWidth
                      value={agentData.name}
                      onChange={(e) => setAgentData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="例如：智能客服助手"
                      error={!!errors.name}
                      helperText={errors.name || '为您的智能体起一个描述性的名称'}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Bot className="text-gray-400 w-5 h-5" />
                          </InputAdornment>
                        ),
                      }}
                      className="mt-2"
                    />
                  </div>

                  {/* Agent Description */}
                  <div>
                    <Typography variant="subtitle1" className="mb-3 text-gray-700 font-medium">
                      功能描述
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={agentData.description}
                      onChange={(e) => setAgentData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="详细描述智能体的功能、用途和行为特征..."
                      error={!!errors.description}
                      helperText={errors.description || '详细描述智能体的功能和行为，至少10个字符'}
                      className="mt-2"
                    />
                  </div>

                  {/* Agent Icon Selection */}
                  <div>
                    <Typography variant="subtitle1" className="mb-4 text-gray-700 font-medium">
                      选择图标
                    </Typography>
                    <div className="grid grid-cols-10 gap-3 p-6 bg-gray-50 rounded-xl border border-gray-200">
                      {iconOptions.map((icon, index) => (
                        <IconButton
                          key={index}
                          onClick={() => handleIconSelect(icon)}
                          className={`w-14 h-14 text-2xl hover:bg-white hover:shadow-md transition-all duration-200 ${
                            agentData.icon === icon 
                              ? 'bg-blue-100 border-2 border-blue-500 shadow-lg scale-110' 
                              : 'hover:scale-105'
                          }`}
                        >
                          {icon}
                        </IconButton>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <Typography variant="body2" className="text-gray-500">
                        当前选择: <span className="text-2xl">{agentData.icon}</span>
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Edit Mode Info */}
              {agentData.editMode === 'ai' && (
                <Alert 
                  severity="info" 
                  icon={<Sparkles className="w-6 h-6" />}
                  className="border border-blue-200 bg-blue-50"
                >
                  <Typography variant="body1" className="text-blue-800">
                    <strong>AI 辅助编辑模式：</strong>
                    系统将根据您的描述自动生成智能体配置，包括系统提示词、模型参数等。
                    您可以在下一步中查看和调整生成的配置。
                  </Typography>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center space-x-6 pt-8">
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<X />}
                  onClick={handleCancel}
                  className="px-8 py-3 text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                >
                  取消
                </Button>
                
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Check />}
                  onClick={handleConfirm}
                  disabled={!agentData.name.trim() || !agentData.description.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  确认并继续
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Typography variant="body2" className="text-gray-500">
            开始构建您的AI智能体，让AI为您的工作和生活带来更多便利
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default AgentEditorEntryPage