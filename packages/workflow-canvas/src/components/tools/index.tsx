/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { useState, useEffect } from 'react';

import { useRefresh } from '@flowgram.ai/free-layout-editor';
import { useClientContext } from '@flowgram.ai/free-layout-editor';
import { Tooltip, IconButton, Divider, Button, Select } from '@douyinfe/semi-ui';
import { IconUndo, IconRedo, IconArrowLeft } from '@douyinfe/semi-icons';
import { getAllWorkflows, type Workflow } from '../../../src/services/workflowService';

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
  const [currentWorkflowId, setCurrentWorkflowId] = useState('1');
  const workflows = getAllWorkflows();
  const currentWorkflow = workflows.find(w => w.id === currentWorkflowId) || workflows[0];
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

  const handleWorkflowChange = (workflowId: string) => {
    setCurrentWorkflowId(workflowId);
    // Here you could also load the workflow data into the canvas
    // For now, we'll just update the selected workflow
  };

  return (
    <>
      {/* Minimap positioned at bottom left corner of the workflow canvas */}
      <div style={{
        position: 'fixed',
        top: '95%',
        left: '15%',
        transform: 'translateX(-50%)',
        zIndex: 9999
      }}>
        <Minimap visible={minimapVisible} />
      </div>

      {/* Bottom Center Control Panel */}
      <ToolContainer className="demo-free-layout-tools">
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
        </ToolSection>
      </ToolContainer>

      {/* Top Center Workflow Switch Panel */}
      <div style={{
        position: 'fixed',
        top: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#fff',
          border: '1px solid rgba(68, 83, 130, 0.25)',
          borderRadius: '10px',
          padding: '8px 12px',
          boxShadow: 'rgba(0, 0, 0, 0.04) 0px 2px 6px 0px, rgba(0, 0, 0, 0.02) 0px 4px 12px 0px'
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
            value={currentWorkflowId}
            onChange={handleWorkflowChange}
            style={{ width: '200px' }}
            size="small"
          >
            {workflows.map((workflow) => (
              <Select.Option key={workflow.id} value={workflow.id}>
                {workflow.name}
              </Select.Option>
            ))}
          </Select>
          <Divider layout="vertical" style={{ height: '16px' }} margin={3} />
          <Button
            type="tertiary"
            theme="borderless"
            icon={<IconArrowLeft />}
            onClick={handleBack}
            style={{ 
              color: '#F97316', // Orange color
              fontWeight: '500'
            }}
          >
            返回
          </Button>
        </div>
      </div>
    </>
  );
}
