'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import { useFlowStore } from '@/store/flowStore';

export default function InspectorPanel() {
  const nodes = useFlowStore((s) => s.nodes);
  const selectedNodeId = useFlowStore((s) => s.selectedNodeId);
  const updateNodeLabel = useFlowStore((s) => s.updateNodeLabel);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId]
  );

  return (
    <Paper elevation={0} sx={{ height: 'calc(100vh - 64px)', borderRadius: 0, p: 2, width: '100%' }}>
      <Typography variant="subtitle1" gutterBottom>
        Inspector
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {!selectedNode ? (
        <Typography variant="body2" color="text.secondary">
          Select a node to edit its properties.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Label"
            value={String(selectedNode.data?.label ?? '')}
            onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
            size="small"
          />
        </Box>
      )}
    </Paper>
  );
}

