import React, { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity, 
  Download,
  RotateCcw,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
)

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


  // Chart configuration options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          borderDash: [5, 5]
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6
      },
      line: {
        tension: 0.4
      }
    }
  }

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
      { date: '2024-01-15', executions: 556, successRate: 98.6, responseTime: 2.1, tokens: 102000 },
      { date: '2024-01-16', executions: 589, successRate: 98.8, responseTime: 2.0, tokens: 108000 },
      { date: '2024-01-17', executions: 623, successRate: 99.1, responseTime: 1.9, tokens: 115000 },
      { date: '2024-01-18', executions: 598, successRate: 98.9, responseTime: 2.0, tokens: 110000 },
      { date: '2024-01-19', executions: 645, successRate: 99.2, responseTime: 1.8, tokens: 118000 },
      { date: '2024-01-20', executions: 678, successRate: 99.0, responseTime: 1.9, tokens: 125000 },
      { date: '2024-01-21', executions: 612, successRate: 98.7, responseTime: 2.1, tokens: 112000 },
      { date: '2024-01-22', executions: 701, successRate: 99.3, responseTime: 1.8, tokens: 130000 }
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
      { date: '2024-01-15', activeUsers: 75, newUsers: 2, totalSessions: 278 },
      { date: '2024-01-16', activeUsers: 78, newUsers: 5, totalSessions: 289 },
      { date: '2024-01-17', activeUsers: 82, newUsers: 7, totalSessions: 312 },
      { date: '2024-01-18', activeUsers: 79, newUsers: 4, totalSessions: 298 },
      { date: '2024-01-19', activeUsers: 85, newUsers: 8, totalSessions: 325 },
      { date: '2024-01-20', activeUsers: 89, newUsers: 9, totalSessions: 345 },
      { date: '2024-01-21', activeUsers: 86, newUsers: 6, totalSessions: 318 },
      { date: '2024-01-22', activeUsers: 91, newUsers: 10, totalSessions: 356 }
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
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      {/* Page header */}
      <div className="text-center mb-8">

        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 mb-2">
          数据分析
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          深入了解平台使用情况、性能指标和用户行为分析
        </p>
        

      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex items-center space-x-4">
          <FormControl size="small">
            <InputLabel>时间范围</InputLabel>
            <Select
              value={timeRange}
              label="时间范围"
              onChange={(e) => setTimeRange(e.target.value)}
              className="min-w-[180px]"
            >
              <MenuItem value="7d">最近7天</MenuItem>
              <MenuItem value="30d">最近30天</MenuItem>
              <MenuItem value="90d">最近90天</MenuItem>
              <MenuItem value="1y">最近1年</MenuItem>
            </Select>
          </FormControl>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshData}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none"
          >
            <RotateCcw className={`w-5 h-5 ${refreshData ? 'animate-spin' : ''}`} />
            <span>刷新数据</span>
          </button>
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
                  <Typography variant="h6" className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-bold">
                    用户活跃度趋势
                  </Typography>
                  <div className="h-80">
                    <Line
                      data={{
                        labels: analyticsData.userActivity.slice(-12).map(activity => 
                          new Date(activity.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
                        ),
                        datasets: [
                          {
                            label: '活跃用户',
                            data: analyticsData.userActivity.slice(-12).map(activity => activity.activeUsers),
                            borderColor: 'rgb(59, 130, 246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: 'rgb(59, 130, 246)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2
                          },
                          {
                            label: '新用户',
                            data: analyticsData.userActivity.slice(-12).map(activity => activity.newUsers),
                            borderColor: 'rgb(16, 185, 129)',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: 'rgb(16, 185, 129)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2
                          }
                        ]
                      }}
                      options={chartOptions}
                    />
                  </div>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-bold">
                    执行趋势
                  </Typography>
                  <div className="h-80">
                    <Line
                      data={{
                        labels: analyticsData.trends.slice(-12).map(trend => 
                          new Date(trend.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
                        ),
                        datasets: [
                          {
                            label: '执行次数',
                            data: analyticsData.trends.slice(-12).map(trend => trend.executions),
                            borderColor: 'rgb(147, 51, 234)',
                            backgroundColor: 'rgba(147, 51, 234, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: 'rgb(147, 51, 234)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            yAxisID: 'y'
                          },
                          {
                            label: '成功率 (%)',
                            data: analyticsData.trends.slice(-12).map(trend => trend.successRate),
                            borderColor: 'rgb(236, 72, 153)',
                            backgroundColor: 'rgba(236, 72, 153, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: 'rgb(236, 72, 153)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            yAxisID: 'y1'
                          }
                        ]
                      }}
                      options={{
                        ...chartOptions,
                        scales: {
                          x: {
                            ...chartOptions.scales.x
                          },
                          y: {
                            type: 'linear' as const,
                            display: true,
                            position: 'left' as const,
                            grid: {
                              color: 'rgba(0, 0, 0, 0.05)',
                              borderDash: [5, 5]
                            },
                            ticks: {
                              font: { size: 11 }
                            }
                          },
                          y1: {
                            type: 'linear' as const,
                            display: true,
                            position: 'right' as const,
                            grid: {
                              drawOnChartArea: false
                            },
                            ticks: {
                              font: { size: 11 },
                              callback: function(value) {
                                return value + '%'
                              }
                            },
                            min: 95,
                            max: 100
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

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