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
      {/* Button Group - Upper Center */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99,
        display: 'flex',
        justifyContent: 'center',
        minWidth: '360px',
        pointerEvents: 'none',
        gap: '8px',
        fontFamily: 'Inter, system-ui, sans-serif'
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
              padding: '4px 8px',
              backgroundColor: 'transparent',
              color: '#3b82f6',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '60px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            保存
          </button>
          
          <button
            onClick={handleImportWorkflow}
            style={{
              padding: '4px 8px',
              backgroundColor: 'transparent',
              color: '#10b981',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '60px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            导入
          </button>
          
          <button
            onClick={handleExportWorkflow}
            style={{
              padding: '4px 8px',
              backgroundColor: 'transparent',
              color: '#f59e0b',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '60px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            导出
          </button>
          
          <button
            onClick={handleBack}
            style={{
              padding: '4px 8px',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '60px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(107, 114, 128, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
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
