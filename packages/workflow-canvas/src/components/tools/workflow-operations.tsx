/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import React, { useRef } from 'react';

import { useClientContext } from '@flowgram.ai/free-layout-editor';
import { Tooltip, IconButton, Divider } from '@douyinfe/semi-ui';
import { IconDownload, IconUpload, IconSave } from '@douyinfe/semi-icons';

export const WorkflowOperations: React.FC = () => {
  const context = useClientContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    try {
      const workflowData = context.document.toJSON();
      const dataStr = JSON.stringify(workflowData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `workflow-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(link.href);
      
      // Show success message (you can implement a toast notification here)
      console.log('工作流保存成功！');
    } catch (error) {
      console.error('保存工作流失败:', error);
    }
  };

  const handleExport = () => {
    try {
      const workflowData = context.document.toJSON();
      const dataStr = JSON.stringify(workflowData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `workflow-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(link.href);
      
      console.log('工作流导出成功！');
    } catch (error) {
      console.error('导出工作流失败:', error);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          // Clear current workflow and load imported data
          context.document.clear();
          context.document.loadFromJSON(importedData);
          console.log('工作流导入成功！');
        } catch (error) {
          console.error('导入失败：文件格式错误', error);
        }
      };
      reader.readAsText(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <Divider layout="vertical" style={{ height: '16px' }} margin={3} />
      
      {/* Save Button */}
      <Tooltip content="保存工作流">
        <IconButton
          type="tertiary"
          theme="borderless"
          icon={<IconSave />}
          onClick={handleSave}
          disabled={context.playground.config.readonly}
        />
      </Tooltip>

      {/* Import Button */}
      <Tooltip content="导入工作流">
        <IconButton
          type="tertiary"
          theme="borderless"
          icon={<IconUpload />}
          onClick={() => fileInputRef.current?.click()}
          disabled={context.playground.config.readonly}
        />
      </Tooltip>

      {/* Export Button */}
      <Tooltip content="导出工作流">
        <IconButton
          type="tertiary"
          theme="borderless"
          icon={<IconDownload />}
          onClick={handleExport}
          disabled={context.playground.config.readonly}
        />
      </Tooltip>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        style={{ display: 'none' }}
      />
    </>
  );
};