import React from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  SmartToy as AgentIcon,
  AccountTree as WorkflowIcon,
  Chat as PromptIcon,
  ModelTraining as ModelIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <AgentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'AI Agent Development',
      description: 'Create, configure, and debug intelligent AI agents with powerful tools and frameworks.',
    },
    {
      icon: <WorkflowIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Visual Workflow Design',
      description: 'Build complex workflows using our intuitive canvas-based orchestration system.',
    },
    {
      icon: <PromptIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Prompt Management',
      description: 'Develop, optimize, and version control your prompts with advanced templates.',
    },
    {
      icon: <ModelIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Model Management',
      description: 'Configure and manage multiple AI models from various providers seamlessly.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Enterprise Security',
      description: 'Built with security in mind, supporting authentication and role-based access.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'High Performance',
      description: 'Optimized for speed and scalability, handling complex AI workflows efficiently.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h2" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Jiuwen Agent Studio
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              The ultimate platform for developing, orchestrating, and managing AI agents
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" sx={{ textAlign: 'center', mb: 6 }}>
          Powerful Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
              Ready to build the future of AI?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of developers creating intelligent AI solutions
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              Start Building Today
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Welcome;