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

