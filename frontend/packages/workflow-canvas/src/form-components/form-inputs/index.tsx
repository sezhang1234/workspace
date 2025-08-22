/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { Field } from '@flowgram.ai/free-layout-editor';

import { FormItem } from '../form-item';
import { Feedback } from '../feedback';
import { JsonSchema } from '../../typings';
import { useNodeRenderContext } from '../../hooks';
import { SafeDynamicValueInput, SafePromptEditorWithVariables } from '../safe-wrappers';

export function FormInputs() {
  const { readonly } = useNodeRenderContext();

  // Function to determine label width based on field name
  const getLabelWidth = (fieldName: string) => {
    // For longer field names, increase the label width
    if (fieldName === 'systemPrompt') {
      return 140; // Increased width for systemPrompt
    }
    if (fieldName === 'apiHost') {
      return 130; // Increased width for apiHost
    }
    if (fieldName === 'modelName') {
      return 125; // Increased width for modelName
    }
    if (fieldName === 'temperature') {
      return 125; // Increased width for temperature
    }
    if (fieldName === 'apiKey') {
      return 120; // Increased width for apiKey
    }
    if (fieldName === 'prompt') {
      return 120; // Increased width for prompt
    }
    return 118; // Default width for other fields
  };

  return (
    <Field<JsonSchema> name="inputs">
      {({ field: inputsField }) => {
        const required = inputsField.value?.required || [];
        const properties = inputsField.value?.properties;
        if (!properties) {
          return <></>;
        }
        const content = Object.keys(properties).map((key) => {
          const property = properties[key];

          const formComponent = property.extra?.formComponent;

          const vertical = ['prompt-editor'].includes(formComponent || '');

          return (
            <Field key={key} name={`inputsValues.${key}`} defaultValue={property.default}>
              {({ field, fieldState }) => (
                <FormItem
                  name={key}
                  vertical={vertical}
                  type={property.type as string}
                  required={required.includes(key)}
                  labelWidth={getLabelWidth(key)}
                >
                  {formComponent === 'prompt-editor' && (
                    <SafePromptEditorWithVariables
                      value={field.value}
                      onChange={field.onChange}
                      readonly={readonly}
                      hasError={Object.keys(fieldState?.errors || {}).length > 0}
                    />
                  )}
                  {!formComponent && (
                    <SafeDynamicValueInput
                      value={field.value}
                      onChange={field.onChange}
                      readonly={readonly}
                      hasError={Object.keys(fieldState?.errors || {}).length > 0}
                      schema={property}
                    />
                  )}
                  <Feedback errors={fieldState?.errors} warnings={fieldState?.warnings} />
                </FormItem>
              )}
            </Field>
          );
        });
        return <>{content}</>;
      }}
    </Field>
  );
}
