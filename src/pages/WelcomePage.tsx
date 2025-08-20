import React from 'react'
import { Link } from 'react-router-dom'
import JiuwenLogo from '../components/Common/JiuwenLogo'
import { 
  Brain, 
  Workflow, 
  MessageSquare, 
  Settings, 
  Zap, 
  Shield,
  ArrowRight,
  Play
} from 'lucide-react'

const WelcomePage: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: '智能体开发',
      description: '创建、训练和部署智能AI代理，支持多种LLM模型'
    },
    {
      icon: Workflow,
      title: '工作流编排',
      description: '可视化工作流设计器，拖拽式节点配置，复杂流程轻松构建'
    },
    {
      icon: MessageSquare,
      title: '提示词管理',
      description: '专业的提示词编辑器，支持版本控制和A/B测试'
    },
    {
      icon: Settings,
      title: '模型配置',
      description: '灵活配置各种LLM模型参数，支持自定义模型接入'
    },
    {
      icon: Zap,
      title: '性能优化',
      description: '智能缓存、并发控制、成本优化，提升系统性能'
    },
    {
      icon: Shield,
      title: '安全可靠',
      description: '企业级安全防护，数据加密，权限管理'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="relative z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <JiuwenLogo width={40} height={40} />
              </div>
              <span className="text-2xl font-bold text-gray-900">Jiuwen</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                登录
              </Link>
              <Link
                to="/login"
                className="btn-primary"
              >
                开始使用
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            下一代
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              智能体开发平台
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Jiuwen 为您提供完整的LLM智能体开发生态，从模型配置到工作流编排，
            从提示词优化到智能体部署，一站式解决AI应用开发的所有需求。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>立即开始</span>
            </Link>
            <button className="btn-secondary text-lg px-8 py-4 flex items-center justify-center space-x-2">
              <span>观看演示</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            强大功能，简单易用
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            专为开发者和企业打造的智能体开发平台，让AI应用开发变得前所未有的简单
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            准备好开始您的AI之旅了吗？
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            加入数千名开发者的行列，使用Jiuwen构建下一代AI应用
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-lg"
          >
            免费开始使用
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Jiuwen</span>
            </div>
            <p className="text-gray-400">
              © 2024 Jiuwen Agent Studio. 让AI开发更简单，让创新更高效。
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default WelcomePage