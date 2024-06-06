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

export function FavClass() {
    const [favClass, setFavClass] = useState([]);
    const [favClassStatus, setFavClassStatus] = useState('');
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

    const handleBack = async () => {
        navigate("/fitnessGoal");
    }; 
    const handleSubmit = async (e) => { 
        e.preventDefault(); 

        try {
            const response = await axios.post(`http://localhost:3000/auth/favClass/${uid}`, {
                favClass
            });

            setFavClassStatus(response.data.message);
            navigate('/login',{ state: { uid } });
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
            height: '100vh', 
            width: '100vw',
            backgroundImage: `url(${backGround})`,
            backgroundPosition: 'center', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
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
                Select all yout favorite type of exercises
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
            </Box>
      </Paper>
    </Grid>
    );
};