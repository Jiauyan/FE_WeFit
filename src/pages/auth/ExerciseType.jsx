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



export function ExerciseType() {
    
    const [exerciseType, setExerciseType] = useState([]);
    const [exerciseTypeStatus, setExerciseTypeStatus] = useState('');
    const navigate = useNavigate();

    const location = useLocation();
    const uid = location.state?.uid; // Access the ID from the state

    const handleChange = (type) => {
        if (exerciseType.includes(type)) {
            setExerciseType(exerciseType.filter(item => item !== type));
        } else {
            setExerciseType([...exerciseType, type]);
        }
    };

    const handleBack = async () => {
        navigate("/fitnessGoal");
    }; 
    const handleSubmit = async (e) => { 
        e.preventDefault(); 

        try {
            const response = await axios.post(`http://localhost:3000/auth/exerciseType/${uid}`, {
                exerciseType
            });

            setExerciseTypeStatus(response.data.message);
            navigate('/login',{ state: { uid } });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setExerciseTypeStatus(error.response.data.message);
                } else {
                    setExerciseTypeStatus('An error occurred');
                }
            } else {
                setExerciseTypeStatus('An unexpected error occurred');
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
                Select all yout favorite type of exercises
            </Typography>
            <Typography component="h6" variant="h6" sx={{ mb: 2 }}>
                It will help us to know your favorite types of exercises.
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                {['Yoga', 'Dance', 'Cardio', 'Strength', 'HIIT', 'Meditation'].map((type) => (
                    <Button
                        key={type}
                        fullWidth
                        variant={exerciseType.includes(type) ? "contained" : "outlined"}
                        color={exerciseType.includes(type) ? "primary" : "inherit"}
                        onClick={() => handleChange(type)}
                        sx={{ mb: 2 }}
                    >
                        {type}
                    </Button>
                ))}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={exerciseType.length === 0}
                    sx={{ mt: 3, mb: 2 }}
                >
                    Next
                </Button>
            </Box>
       </Grid>
    );
};