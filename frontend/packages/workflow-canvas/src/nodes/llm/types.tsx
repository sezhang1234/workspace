/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { IFlowConstantRefValue } from '@flowgram.ai/runtime-interface';
import { FlowNodeJSON } from '@flowgram.ai/free-layout-editor';
import { IFlowTemplateValue, IJsonSchema } from '@flowgram.ai/form-materials';

export interface LLMNodeJSON extends FlowNodeJSON {
  data: {
    title: string;
    inputs: IJsonSchema<'object'>;
    inputsValues: {
      modelName: IFlowConstantRefValue;
      apiKey: IFlowConstantRefValue;
      apiHost: IFlowConstantRefValue;
      temperature: IFlowConstantRefValue;
      systemPrompt: IFlowTemplateValue;
      prompt: IFlowTemplateValue;
    };
    outputs: IJsonSchema<'object'>;
  };
}
