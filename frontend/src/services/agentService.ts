export interface Agent {
  id: string
  name: string
  description: string
  avatar: string
  status: 'active' | 'inactive' | 'error' | 'unpublished' | 'draft'
  model: string
  lastActive: string
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
    tags: ['客服', '对话', '多轮'],
    createdAt: '2024-01-15',
    apiEndpoint: 'https://api.jiuwen.ai/v1/agents/customer-service'
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
    createdAt: new Date().toISOString().split('T')[0],
    apiEndpoint: generateApiEndpoint(agent.name)
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

// Helper function to generate API endpoint from agent name
const generateApiEndpoint = (agentName: string): string => {
  // Convert Chinese name to English slug or use English name directly
  const nameMap: { [key: string]: string } = {
    '客服助手': 'customer-service',
    '数据分析师': 'data-analyst',
    '代码助手': 'code-assistant',
    '出行规划智能体': 'travel-planner',
    '智能客服': 'customer-service',
    '数据分析': 'data-analysis',
    '编程助手': 'programming-assistant',
    '翻译助手': 'translation-assistant'
  }
  
  // If we have a mapping, use it
  if (nameMap[agentName]) {
    return `https://api.jiuwen.ai/v1/agents/${nameMap[agentName]}`
  }
  
  // If it's already in English, convert to slug format
  if (/^[a-zA-Z\s]+$/.test(agentName)) {
    const slug = agentName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    return `https://api.jiuwen.ai/v1/agents/${slug}`
  }
  
  // For other cases, generate a unique identifier
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 8)
  return `https://api.jiuwen.ai/v1/agents/agent-${timestamp}-${randomId}`
}

// Publish agent (change status from draft/unpublished to active)
export const publishAgent = (id: string): Agent | null => {
  const agent = getAgentById(id)
  if (agent && (agent.status === 'draft' || agent.status === 'unpublished')) {
    return updateAgent(id, { 
      status: 'active',
      lastActive: '刚刚',
      apiEndpoint: generateApiEndpoint(agent.name)
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