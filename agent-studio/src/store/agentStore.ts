import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  nodes: any[];
  edges: any[];
  config: {
    model: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
  };
  tags: string[];
  thumbnail?: string;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'csv' | 'json' | 'pdf';
  size: number;
  createdAt: string;
  updatedAt: string;
  documents: Document[];
}

export interface Document {
  id: string;
  title: string;
  content: string;
  metadata: Record<string, any>;
  embedding?: number[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  type: 'api' | 'function' | 'webhook' | 'database';
  config: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  agentId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'completed' | 'failed';
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface AgentStore {
  // Agents
  agents: Agent[];
  currentAgent: Agent | null;
  isLoading: boolean;
  
  // Datasets
  datasets: Dataset[];
  currentDataset: Dataset | null;
  
  // Tools
  tools: Tool[];
  currentTool: Tool | null;
  
  // Conversations
  conversations: Conversation[];
  currentConversation: Conversation | null;
  
  // Actions
  createAgent: (agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;
  setCurrentAgent: (agent: Agent | null) => void;
  
  createDataset: (dataset: Omit<Dataset, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDataset: (id: string, updates: Partial<Dataset>) => void;
  deleteDataset: (id: string) => void;
  setCurrentDataset: (dataset: Dataset | null) => void;
  
  createTool: (tool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTool: (id: string, updates: Partial<Tool>) => void;
  deleteTool: (id: string) => void;
  setCurrentTool: (tool: Tool | null) => void;
  
  createConversation: (conversation: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  
  setLoading: (loading: boolean) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useAgentStore = create<AgentStore>()(
  persist(
    (set, get) => ({
      // Initial state
      agents: [
        {
          id: '1',
          name: '客服助手',
          description: '智能客服机器人，能够回答常见问题并提供帮助',
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          nodes: [],
          edges: [],
          config: {
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            maxTokens: 1000,
            systemPrompt: '你是一个专业的客服助手，请友好地帮助用户解决问题。'
          },
          tags: ['客服', 'AI助手'],
          thumbnail: '/api/placeholder/150/100'
        },
        {
          id: '2',
          name: '数据分析师',
          description: '专业的数据分析助手，能够处理和分析各种数据',
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          nodes: [],
          edges: [],
          config: {
            model: 'gpt-4',
            temperature: 0.3,
            maxTokens: 2000,
            systemPrompt: '你是一个专业的数据分析师，请帮助用户分析数据并提供见解。'
          },
          tags: ['数据分析', '专业工具'],
          thumbnail: '/api/placeholder/150/100'
        }
      ],
      currentAgent: null,
      isLoading: false,
      
      datasets: [
        {
          id: '1',
          name: '产品知识库',
          description: '包含公司产品的详细信息和常见问题',
          type: 'text',
          size: 1024 * 1024 * 5, // 5MB
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          documents: []
        }
      ],
      currentDataset: null,
      
      tools: [
        {
          id: '1',
          name: '天气查询',
          description: '获取指定城市的天气信息',
          type: 'api',
          config: {
            endpoint: 'https://api.weatherapi.com/v1/current.json',
            method: 'GET',
            headers: {},
            parameters: ['city']
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: '计算器',
          description: '执行数学计算',
          type: 'function',
          config: {
            function: 'calculate',
            parameters: ['expression']
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      currentTool: null,
      
      conversations: [],
      currentConversation: null,
      
      // Actions
      createAgent: (agent) => {
        const newAgent: Agent = {
          ...agent,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ agents: [...state.agents, newAgent] }));
      },
      
      updateAgent: (id, updates) => {
        set((state) => ({
          agents: state.agents.map((agent) =>
            agent.id === id
              ? { ...agent, ...updates, updatedAt: new Date().toISOString() }
              : agent
          ),
        }));
      },
      
      deleteAgent: (id) => {
        set((state) => ({
          agents: state.agents.filter((agent) => agent.id !== id),
        }));
      },
      
      setCurrentAgent: (agent) => {
        set({ currentAgent: agent });
      },
      
      createDataset: (dataset) => {
        const newDataset: Dataset = {
          ...dataset,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ datasets: [...state.datasets, newDataset] }));
      },
      
      updateDataset: (id, updates) => {
        set((state) => ({
          datasets: state.datasets.map((dataset) =>
            dataset.id === id
              ? { ...dataset, ...updates, updatedAt: new Date().toISOString() }
              : dataset
          ),
        }));
      },
      
      deleteDataset: (id) => {
        set((state) => ({
          datasets: state.datasets.filter((dataset) => dataset.id !== id),
        }));
      },
      
      setCurrentDataset: (dataset) => {
        set({ currentDataset: dataset });
      },
      
      createTool: (tool) => {
        const newTool: Tool = {
          ...tool,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ tools: [...state.tools, newTool] }));
      },
      
      updateTool: (id, updates) => {
        set((state) => ({
          tools: state.tools.map((tool) =>
            tool.id === id
              ? { ...tool, ...updates, updatedAt: new Date().toISOString() }
              : tool
          ),
        }));
      },
      
      deleteTool: (id) => {
        set((state) => ({
          tools: state.tools.filter((tool) => tool.id !== id),
        }));
      },
      
      setCurrentTool: (tool) => {
        set({ currentTool: tool });
      },
      
      createConversation: (conversation) => {
        const newConversation: Conversation = {
          ...conversation,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ conversations: [...state.conversations, newConversation] }));
      },
      
      addMessage: (conversationId, message) => {
        const newMessage: Message = {
          ...message,
          id: generateId(),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          conversations: state.conversations.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  messages: [...conversation.messages, newMessage],
                  updatedAt: new Date().toISOString(),
                }
              : conversation
          ),
        }));
      },
      
      setCurrentConversation: (conversation) => {
        set({ currentConversation: conversation });
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'agent-studio-storage',
      partialize: (state) => ({
        agents: state.agents,
        datasets: state.datasets,
        tools: state.tools,
        conversations: state.conversations,
      }),
    }
  )
);