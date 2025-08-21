/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { EditorRenderer, FreeLayoutEditorProvider } from '@flowgram.ai/free-layout-editor';
import { useState } from 'react';

import '@flowgram.ai/free-layout-editor/index.css';
import './styles/index.css';
import { nodeRegistries } from './nodes';
import { initialData } from './initial-data';
import { useEditorProps } from './hooks';
import { DemoTools } from './components/tools';
import { SidebarProvider, SidebarRenderer } from './components/sidebar';

export const Editor = () => {
  const editorProps = useEditorProps(initialData, nodeRegistries);
  const [minimapVisible, setMinimapVisible] = useState(true);

  return (
    <div className="workflow-canvas-wrapper" style={{ 
      width: '100%', 
      height: '100vh',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="doc-free-feature-overview" style={{ 
        width: '100%', 
        height: '100vh',
        minHeight: '100vh',
        position: 'relative'
      }}>
        <FreeLayoutEditorProvider {...editorProps}>
          <SidebarProvider>
            <div className="demo-container" style={{ 
              width: '100%', 
              height: '100vh',
              minHeight: '100vh',
              position: 'relative'
            }}>
              <EditorRenderer className="demo-editor" style={{ 
                width: '100%', 
                height: '100vh',
                minHeight: '100vh',
                position: 'relative'
              }} />
            </div>
            <DemoTools minimapVisible={minimapVisible} setMinimapVisible={setMinimapVisible} />
            <SidebarRenderer />
          </SidebarProvider>
        </FreeLayoutEditorProvider>
      </div>
    </div>
  );
};
