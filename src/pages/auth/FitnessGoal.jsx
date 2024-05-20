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



export function FitnessGoal() {
    
    const [fitnessGoal, setFitnessGoal] = useState('');
    const [fitnessGoalStatus, setFitnessGoalStatus] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const uid = location.state?.uid; // Access the ID from the state

    const handleChange = async (goal) => {
        setFitnessGoal(goal);
      };

    const handleBack = async () => {
        navigate("/fitnessLevel");
    };  

    const handleSubmit = async (e) => { 
        e.preventDefault(); 

        try {
            const response = await axios.post(`http://localhost:3000/auth/fitnessGoal/${uid}`, {
               fitnessGoal
            });

            setFitnessGoalStatus(response.data.message);
            navigate('/favClass', { state: { uid } });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setFitnessGoalStatus(error.response.data.message);
                } else {
                    setFitnessGoalStatus('An error occurred');
                }
            } else {
                setFitnessGoalStatus('An unexpected error occurred');
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
                What's your goal? 
            </Typography>
            <Typography component="h6" variant="h6" sx={{ mb: 2 }}>
                It will help us to know your goal for participating in fitness activity.
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                {['Lose weight', 'Be more active', 'Stay toned', 'Reduce stress', 'Build muscle'].map((goal) => (
                    <Button
                        key={goal}
                        fullWidth
                        variant={fitnessGoal=== goal ? "contained" : "outlined"}
                        color={fitnessGoal === goal ? "primary" : "inherit"}
                        onClick={() => handleChange(goal)}
                        sx={{ mb: 2 }}
                    >
                        {goal}
                    </Button>
                ))}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={!fitnessGoal}
                    sx={{ mt: 3, mb: 2 }}
                >
                    Next
                </Button>
            </Box>
       </Grid>
    );
};