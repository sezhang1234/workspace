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
import Chip from '@mui/material/Chip';
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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import AppShell from '@/components/layout/AppShell';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';

// Mock data for deployments
const mockDeployments = [
  {
    id: '1',
    name: '生产环境',
    environment: 'production',
    status: 'running',
    version: 'v1.2.0',
    url: 'https://agent-prod.example.com',
    createdAt: '2024-01-15',
    lastDeployed: '2024-01-20',
    traffic: 85,
    health: 'healthy',
  },
  {
    id: '2',
    name: '测试环境',
    environment: 'staging',
    status: 'running',
    version: 'v1.2.1',
    url: 'https://agent-staging.example.com',
    createdAt: '2024-01-10',
    lastDeployed: '2024-01-19',
    traffic: 15,
    health: 'warning',
  },
  {
    id: '3',
    name: '开发环境',
    environment: 'development',
    status: 'stopped',
    version: 'v1.2.1',
    url: 'https://agent-dev.example.com',
    createdAt: '2024-01-05',
    lastDeployed: '2024-01-18',
    traffic: 0,
    health: 'stopped',
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'running':
      return <CheckCircleIcon color="success" />;
    case 'stopped':
      return <StopIcon color="error" />;
    case 'deploying':
      return <CloudUploadIcon color="info" />;
    default:
      return <InfoIcon />;
  }
};

const getHealthIcon = (health: string) => {
  switch (health) {
    case 'healthy':
      return <CheckCircleIcon color="success" />;
    case 'warning':
      return <WarningIcon color="warning" />;
    case 'error':
      return <ErrorIcon color="error" />;
    case 'stopped':
      return <StopIcon color="disabled" />;
    default:
      return <InfoIcon />;
  }
};

const getEnvironmentColor = (environment: string) => {
  switch (environment) {
    case 'production':
      return 'error';
    case 'staging':
      return 'warning';
    case 'development':
      return 'info';
    default:
      return 'default';
  }
};

export default function PublishPage() {
  const [deployDialogOpen, setDeployDialogOpen] = useState(false);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedDeployment, setSelectedDeployment] = useState<any>(null);

  const handleDeploy = () => {
    setDeployDialogOpen(true);
  };

  const handleConfig = (deployment: any) => {
    setSelectedDeployment(deployment);
    setConfigDialogOpen(true);
  };

  const handleCloseDialogs = () => {
    setDeployDialogOpen(false);
    setConfigDialogOpen(false);
    setSelectedDeployment(null);
  };

  return (
    <AppShell title="发布">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            发布管理
          </Typography>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={handleDeploy}
          >
            部署新版本
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                部署环境
              </Typography>
              <Grid container spacing={2}>
                {mockDeployments.map((deployment) => (
                  <Grid item xs={12} key={deployment.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          {getStatusIcon(deployment.status)}
                          <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                            {deployment.name}
                          </Typography>
                          <Chip
                            label={deployment.environment}
                            color={getEnvironmentColor(deployment.environment) as any}
                            size="small"
                          />
                        </Box>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              版本
                            </Typography>
                            <Typography variant="body1">
                              {deployment.version}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              状态
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getHealthIcon(deployment.health)}
                              <Typography variant="body1">
                                {deployment.health === 'healthy' ? '健康' : 
                                 deployment.health === 'warning' ? '警告' : 
                                 deployment.health === 'error' ? '错误' : '已停止'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              流量分配
                            </Typography>
                            <Typography variant="body1">
                              {deployment.traffic}%
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              最后部署
                            </Typography>
                            <Typography variant="body1">
                              {deployment.lastDeployed}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            访问地址
                          </Typography>
                          <Typography variant="body2" fontFamily="monospace">
                            {deployment.url}
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          startIcon={<SettingsIcon />}
                          onClick={() => handleConfig(deployment)}
                        >
                          配置
                        </Button>
                        {deployment.status === 'running' ? (
                          <Button
                            size="small"
                            startIcon={<StopIcon />}
                            color="error"
                          >
                            停止
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            startIcon={<PlayArrowIcon />}
                            color="success"
                          >
                            启动
                          </Button>
                        )}
                        <Button
                          size="small"
                          startIcon={<RefreshIcon />}
                        >
                          重启
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                发布配置
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PublicIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="公开访问"
                    secondary="允许外部用户访问"
                  />
                  <Switch defaultChecked />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <LockIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="身份验证"
                    secondary="需要用户登录"
                  />
                  <Switch />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <CodeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="API 访问"
                    secondary="提供 API 接口"
                  />
                  <Switch defaultChecked />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="数据持久化"
                    secondary="保存对话历史"
                  />
                  <Switch defaultChecked />
                </ListItem>
              </List>
            </Paper>

            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                版本历史
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="v1.2.1"
                    secondary="2024-01-20 - 修复了响应延迟问题"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="v1.2.0"
                    secondary="2024-01-15 - 添加了新的工具节点"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="v1.1.0"
                    secondary="2024-01-10 - 优化了知识库搜索"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        <Dialog open={deployDialogOpen} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
          <DialogTitle>部署新版本</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>目标环境</InputLabel>
                <Select label="目标环境" defaultValue="staging">
                  <MenuItem value="development">开发环境</MenuItem>
                  <MenuItem value="staging">测试环境</MenuItem>
                  <MenuItem value="production">生产环境</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="版本号"
                placeholder="例如: v1.2.2"
              />
              <TextField
                fullWidth
                label="发布说明"
                multiline
                rows={3}
                placeholder="描述本次发布的变更..."
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="自动健康检查"
              />
              <FormControlLabel
                control={<Switch />}
                label="蓝绿部署"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>取消</Button>
            <Button variant="contained" onClick={handleCloseDialogs}>
              开始部署
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={configDialogOpen} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
          <DialogTitle>
            配置部署 - {selectedDeployment?.name}
          </DialogTitle>
          <DialogContent>
            {selectedDeployment && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField
                  fullWidth
                  label="部署名称"
                  defaultValue={selectedDeployment.name}
                />
                <TextField
                  fullWidth
                  label="访问 URL"
                  defaultValue={selectedDeployment.url}
                />
                <FormControl fullWidth>
                  <InputLabel>环境</InputLabel>
                  <Select label="环境" defaultValue={selectedDeployment.environment}>
                    <MenuItem value="development">开发环境</MenuItem>
                    <MenuItem value="staging">测试环境</MenuItem>
                    <MenuItem value="production">生产环境</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="流量分配 (%)"
                  type="number"
                  defaultValue={selectedDeployment.traffic}
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="启用自动扩缩容"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="启用监控告警"
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>取消</Button>
            <Button variant="contained" onClick={handleCloseDialogs}>
              保存配置
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AppShell>
  );
}