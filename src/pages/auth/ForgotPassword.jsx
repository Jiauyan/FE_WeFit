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
        <Grid>
            <Typography component="h5" variant="h5" sx={{ mt: 4 }}>
                Reset your password
            </Typography>
            <Typography component="h6" variant="h6" sx={{ mb: 2 }}>
                The reset password link will send via your email
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
                    margin="normal"
                    //required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={(e) => setEmail(e.target.value)}
            />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Confirm
                </Button>
            </Box>
       </Grid>
    );
};