/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { FunctionComponent } from 'react';

import { SelectorBoxPopoverProps } from '@flowgram.ai/free-layout-editor';
import { WorkflowGroupCommand } from '@flowgram.ai/free-group-plugin';
import { Button, ButtonGroup, Tooltip } from '@douyinfe/semi-ui';
import { Copy, Trash2, Maximize2, Minimize2 } from 'lucide-react';

import { IconGroup } from '../group';
import { FlowCommandId } from '../../shortcuts/constants';

const BUTTON_HEIGHT = 24;

export const SelectorBoxPopover: FunctionComponent<SelectorBoxPopoverProps> = ({
  bounds,
  children,
  commandRegistry,
}) => {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: bounds.right,
          top: bounds.top,
          transform: 'translate(-100%, -100%)',
        }}
        onMouseDown={(_e) => {
          _e.stopPropagation();
        }}
      >
        <ButtonGroup
          size="small"
          style={{ display: 'flex', flexWrap: 'nowrap', height: BUTTON_HEIGHT }}
        >
          <Tooltip content={'折叠'}>
            <Button
              icon={<Minimize2 size={18} className="text-white" />}
              style={{ height: BUTTON_HEIGHT }}
              type="primary"
              theme="solid"
              onMouseDown={() => {
                commandRegistry.executeCommand(FlowCommandId.COLLAPSE);
              }}
            />
          </Tooltip>

          <Tooltip content={'展开'}>
            <Button
              icon={<Maximize2 size={18} className="text-white" />}
              style={{ height: BUTTON_HEIGHT }}
              type="primary"
              theme="solid"
              onMouseDown={() => {
                commandRegistry.executeCommand(FlowCommandId.EXPAND);
              }}
            />
          </Tooltip>

          <Tooltip content={'创建组'}>
            <Button
              icon={<IconGroup size={14} />}
              style={{ height: BUTTON_HEIGHT }}
              type="primary"
              theme="solid"
              onClick={() => {
                commandRegistry.executeCommand(WorkflowGroupCommand.Group);
              }}
            />
          </Tooltip>

          <Tooltip content={'复制'}>
            <Button
              icon={<Copy size={18} className="text-white" />}
              style={{ height: BUTTON_HEIGHT }}
              type="primary"
              theme="solid"
              onClick={() => {
                commandRegistry.executeCommand(FlowCommandId.COPY);
              }}
            />
          </Tooltip>

          <Tooltip content={'删除'}>
            <Button
              type="primary"
              theme="solid"
              icon={<Trash2 size={18} className="text-white" />}
              style={{ height: BUTTON_HEIGHT }}
              onClick={() => {
                commandRegistry.executeCommand(FlowCommandId.DELETE);
              }}
            />
          </Tooltip>
        </ButtonGroup>
      </div>
      <div>{children}</div>
    </>
  );
};
