export interface Agent {
  id: string
  name: string
  description: string
  avatar: string
  status: 'active' | 'inactive' | 'error' | 'unpublished' | 'draft'
  model: string
  lastActive: string
  usageCount: number
  tags: string[]
  createdAt: string
  apiEndpoint?: string
  
  // Agent configuration data
  systemPrompt?: string
  modelParams?: {
    temperature: number
    maxTokens: number
    topP: number
    frequencyPenalty: number
    presencePenalty: number
  }
  plugins?: string[]
  workflows?: string[]
  knowledge?: any[]
  memory?: any[]
  openingRemarks?: string
}

// Shared agent data - this will be the single source of truth
export const agents: Agent[] = [
  {
    id: '1',
    name: '客服助手',
    description: '智能客服机器人，支持多轮对话和问题解答',
    avatar: '🤖',
    status: 'active',
    model: 'GPT-4',
    lastActive: '2小时前',
    usageCount: 1234,
    tags: ['客服', '对话', '多轮'],
    createdAt: '2024-01-15',
    apiEndpoint: 'https://api.jiuwen.ai/v1/agents/customer-service'
  },
  {
    id: '2',
    name: '数据分析师',
    description: '数据分析智能体，自动生成报告和洞察',
    avatar: '📊',
    status: 'inactive',
    model: 'Claude-3',
    lastActive: '1天前',
    usageCount: 567,
    tags: ['数据分析', '报告', '洞察'],
    createdAt: '2024-01-20',
    apiEndpoint: 'https://api.jiuwen.ai/v1/agents/data-analyst'
  },
  {
    id: '3',
    name: '代码助手',
    description: '编程辅助智能体，代码审查和优化建议',
    avatar: '💻',
    status: 'active',
    model: 'GPT-4',
    lastActive: '3小时前',
    usageCount: 890,
    tags: ['编程', '代码审查', '优化'],
    createdAt: '2024-01-10',
    apiEndpoint: 'https://api.jiuwen.ai/v1/agents/code-assistant'
  },
  {
    id: '4',
    name: '智能翻译器',
    description: '多语言翻译智能体，支持实时翻译和语言学习',
    avatar: '🌐',
    status: 'unpublished',
    model: 'Claude-3',
    lastActive: '未激活',
    usageCount: 0,
    tags: ['翻译', '多语言', '学习'],
    createdAt: '2024-01-25',
    apiEndpoint: 'https://api.jiuwen.ai/v1/agents/translator'
  }
]

// Get agent by ID
export const getAgentById = (id: string): Agent | undefined => {
  return agents.find(agent => agent.id === id)
}

// Get all agents
export const getAllAgents = (): Agent[] => {
  return agents
}

// Add new agent
export const addAgent = (agent: Omit<Agent, 'id' | 'createdAt'>): Agent => {
  const newAgent: Agent = {
    ...agent,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0]
  }
  agents.push(newAgent)
  return newAgent
}

// Update agent
export const updateAgent = (id: string, updates: Partial<Agent>): Agent | null => {
  const index = agents.findIndex(agent => agent.id === id)
  if (index !== -1) {
    agents[index] = { ...agents[index], ...updates }
    return agents[index]
  }
  return null
}

// Delete agent
export const deleteAgent = (id: string): boolean => {
  const index = agents.findIndex(agent => agent.id === id)
  if (index !== -1) {
    agents.splice(index, 1)
    return true
  }
  return false
}

// Publish agent (change status from draft/unpublished to active)
export const publishAgent = (id: string): Agent | null => {
  const agent = getAgentById(id)
  if (agent && (agent.status === 'draft' || agent.status === 'unpublished')) {
    return updateAgent(id, { 
      status: 'active',
      lastActive: '刚刚',
      apiEndpoint: `https://api.jiuwen.ai/v1/agents/${id}`
    })
  }
  return null
}

// Unpublish agent (change status to unpublished)
export const unpublishAgent = (id: string): Agent | null => {
  const agent = getAgentById(id)
  if (agent && agent.status === 'active') {
    return updateAgent(id, { 
      status: 'unpublished',
      lastActive: '未激活'
    })
  }
  return null
}