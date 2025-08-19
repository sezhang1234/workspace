import TopBar from '@/components/layout/TopBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AgentCanvas from '@/components/AgentCanvas';
import InspectorPanel from '@/components/InspectorPanel';

export default function AgentDetailPage() {
  return (
    <main>
      <TopBar />
      <Container maxWidth={false} disableGutters>
        <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 1fr' }}>
          <Box>
            <AgentCanvas />
          </Box>
          <Box>
            <InspectorPanel />
          </Box>
        </Box>
      </Container>
    </main>
  );
}

