'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Input as InputIcon,
  Output as OutputIcon,
  Psychology as PsychologyIcon,
  Api as ApiIcon,
  Code as CodeIcon,
  DataObject as DataObjectIcon,
  Storage as StorageIcon,
  Webhook as WebhookIcon,
  Functions as FunctionsIcon,
  Cloud as CloudIcon,
  Memory as MemoryIcon,
  Loop as LoopIcon,
  Merge as MergeIcon,
  Split as SplitIcon,
  Filter as FilterIcon,
  Transform as TransformIcon,
  Validation as ValidationIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

interface NodeType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  color: string;
}

const nodeTypes: NodeType[] = [
  // Input/Output
  {
    id: 'inputNode',
    name: '输入',
    description: '接收用户输入或外部数据',
    icon: <InputIcon />,
    category: '输入输出',
    color: '#4CAF50',
  },
  {
    id: 'outputNode',
    name: '输出',
    description: '返回处理结果',
    icon: <OutputIcon />,
    category: '输入输出',
    color: '#2196F3',
  },

  // AI/LLM
  {
    id: 'llmNode',
    name: 'LLM',
    description: '大语言模型处理',
    icon: <PsychologyIcon />,
    category: 'AI 处理',
    color: '#9C27B0',
  },
  {
    id: 'embeddingNode',
    name: '向量化',
    description: '文本向量化处理',
    icon: <MemoryIcon />,
    category: 'AI 处理',
    color: '#FF9800',
  },
  {
    id: 'ragNode',
    name: 'RAG',
    description: '检索增强生成',
    icon: <DataObjectIcon />,
    category: 'AI 处理',
    color: '#E91E63',
  },

  // Tools
  {
    id: 'toolNode',
    name: '工具',
    description: 'API 调用或函数执行',
    icon: <ApiIcon />,
    category: '工具集成',
    color: '#607D8B',
  },
  {
    id: 'webhookNode',
    name: 'Webhook',
    description: 'HTTP 请求处理',
    icon: <WebhookIcon />,
    category: '工具集成',
    color: '#795548',
  },
  {
    id: 'functionNode',
    name: '函数',
    description: '自定义函数执行',
    icon: <FunctionsIcon />,
    category: '工具集成',
    color: '#3F51B5',
  },
  {
    id: 'databaseNode',
    name: '数据库',
    description: '数据库操作',
    icon: <StorageIcon />,
    category: '工具集成',
    color: '#009688',
  },

  // Control Flow
  {
    id: 'ifNode',
    name: '条件',
    description: '条件分支处理',
    icon: <CodeIcon />,
    category: '控制流',
    color: '#FF5722',
  },
  {
    id: 'loopNode',
    name: '循环',
    description: '循环处理数据',
    icon: <LoopIcon />,
    category: '控制流',
    color: '#673AB7',
  },
  {
    id: 'mergeNode',
    name: '合并',
    description: '合并多个数据流',
    icon: <MergeIcon />,
    category: '控制流',
    color: '#00BCD4',
  },
  {
    id: 'splitNode',
    name: '分割',
    description: '分割数据流',
    icon: <SplitIcon />,
    category: '控制流',
    color: '#8BC34A',
  },

  // Data Processing
  {
    id: 'filterNode',
    name: '过滤',
    description: '数据过滤处理',
    icon: <FilterIcon />,
    category: '数据处理',
    color: '#FFC107',
  },
  {
    id: 'transformNode',
    name: '转换',
    description: '数据格式转换',
    icon: <TransformIcon />,
    category: '数据处理',
    color: '#9E9E9E',
  },
  {
    id: 'validationNode',
    name: '验证',
    description: '数据验证检查',
    icon: <ValidationIcon />,
    category: '数据处理',
    color: '#4CAF50',
  },

  // External Services
  {
    id: 'cloudNode',
    name: '云服务',
    description: '云平台服务调用',
    icon: <CloudIcon />,
    category: '外部服务',
    color: '#03A9F4',
  },
  {
    id: 'errorNode',
    name: '错误处理',
    description: '错误捕获和处理',
    icon: <ErrorIcon />,
    category: '外部服务',
    color: '#F44336',
  },
];

const categories = [
  '输入输出',
  'AI 处理',
  '工具集成',
  '控制流',
  '数据处理',
  '外部服务',
];

export default function NodePalette() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(categories);

  const filteredNodeTypes = nodeTypes.filter((nodeType) =>
    nodeType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nodeType.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nodeType.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedNodeTypes = categories.reduce((acc, category) => {
    acc[category] = filteredNodeTypes.filter((nodeType) => nodeType.category === category);
    return acc;
  }, {} as Record<string, NodeType[]>);

  const handleCategoryToggle = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType.id);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: 1,
        borderColor: 'divider',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          节点库
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="搜索节点..."
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

      {/* Node Types */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {categories.map((category) => {
          const categoryNodes = groupedNodeTypes[category];
          if (categoryNodes.length === 0) return null;

          return (
            <Accordion
              key={category}
              expanded={expandedCategories.includes(category)}
              onChange={() => handleCategoryToggle(category)}
              disableGutters
              sx={{
                '&:before': { display: 'none' },
                boxShadow: 'none',
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  minHeight: 48,
                  '& .MuiAccordionSummary-content': {
                    margin: 0,
                  },
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {category}
                </Typography>
                <Chip
                  label={categoryNodes.length}
                  size="small"
                  sx={{ ml: 'auto', mr: 1 }}
                />
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List dense>
                  {categoryNodes.map((nodeType) => (
                    <ListItem
                      key={nodeType.id}
                      disablePadding
                      draggable
                      onDragStart={(e) => handleDragStart(e, nodeType)}
                      sx={{
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemButton
                        sx={{
                          py: 1,
                          px: 2,
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 36,
                            color: nodeType.color,
                          }}
                        >
                          {nodeType.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={nodeType.name}
                          secondary={nodeType.description}
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontWeight: 500,
                          }}
                          secondaryTypographyProps={{
                            variant: 'caption',
                            sx: {
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            },
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          );
        })}

        {filteredNodeTypes.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              没有找到匹配的节点
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          拖拽节点到画布中开始构建
        </Typography>
      </Box>
    </Paper>
  );
}

