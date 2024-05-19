import React, { useState } from 'react';
import {
    Typography,
    Paper,
    TextField, 
    Button
} from "@mui/material";
import { useNavigate } from 'react-router-dom';

export function Tracking() {

    const navigate = useNavigate();

    // State variables for storing user inputs
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const [bmiCategory, setBmiCategory] = useState('');
    const [waterConsumption, setWaterConsumption] = useState('');
    const [totalWaterConsumed, setTotalWaterConsumed] = useState(0);

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
        navigate("/bmi");
    };

    // Function to handle water consumption tracking
    const handleWaterConsumption = () => {
        navigate("/waterConsumption");
    };

    return (
        <>
            <Paper sx={{ width: 737, height: 300, m: 10, p: 2 }}>
                <Typography variant="h6" style={{ marginTop: 20 }}>
                    You haven't recorded your Body Mass index (BMI)
                </Typography>
                <div style={{ marginTop: 20 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={calculateBMI}
                        style={{ marginLeft: 20, marginTop: 8 }}
                    >
                        Calculate
                    </Button>
                    
                </div>
            </Paper>
            
            <Paper sx={{ width: 737, height: 300, m: 10, p: 2 }}>
                <Typography component="h6" variant="h6">
                    Record Your Water Consumption
                </Typography>
                <div style={{ marginTop: 20 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleWaterConsumption}
                        style={{ marginLeft: 20, marginTop: 8 }}
                    >
                        Add
                    </Button>
                </div>
            </Paper>
        </>
    );
}
