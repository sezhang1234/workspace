import TopBar from '@/components/layout/TopBar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

export default function AgentsPage() {
  return (
    <main>
      <TopBar />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="h5" gutterBottom>
          Agents
        </Typography>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ color: 'text.secondary' }}>
            This is a placeholder list. We will render agent cards here.
          </Box>
        </Paper>
      </Container>
    </main>
  );
}

