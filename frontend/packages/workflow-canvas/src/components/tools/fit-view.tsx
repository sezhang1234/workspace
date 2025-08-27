/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { usePlaygroundTools } from '@flowgram.ai/free-layout-editor';
import { IconButton, Tooltip } from '@douyinfe/semi-ui';
import { Maximize2 } from 'lucide-react';

export const FitView = () => {
  const tools = usePlaygroundTools();
  return (
    <Tooltip content="FitView">
      <IconButton
        icon={<Maximize2 size={18} className="text-gray-600 hover:text-blue-600" />}
        type="tertiary"
        theme="borderless"
        onClick={() => tools.fitView()}
      />
    </Tooltip>
  );
};
