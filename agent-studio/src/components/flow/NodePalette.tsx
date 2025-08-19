'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

type PaletteItem = {
  type: string;
  label: string;
};

const items: PaletteItem[] = [
  { type: 'inputNode', label: '输入' },
  { type: 'llmNode', label: 'LLM' },
  { type: 'toolNode', label: '工具' },
  { type: 'ifNode', label: '条件' },
  { type: 'outputNode', label: '输出' },
];

export default function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Paper elevation={0} sx={{ height: 'calc(100vh - 64px)', p: 1, borderRadius: 0 }}>
      <Typography variant="subtitle1" sx={{ px: 1, py: 1 }}>节点库</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1 }}>
        {items.map((it) => (
          <Paper
            key={it.type}
            draggable
            onDragStart={(e) => onDragStart(e, it.type)}
            sx={{ p: 1, textAlign: 'center', cursor: 'grab' }}
          >
            {it.label}
          </Paper>
        ))}
      </Box>
    </Paper>
  );
}

