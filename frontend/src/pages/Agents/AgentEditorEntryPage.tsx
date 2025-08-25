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
  InputAdornment
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outlined"
          startIcon={<ArrowLeft />}
          onClick={handleCancel}
        >
          返回
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            创建智能体
          </h1>
          <p className="text-gray-600">
            选择编辑模式并配置智能体基本信息
          </p>
        </div>
      </div>

      {/* Main content */}
      <Card className="p-8">
        <div className="space-y-8">
          {/* Edit Mode Selection */}
          <div>
            <Typography variant="h5" className="mb-4 flex items-center">
              <Edit3 className="mr-2" />
              选择编辑模式
            </Typography>
            
            <FormControl component="fieldset">
              <RadioGroup
                value={agentData.editMode}
                onChange={(e) => setAgentData(prev => ({ 
                  ...prev, 
                  editMode: e.target.value as 'manual' | 'ai' 
                }))}
                className="space-y-4"
              >
                <FormControlLabel
                  value="manual"
                  control={<Radio />}
                  label={
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <Edit3 className="text-blue-600 w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">手动编辑</div>
                        <div className="text-sm text-gray-600">
                          手动配置所有参数，完全控制智能体行为
                        </div>
                      </div>
                    </div>
                  }
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                />
                
                <FormControlLabel
                  value="ai"
                  control={<Radio />}
                  label={
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <Sparkles className="text-purple-600 w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">AI 辅助编辑</div>
                        <div className="text-sm text-gray-600">
                          基于描述自动生成配置，AI 辅助优化参数
                        </div>
                      </div>
                    </div>
                  }
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                />
              </RadioGroup>
            </FormControl>
          </div>

          {/* Agent Basic Information */}
          <div>
            <Typography variant="h5" className="mb-4 flex items-center">
              <Bot className="mr-2" />
              智能体基本信息
            </Typography>
            
            <div className="space-y-6">
              {/* Agent Name */}
              <TextField
                fullWidth
                label="智能体名称"
                value={agentData.name}
                onChange={(e) => setAgentData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="例如：智能客服助手"
                error={!!errors.name}
                helperText={errors.name || '为您的智能体起一个描述性的名称'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Bot className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Agent Description */}
              <TextField
                fullWidth
                multiline
                rows={4}
                label="功能描述"
                value={agentData.description}
                onChange={(e) => setAgentData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="详细描述智能体的功能、用途和行为特征..."
                error={!!errors.description}
                helperText={errors.description || '详细描述智能体的功能和行为，至少10个字符'}
              />

              {/* Agent Icon Selection */}
              <div>
                <Typography variant="subtitle1" className="mb-3">
                  选择图标
                </Typography>
                <div className="grid grid-cols-10 gap-2">
                  {iconOptions.map((icon, index) => (
                    <IconButton
                      key={index}
                      onClick={() => handleIconSelect(icon)}
                      className={`w-12 h-12 text-2xl hover:bg-gray-100 transition-colors ${
                        agentData.icon === icon ? 'bg-blue-100 border-2 border-blue-500' : ''
                      }`}
                    >
                      {icon}
                    </IconButton>
                  ))}
                </div>
                <Typography variant="caption" className="text-gray-500 mt-2">
                  当前选择: {agentData.icon}
                </Typography>
              </div>
            </div>
          </div>

          {/* AI Edit Mode Info */}
          {agentData.editMode === 'ai' && (
            <Alert severity="info" icon={<Sparkles />}>
              <Typography variant="body2">
                <strong>AI 辅助编辑模式：</strong>
                系统将根据您的描述自动生成智能体配置，包括系统提示词、模型参数等。
                您可以在下一步中查看和调整生成的配置。
              </Typography>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              variant="outlined"
              size="large"
              startIcon={<X />}
              onClick={handleCancel}
            >
              取消
            </Button>
            
            <Button
              variant="contained"
              size="large"
              startIcon={<Check />}
              onClick={handleConfirm}
              disabled={!agentData.name.trim() || !agentData.description.trim()}
            >
              确认并继续
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AgentEditorEntryPage