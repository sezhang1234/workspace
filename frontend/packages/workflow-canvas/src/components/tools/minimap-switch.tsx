/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { IconButton, Tooltip } from '@douyinfe/semi-ui';
import { Map } from 'lucide-react';

interface MinimapSwitchProps {
  minimapVisible: boolean;
  setMinimapVisible: (visible: boolean) => void;
}

export const MinimapSwitch = ({ minimapVisible, setMinimapVisible }: MinimapSwitchProps) => {
  return (
    <Tooltip content="Minimap">
      <IconButton
        type="tertiary"
        theme="borderless"
        icon={<Map size={18} className={minimapVisible ? "text-blue-600" : "text-gray-500"} />}
        onClick={() => setMinimapVisible(!minimapVisible)}
      />
    </Tooltip>
  );
};
