import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';

export default function Home() {
  return (
    <AppShell title="Agent Studio">
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          欢迎使用 Agent Studio
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          使用 React Flow 画布与 MUI 界面，搭建你的智能体工作流。
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" component={Link} href="/agents/1">
            打开画布
          </Button>
          <Button variant="outlined" component={Link} href="/agents">
            浏览代理
          </Button>
        </Box>
      </Container>
    </AppShell>
  );
}
