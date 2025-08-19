'use client';

import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Connection,
  Node,
  NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useFlowStore } from '@/store/flowStore';
import { nodeTypes } from '@/components/flow/customNodes';

type AgentCanvasProps = {
  height?: number | string;
};

export default function AgentCanvas({ height = 'calc(100vh - 64px)' }: AgentCanvasProps) {
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const onNodesChange = useFlowStore((s) => s.onNodesChange);
  const onEdgesChange = useFlowStore((s) => s.onEdgesChange);
  const onConnectStore = useFlowStore((s) => s.onConnect);
  const setSelectedNodeId = useFlowStore((s) => s.setSelectedNodeId);
  const setInitialGraph = useFlowStore((s) => s.setInitialGraph);

  const onNodeClick: NodeMouseHandler = useCallback((_, node: Node) => {
    setSelectedNodeId(node.id);
  }, [setSelectedNodeId]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const bounds = (event.target as HTMLDivElement).getBoundingClientRect();
      const position = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      const id = `${type}-${Date.now()}`;
      const newNode: Node = {
        id,
        type,
        position,
        data: { label: type },
      };
      setInitialGraph([...nodes, newNode], edges);
    },
    [nodes, edges, setInitialGraph]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <Paper elevation={0} sx={{ height, width: '100%', borderRadius: 0 }}>
      <Box sx={{ height: '100%', width: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={(c: Connection) => onConnectStore(c)}
          onNodeClick={onNodeClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </Box>
    </Paper>
  );
}

