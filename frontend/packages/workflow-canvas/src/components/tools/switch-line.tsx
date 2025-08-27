/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { useCallback } from 'react';

import { useService, WorkflowLinesManager } from '@flowgram.ai/free-layout-editor';
import { IconButton, Tooltip } from '@douyinfe/semi-ui';
import { GitBranch } from 'lucide-react';

export const SwitchLine = () => {
  const linesManager = useService(WorkflowLinesManager);
  const switchLine = useCallback(() => {
    linesManager.switchLineType();
  }, [linesManager]);

  return (
    <Tooltip content={'Switch Line'}>
      <IconButton 
        type="tertiary" 
        theme="borderless" 
        onClick={switchLine} 
        icon={<GitBranch size={18} className="text-gray-600 hover:text-blue-600" />} 
      />
    </Tooltip>
  );
};
