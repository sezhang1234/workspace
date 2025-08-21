/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import React, { FC } from 'react';

import styled from 'styled-components';
import { NodePanelRenderProps } from '@flowgram.ai/free-node-panel-plugin';
import { useClientContext, WorkflowNodeEntity } from '@flowgram.ai/free-layout-editor';

import { FlowNodeRegistry } from '../../typings';
import { nodeRegistries } from '../../nodes';

// Chinese translations for node types
const nodeTypeTranslations: Record<string, string> = {
  'start': '开始节点',
  'end': '结束节点',
  'llm': '大语言模型',
  'http': 'HTTP 请求',
  'code': '代码执行',
  'variable': '变量操作',
  'condition': '条件判断',
  'loop': '循环控制',
  'block-start': '块开始',
  'block-end': '块结束',
  'comment': '注释',
  'continue': '继续',
  'break': '跳出',
};

const NodeWrap = styled.div`
  width: 100%;
  height: 40px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 19px;
  padding: 0 15px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
  &:hover {
    background-color: hsl(252deg 62% 55% / 9%);
    color: hsl(252 62% 54.9%);
    transform: translateX(2px);
  }
`;

const NodeLabel = styled.div`
  font-size: 13px;
  margin-left: 12px;
  font-weight: 500;
  color: #333;
`;

interface NodeProps {
  label: string;
  icon: JSX.Element;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  disabled: boolean;
}

function Node(props: NodeProps) {
  return (
    <NodeWrap
      data-testid={`demo-free-node-list-${props.label}`}
      onClick={props.disabled ? undefined : props.onClick}
      style={props.disabled ? { opacity: 0.3 } : {}}
    >
      <div style={{ fontSize: 14 }}>{props.icon}</div>
      <NodeLabel>{props.label}</NodeLabel>
    </NodeWrap>
  );
}

const NodesWrap = styled.div`
  max-height: 500px;
  overflow: auto;
  padding: 8px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const NodePanelHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 6px 6px 0 0;
  margin: -8px -8px 8px -8px;
`;

interface NodeListProps {
  onSelect: NodePanelRenderProps['onSelect'];
  containerNode?: WorkflowNodeEntity;
}

export const NodeList: FC<NodeListProps> = (props) => {
  const { onSelect, containerNode } = props;
  const context = useClientContext();
  const handleClick = (e: React.MouseEvent, registry: FlowNodeRegistry) => {
    const json = registry.onAdd?.(context);
    onSelect({
      nodeType: registry.type as string,
      selectEvent: e,
      nodeJSON: json,
    });
  };
  return (
    <NodesWrap style={{ width: 320 }}>
      <NodePanelHeader>选择节点类型</NodePanelHeader>
      {nodeRegistries
        .filter((register) => register.meta.nodePanelVisible !== false)
        .filter((register) => {
          if (register.meta.onlyInContainer) {
            return register.meta.onlyInContainer === containerNode?.flowNodeType;
          }
          return true;
        })
        .map((registry) => (
          <Node
            key={registry.type}
            disabled={!(registry.canAdd?.(context) ?? true)}
            icon={
              <img style={{ width: 16, height: 16, borderRadius: 4 }} src={registry.info?.icon} />
            }
            label={nodeTypeTranslations[registry.type] || registry.type}
            onClick={(e) => handleClick(e, registry)}
          />
        ))}
    </NodesWrap>
  );
};
