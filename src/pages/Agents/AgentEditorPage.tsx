import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Save, 
  Play, 
  TestTube,
  Copy,
  Download,
  Upload,
  Trash2
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
  Alert,
  Snackbar
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
      id={`agent-tabpanel-${index}`}
      aria-labelledby={`agent-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

const AgentEditorPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const [activeTab, setActiveTab] = useState(0)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

  // Agent state
  const [agent, setAgent] = useState({
    name: isNew ? '' : '智能客服助手',
    description: isNew ? '' : '专业的客户服务智能体，能够处理常见问题和投诉',
    model: isNew ? 'gpt-4' : 'gpt-4',
    temperature: isNew ? 0.7 : 0.7,
    maxTokens: isNew ? 2000 : 2000,
    systemPrompt: isNew ? '你是一个专业的客户服务代表，请用友好、专业的态度回答客户问题。' : '你是一个专业的客户服务代表，请用友好、专业的态度回答客户问题。',
    userPrompt: isNew ? '请帮我解决以下问题：' : '请帮我解决以下问题：',
    isActive: isNew ? false : true,
    tags: isNew ? [] : ['客服', 'AI助手', '客户支持'],
    apiKey: isNew ? '' : 'sk-...',
    baseUrl: isNew ? 'https://api.openai.com/v1' : 'https://api.openai.com/v1'
  })

  // Test chat state
  const [testMessage, setTestMessage] = useState('')
  const [testHistory, setTestHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [isTesting, setIsTesting] = useState(false)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleSave = () => {
    // Simulate saving
    setSnackbar({ open: true, message: '智能体保存成功！', severity: 'success' })
  }

  const handleTest = async () => {
    if (!testMessage.trim()) return
    
    setIsTesting(true)
    const userMessage = { role: 'user' as const, content: testMessage }
    setTestHistory(prev => [...prev, userMessage])
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = { 
        role: 'assistant' as const, 
        content: `这是对"${testMessage}"的模拟回复。在实际环境中，这里会调用配置的LLM API。` 
      }
      setTestHistory(prev => [...prev, aiResponse])
      setIsTesting(false)
    }, 1000)
    
    setTestMessage('')
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(agent.systemPrompt)
    setSnackbar({ open: true, message: '系统提示词已复制到剪贴板', severity: 'success' })
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(agent, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${agent.name || 'agent'}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedAgent = JSON.parse(e.target?.result as string)
          setAgent(importedAgent)
          setSnackbar({ open: true, message: '智能体配置导入成功', severity: 'success' })
        } catch (error) {
          setSnackbar({ open: true, message: '导入失败：文件格式错误', severity: 'error' })
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outlined"
            startIcon={<ArrowLeft />}
            onClick={() => navigate('/dashboard/agents')}
          >
            返回
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? '创建智能体' : '编辑智能体'}
            </h1>
            <p className="text-gray-600">
              {isNew ? '开始构建您的AI智能体' : '修改智能体配置和参数'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outlined"
            startIcon={<TestTube />}
            onClick={() => setActiveTab(4)}
          >
            测试
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
          >
            保存
          </Button>
        </div>
      </div>

      {/* Main content */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="智能体配置标签页">
            <Tab label="基础配置" />
            <Tab label="模型设置" />
            <Tab label="提示词管理" />
            <Tab label="高级参数" />
            <Tab label="测试调试" />
          </Tabs>
        </Box>

        {/* 基础配置 */}
        <TabPanel value={activeTab} index={0}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField
                fullWidth
                label="智能体名称"
                value={agent.name}
                onChange={(e) => setAgent({ ...agent, name: e.target.value })}
                placeholder="例如：智能客服助手"
              />
              
              <FormControl fullWidth>
                <InputLabel>状态</InputLabel>
                <Select
                  value={agent.isActive.toString()}
                  label="状态"
                  onChange={(e) => setAgent({ ...agent, isActive: e.target.value === 'true' })}
                >
                  <MenuItem value="true">启用</MenuItem>
                  <MenuItem value="false">禁用</MenuItem>
                </Select>
              </FormControl>
            </div>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="描述"
              value={agent.description}
              onChange={(e) => setAgent({ ...agent, description: e.target.value })}
              placeholder="描述智能体的功能和用途"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签
              </label>
              <div className="flex flex-wrap gap-2">
                {agent.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => setAgent({ 
                      ...agent, 
                      tags: agent.tags.filter((_, i) => i !== index) 
                    })}
                  />
                ))}
                <TextField
                  size="small"
                  placeholder="添加标签"
                  onKeyPress={(e) => {
                    const target = e.currentTarget as HTMLInputElement
                    if (e.key === 'Enter' && target.value.trim()) {
                      setAgent({
                        ...agent,
                        tags: [...agent.tags, target.value.trim()]
                      })
                      target.value = ''
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </TabPanel>

        {/* 模型设置 */}
        <TabPanel value={activeTab} index={1}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormControl fullWidth>
                <InputLabel>LLM模型</InputLabel>
                <Select
                  value={agent.model}
                  label="LLM模型"
                  onChange={(e) => setAgent({ ...agent, model: e.target.value })}
                >
                  <MenuItem value="gpt-4">GPT-4</MenuItem>
                  <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                  <MenuItem value="claude-3">Claude-3</MenuItem>
                  <MenuItem value="gemini-pro">Gemini Pro</MenuItem>
                  <MenuItem value="qwen-plus">Qwen Plus</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="API密钥"
                type="password"
                value={agent.apiKey}
                onChange={(e) => setAgent({ ...agent, apiKey: e.target.value })}
                placeholder="sk-..."
              />
            </div>

            <TextField
              fullWidth
              label="API基础URL"
              value={agent.baseUrl}
              onChange={(e) => setAgent({ ...agent, baseUrl: e.target.value })}
              placeholder="https://api.openai.com/v1"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField
                fullWidth
                type="number"
                label="温度 (Temperature)"
                value={agent.temperature}
                onChange={(e) => setAgent({ ...agent, temperature: parseFloat(e.target.value) })}
                inputProps={{ min: 0, max: 2, step: 0.1 }}
                helperText="控制输出的随机性，0为确定性，2为最大随机性"
              />

              <TextField
                fullWidth
                type="number"
                label="最大Token数"
                value={agent.maxTokens}
                onChange={(e) => setAgent({ ...agent, maxTokens: parseInt(e.target.value) })}
                inputProps={{ min: 1, max: 8000 }}
                helperText="限制单次对话的最大输出长度"
              />
            </div>
          </div>
        </TabPanel>

        {/* 提示词管理 */}
        <TabPanel value={activeTab} index={2}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Typography variant="h6">系统提示词</Typography>
              <Button
                size="small"
                startIcon={<Copy />}
                onClick={handleCopyPrompt}
              >
                复制
              </Button>
            </div>
            
            <TextField
              fullWidth
              multiline
              rows={8}
              label="系统提示词"
              value={agent.systemPrompt}
              onChange={(e) => setAgent({ ...agent, systemPrompt: e.target.value })}
              placeholder="定义智能体的角色、能力和行为准则..."
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="用户提示词模板"
              value={agent.userPrompt}
              onChange={(e) => setAgent({ ...agent, userPrompt: e.target.value })}
              placeholder="用户输入的提示词模板..."
            />

            <Alert severity="info">
              <Typography variant="body2">
                提示词提示：使用清晰的指令，定义角色期望，设置输出格式要求，并包含示例来获得更好的效果。
              </Typography>
            </Alert>
          </div>
        </TabPanel>

        {/* 高级参数 */}
        <TabPanel value={activeTab} index={3}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField
                fullWidth
                type="number"
                label="Top P"
                defaultValue={0.9}
                inputProps={{ min: 0, max: 1, step: 0.1 }}
                helperText="控制词汇选择的多样性"
              />

              <TextField
                fullWidth
                type="number"
                label="频率惩罚"
                defaultValue={0.0}
                inputProps={{ min: -2, max: 2, step: 0.1 }}
                helperText="减少重复内容的生成"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField
                fullWidth
                type="number"
                label="存在惩罚"
                defaultValue={0.0}
                inputProps={{ min: -2, max: 2, step: 0.1 }}
                helperText="控制主题的重复程度"
              />

              <TextField
                fullWidth
                type="number"
                label="停止序列"
                placeholder="例如：END, STOP"
                helperText="指定停止生成的标记"
              />
            </div>

            <FormControlLabel
              control={<Switch defaultChecked />}
              label="启用流式输出"
            />

            <FormControlLabel
              control={<Switch defaultChecked />}
              label="启用函数调用"
            />
          </div>
        </TabPanel>

        {/* 测试调试 */}
        <TabPanel value={activeTab} index={4}>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <TextField
                fullWidth
                label="测试消息"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="输入测试消息..."
                onKeyPress={(e) => e.key === 'Enter' && handleTest()}
              />
              <Button
                variant="contained"
                startIcon={<Play />}
                onClick={handleTest}
                disabled={isTesting || !testMessage.trim()}
              >
                {isTesting ? '测试中...' : '测试'}
              </Button>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <Typography variant="h6" className="mb-4">对话历史</Typography>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {testHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">暂无对话记录</p>
                ) : (
                  testHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-blue-100 ml-8' 
                          : 'bg-green-100 mr-8'
                      }`}
                    >
                      <div className="font-medium text-sm mb-1">
                        {msg.role === 'user' ? '用户' : 'AI助手'}
                      </div>
                      <div>{msg.content}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="outlined"
                  startIcon={<Upload />}
                  component="label"
                >
                  导入配置
                  <input
                    type="file"
                    hidden
                    accept=".json"
                    onChange={handleImport}
                  />
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleExport}
                >
                  导出配置
                </Button>
              </div>

              <Button
                variant="outlined"
                color="error"
                startIcon={<Trash2 />}
                onClick={() => {
                  if (confirm('确定要删除这个智能体吗？')) {
                    navigate('/dashboard/agents')
                  }
                }}
              >
                删除智能体
              </Button>
            </div>
          </div>
        </TabPanel>
      </Card>

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

export default AgentEditorPage