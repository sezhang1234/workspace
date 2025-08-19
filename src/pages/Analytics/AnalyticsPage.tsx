import React, { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity, 
  Calendar,
  Download,
  RotateCcw,
  Filter,
  Eye,
  EyeOff,
  Check
} from 'lucide-react'
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
  FormGroup
} from '@mui/material'

interface AnalyticsData {
  overview: {
    totalAgents: number
    totalWorkflows: number
    totalPrompts: number
    totalUsers: number
    monthlyExecutions: number
    successRate: number
    averageResponseTime: number
    totalTokens: number
  }
  trends: {
    date: string
    executions: number
    successRate: number
    responseTime: number
    tokens: number
  }[]
  topAgents: {
    id: string
    name: string
    executions: number
    successRate: number
    avgResponseTime: number
    totalTokens: number
  }[]
  topWorkflows: {
    id: string
    name: string
    runs: number
    successRate: number
    avgExecutionTime: number
    lastRun: string
  }[]
  userActivity: {
    date: string
    activeUsers: number
    newUsers: number
    totalSessions: number
  }[]
  modelUsage: {
    model: string
    requests: number
    tokens: number
    successRate: number
    avgResponseTime: number
    cost: number
  }[]
}

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [refreshData, setRefreshData] = useState(false)
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(true)

  // Mock analytics data
  const [analyticsData] = useState<AnalyticsData>({
    overview: {
      totalAgents: 24,
      totalWorkflows: 18,
      totalPrompts: 156,
      totalUsers: 89,
      monthlyExecutions: 15420,
      successRate: 98.5,
      averageResponseTime: 2.3,
      totalTokens: 2847500
    },
    trends: [
      { date: '2024-01-10', executions: 512, successRate: 98.2, responseTime: 2.1, tokens: 95000 },
      { date: '2024-01-11', executions: 498, successRate: 98.7, responseTime: 2.4, tokens: 92000 },
      { date: '2024-01-12', executions: 534, successRate: 98.1, responseTime: 2.2, tokens: 98000 },
      { date: '2024-01-13', executions: 521, successRate: 98.9, responseTime: 2.0, tokens: 96000 },
      { date: '2024-01-14', executions: 487, successRate: 98.3, responseTime: 2.3, tokens: 89000 },
      { date: '2024-01-15', executions: 556, successRate: 98.6, responseTime: 2.1, tokens: 102000 }
    ],
    topAgents: [
      { id: '1', name: '智能客服助手', executions: 3240, successRate: 99.1, avgResponseTime: 1.8, totalTokens: 580000 },
      { id: '2', name: '数据分析助手', executions: 2870, successRate: 97.8, avgResponseTime: 3.2, totalTokens: 720000 },
      { id: '3', name: '内容创作助手', executions: 2150, successRate: 98.5, avgResponseTime: 2.5, totalTokens: 450000 },
      { id: '4', name: '代码生成助手', executions: 1890, successRate: 96.9, avgResponseTime: 4.1, totalTokens: 380000 },
      { id: '5', name: '翻译助手', executions: 1670, successRate: 99.3, avgResponseTime: 1.5, totalTokens: 280000 }
    ],
    topWorkflows: [
      { id: '1', name: '客户服务自动化流程', runs: 890, successRate: 98.7, avgExecutionTime: 12.3, lastRun: '2024-01-15T16:30:00Z' },
      { id: '2', name: '数据报告生成流程', runs: 670, successRate: 97.2, avgExecutionTime: 25.8, lastRun: '2024-01-15T15:45:00Z' },
      { id: '3', name: '内容审核流程', runs: 540, successRate: 99.1, avgExecutionTime: 8.9, lastRun: '2024-01-15T17:15:00Z' },
      { id: '4', name: '用户反馈分析流程', runs: 420, successRate: 96.8, avgExecutionTime: 18.2, lastRun: '2024-01-15T14:20:00Z' },
      { id: '5', name: '系统监控流程', runs: 380, successRate: 99.5, avgExecutionTime: 5.6, lastRun: '2024-01-15T16:00:00Z' }
    ],
    userActivity: [
      { date: '2024-01-10', activeUsers: 67, newUsers: 3, totalSessions: 234 },
      { date: '2024-01-11', activeUsers: 71, newUsers: 2, totalSessions: 256 },
      { date: '2024-01-12', activeUsers: 68, newUsers: 4, totalSessions: 241 },
      { date: '2024-01-13', activeUsers: 73, newUsers: 1, totalSessions: 268 },
      { date: '2024-01-14', activeUsers: 69, newUsers: 3, totalSessions: 252 },
      { date: '2024-01-15', activeUsers: 75, newUsers: 2, totalSessions: 278 }
    ],
    modelUsage: [
      { model: 'GPT-4', requests: 8240, tokens: 1580000, successRate: 98.8, avgResponseTime: 2.1, cost: 156.80 },
      { model: 'Claude-3', requests: 4560, tokens: 890000, successRate: 97.2, avgResponseTime: 3.4, cost: 89.20 },
      { model: 'Qwen Plus', requests: 2620, tokens: 377500, successRate: 98.1, avgResponseTime: 1.9, cost: 37.75 }
    ]
  })

  const handleRefresh = () => {
    setRefreshData(true)
    // Simulate data refresh
    setTimeout(() => setRefreshData(false), 2000)
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(analyticsData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatTime = (time: string) => {
    return new Date(time).toLocaleString('zh-CN')
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">数据分析</h1>
          <p className="text-gray-600">深入了解平台使用情况、性能指标和用户行为分析</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <FormControlLabel
            control={
              <Switch
                checked={showDetailedMetrics}
                onChange={(e) => setShowDetailedMetrics(e.target.checked)}
              />
            }
            label="详细指标"
          />
          <FormControl size="small">
            <InputLabel>时间范围</InputLabel>
            <Select
              value={timeRange}
              label="时间范围"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7d">最近7天</MenuItem>
              <MenuItem value="30d">最近30天</MenuItem>
              <MenuItem value="90d">最近90天</MenuItem>
              <MenuItem value="1y">最近1年</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<RotateCcw />}
            onClick={handleRefresh}
            disabled={refreshData}
          >
            {refreshData ? '刷新中...' : '刷新数据'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExport}
          >
            导出数据
          </Button>
        </div>
      </div>

      {/* Overview metrics */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <Typography variant="h4" className="font-bold text-gray-900">
                {formatNumber(analyticsData.overview.monthlyExecutions)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                月度执行次数
              </Typography>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <Typography variant="caption" className="text-green-600">
                  +12.5%
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <Typography variant="h4" className="font-bold text-gray-900">
                {analyticsData.overview.successRate}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                成功率
              </Typography>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <Typography variant="caption" className="text-green-600">
                  +0.8%
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
              <Typography variant="h4" className="font-bold text-gray-900">
                {analyticsData.overview.averageResponseTime}s
              </Typography>
              <Typography variant="body2" color="textSecondary">
                平均响应时间
              </Typography>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                <Typography variant="caption" className="text-red-600">
                  +0.2s
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <Typography variant="h4" className="font-bold text-gray-900">
                {analyticsData.overview.totalUsers}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                活跃用户
              </Typography>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <Typography variant="caption" className="text-green-600">
                  +5
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed metrics */}
      {showDetailedMetrics && (
        <>
          {/* Top Agents */}
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h6">热门智能体</Typography>
                <Chip label={`共 ${analyticsData.topAgents.length} 个智能体`} size="small" />
              </div>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>智能体名称</TableCell>
                      <TableCell align="right">执行次数</TableCell>
                      <TableCell align="right">成功率</TableCell>
                      <TableCell align="right">平均响应时间</TableCell>
                      <TableCell align="right">总Token数</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyticsData.topAgents.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell>
                          <Typography variant="subtitle2">{agent.name}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          {formatNumber(agent.executions)}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${agent.successRate}%`}
                            size="small"
                            color={agent.successRate >= 98 ? 'success' : agent.successRate >= 95 ? 'warning' : 'error'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {agent.avgResponseTime}s
                        </TableCell>
                        <TableCell align="right">
                          {formatNumber(agent.totalTokens)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Top Workflows */}
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h6">热门工作流</Typography>
                <Chip label={`共 ${analyticsData.topWorkflows.length} 个工作流`} size="small" />
              </div>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>工作流名称</TableCell>
                      <TableCell align="right">运行次数</TableCell>
                      <TableCell align="right">成功率</TableCell>
                      <TableCell align="right">平均执行时间</TableCell>
                      <TableCell align="right">最后运行</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyticsData.topWorkflows.map((workflow) => (
                      <TableRow key={workflow.id}>
                        <TableCell>
                          <Typography variant="subtitle2">{workflow.name}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          {formatNumber(workflow.runs)}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${workflow.successRate}%`}
                            size="small"
                            color={workflow.successRate >= 98 ? 'success' : workflow.successRate >= 95 ? 'warning' : 'error'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {workflow.avgExecutionTime}s
                        </TableCell>
                        <TableCell align="right">
                          {formatTime(workflow.lastRun)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Model Usage */}
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4">模型使用情况</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>模型</TableCell>
                      <TableCell align="right">请求数</TableCell>
                      <TableCell align="right">Token数</TableCell>
                      <TableCell align="right">成功率</TableCell>
                      <TableCell align="right">平均响应时间</TableCell>
                      <TableCell align="right">成本 (USD)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analyticsData.modelUsage.map((model) => (
                      <TableRow key={model.model}>
                        <TableCell>
                          <Typography variant="subtitle2">{model.model}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          {formatNumber(model.requests)}
                        </TableCell>
                        <TableCell align="right">
                          {formatNumber(model.tokens)}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${model.successRate}%`}
                            size="small"
                            color={model.successRate >= 98 ? 'success' : model.successRate >= 95 ? 'warning' : 'error'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {model.avgResponseTime}s
                        </TableCell>
                        <TableCell align="right">
                          ${model.cost.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* User Activity Trends */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="mb-4">用户活跃度趋势</Typography>
                  <div className="space-y-3">
                    {analyticsData.userActivity.slice(-7).map((activity, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <Typography variant="body2">
                          {new Date(activity.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                        </Typography>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <Typography variant="caption" color="textSecondary">活跃用户</Typography>
                            <Typography variant="body2" className="font-medium">
                              {activity.activeUsers}
                            </Typography>
                          </div>
                          <div className="text-center">
                            <Typography variant="caption" color="textSecondary">新用户</Typography>
                            <Typography variant="body2" className="font-medium">
                              {activity.newUsers}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="mb-4">执行趋势</Typography>
                  <div className="space-y-3">
                    {analyticsData.trends.slice(-7).map((trend, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <Typography variant="body2">
                          {new Date(trend.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                        </Typography>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <Typography variant="caption" color="textSecondary">执行次数</Typography>
                            <Typography variant="body2" className="font-medium">
                              {formatNumber(trend.executions)}
                            </Typography>
                          </div>
                          <div className="text-center">
                            <Typography variant="caption" color="textSecondary">成功率</Typography>
                            <Typography variant="body2" className="font-medium">
                              {trend.successRate}%
                            </Typography>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* Summary insights */}
      <Card>
        <CardContent>
          <Typography variant="h6" className="mb-4">关键洞察</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <Typography variant="h6" className="text-blue-900 mb-1">
                  增长趋势
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  平台使用量在过去30天内增长了12.5%，用户活跃度持续提升
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <Typography variant="h6" className="text-green-900 mb-1">
                  高可靠性
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  整体成功率保持在98.5%以上，系统稳定性表现优异
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Activity className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <Typography variant="h6" className="text-yellow-900 mb-1">
                  性能优化
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  平均响应时间2.3秒，建议进一步优化模型配置和缓存策略
                </Typography>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalyticsPage