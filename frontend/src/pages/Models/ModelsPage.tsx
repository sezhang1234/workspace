import React, { useState } from 'react'
import { 
  Database, 
  Plus, 
  Settings, 
  Trash2, 
  Copy, 
  TestTube,
  CheckCircle
} from 'lucide-react'
import { 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Switch, 
  FormControlLabel,
  Chip,
  Card,
  CardContent,
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
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">模型管理</h1>
          <p className="text-gray-600">配置和管理您的LLM模型，包括API密钥、参数设置和性能监控</p>
        </div>
        
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={() => setShowAddDialog(true)}
        >
          添加模型
        </Button>
      </div>

      {/* Filters and search */}
      <Card>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="搜索模型名称、提供商或模型ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Database className="w-5 h-5 text-gray-400 mr-2" />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>提供商</InputLabel>
                <Select
                  value={filterProvider}
                  label="提供商"
                  onChange={(e) => setFilterProvider(e.target.value)}
                >
                  <MenuItem value="all">所有提供商</MenuItem>
                  <MenuItem value="OpenAI">OpenAI</MenuItem>
                  <MenuItem value="Anthropic">Anthropic</MenuItem>
                  <MenuItem value="Alibaba">Alibaba</MenuItem>
                  <MenuItem value="Google">Google</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>状态</InputLabel>
                <Select
                  value={filterStatus}
                  label="状态"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">所有状态</MenuItem>
                  <MenuItem value="active">启用</MenuItem>
                  <MenuItem value="inactive">禁用</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="textSecondary">
                共 {filteredModels.length} 个模型
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Models table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>模型名称</TableCell>
                <TableCell>提供商</TableCell>
                <TableCell>模型ID</TableCell>
                <TableCell>状态</TableCell>
                <TableCell>使用统计</TableCell>
                <TableCell>标签</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredModels.map((model) => (
                <TableRow key={model.id}>
                  <TableCell>
                    <div>
                      <Typography variant="subtitle2">{model.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {model.description}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip label={model.provider} size="small" />
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {model.modelId}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={model.isActive ? '启用' : '禁用'}
                      color={model.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>请求: {model.usage.totalRequests.toLocaleString()}</div>
                      <div>成功率: {model.usage.successRate}%</div>
                      <div>平均响应: {model.usage.averageResponseTime}s</div>
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
                        >
                          <Settings className="w-4 h-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="切换状态">
                        <IconButton
                          size="small"
                          onClick={() => toggleModelStatus(model.id)}
                        >
                          {model.isActive ? <CheckCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="复制API密钥">
                        <IconButton
                          size="small"
                          onClick={() => handleCopyApiKey(model.apiKey)}
                        >
                          <Copy className="w-4 h-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="删除模型">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteModel(model.id)}
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
      </Card>

      {/* Add Model Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>添加新模型</DialogTitle>
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
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>取消</Button>
          <Button variant="contained" onClick={handleAddModel}>添加模型</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Model Dialog */}
      <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>编辑模型: {selectedModel?.name}</DialogTitle>
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
        <DialogActions>
          <Button onClick={() => setShowEditDialog(false)}>取消</Button>
          <Button variant="contained" onClick={handleEditModel}>保存更改</Button>
        </DialogActions>
      </Dialog>

      {/* Test Model Dialog */}
      <Dialog open={showTestDialog} onClose={() => setShowTestDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>测试模型: {selectedModel?.name}</DialogTitle>
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
              >
                {isTesting ? '测试中...' : '开始测试'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setTestPrompt('')
                  setTestResult('')
                }}
              >
                重置
              </Button>
            </div>

            {testResult && (
              <div>
                <Typography variant="h6" className="mb-2">测试结果</Typography>
                <Card variant="outlined">
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTestDialog(false)}>关闭</Button>
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