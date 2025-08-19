import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Prompts: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Prompts
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Prompt management and optimization interface coming soon...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This page will include tools for developing, optimizing, and version controlling prompts with template management.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Prompts;