import React, { useState } from 'react';
import {
    Typography,
    Paper,
    TextField, 
    Button
} from "@mui/material";
import { useNavigate, Outlet } from 'react-router-dom';

export function BMI() {
    const navigate = useNavigate();
    // State variables for storing user inputs
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const [bmiCategory, setBmiCategory] = useState('');

    // Function to determine BMI category
    const determineBmiCategory = (bmi) => {
        if (bmi < 16) return 'Severely Underweight';
        if (bmi >= 16 && bmi <= 18.5) return 'Underweight';
        if (bmi >= 18.6 && bmi <= 25) return 'Normal Weight';
        if (bmi >= 25.1 && bmi <= 30) return 'Overweight';
        if (bmi >= 30.1 && bmi <= 35) return 'Moderately Obese';
        return 'Severely Obese'; // for bmi > 35
    };

    // Function to calculate BMI
    const calculateBMI = () => {
        if (weight && height) {
            const heightInMeters = height / 100; // convert height from cm to meters
            const bmiValue = weight / (heightInMeters * heightInMeters);
            const roundedBmi = bmiValue.toFixed(2);
            setBmi(roundedBmi);
            setBmiCategory(determineBmiCategory(roundedBmi));
        }
    };

    const handleBack = () => {
        navigate("/tracking");
    };

    return (
        <>
            <Paper sx={{ width: 737, height: 300, m: 10, p: 2 }}>
                <Typography component="h6" variant="h6">
                    Calculate Your Body Mass Index (BMI)
                </Typography>
                <div style={{ marginTop: 20 }}>
                    <TextField
                        label="Weight (kg)"
                        variant="outlined"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        type="number" />
                    <TextField
                        label="Height (cm)"
                        variant="outlined"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        type="number"
                        style={{ marginLeft: 20 }} />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleBack}
                        style={{ marginLeft: 20, marginTop: 8 }}
                    >
                        Back
                    </Button>    
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={calculateBMI}
                        style={{ marginLeft: 20, marginTop: 8 }}
                    >
                        Calculate
                    </Button>
                </div>
                    <Typography variant="h6" style={{ marginTop: 20 }}>
                        Your BMI is: {bmi} ({bmiCategory})
                    </Typography>
            </Paper>
            <Outlet></Outlet>
        </>
    );
}
