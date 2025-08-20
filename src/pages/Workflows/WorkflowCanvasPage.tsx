import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  ArrowLeft, 
  Save, 
  Play, 
  Settings, 
  Plus,
  Download,
  Upload,
  Zap,
  CheckCircle,
  Repeat,
  Search,
  Brain,
  MessageSquare,
  Database,
  X,
  Bot
} from 'lucide-react'
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Panel,
  ReactFlowProvider,
  NodeTypes,
  MarkerType
} from 'reactflow'
import 'reactflow/dist/style.css'
import { 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  Switch, 
  FormControlLabel,
  Typography,
  Card,
  CardContent,
  Alert,
  Snackbar,
  SelectChangeEvent
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
import CustomLLMNode from '../../components/WorkflowNodes/CustomLLMNode'

const WorkflowCanvasContent: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const workflowData = location.state?.workflowData || {}
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
  const [showNodePanel, setShowNodePanel] = useState(false)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  
  // Debug logging for selectedNode changes
  useEffect(() => {
    console.log('🔄 selectedNode state changed:', selectedNode)
    if (selectedNode) {
      console.log('🎯 Configuration dialog should now be visible')
      console.log('📊 selectedNode type:', selectedNode.type)
      console.log('📊 selectedNode data:', selectedNode.data)
    } else {
      console.log('❌ Configuration dialog should now be hidden')
    }
  }, [selectedNode])
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  const [executionState, setExecutionState] = useState<'idle' | 'running' | 'completed' | 'error'>('idle')
  const [executionHistory, setExecutionHistory] = useState<any[]>([])
  const [debugInput, setDebugInput] = useState('')
  const [debugOutput, setDebugOutput] = useState('')
  const [currentExecutingNode, setCurrentExecutingNode] = useState<string | null>(null)

  // Workflow state
  const [workflow, setWorkflow] = useState({
    name: workflowData.name || '新工作流',
    description: workflowData.description || '',
    trigger: workflowData.trigger || 'webhook',
    isActive: workflowData.isActive !== undefined ? workflowData.isActive : true,
    tags: workflowData.tags || [],
    executionMode: workflowData.executionMode || 'sequential',
    timeout: workflowData.timeout || 300,
    retryCount: workflowData.retryCount || 3
  })

  // ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: 'start-1',
      type: 'startNode',
      position: { x: 100, y: 200 },
      data: {
        label: '开始',
        trigger: workflow.trigger,
        executionCount: 0,
        lastExecuted: '从未'
      },
      style: {}
    },
    {
      id: 'llm-1',
      type: 'llmNode',
      position: { x: 350, y: 200 },
      data: {
        label: 'LLM 节点',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 1000,
        prompt: '请根据输入生成回答',
        systemMessage: '你是一个有用的AI助手',
        status: 'ready',
        executionTime: 0,
        tokenUsage: 0,
        cost: 0,
        successRate: 100,
        executionCount: 0,
        lastExecuted: '从未'
      },
      style: {}
    },
    {
      id: 'end-1',
      type: 'endNode',
      position: { x: 600, y: 200 },
      data: {
        label: '结束',
        endType: 'success',
        description: '工作流执行完成',
        totalDuration: 0,
        totalNodes: 3,
        successNodes: 0,
        failedNodes: 0,
        completedAt: '刚刚',
        executionCount: 1
      },
      style: {}
    }
  ])
  
  const [edges, setEdges, onEdgesChange] = useEdgesState([
    {
      id: 'e1',
      source: 'start-1',
      target: 'llm-1',
      type: 'smoothstep',
      style: {
        stroke: '#3b82f6',
        strokeWidth: 3,
        zIndex: 1000
      },
      animated: false,
      zIndex: 1000,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#3b82f6',
      },
    },
    {
      id: 'e2',
      source: 'llm-1',
      target: 'end-1',
      type: 'smoothstep',
      style: {
        stroke: '#3b82f6',
        strokeWidth: 3,
        zIndex: 1000
      },
      animated: false,
      zIndex: 1000,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#3b82f6',
      },
    }
  ])

  const onConnect = useCallback((params: any) => {
    console.log('Connecting nodes:', params)
    const newEdge: Edge = {
      id: `e${Date.now()}`,
      source: params.source,
      target: params.target,
      type: 'smoothstep',
      style: { stroke: '#3b82f6', strokeWidth: 2 },
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#3b82f6',
      },
    }
    setEdges((eds) => [...eds, newEdge])
  }, [])

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('🔍 Node double-click triggered!')
    console.log('📋 Event:', event)
    console.log('🔄 Node data:', node)
    console.log('📍 Current selectedNode state:', selectedNode)
    
    setSelectedNode(node)
    setShowNodePanel(false) // Close the node library panel when a node is clicked
    
    console.log('✅ setSelectedNode called with:', node)
    console.log('✅ setShowNodePanel(false) called')
  }, [selectedNode])



  const handleSave = () => {
    setSnackbar({ open: true, message: '工作流保存成功！', severity: 'success' })
  }

  const handleTestRun = () => {
    setShowDebugPanel(true)
    setExecutionState('idle')
    setExecutionHistory([])
    setDebugOutput('')
  }

  const simulateWorkflowExecution = async () => {
    const startNode = nodes.find(node => node.type === 'startNode')
    if (!startNode) return

    setExecutionState('running')
    setCurrentExecutingNode(startNode.id)
    
    try {
      // Simulate execution through the workflow
      for (const node of nodes) {
        if (node.type === 'endNode') continue
        
        setCurrentExecutingNode(node.id)
        
        // Apply execution style to the current node
        setNodes(prevNodes => prevNodes.map(n => 
          n.id === node.id 
            ? { 
                ...n, 
                style: {
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.8)',
                  border: '3px solid #f59e0b',
                  transform: 'scale(1.05)',
                  transition: 'all 0.3s ease-in-out'
                }
              }
            : { ...n, style: {} }
        ))
        
        // Add execution step to history
        const executionStep = {
          id: Date.now() + Math.random(),
          nodeId: node.id,
          nodeName: node.data.label,
          nodeType: node.type,
          timestamp: new Date().toLocaleTimeString(),
          status: 'executing',
          input: debugInput || '默认输入',
          output: `节点 ${node.data.label} 执行中...`,
          duration: Math.random() * 2000 + 500
        }
        
        setExecutionHistory(prev => [...prev, executionStep])
        
        // Simulate execution time
        await new Promise(resolve => setTimeout(resolve, executionStep.duration))
        
        // Update execution step with completion
        setExecutionHistory(prev => prev.map(step => 
          step.id === executionStep.id 
            ? { ...step, status: 'completed', output: `节点 ${node.data.label} 执行完成` }
            : step
        ))
      }
      
      setExecutionState('completed')
      setDebugOutput('工作流执行完成！所有节点已成功处理。')
    } catch (error) {
      setExecutionState('error')
      setDebugOutput('工作流执行出错：' + error.message)
    } finally {
      // Clear all execution styles
      setNodes(prevNodes => prevNodes.map(n => ({ ...n, style: {} })))
      setCurrentExecutingNode(null)
    }
  }

  const stopExecution = () => {
    setExecutionState('idle')
    setCurrentExecutingNode(null)
    // Clear all execution styles
    setNodes(prevNodes => prevNodes.map(n => ({ ...n, style: {} })))
    setSnackbar({ open: true, message: '工作流执行已停止', severity: 'info' })
  }

  const clearDebugHistory = () => {
    setExecutionHistory([])
    setDebugOutput('')
    setExecutionState('idle')
    // Clear all execution styles
    setNodes(prevNodes => prevNodes.map(n => ({ ...n, style: {} })))
  }

  const addNode = (type: string, position: { x: number; y: number }) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      position,
      data: {
        label: type === 'startNode' ? '开始' :
               type === 'llmNode' ? 'LLM 节点' :
               type === 'endNode' ? '结束' :
               type === 'actionNode' ? '动作节点' :
               type === 'conditionNode' ? '条件节点' :
               type === 'loopNode' ? '循环节点' :
               type === 'knowledgeRetrievalNode' ? '知识检索节点' :
               type === 'questionClassifierNode' ? '问题分类节点' :
               type === 'answerNode' ? '答案生成节点' :
               type === 'variableAggregatorNode' ? '变量聚合节点' : '新节点',
        trigger: 'manual',
        executionCount: 0,
        lastExecuted: '从未'
      }
    }
    setNodes((nds) => [...nds, newNode])
  }

  // Close panels when clicking on canvas
  const handleCanvasClick = () => {
    if (showNodePanel) {
      setShowNodePanel(false)
    }
    // Don't clear selectedNode here to allow configuration panel to stay open
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
    llmNode: CustomLLMNode,
  }

  return (
    <div className="space-y-6">
      {/* Page header - Simplified with floating control panel */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 w-full">
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
              编辑工作流: {workflow.name}
            </h1>
            <p className="text-gray-600 mt-1">
              使用可视化编辑器设计自动化工作流
            </p>
          </div>
        </div>
      </div>

      {/* Main canvas area - Full width */}
      <div className="h-[900px]">
        <Card className="h-[800px] shadow-lg border-0">
          <CardContent className="h-full p-0">
            <div className={`h-full bg-aliceblue transition-all duration-300 ${showNodePanel || selectedNode ? 'backdrop-blur-sm' : ''}`}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDoubleClick={onNodeDoubleClick}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
                className="bg-transparent"
                proOptions={{ hideAttribution: true }}
                onClick={handleCanvasClick}
                defaultEdgeOptions={{
                  type: 'smoothstep',
                  style: { stroke: '#3b82f6', strokeWidth: 2 },
                  animated: false,
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 20,
                    height: 20,
                    color: '#3b82f6',
                  },
                }}
                style={{
                  '--rf-node-selected-box-shadow': '0 0 20px rgba(59, 130, 246, 0.6)',
                  '--rf-node-selected-border-color': '#3b82f6',
                } as any}
                onPaneClick={() => console.log('🔍 Canvas pane clicked')}
                onNodeClick={(event, node) => console.log('🔍 Node single-clicked:', node.id)}
              >

                {/* Light grid background */}
                <Background 
                  variant="dots" 
                  gap={40} 
                  size={1} 
                  color="#e5e7eb"
                  className="opacity-40"
                  style={{ backgroundColor: 'aliceblue' }}
                />
                
                {/* Enhanced controls with Add Node icon button */}
                <Controls 
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg"
                  showZoom={true}
                  showFitView={true}
                  showInteractive={true}
                >
                  {/* Custom Add Node icon button above zoom controls */}
                  <div className="absolute -top-10 left-0 right-0 flex justify-center">
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
                    className="bg-white/75 backdrop-blur-md border border-white/40 rounded-xl shadow-2xl p-3 min-w-[220px] max-w-[260px] animate-in slide-in-from-top duration-300 ease-out"
                    style={{ 
                      top: '0px', 
                      left: '30px', 
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
                          className="w-6 h-6 bg-gray-100/80 hover:bg-gray-200/90 rounded-full flex items-center justify-center transition-all duration-200 border border-gray-200/50"
                          title="关闭"
                        >
                          <X className="w-3 h-3 text-gray-600/80" />
                        </button>
                      </div>
                    </div>

                    {/* Trigger Nodes Category */}
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-green-500/80 rounded-full mr-2"></div>
                        <span className="text-xs font-semibold text-gray-700/90">触发器</span>
                      </div>
                      <div className="space-y-1">
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          startIcon={<Play className="w-3 h-3" />}
                          onClick={() => addNode('startNode', { x: 100, y: 100 })}
                          className="border-green-200/70 text-green-700/90 hover:bg-green-50/80 hover:border-green-300/80 hover:shadow-md transition-all duration-200 text-xs py-1 bg-white/60 hover:bg-white/80"
                        >
                          开始节点
                        </Button>
                      </div>
                    </div>

                    {/* AI Processing Nodes Category */}
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-purple-500/80 rounded-full mr-2"></div>
                        <span className="text-xs font-semibold text-gray-700/90">AI 处理</span>
                      </div>
                      <div className="space-y-1">
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          startIcon={<Search className="w-3 h-3" />}
                          onClick={() => addNode('knowledgeRetrievalNode', { x: 300, y: 150 })}
                          className="border-purple-200/70 text-purple-700/90 hover:bg-purple-50/80 hover:border-purple-300/80 hover:shadow-md transition-all duration-200 text-xs py-1 bg-white/60 hover:bg-white/80"
                        >
                          知识检索
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          startIcon={<Brain className="w-3 h-3" />}
                          onClick={() => addNode('questionClassifierNode', { x: 300, y: 250 })}
                          className="border-indigo-200/70 text-indigo-700/90 hover:bg-indigo-50/80 hover:border-indigo-300/80 hover:shadow-md transition-all duration-200 text-xs py-1 bg-white/60 hover:bg-white/80"
                        >
                          问题分类
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          startIcon={<MessageSquare className="w-3 h-3" />}
                          onClick={() => addNode('answerNode', { x: 500, y: 200 })}
                          className="border-pink-200/70 text-pink-700/90 hover:bg-pink-50/80 hover:border-pink-300/80 hover:shadow-md transition-all duration-200 text-xs py-1 bg-white/60 hover:bg-white/80"
                        >
                          答案生成
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          startIcon={<Bot className="w-3 h-3" />}
                          onClick={() => addNode('llmNode', { x: 400, y: 200 })}
                          className="border-emerald-200/70 text-emerald-700/90 hover:bg-emerald-50/80 hover:border-emerald-300/80 hover:shadow-md transition-all duration-200 text-xs py-1 bg-white/60 hover:bg-white/80"
                        >
                          LLM 节点
                        </Button>
                      </div>
                    </div>

                    {/* Logic Control Nodes Category */}
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-yellow-500/80 rounded-full mr-2"></div>
                        <span className="text-xs font-semibold text-gray-700/90">逻辑控制</span>
                      </div>
                      <div className="space-y-1">
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          startIcon={<Zap className="w-3 h-3" />}
                          onClick={() => addNode('actionNode', { x: 300, y: 200 })}
                          className="border-blue-200/70 text-blue-700/90 hover:bg-blue-50/80 hover:border-blue-300/80 hover:shadow-md transition-all duration-200 text-xs py-1 bg-white/60 hover:bg-white/80"
                        >
                          动作节点
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          startIcon={<Settings className="w-3 h-3" />}
                          onClick={() => addNode('conditionNode', { x: 500, y: 200 })}
                          className="border-yellow-200/70 text-yellow-700/90 hover:bg-yellow-50/80 hover:border-yellow-300/80 hover:shadow-md transition-all duration-200 text-xs py-1 bg-white/60 hover:bg-white/80"
                        >
                          条件节点
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          startIcon={<Repeat className="w-3 h-3" />}
                          onClick={() => addNode('loopNode', { x: 400, y: 300 })}
                          className="border-purple-200/70 text-purple-700/90 hover:bg-purple-50/80 hover:border-purple-300/80 hover:shadow-md transition-all duration-200 text-xs py-1 bg-white/60 hover:bg-white/80"
                        >
                          循环节点
                        </Button>
                      </div>
                    </div>

                    {/* Data Processing Nodes Category */}
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-cyan-500/80 rounded-full mr-2"></div>
                        <span className="text-xs font-semibold text-gray-700/90">数据处理</span>
                      </div>
                      <div className="space-y-1">
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          startIcon={<Database className="w-3 h-3" />}
                          onClick={() => addNode('variableAggregatorNode', { x: 400, y: 400 })}
                          className="border-cyan-200/70 text-cyan-700/90 hover:bg-cyan-50/80 hover:border-cyan-300/80 hover:shadow-md transition-all duration-200 text-xs py-1 bg-white/60 hover:bg-white/80"
                        >
                          变量聚合
                        </Button>
                      </div>
                    </div>

                    {/* Output Nodes Category */}
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-red-500/80 rounded-full mr-2"></div>
                        <span className="text-xs font-semibold text-gray-700/90">输出</span>
                      </div>
                      <div className="space-y-1">
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          startIcon={<CheckCircle className="w-3 h-3" />}
                          onClick={() => addNode('endNode', { x: 700, y: 300 })}
                          className="border-red-200/70 text-red-700/90 hover:bg-red-50/80 hover:border-red-300/80 hover:shadow-md transition-all duration-200 text-xs py-1 bg-white/60 hover:bg-white/80"
                        >
                          结束节点
                        </Button>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-3 border-t border-gray-200/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700/90">快速操作</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<Plus className="w-3 h-3" />}
                          className="text-xs text-blue-600/90 hover:bg-blue-50/70 py-1 hover:text-blue-700"
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
                          className="text-xs text-green-600/90 hover:bg-green-50/70 py-1 hover:text-green-700"
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

                {/* Floating Node Configuration Panel */}
                {selectedNode && (
                  <Panel 
                    position="top-right" 
                    className="bg-white/75 backdrop-blur-md border border-white/40 rounded-xl shadow-2xl p-4 min-w-[280px] max-w-[320px] animate-in slide-in-from-right duration-300 ease-out"
                    style={{ 
                      top: '20px', 
                      right: '20px', 
                      zIndex: 1000
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Typography variant="h6" className="text-gray-800 font-semibold text-sm">
                        节点配置
                      </Typography>
                      <button
                        onClick={() => setSelectedNode(null)}
                        className="w-6 h-6 bg-gray-100/80 hover:bg-gray-200/90 rounded-full flex items-center justify-center transition-all duration-200 border border-gray-200/50"
                        title="关闭"
                      >
                        <X className="w-3 h-3 text-gray-600/80" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Node Type Display */}
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <Typography variant="subtitle2" className="text-blue-800 font-medium mb-1 text-xs">
                          节点类型
                        </Typography>
                        <Typography variant="body2" className="text-blue-700 text-xs">
                          {selectedNode.type === 'startNode' ? '开始节点' :
                           selectedNode.type === 'llmNode' ? 'LLM 节点' :
                           selectedNode.type === 'endNode' ? '结束节点' :
                           selectedNode.type === 'actionNode' ? '动作节点' :
                           selectedNode.type === 'conditionNode' ? '条件节点' :
                           selectedNode.type === 'loopNode' ? '循环节点' :
                           selectedNode.type === 'knowledgeRetrievalNode' ? '知识检索节点' :
                           selectedNode.type === 'questionClassifierNode' ? '问题分类节点' :
                           selectedNode.type === 'answerNode' ? '答案生成节点' :
                           selectedNode.type === 'variableAggregatorNode' ? '变量聚合节点' :
                           '未知节点'}
                        </Typography>
                      </div>

                      {/* Node Label */}
                      <div>
                        <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium text-xs">
                          节点名称
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={selectedNode.data.label || ''}
                          onChange={(e) => {
                            const updatedNode = { ...selectedNode, data: { ...selectedNode.data, label: e.target.value } }
                            setSelectedNode(updatedNode)
                            setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                          }}
                          className="bg-white/80"
                          inputProps={{ style: { fontSize: '12px' } }}
                        />
                      </div>

                      {/* Node-specific Configuration */}
                      {selectedNode.type === 'startNode' && (
                        <div>
                          <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium text-xs">
                            触发器类型
                          </Typography>
                          <FormControl fullWidth size="small">
                            <Select
                              value={selectedNode.data.trigger || 'manual'}
                              onChange={(e: SelectChangeEvent) => {
                                const updatedNode = { ...selectedNode, data: { ...selectedNode.data, trigger: e.target.value } }
                                setSelectedNode(updatedNode)
                                setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                              }}
                              className="bg-white/80"
                              size="small"
                            >
                              <MenuItem value="webhook">Webhook</MenuItem>
                              <MenuItem value="schedule">定时任务</MenuItem>
                              <MenuItem value="manual">手动触发</MenuItem>
                              <MenuItem value="event">事件驱动</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      )}

                      {selectedNode.type === 'llmNode' && (
                        <>
                          <div>
                            <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium text-xs">
                              AI 模型
                            </Typography>
                            <FormControl fullWidth size="small">
                              <Select
                                value={selectedNode.data.model || 'gpt-4'}
                                onChange={(e: SelectChangeEvent) => {
                                  const updatedNode = { ...selectedNode, data: { ...selectedNode.data, model: e.target.value } }
                                  setSelectedNode(updatedNode)
                                  setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                                }}
                                className="bg-white/80"
                                size="small"
                              >
                                <MenuItem value="gpt-4">GPT-4</MenuItem>
                                <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                                <MenuItem value="claude-3">Claude 3</MenuItem>
                                <MenuItem value="gemini-pro">Gemini Pro</MenuItem>
                              </Select>
                            </FormControl>
                          </div>

                          <div>
                            <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium text-xs">
                              温度 (Temperature)
                            </Typography>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              inputProps={{ min: 0, max: 2, step: 0.1, style: { fontSize: '12px' } }}
                              value={selectedNode.data.temperature || 0.7}
                              onChange={(e) => {
                                const updatedNode = { ...selectedNode, data: { ...selectedNode.data, temperature: parseFloat(e.target.value) } }
                                setSelectedNode(updatedNode)
                                setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                              }}
                              className="bg-white/80"
                            />
                          </div>

                          <div>
                            <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium text-xs">
                              最大令牌数
                            </Typography>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              inputProps={{ min: 1, max: 4000, step: 1, style: { fontSize: '12px' } }}
                              value={selectedNode.data.maxTokens || 1000}
                              onChange={(e) => {
                                const updatedNode = { ...selectedNode, data: { ...selectedNode.data, maxTokens: parseInt(e.target.value) } }
                                setSelectedNode(updatedNode)
                                setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                              }}
                              className="bg-white/80"
                            />
                          </div>

                          <div>
                            <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium text-xs">
                              系统提示词
                            </Typography>
                            <TextField
                              fullWidth
                              size="small"
                              multiline
                              rows={2}
                              value={selectedNode.data.systemMessage || ''}
                              onChange={(e) => {
                                const updatedNode = { ...selectedNode, data: { ...selectedNode.data, systemMessage: e.target.value } }
                                setSelectedNode(updatedNode)
                                setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                              }}
                              className="bg-white/80"
                              inputProps={{ style: { fontSize: '12px' } }}
                            />
                          </div>

                          <div>
                            <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium text-xs">
                              用户提示词
                            </Typography>
                            <TextField
                              fullWidth
                              size="small"
                              multiline
                              rows={2}
                              value={selectedNode.data.prompt || ''}
                              onChange={(e) => {
                                const updatedNode = { ...selectedNode, data: { ...selectedNode.data, prompt: e.target.value } }
                                setSelectedNode(updatedNode)
                                setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                              }}
                              className="bg-white/80"
                              inputProps={{ style: { fontSize: '12px' } }}
                            />
                          </div>
                        </>
                      )}

                      {selectedNode.type === 'endNode' && (
                        <div>
                          <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium text-xs">
                            结束类型
                          </Typography>
                          <FormControl fullWidth size="small">
                            <Select
                              value={selectedNode.data.endType || 'success'}
                              onChange={(e: SelectChangeEvent) => {
                                const updatedNode = { ...selectedNode, data: { ...selectedNode.data, endType: e.target.value as 'success' | 'error' | 'warning' | 'timeout' } }
                                setSelectedNode(updatedNode)
                                setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                              }}
                              className="bg-white/80"
                              size="small"
                            >
                              <MenuItem value="success">成功完成</MenuItem>
                              <MenuItem value="error">执行失败</MenuItem>
                              <MenuItem value="warning">警告完成</MenuItem>
                              <MenuItem value="timeout">超时结束</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      )}

                      {/* Save Button */}
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        onClick={() => {
                          setSnackbar({ open: true, message: '节点配置已保存', severity: 'success' })
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-xs py-2"
                      >
                        保存配置
                      </Button>
                    </div>
                  </Panel>
                )}

                {/* Debug Panel - Right Side */}
                {showDebugPanel && (
                  <Panel 
                    position="top-right" 
                    className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-2xl p-4 min-w-[320px] max-w-[400px] animate-in slide-in-from-right duration-300 ease-out"
                    style={{ 
                      top: '80px', 
                      right: '20px', 
                      zIndex: 1000
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Typography variant="h6" className="text-gray-800 font-semibold text-sm flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          executionState === 'running' ? 'bg-orange-500 animate-pulse' :
                          executionState === 'completed' ? 'bg-green-500' :
                          executionState === 'error' ? 'bg-red-500' : 'bg-gray-400'
                        }`} />
                        调试控制台
                      </Typography>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={clearDebugHistory}
                          className="w-6 h-6 bg-gray-100/80 hover:bg-gray-200/90 rounded-full flex items-center justify-center transition-all duration-200 border border-gray-200/50"
                          title="清除历史"
                        >
                          <X className="w-3 h-3 text-gray-600/80" />
                        </button>
                        <button
                          onClick={() => setShowDebugPanel(false)}
                          className="w-6 h-6 bg-gray-100/80 hover:bg-gray-200/90 rounded-full flex items-center justify-center transition-all duration-200 border border-gray-200/50"
                          title="关闭"
                        >
                          <X className="w-3 h-3 text-gray-600/80" />
                        </button>
                      </div>
                    </div>

                    {/* Execution Status */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-700">执行状态</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          executionState === 'running' ? 'bg-orange-100 text-orange-700' :
                          executionState === 'completed' ? 'bg-green-100 text-green-700' :
                          executionState === 'error' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {executionState === 'running' ? '执行中' :
                           executionState === 'completed' ? '已完成' :
                           executionState === 'error' ? '执行错误' : '空闲'}
                        </span>
                      </div>
                      {executionState === 'running' && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                          <span className="text-xs text-gray-600">
                            {currentExecutingNode ? `正在执行: ${nodes.find(n => n.id === currentExecutingNode)?.data.label}` : '准备中...'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Input Section */}
                    <div className="mb-4">
                      <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium text-xs">
                        输入参数
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={3}
                        placeholder="输入测试数据或参数..."
                        value={debugInput}
                        onChange={(e) => setDebugInput(e.target.value)}
                        className="bg-white/80"
                        inputProps={{ style: { fontSize: '12px' } }}
                      />
                    </div>

                    {/* Execution History Tree */}
                    <div className="mb-4">
                      <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium text-xs">
                        执行历史
                      </Typography>
                      <div className="max-h-32 overflow-y-auto bg-gray-50 rounded-lg border border-gray-200 p-2">
                        {executionHistory.length === 0 ? (
                          <div className="text-xs text-gray-500 text-center py-4">
                            暂无执行记录
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {executionHistory.map((step, index) => (
                              <div key={step.id} className="flex items-start space-x-2 p-2 bg-white rounded border border-gray-200">
                                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                                  step.status === 'executing' ? 'bg-orange-500 animate-pulse' :
                                  step.status === 'completed' ? 'bg-green-500' : 'bg-gray-400'
                                }`} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium text-gray-700">{step.nodeName}</span>
                                    <span className="text-xs text-gray-500">{step.timestamp}</span>
                                  </div>
                                  <div className="text-xs text-gray-600 mb-1">{step.output}</div>
                                  <div className="text-xs text-gray-500">
                                    类型: {step.nodeType === 'startNode' ? '开始节点' :
                                           step.nodeType === 'llmNode' ? 'LLM节点' :
                                           step.nodeType === 'endNode' ? '结束节点' : step.nodeType}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Output Section */}
                    <div className="mb-4">
                      <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium text-xs">
                        执行结果
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={3}
                        placeholder="执行结果将在这里显示..."
                        value={debugOutput}
                        onChange={(e) => setDebugOutput(e.target.value)}
                        className="bg-white/80"
                        inputProps={{ style: { fontSize: '12px' } }}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </div>

                    {/* Control Buttons */}
                    <div className="flex space-x-2">
                      {executionState === 'running' ? (
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          onClick={stopExecution}
                          className="border-red-200 text-red-700 hover:bg-red-50"
                        >
                          停止执行
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="contained"
                          size="small"
                          onClick={handleTestRun}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          开始执行
                        </Button>
                      )}
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
                      case 'llmNode': return '#10b981'
                      case 'endNode': return '#ef4444'
                      default: return '#6b7280'
                    }
                  }}
                  nodeStrokeWidth={3}
                  zoomable
                  pannable
                />
                
                {/* Enhanced panel for workflow info */}
                <Panel position="top-left" className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>节点: {nodes.length}</span>
                    <span>•</span>
                    <span>连接: {edges.length}</span>
                  </div>
                </Panel>

                {/* Floating Control Panel - Upper Right */}
                <Panel position="top-right" className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-2">
                  <div className="flex items-center space-x-2">
                    {/* Import Button */}
                    <button
                      component="label"
                      onClick={() => document.getElementById('import-file')?.click()}
                      className="w-10 h-10 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:shadow-md group"
                      title="导入工作流"
                    >
                      <input
                        id="import-file"
                        type="file"
                        hidden
                        accept=".json"
                        onChange={handleImport}
                      />
                      <Upload className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                    </button>

                    {/* Export Button */}
                    <button
                      onClick={handleExport}
                      className="w-10 h-10 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:shadow-md group"
                      title="导出工作流"
                    >
                      <Download className="w-5 h-5 text-green-600 group-hover:text-green-700" />
                    </button>

                    {/* Test Run Button */}
                    <button
                      onClick={handleTestRun}
                      className={`w-10 h-10 border rounded-lg flex items-center justify-center transition-all duration-200 hover:shadow-md group ${
                        executionState === 'running' 
                          ? 'bg-red-50 hover:bg-red-100 border-red-300' 
                          : 'bg-orange-50 hover:bg-orange-100 border-orange-200'
                      }`}
                      title={executionState === 'running' ? '停止执行' : '测试运行'}
                    >
                      {executionState === 'running' ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Play className="w-5 h-5 text-orange-600 group-hover:text-orange-700" />
                      )}
                    </button>

                    {/* Save Button */}
                    <button
                      onClick={handleSave}
                      className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 border border-blue-300 rounded-lg flex items-center justify-center transition-all duration-200 hover:shadow-lg group shadow-md"
                      title="保存工作流"
                    >
                      <Save className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </Panel>
              </ReactFlow>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Node Configuration Dialog */}
      {console.log('🔍 Rendering modal dialog check - selectedNode:', selectedNode)}
      {selectedNode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {console.log('🎯 Modal dialog is rendering!')}
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Typography variant="h5" className="text-gray-800 font-semibold">
                配置节点: {selectedNode.data.label || '未命名节点'}
              </Typography>
              <button
                onClick={() => setSelectedNode(null)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200"
                title="关闭"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            {/* Dialog Content */}
            <div className="p-6 space-y-6">
              {/* Node Type Display */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <Typography variant="subtitle1" className="text-blue-800 font-medium mb-2">
                  节点类型
                </Typography>
                <Typography variant="body1" className="text-blue-700">
                  {selectedNode.type === 'startNode' ? '开始节点' :
                   selectedNode.type === 'llmNode' ? 'LLM 节点' :
                   selectedNode.type === 'endNode' ? '结束节点' :
                   selectedNode.type === 'actionNode' ? '动作节点' :
                   selectedNode.type === 'conditionNode' ? '条件节点' :
                   selectedNode.type === 'loopNode' ? '循环节点' :
                   selectedNode.type === 'knowledgeRetrievalNode' ? '知识检索节点' :
                   selectedNode.type === 'questionClassifierNode' ? '问题分类节点' :
                   selectedNode.type === 'answerNode' ? '答案生成节点' :
                   selectedNode.type === 'variableAggregatorNode' ? '变量聚合节点' :
                   '未知节点'}
                </Typography>
              </div>

              {/* Node Label */}
              <div>
                <Typography variant="subtitle1" className="text-gray-700 mb-3 font-medium">
                  节点名称
                </Typography>
                <TextField
                  fullWidth
                  value={selectedNode.data.label || ''}
                  onChange={(e) => {
                    const updatedNode = { ...selectedNode, data: { ...selectedNode.data, label: e.target.value } }
                    setSelectedNode(updatedNode)
                    setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                  }}
                  placeholder="输入节点名称..."
                  className="bg-gray-50"
                />
              </div>

              {/* Node-specific Configuration */}
              {selectedNode.type === 'startNode' && (
                <div>
                  <Typography variant="subtitle1" className="text-gray-700 mb-3 font-medium">
                    触发器类型
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={selectedNode.data.trigger || 'manual'}
                      onChange={(e: SelectChangeEvent) => {
                        const updatedNode = { ...selectedNode, data: { ...selectedNode.data, trigger: e.target.value } }
                        setSelectedNode(updatedNode)
                        setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                      }}
                    >
                      <MenuItem value="webhook">Webhook</MenuItem>
                      <MenuItem value="schedule">定时任务</MenuItem>
                      <MenuItem value="manual">手动触发</MenuItem>
                      <MenuItem value="event">事件驱动</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              )}

              {selectedNode.type === 'llmNode' && (
                <>
                  <div>
                    <Typography variant="subtitle1" className="text-gray-700 mb-3 font-medium">
                      AI 模型
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={selectedNode.data.model || 'gpt-4'}
                        onChange={(e: SelectChangeEvent) => {
                          const updatedNode = { ...selectedNode, data: { ...selectedNode.data, model: e.target.value } }
                          setSelectedNode(updatedNode)
                          setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                        }}
                      >
                        <MenuItem value="gpt-4">GPT-4</MenuItem>
                        <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                        <MenuItem value="claude-3">Claude 3</MenuItem>
                        <MenuItem value="gemini-pro">Gemini Pro</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  <div>
                    <Typography variant="subtitle1" className="text-gray-700 mb-3 font-medium">
                      温度 (Temperature)
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      inputProps={{ min: 0, max: 2, step: 0.1 }}
                      value={selectedNode.data.temperature || 0.7}
                      onChange={(e) => {
                        const updatedNode = { ...selectedNode, data: { ...selectedNode.data, temperature: parseFloat(e.target.value) } }
                        setSelectedNode(updatedNode)
                        setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                      }}
                      className="bg-gray-50"
                    />
                  </div>

                  <div>
                    <Typography variant="subtitle1" className="text-gray-700 mb-3 font-medium">
                      最大令牌数
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      inputProps={{ min: 1, max: 4000, step: 1 }}
                      value={selectedNode.data.maxTokens || 1000}
                      onChange={(e) => {
                        const updatedNode = { ...selectedNode, data: { ...selectedNode.data, maxTokens: parseInt(e.target.value) } }
                        setSelectedNode(updatedNode)
                        setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                      }}
                      className="bg-gray-50"
                    />
                  </div>

                  <div>
                    <Typography variant="subtitle1" className="text-gray-700 mb-3 font-medium">
                      系统提示词
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={selectedNode.data.systemMessage || ''}
                      onChange={(e) => {
                        const updatedNode = { ...selectedNode, data: { ...selectedNode.data, systemMessage: e.target.value } }
                        setSelectedNode(updatedNode)
                        setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                      }}
                      placeholder="输入系统提示词..."
                      className="bg-gray-50"
                    />
                  </div>

                  <div>
                    <Typography variant="subtitle1" className="text-gray-700 mb-3 font-medium">
                      用户提示词
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={selectedNode.data.prompt || ''}
                      onChange={(e) => { 
                        const updatedNode = { ...selectedNode, data: { ...selectedNode.data, prompt: e.target.value } }
                        setSelectedNode(updatedNode)
                        setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                      }}
                      placeholder="输入用户提示词..."
                      className="bg-gray-50"
                    />
                  </div>
                </>
              )}

              {selectedNode.type === 'endNode' && (
                <div>
                  <Typography variant="subtitle1" className="text-gray-700 mb-3 font-medium">
                    结束类型
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={selectedNode.data.endType || 'success'}
                      onChange={(e: SelectChangeEvent) => {
                        const updatedNode = { ...selectedNode, data: { ...selectedNode.data, endType: e.target.value as 'success' | 'error' | 'warning' | 'timeout' } }
                        setSelectedNode(updatedNode)
                        setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                      }}
                    >
                      <MenuItem value="success">成功</MenuItem>
                      <MenuItem value="error">错误</MenuItem>
                      <MenuItem value="warning">警告</MenuItem>
                      <MenuItem value="timeout">超时</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              )}

              {/* Action Node Configuration */}
              {selectedNode.type === 'actionNode' && (
                <div>
                  <Typography variant="subtitle1" className="text-gray-700 mb-3 font-medium">
                    动作类型
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={selectedNode.data.actionType || 'api_call'}
                      onChange={(e: SelectChangeEvent) => {
                        const updatedNode = { ...selectedNode, data: { ...selectedNode.data, actionType: e.target.value } }
                        setSelectedNode(updatedNode)
                        setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                      }}
                    >
                      <MenuItem value="api_call">API 调用</MenuItem>
                      <MenuItem value="database">数据库操作</MenuItem>
                      <MenuItem value="llm">AI 模型</MenuItem>
                      <MenuItem value="code">代码执行</MenuItem>
                      <MenuItem value="message">消息处理</MenuItem>
                      <MenuItem value="file">文件操作</MenuItem>
                      <MenuItem value="processing">数据处理</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              )}

              {/* Condition Node Configuration */}
              {selectedNode.type === 'conditionNode' && (
                <div>
                  <Typography variant="subtitle1" className="text-gray-700 mb-3 font-medium">
                    条件类型
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={selectedNode.data.conditionType || 'comparison'}
                      onChange={(e: SelectChangeEvent) => {
                        const updatedNode = { ...selectedNode, data: { ...selectedNode.data, conditionType: e.target.value } }
                        setSelectedNode(updatedNode)
                        setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                      }}
                    >
                      <MenuItem value="comparison">比较条件</MenuItem>
                      <MenuItem value="validation">验证条件</MenuItem>
                      <MenuItem value="time">时间条件</MenuItem>
                      <MenuItem value="custom">自定义条件</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              )}

              {/* Loop Node Configuration */}
              {selectedNode.type === 'loopNode' && (
                <div>
                  <Typography variant="subtitle1" className="text-gray-700 mb-3 font-medium">
                    循环类型
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={selectedNode.data.loopType || 'for'}
                      onChange={(e: SelectChangeEvent) => {
                        const updatedNode = { ...selectedNode, data: { ...selectedNode.data, loopType: e.target.value } }
                        setSelectedNode(updatedNode)
                        setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                      }}
                    >
                      <MenuItem value="for">For 循环</MenuItem>
                      <MenuItem value="while">While 循环</MenuItem>
                      <MenuItem value="foreach">ForEach 循环</MenuItem>
                      <MenuItem value="do_while">Do-While 循环</MenuItem>
                      <MenuItem value="timed">定时循环</MenuItem>
                      <MenuItem value="data_driven">数据驱动循环</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              )}

              {/* Knowledge Retrieval Node Configuration */}
              {selectedNode.type === 'knowledgeRetrievalNode' && (
                <div>
                  <Typography variant="subtitle1" className="text-gray-700 mb-3 font-medium">
                    检索类型
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={selectedNode.data.retrievalType || 'vector_search'}
                      onChange={(e: SelectChangeEvent) => {
                        const updatedNode = { ...selectedNode, data: { ...selectedNode.data, retrievalType: e.target.value } }
                        setSelectedNode(updatedNode)
                        setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                      }}
                    >
                      <MenuItem value="vector_search">向量搜索</MenuItem>
                      <MenuItem value="semantic_search">语义搜索</MenuItem>
                      <MenuItem value="keyword_search">关键词搜索</MenuItem>
                      <MenuItem value="document_search">文档搜索</MenuItem>
                      <MenuItem value="knowledge_graph">知识图谱</MenuItem>
                      <MenuItem value="hybrid_search">混合搜索</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              )}

              {/* Question Classifier Node Configuration */}
              {selectedNode.type === 'questionClassifierNode' && (
                <div>
                  <Typography variant="subtitle1" className="text-gray-700 mb-3 font-medium">
                    分类类型
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={selectedNode.data.classifierType || 'intent_classification'}
                      onChange={(e: SelectChangeEvent) => {
                        const updatedNode = { ...selectedNode, data: { ...selectedNode.data, classifierType: e.target.value } }
                        setSelectedNode(updatedNode)
                        setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                      }}
                    >
                      <MenuItem value="intent_classification">意图分类</MenuItem>
                      <MenuItem value="topic_classification">主题分类</MenuItem>
                      <MenuItem value="sentiment_analysis">情感分析</MenuItem>
                      <MenuItem value="complexity_analysis">复杂度分析</MenuItem>
                      <MenuItem value="multi_label">多标签分类</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              )}

              {/* Answer Node Configuration */}
              {selectedNode.type === 'answerNode' && (
                <div>
                  <Typography variant="subtitle1" className="text-gray-700 mb-3 font-medium">
                    生成类型
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={selectedNode.data.answerType || 'llm_generation'}
                      onChange={(e: SelectChangeEvent) => {
                        const updatedNode = { ...selectedNode, data: { ...selectedNode.data, answerType: e.target.value } }
                        setSelectedNode(updatedNode)
                        setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                      }}
                    >
                      <MenuItem value="llm_generation">LLM 生成</MenuItem>
                      <MenuItem value="template_based">模板生成</MenuItem>
                      <MenuItem value="rule_based">规则生成</MenuItem>
                      <MenuItem value="hybrid">混合生成</MenuItem>
                      <MenuItem value="context_aware">上下文感知</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              )}

              {/* Variable Aggregator Node Configuration */}
              {selectedNode.type === 'variableAggregatorNode' && (
                <div>
                  <Typography variant="subtitle1" className="text-gray-700 mb-3 font-medium">
                    聚合类型
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={selectedNode.data.aggregatorType || 'sum'}
                      onChange={(e: SelectChangeEvent) => {
                        const updatedNode = { ...selectedNode, data: { ...selectedNode.data, aggregatorType: e.target.value } }
                        setSelectedNode(updatedNode)
                        setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                      }}
                    >
                      <MenuItem value="sum">求和聚合</MenuItem>
                      <MenuItem value="average">平均值聚合</MenuItem>
                      <MenuItem value="count">计数聚合</MenuItem>
                      <MenuItem value="min_max">最值聚合</MenuItem>
                      <MenuItem value="custom_function">自定义函数</MenuItem>
                      <MenuItem value="data_transform">数据转换</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <Button
                variant="outlined"
                onClick={() => setSelectedNode(null)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                取消
              </Button>
              <Button
                variant="contained"
                onClick={() => setSelectedNode(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                保存
              </Button>
            </div>
          </div>
        </div>
      )}

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

const WorkflowCanvasPage: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasContent />
    </ReactFlowProvider>
  )
}

export default WorkflowCanvasPage