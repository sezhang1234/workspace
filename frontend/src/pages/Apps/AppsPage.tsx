import React, { useState } from 'react'
import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  FormGroup,
  Divider,
  Box,
  Alert,
  Snackbar
} from '@mui/material'
import { 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  Brain, 
  Code, 
  Database, 
  Calculator,
  BookOpen,
  MessageSquare,
  Zap,
  Settings,
  Play,
  Copy,
  Star,
  Eye,
  Download
} from 'lucide-react'

interface AgentTemplate {
  id: string
  name: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  icon: React.ReactNode
  usageCount: number
  rating: number
  isCustomizable: boolean
  features: string[]
  estimatedTime: string
}

const agentTemplates: AgentTemplate[] = [
  {
    id: 'deep-research',
    name: 'DeepResearch Agent',
    description: '智能研究助手，能够深入分析学术论文、研究报告和复杂文档，提供详细的见解和总结。',
    category: '研究分析',
    difficulty: 'intermediate',
    tags: ['研究', '分析', '学术', '文档处理'],
    icon: <BookOpen className="w-8 h-8" />,
    usageCount: 1247,
    rating: 4.8,
    isCustomizable: true,
    features: ['多文档分析', '学术引用', '深度总结', '研究建议'],
    estimatedTime: '5-10分钟'
  },
  {
    id: 'data-analyst',
    name: 'Data Analysis Agent',
    description: '专业数据分析智能体，能够处理各种数据格式，生成可视化图表和洞察报告。',
    category: '数据分析',
    difficulty: 'intermediate',
    tags: ['数据分析', '可视化', '统计', '报告'],
    icon: <Database className="w-8 h-8" />,
    usageCount: 2156,
    rating: 4.9,
    isCustomizable: true,
    features: ['数据清洗', '统计分析', '图表生成', '趋势预测'],
    estimatedTime: '3-8分钟'
  },
  {
    id: 'code-assistant',
    name: 'Code Assistant Agent',
    description: '编程助手智能体，支持多种编程语言，提供代码审查、优化建议和调试帮助。',
    category: '编程开发',
    difficulty: 'advanced',
    tags: ['编程', '代码审查', '调试', '优化'],
    icon: <Code className="w-8 h-8" />,
    usageCount: 3421,
    rating: 4.7,
    isCustomizable: true,
    features: ['多语言支持', '代码审查', '性能优化', '单元测试'],
    estimatedTime: '2-5分钟'
  },
  {
    id: 'compute-user',
    name: 'Compute User Agent',
    description: '计算用户智能体，专门处理数学计算、公式推导和复杂算法问题。',
    category: '数学计算',
    difficulty: 'advanced',
    tags: ['数学', '计算', '算法', '公式'],
    icon: <Calculator className="w-8 h-8" />,
    usageCount: 987,
    rating: 4.6,
    isCustomizable: true,
    features: ['数学计算', '公式推导', '算法分析', '数值模拟'],
    estimatedTime: '1-3分钟'
  },
  {
    id: 'conversation',
    name: 'Conversation Agent',
    description: '对话智能体，能够进行自然语言对话，支持多轮交互和上下文理解。',
    category: '对话交互',
    difficulty: 'beginner',
    tags: ['对话', '交互', '自然语言', '上下文'],
    icon: <MessageSquare className="w-8 h-8" />,
    usageCount: 5678,
    rating: 4.5,
    isCustomizable: true,
    features: ['多轮对话', '上下文理解', '情感分析', '个性化回复'],
    estimatedTime: '实时'
  },
  {
    id: 'workflow-automation',
    name: 'Workflow Automation Agent',
    description: '工作流自动化智能体，能够设计和执行复杂的业务流程和自动化任务。',
    category: '流程自动化',
    difficulty: 'advanced',
    tags: ['自动化', '工作流', '业务流程', '任务执行'],
    icon: <Zap className="w-8 h-8" />,
    usageCount: 1567,
    rating: 4.8,
    isCustomizable: true,
    features: ['流程设计', '任务编排', '条件判断', '错误处理'],
    estimatedTime: '10-20分钟'
  }
]

const AppsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null)
  const [customizationData, setCustomizationData] = useState({
    name: '',
    description: '',
    category: '',
    tags: '',
    features: [] as string[]
  })
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any })

  const categories = ['all', '研究分析', '数据分析', '编程开发', '数学计算', '对话交互', '流程自动化']
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced']

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '初级'
      case 'intermediate': return '中级'
      case 'advanced': return '高级'
      default: return '未知'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredTemplates = agentTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const handleUseTemplate = (template: AgentTemplate) => {
    if (template.isCustomizable) {
      setSelectedTemplate(template)
      setCustomizationData({
        name: template.name,
        description: template.description,
        category: template.category,
        tags: template.tags.join(', '),
        features: template.features
      })
      setShowCustomizeDialog(true)
    } else {
      // Direct usage without customization
      setSnackbar({ open: true, message: `正在使用 ${template.name}...`, severity: 'success' })
    }
  }

  const handleCustomize = () => {
    if (selectedTemplate) {
      setSnackbar({ open: true, message: `正在创建自定义 ${selectedTemplate.name}...`, severity: 'success' })
      setShowCustomizeDialog(false)
    }
  }

  const handleCopyTemplate = (template: AgentTemplate) => {
    navigator.clipboard.writeText(JSON.stringify(template, null, 2))
    setSnackbar({ open: true, message: '模板信息已复制到剪贴板', severity: 'info' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Typography variant="h4" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800 mb-2">
              应用空间
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              探索和使用预构建的智能体模板，快速创建专业应用
            </Typography>
          </div>
          <Button
            variant="contained"
            size="large"
            startIcon={<Plus />}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            创建自定义应用
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <TextField
                fullWidth
                placeholder="搜索智能体模板..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="[& .MuiOutlinedInput-root]:rounded-xl [& .MuiOutlinedInput-root]:border-gray-200 [& .MuiOutlinedInput-root]:focus:border-blue-300 [& .MuiOutlinedInput-root]:focus:ring-blue-500"
                InputProps={{
                  startAdornment: null,
                  style: { paddingLeft: '2.5rem' }
                }}
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <FormControl className="min-w-[140px]">
              <InputLabel>分类</InputLabel>
              <Select
                value={selectedCategory}
                label="分类"
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="[& .MuiOutlinedInput-root]:rounded-xl [& .MuiOutlinedInput-root]:border-gray-200 [& .MuiOutlinedInput-root]:focus:border-blue-300 [& .MuiOutlinedInput-root]:focus:ring-blue-500"
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category === 'all' ? '全部分类' : category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl className="min-w-[140px]">
              <InputLabel>难度</InputLabel>
              <Select
                value={selectedDifficulty}
                label="难度"
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="[& .MuiOutlinedInput-root]:rounded-xl [& .MuiOutlinedInput-root]:border-gray-200 [& .MuiOutlinedInput-root]:focus:border-blue-300 [& .MuiOutlinedInput-root]:focus:ring-blue-500"
              >
                {difficulties.map(difficulty => (
                  <MenuItem key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? '全部难度' : getDifficultyText(difficulty)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white">
                    {template.icon}
                  </div>
                  <div>
                    <Typography variant="h6" className="font-semibold text-gray-900 mb-1">
                      {template.name}
                    </Typography>
                    <Chip
                      label={getDifficultyText(template.difficulty)}
                      className={`text-xs ${getDifficultyColor(template.difficulty)}`}
                      size="small"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{template.rating}</span>
                </div>
              </div>

              {/* Description */}
              <Typography variant="body2" className="text-gray-600 mb-4 line-clamp-3">
                {template.description}
              </Typography>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {template.tags.slice(0, 3).map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  />
                ))}
                {template.tags.length > 3 && (
                  <Chip
                    label={`+${template.tags.length - 3}`}
                    size="small"
                    className="bg-gray-50 text-gray-600 border-gray-200"
                  />
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>使用次数: {template.usageCount.toLocaleString()}</span>
                <span>预计时间: {template.estimatedTime}</span>
              </div>

              {/* Features */}
              <div className="mb-4">
                <Typography variant="caption" className="text-gray-500 mb-2 block">
                  主要功能:
                </Typography>
                <div className="flex flex-wrap gap-1">
                  {template.features.slice(0, 2).map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      size="small"
                      className="bg-green-50 text-green-700 border-green-200 text-xs"
                    />
                  ))}
                  {template.features.length > 2 && (
                    <Chip
                      label={`+${template.features.length - 2}`}
                      size="small"
                      className="bg-gray-50 text-gray-600 border-gray-200 text-xs"
                    />
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={template.isCustomizable ? <Settings /> : <Play />}
                  onClick={() => handleUseTemplate(template)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  {template.isCustomizable ? '自定义使用' : '直接使用'}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Copy />}
                  onClick={() => handleCopyTemplate(template)}
                  className="border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                >
                  复制
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customization Dialog */}
      <Dialog 
        open={showCustomizeDialog} 
        onClose={() => setShowCustomizeDialog(false)}
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
              自定义 {selectedTemplate?.name}
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent className="pt-6">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="应用名称"
                value={customizationData.name}
                onChange={(e) => setCustomizationData({ ...customizationData, name: e.target.value })}
                placeholder="输入自定义应用名称"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>分类</InputLabel>
                <Select
                  value={customizationData.category}
                  label="分类"
                  onChange={(e) => setCustomizationData({ ...customizationData, category: e.target.value })}
                >
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="描述"
                value={customizationData.description}
                onChange={(e) => setCustomizationData({ ...customizationData, description: e.target.value })}
                placeholder="描述您的自定义应用..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="标签"
                value={customizationData.tags}
                onChange={(e) => setCustomizationData({ ...customizationData, tags: e.target.value })}
                placeholder="用逗号分隔多个标签"
                helperText="例如: 研究, 分析, 学术"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" className="mb-2">功能特性</Typography>
              <FormGroup>
                {selectedTemplate?.features.map((feature, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Switch
                        checked={customizationData.features.includes(feature)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCustomizationData({
                              ...customizationData,
                              features: [...customizationData.features, feature]
                            })
                          } else {
                            setCustomizationData({
                              ...customizationData,
                              features: customizationData.features.filter(f => f !== feature)
                            })
                          }
                        }}
                      />
                    }
                    label={feature}
                  />
                ))}
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="bg-gray-50 px-6 py-4">
          <Button 
            onClick={() => setShowCustomizeDialog(false)}
            className="text-gray-600 hover:text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-200"
          >
            取消
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCustomize}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            创建应用
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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

export default AppsPage