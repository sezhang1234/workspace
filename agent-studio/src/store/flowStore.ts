import { create } from 'zustand';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from 'reactflow';

export type FlowState = {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId?: string;
  setSelectedNodeId: (nodeId?: string) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeLabel: (nodeId: string, label: string) => void;
  setInitialGraph: (nodes: Node[], edges: Edge[]) => void;
};

const initialNodes: Node[] = [
  {
    id: 'input',
    position: { x: 80, y: 120 },
    data: { label: 'User Input' },
    type: 'input',
  },
  {
    id: 'llm',
    position: { x: 360, y: 120 },
    data: { label: 'LLM Agent' },
  },
  {
    id: 'tool',
    position: { x: 360, y: 260 },
    data: { label: 'Tool Call' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e-input-llm', source: 'input', target: 'llm', animated: true },
  { id: 'e-llm-tool', source: 'llm', target: 'tool' },
];

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: undefined,
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection) =>
    set({ edges: addEdge({ ...connection, animated: true }, get().edges) }),
  updateNodeLabel: (nodeId, label) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, label } } : n
      ),
    }),
  setInitialGraph: (nodes, edges) => set({ nodes, edges }),
}));

