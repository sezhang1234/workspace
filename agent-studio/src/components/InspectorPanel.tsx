'use client';

import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { useFlowStore } from '@/store/flowStore';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import CodeIcon from '@mui/icons-material/Code';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BuildIcon from '@mui/icons-material/Build';
import DeleteIcon from '@mui/icons-material/Delete';

export default function InspectorPanel() {
  const nodes = useFlowStore((s) => s.nodes);
  const selectedNodeId = useFlowStore((s) => s.selectedNodeId);
  const updateNodeLabel = useFlowStore((s) => s.updateNodeLabel);
  const [activeAccordion, setActiveAccordion] = useState<string | false>('general');

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId]
  );

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setActiveAccordion(isExpanded ? panel : false);
  };

  const getNodeIcon = (nodeType: string) => {
    switch (nodeType) {
      case 'inputNode':
        return <SettingsIcon />;
      case 'llmNode':
        return <PsychologyIcon />;
      case 'toolNode':
        return <BuildIcon />;
      case 'outputNode':
        return <SettingsIcon />;
      default:
        return <CodeIcon />;
    }
  };

  const getNodeTypeName = (nodeType: string) => {
    switch (nodeType) {
      case 'inputNode':
        return '输入节点';
      case 'llmNode':
        return 'LLM 节点';
      case 'toolNode':
        return '工具节点';
      case 'outputNode':
        return '输出节点';
      default:
        return '自定义节点';
    }
  };

  if (!selectedNode) {
    return (
      <Paper elevation={0} sx={{ height: 'calc(100vh - 64px)', borderRadius: 0, p: 2, width: '100%' }}>
        <Typography variant="subtitle1" gutterBottom>
          属性面板
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            选择一个节点来编辑其属性
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ height: 'calc(100vh - 64px)', borderRadius: 0, p: 2, width: '100%', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1">
          属性面板
        </Typography>
        <IconButton size="small" color="error">
          <DeleteIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {getNodeIcon(selectedNode.type || '')}
        <Typography variant="body2" sx={{ ml: 1 }}>
          {getNodeTypeName(selectedNode.type || '')}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Accordion expanded={activeAccordion === 'general'} onChange={handleAccordionChange('general')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">基本设置</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="节点名称"
              value={String(selectedNode.data?.label ?? '')}
              onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
              size="small"
            />
            <TextField
              label="描述"
              value={String(selectedNode.data?.description ?? '')}
              multiline
              rows={2}
              size="small"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="启用节点"
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {selectedNode.type === 'llmNode' && (
        <Accordion expanded={activeAccordion === 'llm'} onChange={handleAccordionChange('llm')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">LLM 配置</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl size="small">
                <InputLabel>模型</InputLabel>
                <Select value="gpt-4" label="模型">
                  <MenuItem value="gpt-4">GPT-4</MenuItem>
                  <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                  <MenuItem value="claude-3">Claude-3</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="温度"
                type="number"
                value="0.7"
                size="small"
              />
              <TextField
                label="最大令牌数"
                type="number"
                value="2048"
                size="small"
              />
              <TextField
                label="系统提示"
                multiline
                rows={3}
                size="small"
                placeholder="输入系统提示词..."
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {selectedNode.type === 'toolNode' && (
        <Accordion expanded={activeAccordion === 'tool'} onChange={handleAccordionChange('tool')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">工具配置</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl size="small">
                <InputLabel>工具类型</InputLabel>
                <Select value="web-search" label="工具类型">
                  <MenuItem value="web-search">网络搜索</MenuItem>
                  <MenuItem value="calculator">计算器</MenuItem>
                  <MenuItem value="file-reader">文件读取</MenuItem>
                  <MenuItem value="api-call">API 调用</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="工具参数"
                multiline
                rows={3}
                size="small"
                placeholder="输入工具参数..."
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      <Accordion expanded={activeAccordion === 'advanced'} onChange={handleAccordionChange('advanced')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">高级设置</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={<Switch />}
              label="条件执行"
            />
            <FormControlLabel
              control={<Switch />}
              label="错误重试"
            />
            <Typography variant="body2" gutterBottom>
              超时设置 (秒)
            </Typography>
            <Slider
              value={30}
              min={1}
              max={300}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={activeAccordion === 'variables'} onChange={handleAccordionChange('variables')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">变量</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="input" size="small" />
              <Chip label="output" size="small" />
              <Chip label="context" size="small" />
            </Box>
            <Button size="small" variant="outlined">
              添加变量
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
}

