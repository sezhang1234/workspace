/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { FormRenderProps, FormMeta, ValidateTrigger } from '@flowgram.ai/free-layout-editor';
import { Brain } from 'lucide-react';
import { Divider } from '@douyinfe/semi-ui';

import { LLMNodeJSON } from './types';
import { FormHeader, FormContent, FormInputs } from '../../form-components';
import { 
  SafeDisplayOutputs,
  provideJsonSchemaOutputs,
  syncVariableTitle,
  validateFlowValue,
  validateWhenVariableSync,
  listenRefSchemaChange,
  autoRenameRefEffect
} from '../../form-components/safe-wrappers';

export const renderForm = ({ form }: FormRenderProps<LLMNodeJSON>) => (
  <>
    <FormHeader />
    <FormContent>
      <FormInputs />
      <Divider />
      <SafeDisplayOutputs displayFromScope />
    </FormContent>
  </>
);

export const formMeta: FormMeta<LLMNodeJSON> = {
  render: renderForm,
  validateTrigger: ValidateTrigger.onChange,
  validate: {
    title: ({ value }) => (value ? undefined : '标题是必需的'),
    'inputsValues.*': ({ value, context, formValues, name }) => {
      const valuePropertyKey = name.replace(/^inputsValues\./, '');
      const required = formValues.inputs?.required || [];

      return validateFlowValue(value, {
        node: context.node,
        required: required.includes(valuePropertyKey),
        errorMessages: {
          required: `${valuePropertyKey} 是必需的`,
        },
      });
    },
  },
  formatOnInit: (value, ctx) => value,
  formatOnSubmit: (value, ctx) => value,
  effect: {
    title: syncVariableTitle,
    outputs: provideJsonSchemaOutputs,
    inputsValues: [...autoRenameRefEffect, ...validateWhenVariableSync({ scope: 'public' })],
    'inputsValues.*': listenRefSchemaChange((params) => {
      console.log(`[${params.context.node.id}][${params.name}] Schema Of Ref Updated`);
    }),
  },
};

// 确保默认导出
export default formMeta;
