/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { useState, useEffect } from 'react';

import { useRefresh } from '@flowgram.ai/free-layout-editor';
import { useClientContext } from '@flowgram.ai/free-layout-editor';
import { Tooltip, IconButton, Divider, Button } from '@douyinfe/semi-ui';
import { Undo2, Redo2, ArrowLeft } from 'lucide-react';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  
  useEffect(() => {
    const updateSidebarState = () => {
      const isCollapsed = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-collapsed') === '1';
      setSidebarCollapsed(isCollapsed);
    };

    // Initial state
    updateSidebarState();

    // Listen for changes to CSS custom properties
    const observer = new MutationObserver(updateSidebarState);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });

    // Also listen for window resize events
    window.addEventListener('resize', updateSidebarState);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSidebarState);
    };
  }, []);
  
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
      // Navigate directly to workflows list page
      window.location.href = '/dashboard/workflows';
    }
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
              icon={<Undo2 size={18} className="text-gray-600 hover:text-blue-600" />}
              disabled={!canUndo || playground.config.readonly}
              onClick={() => history.undo()}
            />
          </Tooltip>
          <Tooltip content="重做">
            <IconButton
              type="tertiary"
              theme="borderless"
              icon={<Redo2 size={18} className="text-gray-600 hover:text-blue-600" />}
              disabled={!canRedo || playground.config.readonly}
              onClick={() => history.redo()}
            />
          </Tooltip>
          <Divider layout="vertical" style={{ height: '16px' }} margin={3} />
          <AddNode disabled={playground.config.readonly} />
          <TestRunButton disabled={playground.config.readonly} />
        </ToolSection>
      </ToolContainer>

      {/* Top Left Return Button */}
      <div className={`workflow-back-button ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        <Button
          type="tertiary"
          theme="borderless"
          icon={<ArrowLeft size={16} className="text-gray-600" />}
          onClick={handleBack}
          style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '6px 12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
            color: '#374151',
            fontWeight: '400',
            fontSize: '13px',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            minWidth: 'auto',
            height: '32px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)';
            e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        >
          返回
        </Button>
      </div>
    </>
  );
}
