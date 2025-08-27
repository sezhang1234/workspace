/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { useContext, useState } from 'react';

import { useClientContext, CommandService } from '@flowgram.ai/free-layout-editor';
import { Button } from '@douyinfe/semi-ui';
import { X, ChevronDown, ChevronLeft } from 'lucide-react';

import { toggleLoopExpanded } from '../../utils';
import { FlowCommandId } from '../../shortcuts';
import { useIsSidebar, useNodeRenderContext } from '../../hooks';
import { SidebarContext } from '../../context';
import { NodeMenu } from '../../components/node-menu';
import { getIcon } from './utils';
import { Header, Operators } from './styles';
import { TitleInput } from './title-input';

export function FormHeader() {
  const { node, expanded, toggleExpand, readonly } = useNodeRenderContext();
  const [titleEdit, updateTitleEdit] = useState<boolean>(false);
  const ctx = useClientContext();
  const { setNodeId } = useContext(SidebarContext);
  const isSidebar = useIsSidebar();
  const handleExpand = (e: React.MouseEvent) => {
    toggleExpand();
    // 折叠 loop 子节点
    if (node.flowNodeType === 'loop') {
      toggleLoopExpanded(node);
    }
    e.stopPropagation(); // Disable clicking prevents the sidebar from opening
  };
  const handleDelete = () => {
    ctx.get<CommandService>(CommandService).executeCommand(FlowCommandId.DELETE, [node]);
  };
  const handleClose = () => {
    setNodeId(undefined);
  };

  return (
    <Header>
      {getIcon(node)}
      <TitleInput readonly={readonly} updateTitleEdit={updateTitleEdit} titleEdit={titleEdit} />
      {node.renderData.expandable && !isSidebar && (
        <Button
          type="primary"
          icon={expanded ? <ChevronDown /> : <ChevronLeft />}
          size="small"
          theme="borderless"
          onClick={handleExpand}
        />
      )}
      {readonly ? undefined : (
        <Operators>
          <NodeMenu node={node} deleteNode={handleDelete} updateTitleEdit={updateTitleEdit} />
        </Operators>
      )}
      {isSidebar && (
        <Button
          type="primary"
          icon={<X />}
          size="small"
          theme="borderless"
          onClick={handleClose}
        />
      )}
    </Header>
  );
}
