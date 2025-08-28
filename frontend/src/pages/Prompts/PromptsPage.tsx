import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  MoreVertical,
  Copy,
  Star,
  Eye,
  EyeOff,
  Tag,
  Bot,
  Code,
  Megaphone,
  FileText,
  Lightbulb,
  Brain,
  Zap,
  Settings
} from 'lucide-react'

interface Prompt {
  id: string
  name: string
  description: string
  content: string
  category: string
  tags: string[]
  version: string
  usageCount: number
  rating: number
  isPublic: boolean
  author: string
  createdAt: string
  lastModified: string
}

const PromptsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')

  // Function to get appropriate icon based on prompt category
  const getPromptIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case '客服':
        return Bot // Customer service - Bot icon
      case '编程':
        return Code // Programming - Code icon
      case '营销':
        return Megaphone // Marketing - Megaphone icon
      case '创意':
        return Lightbulb // Creative - Lightbulb icon
      case '分析':
        return Brain // Analysis - Brain icon
      case '自动化':
        return Zap // Automation - Zap icon
      case '配置':
        return Settings // Configuration - Settings icon
      case '文档':
        return FileText // Documentation - FileText icon
      default:
        return MessageSquare // Default - MessageSquare icon
    }
  }

  const prompts: Prompt[] = [
    {
      id: '1',
      name: '客服对话模板',
      description: '专业的客服对话提示词，支持多轮对话和问题解决',
      content: '你是一个专业的客服代表，请以友好、专业的态度帮助客户解决问题...',
      category: '客服',
      tags: ['客服', '对话', '问题解决', '友好'],
      version: '2.1.0',
      usageCount: 1234,
      rating: 4.8,
      isPublic: true,
      author: '客服团队',
      createdAt: '2024-01-15',
      lastModified: '2024-01-20'
    },
    {
      id: '2',
      name: '代码审查助手',
      description: '用于代码审查和优化的AI助手提示词',
      content: '你是一个经验丰富的软件工程师，请仔细审查以下代码...',
      category: '编程',
      tags: ['编程', '代码审查', '优化', '软件工程'],
      version: '1.5.2',
      usageCount: 890,
      rating: 4.9,
      isPublic: true,
      author: '开发团队',
      createdAt: '2024-01-10',
      lastModified: '2024-01-18'
    },
    {
      id: '3',
      name: '营销文案生成器',
      description: '生成吸引人的营销文案和广告语',
      content: '你是一个创意营销专家，请为以下产品创建吸引人的营销文案...',
      category: '营销',
      tags: ['营销', '文案', '创意', '广告'],
      version: '1.2.0',
      usageCount: 567,
      rating: 4.6,
      isPublic: false,
      author: '营销团队',
      createdAt: '2024-01-20',
      lastModified: '2024-01-25'
    },
    {
      id: '4',
      name: '创意写作助手',
      description: '激发创意灵感，帮助创作各种类型的文学作品',
      content: '你是一个富有想象力的创意写作专家，请帮助用户创作...',
      category: '创意',
      tags: ['创意', '写作', '文学', '灵感'],
      version: '1.0.0',
      usageCount: 345,
      rating: 4.7,
      isPublic: true,
      author: '创意团队',
      createdAt: '2024-01-22',
      lastModified: '2024-01-26'
    },
    {
      id: '5',
      name: '数据分析专家',
      description: '专业的数据分析和洞察生成提示词',
      content: '你是一个数据分析专家，请帮助用户分析以下数据...',
      category: '分析',
      tags: ['分析', '数据', '洞察', '统计'],
      version: '2.0.1',
      usageCount: 678,
      rating: 4.8,
      isPublic: true,
      author: '数据团队',
      createdAt: '2024-01-18',
      lastModified: '2024-01-24'
    },
    {
      id: '6',
      name: '工作流自动化',
      description: '自动化工作流程和任务执行的提示词',
      content: '你是一个工作流自动化专家，请帮助用户设计自动化流程...',
      category: '自动化',
      tags: ['自动化', '工作流', '效率', '流程'],
      version: '1.3.0',
      usageCount: 234,
      rating: 4.5,
      isPublic: false,
      author: '自动化团队',
      createdAt: '2024-01-25',
      lastModified: '2024-01-27'
    }
  ]

  const categories = [
    { value: 'all', label: '所有分类' },
    { value: '客服', label: '客服' },
    { value: '编程', label: '编程' },
    { value: '营销', label: '营销' },
    { value: '创意', label: '创意' },
    { value: '分析', label: '分析' },
    { value: '自动化', label: '自动化' }
  ]

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = categoryFilter === 'all' || prompt.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }
    
    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
    }
    
    return stars
  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      {/* Page header */}
      <div className="text-center mb-8">

        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 mb-2">
          提示词管理
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          创建、管理和优化您的AI提示词模板，构建智能对话系统
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
              placeholder="搜索提示词名称、描述或标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="sm:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort by */}
        <div className="sm:w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white"
          >
            <option value="name">按名称排序</option>
            <option value="created">按创建时间排序</option>
            <option value="usage">按使用次数排序</option>
            <option value="rating">按评分排序</option>
            <option value="modified">按修改时间排序</option>
          </select>
        </div>

        {/* Create Prompt Button */}
        <Link
          to="/dashboard/prompts/new"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>创建提示词</span>
        </Link>
      </div>

      {/* Prompts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map((prompt, index) => (
          <div 
            key={prompt.id} 
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient top border */}
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
            
            {/* Prompt header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-blue-200">
                    {React.createElement(getPromptIcon(prompt.category), { className: "w-6 h-6 text-blue-600" })}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">
                      {prompt.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">{prompt.category}</p>
                  </div>
                </div>
                <div className="relative">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{prompt.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {prompt.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all duration-200"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
                {prompt.tags.length > 3 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                    +{prompt.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">使用次数</p>
                  <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-blue-700">
                    {prompt.usageCount.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">版本</p>
                  <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-blue-700">
                    {prompt.version}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">评分</p>
                  <div className="flex items-center justify-center space-x-1">
                    {renderStars(prompt.rating)}
                    <span className="text-sm text-gray-600 ml-1">({prompt.rating})</span>
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">作者</p>
                  <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-blue-700">
                    {prompt.author}
                  </p>
                </div>
              </div>

              {/* Visibility and dates */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                  prompt.isPublic ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'
                }`}>
                  {prompt.isPublic ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                  {prompt.isPublic ? '公开' : '私有'}
                </span>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium">最后修改</p>
                  <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-blue-700">
                    {prompt.lastModified}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/dashboard/prompts/${prompt.id}`}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200">
                    <Star className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredPrompts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 mb-3">
            没有找到提示词
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            {searchTerm || categoryFilter !== 'all' 
              ? '尝试调整搜索条件或筛选器来找到您需要的提示词'
              : '开始创建您的第一个提示词模板，构建智能对话系统'
            }
          </p>
          {!searchTerm && categoryFilter === 'all' && (
            <Link
              to="/dashboard/prompts/new"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>创建提示词</span>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default PromptsPage