'use client';

import { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AppShell from '@/components/layout/AppShell';
import Link from 'next/link';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SmartToyIcon from '@mui/icons-material/SmartToy';

// Mock data for agents
const mockAgents = [
  {
    id: '1',
    name: '客服助手',
    description: '智能客服机器人，能够处理常见问题和客户咨询',
    type: 'chatbot',
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    usage: 1250,
  },
  {
    id: '2',
    name: '数据分析师',
    description: '自动分析数据并生成可视化报告',
    type: 'workflow',
    status: 'draft',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    usage: 320,
  },
  {
    id: '3',
    name: '内容创作助手',
    description: '帮助创作文章、博客和营销内容',
    type: 'chatbot',
    status: 'published',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-15',
    usage: 890,
  },
  {
    id: '4',
    name: '代码审查员',
    description: '自动审查代码质量和安全性',
    type: 'workflow',
    status: 'draft',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-19',
    usage: 156,
  },
];

const getAgentIcon = (type: string) => {
  switch (type) {
    case 'chatbot':
      return <PsychologyIcon />;
    case 'workflow':
      return <SmartToyIcon />;
    default:
      return <AutoAwesomeIcon />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'success';
    case 'draft':
      return 'warning';
    default:
      return 'default';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'published':
      return '已发布';
    case 'draft':
      return '草稿';
    default:
      return '未知';
  }
};

export default function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, agentId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedAgentId(agentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAgentId(null);
  };

  const filteredAgents = mockAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell title="代理列表">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            代理
          </Typography>
          <Button
            variant="contained"
            component={Link}
            href="/agents/new"
            startIcon={<AutoAwesomeIcon />}
          >
            创建代理
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="搜索代理..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Grid container spacing={3}>
          {filteredAgents.map((agent) => (
            <Grid item xs={12} sm={6} md={4} key={agent.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {getAgentIcon(agent.type)}
                    <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                      {agent.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, agent.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {agent.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={getStatusText(agent.status)}
                      color={getStatusColor(agent.status) as any}
                      size="small"
                    />
                    <Chip
                      label={`${agent.usage} 次使用`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    更新于 {agent.updatedAt}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    component={Link}
                    href={`/agents/${agent.id}`}
                    startIcon={<EditIcon />}
                  >
                    编辑
                  </Button>
                  <Button
                    size="small"
                    startIcon={<PlayArrowIcon />}
                  >
                    测试
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <ContentCopyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>复制</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>删除</ListItemText>
          </MenuItem>
        </Menu>
      </Container>
    </AppShell>
  );
}

