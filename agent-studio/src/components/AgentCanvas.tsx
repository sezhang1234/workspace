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

  const onNodeClick: NodeMouseHandler = useCallback((_, node: Node) => {
    setSelectedNodeId(node.id);
  }, [setSelectedNodeId]);

  return (
    <Paper elevation={0} sx={{ height, width: '100%', borderRadius: 0 }}>
      <Box sx={{ height: '100%', width: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={(c: Connection) => onConnectStore(c)}
          onNodeClick={onNodeClick}
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

