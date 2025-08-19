'use client';

import { ReactNode } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

type AppShellProps = {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export default function AppShell({ title = 'Agent Studio', actions, children }: AppShellProps) {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>{title}</Typography>
          {actions}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/agents">
                <ListItemIcon><AutoAwesomeIcon /></ListItemIcon>
                <ListItemText primary="代理" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/datasets">
                <ListItemIcon><Inventory2Icon /></ListItemIcon>
                <ListItemText primary="数据集" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/tools">
                <ListItemIcon><BuildIcon /></ListItemIcon>
                <ListItemText primary="工具" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="#">
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                <ListItemText primary="设置" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Button fullWidth variant="contained" component={Link} href="/agents/1">新建代理</Button>
          </Box>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

