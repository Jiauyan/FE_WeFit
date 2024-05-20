import React, { useState } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios'; 
import { useUser } from '../../UseContext';
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

export function Login () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loginStatus, setLoginStatus] = useState('');
    const navigate = useNavigate();
    const { updateUser } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault(); 
    
        try {
          const response = await axios.post('http://localhost:3000/auth/loginAcc', {
            email,
            password,
          });
          const uid = response.data.uid;
          setLoginStatus(response.data.message);
          const token = {
            accessToken : response.data.stsTokenManager.accessToken,
            refreshToken : response.data.stsTokenManager.refreshToken,
          }
          localStorage.setItem('accessToken', token.accessToken);
          localStorage.setItem('refreshToken', token.refreshToken);
          updateUser({ uid }); 
          navigate('/', { state: { uid } });
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            setLoginStatus('Login failed');
          } else {
            setLoginStatus('An error occurred');
          }
        }
      };
    
    return (
        <Grid>
        <Grid></Grid>
            <Typography component="h1" variant="h5">
                Login to your Account 
            </Typography>
            <Typography component="h6" variant="h6">
                Enter to continue and explore within your grasp
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            
            <TextField
                    margin="normal"
                    //required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                    margin="normal"
                    //required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
             control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
            <Link href="/forgotPassword" variant="body2">
                    Forgot password?
            </Link>

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Login
            </Button>
                <Link href="/register" variant="body2">
                    {"Don't have an account? Sign up"}
                </Link>
        </Box>
       </Grid>
    );
};

