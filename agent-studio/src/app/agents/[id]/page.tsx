"use client";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AgentCanvas from '@/components/AgentCanvas';
import InspectorPanel from '@/components/InspectorPanel';
import AppShell from '@/components/layout/AppShell';
import NodePalette from '@/components/flow/NodePalette';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';

export default function AgentDetailPage() {
  const [tab, setTab] = useState(0);
  return (
    <AppShell title="代理构建器" actions={null}>
      <Container maxWidth={false} disableGutters>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2 }}>
          <Tab label="画布" />
          <Tab label="知识库" />
          <Tab label="工具" />
          <Tab label="变量" />
          <Tab label="调试" />
          <Tab label="发布" />
        </Tabs>
        {tab === 0 && (
          <Box sx={{ display: 'grid', gridTemplateColumns: '240px 1fr 320px' }}>
            <NodePalette />
            <AgentCanvas />
            <InspectorPanel />
          </Box>
        )}
        {tab !== 0 && (
          <Box sx={{ p: 3, color: 'text.secondary' }}>此模块为占位内容，待接入后端。</Box>
        )}
      </Container>
    </AppShell>
  );
}

