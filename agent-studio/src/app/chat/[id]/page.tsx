'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Send as SendIcon,
  Clear as ClearIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Refresh as RefreshIcon,
  Message as MessageIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAgentStore } from '@/store/agentStore';
import AppShell from '@/components/layout/AppShell';
import { useSnackbar } from 'notistack';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const { agents, currentConversation, createConversation, addMessage, setCurrentConversation } = useAgentStore();
  const { enqueueSnackbar } = useSnackbar();
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const agent = agents.find(a => a.id === params.id);

  useEffect(() => {
    if (!agent) {
      enqueueSnackbar('代理不存在', { variant: 'error' });
      return;
    }

    // Create a new conversation if none exists
    if (!currentConversation) {
      const newConversation = {
        agentId: params.id,
        messages: [],
        status: 'active' as const,
      };
      createConversation(newConversation);
    }

    // Focus input on mount
    inputRef.current?.focus();
  }, [agent, params.id, currentConversation, createConversation, enqueueSnackbar]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentConversation || !agent) return;

    const userMessage: Omit<Message, 'id' | 'timestamp'> = {
      role: 'user',
      content: inputValue.trim(),
    };

    // Add user message
    addMessage(currentConversation.id, userMessage);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const aiResponse: Omit<Message, 'id' | 'timestamp'> = {
        role: 'assistant',
        content: generateMockResponse(inputValue, agent),
      };

      addMessage(currentConversation.id, aiResponse);
    } catch (error) {
      enqueueSnackbar('发送消息失败', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (input: string, agent: any): string => {
    const responses = [
      `感谢您的消息："${input}"。我是 ${agent.name}，很高兴为您服务。`,
      `我理解您的问题。作为 ${agent.name}，我会尽力帮助您解决这个问题。`,
      `这是一个很好的问题。让我为您详细解释一下...`,
      `根据我的分析，我建议您考虑以下几个方面：\n\n1. 首先...\n2. 其次...\n3. 最后...`,
      `我可以为您提供以下解决方案：\n\n\`\`\`javascript\n// 示例代码\nconst solution = "这是一个示例";\nconsole.log(solution);\n\`\`\``,
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (currentConversation) {
      // Clear messages by creating a new conversation
      const newConversation = {
        agentId: params.id,
        messages: [],
        status: 'active' as const,
      };
      createConversation(newConversation);
      enqueueSnackbar('对话已清空', { variant: 'info' });
    }
  };

  const handleDownloadChat = () => {
    if (!currentConversation?.messages.length) return;

    const chatData = {
      agent: agent?.name,
      timestamp: new Date().toISOString(),
      messages: currentConversation.messages,
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${agent?.name}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    enqueueSnackbar('对话已导出', { variant: 'success' });
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!agent) {
    return (
      <AppShell title="聊天">
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error">
            代理不存在或已被删除
          </Alert>
        </Container>
      </AppShell>
    );
  }

  return (
    <AppShell title={`与 ${agent.name} 对话`}>
      <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Paper elevation={1} sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <BotIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">{agent.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {agent.description}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={agent.status === 'published' ? '已发布' : '草稿'}
                color={agent.status === 'published' ? 'success' : 'warning'}
                size="small"
              />
              <IconButton onClick={() => setShowHistory(true)}>
                <HistoryIcon />
              </IconButton>
              <IconButton onClick={() => setShowSettings(true)}>
                <SettingsIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* Messages */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {currentConversation?.messages.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <BotIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                开始与 {agent.name} 对话
              </Typography>
              <Typography variant="body2" color="text.secondary">
                输入您的消息，我将为您提供帮助
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {currentConversation?.messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1,
                      maxWidth: '70%',
                    }}
                  >
                    {message.role === 'assistant' && (
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        <BotIcon />
                      </Avatar>
                    )}
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: message.role === 'user' ? 'primary.main' : 'grey.50',
                        color: message.role === 'user' ? 'white' : 'text.primary',
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          {message.role === 'user' ? '您' : agent.name}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        '& pre': { 
                          bgcolor: message.role === 'user' ? 'rgba(255,255,255,0.1)' : 'grey.100',
                          borderRadius: 1,
                          p: 1,
                          overflow: 'auto'
                        },
                        '& code': {
                          bgcolor: message.role === 'user' ? 'rgba(255,255,255,0.1)' : 'grey.100',
                          borderRadius: 0.5,
                          px: 0.5,
                        }
                      }}>
                        <ReactMarkdown
                          components={{
                            code({ node, inline, className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={tomorrow}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </Box>
                      <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
                        {formatTimestamp(message.timestamp)}
                      </Typography>
                    </Paper>
                    {message.role === 'user' && (
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.500' }}>
                        <PersonIcon />
                      </Avatar>
                    )}
                  </Box>
                </Box>
              ))}
              {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      <BotIcon />
                    </Avatar>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" color="text.secondary">
                          {agent.name} 正在思考...
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>
          )}
        </Box>

        {/* Input */}
        <Paper elevation={2} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              ref={inputRef}
              fullWidth
              multiline
              maxRows={4}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`与 ${agent.name} 对话...`}
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              color="primary"
              sx={{ p: 1.5 }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>

        {/* Floating Action Buttons */}
        <Box sx={{ position: 'fixed', bottom: 80, right: 20, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Tooltip title="清空对话">
            <Fab size="small" color="secondary" onClick={handleClearChat}>
              <ClearIcon />
            </Fab>
          </Tooltip>
          <Tooltip title="导出对话">
            <Fab size="small" color="primary" onClick={handleDownloadChat}>
              <DownloadIcon />
            </Fab>
          </Tooltip>
        </Box>

        {/* Settings Drawer */}
        <Drawer
          anchor="right"
          open={showSettings}
          onClose={() => setShowSettings(false)}
        >
          <Box sx={{ width: 320, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              对话设置
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              模型: {agent.config.model}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              温度: {agent.config.temperature}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              最大令牌: {agent.config.maxTokens}
            </Typography>
          </Box>
        </Drawer>

        {/* History Drawer */}
        <Drawer
          anchor="left"
          open={showHistory}
          onClose={() => setShowHistory(false)}
        >
          <Box sx={{ width: 320, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              对话历史
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem>
                <ListItemIcon>
                  <MessageIcon />
                </ListItemIcon>
                <ListItemText
                  primary="当前对话"
                  secondary={`${currentConversation?.messages.length || 0} 条消息`}
                />
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </Box>
    </AppShell>
  );
}