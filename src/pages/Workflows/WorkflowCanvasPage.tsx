import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { Editor } from '../../../packages/workflow-canvas/src/editor';

const WorkflowCanvasPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const workflowData = location.state?.workflowData || {};


  // Note: Save, Import, and Export functionality is now handled in the bottom control panel
  // via the WorkflowOperations component

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outlined"
              startIcon={<ArrowLeft />}
              onClick={() => {
                // Check if there are unsaved changes
                if (window.confirm('确定要离开吗？未保存的更改将会丢失。')) {
                  navigate('/workflows');
                }
              }}
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
            {/* Workflow Status */}
            <div className="text-sm text-gray-500">
              工作流状态: 编辑中
            </div>
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

      {/* Note: Notifications for workflow operations are handled in the bottom control panel */}
    </div>
  );
};

export default WorkflowCanvasPage;