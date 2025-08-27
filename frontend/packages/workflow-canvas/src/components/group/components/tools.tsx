/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { FC } from 'react';

import { GripVertical } from 'lucide-react';

interface ITools {}

export const GroupTools: FC<ITools> = () => (
  <div className="workflow-group-tools">
    <GripVertical className="workflow-group-tools-drag" />
  </div>
);
