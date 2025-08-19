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
  BarChart3,
  Search,
  Brain,
  MessageSquare,
  Database,
  X
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
import CustomKnowledgeRetrievalNode from '../../components/WorkflowNodes/CustomKnowledgeRetrievalNode'
import CustomAnswerNode from '../../components/WorkflowNodes/CustomAnswerNode'
import CustomQuestionClassifierNode from '../../components/WorkflowNodes/CustomQuestionClassifierNode'
import CustomVariableAggregatorNode from '../../components/WorkflowNodes/CustomVariableAggregatorNode'

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
  knowledgeRetrievalNode: CustomKnowledgeRetrievalNode,
  answerNode: CustomAnswerNode,
  questionClassifierNode: CustomQuestionClassifierNode,
  variableAggregatorNode: CustomVariableAggregatorNode,
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
      case 'knowledgeRetrievalNode':
        defaultData = { 
          label: '知识检索', 
          retrievalType: 'vector_search',
          query: '用户查询内容...',
          maxResults: 10,
          similarityThreshold: 0.8,
          timeout: 30,
          sources: ['知识库1', '文档库2'],
          status: 'ready',
          resultsFound: 0,
          searchTime: 0,
          avgResponseTime: 0,
          successRate: 100,
          cacheHitRate: 0,
          executionCount: 0,
          lastExecuted: '从未'
        }
        break
      case 'questionClassifierNode':
        defaultData = { 
          label: '问题分类', 
          classifierType: 'intent_classification',
          inputQuestion: '用户输入的问题...',
          confidenceThreshold: 0.8,
          maxLabels: 5,
          timeout: 30,
          status: 'ready',
          classificationResults: [
            { label: '咨询类', confidence: 85 },
            { label: '投诉类', confidence: 15 }
          ],
          topConfidence: 85,
          classificationTime: 0,
          modelName: 'intent-classifier-v1',
          modelVersion: '1.0.0',
          accuracy: 95,
          avgResponseTime: 0,
          successRate: 100,
          cacheHitRate: 0,
          executionCount: 0,
          lastExecuted: '从未'
        }
        break
      case 'answerNode':
        defaultData = { 
          label: '答案生成', 
          answerType: 'llm_generation',
          inputContext: '用户问题和检索到的知识...',
          maxLength: 500,
          temperature: 0.7,
          timeout: 60,
          status: 'ready',
          generatedAnswer: '',
          relevanceScore: 0,
          completenessScore: 0,
          generationTime: 0,
          tokensUsed: 0,
          successRate: 100,
          executionCount: 0,
          lastExecuted: '从未'
        }
        break
      case 'variableAggregatorNode':
        defaultData = { 
          label: '变量聚合', 
          aggregatorType: 'sum',
          inputVariables: ['变量1', '变量2'],
          groupBy: '无',
          filterCondition: '无',
          timeout: 30,
          status: 'ready',
          customFunction: '',
          aggregationResults: {},
          recordsProcessed: 0,
          processingTime: 0,
          validRecords: 0,
          missingRecords: 0,
          anomalyRecords: 0,
          avgResponseTime: 0,
          successRate: 100,
          memoryUsage: 0,
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

  // Close node panel when clicking outside
  const handleCanvasClick = () => {
    if (showNodePanel) {
      setShowNodePanel(false)
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

      <div className="grid grid-cols-1 gap-6">
        {/* Main canvas area - Full width */}
        <div className="h-[800px]">
          <Card className="h-full shadow-lg border-0">
            <CardContent className="h-full p-0">
              <div className={`h-full bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-300 ${showNodePanel ? 'backdrop-blur-sm' : ''}`}>
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
                  onClick={handleCanvasClick}
                >
                  {/* Light grid background */}
                  <Background 
                    variant="grid" 
                    gap={40} 
                    size={1} 
                    color="#e5e7eb"
                    className="opacity-40"
                  />
                  
                  {/* Enhanced controls with Add Node icon button */}
                  <Controls 
                    className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg"
                    showZoom={true}
                    showFitView={true}
                    showInteractive={true}
                  >
                    {/* Custom Add Node icon button above zoom controls */}
                    <div className="absolute -top-12 left-0 right-0 flex justify-center">
                      <button
                        onClick={() => setShowNodePanel(!showNodePanel)}
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
                        title={showNodePanel ? '隐藏节点库' : '添加节点'}
                      >
                        <Plus className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                      </button>
                    </div>
                  </Controls>
                  
                  {/* Floating Node Library Panel */}
                  {showNodePanel && (
                    <Panel 
                      position="top-left" 
                      className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl p-4 min-w-[280px] max-w-[320px] animate-in slide-in-from-top duration-300 ease-out"
                      style={{ 
                        top: '60px', 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        zIndex: 1000
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Typography variant="h6" className="flex items-center text-gray-800 text-sm">
                          <Zap className="w-5 h-5 mr-2 text-blue-600" />
                          节点库
                        </Typography>
                        <div className="flex items-center space-x-2">
                          <div className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
                            {nodes.length}
                          </div>
                          <button
                            onClick={() => setShowNodePanel(false)}
                            className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                            title="关闭"
                          >
                            <X className="w-3 h-3 text-gray-600" />
                          </button>
                        </div>
                      </div>

                      {/* Trigger Nodes Category */}
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-xs font-semibold text-gray-700">触发器</span>
                        </div>
                        <div className="space-y-1">
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={<Play className="w-3 h-3" />}
                            onClick={() => addNode('startNode', { x: 100, y: 100 })}
                            className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 hover:shadow-md transition-all duration-200 text-xs py-1"
                          >
                            开始节点
                          </Button>
                        </div>
                      </div>

                      {/* AI Processing Nodes Category */}
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span className="text-xs font-semibold text-gray-700">AI 处理</span>
                        </div>
                        <div className="space-y-1">
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={<Search className="w-3 h-3" />}
                            onClick={() => addNode('knowledgeRetrievalNode', { x: 300, y: 150 })}
                            className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 hover:shadow-md transition-all duration-200 text-xs py-1"
                          >
                            知识检索
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={<Brain className="w-3 h-3" />}
                            onClick={() => addNode('questionClassifierNode', { x: 300, y: 250 })}
                            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md transition-all duration-200 text-xs py-1"
                          >
                            问题分类
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={<MessageSquare className="w-3 h-3" />}
                            onClick={() => addNode('answerNode', { x: 500, y: 200 })}
                            className="border-pink-200 text-pink-700 hover:bg-pink-50 hover:border-pink-300 hover:shadow-md transition-all duration-200 text-xs py-1"
                          >
                            答案生成
                          </Button>
                        </div>
                      </div>

                      {/* Logic Control Nodes Category */}
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                          <span className="text-xs font-semibold text-gray-700">逻辑控制</span>
                        </div>
                        <div className="space-y-1">
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={<Zap className="w-3 h-3" />}
                            onClick={() => addNode('actionNode', { x: 300, y: 200 })}
                            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-xs py-1"
                          >
                            动作节点
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={<Settings className="w-3 h-3" />}
                            onClick={() => addNode('conditionNode', { x: 500, y: 200 })}
                            className="border-yellow-200 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-300 hover:shadow-md transition-all duration-200 text-xs py-1"
                          >
                            条件节点
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={<Repeat className="w-3 h-3" />}
                            onClick={() => addNode('loopNode', { x: 400, y: 300 })}
                            className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 hover:shadow-md transition-all duration-200 text-xs py-1"
                          >
                            循环节点
                          </Button>
                        </div>
                      </div>

                      {/* Data Processing Nodes Category */}
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                          <span className="text-xs font-semibold text-gray-700">数据处理</span>
                        </div>
                        <div className="space-y-1">
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={<Database className="w-3 h-3" />}
                            onClick={() => addNode('variableAggregatorNode', { x: 400, y: 400 })}
                            className="border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300 hover:shadow-md transition-all duration-200 text-xs py-1"
                          >
                            变量聚合
                          </Button>
                        </div>
                      </div>

                      {/* Output Nodes Category */}
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          <span className="text-xs font-semibold text-gray-700">输出</span>
                        </div>
                        <div className="space-y-1">
                          <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            startIcon={<CheckCircle className="w-3 h-3" />}
                            onClick={() => addNode('endNode', { x: 700, y: 300 })}
                            className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 hover:shadow-md transition-all duration-200 text-xs py-1"
                          >
                            结束节点
                          </Button>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gray-700">快速操作</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            size="small"
                            variant="text"
                            startIcon={<Plus className="w-3 h-3" />}
                            className="text-xs text-blue-600 hover:bg-blue-50 py-1"
                            onClick={() => {
                              const centerX = 400;
                              const centerY = 300;
                              addNode('startNode', { x: centerX - 100, y: centerY - 100 });
                              addNode('endNode', { x: centerX + 100, y: centerY + 100 });
                            }}
                          >
                            基础流程
                          </Button>
                          <Button
                            size="small"
                            variant="text"
                            startIcon={<Zap className="w-3 h-3" />}
                            className="text-xs text-green-600 hover:bg-green-50 py-1"
                            onClick={() => {
                              const centerX = 400;
                              const centerY = 300;
                              addNode('startNode', { x: centerX - 150, y: centerY - 100 });
                              addNode('knowledgeRetrievalNode', { x: centerX - 50, y: centerY - 50 });
                              addNode('answerNode', { x: centerX + 50, y: centerY - 50 });
                              addNode('endNode', { x: centerX + 150, y: centerY - 100 });
                            }}
                          >
                            AI 问答
                          </Button>
                        </div>
                      </div>
                    </Panel>
                  )}
                  
                  {/* Enhanced minimap */}
                  <MiniMap 
                    className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg"
                    nodeColor={(node) => {
                      switch (node.type) {
                        case 'startNode': return '#10b981'
                        case 'actionNode': return '#3b82f6'
                        case 'conditionNode': return '#f59e0b'
                        case 'loopNode': return '#8b5cf6'
                        case 'knowledgeRetrievalNode': return '#06b6d4'
                        case 'questionClassifierNode': return '#6366f1'
                        case 'answerNode': return '#ec4899'
                        case 'variableAggregatorNode': return '#0891b2'
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