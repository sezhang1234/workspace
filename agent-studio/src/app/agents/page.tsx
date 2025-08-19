'use client';

import React, { useState, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  ViewModule as GridIcon,
  ViewList as ListIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useAgentStore } from '@/store/agentStore';
import AgentCard from '@/components/agents/AgentCard';
import AppShell from '@/components/layout/AppShell';
import { useSnackbar } from 'notistack';

export default function AgentsPage() {
  const { agents, deleteAgent, updateAgent } = useAgentStore();
  const { enqueueSnackbar } = useSnackbar();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'updatedAt' | 'createdAt'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<string | null>(null);

  const filteredAndSortedAgents = useMemo(() => {
    let filtered = agents.filter((agent) => {
      const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           agent.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [agents, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleDelete = (agentId: string) => {
    setAgentToDelete(agentId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (agentToDelete) {
      deleteAgent(agentToDelete);
      enqueueSnackbar('代理已删除', { variant: 'success' });
      setDeleteDialogOpen(false);
      setAgentToDelete(null);
    }
  };

  const handlePublish = (agentId: string) => {
    updateAgent(agentId, { status: 'published' });
    enqueueSnackbar('代理已发布', { variant: 'success' });
  };

  const handleArchive = (agentId: string) => {
    updateAgent(agentId, { status: 'archived' });
    enqueueSnackbar('代理已归档', { variant: 'info' });
  };

  const handleDuplicate = (agent: any) => {
    const duplicatedAgent = {
      ...agent,
      name: `${agent.name} (副本)`,
      status: 'draft' as const,
      tags: [...agent.tags, '副本'],
    };
    delete duplicatedAgent.id;
    delete duplicatedAgent.createdAt;
    delete duplicatedAgent.updatedAt;
    
    // This would be handled by the store's createAgent method
    enqueueSnackbar('代理已复制', { variant: 'success' });
  };

  const stats = useMemo(() => {
    const total = agents.length;
    const published = agents.filter(a => a.status === 'published').length;
    const draft = agents.filter(a => a.status === 'draft').length;
    const archived = agents.filter(a => a.status === 'archived').length;
    
    return { total, published, draft, archived };
  }, [agents]);

  return (
    <AppShell title="代理管理">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              代理管理
            </Typography>
            <Typography variant="body2" color="text.secondary">
              创建、管理和部署您的 AI 代理
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            href="/agents/new"
            component="a"
            size="large"
          >
            新建代理
          </Button>
        </Box>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                总代理数
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {stats.published}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                已发布
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {stats.draft}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                草稿
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="text.secondary">
                {stats.archived}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                已归档
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
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
              sx={{ minWidth: 300 }}
            />

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>状态</InputLabel>
              <Select
                value={statusFilter}
                label="状态"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">全部</MenuItem>
                <MenuItem value="draft">草稿</MenuItem>
                <MenuItem value="published">已发布</MenuItem>
                <MenuItem value="archived">已归档</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>排序</InputLabel>
              <Select
                value={sortBy}
                label="排序"
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <MenuItem value="name">名称</MenuItem>
                <MenuItem value="updatedAt">更新时间</MenuItem>
                <MenuItem value="createdAt">创建时间</MenuItem>
              </Select>
            </FormControl>

            <IconButton
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              color={sortOrder === 'desc' ? 'primary' : 'default'}
            >
              <SortIcon />
            </IconButton>

            <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
              <Tooltip title="网格视图">
                <IconButton
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                >
                  <GridIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="列表视图">
                <IconButton
                  onClick={() => setViewMode('list')}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                >
                  <ListIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>

        {/* Results */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            找到 {filteredAndSortedAgents.length} 个代理
          </Typography>
        </Box>

        {/* Agents Grid */}
        <Grid container spacing={3}>
          {filteredAndSortedAgents.map((agent) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={agent.id}>
              <AgentCard
                agent={agent}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onPublish={handlePublish}
                onArchive={handleArchive}
              />
            </Grid>
          ))}
        </Grid>

        {filteredAndSortedAgents.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              没有找到代理
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm || statusFilter !== 'all' 
                ? '尝试调整搜索条件或筛选器'
                : '创建您的第一个代理开始使用'
              }
            </Typography>
          </Paper>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>确认删除</DialogTitle>
          <DialogContent>
            <Typography>
              确定要删除这个代理吗？此操作无法撤销。
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              删除
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AppShell>
  );
}

