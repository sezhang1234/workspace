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
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        <button
          onClick={handleSaveWorkflow}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          }}
        >
          保存
        </button>
        
        <button
          onClick={handleImportWorkflow}
          style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#10b981';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          }}
        >
          导入
        </button>
        
        <button
          onClick={handleExportWorkflow}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#d97706';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f59e0b';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          }}
        >
          导出
        </button>
        
        <button
          onClick={handleBack}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4b5563';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#6b7280';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
          }}
        >
          返回
        </button>
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
