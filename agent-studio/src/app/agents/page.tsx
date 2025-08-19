import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import AppShell from '@/components/layout/AppShell';

export default function AgentsPage() {
  return (
    <AppShell title="代理列表">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="h5" gutterBottom>
          代理
        </Typography>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ color: 'text.secondary' }}>
            这里将展示代理卡片列表（占位）。
          </Box>
        </Paper>
      </Container>
    </AppShell>
  );
}

