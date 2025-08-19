'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Upload as UploadIcon,
  Description as DescriptionIcon,
  TableChart as TableChartIcon,
  Code as CodeIcon,
  PictureAsPdf as PdfIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { useAgentStore } from '@/store/agentStore';
import AppShell from '@/components/layout/AppShell';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

export default function DatasetsPage() {
  const { datasets, createDataset, deleteDataset, updateDataset } = useAgentStore();
  const { enqueueSnackbar } = useSnackbar();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [datasetToDelete, setDatasetToDelete] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const filteredDatasets = datasets.filter((dataset) => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || dataset.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <DescriptionIcon />;
      case 'csv':
        return <TableChartIcon />;
      case 'json':
        return <CodeIcon />;
      case 'pdf':
        return <PdfIcon />;
      default:
        return <DescriptionIcon />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'text':
        return 'primary';
      case 'csv':
        return 'success';
      case 'json':
        return 'warning';
      case 'pdf':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadDialogOpen(false);
          enqueueSnackbar('数据集上传成功', { variant: 'success' });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDelete = (datasetId: string) => {
    setDatasetToDelete(datasetId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (datasetToDelete) {
      deleteDataset(datasetToDelete);
      enqueueSnackbar('数据集已删除', { variant: 'success' });
      setDeleteDialogOpen(false);
      setDatasetToDelete(null);
    }
  };

  const stats = {
    total: datasets.length,
    text: datasets.filter(d => d.type === 'text').length,
    csv: datasets.filter(d => d.type === 'csv').length,
    json: datasets.filter(d => d.type === 'json').length,
    pdf: datasets.filter(d => d.type === 'pdf').length,
  };

  return (
    <AppShell title="数据集管理">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              数据集管理
            </Typography>
            <Typography variant="body2" color="text.secondary">
              管理和组织您的知识库数据
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setUploadDialogOpen(true)}
            size="large"
          >
            上传数据集
          </Button>
        </Box>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={2}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                总数据集
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main">
                {stats.text}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                文本文件
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {stats.csv}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                CSV 文件
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {stats.json}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                JSON 文件
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {stats.pdf}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                PDF 文件
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="搜索数据集..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>类型</InputLabel>
            <Select
              value={typeFilter}
              label="类型"
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="all">全部</MenuItem>
              <MenuItem value="text">文本</MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="json">JSON</MenuItem>
              <MenuItem value="pdf">PDF</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Datasets Grid */}
        <Grid container spacing={3}>
          {filteredDatasets.map((dataset) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={dataset.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ color: `${getTypeColor(dataset.type)}.main`, mr: 1 }}>
                      {getTypeIcon(dataset.type)}
                    </Box>
                    <Typography variant="h6" component="h3" noWrap>
                      {dataset.name}
                    </Typography>
                  </Box>
                  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {dataset.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip
                      label={dataset.type.toUpperCase()}
                      color={getTypeColor(dataset.type) as any}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(dataset.size)}
                    </Typography>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    更新于 {format(new Date(dataset.updatedAt), 'yyyy-MM-dd HH:mm')}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Box>
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <DownloadIcon />
                    </IconButton>
                  </Box>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(dataset.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredDatasets.length === 0 && (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <CloudUploadIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              没有找到数据集
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {searchTerm || typeFilter !== 'all' 
                ? '尝试调整搜索条件或筛选器'
                : '上传您的第一个数据集开始使用'
              }
            </Typography>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => setUploadDialogOpen(true)}
            >
              上传数据集
            </Button>
          </Card>
        )}

        {/* Upload Dialog */}
        <Dialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>上传数据集</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="数据集名称"
                placeholder="输入数据集名称"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="描述"
                multiline
                rows={3}
                placeholder="描述数据集的内容和用途"
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>数据类型</InputLabel>
                <Select label="数据类型" defaultValue="text">
                  <MenuItem value="text">文本文件</MenuItem>
                  <MenuItem value="csv">CSV 文件</MenuItem>
                  <MenuItem value="json">JSON 文件</MenuItem>
                  <MenuItem value="pdf">PDF 文件</MenuItem>
                </Select>
              </FormControl>
              
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  拖拽文件到此处或点击上传
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  支持 .txt, .csv, .json, .pdf 格式，最大 100MB
                </Typography>
              </Box>

              {uploadProgress > 0 && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    上传进度: {uploadProgress}%
                  </Typography>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUploadDialogOpen(false)}>取消</Button>
            <Button onClick={handleUpload} variant="contained">
              上传
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>确认删除</DialogTitle>
          <DialogContent>
            <Typography>
              确定要删除这个数据集吗？此操作无法撤销。
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              删除
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AppShell>
  );
}