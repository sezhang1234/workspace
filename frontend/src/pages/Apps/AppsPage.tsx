import React, { useState } from 'react'
import { 
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
  Download,
  MoreVertical
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

  const categories = ['all', '研究分析', '数据分析', '编程开发', '数学计算']
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
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      {/* Page header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 mb-2">
          探索应用
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          探索和使用预构建的智能体模板，快速创建专业应用
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            <input
              type="text"
              placeholder="搜索智能体模板名称、描述或标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="sm:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? '全部分类' : category}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty filter */}
        <div className="sm:w-48">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty === 'all' ? '全部难度' : getDifficultyText(difficulty)}
              </option>
            ))}
          </select>
        </div>


      </div>

      {/* Templates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <div 
            key={template.id} 
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient top border */}
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
            
            {/* Template header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-blue-200">
                    {template.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">{template.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{template.rating}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{template.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {template.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all duration-200"
                  >
                    {tag}
                  </span>
                ))}
                {template.tags.length > 3 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                    +{template.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Difficulty and stats */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(template.difficulty)}`}>
                  {getDifficultyText(template.difficulty)}
                </span>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium">使用次数</p>
                  <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-blue-700">
                    {template.usageCount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2 font-medium">主要功能:</p>
                <div className="flex flex-wrap gap-1">
                  {template.features.slice(0, 2).map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                    >
                      {feature}
                    </span>
                  ))}
                  {template.features.length > 2 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                      +{template.features.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Estimated time */}
              <p className="text-xs text-gray-500 mb-4 font-medium">预计时间: {template.estimatedTime}</p>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    title={template.isCustomizable ? '自定义使用' : '直接使用'}
                  >
                    {template.isCustomizable ? <Settings className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleCopyTemplate(template)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    title="添加到工作空间"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 mb-3">
            没有找到模板
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all'
              ? '尝试调整搜索条件或筛选器来找到您需要的智能体模板'
              : '开始探索预构建的智能体模板，快速创建专业应用'
            }
          </p>
          {!searchTerm && selectedCategory === 'all' && selectedDifficulty === 'all' && (
            <button
              onClick={() => setSnackbar({ open: true, message: '创建自定义应用功能开发中...', severity: 'info' })}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>创建自定义应用</span>
            </button>
          )}
        </div>
      )}

      {/* Customization Modal */}
      {showCustomizeDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <h6 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">
                  自定义 {selectedTemplate?.name}
                </h6>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">应用名称</label>
                  <input
                    type="text"
                    value={customizationData.name}
                    onChange={(e) => setCustomizationData({ ...customizationData, name: e.target.value })}
                    placeholder="输入自定义应用名称"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                  <select
                    value={customizationData.category}
                    onChange={(e) => setCustomizationData({ ...customizationData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
                  <textarea
                    value={customizationData.description}
                    onChange={(e) => setCustomizationData({ ...customizationData, description: e.target.value })}
                    placeholder="描述您的自定义应用..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">标签</label>
                  <input
                    type="text"
                    value={customizationData.tags}
                    onChange={(e) => setCustomizationData({ ...customizationData, tags: e.target.value })}
                    placeholder="用逗号分隔多个标签"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">例如: 研究, 分析, 学术</p>
                </div>
                
                <div className="md:col-span-2">
                  <h6 className="text-lg font-semibold text-gray-900 mb-4">功能特性</h6>
                  <div className="space-y-3">
                    {selectedTemplate?.features.map((feature, index) => (
                      <label key={index} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
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
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Actions */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end space-x-4">
              <button 
                onClick={() => setShowCustomizeDialog(false)}
                className="text-gray-600 hover:text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-200"
              >
                取消
              </button>
              <button 
                onClick={handleCustomize}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                创建应用
              </button>
            </div>
          </div>
        </div>
      )}

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