'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Api as ApiIcon,
  Functions as FunctionsIcon,
  Webhook as WebhookIcon,
  Storage as StorageIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as TestIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
} from '@mui/icons-material';
import { useAgentStore } from '@/store/agentStore';
import AppShell from '@/components/layout/AppShell';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

export default function ToolsPage() {
  const { tools, createTool, deleteTool, updateTool } = useAgentStore();
  const { enqueueSnackbar } = useSnackbar();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || tool.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && tool.isActive) ||
                         (statusFilter === 'inactive' && !tool.isActive);
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api':
        return <ApiIcon />;
      case 'function':
        return <FunctionsIcon />;
      case 'webhook':
        return <WebhookIcon />;
      case 'database':
        return <StorageIcon />;
      default:
        return <CodeIcon />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'api':
        return 'primary';
      case 'function':
        return 'secondary';
      case 'webhook':
        return 'warning';
      case 'database':
        return 'success';
      default:
        return 'default';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'api':
        return 'API';
      case 'function':
        return '函数';
      case 'webhook':
        return 'Webhook';
      case 'database':
        return '数据库';
      default:
        return '未知';
    }
  };

  const handleDelete = (toolId: string) => {
    setToolToDelete(toolId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (toolToDelete) {
      deleteTool(toolToDelete);
      enqueueSnackbar('工具已删除', { variant: 'success' });
      setDeleteDialogOpen(false);
      setToolToDelete(null);
    }
  };

  const handleToggleStatus = (toolId: string, currentStatus: boolean) => {
    updateTool(toolId, { isActive: !currentStatus });
    enqueueSnackbar(`工具已${!currentStatus ? '启用' : '禁用'}`, { variant: 'info' });
  };

  const stats = {
    total: tools.length,
    active: tools.filter(t => t.isActive).length,
    inactive: tools.filter(t => !t.isActive).length,
    api: tools.filter(t => t.type === 'api').length,
    function: tools.filter(t => t.type === 'function').length,
    webhook: tools.filter(t => t.type === 'webhook').length,
    database: tools.filter(t => t.type === 'database').length,
  };

  return (
    <AppShell title="工具管理">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              工具管理
            </Typography>
            <Typography variant="body2" color="text.secondary">
              管理和配置 AI 代理可用的工具和集成
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            size="large"
          >
            新建工具
          </Button>
        </Box>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                总工具数
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {stats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                已启用
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {stats.inactive}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                已禁用
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {stats.api + stats.function + stats.webhook + stats.database}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                类型分布
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="搜索工具..."
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
            <InputLabel>类型</InputLabel>
            <Select
              value={typeFilter}
              label="类型"
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="all">全部</MenuItem>
              <MenuItem value="api">API</MenuItem>
              <MenuItem value="function">函数</MenuItem>
              <MenuItem value="webhook">Webhook</MenuItem>
              <MenuItem value="database">数据库</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>状态</InputLabel>
            <Select
              value={statusFilter}
              label="状态"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">全部</MenuItem>
              <MenuItem value="active">已启用</MenuItem>
              <MenuItem value="inactive">已禁用</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Tools Grid */}
        <Grid container spacing={3}>
          {filteredTools.map((tool) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={tool.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ color: `${getTypeColor(tool.type)}.main`, mr: 1 }}>
                      {getTypeIcon(tool.type)}
                    </Box>
                    <Typography variant="h6" component="h3" noWrap>
                      {tool.name}
                    </Typography>
                    <Box sx={{ ml: 'auto' }}>
                      {tool.isActive ? (
                        <ActiveIcon color="success" fontSize="small" />
                      ) : (
                        <InactiveIcon color="disabled" fontSize="small" />
                      )}
                    </Box>
                  </Box>
                  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {tool.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip
                      label={getTypeName(tool.type)}
                      color={getTypeColor(tool.type) as any}
                      size="small"
                    />
                    <Chip
                      label={tool.isActive ? '已启用' : '已禁用'}
                      color={tool.isActive ? 'success' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    更新于 {format(new Date(tool.updatedAt), 'yyyy-MM-dd HH:mm')}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Box>
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <TestIcon />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <SettingsIcon />
                    </IconButton>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      color={tool.isActive ? 'warning' : 'success'}
                      onClick={() => handleToggleStatus(tool.id, tool.isActive)}
                    >
                      {tool.isActive ? <InactiveIcon /> : <ActiveIcon />}
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(tool.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredTools.length === 0 && (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <CodeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              没有找到工具
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                ? '尝试调整搜索条件或筛选器'
                : '创建您的第一个工具开始使用'
              }
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              新建工具
            </Button>
          </Card>
        )}

        {/* Create Tool Dialog */}
        <Dialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>新建工具</DialogTitle>
          <DialogContent>
            <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)} sx={{ mb: 3 }}>
              <Tab label="API 工具" />
              <Tab label="函数工具" />
              <Tab label="Webhook" />
              <Tab label="数据库" />
            </Tabs>

            {activeTab === 0 && (
              <Box>
                <TextField
                  fullWidth
                  label="工具名称"
                  placeholder="例如：天气查询 API"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="描述"
                  multiline
                  rows={2}
                  placeholder="描述工具的功能和用途"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="API 端点"
                  placeholder="https://api.example.com/weather"
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>请求方法</InputLabel>
                  <Select label="请求方法" defaultValue="GET">
                    <MenuItem value="GET">GET</MenuItem>
                    <MenuItem value="POST">POST</MenuItem>
                    <MenuItem value="PUT">PUT</MenuItem>
                    <MenuItem value="DELETE">DELETE</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="请求头 (JSON)"
                  multiline
                  rows={3}
                  placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                  sx={{ mb: 2 }}
                />
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <TextField
                  fullWidth
                  label="函数名称"
                  placeholder="例如：calculate"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="描述"
                  multiline
                  rows={2}
                  placeholder="描述函数的功能"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="函数代码"
                  multiline
                  rows={8}
                  placeholder="function calculate(a, b) { return a + b; }"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="参数说明"
                  placeholder="a: number, b: number"
                  sx={{ mb: 2 }}
                />
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <TextField
                  fullWidth
                  label="Webhook 名称"
                  placeholder="例如：用户注册通知"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="描述"
                  multiline
                  rows={2}
                  placeholder="描述 Webhook 的用途"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="回调 URL"
                  placeholder="https://your-domain.com/webhook"
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>触发事件</InputLabel>
                  <Select label="触发事件" defaultValue="all">
                    <MenuItem value="all">所有事件</MenuItem>
                    <MenuItem value="user_created">用户创建</MenuItem>
                    <MenuItem value="message_sent">消息发送</MenuItem>
                    <MenuItem value="agent_updated">代理更新</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}

            {activeTab === 3 && (
              <Box>
                <TextField
                  fullWidth
                  label="数据库连接名称"
                  placeholder="例如：用户数据库"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="描述"
                  multiline
                  rows={2}
                  placeholder="描述数据库的用途"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="连接字符串"
                  placeholder="postgresql://user:password@localhost:5432/dbname"
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>数据库类型</InputLabel>
                  <Select label="数据库类型" defaultValue="postgresql">
                    <MenuItem value="postgresql">PostgreSQL</MenuItem>
                    <MenuItem value="mysql">MySQL</MenuItem>
                    <MenuItem value="mongodb">MongoDB</MenuItem>
                    <MenuItem value="sqlite">SQLite</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}

            <FormControlLabel
              control={<Switch defaultChecked />}
              label="立即启用"
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>取消</Button>
            <Button onClick={() => {
              setCreateDialogOpen(false);
              enqueueSnackbar('工具创建成功', { variant: 'success' });
            }} variant="contained">
              创建
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>确认删除</DialogTitle>
          <DialogContent>
            <Typography>
              确定要删除这个工具吗？此操作无法撤销。
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