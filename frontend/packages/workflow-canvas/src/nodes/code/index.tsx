/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { nanoid } from 'nanoid';

import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import { Code2 } from 'lucide-react';
import { formMeta } from './form-meta';

let index = 0;

const defaultCode = `// Here, you can retrieve input variables from the node using 'params' and output results using 'ret'.
// 'params' has been correctly injected into the environment.
// Here's an example of getting the value of the parameter named 'input' from the node input:
// const input = params.input;
// Here's an example of outputting a 'ret' object containing multiple data types:
// const ret = { "name": 'Xiaoming', "hobbies": ["Reading", "Traveling"] };

async function main({ params }) {
    // Build the output object
    const ret = {
        "key0": params.input + params.input, // Concatenate the input parameter 'input' twice
        "key1": ["hello", "world"], // Output an array
        "key2": { // Output an Object
            "key21": "hi"
        },
    };

    return ret;
}`;

export const CodeNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.Code,
  info: {
    icon: <Code2 size={20} className="text-blue-600" />,
    description:
      'Code execution node for running custom JavaScript or Python code.',
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
      id: `code_${nanoid(5)}`,
      type: 'code',
      data: {
        title: 'Code Node',
        language: 'javascript',
        code: '// Your code here\nreturn input;',
      },
    };
  },
};
