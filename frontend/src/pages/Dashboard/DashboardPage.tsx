import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Brain, 
  Workflow, 
  MessageSquare, 
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
      icon: Brain,
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
      icon: MessageSquare,
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
      status: 'scheduled',
      lastRun: '6小时前',
      successRate: '95%'
    }
  ]

  const quickActions = [
    {
      name: '创建智能体',
      description: '开始构建新的AI智能体',
      icon: Plus,
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
      icon: MessageSquare,
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
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">仪表板</h1>
          <p className="text-gray-600">欢迎回到 Jiuwen，查看您的智能体开发进度</p>
        </div>

      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className={`${action.color} text-white p-4 rounded-lg hover:shadow-lg transition-all duration-200`}
            >
              <div className="flex items-center space-x-3">
                <action.icon className="w-6 h-6" />
                <div>
                  <h3 className="font-medium">{action.name}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent agents */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">最近智能体</h2>
            <Link to="/dashboard/agents" className="text-sm text-blue-600 hover:text-blue-700">
              查看全部
            </Link>
          </div>
          <div className="space-y-3">
            {recentAgents.map((agent) => (
              <div key={agent.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="text-2xl">{agent.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                  <p className="text-xs text-gray-500">{agent.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {agent.status === 'active' ? '运行中' : '已停止'}
                    </span>
                    <span className="text-xs text-gray-400">{agent.lastActive}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Recent workflows */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">最近工作流</h2>
            <Link to="/dashboard/workflows" className="text-sm text-blue-600 hover:text-blue-700">
              查看全部
            </Link>
          </div>
          <div className="space-y-3">
            {recentWorkflows.map((workflow) => (
              <div key={workflow.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Workflow className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{workflow.name}</p>
                  <p className="text-xs text-gray-500">{workflow.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      workflow.status === 'running' ? 'bg-green-100 text-green-800' :
                      workflow.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {workflow.status === 'running' ? '运行中' : workflow.status === 'completed' ? '已完成' : '已计划'}
                    </span>
                    <span className="text-xs text-gray-400">成功率: {workflow.successRate}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{workflow.lastRun}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance overview */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">性能概览</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">98.5%</p>
            <p className="text-sm text-gray-600">系统可用性</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">2.3s</p>
            <p className="text-sm text-gray-600">平均响应时间</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">1,234</p>
            <p className="text-sm text-gray-600">本月活跃用户</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage