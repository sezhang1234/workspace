import React, { useState, useCallback, useEffect, useMemo } from 'react'
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
  Bot,
  Undo,
  Redo,
  Maximize2,
  Network,
  ZoomIn,
  ZoomOut,
  Wand2
} from 'lucide-react'
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Background,
  BackgroundVariant,
  MiniMap,
  Panel,
  ReactFlowProvider,
  NodeTypes,
  MarkerType,
  useReactFlow,
  ConnectionLineType
} from 'reactflow'
import 'reactflow/dist/style.css'
import { 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  Typography,
  Card,
  CardContent,
  Alert,
  Snackbar,
  SelectChangeEvent,
  FormControlLabel,
  Switch,
  IconButton,
  Tooltip
} from '@mui/material'

// Custom node types
import CustomStartNode from '../../components/WorkflowNodes/CustomStartNode'
import CustomConditionNode from '../../components/WorkflowNodes/CustomConditionNode'
import CustomEndNode from '../../components/WorkflowNodes/CustomEndNode'
import CustomLoopNode from '../../components/WorkflowNodes/CustomLoopNode'
import CustomKnowledgeRetrievalNode from '../../components/WorkflowNodes/CustomKnowledgeRetrievalNode'
import CustomAnswerNode from '../../components/WorkflowNodes/CustomAnswerNode'
import CustomQuestionClassifierNode from '../../components/WorkflowNodes/CustomQuestionClassifierNode'
import CustomVariableAggregatorNode from '../../components/WorkflowNodes/CustomVariableAggregatorNode'
import CustomLLMNode from '../../components/WorkflowNodes/CustomLLMNode'

// Control Panel Component - will be defined inside ReactFlow
const WorkflowCanvasContent: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const workflowData = location.state?.workflowData || {}
  const { zoomIn, zoomOut, fitView: reactFlowFitView } = useReactFlow()
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
  const [showNodePanel, setShowNodePanel] = useState(false)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  
  // Debug logging for selectedNode changes
  useEffect(() => {
    // selectedNode state changed
  }, [selectedNode])

  // Auto-layout state
  const [hasAutoLayouted, setHasAutoLayouted] = useState(false)
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  const [executionState, setExecutionState] = useState<'idle' | 'running' | 'completed' | 'error'>('idle')
  const [executionHistory, setExecutionHistory] = useState<any[]>([])
  const [debugInput, setDebugInput] = useState('')
  const [_debugOutput, setDebugOutput] = useState('')
  const [currentExecutingNode, setCurrentExecutingNode] = useState<string | null>(null)
  
  // Undo/Redo functionality
  const [history, setHistory] = useState<Array<{ nodes: Node[], edges: Edge[] }>>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

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
        label: '大语言模型节点',
        model: 'deepseek-chat',
        systemPrompt: '你是一个有用的AI助手，请根据用户的问题提供准确、有帮助的回答。',
        userPrompt: '请根据输入生成回答',
        outputVariable: 'llm_output',
        temperature: 0.7,
        maxTokens: 1000,
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
        strokeWidth: 2,
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
        strokeWidth: 2,
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

  const onNodeDoubleClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    setShowNodePanel(false) // Close the node library panel when a node is clicked
  }, [])

  // Initialize history with initial state
  useEffect(() => {
    const initialState = { nodes, edges }
    setHistory([initialState])
    setHistoryIndex(0)
  }, [])

  // Save to history when nodes or edges change
  useEffect(() => {
    if (history.length > 0 && historyIndex >= 0) {
      saveToHistory()
    }
  }, [nodes, edges])

  const handleSave = () => {
    setSnackbar({ open: true, message: '工作流保存成功！', severity: 'success' })
  }

  const handleTestRun = () => {
    setShowDebugPanel(true)
    setExecutionState('idle')
    setExecutionHistory([])
    setDebugOutput('')
  }

  const stopExecution = () => {
    setExecutionState('idle')
    setCurrentExecutingNode(null)
    // Clear all execution styles
    setNodes(prevNodes => prevNodes.map(n => ({ ...n, style: {} })))
    setSnackbar({ open: true, message: '工作流执行已停止', severity: 'success' })
  }

  const clearDebugHistory = () => {
    setExecutionHistory([])
    setDebugOutput('')
    setExecutionState('idle')
    // Clear all execution styles
    setNodes(prevNodes => prevNodes.map(n => ({ ...n, style: {} })))
  }

  // Undo/Redo functions
  const saveToHistory = useCallback(() => {
    const currentState = { nodes, edges }
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(currentState)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [nodes, edges, history, historyIndex])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const previousState = history[newIndex]
      setNodes(previousState.nodes)
      setEdges(previousState.edges)
      setHistoryIndex(newIndex)
    }
  }, [history, historyIndex, setNodes, setEdges])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const nextState = history[newIndex]
      setNodes(nextState.nodes)
      setEdges(nextState.edges)
      setHistoryIndex(newIndex)
    }
  }, [history, historyIndex, setNodes, setEdges])

  const fitView = useCallback(() => {
    reactFlowFitView()
  }, [reactFlowFitView])

  const addNode = (type: string, position: { x: number; y: number }) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      position,
      data: {
        label: type === 'startNode' ? '开始' :
               type === 'llmNode' ? '大语言模型节点' :
               type === 'endNode' ? '结束' :
               type === 'conditionNode' ? '条件节点' :
               type === 'loopNode' ? '循环节点' :
               type === 'knowledgeRetrievalNode' ? '知识检索节点' :
               type === 'questionClassifierNode' ? '问题分类节点' :
               type === 'answerNode' ? '答案生成节点' :
               type === 'variableAggregatorNode' ? '变量聚合节点' : '新节点',
        // LLM node specific fields
        ...(type === 'llmNode' && {
          model: 'deepseek-chat',
          systemPrompt: '你是一个有用的AI助手，请根据用户的问题提供准确、有帮助的回答。',
          userPrompt: '请根据输入生成回答',
          outputVariable: 'llm_output',
          temperature: 0.7,
          maxTokens: 1000,
          status: 'ready',
          executionTime: 0,
          tokenUsage: 0,
          cost: 0,
          successRate: 100
        }),
        // Common fields
        trigger: 'manual',
        executionCount: 0,
        lastExecuted: '从未'
      }
    }
    setNodes((nds) => [...nds, newNode])
    
    // Trigger auto layout after adding a new node
    setTimeout(() => {
      setHasAutoLayouted(false)
    }, 100)
  }

  // Generate system prompt based on model and context
  const generateSystemPrompt = useCallback((model: string, context?: string) => {
    const modelInfo = {
      'deepseek-chat': 'DeepSeek Chat是一个强大的AI模型，擅长通用对话和推理任务',
      'deepseek-coder': 'DeepSeek Coder是专门为编程任务优化的AI模型，擅长代码生成和调试',
      'deepseek-math': 'DeepSeek Math是专门为数学任务优化的AI模型，擅长数学推理和计算',
      'qwen-plus': 'Qwen Plus是阿里巴巴的AI模型，擅长中文理解和生成',
      'qwen-turbo': 'Qwen Turbo是Qwen的快速版本，适合实时对话',
      'qwen-max': 'Qwen Max是Qwen系列最强大的模型，具有卓越的推理和生成能力',
      'qwen-max-longcontext': 'Qwen Max LongContext是支持超长上下文的版本，适合处理长文档'
    }

    const basePrompt = `你是一个专业的AI助手，基于${modelInfo[model as keyof typeof modelInfo] || model}模型。你的任务是：\n\n1. 理解用户的需求和问题\n2. 提供准确、有用、详细的回答\n3. 保持专业、友好的语调\n4. 在不确定时主动询问澄清\n5. 提供可操作的解决方案和建议\n\n请始终以用户的最佳利益为重，确保回答的质量和实用性。`

    if (context) {
      return `${basePrompt}\n\n特殊要求：${context}`
    }

    return basePrompt
  }, [])

  // Close panels when clicking on canvas
  const handleCanvasClick = () => {
    if (showNodePanel) {
      setShowNodePanel(false)
    }
  }
  
  // Handle node click to prevent canvas click interference
  const handleNodeClick = (event: React.MouseEvent, _node: Node) => {
    // Prevent event bubbling to canvas
    event.stopPropagation()
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

  // Hierarchical layout function for straighter connections
  const performHierarchicalLayout = useCallback((nodes: Node[], edges: Edge[]) => {
    if (nodes.length === 0) return nodes

    // Create adjacency lists and find root nodes
    const adjacencyList = new Map<string, string[]>()
    const inDegree = new Map<string, number>()
    const nodeLevels = new Map<string, number>()
    
    // Initialize
    nodes.forEach(node => {
      adjacencyList.set(node.id, [])
      inDegree.set(node.id, 0)
      nodeLevels.set(node.id, 0)
    })
    
    // Build adjacency list and calculate in-degrees
    edges.forEach(edge => {
      const source = edge.source
      const target = edge.target
      if (adjacencyList.has(source) && adjacencyList.has(target)) {
        adjacencyList.get(source)!.push(target)
        inDegree.set(target, (inDegree.get(target) || 0) + 1)
      }
    })
    
    // Find root nodes (nodes with no incoming edges)
    const rootNodes = nodes.filter(node => (inDegree.get(node.id) || 0) === 0)
    
    // If no root nodes found, use the first node as root
    if (rootNodes.length === 0) {
      rootNodes.push(nodes[0])
    }
    
    // Calculate levels using BFS for better hierarchy
    const queue = [...rootNodes.map(n => ({ id: n.id, level: 0 }))]
    const visited = new Set<string>()
    
    while (queue.length > 0) {
      const { id, level } = queue.shift()!
      if (visited.has(id)) continue
      
      visited.add(id)
      nodeLevels.set(id, level)
      
      const neighbors = adjacencyList.get(id) || []
      neighbors.forEach(neighbor => {
        if (!visited.has(neighbor)) {
          queue.push({ id: neighbor, level: level + 1 })
        }
      })
    }
    
    // Group nodes by level
    const levelGroups = new Map<number, string[]>()
    nodes.forEach(node => {
      const level = nodeLevels.get(node.id) || 0
      if (!levelGroups.has(level)) {
        levelGroups.set(level, [])
      }
      levelGroups.get(level)!.push(node.id)
    })
    
    // Calculate positions for horizontal and straight connections
    const nodePositions = new Map<string, { x: number; y: number }>()
    const levelWidth = 350
    const levelHeight = 150
    const maxNodesPerLevel = Math.max(...Array.from(levelGroups.values()).map(group => group.length))
    
    // First pass: calculate basic positions
    levelGroups.forEach((nodeIds, level) => {
      const nodesInLevel = nodeIds.length
      const startY = (maxNodesPerLevel - nodesInLevel) * levelHeight / 2
      
      // Sort nodes within each level to minimize edge crossings
      const sortedNodeIds = [...nodeIds].sort((a, b) => {
        const aConnections = adjacencyList.get(a) || []
        const bConnections = adjacencyList.get(b) || []
        return aConnections.length - bConnections.length
      })
      
      sortedNodeIds.forEach((nodeId, index) => {
        const x = level * levelWidth + 150
        const y = startY + index * levelHeight + 100
        
        nodePositions.set(nodeId, { x, y })
      })
    })
    
    // Second pass: optimize positions for horizontal connections
    levelGroups.forEach((nodeIds, level) => {
      if (level === 0) return // Skip root level
      
      nodeIds.forEach(nodeId => {
        const incomingEdges = edges.filter(edge => edge.target === nodeId)
        if (incomingEdges.length > 0) {
          // Find the source node with the most connections to this node
          const sourceNode = incomingEdges[0].source
          const sourcePosition = nodePositions.get(sourceNode)
          const currentPosition = nodePositions.get(nodeId)
          
          if (sourcePosition && currentPosition) {
            // Align Y position with source node for horizontal connection
            const newY = sourcePosition.y
            nodePositions.set(nodeId, { ...currentPosition, y: newY })
          }
        }
      })
    })
    
    // Third pass: adjust positions to prevent overlapping
    levelGroups.forEach((nodeIds, level) => {
      if (level === 0) return // Skip root level
      
      const sortedNodes = [...nodeIds].sort((a, b) => {
        const posA = nodePositions.get(a)!
        const posB = nodePositions.get(b)!
        return posA.y - posB.y
      })
      
      // Ensure minimum vertical spacing between nodes
      const minSpacing = 120
      for (let i = 1; i < sortedNodes.length; i++) {
        const prevNode = sortedNodes[i - 1]
        const currentNode = sortedNodes[i]
        const prevPos = nodePositions.get(prevNode)!
        const currentPos = nodePositions.get(currentNode)!
        
        if (currentPos.y - prevPos.y < minSpacing) {
          const newY = prevPos.y + minSpacing
          nodePositions.set(currentNode, { ...currentPos, y: newY })
        }
      }
    })
    
    // Update node positions
    return nodes.map(node => {
      const position = nodePositions.get(node.id)
      if (position) {
        return { ...node, position }
      }
      return node
    })
  }, [])

  // Optimize edges for horizontal and straight connections
  const optimizeEdgesForStraightConnections = useCallback((nodes: Node[], edges: Edge[]) => {
    return edges.map(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source)
      const targetNode = nodes.find(n => n.id === edge.target)
      
      if (sourceNode && targetNode) {
        // Calculate if connection should be horizontal
        const isHorizontal = Math.abs(sourceNode.position.y - targetNode.position.y) < 50
        
        // Use smoothstep edges for better horizontal routing
        const edgeType = isHorizontal ? 'smoothstep' : 'straight'
        
        return {
          ...edge,
          type: edgeType,
          style: {
            ...edge.style,
            stroke: '#3b82f6',
            strokeWidth: 2,
          },
          // Add routing hints for horizontal connections
          data: {
            ...edge.data,
            routing: 'horizontal',
            isHorizontal: isHorizontal
          },
          // Ensure edges are as straight as possible
          sourceHandle: edge.sourceHandle || null,
          targetHandle: edge.targetHandle || null
        }
      }
      
      return {
        ...edge,
        type: 'straight',
        style: {
          ...edge.style,
          stroke: '#3b82f6',
          strokeWidth: 2,
        },
        data: {
          ...edge.data,
          routing: 'straight'
        }
      }
    })
  }, [])

  // Node types for ReactFlow - memoized to prevent recreation on every render
  const nodeTypes = useMemo<NodeTypes>(() => ({
    startNode: CustomStartNode,
    conditionNode: CustomConditionNode,
    endNode: CustomEndNode,
    loopNode: CustomLoopNode,
    knowledgeRetrievalNode: CustomKnowledgeRetrievalNode,
    answerNode: CustomAnswerNode,
    questionClassifierNode: CustomQuestionClassifierNode,
    variableAggregatorNode: CustomVariableAggregatorNode,
    llmNode: CustomLLMNode,
  }), [])

  // Auto-layout on initial load and zoom out for better overview
  useEffect(() => {
    if (nodes.length > 0 && !hasAutoLayouted) {
      const timer = setTimeout(() => {
        // Apply auto layout
        const updatedNodes = performHierarchicalLayout(nodes, edges)
        setNodes(updatedNodes)
        
        // Optimize edges for straighter connections
        const updatedEdges = optimizeEdgesForStraightConnections(updatedNodes, edges)
        setEdges(updatedEdges)
        
        // Zoom out for better overview after a short delay
        setTimeout(() => {
          reactFlowFitView({ padding: 0.3, duration: 500 })
        }, 200)
        
        setHasAutoLayouted(true)
      }, 300) // Allow time for ReactFlow to fully initialize

      return () => clearTimeout(timer)
    }
  }, [nodes.length, edges.length, hasAutoLayouted, performHierarchicalLayout, optimizeEdgesForStraightConnections, setNodes, setEdges, reactFlowFitView])

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
                onNodeClick={handleNodeClick}
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
                connectionLineType={ConnectionLineType.SmoothStep}
                style={{
                  '--rf-node-selected-box-shadow': '0 0 20px rgba(59, 130, 246, 0.6)',
                  '--rf-node-focus-ring': 'none',
                } as any}
                onPaneClick={() => {}}
              >

                {/* Dotted grid background with aliceblue color */}
                <Background 
                  variant={BackgroundVariant.Dots} 
                  gap={30} 
                  size={1.5} 
                  color="#87CEEB"
                  className="opacity-60"
                  style={{ backgroundColor: 'aliceblue' }}
                />
                
                {/* Unified Control Panel with all icons */}
                <Panel position="bottom-left" className="bg-transparent">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3 flex items-center space-x-3">
                    {/* Add Node Button */}
                    <Tooltip title={showNodePanel ? '隐藏节点库' : '添加节点'}>
                      <IconButton 
                        size="small" 
                        onClick={() => setShowNodePanel(!showNodePanel)}
                        className="hover:bg-blue-50 border border-gray-200"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </IconButton>
                    </Tooltip>
                    
                    {/* Divider */}
                    <div className="w-px h-6 bg-gray-300"></div>
                    
                    {/* Undo/Redo */}
                    <Tooltip title="撤销">
                      <IconButton 
                        size="small" 
                        onClick={undo} 
                        disabled={historyIndex <= 0}
                        className={`hover:bg-blue-50 ${historyIndex <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Undo className="w-4 h-4 text-gray-600" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="重做">
                      <IconButton 
                        size="small" 
                        onClick={redo} 
                        disabled={historyIndex >= history.length - 1}
                        className={`hover:bg-blue-50 ${historyIndex >= history.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Redo className="w-4 h-4 text-gray-600" />
                      </IconButton>
                    </Tooltip>
                    
                    {/* Divider */}
                    <div className="w-px h-6 bg-gray-300"></div>
                    
                    {/* Zoom Controls */}
                    <Tooltip title="放大">
                      <IconButton size="small" onClick={() => zoomIn()} className="hover:bg-blue-50">
                        <ZoomIn className="w-4 h-4 text-gray-600" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="缩小">
                      <IconButton size="small" onClick={() => zoomOut()} className="hover:bg-blue-50">
                        <ZoomOut className="w-4 h-4 text-gray-600" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="适应视图">
                      <IconButton size="small" onClick={fitView} className="hover:bg-blue-50">
                        <Maximize2 className="w-4 h-4 text-gray-600" />
                      </IconButton>
                    </Tooltip>
                    
                    {/* Divider */}
                    <div className="w-px h-6 bg-gray-300"></div>
                    
                    {/* Auto Layout */}
                    <Tooltip title="自动布局">
                      <IconButton size="small" onClick={() => {
                        // Improved hierarchical auto-layout for straighter connections
                        const updatedNodes = performHierarchicalLayout(nodes, edges)
                        setNodes(updatedNodes)
                        
                        // Also optimize edges for straighter connections
                        const updatedEdges = optimizeEdgesForStraightConnections(updatedNodes, edges)
                        setEdges(updatedEdges)
                        
                        saveToHistory() // Save to history after auto-layout
                      }} className="hover:bg-blue-50">
                        <Network className="w-4 h-4 text-gray-600" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </Panel>
                
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

                    {/* 触发器节点分类 */}
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

                    {/* AI 处理节点分类 */}
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
                          大语言模型节点
                        </Button>
                      </div>
                    </div>

                    {/* 逻辑控制节点分类 */}
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

                    {/* 数据处理节点分类 */}
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

                    {/* 输出节点分类 */}
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

                    {/* 快速操作 */}
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

                {/* 浮动节点配置面板 */}
                {selectedNode && (
                  <Panel 
                    position="top-right" 
                    className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-2xl p-4 min-w-[380px] max-w-[480px] max-h-[80vh] overflow-y-auto animate-in slide-in-from-right duration-300 ease-out"
                    style={{ 
                      top: '20px', 
                      right: '20px', 
                      zIndex: 1000
                    }}
                  >
                    {/* 面板头部 */}
                    <div className="flex items-center justify-between mb-4">
                      <Typography variant="h6" className="text-gray-800 font-semibold flex items-center">
                        <Settings className="w-5 h-5 mr-2 text-blue-600" />
                        配置节点: {selectedNode.data.label || '未命名节点'}
                      </Typography>
                      <button
                        onClick={() => setSelectedNode(null)}
                        className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200"
                        title="关闭"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    
                    {/* 面板内容 */}
                    <div className="space-y-4">
                      {/* 节点类型显示 */}
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <Typography variant="subtitle2" className="text-blue-800 font-medium mb-1">
                          节点类型
                        </Typography>
                        <Typography variant="body2" className="text-blue-700">
                          {selectedNode.type === 'startNode' ? '开始节点' :
                           selectedNode.type === 'llmNode' ? '大语言模型节点' :
                           selectedNode.type === 'endNode' ? '结束节点' :
                           selectedNode.type === 'conditionNode' ? '条件节点' :
                           selectedNode.type === 'loopNode' ? '循环节点' :
                           selectedNode.type === 'knowledgeRetrievalNode' ? '知识检索节点' :
                           selectedNode.type === 'questionClassifierNode' ? '问题分类节点' :
                           selectedNode.type === 'answerNode' ? '答案生成节点' :
                           selectedNode.type === 'variableAggregatorNode' ? '变量聚合节点' :
                           '未知节点'}
                        </Typography>
                      </div>

                      {/* 节点标签 */}
                      <div>
                        <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium">
                          节点名称
                        </Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={selectedNode.data.label || ''}
                          onChange={(e) => {
                            const updatedNode = { ...selectedNode, data: { ...selectedNode.data, label: e.target.value } }
                            setSelectedNode(updatedNode)
                            setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                          }}
                          placeholder="输入节点名称..."
                          className="bg-gray-50"
                          inputProps={{
                            style: { color: '#6b7280' }
                          }}
                        />
                      </div>

                      {/* 节点特定配置 */}
                      {selectedNode.type === 'startNode' && (
                        <>
                          <div>
                            <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium">
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
                              >
                                <MenuItem value="webhook">Webhook</MenuItem>
                                <MenuItem value="schedule">定时任务</MenuItem>
                                <MenuItem value="manual">手动触发</MenuItem>
                                <MenuItem value="event">事件驱动</MenuItem>
                              </Select>
                            </FormControl>
                          </div>

                          <div>
                            <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium">
                              输入参数
                            </Typography>
                            <div className="space-y-2">
                              {selectedNode.data.inputParameters && selectedNode.data.inputParameters.length > 0 ? (
                                selectedNode.data.inputParameters.map((param: any, index: number) => (
                                  <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
                                    <TextField
                                      size="small"
                                      placeholder="参数名"
                                      value={param.name || ''}
                                      onChange={(e) => {
                                        const updatedParams = [...(selectedNode.data.inputParameters || [])]
                                        updatedParams[index] = { ...updatedParams[index], name: e.target.value }
                                        const updatedNode = { ...selectedNode, data: { ...selectedNode.data, inputParameters: updatedParams } }
                                        setSelectedNode(updatedNode)
                                        setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                                      }}
                                      className="flex-1"
                                      inputProps={{
                                        style: { color: '#6b7280' }
                                      }}
                                    />
                                    <FormControl size="small" sx={{ minWidth: 100 }}>
                                      <Select
                                        value={param.type || 'string'}
                                        onChange={(e: SelectChangeEvent) => {
                                          const updatedParams = [...(selectedNode.data.inputParameters || [])]
                                          updatedParams[index] = { ...updatedParams[index], type: e.target.value }
                                          const updatedNode = { ...selectedNode, data: { ...selectedNode.data, inputParameters: updatedParams } }
                                          setSelectedNode(updatedNode)
                                          setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                                        }}
                                      >
                                        <MenuItem value="string">字符串</MenuItem>
                                        <MenuItem value="number">数字</MenuItem>
                                        <MenuItem value="boolean">布尔值</MenuItem>
                                        <MenuItem value="array">数组</MenuItem>
                                        <MenuItem value="object">对象</MenuItem>
                                      </Select>
                                    </FormControl>
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={param.required || false}
                                          onChange={(e) => {
                                            const updatedParams = [...(selectedNode.data.inputParameters || [])]
                                            updatedParams[index] = { ...updatedParams[index], required: e.target.checked }
                                            const updatedNode = { ...selectedNode, data: { ...selectedNode.data, inputParameters: updatedParams } }
                                            setSelectedNode(updatedNode)
                                            setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                                          }}
                                          size="small"
                                        />
                                      }
                                      label="必填"
                                      className="text-xs"
                                    />
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="error"
                                      onClick={() => {
                                        const updatedParams = selectedNode.data.inputParameters.filter((_: any, i: number) => i !== index)
                                        const updatedNode = { ...selectedNode, data: { ...selectedNode.data, inputParameters: updatedParams } }
                                        setSelectedNode(updatedNode)
                                        setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                                      }}
                                      className="min-w-0 px-2"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ))
                              ) : (
                                <div className="text-sm text-gray-500 text-center py-2">
                                  暂无输入参数
                                </div>
                              )}
                              <Button
                                size="small"
                                variant="outlined"
                                fullWidth
                                onClick={() => {
                                  const newParam = { name: '', type: 'string', required: false }
                                  const updatedParams = [...(selectedNode.data.inputParameters || []), newParam]
                                  const updatedNode = { ...selectedNode, data: { ...selectedNode.data, inputParameters: updatedParams } }
                                  setSelectedNode(updatedNode)
                                  setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                                }}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                添加参数
                              </Button>
                            </div>
                          </div>
                        </>
                      )}

                      {selectedNode.type === 'llmNode' && (
                        <>
                          <div>
                            <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium">
                              AI 模型
                            </Typography>
                            <FormControl fullWidth size="small">
                              <Select
                                value={selectedNode.data.model || 'deepseek-chat'}
                                onChange={(e: SelectChangeEvent) => {
                                  const updatedNode = { ...selectedNode, data: { ...selectedNode.data, model: e.target.value } }
                                  setSelectedNode(updatedNode)
                                  setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                                }}
                              >
                                <MenuItem value="deepseek-chat">DeepSeek Chat</MenuItem>
                                <MenuItem value="deepseek-coder">DeepSeek Coder</MenuItem>
                                <MenuItem value="deepseek-math">DeepSeek Math</MenuItem>
                                <MenuItem value="qwen-plus">Qwen Plus</MenuItem>
                                <MenuItem value="qwen-turbo">Qwen Turbo</MenuItem>
                                <MenuItem value="qwen-max">Qwen Max</MenuItem>
                                <MenuItem value="qwen-max-longcontext">Qwen Max LongContext</MenuItem>
                              </Select>
                            </FormControl>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Typography variant="subtitle2" className="text-gray-700 font-medium">
                                系统提示词 (System Prompt)
                              </Typography>
                              <Tooltip title="自动生成系统提示词">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    const generatedPrompt = generateSystemPrompt(selectedNode.data.model || 'deepseek-chat')
                                    const updatedNode = { ...selectedNode, data: { ...selectedNode.data, systemPrompt: generatedPrompt } }
                                    setSelectedNode(updatedNode)
                                    setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                                  }}
                                  className="w-8 h-8 bg-purple-100 hover:bg-purple-200 text-purple-600 transition-all duration-200"
                                  sx={{
                                    '&:hover': {
                                      transform: 'scale(1.1)',
                                      boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)'
                                    }
                                  }}
                                >
                                  <Wand2 className="w-4 h-4" />
                                </IconButton>
                              </Tooltip>
                            </div>
                            <TextField
                              size="small"
                              fullWidth
                              multiline
                              rows={3}
                              value={selectedNode.data.systemPrompt || ''}
                              onChange={(e) => {
                                const updatedNode = { ...selectedNode, data: { ...selectedNode.data, systemPrompt: e.target.value } }
                                setSelectedNode(updatedNode)
                                setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                              }}
                              placeholder="输入系统提示词，定义AI助手的角色和行为..."
                              className="bg-gray-50"
                              inputProps={{
                                style: { color: '#6b7280' }
                              }}
                            />
                          </div>

                          <div>
                            <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium">
                              用户提示词 (User Prompt)
                            </Typography>
                            <TextField
                              size="small"
                              fullWidth
                              multiline
                              rows={3}
                              value={selectedNode.data.userPrompt || ''}
                              onChange={(e) => {
                                const updatedNode = { ...selectedNode, data: { ...selectedNode.data, userPrompt: e.target.value } }
                                setSelectedNode(updatedNode)
                                setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                              }}
                              placeholder="输入用户提示词，定义具体的任务和要求..."
                              className="bg-gray-50"
                              inputProps={{
                                style: { color: '#6b7280' }
                              }}
                            />
                          </div>

                          <div>
                            <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium">
                              输出变量名
                            </Typography>
                            <TextField
                              size="small"
                              fullWidth
                              value={selectedNode.data.outputVariable || 'llm_output'}
                              onChange={(e) => {
                                const updatedNode = { ...selectedNode, data: { ...selectedNode.data, outputVariable: e.target.value } }
                                setSelectedNode(updatedNode)
                                setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                              }}
                              placeholder="定义输出变量的名称..."
                              className="bg-gray-50"
                              inputProps={{
                                style: { color: '#6b7280' }
                              }}
                            />
                          </div>

                          <div>
                            <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium">
                              温度 (Temperature)
                            </Typography>
                            <TextField
                              size="small"
                              fullWidth
                              type="number"
                              value={selectedNode.data.temperature || 0.7}
                              onChange={(e) => {
                                const updatedNode = { ...selectedNode, data: { ...selectedNode.data, temperature: parseFloat(e.target.value) } }
                                setSelectedNode(updatedNode)
                                setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                              }}
                              inputProps={{ 
                                min: 0, 
                                max: 2, 
                                step: 0.1,
                                style: { color: '#6b7280' }
                              }}
                              className="bg-gray-50"
                            />
                          </div>

                          <div>
                            <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium">
                              最大令牌数
                            </Typography>
                            <TextField
                              size="small"
                              fullWidth
                              type="number"
                              value={selectedNode.data.maxTokens || 1000}
                              onChange={(e) => {
                                const updatedNode = { ...selectedNode, data: { ...selectedNode.data, maxTokens: parseInt(e.target.value) } }
                                setSelectedNode(updatedNode)
                                setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                              }}
                              inputProps={{ 
                                min: 100, 
                                max: 8000, 
                                step: 100,
                                style: { color: '#6b7280' }
                              }}
                              className="bg-gray-50"
                            />
                          </div>
                        </>
                      )}

                      {selectedNode.type === 'endNode' && (
                        <>
                          <div>
                            <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium">
                              输出参数
                            </Typography>
                            <div className="space-y-2">
                              {selectedNode.data.outputParameters && selectedNode.data.outputParameters.length > 0 ? (
                                selectedNode.data.outputParameters.map((param: any, index: number) => (
                                  <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
                                    <TextField
                                      size="small"
                                      placeholder="参数名"
                                      value={param.name || ''}
                                      onChange={(e) => {
                                        const updatedParams = [...(selectedNode.data.outputParameters || [])]
                                        updatedParams[index] = { ...updatedParams[index], name: e.target.value }
                                        const updatedNode = { ...selectedNode, data: { ...selectedNode.data, outputParameters: updatedParams } }
                                        setSelectedNode(updatedNode)
                                        setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                                      }}
                                      className="flex-1"
                                      inputProps={{
                                        style: { color: '#6b7280' }
                                      }}
                                    />

                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="error"
                                      onClick={() => {
                                        const updatedParams = selectedNode.data.outputParameters.filter((_: any, i: number) => i !== index)
                                        const updatedNode = { ...selectedNode, data: { ...selectedNode.data, outputParameters: updatedParams } }
                                        setSelectedNode(updatedNode)
                                        setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                                      }}
                                      className="min-w-0 px-2"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ))
                              ) : (
                                <div className="text-sm text-gray-500 text-center py-2">
                                  暂无输出参数
                                </div>
                              )}
                              <Button
                                size="small"
                                variant="outlined"
                                fullWidth
                                onClick={() => {
                                  const newParam = { name: '' }
                                  const updatedParams = [...(selectedNode.data.outputParameters || []), newParam]
                                  const updatedNode = { ...selectedNode, data: { ...selectedNode.data, outputParameters: updatedParams } }
                                  setSelectedNode(updatedNode)
                                  setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                                }}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                添加参数
                              </Button>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Typography variant="subtitle2" className="text-gray-700 font-medium">
                                文本输出
                              </Typography>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={selectedNode.data.streamingEnabled || false}
                                    onChange={(e) => {
                                      const updatedNode = { ...selectedNode, data: { ...selectedNode.data, streamingEnabled: e.target.checked } }
                                      setSelectedNode(updatedNode)
                                      setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                                    }}
                                    size="small"
                                  />
                                }
                                label={
                                  <Typography variant="body2" className="text-gray-700 text-sm">
                                    启用流式输出
                                  </Typography>
                                  }
                              />
                            </div>
                            <TextField
                              fullWidth
                              size="small"
                              multiline
                              rows={3}
                              placeholder="输入文本输出内容..."
                              value={selectedNode.data.textOutput || ''}
                              onChange={(e) => {
                                const updatedNode = { ...selectedNode, data: { ...selectedNode.data, textOutput: e.target.value } }
                                setSelectedNode(updatedNode)
                                setNodes(nodes.map(node => node.id === selectedNode.id ? updatedNode : node))
                              }}
                              inputProps={{
                                style: { color: '#6b7280' }
                              }}
                            />
                          </div>
                        </>
                      )}

                      {/* 面板底部 */}
                      <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-200">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setSelectedNode(null)}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          关闭
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => setSelectedNode(null)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          保存
                        </Button>
                      </div>
                    </div>
                  </Panel>
                )}

                {/* 调试面板 - 右侧 */}
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

                    {/* 执行状态 */}
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

                    {/* 输入部分 */}
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

                    {/* 执行历史树 */}
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
                            {executionHistory.map((step, _index) => (
                              <div key={step.id} className="flex items-start space-x-2 p-2 bg-white rounded border border-gray-200">
                                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                                  step.status === 'executing' ? 'bg-orange-500 animate-pulse' :
                                  step.status === 'completed' ? 'bg-green-500' : 'bg-gray-400'
                                }`}>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium text-gray-700 truncate">
                                      {step.nodeName}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      step.status === 'executing' ? 'bg-orange-100 text-orange-700' :
                                      step.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                      {step.status === 'executing' ? '执行中' :
                                       step.status === 'completed' ? '已完成' : '等待中'}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-600 truncate">
                                    {step.output}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {step.timestamp} • {step.duration}ms
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 控制按钮 */}
                    <div className="flex items-center space-x-2">
                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        onClick={clearDebugHistory}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs py-2"
                      >
                        清除历史
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        onClick={stopExecution}
                        disabled={executionState === 'idle'}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs py-2 disabled:opacity-50"
                      >
                        停止执行
                      </Button>
                    </div>
                  </Panel>
                )}

                {/* 增强型小地图 */}
                <MiniMap 
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg"
                  nodeColor={() => '#6b7280'}
                  nodeStrokeWidth={3}
                  zoomable
                  pannable
                />
                
                {/* 工作流信息增强面板 */}
                <Panel position="top-left" className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>节点: {nodes.length}</span>
                    <span>•</span>
                    <span>连接: {edges.length}</span>
                  </div>
                </Panel>

                {/* 浮动控制面板 - 右上角 */}
                <Panel position="top-right" className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-2">
                  <div className="flex items-center space-x-2">
                    {/* 导入按钮 */}
                    <button
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

                    {/* 导出按钮 */}
                    <button
                      onClick={handleExport}
                      className="w-10 h-10 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:shadow-md group"
                      title="导出工作流"
                    >
                      <Download className="w-5 h-5 text-green-600 group-hover:text-green-700" />
                    </button>

                    {/* 测试运行按钮 */}
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

                    {/* 保存按钮 */}
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