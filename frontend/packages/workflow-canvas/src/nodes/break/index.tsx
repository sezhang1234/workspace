/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { nanoid } from 'nanoid';

import { FlowNodeRegistry } from '../../typings';
import { Square } from 'lucide-react';
import { formMeta } from './form-meta';
import { WorkflowNodeType } from '../constants';

export const BreakNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.Break,
  info: {
    icon: <Square size={20} className="text-blue-600" />,
    description:
      'Break node for exiting loops early.',
  },
  meta: {
    defaultPorts: [{ type: 'input' }],
    size: {
      width: 360,
      height: 211,
    },
    // 确保节点在面板中可见
    nodePanelVisible: true,
  },
  formMeta,
  onAdd() {
    return {
      id: `break_${nanoid(5)}`,
      type: 'break',
      data: {
        title: 'Break Node',
      },
    };
  },
};
