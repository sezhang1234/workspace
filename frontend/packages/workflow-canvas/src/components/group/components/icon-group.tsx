/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { FC } from 'react';
import { FolderOpen, FolderX } from 'lucide-react';

interface IconGroupProps {
  size?: number;
}

export const IconGroup: FC<IconGroupProps> = ({ size }) => (
  <FolderOpen
    size={size || 10}
    style={{
      width: size,
      height: size,
    }}
  />
);

export const IconUngroup: FC<IconGroupProps> = ({ size }) => (
  <FolderX
    size={size || 10}
    style={{
      width: size,
      height: size,
    }}
  />
);
