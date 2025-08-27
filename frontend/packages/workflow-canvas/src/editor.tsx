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

// Toast Notification Component
const ToastNotification = ({ message, type, isVisible, onClose }: {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
}) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      bottom: '20px',
      left: '20px',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: 10000,
      maxWidth: '400px',
      wordWrap: 'break-word' as const,
      transform: 'translateX(-100%)',
      opacity: 0,
      animation: 'slideIn 0.3s ease-out forwards',
      fontFamily: 'Inter, system-ui, sans-serif'
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: '#10b981',
          color: 'white',
          borderLeft: '4px solid #059669'
        };
      case 'error':
        return {
          ...baseStyles,
          backgroundColor: '#ef4444',
          color: 'white',
          borderLeft: '4px solid #dc2626'
        };
      case 'info':
        return {
          ...baseStyles,
          backgroundColor: '#3b82f6',
          color: 'white',
          borderLeft: '4px solid #2563eb'
        };
      default:
        return baseStyles;
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(-100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes slideOut {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(-100%);
              opacity: 0;
            }
          }
        `}
      </style>
      <div style={getToastStyles()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {type === 'success' && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            )}
            {type === 'error' && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            )}
            {type === 'info' && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            )}
          </div>
          <span>{message}</span>
        </div>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            fontSize: '16px',
            lineHeight: '1'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 1)';
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          ×
        </button>
      </div>
    </>
  );
};

// Workflow Operations Handler Component - Has access to context
const WorkflowOperationsHandler = () => {
  const context = useClientContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = React.useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  // Auto-layout functionality - triggers when workflow canvas is loaded
  React.useEffect(() => {
    // Small delay to ensure the canvas is fully rendered
    const timer = setTimeout(() => {
      try {
        // Check if there are nodes to layout
        const nodes = context.document.getNodes();
        if (nodes && nodes.length > 0) {
          // Trigger auto-layout using the existing tools.autoLayout()
          context.tools.autoLayout();
        }
      } catch (error) {
        console.log('Auto-layout not available or failed:', error);
      }
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, [context.document, context.tools]);

  // Mouse wheel zoom functionality
  React.useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      // Prevent default scrolling behavior
      event.preventDefault();
      
      // Check if Ctrl/Cmd key is pressed (common for zoom)
      if (event.ctrlKey || event.metaKey) {
        try {
          if (event.deltaY < 0) {
            // Scroll up - zoom in
            context.tools.zoomin();
          } else {
            // Scroll down - zoom out
            context.tools.zoomout();
          }
        } catch (error) {
          console.log('Zoom operation failed:', error);
        }
      }
    };

    // Add wheel event listener to the canvas container
    const canvasContainer = document.querySelector('.demo-editor');
    if (canvasContainer) {
      canvasContainer.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (canvasContainer) {
        canvasContainer.removeEventListener('wheel', handleWheel);
      }
    };
  }, [context.tools]);

  // Button handlers with context access
  const handleSaveWorkflow = () => {
    try {
      // Get the current workflow data from the canvas
      const workflowData = context.document.toJSON();
      
      // For now, save to console (can be extended to save to backend)
      console.log('Saving workflow:', workflowData);
      
      // Show beautiful success toast
      setToast({
        message: '工作流保存成功！工作流数据已保存到控制台。',
        type: 'success',
        isVisible: true
      });
    } catch (error) {
      console.error('Save failed:', error);
      setToast({
        message: `保存失败：请重试。错误详情：${error.message}`,
        type: 'error',
        isVisible: true
      });
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
      
      // Show beautiful success toast
      setToast({
        message: '工作流导出成功！文件已下载到您的下载文件夹。',
        type: 'success',
        isVisible: true
      });
    } catch (error) {
      console.error('Export failed:', error);
      setToast({
        message: `导出失败：请重试。错误详情：${error.message}`,
        type: 'error',
        isVisible: true
      });
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
                
                // Show beautiful success toast
                setToast({
                  message: '工作流导入成功！导入的数据已加载到画布。',
                  type: 'success',
                  isVisible: true
                });
              } catch (error) {
                console.error('导入失败：文件格式错误', error);
                setToast({
                  message: '导入失败：文件格式错误。请确保选择的是有效的工作流JSON文件。',
                  type: 'error',
                  isVisible: true
                });
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
      
      {/* Beautiful Toast Notifications */}
      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
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
