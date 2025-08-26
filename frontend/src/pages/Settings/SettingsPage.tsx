import React, { useState } from 'react'
import { 
  Settings, 
  Save, 
  Palette, 
  Key, 
  BarChart3, 
  Trash2, 
  Copy,
  Info
} from 'lucide-react'
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Switch, 
  FormControlLabel,
  Chip,
  Tabs,
  Tab,
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Snackbar,

  Grid,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Divider,
  FormGroup
} from '@mui/material'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 4 }}>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            {children}
          </div>
        </Box>
      )}
    </div>
  )
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
  const [isSaving, setIsSaving] = useState(false)
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)
  const [newApiKey, setNewApiKey] = useState('')

  // General settings state
  const [generalSettings, setGeneralSettings] = useState({
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    autoSave: true,
    autoSaveInterval: 5,
    maxFileSize: 10,
    enableAnalytics: true,
    enableTelemetry: false
  })

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
    enableAuditLog: true
  })



  // Profile settings state
  const [profileSettings, setProfileSettings] = useState({
    firstName: '张',
    lastName: '三',
    email: 'zhangsan@example.com',
    phone: '+86 138 0013 8000',
    company: '智能科技有限公司',
    position: 'AI工程师',
    bio: '专注于AI和机器学习技术，有5年以上的开发经验。',
    location: '北京',
    website: 'https://zhangsan.dev',
    skills: ['React', 'TypeScript', 'AI/ML', 'Python'],
    interests: ['人工智能', '开源项目', '技术分享']
  })

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    agentAlerts: true,
    workflowAlerts: true,
    systemUpdates: true,
    marketingEmails: false,
    weeklyReports: true,
    dailyDigest: false,
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00'
  })

  // Appearance settings state
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    primaryColor: '#3b82f6',
    fontSize: 'medium',
    compactMode: false,
    showAnimations: true,
    sidebarCollapsed: false,
    showBreadcrumbs: true,
    enableDarkMode: true,
    autoSwitchTheme: false
  })

  // API settings state
  const [apiSettings, setApiSettings] = useState({
    enableApi: true,
    rateLimit: 1000,
    rateLimitWindow: 3600,
    enableWebhooks: true,
    webhookTimeout: 30,
    enableCaching: true,
    cacheTTL: 300,
    enableMetrics: true,
    apiKeys: [
      { id: '1', name: 'Production API Key', key: 'sk-prod-...', createdAt: '2024-01-01', lastUsed: '2024-01-15' },
      { id: '2', name: 'Development API Key', key: 'sk-dev-...', createdAt: '2024-01-10', lastUsed: '2024-01-14' }
    ]
  })

  // Performance settings state
  const [performanceSettings, setPerformanceSettings] = useState({
    enableCaching: true,
    cacheSize: 1000,
    cacheTTL: 300,
    enableCompression: true,
    enableMinification: true,
    enableCDN: false,
    enableMonitoring: true,
    logLevel: 'info',
    enableProfiling: false,
    maxConcurrentRequests: 100,
    requestTimeout: 30,
    enableRetry: true,
    retryDelay: 1000
  })

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSaving(false)
    setSnackbar({ open: true, message: '设置保存成功！', severity: 'success' })
  }

  const generateApiKey = () => {
    const key = 'sk-' + Math.random().toString(36).substr(2, 9) + '-' + Math.random().toString(36).substr(2, 9)
    setNewApiKey(key)
    setShowApiKeyDialog(true)
  }

  const addApiKey = () => {
    const newKey = {
      id: Date.now().toString(),
      name: `API Key ${apiSettings.apiKeys.length + 1}`,
      key: newApiKey,
      createdAt: new Date().toISOString(),
      lastUsed: '-'
    }
    setApiSettings({
      ...apiSettings,
      apiKeys: [...apiSettings.apiKeys, newKey]
    })
    setShowApiKeyDialog(false)
    setNewApiKey('')
  }

  const removeApiKey = (keyId: string) => {
    setApiSettings({
      ...apiSettings,
      apiKeys: apiSettings.apiKeys.filter(key => key.id !== keyId)
    })
  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      {/* Page header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 mb-2">
          系统设置
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          管理您的账户、安全和应用程序偏好设置
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-end">
        {/* Save Configuration Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none"
        >
          <Save className="w-5 h-5" />
          <span>{isSaving ? '保存中...' : '保存设置'}</span>
        </button>
      </div>

      {/* Settings tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider', 
          background: 'linear-gradient(90deg, #FFFFFF 0%, #F8FAFF 50%, #F0F4FF 100%)',
          borderTop: '1px solid rgba(59, 130, 246, 0.1)'
        }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="设置标签页" 
            variant="scrollable"
            className="px-6"
            sx={{
              '& .MuiTab-root': {
                minHeight: '64px',
                fontSize: '1rem',
                fontWeight: 500,
                textTransform: 'none',
                color: '#6B7280',
                '&.Mui-selected': {
                  color: '#3B82F6',
                  fontWeight: 600,
                },
                '&:hover': {
                  color: '#3B82F6',
                  backgroundColor: 'rgba(59, 130, 246, 0.04)',
                },
              },
              '& .MuiTabs-indicator': {
                height: '3px',
                borderRadius: '2px',
                background: 'linear-gradient(90deg, #3B82F6 0%, #6366F1 100%)',
              },
            }}
          >
            <Tab label="通用设置" icon={<Settings />} />
            <Tab label="个人资料" icon={<Key />} />
            <Tab label="通知设置" icon={<Info />} />
            <Tab label="外观设置" icon={<Palette />} />
            <Tab label="安全设置" icon={<Key />} />
            <Tab label="API设置" icon={<Key />} />

            <Tab label="性能设置" icon={<BarChart3 />} />
          </Tabs>
        </Box>

        {/* 通用设置 */}
        <TabPanel value={activeTab} index={0}>
          <div className="space-y-6">
            <div className="mb-6">
              <Typography variant="h6" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">
                基本设置
              </Typography>
            </div>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>语言</InputLabel>
                  <Select
                    value={generalSettings.language}
                    label="语言"
                    onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                    className="[& .MuiOutlinedInput-root]:rounded-xl [& .MuiOutlinedInput-root]:border-gray-200 [& .MuiOutlinedInput-root]:focus:border-blue-300 [& .MuiOutlinedInput-root]:focus:ring-blue-500"
                  >
                    <MenuItem value="zh-CN">简体中文</MenuItem>
                    <MenuItem value="en-US">English</MenuItem>
                    <MenuItem value="ja-JP">日本語</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>时区</InputLabel>
                  <Select
                    value={generalSettings.timezone}
                    label="时区"
                    onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                    className="[& .MuiOutlinedInput-root]:rounded-xl [& .MuiOutlinedInput-root]:border-gray-200 [& .MuiOutlinedInput-root]:focus:border-blue-300 [& .MuiOutlinedInput-root]:focus:ring-blue-500"
                  >
                    <MenuItem value="Asia/Shanghai">中国标准时间 (UTC+8)</MenuItem>
                    <MenuItem value="America/New_York">美国东部时间 (UTC-5)</MenuItem>
                    <MenuItem value="Europe/London">格林威治时间 (UTC+0)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider />
            
            <Typography variant="h6">自动保存</Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={generalSettings.autoSave}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, autoSave: e.target.checked })}
                  />
                }
                label="启用自动保存"
              />
            </FormGroup>
            
            {generalSettings.autoSave && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="自动保存间隔（分钟）"
                    value={generalSettings.autoSaveInterval}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, autoSaveInterval: parseInt(e.target.value) })}
                    inputProps={{ min: 1, max: 60 }}
                  />
                </Grid>
              </Grid>
            )}

            <Divider />
            
            <Typography variant="h6">隐私设置</Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={generalSettings.enableAnalytics}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, enableAnalytics: e.target.checked })}
                  />
                }
                label="启用使用分析"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={generalSettings.enableTelemetry}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, enableTelemetry: e.target.checked })}
                  />
                }
                label="启用遥测数据收集"
              />
            </FormGroup>
          </div>
        </TabPanel>

        {/* 个人资料 */}
        <TabPanel value={activeTab} index={1}>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar sx={{ width: 80, height: 80 }}>张</Avatar>
              <div>
                <Typography variant="h6">{profileSettings.firstName} {profileSettings.lastName}</Typography>
                <Typography variant="body2" color="textSecondary">{profileSettings.position} @ {profileSettings.company}</Typography>
              </div>
            </div>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="名字"
                  value={profileSettings.firstName}
                  onChange={(e) => setProfileSettings({ ...profileSettings, firstName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="姓氏"
                  value={profileSettings.lastName}
                  onChange={(e) => setProfileSettings({ ...profileSettings, lastName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="邮箱"
                  type="email"
                  value={profileSettings.email}
                  onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="电话"
                  value={profileSettings.phone}
                  onChange={(e) => setProfileSettings({ ...profileSettings, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="公司"
                  value={profileSettings.company}
                  onChange={(e) => setProfileSettings({ ...profileSettings, company: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="职位"
                  value={profileSettings.position}
                  onChange={(e) => setProfileSettings({ ...profileSettings, position: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="个人简介"
                  value={profileSettings.bio}
                  onChange={(e) => setProfileSettings({ ...profileSettings, bio: e.target.value })}
                />
              </Grid>
            </Grid>

            <Divider />
            
            <Typography variant="h6">技能标签</Typography>
            <div className="flex flex-wrap gap-2">
              {profileSettings.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => setProfileSettings({
                    ...profileSettings,
                    skills: profileSettings.skills.filter((_, i) => i !== index)
                  })}
                />
              ))}
              <TextField
                size="small"
                placeholder="添加技能"
                onKeyPress={(e) => {
                  const target = e.currentTarget as HTMLInputElement
                  if (e.key === 'Enter' && target.value.trim()) {
                    setProfileSettings({
                      ...profileSettings,
                      skills: [...profileSettings.skills, target.value.trim()]
                    })
                    target.value = ''
                  }
                }}
              />
            </div>
          </div>
        </TabPanel>

        {/* 通知设置 */}
        <TabPanel value={activeTab} index={2}>
          <div className="space-y-6">
            <Typography variant="h6">通知渠道</Typography>
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                  />
                }
                label="邮件通知"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
                  />
                }
                label="推送通知"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, smsNotifications: e.target.checked })}
                  />
                }
                label="短信通知"
              />
            </FormGroup>

            <Divider />
            
            <Typography variant="h6">通知类型</Typography>
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.agentAlerts}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, agentAlerts: e.target.checked })}
                  />
                }
                label="智能体警报"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.workflowAlerts}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, workflowAlerts: e.target.checked })}
                  />
                }
                label="工作流警报"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.systemUpdates}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, systemUpdates: e.target.checked })}
                  />
                }
                label="系统更新"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.weeklyReports}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyReports: e.target.checked })}
                  />
                }
                label="周报"
              />
            </FormGroup>

            <Divider />
            
            <Typography variant="h6">免打扰时间</Typography>
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.quietHours}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, quietHours: e.target.checked })}
                  />
                }
                label="启用免打扰时间"
              />
            </FormGroup>
            
            {notificationSettings.quietHours && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="time"
                    label="开始时间"
                    value={notificationSettings.quietStart}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, quietStart: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="time"
                    label="结束时间"
                    value={notificationSettings.quietEnd}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, quietEnd: e.target.value })}
                  />
                </Grid>
              </Grid>
            )}
          </div>
        </TabPanel>

        {/* 外观设置 */}
        <TabPanel value={activeTab} index={3}>
          <div className="space-y-6">
            <Typography variant="h6">主题设置</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>主题模式</InputLabel>
                  <Select
                    value={appearanceSettings.theme}
                    label="主题模式"
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, theme: e.target.value })}
                  >
                    <MenuItem value="light">浅色主题</MenuItem>
                    <MenuItem value="dark">深色主题</MenuItem>
                    <MenuItem value="auto">跟随系统</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>字体大小</InputLabel>
                  <Select
                    value={appearanceSettings.fontSize}
                    label="字体大小"
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, fontSize: e.target.value })}
                  >
                    <MenuItem value="small">小</MenuItem>
                    <MenuItem value="medium">中</MenuItem>
                    <MenuItem value="large">大</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider />
            
            <Typography variant="h6">界面选项</Typography>
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={appearanceSettings.compactMode}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, compactMode: e.target.checked })}
                  />
                }
                label="紧凑模式"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={appearanceSettings.showAnimations}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, showAnimations: e.target.checked })}
                  />
                }
                label="显示动画"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={appearanceSettings.showBreadcrumbs}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, showBreadcrumbs: e.target.checked })}
                  />
                }
                label="显示面包屑导航"
              />
            </FormGroup>
          </div>
        </TabPanel>

        {/* 安全设置 */}
        <TabPanel value={activeTab} index={4}>
          <div className="space-y-6">
            <Typography variant="h6">双重认证</Typography>
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked })}
                  />
                }
                label="启用双重认证 (2FA)"
              />
            </FormGroup>

            <Divider />
            
            <Typography variant="h6">会话管理</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="会话超时时间（分钟）"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                  inputProps={{ min: 5, max: 480 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="最大登录尝试次数"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) })}
                  inputProps={{ min: 3, max: 10 }}
                />
              </Grid>
            </Grid>

            <Divider />
            
            <Typography variant="h6">密码策略</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="最小密码长度"
                  value={securitySettings.passwordMinLength}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, passwordMinLength: parseInt(e.target.value) })}
                  inputProps={{ min: 6, max: 20 }}
                />
              </Grid>
            </Grid>
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={securitySettings.requireSpecialChars}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, requireSpecialChars: e.target.checked })}
                  />
                }
                label="要求特殊字符"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={securitySettings.requireNumbers}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, requireNumbers: e.target.checked })}
                  />
                }
                label="要求数字"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={securitySettings.requireUppercase}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, requireUppercase: e.target.checked })}
                  />
                }
                label="要求大写字母"
              />
            </FormGroup>
          </div>
        </TabPanel>

        {/* API设置 */}
        <TabPanel value={activeTab} index={5}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6">API密钥管理</Typography>
              <Button
                variant="outlined"
                startIcon={<Key />}
                onClick={generateApiKey}
              >
                生成新密钥
              </Button>
            </div>

            <div className="space-y-3">
              {apiSettings.apiKeys.map((apiKey) => (
                <Card key={apiKey.id} variant="outlined">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <Typography variant="subtitle1">{apiKey.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          密钥: {apiKey.key}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          创建于: {new Date(apiKey.createdAt).toLocaleDateString('zh-CN')} | 
                          最后使用: {apiKey.lastUsed}
                        </Typography>
                      </div>
                      <IconButton
                        color="error"
                        onClick={() => removeApiKey(apiKey.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </IconButton>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Divider />
            
            <Typography variant="h6">API配置</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="速率限制（请求/小时）"
                  value={apiSettings.rateLimit}
                  onChange={(e) => setApiSettings({ ...apiSettings, rateLimit: parseInt(e.target.value) })}
                  inputProps={{ min: 100, max: 10000 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Webhook超时（秒）"
                  value={apiSettings.webhookTimeout}
                  onChange={(e) => setApiSettings({ ...apiSettings, webhookTimeout: parseInt(e.target.value) })}
                  inputProps={{ min: 5, max: 300 }}
                />
              </Grid>
            </Grid>

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={apiSettings.enableWebhooks}
                    onChange={(e) => setApiSettings({ ...apiSettings, enableWebhooks: e.target.checked })}
                  />
                }
                label="启用Webhook"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={apiSettings.enableCaching}
                    onChange={(e) => setApiSettings({ ...apiSettings, enableCaching: e.target.checked })}
                  />
                }
                label="启用缓存"
              />
            </FormGroup>
          </div>
        </TabPanel>



        {/* 性能设置 */}
        <TabPanel value={activeTab} index={6}>
          <div className="space-y-6">
            <Typography variant="h6">缓存设置</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="缓存大小（MB）"
                  value={performanceSettings.cacheSize}
                  onChange={(e) => setPerformanceSettings({ ...performanceSettings, cacheSize: parseInt(e.target.value) })}
                  inputProps={{ min: 100, max: 10000 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="缓存TTL（秒）"
                  value={performanceSettings.cacheTTL}
                  onChange={(e) => setPerformanceSettings({ ...performanceSettings, cacheTTL: parseInt(e.target.value) })}
                  inputProps={{ min: 60, max: 3600 }}
                />
              </Grid>
            </Grid>

            <Divider />
            
            <Typography variant="h6">请求管理</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="最大并发请求数"
                  value={performanceSettings.maxConcurrentRequests}
                  onChange={(e) => setPerformanceSettings({ ...performanceSettings, maxConcurrentRequests: parseInt(e.target.value) })}
                  inputProps={{ min: 10, max: 1000 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="请求超时（秒）"
                  value={performanceSettings.requestTimeout}
                  onChange={(e) => setPerformanceSettings({ ...performanceSettings, requestTimeout: parseInt(e.target.value) })}
                  inputProps={{ min: 5, max: 300 }}
                />
              </Grid>
            </Grid>

            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={performanceSettings.enableCaching}
                    onChange={(e) => setPerformanceSettings({ ...performanceSettings, enableCaching: e.target.checked })}
                  />
                }
                label="启用缓存"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={performanceSettings.enableCompression}
                    onChange={(e) => setPerformanceSettings({ ...performanceSettings, enableCompression: e.target.checked })}
                  />
                }
                label="启用压缩"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={performanceSettings.enableMonitoring}
                    onChange={(e) => setPerformanceSettings({ ...performanceSettings, enableMonitoring: e.target.checked })}
                  />
                }
                label="启用性能监控"
              />
            </FormGroup>
          </div>
        </TabPanel>
      </div>

      {/* API Key Dialog */}
      <Dialog 
        open={showApiKeyDialog} 
        onClose={() => setShowApiKeyDialog(false)}
        PaperProps={{
          className: "rounded-2xl shadow-2xl border border-gray-100"
        }}
      >
        <DialogTitle className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Key className="w-4 h-4 text-white" />
            </div>
            <Typography variant="h6" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-800">
              生成新的API密钥
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent className="pt-6">
          <Typography variant="body2" className="mb-4 text-gray-600">
            请保存好这个API密钥，它只会显示一次：
          </Typography>
          <TextField
            fullWidth
            value={newApiKey}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => navigator.clipboard.writeText(newApiKey)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Copy className="w-4 h-4" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            className="[& .MuiOutlinedInput-root]:rounded-xl [& .MuiOutlinedInput-root]:border-gray-200 [& .MuiOutlinedInput-root]:bg-gray-50"
          />
        </DialogContent>
        <DialogActions className="bg-gray-50 px-6 py-4">
          <Button 
            onClick={() => setShowApiKeyDialog(false)}
            className="text-gray-600 hover:text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-200"
          >
            取消
          </Button>
          <Button 
            variant="contained" 
            onClick={addApiKey}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            确认
          </Button>
        </DialogActions>
      </Dialog>

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

export default SettingsPage