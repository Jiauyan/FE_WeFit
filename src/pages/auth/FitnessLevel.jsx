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
         <Grid>
            <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleBack}
              >
                Back
            </Button>
            <Typography component="h5" variant="h5" sx={{ mt: 4 }}>
                Select your fitness level
            </Typography>
            <Typography component="h6" variant="h6" sx={{ mb: 2 }}>
                It will help us to know your fitness level.
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <Button
                        key={level}
                        fullWidth
                        variant={fitnessLevel=== level ? "contained" : "outlined"}
                        color={fitnessLevel === level ? "primary" : "inherit"}
                        onClick={() => handleChange(level)}
                        sx={{ mb: 2 }}
                    >
                        {level}
                    </Button>
                ))}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={!fitnessLevel}
                    sx={{ mt: 3, mb: 2 }}
                >
                    Next
                </Button>
            </Box>
        </Grid>
    );
};