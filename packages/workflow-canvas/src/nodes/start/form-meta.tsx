/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import {
  Field,
  FieldRenderProps,
  FormRenderProps,
  FormMeta,
  ValidateTrigger,
} from '@flowgram.ai/free-layout-editor';
import {
  IJsonSchema,
  JsonSchemaEditor,
  provideJsonSchemaOutputs,
  syncVariableTitle,
} from '@flowgram.ai/form-materials';

import { FlowNodeJSON, JsonSchema } from '../../typings';
import { useIsSidebar } from '../../hooks';
import { FormHeader, FormContent } from '../../form-components';
import { SafeJsonSchemaEditor } from '../../form-components/safe-wrappers';

export const renderForm = ({ form }: FormRenderProps<FlowNodeJSON>) => {
  const isSidebar = useIsSidebar();
  if (isSidebar) {
    return (
      <>
        <FormHeader />
        <FormContent>
          <Field
            name="outputs"
            render={({ field: { value, onChange } }: FieldRenderProps<JsonSchema>) => (
              <>
                <SafeJsonSchemaEditor
                  value={value}
                  onChange={(value) => onChange(value as JsonSchema)}
                />
              </>
            )}
          />
        </FormContent>
      </>
    );
  }
  return (
    <>
      <FormHeader />
      <FormContent>
        <div>Outputs configuration</div>
      </FormContent>
    </>
  );
};

export const formMeta: FormMeta<FlowNodeJSON> = {
  render: renderForm,
  validateTrigger: ValidateTrigger.onChange,
  validate: {
    title: ({ value }: { value: string }) => (value ? undefined : '标题是必需的'),
  },
  effect: {
    title: syncVariableTitle,
    outputs: provideJsonSchemaOutputs,
  },
};
