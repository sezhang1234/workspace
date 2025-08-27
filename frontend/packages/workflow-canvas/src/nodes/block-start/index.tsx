/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { FlowNodeRegistry } from '../../typings';
import { FolderOpen } from 'lucide-react';
import { formMeta } from './form-meta';
import { WorkflowNodeType } from '../constants';
import { nanoid } from 'nanoid';

export const BlockStartNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.BlockStart,
  info: {
    icon: <FolderOpen size={20} className="text-blue-600" />,
    description:
      'Block start node for grouping workflow operations.',
  },
  meta: {
    defaultPorts: [{ type: 'input' }, { type: 'output' }],
    size: {
      width: 360,
      height: 211,
    },
  },
  formMeta,
  onAdd() {
    return {
      id: `block_start_${nanoid(5)}`,
      type: 'block-start',
      data: {
        title: 'Block Start',
      },
    };
  },
};
