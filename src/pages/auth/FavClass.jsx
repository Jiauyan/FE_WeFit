import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate, useLocation} from 'react-router-dom';
import {
    Grid,
    Box,
    Typography,
    Button,
    Paper,
    Snackbar,
    Alert,
    CircularProgress
} from "@mui/material";
import { GradientButton } from '../../contexts/ThemeProvider';
import backGround from "../../assets/backGround.png";
import MuiAlert from '@mui/material/Alert';

export function FavClass() {
    const [favClass, setFavClass] = useState([]);
    const [favClassStatus, setFavClassStatus] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' }); // Notification state

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

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    const handleSubmit = async (e) => { 
        e.preventDefault(); 
        setLoading(true); // Start loading

        try {
            const response = await axios.post(`https://be-um-fitness.vercel.app/auth/favClass/${uid}`, {
                favClass
            });

            setFavClassStatus(response.data.message);
            setNotification({ open: true, message: 'Register successful!', severity: 'success' }); // Set success notification here
            setTimeout(() => {
                navigate('/login', { state: { uid } });
            }, 1000); 
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
        } finally {
            setLoading(false); // Stop loading
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
            width: '100%',
            backgroundImage: `url(${backGround})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            minHeight: '100vh', // Ensure it covers at least the height of the viewport
            '@media (max-width: 768px)': {
              backgroundSize: 'contain', // Adjust background size on smaller screens
            }
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