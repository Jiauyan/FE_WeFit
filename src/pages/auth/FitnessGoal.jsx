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
            const response = await axios.post(`https://be-um-fitness.vercel.app/auth/fitnessGoal/${uid}`, {
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
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }} margin={1}>
                What's your goal? 
            </Typography>
            <Typography component="h6" variant="h6" sx={{ fontWeight: 300, fontSize: '0.875rem' }} margin={1}>
                It will help us to know your goal for participating in fitness activity.
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                {['Lose weight', 'Be more active', 'Stay toned', 'Reduce stress', 'Build muscle'].map((goal) => (
                    <Button
                        key={goal}
                        fullWidth
                        variant={fitnessGoal=== goal ? "contained" : "outlined"}
                        color={fitnessGoal === goal ? "primary" : "inherit"}
                        onClick={() => handleChange(goal)}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {goal}
                    </Button>
                ))}
                <GradientButton 
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={!fitnessGoal}
                    sx={{ mt: 3, mb: 2 }}
                >
                    Next
                </GradientButton >
            </Box>
      </Paper>
    </Grid>
    );
};