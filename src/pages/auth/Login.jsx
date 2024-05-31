import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios'; 
import { useUser } from '../../contexts/UseContext';
import {
    Grid,
    Box,
    Typography,
    TextField,
    FormControlLabel,
    Button,
    Link,
    Paper,
    Checkbox,
} from "@mui/material";

import { GradientButton } from '../../contexts/ThemeProvider';
import loginBackground from "../../assets/loginBackground.png";

export function Login () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loginStatus, setLoginStatus] = useState('');
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();
    const { updateUser, login } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        if (!email) {
          setEmailError("Email is required");
          return false;
        } else {
          setEmailError("");
        }
        if (!password) {
          setPasswordError("Password is required");
          return false;
        } else {
          setPasswordError("");
        }
        
        try {
          const formData = { email, password }
          await login(formData)
          navigate('/');
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            setLoginStatus(error);
          } else {
            setLoginStatus('An error occurred');
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
            backgroundImage: `url(${loginBackground})`,
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
              Login Account
            </Typography>
            <Typography component="h6" variant="h6" sx={{ fontWeight: 300, fontSize: '0.875rem' }} margin={1}>
              Enter to continue and explore within your grasp
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1,width: '100%' }}>
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
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', width: '100%' }}>
                {/* <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                /> */}
                <Link href="/forgotPassword" variant="body2">
                  Forgot password?
                </Link>
              </Box>
              <GradientButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </GradientButton>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign up"}
                </Link>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

    );
};

