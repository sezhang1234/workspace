import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Download, Upload } from 'lucide-react';
import { Button, Card, CardContent, Typography, Snackbar, Alert } from '@mui/material';
import { Editor } from '../../../packages/workflow-canvas/src/editor';

const WorkflowCanvasPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const workflowData = location.state?.workflowData || {};
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleSave = () => {
    // TODO: Implement save functionality with FlowGram.AI
    setSnackbar({ open: true, message: '工作流保存成功！', severity: 'success' });
  };

  const handleExport = () => {
    // TODO: Implement export functionality with FlowGram.AI
    const exportData = {
      name: workflowData.name || 'workflow',
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${exportData.name || 'workflow'}.json`;
    link.click();
    
    setSnackbar({ open: true, message: '工作流导出成功！', severity: 'success' });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          // TODO: Implement import functionality with FlowGram.AI
          setSnackbar({ open: true, message: '工作流配置导入成功', severity: 'success' });
        } catch (error) {
          setSnackbar({ open: true, message: '导入失败：文件格式错误', severity: 'error' });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outlined"
              startIcon={<ArrowLeft />}
              onClick={() => navigate('/workflows')}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              返回工作流列表
            </Button>
            <div>
              <Typography variant="h5" className="text-gray-900 font-semibold">
                {workflowData.name || '新建工作流'}
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                使用 FlowGram.AI 构建智能工作流
              </Typography>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Import Button */}
            <Button
              variant="outlined"
              startIcon={<Upload />}
              onClick={() => document.getElementById('import-file')?.click()}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              导入工作流
            </Button>
            <input
              id="import-file"
              type="file"
              hidden
              accept=".json"
              onChange={handleImport}
            />
            
            {/* Export Button */}
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExport}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              导出工作流
            </Button>
            
            {/* Save Button */}
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            >
              保存工作流
            </Button>
          </div>
        </div>
      </div>

      {/* Workflow Canvas */}
      <div className="p-6">
        <Card className="shadow-lg border-0">
          <CardContent className="p-0">
            <div className="w-full h-[calc(100vh-200px)]">
              <Editor />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default WorkflowCanvasPage;