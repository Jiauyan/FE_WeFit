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


export function FitnessLevel() {
    
    const [fitnessLevel, setFitnessLevel] = useState('');
    const [fitnessLevelStatus, setFitnessLevelStatus] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const uid = location.state?.uid; // Access the ID from the state

    const handleChange = async (level) => {
        setFitnessLevel(level);
      };

    const handleBack = async () => {
        navigate("/completeProfile");
    }; 

    const handleSubmit = async (e) => { 
        e.preventDefault(); 

        try {
            const response = await axios.post(`http://localhost:3000/auth/fitnessLevel/${uid}`, {
                fitnessLevel
            });

            setFitnessLevelStatus(response.data.message);
            navigate('/fitnessGoal', { state: { uid } });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setFitnessLevelStatus(error.response.data.message);
                } else {
                    setFitnessLevelStatus('An error occurred');
                }
            } else {
                setFitnessLevelStatus('An unexpected error occurred');
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
                Select your fitness level
            </Typography>
            <Typography component="h6" variant="h6" sx={{ fontWeight: 300, fontSize: '0.875rem' }} margin={1}>
                It will help us to know your fitness level.
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{  mt: 1,width: '100%' }}>
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <Button
                        key={level}
                        fullWidth
                        variant={fitnessLevel=== level ? "contained" : "outlined"}
                        color={fitnessLevel === level ? "primary" : "inherit"}
                        onClick={() => handleChange(level)}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {level}
                    </Button>
                ))}
                <GradientButton 
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={!fitnessLevel}
                    sx={{ mt: 3, mb: 2 }}
                >
                    Next
                </GradientButton >
            </Box>
      </Paper>
    </Grid>

    );
};