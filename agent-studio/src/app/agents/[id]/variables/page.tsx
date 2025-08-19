'use client';

import { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AppShell from '@/components/layout/AppShell';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import CodeIcon from '@mui/icons-material/Code';

// Mock data for variables
const mockVariables = {
  environment: [
    {
      id: '1',
      name: 'OPENAI_API_KEY',
      value: 'sk-***',
      type: 'secret',
      description: 'OpenAI API 密钥',
      scope: 'global',
    },
    {
      id: '2',
      name: 'DATABASE_URL',
      value: 'postgresql://***',
      type: 'secret',
      description: '数据库连接字符串',
      scope: 'global',
    },
    {
      id: '3',
      name: 'MAX_TOKENS',
      value: '2048',
      type: 'public',
      description: '最大令牌数',
      scope: 'global',
    },
  ],
  context: [
    {
      id: '4',
      name: 'user_id',
      value: '{{user.id}}',
      type: 'dynamic',
      description: '当前用户ID',
      scope: 'session',
    },
    {
      id: '5',
      name: 'session_id',
      value: '{{session.id}}',
      type: 'dynamic',
      description: '会话ID',
      scope: 'session',
    },
    {
      id: '6',
      name: 'timestamp',
      value: '{{timestamp}}',
      type: 'dynamic',
      description: '当前时间戳',
      scope: 'session',
    },
  ],
  system: [
    {
      id: '7',
      name: 'AGENT_VERSION',
      value: '1.0.0',
      type: 'public',
      description: '代理版本',
      scope: 'system',
    },
    {
      id: '8',
      name: 'DEBUG_MODE',
      value: 'false',
      type: 'public',
      description: '调试模式',
      scope: 'system',
    },
  ],
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'secret':
      return <SecurityIcon fontSize="small" />;
    case 'public':
      return <SettingsIcon fontSize="small" />;
    case 'dynamic':
      return <CodeIcon fontSize="small" />;
    default:
      return <SettingsIcon fontSize="small" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'secret':
      return 'error';
    case 'public':
      return 'primary';
    case 'dynamic':
      return 'warning';
    default:
      return 'default';
  }
};

const getScopeColor = (scope: string) => {
  switch (scope) {
    case 'global':
      return 'success';
    case 'session':
      return 'info';
    case 'system':
      return 'secondary';
    default:
      return 'default';
  }
};

export default function VariablesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState<any>(null);
  const [showSecrets, setShowSecrets] = useState(false);

  const tabLabels = ['环境变量', '上下文变量', '系统变量'];
  const tabKeys = ['environment', 'context', 'system'];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddVariable = () => {
    setSelectedVariable(null);
    setAddDialogOpen(true);
  };

  const handleEditVariable = (variable: any) => {
    setSelectedVariable(variable);
    setEditDialogOpen(true);
  };

  const handleCloseDialogs = () => {
    setAddDialogOpen(false);
    setEditDialogOpen(false);
    setSelectedVariable(null);
  };

  const currentVariables = mockVariables[tabKeys[activeTab] as keyof typeof mockVariables];
  const filteredVariables = currentVariables.filter(variable =>
    variable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    variable.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const maskValue = (value: string, type: string) => {
    if (type === 'secret' && !showSecrets) {
      return '*'.repeat(Math.min(value.length, 10));
    }
    return value;
  };

  return (
    <AppShell title="变量">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            变量管理
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={showSecrets ? <VisibilityOffIcon /> : <VisibilityIcon />}
              onClick={() => setShowSecrets(!showSecrets)}
            >
              {showSecrets ? '隐藏' : '显示'}密钥
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddVariable}
            >
              添加变量
            </Button>
          </Box>
        </Box>

        <Paper sx={{ mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            {tabLabels.map((label, index) => (
              <Tab key={index} label={label} />
            ))}
          </Tabs>
        </Paper>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="搜索变量..."
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

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>变量名</TableCell>
                <TableCell>值</TableCell>
                <TableCell>类型</TableCell>
                <TableCell>作用域</TableCell>
                <TableCell>描述</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVariables.map((variable) => (
                <TableRow key={variable.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {variable.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {maskValue(variable.value, variable.type)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getTypeIcon(variable.type)}
                      label={variable.type}
                      size="small"
                      color={getTypeColor(variable.type) as any}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={variable.scope}
                      size="small"
                      color={getScopeColor(variable.scope) as any}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {variable.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditVariable(variable)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={addDialogOpen || editDialogOpen} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editDialogOpen ? '编辑变量' : '添加变量'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                label="变量名"
                defaultValue={selectedVariable?.name}
                placeholder="例如: API_KEY"
              />
              <TextField
                fullWidth
                label="值"
                defaultValue={selectedVariable?.value}
                placeholder="变量值"
                multiline
                rows={2}
              />
              <FormControl fullWidth>
                <InputLabel>类型</InputLabel>
                <Select label="类型" defaultValue={selectedVariable?.type || 'public'}>
                  <MenuItem value="public">公开</MenuItem>
                  <MenuItem value="secret">密钥</MenuItem>
                  <MenuItem value="dynamic">动态</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>作用域</InputLabel>
                <Select label="作用域" defaultValue={selectedVariable?.scope || 'global'}>
                  <MenuItem value="global">全局</MenuItem>
                  <MenuItem value="session">会话</MenuItem>
                  <MenuItem value="system">系统</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="描述"
                defaultValue={selectedVariable?.description}
                placeholder="变量用途描述"
                multiline
                rows={2}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>取消</Button>
            <Button variant="contained" onClick={handleCloseDialogs}>
              {editDialogOpen ? '保存' : '添加'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AppShell>
  );
}