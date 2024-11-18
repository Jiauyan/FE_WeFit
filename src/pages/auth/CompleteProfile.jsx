import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  TextField,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { GradientButton } from '../../contexts/ThemeProvider';
import backGround from '../../assets/backGround.png';
import { ApiTemplate } from '../../api';

export function CompleteProfile() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState(null);
  const [height, setHeight] = useState(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const navigate = useNavigate();
  const location = useLocation();
  const uid = location.state?.uid;

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = 'post';
      const route = `auth/completeProfile/${uid}`;
      const formData = { role, name, username, age, gender, weight, height };

      const response = await ApiTemplate(method, route, formData);

      if (role !== 'Student') {
        setNotification({ open: true, message: "Register successful!", severity: 'success' });
      }

      setTimeout(() => {
        navigate(role === 'Student' ? '/fitnessLevel' : '/login', { state: { uid } });
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setNotification({
          open: true,
          message: error.response?.data.message || 'An error occurred',
          severity: 'error',
        });
      } else {
        setNotification({ open: true, message: 'An unexpected error occurred', severity: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      component="main"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
        width: '100%',
        backgroundImage: `url(${backGround})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        minHeight: '100vh', // Ensure it covers at least the height of the viewport
        '@media (max-width: 768px)': {
          backgroundSize: 'contain', // Adjust background size on smaller screens
        }
      }}
    >
      <Paper
        sx={{
          width: { xs: '100%', sm: '90%', md: '80%', lg: '737px' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          padding: 2,
          margin: 'auto',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }} margin={1}>
          Let's complete your profile
        </Typography>
        <Typography component="h6" variant="h6" sx={{ fontWeight: 300, fontSize: '0.875rem' }} margin={1}>
          It will help us to know more about you!
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value)} required>
              <MenuItem value="Trainer">Trainer</MenuItem>
              <MenuItem value="Student">Student</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Age"
            type="number"
            value={age || ''}
            onChange={(e) => setAge(e.target.value === '' ? null : parseFloat(e.target.value))}
            inputProps={{ min: 1, max: 100 }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Gender</InputLabel>
            <Select value={gender} onChange={(e) => setGender(e.target.value)} required>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Weight"
            type="number"
            value={weight || ''}
            onChange={(e) => setWeight(e.target.value === '' ? null : parseFloat(e.target.value))}
            inputProps={{ min: 0 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Height"
            type="number"
            value={height || ''}
            onChange={(e) => setHeight(e.target.value === '' ? null : parseFloat(e.target.value))}
            inputProps={{ min: 0 }}
          />
          <GradientButton type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : role === 'Student' ? 'Next' : 'Confirm'}
          </GradientButton>
        </Box>
      </Paper>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </MuiAlert>
      </Snackbar>
    </Grid>
  );
}
