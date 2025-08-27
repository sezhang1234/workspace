/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { nanoid } from 'nanoid';

import { WorkflowNodeType } from '../constants';
import { FlowNodeRegistry } from '../../typings';
import { Sparkles } from 'lucide-react';
import { formMeta } from './form-meta';

export const LLMNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.LLM,
  info: {
    icon: <Sparkles size={20} className="text-purple-600" />,
    description:
      'Large Language Model node for AI-powered text generation and processing.',
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
      id: `llm_${nanoid(5)}`,
      type: WorkflowNodeType.LLM,
      data: {
        title: `LLM`,
        inputsValues: {
          modelName: {
            type: 'constant',
            content: 'gpt-3.5-turbo',
          },
          apiKey: {
            type: 'constant',
            content: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          },
          apiHost: {
            type: 'constant',
            content: 'https://mock-ai-url/api/v3',
          },
          temperature: {
            type: 'constant',
            content: 0.5,
          },
          systemPrompt: {
            type: 'template',
            content: '# 角色\n你是一个专业的AI助手，擅长分析和解决问题。\n\n# 任务\n请根据用户的问题提供详细、准确的分析和解决方案。',
          },
          prompt: {
            type: 'template',
            content: '# 用户问题\n{{start_0.query}}\n\n请分析这个问题并提供解决方案。',
          },
        },
        inputs: {
          type: 'object',
          required: ['modelName', 'apiKey', 'apiHost', 'temperature', 'prompt'],
          properties: {
            modelName: {
              type: 'string',
            },
            apiKey: {
              type: 'string',
            },
            apiHost: {
              type: 'string',
            },
            temperature: {
              type: 'number',
            },
            systemPrompt: {
              type: 'string',
              extra: {
                formComponent: 'prompt-editor',
              },
            },
            prompt: {
              type: 'string',
              extra: {
                formComponent: 'prompt-editor',
              },
            },
          },
        },
        outputs: {
          type: 'object',
          properties: {
            result: { type: 'string' },
          },
        },
      },
    };
  },
};

// 确保默认导出
export default LLMNodeRegistry;
