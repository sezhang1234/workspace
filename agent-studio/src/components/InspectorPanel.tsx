'use client';

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  Code as CodeIcon,
  DataObject as DataObjectIcon,
  Psychology as PsychologyIcon,
  Api as ApiIcon,
} from '@mui/icons-material';
import { useFlowStore } from '@/store/flowStore';
import { useAgentStore } from '@/store/agentStore';

export default function InspectorPanel() {
  const selectedNodeId = useFlowStore((s) => s.selectedNodeId);
  const nodes = useFlowStore((s) => s.nodes);
  const updateNodeLabel = useFlowStore((s) => s.updateNodeLabel);
  const { currentAgent } = useAgentStore();

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <Paper
        elevation={0}
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderLeft: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
          <SettingsIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" gutterBottom>
            选择节点
          </Typography>
          <Typography variant="body2">
            点击画布中的节点来查看和编辑其属性
          </Typography>
        </Box>
      </Paper>
    );
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'inputNode':
        return <DataObjectIcon />;
      case 'llmNode':
        return <PsychologyIcon />;
      case 'toolNode':
        return <ApiIcon />;
      case 'outputNode':
        return <DataObjectIcon />;
      case 'ifNode':
        return <CodeIcon />;
      default:
        return <SettingsIcon />;
    }
  };

  const getNodeTypeName = (type: string) => {
    switch (type) {
      case 'inputNode':
        return '输入节点';
      case 'llmNode':
        return 'LLM 节点';
      case 'toolNode':
        return '工具节点';
      case 'outputNode':
        return '输出节点';
      case 'ifNode':
        return '条件节点';
      default:
        return '未知节点';
    }
  };

  const renderNodeProperties = () => {
    switch (selectedNode.type) {
      case 'inputNode':
        return (
          <Box>
            <TextField
              fullWidth
              label="节点名称"
              value={selectedNode.data.label || ''}
              onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="描述"
              multiline
              rows={3}
              value={selectedNode.data.description || ''}
              onChange={(e) => {
                // Update node data
              }}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>输入类型</InputLabel>
              <Select
                value={selectedNode.data.inputType || 'text'}
                label="输入类型"
                onChange={(e) => {
                  // Update node data
                }}
              >
                <MenuItem value="text">文本</MenuItem>
                <MenuItem value="number">数字</MenuItem>
                <MenuItem value="file">文件</MenuItem>
                <MenuItem value="image">图片</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={selectedNode.data.required || false}
                  onChange={(e) => {
                    // Update node data
                  }}
                />
              }
              label="必填"
            />
          </Box>
        );

      case 'llmNode':
        return (
          <Box>
            <TextField
              fullWidth
              label="节点名称"
              value={selectedNode.data.label || ''}
              onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>模型</InputLabel>
              <Select
                value={selectedNode.data.model || 'gpt-3.5-turbo'}
                label="模型"
                onChange={(e) => {
                  // Update node data
                }}
              >
                <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                <MenuItem value="gpt-4">GPT-4</MenuItem>
                <MenuItem value="gpt-4-turbo">GPT-4 Turbo</MenuItem>
                <MenuItem value="claude-3">Claude 3</MenuItem>
              </Select>
            </FormControl>
            <Typography gutterBottom>温度</Typography>
            <Slider
              value={selectedNode.data.temperature || 0.7}
              onChange={(_, value) => {
                // Update node data
              }}
              min={0}
              max={2}
              step={0.1}
              marks={[
                { value: 0, label: '0' },
                { value: 1, label: '1' },
                { value: 2, label: '2' },
              ]}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="最大令牌数"
              type="number"
              value={selectedNode.data.maxTokens || 1000}
              onChange={(e) => {
                // Update node data
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="系统提示"
              multiline
              rows={4}
              value={selectedNode.data.systemPrompt || ''}
              onChange={(e) => {
                // Update node data
              }}
              sx={{ mb: 2 }}
            />
          </Box>
        );

      case 'toolNode':
        return (
          <Box>
            <TextField
              fullWidth
              label="节点名称"
              value={selectedNode.data.label || ''}
              onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>工具类型</InputLabel>
              <Select
                value={selectedNode.data.toolType || 'api'}
                label="工具类型"
                onChange={(e) => {
                  // Update node data
                }}
              >
                <MenuItem value="api">API 调用</MenuItem>
                <MenuItem value="function">函数</MenuItem>
                <MenuItem value="webhook">Webhook</MenuItem>
                <MenuItem value="database">数据库</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="端点 URL"
              value={selectedNode.data.endpoint || ''}
              onChange={(e) => {
                // Update node data
              }}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>请求方法</InputLabel>
              <Select
                value={selectedNode.data.method || 'GET'}
                label="请求方法"
                onChange={(e) => {
                  // Update node data
                }}
              >
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
              value={selectedNode.data.headers || '{}'}
              onChange={(e) => {
                // Update node data
              }}
              sx={{ mb: 2 }}
            />
          </Box>
        );

      case 'outputNode':
        return (
          <Box>
            <TextField
              fullWidth
              label="节点名称"
              value={selectedNode.data.label || ''}
              onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>输出格式</InputLabel>
              <Select
                value={selectedNode.data.outputFormat || 'text'}
                label="输出格式"
                onChange={(e) => {
                  // Update node data
                }}
              >
                <MenuItem value="text">文本</MenuItem>
                <MenuItem value="json">JSON</MenuItem>
                <MenuItem value="html">HTML</MenuItem>
                <MenuItem value="markdown">Markdown</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="输出模板"
              multiline
              rows={4}
              value={selectedNode.data.template || ''}
              onChange={(e) => {
                // Update node data
              }}
              sx={{ mb: 2 }}
            />
          </Box>
        );

      case 'ifNode':
        return (
          <Box>
            <TextField
              fullWidth
              label="节点名称"
              value={selectedNode.data.label || ''}
              onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="条件表达式"
              multiline
              rows={3}
              value={selectedNode.data.condition || ''}
              onChange={(e) => {
                // Update node data
              }}
              sx={{ mb: 2 }}
            />
            <Typography variant="caption" color="text.secondary">
              使用 JavaScript 表达式，例如: input.length > 0
            </Typography>
          </Box>
        );

      default:
        return (
          <Box>
            <TextField
              fullWidth
              label="节点名称"
              value={selectedNode.data.label || ''}
              onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>
        );
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        overflow: 'auto',
        borderLeft: 1,
        borderColor: 'divider',
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {getNodeIcon(selectedNode.type)}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {getNodeTypeName(selectedNode.type)}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          ID: {selectedNode.id}
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">基本属性</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderNodeProperties()}
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">高级设置</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedNode.data.enabled !== false}
                    onChange={(e) => {
                      // Update node data
                    }}
                  />
                }
                label="启用节点"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="错误处理"
                multiline
                rows={2}
                value={selectedNode.data.errorHandler || ''}
                onChange={(e) => {
                  // Update node data
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="超时时间 (秒)"
                type="number"
                value={selectedNode.data.timeout || 30}
                onChange={(e) => {
                  // Update node data
                }}
                sx={{ mb: 2 }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">元数据</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <TextField
                fullWidth
                label="标签"
                value={selectedNode.data.tags?.join(', ') || ''}
                onChange={(e) => {
                  // Update node data
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="描述"
                multiline
                rows={2}
                value={selectedNode.data.description || ''}
                onChange={(e) => {
                  // Update node data
                }}
                sx={{ mb: 2 }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ mt: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={() => {
              // Delete node
            }}
          >
            删除节点
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

