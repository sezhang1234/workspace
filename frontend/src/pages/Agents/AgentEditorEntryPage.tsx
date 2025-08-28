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
  Typography,
  Card,
  Alert,
  IconButton,
  InputAdornment,
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
      <div className="space-y-8 p-6">
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
            <div className="flex items-center justify-center space-x-2">
              <Bot className="w-6 h-6 text-white" />
              <Typography variant="h5" className="text-white font-semibold">
                智能体配置向导
              </Typography>
            </div>
          </div>
          
          <div className="p-8">
            <div className="space-y-10">
              {/* Edit Mode Selection */}
              <div className="mb-8">
                <div className="grid grid-cols-2 gap-6">
                  {/* Manual Edit Card */}
                  <div
                    onClick={() => setAgentData(prev => ({ ...prev, editMode: 'manual' }))}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                      agentData.editMode === 'manual'
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`p-3 rounded-full ${
                        agentData.editMode === 'manual' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Edit3 className={`w-8 h-8 ${
                          agentData.editMode === 'manual' ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <div className={`text-lg font-bold mb-1 ${
                          agentData.editMode === 'manual' ? 'text-blue-800' : 'text-gray-800'
                        }`}>
                          手动编辑
                        </div>
                        <div className="text-sm text-gray-600 leading-relaxed">
                          完全控制智能体配置<br/>
                          手动设置所有参数<br/>
                          适合高级用户
                        </div>
                      </div>
                      {agentData.editMode === 'manual' && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Edit Card */}
                  <div
                    onClick={() => setAgentData(prev => ({ ...prev, editMode: 'ai' }))}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                      agentData.editMode === 'ai'
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`p-3 rounded-full ${
                        agentData.editMode === 'ai' ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        <Sparkles className={`w-8 h-8 ${
                          agentData.editMode === 'ai' ? 'text-purple-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <div className={`text-lg font-bold mb-1 ${
                          agentData.editMode === 'ai' ? 'text-purple-800' : 'text-gray-800'
                        }`}>
                          AI 智能生成
                        </div>
                        <div className="text-sm text-gray-600 leading-relaxed">
                          智能生成配置建议<br/>
                          自动优化参数设置<br/>
                          快速上手
                        </div>
                      </div>
                      {agentData.editMode === 'ai' && (
                        <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Divider className="my-6" />
              
              <div className="space-y-8">
                {/* Agent Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    智能体名称 *
                  </label>
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
                  />
                </div>

                {/* Agent Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    功能描述 *
                  </label>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={agentData.description}
                    onChange={(e) => setAgentData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="详细描述智能体的功能、用途和行为特征..."
                    error={!!errors.description}
                    helperText={errors.description || '详细描述智能体的功能和行为，至少10个字符'}
                  />
                </div>

                {/* Agent Icon Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-4">
                    选择图标
                  </label>
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

              {/* AI Edit Mode Info */}
              {agentData.editMode === 'ai' && (
                <Alert 
                  severity="info" 
                  icon={<Sparkles className="w-6 h-6" />}
                  className="border border-blue-200 bg-blue-50"
                >
                  <Typography variant="body1" className="text-blue-800">
                    <strong>自动生成提示词：</strong>
                    系统将根据您的描述自动生成智能体配置，包括系统提示词、模型参数等。
                    您可以在下一步中查看和调整生成的配置。
                  </Typography>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-6 pt-8">
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