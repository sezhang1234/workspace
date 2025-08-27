/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { nanoid } from 'nanoid';

import { FlowNodeRegistry } from '../../typings';
import { SkipForward } from 'lucide-react';
import { formMeta } from './form-meta';
import { WorkflowNodeType } from '../constants';

export const ContinueNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.Continue,
  info: {
    icon: <SkipForward size={20} className="text-blue-600" />,
    description:
      'Continue node for skipping to the next iteration in loops.',
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
      id: `continue_${nanoid(5)}`,
      type: 'continue',
      data: {
        title: 'Continue Node',
      },
    };
  },
};
