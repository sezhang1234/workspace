"use client";
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AgentCanvas from '@/components/AgentCanvas';
import InspectorPanel from '@/components/InspectorPanel';
import AppShell from '@/components/layout/AppShell';
import NodePalette from '@/components/flow/NodePalette';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SaveIcon from '@mui/icons-material/Save';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const tabs = [
  { label: '画布', path: '' },
  { label: '知识库', path: '/knowledge' },
  { label: '工具', path: '/tools' },
  { label: '变量', path: '/variables' },
  { label: '调试', path: '/debug' },
  { label: '发布', path: '/publish' },
];

export default function AgentDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [tab, setTab] = useState(() => {
    const currentPath = pathname.split('/').pop() || '';
    const tabIndex = tabs.findIndex(tab => tab.path === `/${currentPath}` || (tab.path === '' && currentPath === ''));
    return tabIndex >= 0 ? tabIndex : 0;
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    const agentId = pathname.split('/')[2]; // Get agent ID from URL
    const newPath = tabs[newValue].path;
    if (newPath === '') {
      router.push(`/agents/${agentId}`);
    } else {
      router.push(`/agents/${agentId}${newPath}`);
    }
  };

  const agentId = pathname.split('/')[2];

  return (
    <AppShell 
      title="代理构建器" 
      actions={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            size="small"
          >
            保存
          </Button>
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            size="small"
          >
            测试
          </Button>
        </Box>
      }
    >
      <Container maxWidth={false} disableGutters>
        <Tabs 
          value={tab} 
          onChange={handleTabChange} 
          sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tabItem, index) => (
            <Tab key={index} label={tabItem.label} />
          ))}
        </Tabs>
        
        {tab === 0 && (
          <Box sx={{ display: 'grid', gridTemplateColumns: '240px 1fr 320px' }}>
            <NodePalette />
            <AgentCanvas />
            <InspectorPanel />
          </Box>
        )}
        
        {tab !== 0 && (
          <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <AutoAwesomeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {tabs[tab].label} 功能
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                此功能模块正在开发中，请稍后查看。
              </Typography>
              <Button
                variant="outlined"
                component={Link}
                href={`/agents/${agentId}${tabs[tab].path}`}
              >
                查看详情
              </Button>
            </Paper>
          </Box>
        )}
      </Container>
    </AppShell>
  );
}

