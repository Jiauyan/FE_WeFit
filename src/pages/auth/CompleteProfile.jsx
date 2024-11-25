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
  FormHelperText,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { GradientButton } from '../../contexts/ThemeProvider';
import backGround from '../../assets/backGround.png';
import { ApiTemplate } from '../../api';

export function CompleteProfile() {
  const [formValues, setFormValues] = useState({
    name: '',
    username: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    role: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const navigate = useNavigate();
  const location = useLocation();
  const uid = location.state?.uid;

  const handleCloseNotification = () => setNotification({ ...notification, open: false });

  const validateForm = () => {
    const errors = {};

    if (!formValues.role) errors.role = 'Role is required';
    if (!formValues.name.trim()) errors.name = 'Name is required';
    if (!formValues.username.trim()) errors.username = 'Username is required';
    if (!formValues.age || formValues.age <= 0) errors.age = 'Age must be a positive number';
    if (!formValues.gender) errors.gender = 'Gender is required';
    if (!formValues.weight || formValues.weight <= 0) errors.weight = 'Weight must be a positive number';
    if (!formValues.height || formValues.height <= 0) errors.height = 'Height must be a positive number';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const method = 'post';
      const route = `auth/completeProfile/${uid}`;
      const response = await ApiTemplate(method, route, formValues);

      setNotification({ open: true, message: 'Profile completed successfully!', severity: 'success' });

      setTimeout(() => {
        navigate(formValues.role === 'Student' ? '/fitnessLevel' : '/login', { state: { uid } });
      }, 1000);
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data.message || 'An error occurred' : 'Unexpected error occurred';
      setNotification({ open: true, message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormValues({ ...formValues, [field]: value });
    if (formErrors[field]) setFormErrors({ ...formErrors, [field]: '' });
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
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <FormControl required fullWidth margin="normal" error={!!formErrors.role}>
            <InputLabel>Role</InputLabel>
            <Select
              value={formValues.role}
              onChange={(e) => handleChange('role', e.target.value)}
            >
              <MenuItem value="Trainer">Trainer</MenuItem>
              <MenuItem value="Student">Student</MenuItem>
            </Select>
            <FormHelperText>{formErrors.role}</FormHelperText>
          </FormControl>
          {['name', 'username', 'age', 'weight', 'height'].map((field) => (
            <TextField
              key={field}
              margin="normal"
              required
              fullWidth
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              type={['age', 'weight', 'height'].includes(field) ? 'number' : 'text'}
              value={formValues[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              error={!!formErrors[field]}
              helperText={formErrors[field]}
              inputProps={field === 'age' ? { min: 1, max: 100 } : { min: 0 }}
            />
          ))}
          <FormControl required fullWidth margin="normal" error={!!formErrors.gender}>
            <InputLabel>Gender</InputLabel>
            <Select
              value={formValues.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
            <FormHelperText>{formErrors.gender}</FormHelperText>
          </FormControl>
          <GradientButton type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : formValues.role === 'Student' ? 'Next' : 'Confirm'}
          </GradientButton>
        </Box>
      </Paper>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </MuiAlert>
      </Snackbar>
    </Grid>
  );
}
