'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
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

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'inputNode':
      return <InputIcon fontSize="small" />;
    case 'outputNode':
      return <OutputIcon fontSize="small" />;
    case 'llmNode':
      return <PsychologyIcon fontSize="small" />;
    case 'toolNode':
      return <BuildIcon fontSize="small" />;
    case 'ifNode':
      return <CallSplitIcon fontSize="small" />;
    case 'loopNode':
      return <LoopIcon fontSize="small" />;
    case 'webSearchNode':
      return <WebIcon fontSize="small" />;
    case 'calculatorNode':
      return <CalculateIcon fontSize="small" />;
    case 'fileReaderNode':
      return <FileCopyIcon fontSize="small" />;
    case 'apiCallNode':
      return <ApiIcon fontSize="small" />;
    case 'databaseNode':
      return <StorageIcon fontSize="small" />;
    case 'codeNode':
      return <CodeIcon fontSize="small" />;
    default:
      return <BuildIcon fontSize="small" />;
  }
};

const getNodeColor = (type: string) => {
  switch (type) {
    case 'inputNode':
    case 'outputNode':
      return '#e3f2fd';
    case 'llmNode':
      return '#f3e5f5';
    case 'ifNode':
    case 'loopNode':
      return '#fff3e0';
    case 'toolNode':
    case 'webSearchNode':
    case 'calculatorNode':
    case 'fileReaderNode':
    case 'apiCallNode':
    case 'databaseNode':
    case 'codeNode':
      return '#e8f5e8';
    default:
      return '#f5f5f5';
  }
};

function BaseNode({ 
  label, 
  hasSource = true, 
  hasTarget = true, 
  nodeType = '',
  description = ''
}: { 
  label: string; 
  hasSource?: boolean; 
  hasTarget?: boolean;
  nodeType?: string;
  description?: string;
}) {
  return (
    <Paper 
      sx={{ 
        p: 1.5, 
        minWidth: 140, 
        backgroundColor: getNodeColor(nodeType),
        border: '1px solid #e0e0e0',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: 1,
        }
      }}
    >
      {hasTarget && <Handle type="target" position={Position.Left} />}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {getNodeIcon(nodeType)}
        <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 500 }}>
          {label}
        </Typography>
      </Box>
      {description && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          {description}
        </Typography>
      )}
      <Chip 
        label={nodeType.replace('Node', '')} 
        size="small" 
        variant="outlined"
        sx={{ fontSize: '0.7rem' }}
      />
      {hasSource && <Handle type="source" position={Position.Right} />}
    </Paper>
  );
}

export const InputNode = memo((props: NodeProps) => (
  <BaseNode 
    label={String(props.data?.label ?? '输入')} 
    hasTarget={false}
    nodeType="inputNode"
    description={props.data?.description}
  />
));

export const OutputNode = memo((props: NodeProps) => (
  <BaseNode 
    label={String(props.data?.label ?? '输出')} 
    hasSource={false}
    nodeType="outputNode"
    description={props.data?.description}
  />
));

export const LLMNode = memo((props: NodeProps) => (
  <BaseNode 
    label={String(props.data?.label ?? 'LLM')}
    nodeType="llmNode"
    description={props.data?.description}
  />
));

export const ToolNode = memo((props: NodeProps) => (
  <BaseNode 
    label={String(props.data?.label ?? '工具')}
    nodeType="toolNode"
    description={props.data?.description}
  />
));

export const IfNode = memo((props: NodeProps) => (
  <BaseNode 
    label={String(props.data?.label ?? '条件判断')}
    nodeType="ifNode"
    description={props.data?.description}
  />
));

export const LoopNode = memo((props: NodeProps) => (
  <BaseNode 
    label={String(props.data?.label ?? '循环')}
    nodeType="loopNode"
    description={props.data?.description}
  />
));

export const WebSearchNode = memo((props: NodeProps) => (
  <BaseNode 
    label={String(props.data?.label ?? '网络搜索')}
    nodeType="webSearchNode"
    description={props.data?.description}
  />
));

export const CalculatorNode = memo((props: NodeProps) => (
  <BaseNode 
    label={String(props.data?.label ?? '计算器')}
    nodeType="calculatorNode"
    description={props.data?.description}
  />
));

export const FileReaderNode = memo((props: NodeProps) => (
  <BaseNode 
    label={String(props.data?.label ?? '文件读取')}
    nodeType="fileReaderNode"
    description={props.data?.description}
  />
));

export const ApiCallNode = memo((props: NodeProps) => (
  <BaseNode 
    label={String(props.data?.label ?? 'API 调用')}
    nodeType="apiCallNode"
    description={props.data?.description}
  />
));

export const DatabaseNode = memo((props: NodeProps) => (
  <BaseNode 
    label={String(props.data?.label ?? '数据库')}
    nodeType="databaseNode"
    description={props.data?.description}
  />
));

export const CodeNode = memo((props: NodeProps) => (
  <BaseNode 
    label={String(props.data?.label ?? '代码执行')}
    nodeType="codeNode"
    description={props.data?.description}
  />
));

InputNode.displayName = 'InputNode';
OutputNode.displayName = 'OutputNode';
LLMNode.displayName = 'LLMNode';
ToolNode.displayName = 'ToolNode';
IfNode.displayName = 'IfNode';
LoopNode.displayName = 'LoopNode';
WebSearchNode.displayName = 'WebSearchNode';
CalculatorNode.displayName = 'CalculatorNode';
FileReaderNode.displayName = 'FileReaderNode';
ApiCallNode.displayName = 'ApiCallNode';
DatabaseNode.displayName = 'DatabaseNode';
CodeNode.displayName = 'CodeNode';

export const nodeTypes = {
  inputNode: InputNode,
  outputNode: OutputNode,
  llmNode: LLMNode,
  toolNode: ToolNode,
  ifNode: IfNode,
  loopNode: LoopNode,
  webSearchNode: WebSearchNode,
  calculatorNode: CalculatorNode,
  fileReaderNode: FileReaderNode,
  apiCallNode: ApiCallNode,
  databaseNode: DatabaseNode,
  codeNode: CodeNode,
};

