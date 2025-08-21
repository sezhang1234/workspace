/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { DynamicValueInput, PromptEditorWithVariables, JsonEditorWithVariables } from '@flowgram.ai/form-materials';

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