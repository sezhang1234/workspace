import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  // Auto-collapse sidebar when entering workflow editor
  useEffect(() => {
    if (location.pathname.includes('/workflows/editor')) {
      setSidebarCollapsed(true)
    }
  }, [location.pathname])

  // Set CSS custom properties for sidebar state
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-collapsed', sidebarCollapsed ? '1' : '0')
    document.documentElement.style.setProperty('--sidebar-width', sidebarCollapsed ? '64px' : '256px')
  }, [sidebarCollapsed])

  // 如果用户未登录，重定向到登录页
  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col transition-all duration-300 ease-in-out">
        {/* Header */}
        <Header 
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="py-6">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout