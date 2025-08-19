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
  AlertCircle
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
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      position,
      data: { 
        label: type === 'startNode' ? '开始' : 
               type === 'actionNode' ? '动作' :
               type === 'conditionNode' ? '条件' : '结束'
      }
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outlined"
            startIcon={<ArrowLeft />}
            onClick={() => navigate('/dashboard/workflows')}
          >
            返回
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? '创建工作流' : '编辑工作流'}
            </h1>
            <p className="text-gray-600">
              {isNew ? '使用可视化编辑器设计自动化工作流' : '修改工作流配置和节点'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outlined"
            startIcon={showNodePanel ? <EyeOff /> : <Eye />}
            onClick={() => setShowNodePanel(!showNodePanel)}
          >
            {showNodePanel ? '隐藏面板' : '显示面板'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Play />}
          >
            测试运行
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
                <Typography variant="h6" className="mb-4">节点库</Typography>
                <div className="space-y-2">
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<Plus />}
                    onClick={() => addNode('startNode', { x: 100, y: 100 })}
                  >
                    开始节点
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<Zap />}
                    onClick={() => addNode('actionNode', { x: 300, y: 200 })}
                  >
                    动作节点
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<Settings />}
                    onClick={() => addNode('conditionNode', { x: 500, y: 200 })}
                  >
                    条件节点
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<CheckCircle />}
                    onClick={() => addNode('endNode', { x: 700, y: 300 })}
                  >
                    结束节点
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">执行统计</Typography>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>总执行次数:</span>
                    <span className="font-medium">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span>成功率:</span>
                    <span className="font-medium text-green-600">98.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>平均执行时间:</span>
                    <span className="font-medium">2.3s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>最后执行:</span>
                    <span className="font-medium">2小时前</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main canvas area */}
        <div className={`${showNodePanel ? 'lg:col-span-3' : 'lg:col-span-4'} h-[600px]`}>
          <Card className="h-full">
            <CardContent className="h-full p-0">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                className="h-full"
              >
                <Controls />
                <Background />
                <MiniMap />
                <Panel position="top-right" className="bg-white p-2 rounded shadow">
                  <div className="flex space-x-2">
                    <Tooltip title="导入工作流">
                      <Button
                        size="small"
                        variant="outlined"
                        component="label"
                        startIcon={<Upload />}
                      >
                        <input
                          type="file"
                          hidden
                          accept=".json"
                          onChange={handleImport}
                        />
                      </Button>
                    </Tooltip>
                    <Tooltip title="导出工作流">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={handleExport}
                      />
                    </Tooltip>
                  </div>
                </Panel>
              </ReactFlow>
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