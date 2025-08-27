/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { FlowNodeRegistry } from '../../typings';
import { FolderX } from 'lucide-react';
import { formMeta } from './form-meta';
import { WorkflowNodeType } from '../constants';
import { nanoid } from 'nanoid';

export const BlockEndNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.BlockEnd,
  info: {
    icon: <FolderX size={20} className="text-blue-600" />,
    description:
      'Block end node for completing grouped workflow operations.',
  },
  meta: {
    defaultPorts: [{ type: 'input' }],
    size: {
      width: 360,
      height: 211,
    },
  },
  formMeta,
  onAdd() {
    return {
      id: `block_end_${nanoid(5)}`,
      type: 'block-end',
      data: {
        title: 'Block End',
      },
    };
  },
};
