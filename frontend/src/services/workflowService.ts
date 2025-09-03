export interface Workflow {
  id: string
  name: string
  description: string
  status: 'running' | 'stopped' | 'scheduled' | 'error' | 'completed'
  trigger: string
  lastRun: string
  nextRun: string
  successRate: number
  executionTime: string
  nodes: number
  tags: string[]
  createdAt: string
  workflowData?: any // Store the actual workflow canvas data
}

// Shared workflow data - this will be the single source of truth
export const workflows: Workflow[] = [
  {
    id: '1',
    name: '订单处理流程',
    description: '自动化订单处理和状态更新，包括库存检查、支付验证和发货通知',
    status: 'running',
    trigger: 'Webhook',
    lastRun: '5分钟前',
    nextRun: '实时',
    successRate: 98.5,
    executionTime: '2.3s',
    nodes: 12,
    tags: ['订单', '自动化', '电商'],
    createdAt: '2024-01-15'
  }
]

// Get workflow by ID
export const getWorkflowById = (id: string): Workflow | undefined => {
  return workflows.find(workflow => workflow.id === id)
}

// Get all workflows
export const getAllWorkflows = (): Workflow[] => {
  return workflows
}

// Add new workflow
export const addWorkflow = (workflow: Omit<Workflow, 'id' | 'createdAt'>): Workflow => {
  const newWorkflow: Workflow = {
    ...workflow,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0]
  }
  workflows.push(newWorkflow)
  return newWorkflow
}

// Update workflow
export const updateWorkflow = (id: string, updates: Partial<Workflow>): Workflow | null => {
  const index = workflows.findIndex(workflow => workflow.id === id)
  if (index !== -1) {
    workflows[index] = { ...workflows[index], ...updates }
    return workflows[index]
  }
  return null
}

// Delete workflow
export const deleteWorkflow = (id: string): boolean => {
  const index = workflows.findIndex(workflow => workflow.id === id)
  if (index !== -1) {
    workflows.splice(index, 1)
    return true
  }
  return false
}

// Save workflow data (creates new or updates existing)
export const saveWorkflow = (
  name: string, 
  description: string, 
  workflowData: any, 
  tags: string[] = [],
  existingId?: string
): Workflow => {
  if (existingId) {
    // Update existing workflow
    const updated = updateWorkflow(existingId, {
      name,
      description,
      workflowData,
      tags,
      lastRun: '刚刚',
      executionTime: '0.1s'
    })
    if (updated) {
      return updated
    }
  }
  
  // Create new workflow
  return addWorkflow({
    name,
    description,
    status: 'stopped',
    trigger: '手动',
    lastRun: '从未运行',
    nextRun: '手动触发',
    successRate: 0,
    executionTime: '0s',
    nodes: workflowData.nodes?.length || 0,
    tags,
    workflowData
  })
}