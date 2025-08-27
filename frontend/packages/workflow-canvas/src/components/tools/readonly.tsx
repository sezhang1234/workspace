/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { useCallback } from 'react';

import { usePlayground } from '@flowgram.ai/free-layout-editor';
import { IconButton, Tooltip } from '@douyinfe/semi-ui';
import { Unlock, Lock } from 'lucide-react';

export const Readonly = () => {
  const playground = usePlayground();
  const toggleReadonly = useCallback(() => {
    playground.config.readonly = !playground.config.readonly;
  }, [playground]);
  
  return playground.config.readonly ? (
    <Tooltip content="Editable">
      <IconButton
        theme="borderless"
        type="tertiary"
        icon={<Lock size={18} className="text-blue-600" />}
        onClick={toggleReadonly}
      />
    </Tooltip>
  ) : (
    <Tooltip content="Readonly">
      <IconButton
        theme="borderless"
        type="tertiary"
        icon={<Unlock size={18} className="text-gray-500" />}
        onClick={toggleReadonly}
      />
    </Tooltip>
  );
};
