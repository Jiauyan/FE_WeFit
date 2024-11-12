import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import {
    Grid,
    CssBaseline,
    Box,
    Avatar,
    Typography,
    TextField,
    FormControlLabel,
    Button,
    Link,
    Paper,
    Container,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    InputAdornment,
    IconButton
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ApiTemplate } from '../../api';
import { GradientButton } from '../../contexts/ThemeProvider';
import registerBackground from "../../assets/registerBackground.png";

export function Register() {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signupStatus, setSignupStatus] = useState('');
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
      const hasUppercase = /[A-Z]/.test(password);
      const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      return password.length >= 6 && hasUppercase && hasSymbol;
    };

    const handleSubmit = async (e) => { 
        e.preventDefault(); 
        
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
          setPasswordError("Password must be at least 6 characters long, contain at least one uppercase letter and symbol.");
          isValid = false;
        } else {
          setPasswordError("");
        }

        if (!isValid) return;

        try {
            const method = 'post'
            const route = `auth/registerAcc`
            const formData = { email, password }

            const response = await ApiTemplate(method, route, formData)

            const uid = response.data.uid;
            setSignupStatus(response.data.message);
            navigate('/completeProfile', { state: { uid }} );
        } catch (error) { 
          console.log(error)
          if (error.response.data === 'Error while registering Account, Error: FirebaseError: Firebase: Error (auth/email-already-in-use).') {
          setEmailError("Email is already in use. Please choose another email.");
          setSignupStatus(error);
          } 
          else if (axios.isAxiosError(error)) {
                if (error.response) {
                    setSignupStatus(error.response.data.message || 'Registration failed with status code: ' + error.response.status);
                } else {
                    setSignupStatus('An error occurred');
                }
            } else {
                setSignupStatus('An unexpected error occurred');
            }
        }
    };


    return (
        <Grid container component="main" sx={{ height: '100vh', width: '100vw' }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
          sx={{
            backgroundImage: `url(${registerBackground})`,
            //backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          component={Paper}
          elevation={6}
          square
        >
          <Box
            sx={{
              my: 15,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }} margin={1}>
              Register Account
            </Typography>
            <Typography component="h6" variant="h6" sx={{ fontWeight: 300, fontSize: '0.875rem' }} margin={1}>
              Follow the instructions to make it easier to register and you will be able to explore inside.
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%'}}>
              <TextField
                required
                margin="normal"
                fullWidth
                id="email"
                label="Email"
                name="email"
                type= "email"
                onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
              <GradientButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Next
              </GradientButton>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Link href="/login" variant="body2">
                  {"Do you have account? Sign in"}
                 </Link>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    );
};
