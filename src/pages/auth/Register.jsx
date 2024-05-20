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



export function Register() {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signupStatus, setSignupStatus] = useState('');
    const navigate = useNavigate();

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

   
    const handleSubmit = async (e) => { 
        e.preventDefault(); 

        try {
            const response = await axios.post('http://localhost:3000/auth/registerAcc', {
                email,
                password
            });
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
       <Grid>
        <Grid></Grid>
            <Typography component="h1" variant="h5">
                Resgister Account 
            </Typography>
            <Typography component="h6" variant="h6">
                Follow the instructions to make it easier to register and you will be able to explore inside.
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Next
            </Button>
                <Link href="/login" variant="body2">
                    {"Do you have account? Sign in"}
                </Link>
        </Box>
       </Grid>
    );
};
