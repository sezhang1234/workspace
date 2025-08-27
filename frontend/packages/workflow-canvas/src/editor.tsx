/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import React, { useState, useRef } from 'react';
import { EditorRenderer, FreeLayoutEditorProvider, useClientContext } from '@flowgram.ai/free-layout-editor';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Upload, Download, ArrowLeft } from 'lucide-react';

import '@flowgram.ai/free-layout-editor/index.css';
import './styles/index.css';
import { nodeRegistries } from './nodes';
import { initialData } from './initial-data';
import { useEditorProps } from './hooks';
import { DemoTools } from './components/tools';
import { SidebarProvider, SidebarRenderer } from './components/sidebar';

// Workflow Operations Handler Component - Has access to context
const WorkflowOperationsHandler = () => {
  const context = useClientContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Button handlers with context access
  const handleSaveWorkflow = () => {
    try {
      // Get the current workflow data from the canvas
      const workflowData = context.document.toJSON();
      
      // For now, save to console (can be extended to save to backend)
      console.log('Saving workflow:', workflowData);
      
      // Show success message
      alert('工作流保存成功！\n\n工作流数据已保存到控制台。');
    } catch (error) {
      console.error('Save failed:', error);
      alert('保存失败：请重试\n\n错误详情：' + error.message);
    }
  };

  const handleImportWorkflow = () => {
    // Trigger file selection using the hidden file input
    fileInputRef.current?.click();
  };

  const handleExportWorkflow = () => {
    try {
      // Get the current workflow data from the canvas
      const workflowData = context.document.toJSON();
      const dataStr = JSON.stringify(workflowData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `workflow-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(link.href);
      
      alert('工作流导出成功！');
    } catch (error) {
      console.error('Export failed:', error);
      alert('导出失败：请重试\n\n错误详情：' + error.message);
    }
  };

  // Listen for custom events from the main Editor component
  React.useEffect(() => {
    const handleSaveEvent = () => handleSaveWorkflow();
    const handleImportEvent = () => handleImportWorkflow();
    const handleExportEvent = () => handleExportWorkflow();

    window.addEventListener('workflow-save', handleSaveEvent);
    window.addEventListener('workflow-import', handleImportEvent);
    window.addEventListener('workflow-export', handleExportEvent);

    return () => {
      window.removeEventListener('workflow-save', handleSaveEvent);
      window.removeEventListener('workflow-import', handleImportEvent);
      window.removeEventListener('workflow-export', handleExportEvent);
    };
  }, []);

  return (
    <>
      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const importedData = JSON.parse(e.target?.result as string);
                // Clear current workflow and load imported data
                context.document.clear();
                context.document.fromJSON(importedData);
                alert('工作流导入成功！');
              } catch (error) {
                alert('导入失败：文件格式错误');
                console.error('导入失败：文件格式错误', error);
              }
            };
            reader.readAsText(file);
          }
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
        style={{ display: 'none' }}
      />
    </>
  );
};

export const Editor = () => {
  const { id: _workflowId } = useParams<{ id: string }>();
  const editorProps = useEditorProps(initialData, nodeRegistries);
  const [minimapVisible, setMinimapVisible] = useState(false);
  const navigate = useNavigate();

  // Button handlers - these will be connected to the WorkflowOperationsHandler
  const handleSaveWorkflow = () => {
    // Trigger save through the WorkflowOperationsHandler
    window.dispatchEvent(new CustomEvent('workflow-save'));
  };

  const handleImportWorkflow = () => {
    // Trigger import through the WorkflowOperationsHandler
    window.dispatchEvent(new CustomEvent('workflow-import'));
  };

  const handleExportWorkflow = () => {
    // Trigger export through the WorkflowOperationsHandler
    window.dispatchEvent(new CustomEvent('workflow-export'));
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
              color: '#0064fa',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 'auto',
              transition: 'all 0.2s ease',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(171,181,255,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(171,181,255,0.3)';
            }}
          >
            <Save size={16} />
            保存
          </button>
          
          <button
            onClick={handleImportWorkflow}
            style={{
              backgroundColor: 'rgba(171,181,255,0.3)',
              color: '#0064fa',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 'auto',
              transition: 'all 0.2s ease',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(171,181,255,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(171,181,255,0.3)';
            }}
          >
            <Upload size={16} />
            导入
          </button>
          
          <button
            onClick={handleExportWorkflow}
            style={{
              backgroundColor: 'rgba(171,181,255,0.3)',
              color: '#0064fa',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 'auto',
              transition: 'all 0.2s ease',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(171,181,255,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(171,181,255,0.3)';
            }}
          >
            <Download size={16} />
            导出
          </button>
          
          <button
            onClick={handleBack}
            style={{
              backgroundColor: 'rgba(171,181,255,0.3)',
              color: '#0064fa',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 'auto',
              transition: 'all 0.2s ease',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(171,181,255,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(171,181,255,0.3)';
            }}
          >
            <ArrowLeft size={16} />
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
            
            {/* Workflow Operations Handler - Has access to context */}
            <WorkflowOperationsHandler />
          </SidebarProvider>
        </FreeLayoutEditorProvider>
      </div>
    </div>
  );
};
