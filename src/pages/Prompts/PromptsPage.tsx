import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  MoreVertical,
  Settings,
  Copy,
  Star,
  Eye,
  Download,
  Tag,
  Calendar,
  BarChart3
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
      name: '数据分析报告',
      description: '自动生成数据分析报告和洞察',
      content: '请分析以下数据并生成详细的分析报告，包括关键指标、趋势分析...',
      category: '分析',
      tags: ['数据分析', '报告', '洞察', '趋势'],
      version: '1.8.1',
      usageCount: 345,
      rating: 4.7,
      isPublic: true,
      author: '数据团队',
      createdAt: '2024-01-12',
      lastModified: '2024-01-22'
    },
    {
      id: '5',
      name: '翻译优化助手',
      description: '优化和润色翻译文本，提升语言质量',
      content: '你是一个专业的翻译专家，请优化以下翻译文本，使其更加自然流畅...',
      category: '语言',
      tags: ['翻译', '优化', '语言质量', '润色'],
      version: '1.3.0',
      usageCount: 234,
      rating: 4.5,
      isPublic: true,
      author: '国际化团队',
      createdAt: '2024-01-18',
      lastModified: '2024-01-24'
    },
    {
      id: '6',
      name: '产品描述生成',
      description: '生成详细的产品描述和特性介绍',
      content: '请为以下产品生成详细的产品描述，突出其核心特性和优势...',
      category: '产品',
      tags: ['产品', '描述', '特性', '介绍'],
      version: '1.0.0',
      usageCount: 123,
      rating: 4.4,
      isPublic: false,
      author: '产品团队',
      createdAt: '2024-01-25',
      lastModified: '2024-01-25'
    }
  ]

  const categories = [
    { value: 'all', label: '所有分类' },
    { value: '客服', label: '客服' },
    { value: '编程', label: '编程' },
    { value: '营销', label: '营销' },
    { value: '分析', label: '分析' },
    { value: '语言', label: '语言' },
    { value: '产品', label: '产品' }
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
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">提示词管理</h1>
          <p className="text-gray-600">创建、管理和优化您的AI提示词模板</p>
        </div>
        <Link
          to="/dashboard/prompts/new"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>创建提示词</span>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索提示词名称、描述或标签..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category filter */}
          <div className="sm:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">按名称排序</option>
              <option value="created">按创建时间排序</option>
              <option value="usage">按使用次数排序</option>
              <option value="rating">按评分排序</option>
              <option value="modified">按修改时间排序</option>
            </select>
          </div>
        </div>
      </div>

      {/* Prompts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map((prompt) => (
          <div key={prompt.id} className="card hover:shadow-lg transition-shadow duration-200">
            {/* Prompt header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{prompt.name}</h3>
                  <p className="text-sm text-gray-500">{prompt.category}</p>
                </div>
              </div>
              <div className="relative">
                <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">{prompt.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {prompt.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
              {prompt.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{prompt.tags.length - 3}
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">使用次数</p>
                <p className="text-sm font-medium text-gray-900">{prompt.usageCount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">版本</p>
                <p className="text-sm font-medium text-gray-900">{prompt.version}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">评分</p>
                <div className="flex items-center space-x-1">
                  {renderStars(prompt.rating)}
                  <span className="text-sm text-gray-600 ml-1">({prompt.rating})</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">作者</p>
                <p className="text-sm font-medium text-gray-900">{prompt.author}</p>
              </div>
            </div>

            {/* Visibility and dates */}
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                prompt.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                <Eye className="w-3 h-3 mr-1" />
                {prompt.isPublic ? '公开' : '私有'}
              </span>
              <div className="text-right">
                <p className="text-xs text-gray-500">最后修改</p>
                <p className="text-sm font-medium text-gray-900">{prompt.lastModified}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Link
                  to={`/dashboard/prompts/${prompt.id}`}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到提示词</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || categoryFilter !== 'all' 
              ? '尝试调整搜索条件或筛选器'
              : '开始创建您的第一个提示词模板'
            }
          </p>
          {!searchTerm && categoryFilter === 'all' && (
            <Link
              to="/dashboard/prompts/new"
              className="btn-primary"
            >
              创建提示词
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default PromptsPage