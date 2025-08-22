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
  Wand2
} from 'lucide-react'
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Tabs,
  Tab,
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Snackbar
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

interface PromptVersion {
  id: string
  version: string
  content: string
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
    language: isNew ? 'zh-CN' : 'zh-CN'
  })



  // Versions state
  const [versions, setVersions] = useState<PromptVersion[]>([
    {
      id: 'v1',
      version: '1.0.0',
      content: prompt.content,
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
      setTestResult(prompt.content)
      setIsTesting(false)
    }, 1000)
  }



  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt.content)
    setSnackbar({ open: true, message: '提示词已复制到剪贴板', severity: 'success' })
  }

  const generatePromptContent = () => {
    const category = prompt.category
    let generatedContent = ''
    
    switch (category) {
      case 'customer-service':
        generatedContent = `你是一个专业的客户服务代表，请根据以下信息，用友好、专业的态度回复客户：

客户问题：{{customer_question}}
客户情绪：{{customer_mood}}
产品信息：{{product_info}}

请确保回复：
1. 准确理解客户问题
2. 提供清晰的解决方案
3. 保持友好专业的语调
4. 在必要时询问更多信息
5. 体现专业性和同理心`
        break
        
      case 'content-creation':
        generatedContent = `你是一个专业的内容创作助手，请根据以下要求创作高质量内容：

主题：{{topic}}
目标受众：{{target_audience}}
内容类型：{{content_type}}
风格要求：{{style_requirements}}

请确保内容：
1. 结构清晰，逻辑连贯
2. 语言生动，富有感染力
3. 符合目标受众的阅读习惯
4. 包含实用的信息和见解
5. 具有原创性和创新性`
        break
        
      case 'data-analysis':
        generatedContent = `你是一个专业的数据分析师，请根据以下数据进行分析和解读：

数据来源：{{data_source}}
分析目标：{{analysis_goal}}
关键指标：{{key_metrics}}
时间范围：{{time_period}}

请提供：
1. 数据概览和关键发现
2. 趋势分析和模式识别
3. 异常值检测和解释
4. 数据质量评估
5.  actionable insights和建议`
        break
        
      case 'code-generation':
        generatedContent = `你是一个专业的程序员，请根据以下需求生成高质量的代码：

编程语言：{{programming_language}}
功能需求：{{functional_requirements}}
技术要求：{{technical_requirements}}
代码风格：{{code_style}}

请确保代码：
1. 功能完整，逻辑正确
2. 遵循最佳实践和设计模式
3. 具有良好的可读性和可维护性
4. 包含必要的注释和文档
5. 考虑边界情况和错误处理`
        break
        
      case 'translation':
        generatedContent = `你是一个专业的翻译专家，请将以下内容进行高质量的翻译：

原文语言：{{source_language}}
目标语言：{{target_language}}
内容类型：{{content_type}}
专业领域：{{domain}}

请确保翻译：
1. 准确传达原文含义
2. 符合目标语言的表达习惯
3. 保持原文的风格和语调
4. 使用恰当的术语和表达
5. 考虑文化背景和语境`
        break
        
      default:
        generatedContent = `你是一个专业的AI助手，请根据以下信息提供专业的帮助：

任务类型：{{task_type}}
具体要求：{{specific_requirements}}
背景信息：{{background_info}}
期望输出：{{expected_output}}

请确保：
1. 准确理解任务需求
2. 提供专业的解决方案
3. 保持清晰的逻辑结构
4. 使用恰当的表达方式
5. 在必要时询问澄清`
    }
    
    // Update prompt content
    setPrompt({ ...prompt, content: generatedContent })
    
    setSnackbar({ open: true, message: '提示词已自动生成！', severity: 'success' })
  }

  const handleExport = () => {
    const promptData = {
      prompt,
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
          setVersions(importedPrompt.versions)
          setSnackbar({ open: true, message: '提示词配置导入成功', severity: 'success' })
        } catch (error) {
          setSnackbar({ open: true, message: '导入失败：文件格式错误', severity: 'error' })
        }
      }
      reader.readAsText(file)
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      提示词内容
                    </label>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="small"
                        startIcon={<Wand2 />}
                        onClick={generatePromptContent}
                        className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300"
                      >
                        自动生成
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Copy />}
                        onClick={handleCopyPrompt}
                      >
                        复制
                      </Button>
                    </div>
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


              </div>
            </TabPanel>



            {/* 版本管理 */}
            <TabPanel value={activeTab} index={1}>
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
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              version.isActive 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {version.isActive ? '当前版本' : '历史版本'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabPanel>

            {/* 测试调试 */}
            <TabPanel value={activeTab} index={2}>
              <div className="space-y-6">
                <Typography variant="h6">测试提示词</Typography>
                
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