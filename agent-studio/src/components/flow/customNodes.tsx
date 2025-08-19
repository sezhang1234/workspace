'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function BaseNode({ label, hasSource = true, hasTarget = true }: { label: string; hasSource?: boolean; hasTarget?: boolean }) {
  return (
    <Paper sx={{ p: 1.5, minWidth: 120, textAlign: 'center' }}>
      {hasTarget && <Handle type="target" position={Position.Left} />}
      <Typography variant="body2">{label}</Typography>
      {hasSource && <Handle type="source" position={Position.Right} />}
    </Paper>
  );
}

export const InputNode = memo((props: NodeProps) => <BaseNode label={String(props.data?.label ?? '输入')} hasTarget={false} />);
export const OutputNode = memo((props: NodeProps) => <BaseNode label={String(props.data?.label ?? '输出')} hasSource={false} />);
export const LLMNode = memo((props: NodeProps) => <BaseNode label={String(props.data?.label ?? 'LLM')}/>);
export const ToolNode = memo((props: NodeProps) => <BaseNode label={String(props.data?.label ?? '工具')}/>);
export const IfNode = memo((props: NodeProps) => <BaseNode label={String(props.data?.label ?? '条件')}/>);

InputNode.displayName = 'InputNode';
OutputNode.displayName = 'OutputNode';
LLMNode.displayName = 'LLMNode';
ToolNode.displayName = 'ToolNode';
IfNode.displayName = 'IfNode';

export const nodeTypes = {
  inputNode: InputNode,
  outputNode: OutputNode,
  llmNode: LLMNode,
  toolNode: ToolNode,
  ifNode: IfNode,
};

