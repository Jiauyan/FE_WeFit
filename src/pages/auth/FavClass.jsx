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
    Snackbar,
    Alert,
} from "@mui/material";
import { GradientButton } from '../../contexts/ThemeProvider';
import backGround from "../../assets/backGround.png";

export function FavClass() {
    const [favClass, setFavClass] = useState([]);
    const [favClassStatus, setFavClassStatus] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const location = useLocation();
    const uid = location.state?.uid; // Access the ID from the state

    const handleChange = (type) => {
        if (favClass.includes(type)) {
            setFavClass(favClass.filter(item => item !== type));
        } else {
            setFavClass([...favClass, type]);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleSubmit = async (e) => { 
        e.preventDefault(); 

        try {
            const response = await axios.post(`https://be-um-fitness.vercel.app/auth/favClass/${uid}`, {
                favClass
            });

            setFavClassStatus(response.data.message);
            setOpenSnackbar(true);
            setTimeout(() => {
                navigate('/login', { state: { uid } });
            }, 2000); 
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setFavClassStatus(error.response.data.message);
                } else {
                    setFavClassStatus('An error occurred');
                }
            } else {
                setFavClassStatus('An unexpected error occurred');
            }
        }
    };


    return (
        <Grid
        container
        component="main"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 3,
          width: '100%', // Ensures the grid takes full width,
          backgroundImage: `url(${backGround})`,
          backgroundPosition: 'center', 
          backgroundSize: 'cover',
        }}
      >
        <Paper sx={{
            width: { xs: '100%', sm: '90%', md: '80%', lg: '737px' }, // Responsive width
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: 2,
            padding: 2,
            margin: 'auto' // Centers the paper in the viewport
          }}>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }} margin={1} >
                Select all your favorite type of exercises
            </Typography>
            <Typography component="h6" variant="h6" sx={{ fontWeight: 300, fontSize: '0.875rem' }} margin={1}>
                It will help us to know your favorite types of exercises.
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                {['Yoga', 'Dance', 'Cardio', 'Strength', 'HIIT', 'Meditation'].map((type) => (
                    <Button
                        key={type}
                        fullWidth
                        variant={favClass.includes(type) ? "contained" : "outlined"}
                        color={favClass.includes(type) ? "primary" : "inherit"}
                        onClick={() => handleChange(type)}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {type}
                    </Button>
                ))}
                <GradientButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={favClass.length === 0}
                    sx={{ mt: 3, mb: 2 }}
                >
                    Confirm
                </GradientButton>
                <Snackbar 
                open={openSnackbar} 
                autoHideDuration={2000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    top: '50%',
                    transform: 'translateY(-50%)',
                }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Registration successful! Redirecting to login page...
                </Alert>
            </Snackbar>
            </Box>
      </Paper>
    </Grid>
    );
};