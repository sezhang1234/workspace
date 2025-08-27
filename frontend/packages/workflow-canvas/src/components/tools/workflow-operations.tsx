/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import React, { useRef, useState } from 'react';

import { useClientContext } from '@flowgram.ai/free-layout-editor';
import { Tooltip, IconButton, Toast, Modal, Input, Button, Tag } from '@douyinfe/semi-ui';

import { Download, Upload, Save } from 'lucide-react';

// Mock function for saving workflow (can be replaced with actual API call later)
const saveWorkflow = (name: string, description: string, data: any, tags: string[], id?: string) => {
  console.log('Saving workflow:', { name, description, data, tags, id });
  return { name, description, data, tags, id: id || `workflow_${Date.now()}` };
};

interface WorkflowOperationsProps {
  currentWorkflow?: {
    id: string;
    name: string;
    description: string;
    tags: string[];
  };
  isNewWorkflow?: boolean;
}

export const WorkflowOperations: React.FC<WorkflowOperationsProps> = ({ 
  currentWorkflow, 
  isNewWorkflow = true 
}) => {
  const context = useClientContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [workflowName, setWorkflowName] = useState(currentWorkflow?.name || '');
  const [workflowDescription, setWorkflowDescription] = useState(currentWorkflow?.description || '');
  const [workflowTags, setWorkflowTags] = useState<string[]>(currentWorkflow?.tags || []);
  const [currentTag, setCurrentTag] = useState('');

  const handleSave = () => {
    // If editing existing workflow, save directly without modal
    if (currentWorkflow && !isNewWorkflow) {
      handleSaveToBackend();
    } else {
      // Show save modal for new workflows
      setSaveModalVisible(true);
      // If it's a new workflow, the name and description should already be set
      // from the creation page, so we don't need to generate a default name
    }
  };

  const handleSaveToBackend = () => {
    try {
      if (!workflowName.trim()) {
        Toast.error('请输入工作流名称');
        return;
      }

      const workflowData = context.document.toJSON();
      const savedWorkflow = saveWorkflow(
        workflowName.trim(),
        workflowDescription.trim() || '无描述',
        workflowData,
        workflowTags,
        currentWorkflow?.id // Pass existing ID if editing
      );

      // Close modal and reset form
      setSaveModalVisible(false);
      setWorkflowName('');
      setWorkflowDescription('');
      setWorkflowTags([]);
      setCurrentTag('');

      Toast.success(`工作流"${savedWorkflow.name}"${currentWorkflow ? '更新' : '保存'}成功！`);
    } catch (error) {
      Toast.error('保存工作流失败');
      console.error('保存工作流失败:', error);
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !workflowTags.includes(currentTag.trim())) {
      setWorkflowTags([...workflowTags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setWorkflowTags(workflowTags.filter(tag => tag !== tagToRemove));
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
      
      Toast.success('工作流导出成功！');
    } catch (error) {
      Toast.error('导出工作流失败');
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
          context.document.fromJSON(importedData);
          Toast.success('工作流导入成功！');
        } catch (error) {
          Toast.error('导入失败：文件格式错误');
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
      {/* Save Button */}
      <Tooltip content="保存工作流">
        <IconButton
          type="tertiary"
          theme="borderless"
          icon={<Save size={18} className="text-gray-600 hover:text-blue-600" />}
          onClick={handleSave}
          disabled={context.playground.config.readonly}
        />
      </Tooltip>

      {/* Import Button */}
      <Tooltip content="导入工作流">
        <IconButton
          type="tertiary"
          theme="borderless"
          icon={<Upload size={18} className="text-gray-600 hover:text-blue-600" />}
          onClick={() => fileInputRef.current?.click()}
          disabled={context.playground.config.readonly}
        />
      </Tooltip>

      {/* Export Button */}
      <Tooltip content="导出工作流">
        <IconButton
          type="tertiary"
          theme="borderless"
          icon={<Download size={18} className="text-gray-600 hover:text-blue-600" />}
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

      {/* Save Workflow Modal */}
      <Modal
        title="保存工作流"
        visible={saveModalVisible}
        onOk={handleSaveToBackend}
        onCancel={() => setSaveModalVisible(false)}
        okText="保存"
        cancelText="取消"
        width={500}
      >
        <div style={{ padding: '20px 0' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              工作流名称 *
            </label>
            <Input
              value={workflowName}
              onChange={setWorkflowName}
              placeholder="请输入工作流名称"
              size="large"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              描述
            </label>
            <Input
              value={workflowDescription}
              onChange={setWorkflowDescription}
              placeholder="请输入工作流描述（可选）"
              size="large"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              标签
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <Input
                value={currentTag}
                onChange={setCurrentTag}
                placeholder="输入标签"
                size="large"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag();
                  }
                }}
                style={{ flex: 1 }}
              />
              <Button onClick={handleAddTag} size="large">
                添加
              </Button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {workflowTags.map((tag, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => handleRemoveTag(tag)}
                  style={{ margin: 0 }}
                >
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};