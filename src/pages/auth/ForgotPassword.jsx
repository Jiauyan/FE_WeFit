import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate, useLocation} from 'react-router-dom';
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
import { GradientButton } from '../../contexts/ThemeProvider';
import backGround from "../../assets/backGround.png";

export function ForgotPassword() {

    const [email, setEmail] = useState('');
    const [resetPasswordStatus, setResetPasswordStatus] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => { 
        e.preventDefault(); 

        try {
            const response = await axios.post('http://localhost:3000/auth/forgotPassword', {
                email
            });

            setResetPasswordStatus(response.data.message);
            navigate('/login');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setResetPasswordStatus(error.response.data.message);
                } else {
                    setFaResetPasswordStatus('An error occurred');
                }
            } else {
                setResetPasswordStatus('An unexpected error occurred');
            }
        }
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
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
            />
                <GradientButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Confirm
                </GradientButton>
            </Box>
      </Paper>
    </Grid>
    );
};