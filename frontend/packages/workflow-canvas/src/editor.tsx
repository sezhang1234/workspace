/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { EditorRenderer, FreeLayoutEditorProvider } from '@flowgram.ai/free-layout-editor';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Upload, Download, ArrowLeft } from 'lucide-react';

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
    try {
      // TODO: Get the current workflow data from the canvas
      // This would typically involve calling a method on the workflow editor
      // For example: const workflowData = context.document.toJSON()
      const workflowData = {
        // Mock data for now - replace with actual workflow data
        name: '工作流',
        description: '工作流描述',
        nodes: [],
        edges: [],
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        lastSaved: new Date().toISOString()
      };
      
      // TODO: Send the workflow data to the backend API
      // This would typically involve an API call to save the workflow
      // For example: await api.saveWorkflow(workflowData)
      console.log('Saving workflow:', workflowData);
      
      // Simulate API call delay
      setTimeout(() => {
        // Show success message
        alert('工作流保存成功！\n\n注意：当前保存的是示例数据，实际保存需要集成工作流编辑器API和后端服务。');
      }, 500);
      
    } catch (error) {
      console.error('Save failed:', error);
      alert('保存失败：请重试\n\n错误详情：' + error.message);
    }
  };

  const handleImportWorkflow = () => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onchange = (e) => {
          try {
            const workflowData = JSON.parse(e.target?.result as string);
            
            // Validate the imported data structure
            if (!workflowData || typeof workflowData !== 'object') {
              throw new Error('Invalid workflow data format');
            }
            
            // TODO: Load the workflow data into the canvas
            // This would typically involve calling a method on the workflow editor
            // For example: context.document.fromJSON(workflowData)
            console.log('Imported workflow data:', workflowData);
            
            // Show success message
            alert('工作流导入成功！\n\n注意：导入的数据已加载到控制台，实际加载到画布需要集成工作流编辑器API。');
          } catch (error) {
            console.error('Import failed:', error);
            alert('导入失败：文件格式错误\n\n请确保选择的是有效的工作流JSON文件。');
          }
        };
        reader.readAsText(file);
      }
    };
    
    // Trigger file selection
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const handleExportWorkflow = () => {
    try {
      // TODO: Get the current workflow data from the canvas
      // This would typically involve calling a method on the workflow editor
      // For example: const workflowData = context.document.toJSON()
      const workflowData = {
        // Mock data for now - replace with actual workflow data
        name: '工作流',
        description: '工作流描述',
        nodes: [],
        edges: [],
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        metadata: {
          exportedAt: new Date().toISOString(),
          exportVersion: '1.0.0'
        }
      };
      
      // Convert to JSON string with proper formatting
      const dataStr = JSON.stringify(workflowData, null, 2);
      
      // Create and download the file
      const dataBlob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `workflow-export-${new Date().toISOString().split('T')[0]}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      // Show success message
      alert('工作流导出成功！\n\n文件已下载到您的下载文件夹。\n\n注意：当前导出的是示例数据，实际导出需要集成工作流编辑器API。');
    } catch (error) {
      console.error('Export failed:', error);
      alert('导出失败：请重试\n\n错误详情：' + error.message);
    }
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
          </SidebarProvider>
        </FreeLayoutEditorProvider>
      </div>
    </div>
  );
};
