/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { Field } from '@flowgram.ai/free-layout-editor';
import { Input, Switch, InputNumber } from '@douyinfe/semi-ui';
import classNames from 'classnames';

import { useNodeRenderContext } from '../../../hooks';
import { SafeCodeEditor, SafeDisplaySchemaTag } from '../../../form-components/safe-wrappers';

import styles from './index.module.less';

interface TestRunFormProps {
  values: Record<string, any>;
  setValues: (values: Record<string, any>) => void;
}

interface Field {
  name: string;
  type: string;
  value: any;
  required: boolean;
  itemsType?: string;
  onChange: (value: any) => void;
}

export function TestRunForm({ values, setValues }: TestRunFormProps) {
  const { readonly } = useNodeRenderContext();

  const fields: Field[] = Object.keys(values).map((key) => ({
    name: key,
    type: typeof values[key],
    value: values[key],
    required: false, // You can add logic to determine if a field is required
    onChange: (value: any) => {
      setValues({ ...values, [key]: value });
    },
  }));

  const renderField = (field: Field) => {
    switch (field.type) {
      case 'boolean':
        return (
          <div className={styles.fieldInput}>
            <Switch checked={field.value} onChange={(checked) => field.onChange(checked)} />
          </div>
        );
      case 'integer':
        return (
          <div className={styles.fieldInput}>
            <InputNumber
              precision={0}
              value={field.value}
              onChange={(value) => field.onChange(value)}
              placeholder="Please input integer"
            />
          </div>
        );
      case 'number':
        return (
          <div className={styles.fieldInput}>
            <InputNumber
              value={field.value}
              onChange={(value) => field.onChange(value)}
              placeholder="Please input number"
            />
          </div>
        );
      case 'object':
        return (
          <div className={classNames(styles.fieldInput, styles.codeEditorWrapper)}>
            <SafeCodeEditor
              languageId="json"
              value={field.value}
              onChange={(value) => field.onChange(value)}
            />
          </div>
        );
      case 'array':
        return (
          <div className={classNames(styles.fieldInput, styles.codeEditorWrapper)}>
            <SafeCodeEditor
              languageId="json"
              value={field.value}
              onChange={(value) => field.onChange(value)}
            />
          </div>
        );
      default:
        return (
          <div className={styles.fieldInput}>
            <Input
              value={field.value}
              onChange={(value) => field.onChange(value)}
              placeholder="Please input text"
            />
          </div>
        );
    }
  };

  // Show empty state if no fields
  if (fields.length === 0) {
    return (
      <div className={styles.formContainer}>
        <div className={styles.emptyState}>
          <div className={styles.emptyText}>Empty</div>
          <div className={styles.emptyText}>No inputs found in start node</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      {fields.map((field) => (
        <div key={field.name} className={styles.fieldGroup}>
          <label htmlFor={field.name} className={styles.fieldLabel}>
            {field.name}
            {field.required && <span className={styles.requiredIndicator}>*</span>}
            <span className={styles.fieldTypeIndicator}>
              <SafeDisplaySchemaTag
                value={{
                  type: field.type,
                  items: field.itemsType
                    ? {
                        type: field.itemsType,
                      }
                    : undefined,
                }}
              />
            </span>
          </label>
          {renderField(field)}
        </div>
      ))}
    </div>
  );
}
