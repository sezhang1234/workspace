/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { useState, useEffect } from 'react';

import { useRefresh } from '@flowgram.ai/free-layout-editor';
import { useClientContext } from '@flowgram.ai/free-layout-editor';
import { Tooltip, IconButton, Divider, Button, Select } from '@douyinfe/semi-ui';
import { IconUndo, IconRedo, IconArrowLeft } from '@douyinfe/semi-icons';

import { TestRunButton } from '../testrun/testrun-button';
import { AddNode } from '../add-node';
import { ZoomSelect } from './zoom-select';
import { SwitchLine } from './switch-line';
import { ToolContainer, ToolSection } from './styles';
import { Readonly } from './readonly';
import { MinimapSwitch } from './minimap-switch';
import { Minimap } from './minimap';

import { FitView } from './fit-view';
import { Comment } from './comment';
import { AutoLayout } from './auto-layout';
import { WorkflowOperations } from './workflow-operations';

interface DemoToolsProps {
  minimapVisible: boolean;
  setMinimapVisible: (visible: boolean) => void;
}

export function DemoTools({ minimapVisible, setMinimapVisible }: DemoToolsProps) {
  const { history, playground } = useClientContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  useEffect(() => {
    const disposable = history.undoRedoService.onChange(() => {
      setCanUndo(history.canUndo());
      setCanRedo(history.canRedo());
    });
    return () => disposable.dispose();
  }, [history]);
  const refresh = useRefresh();

  useEffect(() => {
    const disposable = playground.config.onReadonlyOrDisabledChange(() => refresh());
    return () => disposable.dispose();
  }, [playground]);

  const handleBack = () => {
    if (window.confirm('确定要离开吗？未保存的更改将会丢失。')) {
      // Navigate back to workflows list
      window.history.back();
    }
  };

  return (
    <>
      {/* Minimap positioned at bottom left corner of the workflow canvas */}
      <div style={{
        position: 'fixed',
        top: '83%',
        left: '15%',
        transform: 'translateX(-50%)',
        zIndex: 9999
      }}>
        <Minimap visible={minimapVisible} />
      </div>

      {/* Left Control Panel */}
      <ToolContainer className="demo-free-layout-tools" style={{ left: 'calc(50% - 200px)' }}>
        <ToolSection>
          <AutoLayout />
          <SwitchLine />
          <ZoomSelect />
          <FitView />
          <MinimapSwitch minimapVisible={minimapVisible} setMinimapVisible={setMinimapVisible} />
          <Readonly />
          <Comment />
          <WorkflowOperations />
          <Tooltip content="撤销">
            <IconButton
              type="tertiary"
              theme="borderless"
              icon={<IconUndo />}
              disabled={!canUndo || playground.config.readonly}
              onClick={() => history.undo()}
            />
          </Tooltip>
          <Tooltip content="重做">
            <IconButton
              type="tertiary"
              theme="borderless"
              icon={<IconRedo />}
              disabled={!canRedo || playground.config.readonly}
              onClick={() => history.redo()}
            />
          </Tooltip>
          <Divider layout="vertical" style={{ height: '16px' }} margin={3} />
          <AddNode disabled={playground.config.readonly} />
          <TestRunButton disabled={playground.config.readonly} />
          <Button
            type="tertiary"
            theme="borderless"
            icon={<IconArrowLeft />}
            onClick={handleBack}
            style={{ 
              color: '#3B82F6', // Eye-catching blue color
              fontWeight: '500'
            }}
          >
            返回
          </Button>
        </ToolSection>
      </ToolContainer>

      {/* Right Control Panel - Workflow Navigation */}
      <ToolContainer className="demo-free-layout-tools" style={{ left: 'calc(50% + 200px)' }}>
        <ToolSection>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '0 8px'
          }}>
            <span style={{ 
              fontSize: '12px', 
              color: '#666',
              fontFamily: 'Inter, system-ui, sans-serif',
              whiteSpace: 'nowrap'
            }}>
              工作流切换
            </span>
            <Select
              defaultValue="current"
              style={{ width: '120px' }}
              size="small"
            >
              <Select.Option value="current">当前工作流</Select.Option>
              <Select.Option value="workflow1">工作流 1</Select.Option>
              <Select.Option value="workflow2">工作流 2</Select.Option>
              <Select.Option value="workflow3">工作流 3</Select.Option>
            </Select>
          </div>
        </ToolSection>
      </ToolContainer>
    </>
  );
}
