import React, { useState } from 'react'
import { 
  Settings, 
  Save
} from 'lucide-react'
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Switch, 
  FormControlLabel,
  Tabs,
  Tab,
  Box,
  Typography,
  Alert,
  Snackbar,
  Grid,
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


  // General settings state
  const [generalSettings, setGeneralSettings] = useState({
    language: 'zh-CN',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    autoSave: true,
    autoSaveInterval: 5,
    maxFileSize: 10
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


          </div>
        </TabPanel>









      </div>



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