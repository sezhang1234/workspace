import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Bot, 
  Workflow, 
  FileText, 
  TrendingUp, 
  Users, 
  Zap,
  Plus,
  BarChart3
} from 'lucide-react'

const DashboardPage: React.FC = () => {
  const stats = [
    {
      name: '智能体总数',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: Bot,
      color: 'bg-blue-500'
    },
    {
      name: '工作流总数',
      value: '8',
      change: '+1',
      changeType: 'positive',
      icon: Workflow,
      color: 'bg-green-500'
    },
    {
      name: '提示词总数',
      value: '45',
      change: '+5',
      changeType: 'positive',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      name: '本月执行次数',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ]

  const recentAgents = [
    {
      id: 1,
      name: '客服助手',
      description: '智能客服机器人，支持多轮对话',
      status: 'active',
      lastActive: '2小时前',
      avatar: '🤖'
    },
    {
      id: 2,
      name: '数据分析师',
      description: '数据分析智能体，自动生成报告',
      status: 'active',
      lastActive: '1天前',
      avatar: '📊'
    },
    {
      id: 3,
      name: '代码助手',
      description: '编程辅助智能体，代码审查和优化',
      status: 'active',
      lastActive: '3小时前',
      avatar: '💻'
    }
  ]

  const recentWorkflows = [
    {
      id: 1,
      name: '订单处理流程',
      description: '自动化订单处理和状态更新',
      status: 'running',
      lastRun: '5分钟前',
      successRate: '98%'
    },
    {
      id: 2,
      name: '用户反馈分析',
      description: '收集和分析用户反馈数据',
      status: 'completed',
      lastRun: '1小时前',
      successRate: '100%'
    },
    {
      id: 3,
      name: '数据同步流程',
      description: '多系统数据同步和备份',
      status: 'completed',
      lastRun: '6小时前',
      successRate: '95%'
    }
  ]

  const quickActions = [
    {
      name: '创建智能体',
      description: '开始构建新的AI智能体',
      icon: Bot,
      href: '/dashboard/agents/new',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: '设计工作流',
      description: '使用可视化编辑器创建工作流',
      icon: Workflow,
      href: '/dashboard/workflows/new',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: '编写提示词',
      description: '创建和优化提示词模板',
      icon: FileText,
      href: '/dashboard/prompts/new',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      name: '查看分析',
      description: '查看详细的性能分析报告',
      icon: BarChart3,
      href: '/dashboard/analytics',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ]

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      {/* Page header */}
      <div className="text-center mb-8">

        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 mb-2">
          工作空间仪表板
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          欢迎回到 Jiuwen，探索您的AI智能体开发进度和系统性能
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={stat.name} 
            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Content */}
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 mb-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                      stat.changeType === 'positive' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            
            {/* Bottom accent */}
            <div className={`h-1 ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">
            快速操作
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={action.name}
              to={action.href}
              className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 hover:border-gray-300"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="relative flex items-center space-x-3">
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-6 h-6 text-white flex-shrink-0" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-300">
                    {action.name}
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    {action.description}
                  </p>
                </div>
              </div>
              
              {/* Arrow indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent agents */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-green-800">
                最近智能体
              </h2>
            </div>
            <Link to="/dashboard/agents" className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all duration-200">
              查看全部 →
            </Link>
          </div>
          <div className="space-y-4">
            {recentAgents.map((agent, index) => (
              <div 
                key={agent.id} 
                className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 border border-transparent hover:border-green-200"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{agent.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-green-900 transition-colors duration-300">
                    {agent.name}
                  </p>
                  <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    {agent.description}
                  </p>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                      agent.status === 'active' 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {agent.status === 'active' ? '🟢 运行中' : '⚫ 已停止'}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{agent.lastActive}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent workflows */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-3">
                <Workflow className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">
                最近工作流
              </h2>
            </div>
            <Link to="/dashboard/workflows" className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all duration-200">
              查看全部 →
            </Link>
          </div>
          <div className="space-y-4">
            {recentWorkflows.map((workflow, index) => (
              <div 
                key={workflow.id} 
                className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 border border-transparent hover:border-blue-200"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-blue-200">
                  <Workflow className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-300">
                    {workflow.name}
                  </p>
                  <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    {workflow.description}
                  </p>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                      workflow.status === 'running' 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-blue-100 text-blue-700 border-blue-200'
                    }`}>
                      {workflow.status === 'running' ? '🟢 运行中' : '🔵 已完成'}
                    </span>
                    <span className="text-xs text-gray-600 font-medium">成功率: {workflow.successRate}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium">{workflow.lastRun}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance overview */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-3">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-purple-800">
            性能概览
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group text-center p-6 rounded-xl hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300 border border-transparent hover:border-green-200">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-700 mb-2">
              98.5%
            </p>
            <p className="text-sm font-semibold text-gray-700 group-hover:text-green-700 transition-colors duration-300">
              系统可用性
            </p>
          </div>
          <div className="group text-center p-6 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 border border-transparent hover:border-blue-200">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-700 mb-2">
              2.3s
            </p>
            <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors duration-300">
              平均响应时间
            </p>
          </div>
          <div className="group text-center p-6 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border border-transparent hover:border-purple-200">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Users className="w-10 h-10 text-white" />
            </div>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-700 mb-2">
              1,234
            </p>
            <p className="text-sm font-semibold text-gray-700 group-hover:text-purple-700 transition-colors duration-300">
              本月活跃用户
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage