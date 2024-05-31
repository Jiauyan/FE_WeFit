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
} from "@mui/material";

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
            const method = 'post'
            const route = `auth/registerAcc`
            const formData = { email, password }

            const response = await ApiTemplate(method, route, formData)

            const uid = response.data.uid;
            setSignupStatus(response.data.message);
            navigate('/completeProfile', { state: { uid }} );
        } catch (error) {
            if (axios.isAxiosError(error)) {
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
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
              />
              <GradientButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register
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
