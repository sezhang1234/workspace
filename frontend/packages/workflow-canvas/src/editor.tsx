/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { EditorRenderer, FreeLayoutEditorProvider } from '@flowgram.ai/free-layout-editor';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import '@flowgram.ai/free-layout-editor/index.css';
import './styles/index.css';
import { nodeRegistries } from './nodes';
import { initialData } from './initial-data';
import { useEditorProps } from './hooks';
import { DemoTools } from './components/tools';
import { SidebarProvider, SidebarRenderer } from './components/sidebar';

export const Editor = () => {
  const { id: _workflowId } = useParams<{ id: string }>();
  const editorProps = useEditorProps(initialData, nodeRegistries);
  const [minimapVisible, setMinimapVisible] = useState(false);
  const navigate = useNavigate();

  // Button handlers
  const handleSaveWorkflow = () => {
    // TODO: Implement save workflow functionality
    console.log('Save workflow clicked');
  };

  const handleImportWorkflow = () => {
    // TODO: Implement import workflow functionality
    console.log('Import workflow clicked');
  };

  const handleExportWorkflow = () => {
    // TODO: Implement export workflow functionality
    console.log('Export workflow clicked');
  };

  const handleBack = () => {
    navigate('/dashboard/workflows');
  };

  return (
    <div className="workflow-canvas-wrapper" style={{ 
      width: '100%', 
      height: 'calc(100vh - 120px)',
      minHeight: 'calc(100vh - 120px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Upper Center Button Group - Copied from Bottom Control Panel */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        justifyContent: 'center',
        minWidth: '360px',
        pointerEvents: 'none',
        gap: '8px',
        fontFamily: 'Inter, system-ui, sans-serif',
        zIndex: 99
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#fff',
          border: '1px solid rgba(68, 83, 130, 0.25)',
          borderRadius: '10px',
          boxShadow: 'rgba(0, 0, 0, 0.04) 0px 2px 6px 0px, rgba(0, 0, 0, 0.02) 0px 4px 12px 0px',
          columnGap: '2px',
          height: '40px',
          padding: '0 4px',
          pointerEvents: 'auto',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <button
            onClick={handleSaveWorkflow}
            style={{
              backgroundColor: 'rgba(171,181,255,0.3)',
              color: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 'auto',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(171,181,255,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(171,181,255,0.3)';
            }}
          >
            保存
          </button>
          
          <button
            onClick={handleImportWorkflow}
            style={{
              backgroundColor: 'rgba(171,181,255,0.3)',
              color: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 'auto',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(171,181,255,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(171,181,255,0.3)';
            }}
          >
            导入
          </button>
          
          <button
            onClick={handleExportWorkflow}
            style={{
              backgroundColor: 'rgba(171,181,255,0.3)',
              color: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 'auto',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(171,181,255,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(171,181,255,0.3)';
            }}
          >
            导出
          </button>
          
          <button
            onClick={handleBack}
            style={{
              backgroundColor: 'rgba(171,181,255,0.3)',
              color: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 'auto',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(171,181,255,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(171,181,255,0.3)';
            }}
          >
            返回
          </button>
        </div>
      </div>

      <div className="doc-free-feature-overview" style={{ 
        width: '100%', 
        height: 'calc(100vh - 120px)',
        minHeight: 'calc(100vh - 120px)',
        position: 'relative'
      }}>
        <FreeLayoutEditorProvider {...editorProps}>
          <SidebarProvider>
            <div className="demo-container" style={{ 
              width: '100%', 
              height: 'calc(100vh - 120px)',
              minHeight: 'calc(100vh - 120px)',
              position: 'relative'
            }}>
              <EditorRenderer className="demo-editor" style={{ 
                width: '100%', 
                height: 'calc(100vh - 120px)',
                minHeight: 'calc(100vh - 120px)',
                position: 'relative'
              }} />
            </div>
            <DemoTools 
              minimapVisible={minimapVisible} 
              setMinimapVisible={setMinimapVisible} 
            />
            <SidebarRenderer />
          </SidebarProvider>
        </FreeLayoutEditorProvider>
      </div>
    </div>
  );
};
