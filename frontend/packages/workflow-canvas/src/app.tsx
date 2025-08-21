/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { createRoot } from 'react-dom/client';

import { Editor } from './editor';

const root = document.getElementById('root');
if (root) {
  const app = createRoot(root);
  app.render(<Editor />);
}
