import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Avatar,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';
import axios from 'axios';

interface UserSettings {
  email: string;
  username: string;
  full_name: string;
  avatar_url?: string;
}

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    workflow_completion: boolean;
    agent_errors: boolean;
  };
  security: {
    two_factor_auth: boolean;
    session_timeout: number;
  };
}

const Settings: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });

  const [userSettings, setUserSettings] = useState<UserSettings>({
    email: user?.email || '',
    username: user?.username || '',
    full_name: user?.full_name || '',
    avatar_url: user?.avatar_url || '',
  });

  const [appSettings, setAppSettings] = useState<AppSettings>({
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      workflow_completion: true,
      agent_errors: true,
    },
    security: {
      two_factor_auth: false,
      session_timeout: 30,
    },
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    // Load user settings from backend
    loadUserSettings();
    // Load app settings from localStorage
    loadAppSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const response = await axios.get('/users/me');
      const userData = response.data;
      setUserSettings({
        email: userData.email,
        username: userData.username,
        full_name: userData.full_name || '',
        avatar_url: userData.avatar_url || '',
      });
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  const loadAppSettings = () => {
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      setAppSettings(JSON.parse(savedSettings));
    }
  };

  const saveUserSettings = async () => {
    setLoading(true);
    try {
      const response = await axios.put('/users/me', userSettings);
      setUser(response.data);
      showSnackbar('Profile updated successfully', 'success');
    } catch (error: any) {
      showSnackbar(error.response?.data?.detail || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveAppSettings = () => {
    localStorage.setItem('app-settings', JSON.stringify(appSettings));
    showSnackbar('Settings saved successfully', 'success');
  };

  const changePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      showSnackbar('New passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      await axios.put('/users/me', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      
      showSnackbar('Password changed successfully', 'success');
    } catch (error: any) {
      showSnackbar(error.response?.data?.detail || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                Profile Settings
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={userSettings.avatar_url}
                  sx={{ width: 80, height: 80, mr: 2 }}
                >
                  {userSettings.full_name?.[0] || userSettings.username?.[0]}
                </Avatar>
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                >
                  <input hidden accept="image/*" type="file" />
                  <PhotoCameraIcon />
                </IconButton>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={userSettings.full_name}
                    onChange={(e) => setUserSettings({ ...userSettings, full_name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={userSettings.username}
                    onChange={(e) => setUserSettings({ ...userSettings, username: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={userSettings.email}
                    onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
                    type="email"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={saveUserSettings}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                Security Settings
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Change Password
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type="password"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                    />
                  </Grid>
                </Grid>
                <Button
                  variant="outlined"
                  onClick={changePassword}
                  disabled={loading || !passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password}
                  sx={{ mt: 2 }}
                >
                  Change Password
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={appSettings.security.two_factor_auth}
                    onChange={(e) => setAppSettings({
                      ...appSettings,
                      security: { ...appSettings.security, two_factor_auth: e.target.checked }
                    })}
                  />
                }
                label="Enable Two-Factor Authentication"
              />

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Session Timeout: {appSettings.security.session_timeout} minutes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* App Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                Application Settings
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    <PaletteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Appearance
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={appSettings.theme === 'dark'}
                        onChange={(e) => setAppSettings({
                          ...appSettings,
                          theme: e.target.checked ? 'dark' : 'light'
                        })}
                      />
                    }
                    label="Dark Mode"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Notifications
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Email Notifications" />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={appSettings.notifications.email}
                          onChange={(e) => setAppSettings({
                            ...appSettings,
                            notifications: { ...appSettings.notifications, email: e.target.checked }
                          })}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Push Notifications" />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={appSettings.notifications.push}
                          onChange={(e) => setAppSettings({
                            ...appSettings,
                            notifications: { ...appSettings.notifications, push: e.target.checked }
                          })}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Workflow Completion" />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={appSettings.notifications.workflow_completion}
                          onChange={(e) => setAppSettings({
                            ...appSettings,
                            notifications: { ...appSettings.notifications, workflow_completion: e.target.checked }
                          })}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Agent Errors" />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={appSettings.notifications.agent_errors}
                          onChange={(e) => setAppSettings({
                            ...appSettings,
                            notifications: { ...appSettings.notifications, agent_errors: e.target.checked }
                          })}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={saveAppSettings}
                >
                  Save Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;