import React, { useState, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Workflow, 
  ArrowLeft, 
  Save, 
  Play, 
  Settings, 
  Plus,
  Trash2,
  Copy,
  Download,
  Upload,
  Eye,
  EyeOff,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Repeat,
  BarChart3
} from 'lucide-react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  EdgeTypes,
  Panel,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow'
import 'reactflow/dist/style.css'
import { 
  Button, 
  TextField, 
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
  Divider,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip
} from '@mui/material'

// Custom node types
import CustomStartNode from '../../components/WorkflowNodes/CustomStartNode'
import CustomActionNode from '../../components/WorkflowNodes/CustomActionNode'
import CustomConditionNode from '../../components/WorkflowNodes/CustomConditionNode'
import CustomEndNode from '../../components/WorkflowNodes/CustomEndNode'
import CustomLoopNode from '../../components/WorkflowNodes/CustomLoopNode'

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
      id={`workflow-tabpanel-${index}`}
      aria-labelledby={`workflow-tab-${index}`}
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

// Node types for ReactFlow
const nodeTypes: NodeTypes = {
  startNode: CustomStartNode,
  actionNode: CustomActionNode,
  conditionNode: CustomConditionNode,
  endNode: CustomEndNode,
  loopNode: CustomLoopNode,
}

const WorkflowEditorContent: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const [activeTab, setActiveTab] = useState(0)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
  const [showNodePanel, setShowNodePanel] = useState(true)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [nodeConfigDialog, setNodeConfigDialog] = useState(false)

  // Workflow state
  const [workflow, setWorkflow] = useState({
    name: isNew ? '' : '客户服务自动化流程',
    description: isNew ? '' : '自动处理客户咨询、投诉和建议的完整流程',
    trigger: isNew ? 'webhook' : 'webhook',
    isActive: isNew ? false : true,
    tags: isNew ? [] : ['自动化', '客服', '工作流'],
    executionMode: isNew ? 'sequential' : 'sequential',
    timeout: isNew ? 300 : 300,
    retryCount: isNew ? 3 : 3
  })

  // ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: 'start-1',
      type: 'startNode',
      position: { x: 100, y: 100 },
      data: { label: '开始', trigger: 'webhook' }
    }
  ])
  
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    setNodeConfigDialog(true)
  }, [])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleSave = () => {
    setSnackbar({ open: true, message: '工作流保存成功！', severity: 'success' })
  }

  const addNode = (type: string, position: { x: number; y: number }) => {
    let defaultData: any = { label: '新节点' }
    
    switch (type) {
      case 'startNode':
        defaultData = { 
          label: '开始', 
          trigger: 'webhook',
          executionCount: 0,
          lastExecuted: '从未'
        }
        break
      case 'actionNode':
        defaultData = { 
          label: '动作', 
          actionType: 'api_call',
          timeout: 30,
          retries: 3,
          priority: 'normal',
          status: 'ready',
          avgDuration: 0,
          successRate: 100,
          executionCount: 0,
          lastExecuted: '从未'
        }
        break
      case 'conditionNode':
        defaultData = { 
          label: '条件', 
          conditionType: 'comparison',
          condition: 'if (value > 0)',
          truePath: '继续执行',
          falsePath: '跳过执行',
          priority: 'normal',
          timeout: 10,
          evaluationCount: 0,
          lastEvaluated: '从未'
        }
        break
      case 'loopNode':
        defaultData = { 
          label: '循环', 
          loopType: 'while',
          condition: 'while (condition)',
          maxIterations: '∞',
          timeout: 300,
          status: 'ready',
          currentIteration: 0,
          totalIterations: 0,
          avgIterationTime: 0,
          successRate: 100,
          variables: ['i', 'item'],
          executionCount: 0,
          lastExecuted: '从未'
        }
        break
      case 'endNode':
        defaultData = { 
          label: '结束', 
          endType: 'success',
          description: '工作流执行完成',
          totalDuration: 0,
          totalNodes: 0,
          successNodes: 0,
          failedNodes: 0,
          completedAt: '刚刚',
          executionCount: 1
        }
        break
    }

    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      position,
      data: defaultData
    }
    setNodes((nds) => [...nds, newNode])
  }

  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter(node => node.id !== nodeId))
    setEdges((eds) => eds.filter(edge => edge.source !== nodeId && edge.target !== nodeId))
  }

  const handleNodeConfigSave = (nodeData: any) => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, ...nodeData } }
            : node
        )
      )
      setNodeConfigDialog(false)
      setSelectedNode(null)
    }
  }

  const handleExport = () => {
    const workflowData = {
      workflow,
      nodes,
      edges
    }
    const dataStr = JSON.stringify(workflowData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${workflow.name || 'workflow'}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedWorkflow = JSON.parse(e.target?.result as string)
          setWorkflow(importedWorkflow.workflow)
          setNodes(importedWorkflow.nodes)
          setEdges(importedWorkflow.edges)
          setSnackbar({ open: true, message: '工作流配置导入成功', severity: 'success' })
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
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <div className="flex items-center space-x-4">
          <Button
            variant="outlined"
            startIcon={<ArrowLeft />}
            onClick={() => navigate('/dashboard/workflows')}
            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
          >
            返回
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {isNew ? '创建工作流' : '编辑工作流'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isNew ? '使用可视化编辑器设计自动化工作流' : '修改工作流配置和节点'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Import/Export buttons */}
          <Tooltip title="导入工作流">
            <Button
              variant="outlined"
              component="label"
              startIcon={<Upload />}
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <input
                type="file"
                hidden
                accept=".json"
                onChange={handleImport}
              />
              导入
            </Button>
          </Tooltip>
          
          <Tooltip title="导出工作流">
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExport}
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              导出
            </Button>
          </Tooltip>

          <Button
            variant="outlined"
            startIcon={showNodePanel ? <EyeOff /> : <Eye />}
            onClick={() => setShowNodePanel(!showNodePanel)}
            className="border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            {showNodePanel ? '隐藏面板' : '显示面板'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Play />}
            className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
          >
            测试运行
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
          >
            保存
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar - Workflow configuration */}
        {showNodePanel && (
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">工作流配置</Typography>
                <div className="space-y-4">
                  <TextField
                    fullWidth
                    size="small"
                    label="工作流名称"
                    value={workflow.name}
                    onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
                  />
                  
                  <FormControl fullWidth size="small">
                    <InputLabel>触发器</InputLabel>
                    <Select
                      value={workflow.trigger}
                      label="触发器"
                      onChange={(e) => setWorkflow({ ...workflow, trigger: e.target.value })}
                    >
                      <MenuItem value="webhook">Webhook</MenuItem>
                      <MenuItem value="schedule">定时任务</MenuItem>
                      <MenuItem value="manual">手动触发</MenuItem>
                      <MenuItem value="event">事件驱动</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={workflow.isActive}
                        onChange={(e) => setWorkflow({ ...workflow, isActive: e.target.checked })}
                      />
                    }
                    label="启用工作流"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-blue-600" />
                  节点库
                </Typography>
                <div className="space-y-3">
                  {/* Start Node */}
                  <div className="group">
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<Play className="w-4 h-4" />}
                      onClick={() => addNode('startNode', { x: 100, y: 100 })}
                      className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                    >
                      开始节点
                    </Button>
                    <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      工作流的起点，定义触发条件
                    </div>
                  </div>

                  {/* Action Node */}
                  <div className="group">
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<Zap className="w-4 h-4" />}
                      onClick={() => addNode('actionNode', { x: 300, y: 200 })}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                    >
                      动作节点
                    </Button>
                    <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      执行具体操作，如API调用、数据处理等
                    </div>
                  </div>

                  {/* Condition Node */}
                  <div className="group">
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<Settings className="w-4 h-4" />}
                      onClick={() => addNode('conditionNode', { x: 500, y: 200 })}
                      className="border-yellow-200 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-300 transition-all duration-200"
                    >
                      条件节点
                    </Button>
                    <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      根据条件决定执行路径
                    </div>
                  </div>

                  {/* Loop Node */}
                  <div className="group">
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<Repeat className="w-4 h-4" />}
                      onClick={() => addNode('loopNode', { x: 400, y: 300 })}
                      className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                    >
                      循环节点
                    </Button>
                    <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      重复执行特定逻辑，支持多种循环类型
                    </div>
                  </div>

                  {/* End Node */}
                  <div className="group">
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<CheckCircle className="w-4 h-4" />}
                      onClick={() => addNode('endNode', { x: 700, y: 300 })}
                      className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                    >
                      结束节点
                    </Button>
                    <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      工作流的终点，返回执行结果
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                  执行统计
                </Typography>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-700">总执行次数</span>
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Play className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-green-800 mt-2">1,234</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700">成功率</span>
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-blue-800 mt-2">98.5%</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-3 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-purple-700">平均执行时间</span>
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Clock className="w-4 h-4 text-purple-600" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-purple-800 mt-2">2.3s</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-orange-700">最后执行</span>
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <Zap className="w-4 h-4 text-orange-600" />
                        </div>
                      </div>
                      <div className="text-lg font-bold text-orange-800 mt-2">2小时前</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main canvas area */}
        <div className={`${showNodePanel ? 'lg:col-span-3' : 'lg:col-span-4'} h-[700px]`}>
          <Card className="h-full shadow-lg border-0">
            <CardContent className="h-full p-0">
              <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={onNodeClick}
                  nodeTypes={nodeTypes}
                  fitView
                  attributionPosition="bottom-left"
                  className="bg-transparent"
                  proOptions={{ hideAttribution: true }}
                >
                  {/* Enhanced background with grid */}
                  <Background 
                    variant="dots" 
                    gap={20} 
                    size={1} 
                    color="#e5e7eb"
                    className="opacity-30"
                  />
                  
                  {/* Enhanced controls */}
                  <Controls 
                    className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg"
                    showZoom={true}
                    showFitView={true}
                    showInteractive={true}
                  />
                  
                  {/* Enhanced minimap */}
                  <MiniMap 
                    className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg"
                    nodeColor={(node) => {
                      switch (node.type) {
                        case 'startNode': return '#10b981'
                        case 'actionNode': return '#3b82f6'
                        case 'conditionNode': return '#f59e0b'
                        case 'loopNode': return '#8b5cf6'
                        case 'endNode': return '#ef4444'
                        default: return '#6b7280'
                      }
                    }}
                    nodeStrokeWidth={3}
                    zoomable
                    pannable
                  />
                  
                  {/* Enhanced panel for workflow info */}
                  <Panel position="top-right" className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>节点: {nodes.length}</span>
                      <span>•</span>
                      <span>连接: {edges.length}</span>
                    </div>
                  </Panel>
                </ReactFlow>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Node configuration dialog */}
      <Dialog
        open={nodeConfigDialog}
        onClose={() => setNodeConfigDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          配置节点: {selectedNode?.data.label}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <TextField
              fullWidth
              label="节点名称"
              defaultValue={selectedNode?.data.label}
            />
            
            {selectedNode?.type === 'actionNode' && (
              <FormControl fullWidth>
                <InputLabel>动作类型</InputLabel>
                <Select defaultValue="api_call" label="动作类型">
                  <MenuItem value="api_call">API调用</MenuItem>
                  <MenuItem value="data_process">数据处理</MenuItem>
                  <MenuItem value="notification">发送通知</MenuItem>
                  <MenuItem value="file_operation">文件操作</MenuItem>
                </Select>
              </FormControl>
            )}

            {selectedNode?.type === 'conditionNode' && (
              <FormControl fullWidth>
                <InputLabel>条件类型</InputLabel>
                <Select defaultValue="if_else" label="条件类型">
                  <MenuItem value="if_else">如果/否则</MenuItem>
                  <MenuItem value="switch">开关判断</MenuItem>
                  <MenuItem value="loop">循环判断</MenuItem>
                </Select>
              </FormControl>
            )}

            <TextField
              fullWidth
              multiline
              rows={3}
              label="节点描述"
              placeholder="描述此节点的功能和作用..."
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNodeConfigDialog(false)}>取消</Button>
          <Button 
            variant="contained" 
            onClick={() => handleNodeConfigSave({})}
          >
            保存
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

const WorkflowEditorPage: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowEditorContent />
    </ReactFlowProvider>
  )
}

export default WorkflowEditorPage