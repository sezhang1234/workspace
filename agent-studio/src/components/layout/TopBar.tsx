'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/AutoAwesome';
import Link from 'next/link';

export default function TopBar() {
  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="logo" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Agent Studio
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button color="inherit" component={Link} href="/agents">
            Agents
          </Button>
          <Button color="inherit" component={Link} href="/agents/1">
            Canvas
          </Button>
          <Button color="inherit" component={Link} href="https://mui.com" target="_blank">
            MUI Docs
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

