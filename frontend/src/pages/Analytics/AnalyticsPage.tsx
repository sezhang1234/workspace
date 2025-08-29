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
    // New LLM metrics
    totalInputTokens: number
    totalOutputTokens: number
    averageQPS: number
    averageCallLatency: number
  }
  trends: {
    date: string
    executions: number
    successRate: number
    responseTime: number
    tokens: number
    // New LLM trend metrics
    inputTokens: number
    outputTokens: number
    qps: number
    callLatency: number
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
  // New LLM performance data
  llmPerformance: {
    date: string
    totalRequests: number
    inputTokens: number
    outputTokens: number
    qps: number
    avgLatency: number
    p95Latency: number
    p99Latency: number
    errorRate: number
    costPerDay: number
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
      totalTokens: 2847500,
      // New LLM metrics
      totalInputTokens: 12000000,
      totalOutputTokens: 8000000,
      averageQPS: 150,
      averageCallLatency: 150
    },
    trends: [
      { date: '2024-01-10', executions: 512, successRate: 98.2, responseTime: 2.1, tokens: 95000, inputTokens: 100000, outputTokens: 80000, qps: 120, callLatency: 120 },
      { date: '2024-01-11', executions: 498, successRate: 98.7, responseTime: 2.4, tokens: 92000, inputTokens: 90000, outputTokens: 75000, qps: 115, callLatency: 130 },
      { date: '2024-01-12', executions: 534, successRate: 98.1, responseTime: 2.2, tokens: 98000, inputTokens: 105000, outputTokens: 85000, qps: 125, callLatency: 125 },
      { date: '2024-01-13', executions: 521, successRate: 98.9, responseTime: 2.0, tokens: 96000, inputTokens: 98000, outputTokens: 78000, qps: 122, callLatency: 122 },
      { date: '2024-01-14', executions: 487, successRate: 98.3, responseTime: 2.3, tokens: 89000, inputTokens: 92000, outputTokens: 72000, qps: 118, callLatency: 128 },
      { date: '2024-01-15', executions: 556, successRate: 98.6, responseTime: 2.1, tokens: 102000, inputTokens: 108000, outputTokens: 82000, qps: 128, callLatency: 120 },
      { date: '2024-01-16', executions: 589, successRate: 98.8, responseTime: 2.0, tokens: 108000, inputTokens: 110000, outputTokens: 85000, qps: 130, callLatency: 118 },
      { date: '2024-01-17', executions: 623, successRate: 99.1, responseTime: 1.9, tokens: 115000, inputTokens: 112000, outputTokens: 88000, qps: 132, callLatency: 115 },
      { date: '2024-01-18', executions: 598, successRate: 98.9, responseTime: 2.0, tokens: 110000, inputTokens: 109000, outputTokens: 84000, qps: 129, callLatency: 121 },
      { date: '2024-01-19', executions: 645, successRate: 99.2, responseTime: 1.8, tokens: 118000, inputTokens: 115000, outputTokens: 89000, qps: 131, callLatency: 119 },
      { date: '2024-01-20', executions: 678, successRate: 99.0, responseTime: 1.9, tokens: 125000, inputTokens: 118000, outputTokens: 92000, qps: 133, callLatency: 117 },
      { date: '2024-01-21', executions: 612, successRate: 98.7, responseTime: 2.1, tokens: 112000, inputTokens: 113000, outputTokens: 87000, qps: 130, callLatency: 122 },
      { date: '2024-01-22', executions: 701, successRate: 99.3, responseTime: 1.8, tokens: 130000, inputTokens: 120000, outputTokens: 95000, qps: 135, callLatency: 116 }
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
    ],
    // New LLM performance data
    llmPerformance: [
      { date: '2024-01-10', totalRequests: 1200, inputTokens: 1200000, outputTokens: 900000, qps: 120, avgLatency: 120, p95Latency: 130, p99Latency: 140, errorRate: 0.2, costPerDay: 15.68 },
      { date: '2024-01-11', totalRequests: 1100, inputTokens: 1100000, outputTokens: 850000, qps: 110, avgLatency: 115, p95Latency: 125, p99Latency: 135, errorRate: 0.3, costPerDay: 14.20 },
      { date: '2024-01-12', totalRequests: 1250, inputTokens: 1250000, outputTokens: 950000, qps: 125, avgLatency: 125, p95Latency: 135, p99Latency: 145, errorRate: 0.2, costPerDay: 15.80 },
      { date: '2024-01-13', totalRequests: 1220, inputTokens: 1220000, outputTokens: 920000, qps: 122, avgLatency: 122, p95Latency: 132, p99Latency: 142, errorRate: 0.2, costPerDay: 15.40 },
      { date: '2024-01-14', totalRequests: 1180, inputTokens: 1180000, outputTokens: 880000, qps: 118, avgLatency: 128, p95Latency: 138, p99Latency: 148, errorRate: 0.3, costPerDay: 14.90 },
      { date: '2024-01-15', totalRequests: 1280, inputTokens: 1280000, outputTokens: 920000, qps: 128, avgLatency: 120, p95Latency: 130, p99Latency: 140, errorRate: 0.2, costPerDay: 15.60 },
      { date: '2024-01-16', totalRequests: 1300, inputTokens: 1300000, outputTokens: 950000, qps: 130, avgLatency: 118, p95Latency: 128, p99Latency: 138, errorRate: 0.2, costPerDay: 15.80 },
      { date: '2024-01-17', totalRequests: 1320, inputTokens: 1320000, outputTokens: 980000, qps: 132, avgLatency: 115, p95Latency: 125, p99Latency: 135, errorRate: 0.2, costPerDay: 15.40 },
      { date: '2024-01-18', totalRequests: 1290, inputTokens: 1290000, outputTokens: 940000, qps: 129, avgLatency: 121, p95Latency: 131, p99Latency: 141, errorRate: 0.2, costPerDay: 15.60 },
      { date: '2024-01-19', totalRequests: 1310, inputTokens: 1310000, outputTokens: 990000, qps: 131, avgLatency: 119, p95Latency: 129, p99Latency: 139, errorRate: 0.2, costPerDay: 15.40 },
      { date: '2024-01-20', totalRequests: 1330, inputTokens: 1330000, outputTokens: 1020000, qps: 133, avgLatency: 117, p95Latency: 127, p99Latency: 137, errorRate: 0.2, costPerDay: 15.60 },
      { date: '2024-01-21', totalRequests: 1300, inputTokens: 1300000, outputTokens: 870000, qps: 130, avgLatency: 122, p95Latency: 132, p99Latency: 142, errorRate: 0.2, costPerDay: 15.40 },
      { date: '2024-01-22', totalRequests: 1350, inputTokens: 1350000, outputTokens: 950000, qps: 135, avgLatency: 116, p95Latency: 126, p99Latency: 136, errorRate: 0.2, costPerDay: 15.80 }
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
          <div className="sm:w-48">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 focus:bg-white"
            >
              <option value="7d">最近7天</option>
              <option value="30d">最近30天</option>
              <option value="90d">最近90天</option>
              <option value="1y">最近1年</option>
            </select>
          </div>
          
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

      {/* LLM Performance Overview */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <Typography variant="h4" className="font-bold text-gray-900">
                {formatNumber(analyticsData.overview.totalInputTokens)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                输入Token总数
              </Typography>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <Typography variant="caption" className="text-green-600">
                  +8.2%
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-lg mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-teal-600" />
              </div>
              <Typography variant="h4" className="font-bold text-gray-900">
                {formatNumber(analyticsData.overview.totalOutputTokens)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                输出Token总数
              </Typography>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <Typography variant="caption" className="text-green-600">
                  +7.8%
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <Typography variant="h4" className="font-bold text-gray-900">
                {analyticsData.overview.averageQPS}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                平均QPS
              </Typography>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <Typography variant="caption" className="text-green-600">
                  +5.2%
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mx-auto mb-3">
                <Activity className="w-6 h-6 text-red-600" />
              </div>
              <Typography variant="h4" className="font-bold text-gray-900">
                {analyticsData.overview.averageCallLatency}ms
              </Typography>
              <Typography variant="body2" color="textSecondary">
                平均调用延迟
              </Typography>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                <Typography variant="caption" className="text-red-600">
                  +2.1ms
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
                      <TableCell align="right">成本 (CNY)</TableCell>
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
                          ¥{model.cost.toFixed(2)}
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

      {/* LLM Performance Charts */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-bold">
                Token消耗趋势
              </Typography>
              <div className="h-80">
                <Line
                  data={{
                    labels: analyticsData.trends.slice(-12).map(trend => 
                      new Date(trend.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
                    ),
                    datasets: [
                      {
                        label: '输入Token',
                        data: analyticsData.trends.slice(-12).map(trend => trend.inputTokens),
                        borderColor: 'rgb(99, 102, 241)',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: 'rgb(99, 102, 241)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                      },
                      {
                        label: '输出Token',
                        data: analyticsData.trends.slice(-12).map(trend => trend.outputTokens),
                        borderColor: 'rgb(20, 184, 166)',
                        backgroundColor: 'rgba(20, 184, 166, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: 'rgb(20, 184, 166)',
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
              <Typography variant="h6" className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 font-bold">
                LLM性能指标
              </Typography>
              <div className="h-80">
                <Line
                  data={{
                    labels: analyticsData.trends.slice(-12).map(trend => 
                      new Date(trend.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
                    ),
                    datasets: [
                      {
                        label: 'QPS',
                        data: analyticsData.trends.slice(-12).map(trend => trend.qps),
                        borderColor: 'rgb(249, 115, 22)',
                        backgroundColor: 'rgba(249, 115, 22, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: 'rgb(249, 115, 22)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        yAxisID: 'y'
                      },
                      {
                        label: '调用延迟 (ms)',
                        data: analyticsData.trends.slice(-12).map(trend => trend.callLatency),
                        borderColor: 'rgb(239, 68, 68)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: 'rgb(239, 68, 68)',
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
                            return value + 'ms'
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* LLM Performance Details */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 font-bold">
                LLM性能详细数据
              </Typography>
              <div className="h-80">
                <Line
                  data={{
                    labels: analyticsData.llmPerformance.slice(-12).map(perf => 
                      new Date(perf.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
                    ),
                    datasets: [
                      {
                        label: '平均延迟 (ms)',
                        data: analyticsData.llmPerformance.slice(-12).map(perf => perf.avgLatency),
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
                        label: 'P95延迟 (ms)',
                        data: analyticsData.llmPerformance.slice(-12).map(perf => perf.p95Latency),
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: 'rgb(16, 185, 129)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                      },
                      {
                        label: 'P99延迟 (ms)',
                        data: analyticsData.llmPerformance.slice(-12).map(perf => perf.p99Latency),
                        borderColor: 'rgb(245, 158, 11)',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: 'rgb(245, 158, 11)',
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

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 font-bold">
                LLM成本统计
              </Typography>
              <div className="h-80">
                <Line
                  data={{
                    labels: analyticsData.llmPerformance.slice(-12).map(perf => 
                      new Date(perf.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
                    ),
                    datasets: [
                      {
                        label: '日成本 (CNY)',
                        data: analyticsData.llmPerformance.slice(-12).map(perf => perf.costPerDay),
                        borderColor: 'rgb(34, 197, 94)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: 'rgb(34, 197, 94)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
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
                        ...chartOptions.scales.y,
                        ticks: {
                          ...chartOptions.scales.y.ticks,
                                                  callback: function(value) {
                          return '¥' + value
                        }
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* LLM Performance Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600 font-bold">
            LLM性能统计表
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>日期</TableCell>
                  <TableCell align="right">总请求数</TableCell>
                  <TableCell align="right">输入Token</TableCell>
                  <TableCell align="right">输出Token</TableCell>
                  <TableCell align="right">QPS</TableCell>
                  <TableCell align="right">平均延迟 (ms)</TableCell>
                  <TableCell align="right">P95延迟 (ms)</TableCell>
                  <TableCell align="right">P99延迟 (ms)</TableCell>
                  <TableCell align="right">错误率 (%)</TableCell>
                                        <TableCell align="right">日成本 (CNY)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analyticsData.llmPerformance.slice(-7).map((perf) => (
                  <TableRow key={perf.date}>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {new Date(perf.date).toLocaleDateString('zh-CN')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {formatNumber(perf.totalRequests)}
                    </TableCell>
                    <TableCell align="right">
                      {formatNumber(perf.inputTokens)}
                    </TableCell>
                    <TableCell align="right">
                      {formatNumber(perf.outputTokens)}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={perf.qps}
                        size="small"
                        color={perf.qps >= 130 ? 'success' : perf.qps >= 120 ? 'warning' : 'error'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {perf.avgLatency}ms
                    </TableCell>
                    <TableCell align="right">
                      {perf.p95Latency}ms
                    </TableCell>
                    <TableCell align="right">
                      {perf.p99Latency}ms
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${perf.errorRate}%`}
                        size="small"
                        color={perf.errorRate <= 0.2 ? 'success' : perf.errorRate <= 0.5 ? 'warning' : 'error'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      ¥{perf.costPerDay.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

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