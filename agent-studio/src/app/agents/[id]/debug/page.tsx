'use client';

import { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AppShell from '@/components/layout/AppShell';
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

// Mock data for chat messages
const mockMessages = [
  {
    id: '1',
    type: 'user',
    content: '你好，请介绍一下你们的产品',
    timestamp: '2024-01-20 10:30:15',
  },
  {
    id: '2',
    type: 'assistant',
    content: '您好！我们提供智能客服解决方案，包括自动回复、知识库管理、多语言支持等功能。我们的产品可以帮助企业提升客服效率，降低人工成本。',
    timestamp: '2024-01-20 10:30:18',
    executionTime: 2.3,
  },
  {
    id: '3',
    type: 'user',
    content: '价格是多少？',
    timestamp: '2024-01-20 10:30:25',
  },
  {
    id: '4',
    type: 'assistant',
    content: '我们的价格根据使用量和服务级别而定。基础版每月99元起，包含1000次对话。企业版需要定制报价，包含更多高级功能。您可以联系我们的销售团队获取详细报价。',
    timestamp: '2024-01-20 10:30:28',
    executionTime: 1.8,
  },
];

// Mock data for execution logs
const mockLogs = [
  {
    id: '1',
    level: 'info',
    message: 'Agent started',
    timestamp: '2024-01-20 10:30:15',
    details: { sessionId: 'sess_123', userId: 'user_456' },
  },
  {
    id: '2',
    level: 'info',
    message: 'Processing user input',
    timestamp: '2024-01-20 10:30:15',
    details: { input: '你好，请介绍一下你们的产品' },
  },
  {
    id: '3',
    level: 'info',
    message: 'LLM node executed',
    timestamp: '2024-01-20 10:30:16',
    details: { model: 'gpt-4', tokens: 150, cost: 0.003 },
  },
  {
    id: '4',
    level: 'warning',
    message: 'Knowledge base search returned no results',
    timestamp: '2024-01-20 10:30:17',
    details: { query: '产品介绍', reason: 'No matching documents' },
  },
  {
    id: '5',
    level: 'info',
    message: 'Response generated',
    timestamp: '2024-01-20 10:30:18',
    details: { responseLength: 89, executionTime: 2.3 },
  },
];

const getLogIcon = (level: string) => {
  switch (level) {
    case 'info':
      return <InfoIcon color="info" />;
    case 'warning':
      return <WarningIcon color="warning" />;
    case 'error':
      return <ErrorIcon color="error" />;
    case 'success':
      return <CheckCircleIcon color="success" />;
    default:
      return <InfoIcon />;
  }
};

const getLogColor = (level: string) => {
  switch (level) {
    case 'info':
      return 'info';
    case 'warning':
      return 'warning';
    case 'error':
      return 'error';
    case 'success':
      return 'success';
    default:
      return 'default';
  }
};

export default function DebugPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: inputMessage,
      timestamp: new Date().toLocaleString(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant' as const,
        content: '这是一个模拟的回复消息。在实际应用中，这里会显示代理的真实回复。',
        timestamp: new Date().toLocaleString(),
        executionTime: Math.random() * 3 + 1,
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 2000);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AppShell title="调试">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            调试控制台
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearChat}
            >
              清空聊天
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
            >
              导出日志
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">聊天测试</Typography>
              </Box>
              
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                <List>
                  {messages.map((message, index) => (
                    <Box key={message.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar>
                            {message.type === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle2">
                                {message.type === 'user' ? '用户' : '代理'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {message.timestamp}
                              </Typography>
                              {message.executionTime && (
                                <Chip
                                  label={`${message.executionTime.toFixed(1)}s`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              sx={{ whiteSpace: 'pre-wrap' }}
                            >
                              {message.content}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < messages.length - 1 && <Divider variant="inset" component="li" />}
                    </Box>
                  ))}
                  {isProcessing && (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <SmartToyIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="代理正在思考..."
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              icon={<PlayArrowIcon />}
                              label="处理中"
                              size="small"
                              color="info"
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  )}
                </List>
              </Box>

              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="输入消息..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isProcessing}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isProcessing}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="执行日志" />
                  <Tab label="性能" />
                </Tabs>
              </Box>
              
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                {activeTab === 0 && (
                  <List dense>
                    {mockLogs.map((log) => (
                      <ListItem key={log.id}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getLogIcon(log.level)}
                              <Typography variant="body2">
                                {log.message}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {log.timestamp}
                              </Typography>
                              {log.details && (
                                <Accordion sx={{ mt: 1 }}>
                                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="caption">详细信息</Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Typography variant="caption" component="pre" sx={{ fontSize: '0.7rem' }}>
                                      {JSON.stringify(log.details, null, 2)}
                                    </Typography>
                                  </AccordionDetails>
                                </Accordion>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
                
                {activeTab === 1 && (
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      性能指标
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          平均响应时间
                        </Typography>
                        <Typography variant="h4" color="primary">
                          2.1s
                        </Typography>
                      </Paper>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          总对话数
                        </Typography>
                        <Typography variant="h4" color="secondary">
                          1,234
                        </Typography>
                      </Paper>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          成功率
                        </Typography>
                        <Typography variant="h4" color="success.main">
                          98.5%
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AppShell>
  );
}