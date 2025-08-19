'use client';

import { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import LinearProgress from '@mui/material/LinearProgress';
import AppShell from '@/components/layout/AppShell';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

// Mock data for knowledge sources
const mockKnowledgeSources = [
  {
    id: '1',
    name: '产品手册.pdf',
    type: 'document',
    size: '2.3 MB',
    status: 'processed',
    uploadedAt: '2024-01-15',
    description: '公司产品详细说明文档',
  },
  {
    id: '2',
    name: '客户数据.csv',
    type: 'dataset',
    size: '1.1 MB',
    status: 'processing',
    uploadedAt: '2024-01-18',
    description: '客户信息和交易记录',
  },
  {
    id: '3',
    name: 'API 文档',
    type: 'url',
    size: '-',
    status: 'processed',
    uploadedAt: '2024-01-10',
    description: '外部 API 接口文档链接',
  },
  {
    id: '4',
    name: 'FAQ 知识库.txt',
    type: 'document',
    size: '156 KB',
    status: 'error',
    uploadedAt: '2024-01-20',
    description: '常见问题解答',
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'document':
      return <DescriptionIcon />;
    case 'dataset':
      return <TableChartIcon />;
    case 'url':
      return <LinkIcon />;
    default:
      return <DescriptionIcon />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'processed':
      return <CheckCircleIcon color="success" />;
    case 'processing':
      return <LinearProgress sx={{ width: 20 }} />;
    case 'error':
      return <ErrorIcon color="error" />;
    default:
      return <ErrorIcon color="error" />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'processed':
      return '已处理';
    case 'processing':
      return '处理中';
    case 'error':
      return '处理失败';
    default:
      return '未知';
  }
};

export default function KnowledgePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, sourceId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedSourceId(sourceId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSourceId(null);
  };

  const filteredSources = mockKnowledgeSources.filter(source =>
    source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell title="知识库">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            知识库
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setUploadDialogOpen(true)}
          >
            添加知识源
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="搜索知识源..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Grid container spacing={3}>
          {filteredSources.map((source) => (
            <Grid item xs={12} sm={6} md={4} key={source.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {getTypeIcon(source.type)}
                    <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                      {source.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, source.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {source.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                    <Chip
                      label={source.type}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={source.size}
                      size="small"
                      variant="outlined"
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                      {getStatusIcon(source.status)}
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    上传于 {source.uploadedAt}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<EditIcon />}>
                    编辑
                  </Button>
                  <Button size="small" startIcon={<CloudUploadIcon />}>
                    重新处理
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>编辑</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>删除</ListItemText>
          </MenuItem>
        </Menu>

        <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>添加知识源</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>知识源类型</InputLabel>
                <Select label="知识源类型" defaultValue="document">
                  <MenuItem value="document">文档</MenuItem>
                  <MenuItem value="dataset">数据集</MenuItem>
                  <MenuItem value="url">URL</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="名称"
                placeholder="输入知识源名称"
              />
              <TextField
                fullWidth
                label="描述"
                multiline
                rows={3}
                placeholder="描述知识源内容"
              />
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                选择文件
                <input type="file" hidden />
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUploadDialogOpen(false)}>取消</Button>
            <Button variant="contained" onClick={() => setUploadDialogOpen(false)}>
              上传
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AppShell>
  );
}