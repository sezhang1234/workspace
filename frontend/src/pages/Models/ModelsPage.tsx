import React, { useState } from 'react'
import { 
  Database, 
  Plus, 
  Settings, 
  Trash2, 
  Copy, 
  TestTube,
  CheckCircle,
  Search
} from 'lucide-react'
import { 
  Button, 
  Switch, 
  FormControlLabel,
  Chip,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Slider,
  FormGroup
} from '@mui/material'

interface ModelConfig {
  id: string
  name: string
  provider: string
  modelId: string
  apiKey: string
  baseUrl: string
  isActive: boolean
  maxTokens: number
  temperature: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  timeout: number
  retryCount: number
  enableStreaming: boolean
  enableFunctionCalling: boolean
  usage: {
    totalRequests: number
    totalTokens: number
    successRate: number
    averageResponseTime: number
    lastUsed: string
  }
  tags: string[]
  description: string
}

const ModelsPage: React.FC = () => {
  const [models, setModels] = useState<ModelConfig[]>([
    {
      id: '1',
      name: 'GPT-4 生产环境',
      provider: 'OpenAI',
      modelId: 'gpt-4',
      apiKey: 'sk-...',
      baseUrl: 'https://api.openai.com/v1',
      isActive: true,
      maxTokens: 4000,
      temperature: 0.7,
      topP: 0.9,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      timeout: 30,
      retryCount: 3,
      enableStreaming: true,
      enableFunctionCalling: true,
      usage: {
        totalRequests: 15420,
        totalTokens: 2847500,
        successRate: 98.5,
        averageResponseTime: 2.3,
        lastUsed: '2024-01-15T14:30:00Z'
      },
      tags: ['生产环境', 'GPT-4', 'OpenAI'],
      description: '生产环境使用的GPT-4模型，配置了完整的参数和监控'
    },
    {
      id: '2',
      name: 'Claude-3 测试环境',
      provider: 'Anthropic',
      modelId: 'claude-3-sonnet-20240229',
      apiKey: 'sk-ant-...',
      baseUrl: 'https://api.anthropic.com',
      isActive: false,
      maxTokens: 8000,
      temperature: 0.8,
      topP: 0.95,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      timeout: 45,
      retryCount: 2,
      enableStreaming: true,
      enableFunctionCalling: false,
      usage: {
        totalRequests: 2340,
        totalTokens: 890000,
        successRate: 96.2,
        averageResponseTime: 3.1,
        lastUsed: '2024-01-14T09:15:00Z'
      },
      tags: ['测试环境', 'Claude-3', 'Anthropic'],
      description: '测试环境使用的Claude-3模型，用于功能验证和性能测试'
    },
    {
      id: '3',
      name: 'Qwen Plus 备用',
      provider: 'Alibaba',
      modelId: 'qwen-plus',
      apiKey: 'sk-...',
      baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
      isActive: true,
      maxTokens: 6000,
      temperature: 0.6,
      topP: 0.85,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1,
      timeout: 25,
      retryCount: 3,
      enableStreaming: false,
      enableFunctionCalling: true,
      usage: {
        totalRequests: 5670,
        totalTokens: 1200000,
        successRate: 97.8,
        averageResponseTime: 1.8,
        lastUsed: '2024-01-15T16:45:00Z'
      },
      tags: ['备用模型', 'Qwen Plus', 'Alibaba'],
      description: '备用模型，在主模型不可用时提供服务'
    }
  ])

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showTestDialog, setShowTestDialog] = useState(false)
  const [selectedModel, setSelectedModel] = useState<ModelConfig | null>(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProvider, setFilterProvider] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // New model form state
  const [newModel, setNewModel] = useState<Partial<ModelConfig>>({
    name: '',
    provider: 'OpenAI',
    modelId: '',
    apiKey: '',
    baseUrl: '',
    isActive: true,
    maxTokens: 4000,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    timeout: 30,
    retryCount: 3,
    enableStreaming: true,
    enableFunctionCalling: true,
    tags: [],
    description: ''
  })

  // Test state
  const [testPrompt, setTestPrompt] = useState('')
  const [testResult, setTestResult] = useState('')
  const [isTesting, setIsTesting] = useState(false)

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.modelId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProvider = filterProvider === 'all' || model.provider === filterProvider
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && model.isActive) ||
                         (filterStatus === 'inactive' && !model.isActive)
    
    return matchesSearch && matchesProvider && matchesStatus
  })

  const handleAddModel = () => {
    const model: ModelConfig = {
      id: Date.now().toString(),
      ...newModel,
      usage: {
        totalRequests: 0,
        totalTokens: 0,
        successRate: 100,
        averageResponseTime: 0,
        lastUsed: '-'
      }
    } as ModelConfig

    setModels([...models, model])
    setShowAddDialog(false)
    setNewModel({
      name: '',
      provider: 'OpenAI',
      modelId: '',
      apiKey: '',
      baseUrl: '',
      isActive: true,
      maxTokens: 4000,
      temperature: 0.7,
      topP: 0.9,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      timeout: 30,
      retryCount: 3,
      enableStreaming: true,
      enableFunctionCalling: true,
      tags: [],
      description: ''
    })
    setSnackbar({ open: true, message: '模型添加成功！', severity: 'success' })
  }

  const handleEditModel = () => {
    if (selectedModel) {
      setModels(models.map(model => 
        model.id === selectedModel.id ? { ...selectedModel } : model
      ))
      setShowEditDialog(false)
      setSelectedModel(null)
      setSnackbar({ open: true, message: '模型更新成功！', severity: 'success' })
    }
  }

  const handleDeleteModel = (modelId: string) => {
    if (confirm('确定要删除这个模型吗？')) {
      setModels(models.filter(model => model.id !== modelId))
      setSnackbar({ open: true, message: '模型删除成功！', severity: 'success' })
    }
  }

  const handleTestModel = async () => {
    if (!testPrompt.trim() || !selectedModel) return
    
    setIsTesting(true)
    
    // Simulate model testing
    setTimeout(() => {
      setTestResult(`这是来自 ${selectedModel.name} 的测试回复：\n\n${testPrompt}\n\n模型配置：\n- 温度: ${selectedModel.temperature}\n- 最大Token: ${selectedModel.maxTokens}\n- 提供商: ${selectedModel.provider}`)
      setIsTesting(false)
    }, 2000)
  }

  const handleCopyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey)
    setSnackbar({ open: true, message: 'API密钥已复制到剪贴板', severity: 'success' })
  }

  const toggleModelStatus = (modelId: string) => {
    setModels(models.map(model => 
      model.id === modelId ? { ...model, isActive: !model.isActive } : model
    ))
  }



  const removeTag = (modelId: string, tagIndex: number) => {
    setModels(models.map(model => 
      model.id === modelId ? { ...model, tags: model.tags.filter((_, i) => i !== tagIndex) } : model
    ))
  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      {/* Page header */}
      <div className="text-center mb-8">

        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 mb-2">
          模型管理
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          配置和管理您的LLM模型，包括API密钥、参数设置和性能监控
        </p>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            <input
              type="text"
              placeholder="搜索模型名称、提供商或模型ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Provider filter */}
        <div className="sm:w-48">
          <select
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white"
          >
            <option value="all">所有提供商</option>
            <option value="OpenAI">OpenAI</option>
            <option value="Anthropic">Anthropic</option>
            <option value="Alibaba">Alibaba</option>
            <option value="Google">Google</option>
          </select>
        </div>

        {/* Status filter */}
        <div className="sm:w-48">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white"
          >
            <option value="all">所有状态</option>
            <option value="active">启用</option>
            <option value="inactive">禁用</option>
          </select>
        </div>

        {/* Add Model Button */}
        <button
          onClick={() => setShowAddDialog(true)}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>添加模型</span>
        </button>
      </div>

      {/* Models table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">
              模型列表
            </h2>
            {/* Model counter */}
            <div className="text-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl border border-blue-200">
              <Typography variant="body1" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {filteredModels.length}
              </Typography>
              <Typography variant="caption" className="text-blue-700 font-medium">
                个模型
              </Typography>
            </div>
          </div>
        </div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableCell className="font-semibold text-gray-700">模型名称</TableCell>
                <TableCell className="font-semibold text-gray-700">提供商</TableCell>
                <TableCell className="font-semibold text-gray-700">模型ID</TableCell>
                <TableCell className="font-semibold text-gray-700">状态</TableCell>
                <TableCell className="font-semibold text-gray-700">使用统计</TableCell>
                <TableCell className="font-semibold text-gray-700">标签</TableCell>
                <TableCell className="font-semibold text-gray-700">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredModels.map((model, index) => (
                <TableRow 
                  key={model.id} 
                  className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <TableCell>
                    <div>
                      <Typography variant="subtitle2" className="font-bold text-gray-900">
                        {model.name}
                      </Typography>
                      <Typography variant="caption" className="text-gray-600">
                        {model.description}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={model.provider} 
                      size="small" 
                      className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 font-semibold"
                    />
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-gradient-to-r from-gray-100 to-blue-100 px-3 py-1 rounded-lg border border-gray-200 font-mono text-blue-700">
                      {model.modelId}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={model.isActive ? '启用' : '禁用'}
                      color={model.isActive ? 'success' : 'default'}
                      size="small"
                      className={`font-semibold ${model.isActive ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">请求:</span>
                        <span className="font-semibold text-blue-700">{model.usage.totalRequests.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">成功率:</span>
                        <span className="font-semibold text-green-700">{model.usage.successRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">平均响应:</span>
                        <span className="font-semibold text-orange-700">{model.usage.averageResponseTime}s</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {model.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          onDelete={() => removeTag(model.id, index)}
                          className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all duration-200"
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Tooltip title="测试模型">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedModel(model)
                            setShowTestDialog(true)
                          }}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <TestTube className="w-4 h-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="编辑模型">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedModel(model)
                            setShowEditDialog(true)
                          }}
                          className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                        >
                          <Settings className="w-4 h-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="切换状态">
                        <IconButton
                          size="small"
                          onClick={() => toggleModelStatus(model.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          {model.isActive ? <CheckCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="复制API密钥">
                        <IconButton
                          size="small"
                          onClick={() => handleCopyApiKey(model.apiKey)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Copy className="w-4 h-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="删除模型">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteModel(model.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Add Model Dialog */}
      <Dialog 
        open={showAddDialog} 
        onClose={() => setShowAddDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          className: "rounded-2xl shadow-2xl border border-gray-100"
        }}
      >
        <DialogTitle className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <Typography variant="h6" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">
              添加新模型
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} className="pt-4">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="模型名称"
                value={newModel.name}
                onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                placeholder="例如：GPT-4 生产环境"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>提供商</InputLabel>
                <Select
                  value={newModel.provider}
                  label="提供商"
                  onChange={(e) => setNewModel({ ...newModel, provider: e.target.value })}
                >
                  <MenuItem value="OpenAI">OpenAI</MenuItem>
                  <MenuItem value="Anthropic">Anthropic</MenuItem>
                  <MenuItem value="Alibaba">Alibaba</MenuItem>
                  <MenuItem value="Google">Google</MenuItem>
                  <MenuItem value="Other">其他</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="模型ID"
                value={newModel.modelId}
                onChange={(e) => setNewModel({ ...newModel, modelId: e.target.value })}
                placeholder="例如：gpt-4"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="API密钥"
                type="password"
                value={newModel.apiKey}
                onChange={(e) => setNewModel({ ...newModel, apiKey: e.target.value })}
                placeholder="sk-..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="基础URL"
                value={newModel.baseUrl}
                onChange={(e) => setNewModel({ ...newModel, baseUrl: e.target.value })}
                placeholder="https://api.openai.com/v1"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="描述"
                value={newModel.description}
                onChange={(e) => setNewModel({ ...newModel, description: e.target.value })}
                placeholder="描述此模型的用途和特点..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="bg-gray-50 px-6 py-4">
          <Button 
            onClick={() => setShowAddDialog(false)}
            className="text-gray-600 hover:text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-200"
          >
            取消
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAddModel}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            添加模型
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Model Dialog */}
      <Dialog 
        open={showEditDialog} 
        onClose={() => setShowEditDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          className: "rounded-2xl shadow-2xl border border-gray-100"
        }}
      >
        <DialogTitle className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <Typography variant="h6" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">
              编辑模型: {selectedModel?.name}
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          {selectedModel && (
            <Grid container spacing={3} className="pt-4">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="模型名称"
                  value={selectedModel.name}
                  onChange={(e) => setSelectedModel({ ...selectedModel, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>提供商</InputLabel>
                  <Select
                    value={selectedModel.provider}
                    label="提供商"
                    onChange={(e) => setSelectedModel({ ...selectedModel, provider: e.target.value })}
                  >
                    <MenuItem value="OpenAI">OpenAI</MenuItem>
                    <MenuItem value="Anthropic">Anthropic</MenuItem>
                    <MenuItem value="Alibaba">Alibaba</MenuItem>
                    <MenuItem value="Google">Google</MenuItem>
                    <MenuItem value="Other">其他</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="最大Token数"
                  type="number"
                  value={selectedModel.maxTokens}
                  onChange={(e) => setSelectedModel({ ...selectedModel, maxTokens: parseInt(e.target.value) })}
                  inputProps={{ min: 1000, max: 8000 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="超时时间（秒）"
                  type="number"
                  value={selectedModel.timeout}
                  onChange={(e) => setSelectedModel({ ...selectedModel, timeout: parseInt(e.target.value) })}
                  inputProps={{ min: 10, max: 300 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>温度 (Temperature): {selectedModel.temperature}</Typography>
                <Slider
                  value={selectedModel.temperature}
                  onChange={(_, value) => setSelectedModel({ ...selectedModel, temperature: value as number })}
                  min={0}
                  max={2}
                  step={0.1}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 1, label: '1' },
                    { value: 2, label: '2' }
                  ]}
                />
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={selectedModel.enableStreaming}
                        onChange={(e) => setSelectedModel({ ...selectedModel, enableStreaming: e.target.checked })}
                      />
                    }
                    label="启用流式输出"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={selectedModel.enableFunctionCalling}
                        onChange={(e) => setSelectedModel({ ...selectedModel, enableFunctionCalling: e.target.checked })}
                      />
                    }
                    label="启用函数调用"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="bg-gray-50 px-6 py-4">
          <Button 
            onClick={() => setShowEditDialog(false)}
            className="text-gray-600 hover:text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-200"
          >
            取消
          </Button>
          <Button 
            variant="contained" 
            onClick={handleEditModel}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            保存更改
          </Button>
        </DialogActions>
      </Dialog>

      {/* Test Model Dialog */}
      <Dialog 
        open={showTestDialog} 
        onClose={() => setShowTestDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          className: "rounded-2xl shadow-2xl border border-gray-100"
        }}
      >
        <DialogTitle className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <TestTube className="w-4 h-4 text-white" />
            </div>
            <Typography variant="h6" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">
              测试模型: {selectedModel?.name}
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <TextField
              fullWidth
              multiline
              rows={4}
              label="测试提示词"
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              placeholder="输入要测试的提示词..."
            />
            
            <div className="flex space-x-3">
              <Button
                variant="contained"
                startIcon={<TestTube />}
                onClick={handleTestModel}
                disabled={isTesting || !testPrompt.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none"
              >
                {isTesting ? '测试中...' : '开始测试'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setTestPrompt('')
                  setTestResult('')
                }}
                className="text-gray-600 hover:text-gray-700 hover:bg-gray-100 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-lg transition-all duration-200"
              >
                重置
              </Button>
            </div>

            {testResult && (
              <div>
                <Typography variant="h6" className="mb-2 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800 font-bold">
                  测试结果
                </Typography>
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-blue-200 p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono bg-white p-3 rounded-lg border border-gray-200">{testResult}</pre>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions className="bg-gray-50 px-6 py-4">
          <Button 
            onClick={() => setShowTestDialog(false)}
            className="text-gray-600 hover:text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-200"
          >
            关闭
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default ModelsPage