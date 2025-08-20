import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { 
  Home, 
  Brain, 
  Workflow, 
  MessageSquare, 
  Database, 
  BarChart3, 
  Settings, 
  X, 
  ChevronRight,
  Zap,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const navigation = [
  { name: '仪表板', href: '/dashboard', icon: Home },
  { name: '智能体', href: '/dashboard/agents', icon: Brain },
  { name: '工作流', href: '/dashboard/workflows', icon: Workflow },
  { name: '提示词', href: '/dashboard/prompts', icon: MessageSquare },
  { name: '模型管理', href: '/dashboard/models', icon: Database },
  { name: '数据分析', href: '/dashboard/analytics', icon: BarChart3 },
  { name: '系统设置', href: '/dashboard/settings', icon: Settings },
]

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { user } = useAuthStore()
  const location = useLocation()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
      `}>
        <div className={`flex items-center justify-between h-16 border-b border-gray-200 ${isCollapsed ? 'px-4' : 'px-6'}`}>
          <div className={`flex items-center space-x-2 ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold text-gray-900">Jiuwen</span>
            )}
          </div>
          {/* Mobile close button only */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className={`border-b border-gray-200 ${isCollapsed ? 'px-2 py-4' : 'px-6 py-4'}`}>
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <img
              className="w-10 h-10 rounded-full"
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
              alt={user?.username}
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.role === 'admin' ? '管理员' : user?.role === 'developer' ? '开发者' : '用户'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-6 space-y-1 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
                           (item.href !== '/dashboard' && location.pathname.startsWith(item.href))
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center font-medium rounded-lg transition-colors duration-200
                  ${isCollapsed ? 'justify-center px-2 py-3' : 'px-3 py-2'}
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                onClick={() => {
                  // 在移动端点击导航项后关闭侧边栏
                  if (window.innerWidth < 1024) {
                    onClose()
                  }
                }}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon 
                  className={`
                    transition-colors duration-200
                    ${isCollapsed ? 'h-6 w-6' : 'mr-3 h-5 w-5'}
                    ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}
                  `} 
                />
                {!isCollapsed && (
                  <>
                    <span className="text-sm">{item.name}</span>
                    {isActive && (
                      <ChevronRight className="ml-auto h-4 w-4 text-blue-600" />
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Collapse Toggle Button - Bottom Left */}
        <div className={`border-t border-gray-200 ${isCollapsed ? 'px-2 py-4' : 'px-4 py-4'}`}>
          <button
            onClick={onToggleCollapse}
            className={`
              group w-full flex items-center justify-center rounded-lg transition-all duration-300 ease-in-out
              ${isCollapsed ? 'px-2 py-3' : 'px-3 py-2'}
              bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100
              border border-blue-200/50 hover:border-blue-300/50
              text-blue-600 hover:text-blue-700
              shadow-sm hover:shadow-md
            `}
            title={isCollapsed ? '展开侧边栏' : '收起侧边栏'}
          >
            <div className="relative">
              {/* Fancy animated icon container */}
              <div className={`
                relative w-6 h-6 flex items-center justify-center
                transition-transform duration-300 ease-in-out
                ${isCollapsed ? 'rotate-0' : 'rotate-180'}
              `}>
                {/* Main arrow icon */}
                <div className={`
                  absolute inset-0 flex items-center justify-center
                  transition-all duration-300 ease-in-out
                  ${isCollapsed ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
                `}>
                  <ChevronRightIcon className="w-5 h-5" />
                </div>
                
                {/* Alternative arrow icon */}
                <div className={`
                  absolute inset-0 flex items-center justify-center
                  transition-all duration-300 ease-in-out
                  ${isCollapsed ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}
                `}>
                  <ChevronLeft className="w-5 h-5" />
                </div>
                
                {/* Decorative dots */}
                <div className={`
                  absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full
                  transition-all duration-300 ease-in-out
                  ${isCollapsed ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                `} />
                <div className={`
                  absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-indigo-400 rounded-full
                  transition-all duration-300 ease-in-out
                  ${isCollapsed ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                `} />
              </div>
              
              {/* Glow effect */}
              <div className={`
                absolute inset-0 w-6 h-6 bg-blue-400/20 rounded-full blur-sm
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'opacity-100 scale-125' : 'opacity-0 scale-100'}
              `} />
            </div>
            
            {/* Button text - only show when expanded */}
            {!isCollapsed && (
              <span className="ml-3 text-sm font-medium">
                {isCollapsed ? '展开' : '收起'}
              </span>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className={`border-t border-gray-200 ${isCollapsed ? 'px-2 py-4' : 'px-4 py-4'}`}>
          <div className={`flex items-center space-x-2 text-xs text-gray-500 ${isCollapsed ? 'justify-center' : ''}`}>
            <Zap className="w-4 h-4" />
            {!isCollapsed && <span>Jiuwen v1.0.0</span>}
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar