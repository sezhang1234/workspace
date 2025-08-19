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
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AppShell from '@/components/layout/AppShell';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import WebIcon from '@mui/icons-material/Web';
import CalculateIcon from '@mui/icons-material/Calculate';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ApiIcon from '@mui/icons-material/Api';
import StorageIcon from '@mui/icons-material/Storage';
import CodeIcon from '@mui/icons-material/Code';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloudIcon from '@mui/icons-material/Cloud';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';

// Mock data for tools
const mockTools = [
  {
    id: '1',
    name: '网络搜索',
    type: 'web-search',
    description: '搜索网络信息',
    icon: <WebIcon />,
    status: 'connected',
    enabled: true,
    config: { apiKey: '***', maxResults: 10 },
  },
  {
    id: '2',
    name: '计算器',
    type: 'calculator',
    description: '数学计算和公式',
    icon: <CalculateIcon />,
    status: 'connected',
    enabled: true,
    config: { precision: 2 },
  },
  {
    id: '3',
    name: '文件操作',
    type: 'file',
    description: '读取和处理文件',
    icon: <FileCopyIcon />,
    status: 'connected',
    enabled: false,
    config: { allowedTypes: ['txt', 'pdf', 'csv'] },
  },
  {
    id: '4',
    name: 'API 调用',
    type: 'api',
    description: '调用外部 API',
    icon: <ApiIcon />,
    status: 'error',
    enabled: false,
    config: { baseUrl: 'https://api.example.com' },
  },
  {
    id: '5',
    name: '数据库',
    type: 'database',
    description: '数据库操作',
    icon: <StorageIcon />,
    status: 'warning',
    enabled: true,
    config: { connectionString: '***' },
  },
  {
    id: '6',
    name: '代码执行',
    type: 'code',
    description: '执行自定义代码',
    icon: <CodeIcon />,
    status: 'connected',
    enabled: true,
    config: { timeout: 30 },
  },
  {
    id: '7',
    name: '邮件发送',
    type: 'email',
    description: '发送邮件通知',
    icon: <EmailIcon />,
    status: 'connected',
    enabled: false,
    config: { smtpServer: 'smtp.gmail.com' },
  },
  {
    id: '8',
    name: '日历集成',
    type: 'calendar',
    description: '日历事件管理',
    icon: <CalendarTodayIcon />,
    status: 'connected',
    enabled: true,
    config: { calendarId: 'primary' },
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'connected':
      return <CheckCircleIcon color="success" />;
    case 'error':
      return <ErrorIcon color="error" />;
    case 'warning':
      return <WarningIcon color="warning" />;
    default:
      return <ErrorIcon color="error" />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'connected':
      return '已连接';
    case 'error':
      return '连接错误';
    case 'warning':
      return '需要配置';
    default:
      return '未知';
  }
};

export default function ToolsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<any>(null);

  const handleConfigOpen = (tool: any) => {
    setSelectedTool(tool);
    setConfigDialogOpen(true);
  };

  const handleConfigClose = () => {
    setConfigDialogOpen(false);
    setSelectedTool(null);
  };

  const filteredTools = mockTools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell title="工具">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            工具
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
          >
            添加工具
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
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
          />
        </Box>

        <Grid container spacing={3}>
          {filteredTools.map((tool) => (
            <Grid item xs={12} sm={6} md={4} key={tool.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {tool.icon}
                    <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                      {tool.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getStatusIcon(tool.status)}
                    </Box>
                  </Box>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {tool.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                    <Chip
                      label={tool.type}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={getStatusText(tool.status)}
                      size="small"
                      color={tool.status === 'connected' ? 'success' : tool.status === 'error' ? 'error' : 'warning'}
                    />
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={tool.enabled}
                        onChange={() => {}}
                        size="small"
                      />
                    }
                    label="启用"
                  />
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<SettingsIcon />}
                    onClick={() => handleConfigOpen(tool)}
                  >
                    配置
                  </Button>
                  <Button size="small" startIcon={<CloudIcon />}>
                    测试
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={configDialogOpen} onClose={handleConfigClose} maxWidth="md" fullWidth>
          <DialogTitle>
            配置工具 - {selectedTool?.name}
          </DialogTitle>
          <DialogContent>
            {selectedTool && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField
                  fullWidth
                  label="工具名称"
                  defaultValue={selectedTool.name}
                />
                <TextField
                  fullWidth
                  label="描述"
                  multiline
                  rows={2}
                  defaultValue={selectedTool.description}
                />
                <FormControl fullWidth>
                  <InputLabel>状态</InputLabel>
                  <Select label="状态" defaultValue={selectedTool.status}>
                    <MenuItem value="connected">已连接</MenuItem>
                    <MenuItem value="error">连接错误</MenuItem>
                    <MenuItem value="warning">需要配置</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      defaultChecked={selectedTool.enabled}
                    />
                  }
                  label="启用工具"
                />
                {selectedTool.type === 'web-search' && (
                  <>
                    <TextField
                      fullWidth
                      label="API Key"
                      type="password"
                      defaultValue={selectedTool.config.apiKey}
                    />
                    <TextField
                      fullWidth
                      label="最大结果数"
                      type="number"
                      defaultValue={selectedTool.config.maxResults}
                    />
                  </>
                )}
                {selectedTool.type === 'api' && (
                  <>
                    <TextField
                      fullWidth
                      label="基础 URL"
                      defaultValue={selectedTool.config.baseUrl}
                    />
                    <TextField
                      fullWidth
                      label="API Key"
                      type="password"
                    />
                  </>
                )}
                {selectedTool.type === 'database' && (
                  <>
                    <TextField
                      fullWidth
                      label="连接字符串"
                      type="password"
                      defaultValue={selectedTool.config.connectionString}
                    />
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfigClose}>取消</Button>
            <Button variant="contained" onClick={handleConfigClose}>
              保存
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AppShell>
  );
}