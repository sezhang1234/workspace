import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/useAuthStore'
import Layout from './components/Layout/Layout'
import WelcomePage from './pages/WelcomePage'
import LoginPage from './pages/Auth/LoginPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import AgentsPage from './pages/Agents/AgentsPage'
import AgentEditorPage from './pages/Agents/AgentEditorPage'
import WorkflowsPage from './pages/Workflows/WorkflowsPage'
import WorkflowEditorPage from './pages/Workflows/WorkflowEditorPage'
import WorkflowCreationPage from './pages/Workflows/WorkflowCreationPage'
import WorkflowCanvasPage from './pages/Workflows/WorkflowCanvasPage'
import PromptsPage from './pages/Prompts/PromptsPage'
import PromptEditorPage from './pages/Prompts/PromptEditorPage'
import ModelsPage from './pages/Models/ModelsPage'
import AnalyticsPage from './pages/Analytics/AnalyticsPage'
import SettingsPage from './pages/Settings/SettingsPage'
import ProfilePage from './pages/Settings/ProfilePage'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="agents" element={<AgentsPage />} />
        <Route path="agents/:id" element={<AgentEditorPage />} />
        <Route path="agents/new" element={<AgentEditorPage />} />
        <Route path="workflows" element={<WorkflowsPage />} />
        <Route path="workflows/:id" element={<WorkflowEditorPage />} />
        <Route path="workflows/new" element={<WorkflowCreationPage />} />
        <Route path="workflows/editor" element={<WorkflowCanvasPage />} />
        <Route path="prompts" element={<PromptsPage />} />
        <Route path="prompts/:id" element={<PromptEditorPage />} />
        <Route path="prompts/new" element={<PromptEditorPage />} />
        <Route path="models" element={<ModelsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Redirect to dashboard if authenticated, otherwise to welcome */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  )
}

export default App