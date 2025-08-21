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
import { Minimap } from './components/tools/minimap';

export const Editor = () => {
  const editorProps = useEditorProps(initialData, nodeRegistries);
  const [minimapVisible, setMinimapVisible] = useState(true);

  return (
    <div className="doc-free-feature-overview" style={{ width: '100%', height: '100%' }}>
      <FreeLayoutEditorProvider {...editorProps}>
        <SidebarProvider>
          <div className="demo-container" style={{ width: '100%', height: '100%' }}>
            <EditorRenderer className="demo-editor" style={{ width: '100%', height: '100%' }} />
            
            {/* Minimap positioned in upper left corner of canvas */}
            <div style={{ 
              position: 'absolute', 
              top: '16px', 
              left: '16px', 
              zIndex: 9999 
            }}>
              <Minimap visible={minimapVisible} />
            </div>
          </div>
          <DemoTools minimapVisible={minimapVisible} setMinimapVisible={setMinimapVisible} />
          <SidebarRenderer />
        </SidebarProvider>
      </FreeLayoutEditorProvider>
    </div>
  );
};
