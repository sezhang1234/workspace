/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { EditorRenderer, FreeLayoutEditorProvider } from '@flowgram.ai/free-layout-editor';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import '@flowgram.ai/free-layout-editor/index.css';
import './styles/index.css';
import { nodeRegistries } from './nodes';
import { initialData } from './initial-data';
import { useEditorProps } from './hooks';
import { DemoTools } from './components/tools';
import { SidebarProvider, SidebarRenderer } from './components/sidebar';

export const Editor = () => {
  const navigate = useNavigate();
  const editorProps = useEditorProps(initialData, nodeRegistries);
  
  return (
    <div className="doc-free-feature-overview">
      <FreeLayoutEditorProvider {...editorProps}>
        <SidebarProvider>
          <div className="demo-container">
            <EditorRenderer className="demo-editor" />
            
            {/* Back Button Overlay */}
            <div className="absolute top-4 left-4 z-50 pointer-events-auto">
              <button
                onClick={() => {
                  if (window.confirm('确定要离开吗？未保存的更改将会丢失。')) {
                    navigate('/workflows');
                  }
                }}
                className="flex items-center space-x-2 px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-md text-gray-700 hover:bg-white hover:border-gray-400 shadow-md transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">返回</span>
              </button>
            </div>
          </div>
          <DemoTools />
          <SidebarRenderer />
        </SidebarProvider>
      </FreeLayoutEditorProvider>
    </div>
  );
};
