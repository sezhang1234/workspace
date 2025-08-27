/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { nanoid } from 'nanoid';

import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import { Database } from 'lucide-react';
import { formMeta } from './form-meta';

export const VariableNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.Variable,
  info: {
    icon: <Database size={20} className="text-slate-600" />,
    description:
      'Variable node for storing and managing data values.',
  },
  meta: {
    defaultPorts: [{ type: 'input' }, { type: 'output' }],
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
      id: `variable_${nanoid(5)}`,
      type: 'variable',
      data: {
        title: 'Variable Node',
        name: '',
        value: '',
        type: 'string',
      },
    };
  },
};
