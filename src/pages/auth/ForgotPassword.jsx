import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate} from 'react-router-dom';
import {
    Grid,
    Box,
    Typography,
    TextField,
    Paper,
    Snackbar,
    CircularProgress
} from "@mui/material";
import { GradientButton } from '../../contexts/ThemeProvider';
import backGround from "../../assets/backGround.png";
import MuiAlert from '@mui/material/Alert';

export function ForgotPassword() {

    const [email, setEmail] = useState('');
    const [resetPasswordStatus, setResetPasswordStatus] = useState('');
    const [emailError, setEmailError] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' }); // Notification state
    const navigate = useNavigate();


    const handleEmailCheck = async (e) => {
        e.preventDefault();
        try {
            const checkResponse = await axios.post('https://be-um-fitness.vercel.app/auth/checkUserEmail', { email });
            if (checkResponse.data) {
                sendResetLink();
            } else {
                setResetPasswordStatus('Email does not exist.');
                setEmailError('Email does not exist.');
            }
        } catch (error) {
            setResetPasswordStatus('Error checking email.');
            alert('Error checking email.');
        }
    };

    const sendResetLink = async () => { 
        setLoading(true);
        try {
            const response = await axios.post('https://be-um-fitness.vercel.app/auth/forgotPassword', {
                email
            });
            setResetPasswordStatus(response.data.message);
            setNotification({ open: true, message: 'Reset password link sent.', severity: 'success' }); // Set success notification here
            setTimeout(() => { // Delay navigation
            navigate('/login');
          }, 2000);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setResetPasswordStatus(error.response.data.message);
                } else {
                    setResetPasswordStatus('An error occurred');
                }
            } else {
                setResetPasswordStatus('An unexpected error occurred');
            }
        }
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    return (
        <Grid 
        container 
        component="main" 
        sx={{ 
            height: '100vh', 
            width: '100vw',
            backgroundImage: `url(${backGround})`,
            backgroundPosition: 'center', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundSize: 'cover',

      }}
    >
      <Paper sx={{
        width: 737,
        height: 'auto', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)', 
        borderRadius: 2,
        padding: 4,
        margin: 4  
      }}>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }} margin={1} >
                Reset Your Password
            </Typography>
            <Typography component="h6" variant="h6" sx={{ fontWeight: 300, fontSize: '0.875rem' }} margin={1}>
                The reset password link will send via your email
            </Typography>
            <Box component="form" onSubmit={handleEmailCheck} sx={{ width: '100%' }}>
            <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!emailError}
                    helperText={emailError}
            />
                <GradientButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
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
};