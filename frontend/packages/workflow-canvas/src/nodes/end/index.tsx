/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { FlowNodeRegistry } from '../../typings';
import { StopCircle } from 'lucide-react';
import { formMeta } from './form-meta';
import { WorkflowNodeType } from '../constants';

export const EndNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.End,
  meta: {
    deleteDisable: true,
    copyDisable: true,
    nodePanelVisible: false,
    defaultPorts: [{ type: 'input' }],
    size: {
      width: 360,
      height: 211,
    },
  },
  info: {
    icon: <StopCircle size={20} className="text-blue-600" />,
    description:
      '工作流的最终节点，用于返回工作流运行后的结果信息。',
  },
  /**
   * Render node via formMeta
   */
  formMeta,
  /**
   * End Node cannot be added
   */
  canAdd() {
    return false;
  },
};
