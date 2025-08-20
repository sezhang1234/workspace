import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Save, 
  Play, 
  Copy,
  Download,
  Upload,
  Trash2,
  TestTube,
  Eye,
  EyeOff,
  Plus,
  Minus
} from 'lucide-react'
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Switch, 
  FormControlLabel,
  Chip,
  Tabs,
  Tab,
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Snackbar,
  IconButton
} from '@mui/material'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`prompt-tabpanel-${index}`}
      aria-labelledby={`prompt-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

interface PromptParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select'
  description: string
  required: boolean
  defaultValue?: string | number | boolean
  options?: string[]
}

interface PromptVersion {
  id: string
  version: string
  content: string
  parameters: PromptParameter[]
  createdAt: string
  isActive: boolean
  performance: {
    usage: number
    rating: number
    successRate: number
  }
}

const PromptEditorPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const [activeTab, setActiveTab] = useState(0)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
  const [showPreview, setShowPreview] = useState(false)


  // Prompt state
  const [prompt, setPrompt] = useState({
    name: isNew ? '' : '客户服务回复模板',
    description: isNew ? '' : '专业的客户服务回复提示词模板',
    category: isNew ? 'customer-service' : 'customer-service',
    content: isNew ? '' : '你是一个专业的客户服务代表。请根据以下信息，用友好、专业的态度回复客户：\n\n客户问题：{{customer_question}}\n客户情绪：{{customer_mood}}\n产品信息：{{product_info}}\n\n请确保回复：\n1. 准确理解客户问题\n2. 提供清晰的解决方案\n3. 保持友好专业的语调\n4. 在必要时询问更多信息',
    tags: isNew ? [] : ['客服', '回复模板', '专业'],
    isPublic: isNew ? false : false,
    language: isNew ? 'zh-CN' : 'zh-CN'
  })

  // Parameters state
  const [parameters, setParameters] = useState<PromptParameter[]>([
    {
      name: 'customer_question',
      type: 'string',
      description: '客户的具体问题或咨询',
      required: true,
      defaultValue: ''
    },
    {
      name: 'customer_mood',
      type: 'select',
      description: '客户的情绪状态',
      required: false,
      defaultValue: 'neutral',
      options: ['positive', 'neutral', 'negative', 'angry']
    },
    {
      name: 'product_info',
      type: 'string',
      description: '相关产品信息',
      required: false,
      defaultValue: ''
    }
  ])

  // Versions state
  const [versions, setVersions] = useState<PromptVersion[]>([
    {
      id: 'v1',
      version: '1.0.0',
      content: prompt.content,
      parameters: parameters,
      createdAt: '2024-01-15T10:00:00Z',
      isActive: true,
      performance: {
        usage: 1250,
        rating: 4.8,
        successRate: 95.2
      }
    }
  ])

  // Test state
  const [testValues, setTestValues] = useState<Record<string, any>>({})
  const [testResult, setTestResult] = useState('')
  const [isTesting, setIsTesting] = useState(false)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleSave = () => {
    // Create new version
    const newVersion: PromptVersion = {
      id: `v${versions.length + 1}`,
      version: `${Math.floor(versions.length / 10) + 1}.${versions.length % 10}.0`,
      content: prompt.content,
      parameters: parameters,
      createdAt: new Date().toISOString(),
      isActive: true,
      performance: {
        usage: 0,
        rating: 0,
        successRate: 0
      }
    }

    // Deactivate previous versions
    const updatedVersions = versions.map(v => ({ ...v, isActive: false }))
    setVersions([...updatedVersions, newVersion])
    
    setSnackbar({ open: true, message: '提示词保存成功！新版本已创建', severity: 'success' })
  }

  const handleTest = async () => {
    if (!prompt.content) return
    
    setIsTesting(true)
    
    // Simulate prompt processing
    setTimeout(() => {
      let processedContent = prompt.content
      
      // Replace parameters with test values
      parameters.forEach(param => {
        const value = testValues[param.name] || param.defaultValue || `{{${param.name}}}`
        processedContent = processedContent.replace(new RegExp(`{{${param.name}}}`, 'g'), String(value))
      })
      
      setTestResult(processedContent)
      setIsTesting(false)
    }, 1000)
  }

  const addParameter = () => {
    const newParameter: PromptParameter = {
      name: `param_${parameters.length + 1}`,
      type: 'string',
      description: '',
      required: false,
      defaultValue: ''
    }
    setParameters([...parameters, newParameter])
  }

  const removeParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index))
  }

  const updateParameter = (index: number, updates: Partial<PromptParameter>) => {
    const updatedParameters = [...parameters]
    updatedParameters[index] = { ...updatedParameters[index], ...updates }
    setParameters(updatedParameters)
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt.content)
    setSnackbar({ open: true, message: '提示词已复制到剪贴板', severity: 'success' })
  }

  const handleExport = () => {
    const promptData = {
      prompt,
      parameters,
      versions
    }
    const dataStr = JSON.stringify(promptData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${prompt.name || 'prompt'}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedPrompt = JSON.parse(e.target?.result as string)
          setPrompt(importedPrompt.prompt)
          setParameters(importedPrompt.parameters)
          setVersions(importedPrompt.versions)
          setSnackbar({ open: true, message: '提示词配置导入成功', severity: 'success' })
        } catch (error) {
          setSnackbar({ open: true, message: '导入失败：文件格式错误', severity: 'error' })
        }
      }
      reader.readAsText(file)
    }
  }

  const renderParameterInput = (param: PromptParameter, _index: number) => {
    switch (param.type) {
      case 'string':
        return (
          <TextField
            fullWidth
            size="small"
            label={param.name}
            value={testValues[param.name] || param.defaultValue || ''}
            onChange={(e) => setTestValues({ ...testValues, [param.name]: e.target.value })}
            placeholder={`输入 ${param.name}`}
          />
        )
      case 'number':
        return (
          <TextField
            fullWidth
            size="small"
            type="number"
            label={param.name}
            value={testValues[param.name] || param.defaultValue || ''}
            onChange={(e) => setTestValues({ ...testValues, [param.name]: e.target.value })}
            placeholder={`输入 ${param.name}`}
          />
        )
      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={testValues[param.name] ?? param.defaultValue ?? false}
                onChange={(e) => setTestValues({ ...testValues, [param.name]: e.target.checked })}
              />
            }
            label={param.name}
          />
        )
      case 'select':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{param.name}</InputLabel>
            <Select
              value={testValues[param.name] || param.defaultValue || ''}
              label={param.name}
              onChange={(e) => setTestValues({ ...testValues, [param.name]: e.target.value })}
            >
              {param.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outlined"
            startIcon={<ArrowLeft />}
            onClick={() => navigate('/dashboard/prompts')}
          >
            返回
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? '创建提示词' : '编辑提示词'}
            </h1>
            <p className="text-gray-600">
              {isNew ? '开始编写您的AI提示词模板' : '修改提示词内容和参数'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outlined"
            startIcon={showPreview ? <EyeOff /> : <Eye />}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? '隐藏预览' : '显示预览'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<TestTube />}
            onClick={() => setActiveTab(3)}
          >
            测试
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
          >
            保存
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="lg:col-span-2">
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={handleTabChange} aria-label="提示词编辑标签页">
                <Tab label="编写提示词" />
                <Tab label="参数配置" />
                <Tab label="版本管理" />
                <Tab label="测试调试" />
              </Tabs>
            </Box>

            {/* 编写提示词 */}
            <TabPanel value={activeTab} index={0}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField
                    fullWidth
                    label="提示词名称"
                    value={prompt.name}
                    onChange={(e) => setPrompt({ ...prompt, name: e.target.value })}
                    placeholder="例如：客户服务回复模板"
                  />
                  
                  <FormControl fullWidth>
                    <InputLabel>分类</InputLabel>
                    <Select
                      value={prompt.category}
                      label="分类"
                      onChange={(e) => setPrompt({ ...prompt, category: e.target.value })}
                    >
                      <MenuItem value="customer-service">客户服务</MenuItem>
                      <MenuItem value="content-creation">内容创作</MenuItem>
                      <MenuItem value="data-analysis">数据分析</MenuItem>
                      <MenuItem value="code-generation">代码生成</MenuItem>
                      <MenuItem value="translation">翻译</MenuItem>
                      <MenuItem value="other">其他</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="描述"
                  value={prompt.description}
                  onChange={(e) => setPrompt({ ...prompt, description: e.target.value })}
                  placeholder="描述提示词的用途和特点"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    标签
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {prompt.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => setPrompt({ 
                          ...prompt, 
                          tags: prompt.tags.filter((_, i) => i !== index) 
                        })}
                      />
                    ))}
                    <TextField
                      size="small"
                      placeholder="添加标签"
                      onKeyPress={(e) => {
                        const target = e.currentTarget as HTMLInputElement
                        if (e.key === 'Enter' && target.value.trim()) {
                          setPrompt({
                            ...prompt,
                            tags: [...prompt.tags, target.value.trim()]
                          })
                          target.value = ''
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      提示词内容
                    </label>
                    <Button
                      size="small"
                      startIcon={<Copy />}
                      onClick={handleCopyPrompt}
                    >
                      复制
                    </Button>
                  </div>
                  <TextField
                    fullWidth
                    multiline
                    rows={12}
                    value={prompt.content}
                    onChange={(e) => setPrompt({ ...prompt, content: e.target.value })}
                    placeholder="在这里编写您的提示词模板...\n\n使用 {{参数名}} 来定义变量，例如：\n{{customer_name}} 您好，请问有什么可以帮助您的？"
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    提示：使用 {'{{参数名}}'} 语法来定义变量，这些变量将在运行时被实际值替换。
                  </div>
                </div>

                <FormControlLabel
                  control={
                    <Switch
                      checked={prompt.isPublic}
                      onChange={(e) => setPrompt({ ...prompt, isPublic: e.target.checked })}
                    />
                  }
                  label="公开分享此提示词"
                />
              </div>
            </TabPanel>

            {/* 参数配置 */}
            <TabPanel value={activeTab} index={1}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Typography variant="h6">参数配置</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Plus />}
                    onClick={addParameter}
                  >
                    添加参数
                  </Button>
                </div>

                <div className="space-y-4">
                  {parameters.map((param, index) => (
                    <Card key={index} variant="outlined">
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          <TextField
                            size="small"
                            label="参数名"
                            value={param.name}
                            onChange={(e) => updateParameter(index, { name: e.target.value })}
                          />
                          
                          <FormControl size="small">
                            <InputLabel>类型</InputLabel>
                            <Select
                              value={param.type}
                              label="类型"
                              onChange={(e) => updateParameter(index, { type: e.target.value as any })}
                            >
                              <MenuItem value="string">文本</MenuItem>
                              <MenuItem value="number">数字</MenuItem>
                              <MenuItem value="boolean">布尔值</MenuItem>
                              <MenuItem value="select">选择</MenuItem>
                            </Select>
                          </FormControl>

                          <TextField
                            size="small"
                            label="默认值"
                            value={param.defaultValue || ''}
                            onChange={(e) => updateParameter(index, { defaultValue: e.target.value })}
                          />

                          <div className="flex items-center space-x-2">
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={param.required}
                                  onChange={(e) => updateParameter(index, { required: e.target.checked })}
                                />
                              }
                              label="必填"
                            />
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeParameter(index)}
                            >
                              <Minus className="w-4 h-4" />
                            </IconButton>
                          </div>
                        </div>

                        <TextField
                          fullWidth
                          size="small"
                          label="描述"
                          value={param.description}
                          onChange={(e) => updateParameter(index, { description: e.target.value })}
                          placeholder="描述此参数的用途"
                          className="mt-3"
                        />

                        {param.type === 'select' && (
                          <TextField
                            fullWidth
                            size="small"
                            label="选项（用逗号分隔）"
                            value={param.options?.join(', ') || ''}
                            onChange={(e) => updateParameter(index, { 
                              options: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                            })}
                            placeholder="选项1, 选项2, 选项3"
                            className="mt-3"
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Alert severity="info">
                  <Typography variant="body2">
                    参数配置提示：为每个参数提供清晰的描述和合适的默认值，这样用户在使用时就能更好地理解如何填写。
                  </Typography>
                </Alert>
              </div>
            </TabPanel>

            {/* 版本管理 */}
            <TabPanel value={activeTab} index={2}>
              <div className="space-y-6">
                <Typography variant="h6">版本历史</Typography>
                
                <div className="space-y-3">
                  {versions.map((version) => (
                    <Card key={version.id} variant="outlined">
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <Typography variant="h6">版本 {version.version}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              创建于 {new Date(version.createdAt).toLocaleString('zh-CN')}
                            </Typography>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-sm text-gray-500">使用次数</div>
                              <div className="font-medium">{version.performance.usage}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-500">评分</div>
                              <div className="font-medium">{version.performance.rating}/5.0</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-500">成功率</div>
                              <div className="font-medium">{version.performance.successRate}%</div>
                            </div>
                            <Chip
                              label={version.isActive ? '当前版本' : '历史版本'}
                              color={version.isActive ? 'primary' : 'default'}
                              size="small"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabPanel>

            {/* 测试调试 */}
            <TabPanel value={activeTab} index={3}>
              <div className="space-y-6">
                <Typography variant="h6">测试提示词</Typography>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {parameters.map((param) => (
                    <div key={param.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {param.name} {param.required && <span className="text-red-500">*</span>}
                      </label>
                      {renderParameterInput(param, 0)}
                      {param.description && (
                        <div className="text-xs text-gray-500 mt-1">{param.description}</div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="contained"
                    startIcon={<Play />}
                    onClick={handleTest}
                    disabled={isTesting}
                  >
                    {isTesting ? '测试中...' : '测试提示词'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setTestValues({})
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
            </TabPanel>
          </Card>
        </div>

        {/* Right sidebar - Preview and actions */}
        <div className="lg:col-span-1 space-y-4">
          {showPreview && (
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">实时预览</Typography>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">{prompt.content}</pre>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4">快速操作</Typography>
              <div className="space-y-2">
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Upload />}
                  component="label"
                >
                  导入配置
                  <input
                    type="file"
                    hidden
                    accept=".json"
                    onChange={handleImport}
                  />
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleExport}
                >
                  导出配置
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4">统计信息</Typography>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>总使用次数:</span>
                  <span className="font-medium">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span>平均评分:</span>
                  <span className="font-medium text-yellow-600">4.6/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span>成功率:</span>
                  <span className="font-medium text-green-600">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>版本数量:</span>
                  <span className="font-medium">{versions.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<Trash2 />}
            onClick={() => {
              if (confirm('确定要删除这个提示词吗？')) {
                navigate('/dashboard/prompts')
              }
            }}
          >
            删除提示词
          </Button>
        </div>
      </div>

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

export default PromptEditorPage