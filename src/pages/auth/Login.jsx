import React, { useState , useEffect} from 'react';
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
    InputAdornment,
    IconButton
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { GradientButton } from '../../contexts/ThemeProvider';
import loginBackground from "../../assets/loginBackground.png";

export function Login () {
    const [email, setEmail] = useState('');
    const [checkUserEmail, setCheckUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loginStatus, setLoginStatus] = useState('');
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();
    
    const { updateUser, login, signInWithGoogle } = useUser();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
      axios.post('http://localhost:3000/auth/checkUserEmail',{
        email : email
      })
        .then(response => {
          console.log(response.data);
          setCheckUserEmail(response.data);
        })
        .catch(error => console.error('There was an error!', error));
    }, [email]);

    const handleTogglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        // Example: password should be at least 6 characters long
        return password.length >= 6;
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
          setPasswordError("Password must be at least 6 characters long");
          isValid = false;
        } else {
          setPasswordError("");
        }

        if (!isValid) return;
        
        try {
          const formData = { email, password }
          const response = await login(formData)
          const redirectPath = response.data.userRole === 'Student' ? '/dashboard' : '/trainerDashboard';
          console.log(redirectPath);
          navigate(`${redirectPath}`);
        } catch (error) {
          if (error.response.data.details === 'Firebase: Error (auth/invalid-credential).' && checkUserEmail == true) {
            setPasswordError("Incorrect password");
            setLoginStatus(error);
          } else if (error.response.data.details === 'Firebase: Error (auth/invalid-credential).' && checkUserEmail == false){
            setEmailError("Incorrect email");
            setLoginStatus(error);
          }else if (axios.isAxiosError(error) && error.response?.status === 401) {
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
            backgroundSize: 'cover',
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
                autoComplete="current-email"
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
              autoComplete="current-password"
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', width: '100%' }}>
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

