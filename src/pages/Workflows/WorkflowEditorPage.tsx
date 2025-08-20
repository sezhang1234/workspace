import React, { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
  BackgroundVariant,
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
  Typography,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Tooltip,
  SelectChangeEvent,
  Switch,
  FormControlLabel
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

const WorkflowEditorContent: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
  const [showNodePanel, setShowNodePanel] = useState(false)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

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
      position: { x: 100, y: 200 },
      data: {
        label: '开始',
        trigger: 'manual',
        executionCount: 0,
        lastExecuted: '从未'
      }
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
      }
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
      }
    }
  ])
  
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

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

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])



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
      case 'llmNode':
        defaultData = {
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

  // Initialize default workflow
  useEffect(() => {
    if (isNew) {
      const defaultNodes: Node[] = [
        {
          id: 'start-1',
          type: 'startNode',
          position: { x: 100, y: 200 },
          data: {
            label: '开始',
            trigger: 'manual',
            executionCount: 0,
            lastExecuted: '从未'
          }
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
          }
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
          }
        }
      ]

      const defaultEdges: Edge[] = [
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
      ]

      console.log('Setting default nodes:', defaultNodes)
      console.log('Setting default edges:', defaultEdges)
      
      setNodes(defaultNodes)
      setEdges(defaultEdges)
    }
  }, [isNew])

  // Debug: Monitor nodes and edges state
  useEffect(() => {
    console.log('Current nodes:', nodes)
    console.log('Current edges:', edges)
  }, [nodes, edges])

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
        <div className="h-[900px]">
          {/* Workflow Configuration Panel */}
          <Card className="mb-4 shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium">
                    工作流名称
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="输入工作流名称"
                    value={workflow.name}
                    onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
                    className="bg-white/80"
                  />
                </div>
                
                <div>
                  <Typography variant="subtitle2" className="text-gray-700 mb-2 font-medium">
                    触发器类型
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={workflow.trigger}
                      onChange={(e) => setWorkflow({ ...workflow, trigger: e.target.value })}
                      className="bg-white/80"
                    >
                      <MenuItem value="webhook">Webhook</MenuItem>
                      <MenuItem value="schedule">定时任务</MenuItem>
                      <MenuItem value="manual">手动触发</MenuItem>
                      <MenuItem value="event">事件驱动</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="flex items-center justify-center">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={workflow.isActive}
                        onChange={(e) => setWorkflow({ ...workflow, isActive: e.target.checked })}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="subtitle2" className="text-gray-700 font-medium">
                        启用工作流
                      </Typography>
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            {/* Workflow Canvas */}
            <div className="w-full">
              <Card className="h-[800px] shadow-lg border-0">
                <CardContent className="h-full p-0">
                  <div className={`h-full bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-300 ${showNodePanel || selectedNode ? 'backdrop-blur-sm' : ''}`}>
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
                    >
                      {/* Light grid background */}
                      <Background 
                        variant={BackgroundVariant.Dots} 
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
                          <span>•</span>
                          <span>默认: {isNew ? '是' : '否'}</span>
                        </div>
                      </Panel>




                    </ReactFlow>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Remove the old static configuration panel */}
          </div>
        </div>
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

const WorkflowEditorPage: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowEditorContent />
    </ReactFlowProvider>
  )
}

export default WorkflowEditorPage