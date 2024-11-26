import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate, useLocation} from 'react-router-dom';
import {
    Grid,
    Typography,
    Paper,
    CircularProgress
} from "@mui/material";
import { GradientButton } from '../../contexts/ThemeProvider';
import backGround from "../../assets/backGround.png";


export function DeleteAccountSuccess() {
    
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();
    const location = useLocation();


    const handleRegister = async () => { 
        navigate("/register");
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
            backgroundSize: 'cover'
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
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold',textAlign: 'center' }} margin={1}>
          Account Deleted Successfully!
        </Typography>
        <Typography component="h6" variant="h6" sx={{ fontWeight: 300, fontSize: '0.875rem',textAlign: 'center' }} margin={1}>
        Your account has been permanently deleted. You can create a new account by clicking the “Register” button.
        </Typography>
        <GradientButton 
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleRegister}
        >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
        </GradientButton>
      </Paper>
    </Grid>

    );
};