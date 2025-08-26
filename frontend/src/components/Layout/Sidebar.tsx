import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import JiuwenLogo from '../Common/JiuwenLogo'
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
  { name: '提示词管理', href: '/dashboard/prompts', icon: MessageSquare },
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
        fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-white via-blue-50/30 to-indigo-50/20 
        shadow-2xl border-r border-blue-100/50 backdrop-blur-sm transform transition-all duration-500 ease-in-out 
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
      `}>
        <div className={`flex items-center justify-between h-16 border-b border-blue-200/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 ${isCollapsed ? 'px-4' : 'px-6'}`}>
          <div className={`flex items-center space-x-2 ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-1 shadow-lg">
              <JiuwenLogo width={32} height={32} />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Jiuwen</span>
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
        <div className={`border-b border-blue-200/50 bg-gradient-to-r from-blue-50/30 to-indigo-50/20 ${isCollapsed ? 'px-2 py-4' : 'px-6 py-4'}`}>
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="relative">
              <img
                className="w-10 h-10 rounded-full ring-2 ring-blue-200/50 shadow-lg"
                src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                alt={user?.username}
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-blue-600 truncate font-medium">
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
                  group flex items-center font-medium rounded-xl transition-all duration-300 ease-in-out
                  ${isCollapsed ? 'justify-center px-2 py-3 mx-2' : 'px-4 py-3 mx-2'}
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border-r-2 border-blue-400' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md'
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
                    transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'h-6 w-6' : 'mr-3 h-5 w-5'}
                    ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}
                    ${isActive ? 'scale-110' : 'group-hover:scale-105'}
                  `} 
                />
                {!isCollapsed && (
                  <>
                    <span className="text-sm">{item.name}</span>
                    {isActive && (
                      <ChevronRight className="ml-auto h-4 w-4 text-white animate-pulse" />
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Collapse Toggle Button - Bottom Left */}
        <div className={`border-t border-blue-200/50 py-4 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          <button
            onClick={onToggleCollapse}
            className={`
              group flex items-center justify-center rounded-2xl transition-all duration-500 ease-in-out
              w-12 h-12
              bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600
              border border-blue-400/30 hover:border-blue-300/50
              text-white hover:text-white
              shadow-lg hover:shadow-xl hover:shadow-blue-500/25
              transform hover:scale-105 active:scale-95
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
            

          </button>
        </div>

        {/* Footer */}
        <div className={`border-t border-blue-200/50 bg-gradient-to-r from-blue-50/30 to-indigo-50/20 ${isCollapsed ? 'px-2 py-4' : 'px-4 py-4'}`}>
          <div className={`flex items-center space-x-2 text-xs ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-0.5">
              <Zap className="w-3 h-3 text-white" />
            </div>
            {!isCollapsed && <span className="text-blue-600 font-medium">Jiuwen v1.0.0</span>}
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar