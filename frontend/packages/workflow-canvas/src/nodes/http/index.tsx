/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { nanoid } from 'nanoid';

import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import { Globe2 } from 'lucide-react';
import { formMeta } from './form-meta';

export const HTTPNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.HTTP,
  info: {
    icon: <Globe2 size={16} className="text-indigo-600" />,
    description:
      'HTTP request node for making API calls and web requests.',
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
      id: `http_${nanoid(5)}`,
      type: 'http',
      data: {
        title: 'HTTP Node',
        method: 'GET',
        url: '',
        headers: {},
        body: '',
      },
    };
  },
};
