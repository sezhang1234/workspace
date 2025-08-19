import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Agents: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        AI Agents
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Agent development and debugging interface coming soon...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This page will include features for creating, configuring, and testing AI agents with real-time debugging capabilities.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Agents;