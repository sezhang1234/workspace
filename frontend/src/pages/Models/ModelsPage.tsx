import React, { useState } from 'react'
import { 
  Database, 
  Plus, 
  Settings, 
  Trash2, 
  CheckCircle,
  Search
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
      name: 'DeepSeek Chat',
      provider: 'DeepSeek',
      modelId: 'deepseek-chat',
      apiKey: 'sk-...',
      baseUrl: 'https://api.deepseek.com/v1',
      isActive: true,
      maxTokens: 8192,
      temperature: 0.7,
      topP: 0.9,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      timeout: 30,
      retryCount: 3,
      enableStreaming: true,
      enableFunctionCalling: true,
      usage: {
        totalRequests: 8520,
        totalTokens: 1847500,
        successRate: 97.2,
        averageResponseTime: 1.8,
        lastUsed: '2024-01-15T14:30:00Z'
      },
      tags: ['生产环境', 'DeepSeek', '对话'],
      description: 'DeepSeek高性能对话模型，支持长上下文和复杂推理'
    },
    {
      id: '2',
      name: 'Qwen-Max',
      provider: 'Alibaba',
      modelId: 'qwen-max',
      apiKey: 'sk-...',
      baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
      isActive: true,
      maxTokens: 6144,
      temperature: 0.8,
      topP: 0.95,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      timeout: 25,
      retryCount: 3,
      enableStreaming: true,
      enableFunctionCalling: true,
      usage: {
        totalRequests: 6340,
        totalTokens: 1290000,
        successRate: 98.1,
        averageResponseTime: 2.1,
        lastUsed: '2024-01-15T16:45:00Z'
      },
      tags: ['生产环境', 'Qwen', '通义千问'],
      description: '通义千问Max模型，阿里云自研的大语言模型'
    }
  ])

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

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
          <div className="flex items-center">
            <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">
              模型列表
            </h2>
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

      {/* Model Market */}
      <div className="mt-8">
        <div className="mb-6">
          <Typography variant="h5" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">
            安装模型供应商
          </Typography>
          <Typography variant="body1" className="text-gray-600 mt-2">
            探索和安装来自顶级AI提供商的模型
          </Typography>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* DeepSeek */}
          <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">DS</span>
                </div>
                <div>
                  <Typography variant="h6" className="font-semibold text-gray-900">DeepSeek</Typography>
                  <Typography variant="body2" className="text-gray-500">AI研究实验室</Typography>
                </div>
              </div>
              
              <Typography variant="body2" className="text-gray-600 mb-4">
                专注于代码生成和数学推理的大语言模型，支持多种编程语言和复杂问题解决。
              </Typography>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>模型数量: 8</span>
                <span>评分: ⭐⭐⭐⭐⭐</span>
              </div>
              
              {/* Overlay Buttons - Only visible on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 opacity-0 group-hover:opacity-100">
                <div className="flex space-x-4 w-full px-6 absolute bottom-6">
                  <Button
                    variant="contained"
                    size="large"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    安装
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    className="flex-1 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    详情
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tongyi Qianwen */}
          <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">TQ</span>
                </div>
                <div>
                  <Typography variant="h6" className="font-semibold text-gray-900">通义千问</Typography>
                  <Typography variant="body2" className="text-gray-500">阿里巴巴</Typography>
                </div>
              </div>
              
              <Typography variant="body2" className="text-gray-600 mb-4">
                阿里巴巴开发的大语言模型，在中文理解和生成方面表现优异，支持多模态输入输出。
              </Typography>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>模型数量: 12</span>
                <span>评分: ⭐⭐⭐⭐⭐</span>
              </div>
              
              {/* Overlay Buttons - Only visible on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 opacity-0 group-hover:opacity-100">
                <div className="flex space-x-4 w-full px-6 absolute bottom-6">
                  <Button
                    variant="contained"
                    size="large"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    安装
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    className="flex-1 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    详情
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Silicon Mobility */}
          <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SM</span>
                </div>
                <div>
                  <Typography variant="h6" className="font-semibold text-gray-900">硅基流动</Typography>
                  <Typography variant="body2" className="text-gray-500">芯片优化AI</Typography>
                </div>
              </div>
              
              <Typography variant="body2" className="text-gray-600 mb-4">
                专为边缘计算和移动设备优化的AI模型，提供高效的推理性能和低功耗解决方案。
              </Typography>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>模型数量: 6</span>
                <span>评分: ⭐⭐⭐⭐</span>
              </div>
              
              {/* Overlay Buttons - Only visible on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 opacity-0 group-hover:opacity-100">
                <div className="flex space-x-4 w-full px-6 absolute bottom-6">
                  <Button
                    variant="contained"
                    size="large"
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    安装
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    className="flex-1 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    详情
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Gemini */}
          <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <div>
                  <Typography variant="h6" className="font-semibold text-gray-900">Gemini</Typography>
                  <Typography variant="body2" className="text-gray-500">Google</Typography>
                </div>
              </div>
              
              <Typography variant="body2" className="text-gray-600 mb-4">
                Google的多模态AI模型，支持文本、图像、音频等多种输入，在理解和生成方面表现卓越。
              </Typography>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>模型数量: 15</span>
                <span>评分: ⭐⭐⭐⭐⭐</span>
              </div>
              
              {/* Overlay Buttons - Only visible on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 opacity-0 group-hover:opacity-100">
                <div className="flex space-x-4 w-full px-6 absolute bottom-6">
                  <Button
                    variant="contained"
                    size="large"
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    安装
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    className="flex-1 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    详情
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* OpenAI */}
          <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">O</span>
                </div>
                <div>
                  <Typography variant="h6" className="font-semibold text-gray-900">OpenAI</Typography>
                  <Typography variant="body2" className="text-gray-500">AI研究公司</Typography>
                </div>
              </div>
              
              <Typography variant="body2" className="text-gray-600 mb-4">
                领先的AI研究公司，提供GPT系列模型，在自然语言处理和代码生成方面表现优异。
              </Typography>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>模型数量: 20</span>
                <span>评分: ⭐⭐⭐⭐⭐</span>
              </div>
              
              {/* Overlay Buttons - Only visible on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 opacity-0 group-hover:opacity-100">
                <div className="flex space-x-4 w-full px-6 absolute bottom-6">
                  <Button
                    variant="contained"
                    size="large"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    安装
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    className="flex-1 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    详情
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Anthropic */}
          <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                  </div>
                <div>
                  <Typography variant="h6" className="font-semibold text-gray-900">Anthropic</Typography>
                  <Typography variant="body2" className="text-gray-500">AI安全公司</Typography>
                </div>
              </div>
              
              <Typography variant="body2" className="text-gray-600 mb-4">
                专注于AI安全和伦理的AI公司，提供Claude系列模型，在对话和推理方面表现优异。
              </Typography>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>模型数量: 10</span>
                <span>评分: ⭐⭐⭐⭐⭐</span>
              </div>
              
              {/* Overlay Buttons - Only visible on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 opacity-0 group-hover:opacity-100">
                <div className="flex space-x-4 w-full px-6 absolute bottom-6">
                  <Button
                    variant="contained"
                    size="large"
                    className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    安装
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    className="flex-1 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
                  >
                    详情
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
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