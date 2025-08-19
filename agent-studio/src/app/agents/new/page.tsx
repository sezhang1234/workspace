'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AppShell from '@/components/layout/AppShell';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ChatIcon from '@mui/icons-material/Chat';
import WorkIcon from '@mui/icons-material/Work';

const templates = [
  {
    id: 'chatbot',
    name: '聊天机器人',
    description: '创建一个智能对话机器人',
    icon: <ChatIcon />,
    type: 'chatbot',
  },
  {
    id: 'workflow',
    name: '工作流',
    description: '创建自动化工作流程',
    icon: <WorkIcon />,
    type: 'workflow',
  },
  {
    id: 'custom',
    name: '自定义',
    description: '从零开始创建代理',
    icon: <AutoAwesomeIcon />,
    type: 'custom',
  },
];

export default function NewAgentPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [agentType, setAgentType] = useState('');

  const handleCreateAgent = () => {
    // In a real app, this would create the agent in the backend
    const agentId = Date.now().toString();
    router.push(`/agents/${agentId}`);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setAgentType(template.type);
    }
  };

  return (
    <AppShell title="创建新代理">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="h5" gutterBottom>
          创建新代理
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                基本信息
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="代理名称"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="输入代理名称"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="描述"
                    value={agentDescription}
                    onChange={(e) => setAgentDescription(e.target.value)}
                    placeholder="描述代理的功能和用途"
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>代理类型</InputLabel>
                    <Select
                      value={agentType}
                      label="代理类型"
                      onChange={(e) => setAgentType(e.target.value)}
                    >
                      <MenuItem value="chatbot">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PsychologyIcon sx={{ mr: 1 }} />
                          聊天机器人
                        </Box>
                      </MenuItem>
                      <MenuItem value="workflow">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SmartToyIcon sx={{ mr: 1 }} />
                          工作流
                        </Box>
                      </MenuItem>
                      <MenuItem value="custom">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AutoAwesomeIcon sx={{ mr: 1 }} />
                          自定义
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleCreateAgent}
                disabled={!agentName || !agentType}
                startIcon={<AutoAwesomeIcon />}
              >
                创建代理
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.back()}
              >
                取消
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                选择模板
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    sx={{
                      cursor: 'pointer',
                      border: selectedTemplate === template.id ? 2 : 1,
                      borderColor: selectedTemplate === template.id ? 'primary.main' : 'divider',
                    }}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardContent sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {template.icon}
                        <Typography variant="subtitle1" sx={{ ml: 1 }}>
                          {template.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {template.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AppShell>
  );
}