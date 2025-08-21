/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { FlowDocumentJSON } from './typings';

export const initialData: FlowDocumentJSON = {
  nodes: [
    {
      id: 'start_0',
      type: 'start',
      meta: {
        position: {
          x: 200,
          y: 300,
        },
      },
      data: {
        title: '开始',
        outputs: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              default: '你好，请帮我分析一下这个问题。',
            },
            enable: {
              type: 'boolean',
              default: true,
            },
          },
        },
      },
    },
    {
      id: 'llm_0',
      type: 'llm',
      meta: {
        position: {
          x: 500,
          y: 300,
        },
      },
      data: {
        title: 'LLM',
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
            content: 'https://api.openai.com/v1',
          },
          temperature: {
            type: 'constant',
            content: 0.7,
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
            result: {
              type: 'string',
            },
          },
        },
      },
    },
    {
      id: 'end_0',
      type: 'end',
      meta: {
        position: {
          x: 800,
          y: 300,
        },
      },
      data: {
        title: '结束',
        inputsValues: {
          success: { 
            type: 'constant', 
            content: true, 
            schema: { type: 'boolean' } 
          },
          query: { 
            type: 'ref', 
            content: ['start_0', 'query'] 
          },
          result: { 
            type: 'ref', 
            content: ['llm_0', 'result'] 
          },
        },
      },
    },
  ],
  edges: [
    {
      sourceNodeID: 'start_0',
      targetNodeID: 'llm_0',
    },
    {
      sourceNodeID: 'llm_0',
      targetNodeID: 'end_0',
    },
  ],
};
