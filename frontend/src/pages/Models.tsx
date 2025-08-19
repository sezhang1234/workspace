import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as TestIcon,
} from '@mui/icons-material';
import axios from 'axios';

interface Model {
  id: number;
  name: string;
  provider: string;
  model_type: string;
  base_url?: string;
  config?: any;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
}

const Models: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });

  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    model_type: '',
    api_key: '',
    base_url: '',
    is_default: false,
  });

  const providers = [
    { value: 'openai', label: 'OpenAI' },
    { value: 'anthropic', label: 'Anthropic' },
    { value: 'google', label: 'Google' },
    { value: 'local', label: 'Local/Open Source' },
    { value: 'custom', label: 'Custom' },
  ];

  const modelTypes = {
    openai: ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo'],
    anthropic: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    google: ['gemini-pro', 'gemini-pro-vision'],
    local: ['llama-2', 'mistral', 'codellama'],
    custom: ['custom'],
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await axios.get('/models');
      setModels(response.data);
    } catch (error) {
      console.error('Error fetching models:', error);
      showSnackbar('Failed to fetch models', 'error');
    }
  };

  const handleOpenDialog = (model?: Model) => {
    if (model) {
      setEditingModel(model);
      setFormData({
        name: model.name,
        provider: model.provider,
        model_type: model.model_type,
        api_key: '',
        base_url: model.base_url || '',
        is_default: model.is_default,
      });
    } else {
      setEditingModel(null);
      setFormData({
        name: '',
        provider: '',
        model_type: '',
        api_key: '',
        base_url: '',
        is_default: false,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingModel(null);
    setFormData({
      name: '',
      provider: '',
      model_type: '',
      api_key: '',
      base_url: '',
      is_default: false,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editingModel) {
        await axios.put(`/models/${editingModel.id}`, formData);
        showSnackbar('Model updated successfully', 'success');
      } else {
        await axios.post('/models', formData);
        showSnackbar('Model created successfully', 'success');
      }
      fetchModels();
      handleCloseDialog();
    } catch (error: any) {
      showSnackbar(error.response?.data?.detail || 'Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (modelId: number) => {
    if (window.confirm('Are you sure you want to delete this model?')) {
      try {
        await axios.delete(`/models/${modelId}`);
        showSnackbar('Model deleted successfully', 'success');
        fetchModels();
      } catch (error: any) {
        showSnackbar(error.response?.data?.detail || 'Delete failed', 'error');
      }
    }
  };

  const handleTest = async (modelId: number) => {
    try {
      const response = await axios.post(`/models/${modelId}/test`, {
        test_prompt: 'Hello, this is a test message.',
      });
      showSnackbar(`Test successful: ${response.data.response}`, 'success');
    } catch (error: any) {
      showSnackbar(error.response?.data?.detail || 'Test failed', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          AI Models
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Model
        </Button>
      </Box>

      <Grid container spacing={3}>
        {models.map((model) => (
          <Grid item xs={12} sm={6} md={4} key={model.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    {model.name}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleTest(model.id)}
                      title="Test Model"
                    >
                      <TestIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(model)}
                      title="Edit Model"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(model.id)}
                      title="Delete Model"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={model.provider}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={model.model_type}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  {model.is_default && (
                    <Chip
                      label="Default"
                      size="small"
                      color="primary"
                      sx={{ mb: 1 }}
                    />
                  )}
                  {!model.is_active && (
                    <Chip
                      label="Inactive"
                      size="small"
                      color="error"
                      sx={{ mb: 1 }}
                    />
                  )}
                </Box>

                {model.base_url && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    URL: {model.base_url}
                  </Typography>
                )}

                <Typography variant="caption" color="text.secondary">
                  Created: {new Date(model.created_at).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Model Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingModel ? 'Edit Model' : 'Add New Model'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Model Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Provider</InputLabel>
                  <Select
                    value={formData.provider}
                    label="Provider"
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  >
                    {providers.map((provider) => (
                      <MenuItem key={provider.value} value={provider.value}>
                        {provider.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Model Type</InputLabel>
                  <Select
                    value={formData.model_type}
                    label="Model Type"
                    onChange={(e) => setFormData({ ...formData, model_type: e.target.value })}
                  >
                    {formData.provider && modelTypes[formData.provider as keyof typeof modelTypes]?.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="API Key"
                  type="password"
                  value={formData.api_key}
                  onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                  placeholder={editingModel ? 'Leave blank to keep current' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Base URL (Optional)"
                  value={formData.base_url}
                  onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
                  placeholder="https://api.openai.com/v1"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_default}
                      onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    />
                  }
                  label="Set as default model"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !formData.name || !formData.provider || !formData.model_type}
          >
            {loading ? 'Saving...' : (editingModel ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Models;