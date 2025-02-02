import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import { useUser } from '../../contexts/UseContext';
import {
    Grid,
    Box,
    Typography,
    TextField,
    Link,
    Paper,
    InputAdornment,
    IconButton,
    Snackbar,
    CircularProgress
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { GradientButton } from '../../contexts/ThemeProvider';
import MuiAlert from '@mui/material/Alert';
import loginBackground from "../../assets/loginBackground.png";

export function Login() {
    const [email, setEmail] = useState('');
    const [checkUserEmail, setCheckUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' }); // Notification state

    const navigate = useNavigate();
    const { updateUser, login, signInWithGoogle } = useUser();

    const debouncedCheckEmail = debounce(async (email) => {
      if (!validateEmail(email)) {
        setCheckUserEmail(null); // Reset if invalid
        return;
      }
      try {
        const response = await axios.post('https://be-um-fitness.vercel.app/auth/checkUserEmail', { email });
        setCheckUserEmail(response.data);
      } catch (error) {
        console.error('Error checking email:', error);
      }
    }); 

      // Handle email input change
    const handleEmailChange = (e) => {
      const value = e.target.value;
      setEmail(value);
      setEmailError(""); // Clear error on input
      debouncedCheckEmail(value); // Trigger debounce function
    };

    const handleTogglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
      return password.length >= 6;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Clear errors at the beginning of the validation
        setEmailError("");
        setPasswordError("");

        // Validation
        let isValid = true;
        if (!email) {
          setEmailError("Email is required");
          isValid = false;
        } else if (!validateEmail(email)) {
          setEmailError("Invalid email address");
          isValid = false;
        } else {
          setEmailError("");
        }

        if (!password) {
          setPasswordError("Password is required");
          isValid = false;
        } else if (!validatePassword(password)) {
          setPasswordError("Password must be at least 6 characters long");
          isValid = false;
        } else {
          setPasswordError("");
        }

        if (!isValid) return;

        setLoading(true); // Start loading
        try {
          const formData = { email, password };
          const response = await login(formData);
          const redirectPath = response.data.userRole === 'Student' ? '/dashboard' : '/trainerDashboard';
          setNotification({ open: true, message: 'Login successful!', severity: 'success' }); // Set success notification here
          setTimeout(() => { // Delay navigation
            navigate(`${redirectPath}`);
          }, 1000);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
        const errorDetails = error.response.data?.details;

        if (errorDetails?.includes('auth/invalid-credential')) {
          if (checkUserEmail) {
            setPasswordError("Incorrect password");
            setEmailError("");
          } else {
            setEmailError("No account found with this email");
            setPasswordError("");
          }
        } else {
          setNotification({
            open: true,
            message: error.response.data?.message || "An error occurred during login",
            severity: 'error',
          });
        }
      } else {
        setNotification({
          open: true,
          message: 'An unexpected error occurred. Please try again later.',
          severity: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };
    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    return (
      <Grid container component="main" sx={{ height: '100vh', width: '100vw' }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
          sx={{
            backgroundImage: `url(${loginBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
          <Box sx={{ my: 15, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }} margin={1}>
              Login Account
            </Typography>
            <Typography component="h6" variant="h6" sx={{ fontWeight: 300, fontSize: '0.875rem' }} margin={1}>
              Enter to continue and explore within your grasp
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField
                required
                margin="normal"
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="email"
                autoComplete="current-email"
                onChange={handleEmailChange}
                error={!!emailError}
                helperText={emailError}
              />
              <TextField
                required
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePasswordVisibility}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', width: '100%' }}>
                <Link href="/forgotPassword" variant="body2">
                  Forgot password?
                </Link>
              </Box>
              <GradientButton type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </GradientButton>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign up"}
                </Link>
              </Box>
            </Box>
          </Box>
        </Grid>

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