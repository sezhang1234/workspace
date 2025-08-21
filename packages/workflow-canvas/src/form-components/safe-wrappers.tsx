/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { 
  DynamicValueInput, 
  PromptEditorWithVariables, 
  JsonEditorWithVariables,
  CodeEditor,
  DisplaySchemaTag,
  DisplayOutputs,
  IJsonSchema,
  JsonSchemaEditor,
  provideJsonSchemaOutputs,
  syncVariableTitle,
  validateFlowValue,
  validateWhenVariableSync,
  listenRefSchemaChange,
  autoRenameRefEffect,
  createInferInputsPlugin,
  DisplayInputsValues,
  InputsValues,
  ConditionRow,
  ConditionRowValueType,
  AssignRows,
  createInferAssignPlugin
} from '@flowgram.ai/form-materials';

// Define IFlowValue type locally since it's not exported from form-materials
export type IFlowValue = any;

// Wrapper component to filter out problematic props like localeCode
export const SafeDynamicValueInput = (props: any) => {
  // Filter out localeCode and other props that shouldn't go to DOM elements
  const { localeCode, ...safeProps } = props;
  return <DynamicValueInput {...safeProps} />;
};

// Safe wrapper for PromptEditorWithVariables
export const SafePromptEditorWithVariables = (props: any) => {
  // Filter out localeCode and other props that shouldn't go to DOM elements
  const { localeCode, ...safeProps } = props;
  return <PromptEditorWithVariables {...safeProps} />;
};

// Safe wrapper for JsonEditorWithVariables
export const SafeJsonEditorWithVariables = (props: any) => {
  // Filter out localeCode and other props that shouldn't go to DOM elements
  const { localeCode, ...safeProps } = props;
  return <JsonEditorWithVariables {...safeProps} />;
};

// Safe wrapper for CodeEditor
export const SafeCodeEditor = (props: any) => {
  // Filter out localeCode and other props that shouldn't go to DOM elements
  const { localeCode, ...safeProps } = props;
  return <CodeEditor {...safeProps} />;
};

// Safe wrapper for DisplaySchemaTag
export const SafeDisplaySchemaTag = (props: any) => {
  // Filter out localeCode and other props that shouldn't go to DOM elements
  const { localeCode, ...safeProps } = props;
  return <DisplaySchemaTag {...safeProps} />;
};

// Safe wrapper for DisplayOutputs
export const SafeDisplayOutputs = (props: any) => {
  // Filter out localeCode and other props that shouldn't go to DOM elements
  const { localeCode, ...safeProps } = props;
  return <DisplayOutputs {...safeProps} />;
};

// Safe wrapper for JsonSchemaEditor
export const SafeJsonSchemaEditor = (props: any) => {
  // Filter out localeCode and other props that shouldn't go to DOM elements
  const { localeCode, ...safeProps } = props;
  return <JsonSchemaEditor {...safeProps} />;
};

// Safe wrapper for InputsValues
export const SafeInputsValues = (props: any) => {
  // Filter out localeCode and other props that shouldn't go to DOM elements
  const { localeCode, ...safeProps } = props;
  return <InputsValues {...safeProps} />;
};

// Safe wrapper for DisplayInputsValues
export const SafeDisplayInputsValues = (props: any) => {
  // Filter out localeCode and other props that shouldn't go to DOM elements
  const { localeCode, ...safeProps } = props;
  return <DisplayInputsValues {...safeProps} />;
};

// Safe wrapper for ConditionRow
export const SafeConditionRow = (props: any) => {
  // Filter out localeCode and other props that shouldn't go to DOM elements
  const { localeCode, ...safeProps } = props;
  return <ConditionRow {...safeProps} />;
};

// Safe wrapper for AssignRows
export const SafeAssignRows = (props: any) => {
  // Filter out localeCode and other props that shouldn't go to DOM elements
  const { localeCode, ...safeProps } = props;
  return <AssignRows {...safeProps} />;
};

// Export the utility functions as well
export {
  provideJsonSchemaOutputs,
  syncVariableTitle,
  validateFlowValue,
  validateWhenVariableSync,
  listenRefSchemaChange,
  autoRenameRefEffect,
  createInferInputsPlugin,
  createInferAssignPlugin,
  IJsonSchema
};