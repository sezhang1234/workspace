import TopBar from '@/components/layout/TopBar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <TopBar />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Welcome to Agent Studio
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Build agent workflows with a canvas powered by React Flow and a MUI interface.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" component={Link} href="/agents/1">
            Open Canvas
          </Button>
          <Button variant="outlined" component={Link} href="/agents">
            Browse Agents
          </Button>
        </Box>
      </Container>
    </main>
  );
}
