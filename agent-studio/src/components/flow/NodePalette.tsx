'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import InputIcon from '@mui/icons-material/Input';
import OutputIcon from '@mui/icons-material/Output';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BuildIcon from '@mui/icons-material/Build';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import LoopIcon from '@mui/icons-material/Loop';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import ApiIcon from '@mui/icons-material/Api';
import WebIcon from '@mui/icons-material/Web';
import CalculateIcon from '@mui/icons-material/Calculate';
import FileCopyIcon from '@mui/icons-material/FileCopy';

type PaletteItem = {
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: string;
};

const items: PaletteItem[] = [
  // 基础节点
  { type: 'inputNode', label: '输入', description: '接收用户输入或数据', icon: <InputIcon />, category: '基础' },
  { type: 'outputNode', label: '输出', description: '返回结果给用户', icon: <OutputIcon />, category: '基础' },
  { type: 'llmNode', label: 'LLM', description: '大语言模型处理', icon: <PsychologyIcon />, category: '基础' },
  
  // 逻辑节点
  { type: 'ifNode', label: '条件判断', description: '根据条件分支执行', icon: <CallSplitIcon />, category: '逻辑' },
  { type: 'loopNode', label: '循环', description: '重复执行指定逻辑', icon: <LoopIcon />, category: '逻辑' },
  
  // 工具节点
  { type: 'webSearchNode', label: '网络搜索', description: '搜索网络信息', icon: <WebIcon />, category: '工具' },
  { type: 'calculatorNode', label: '计算器', description: '数学计算和公式', icon: <CalculateIcon />, category: '工具' },
  { type: 'fileReaderNode', label: '文件读取', description: '读取和处理文件', icon: <FileCopyIcon />, category: '工具' },
  { type: 'apiCallNode', label: 'API 调用', description: '调用外部 API', icon: <ApiIcon />, category: '工具' },
  { type: 'databaseNode', label: '数据库', description: '数据库操作', icon: <StorageIcon />, category: '工具' },
  { type: 'codeNode', label: '代码执行', description: '执行自定义代码', icon: <CodeIcon />, category: '工具' },
  { type: 'toolNode', label: '自定义工具', description: '自定义工具节点', icon: <BuildIcon />, category: '工具' },
];

const categories = ['基础', '逻辑', '工具'];

export default function NodePalette() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | false>('基础');

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedCategory(isExpanded ? panel : false);
  };

  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedItems = categories.reduce((acc, category) => {
    acc[category] = filteredItems.filter(item => item.category === category);
    return acc;
  }, {} as Record<string, PaletteItem[]>);

  return (
    <Paper elevation={0} sx={{ height: 'calc(100vh - 64px)', borderRadius: 0, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1" gutterBottom>
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
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {categories.map((category) => {
          const categoryItems = groupedItems[category];
          if (categoryItems.length === 0) return null;
          
          return (
            <Accordion
              key={category}
              expanded={expandedCategory === category}
              onChange={handleAccordionChange(category)}
              sx={{ '&:before': { display: 'none' } }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">{category}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List dense>
                  {categoryItems.map((item, index) => (
                    <Box key={item.type}>
                      <ListItem disablePadding>
                        <ListItemButton
                          draggable
                          onDragStart={(e) => onDragStart(e, item.type)}
                          sx={{ 
                            cursor: 'grab',
                            '&:hover': { backgroundColor: 'action.hover' },
                            '&:active': { cursor: 'grabbing' }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.label}
                            secondary={item.description}
                            primaryTypographyProps={{ variant: 'body2' }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                        </ListItemButton>
                      </ListItem>
                      {index < categoryItems.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Paper>
  );
}

