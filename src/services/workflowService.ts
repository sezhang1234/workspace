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
  },
  {
    id: '2',
    name: '用户反馈分析',
    description: '收集和分析用户反馈数据，自动生成洞察报告和优先级建议',
    status: 'completed',
    trigger: '定时',
    lastRun: '1小时前',
    nextRun: '每天 9:00',
    successRate: 100,
    executionTime: '45s',
    nodes: 8,
    tags: ['分析', '反馈', '报告'],
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    name: '数据同步流程',
    description: '多系统数据同步和备份，确保数据一致性和完整性',
    status: 'scheduled',
    trigger: '定时',
    lastRun: '6小时前',
    nextRun: '每4小时',
    successRate: 95.2,
    executionTime: '5.1s',
    nodes: 15,
    tags: ['同步', '备份', '数据'],
    createdAt: '2024-01-10'
  },
  {
    id: '4',
    name: '营销活动自动化',
    description: '根据用户行为自动触发营销活动，包括邮件、短信和推送通知',
    status: 'running',
    trigger: '事件',
    lastRun: '10分钟前',
    nextRun: '实时',
    successRate: 97.8,
    executionTime: '1.8s',
    nodes: 20,
    tags: ['营销', '自动化', '个性化'],
    createdAt: '2024-01-25'
  },
  {
    id: '5',
    name: '系统监控告警',
    description: '实时监控系统性能指标，异常时自动发送告警通知',
    status: 'running',
    trigger: '实时',
    lastRun: '持续',
    nextRun: '持续',
    successRate: 99.9,
    executionTime: '0.5s',
    nodes: 6,
    tags: ['监控', '告警', '运维'],
    createdAt: '2024-01-08'
  },
  {
    id: '6',
    name: '内容审核流程',
    description: '自动审核用户生成内容，识别不当内容并采取相应措施',
    status: 'error',
    trigger: '事件',
    lastRun: '2小时前',
    nextRun: '暂停',
    successRate: 89.3,
    executionTime: '3.2s',
    nodes: 18,
    tags: ['审核', '内容', '安全'],
    createdAt: '2024-01-18'
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