import React, { useState } from 'react';
import {
    Typography,
    Paper,
    TextField, 
    Button
} from "@mui/material";

import { useNavigate, Outlet } from 'react-router-dom';

export function WaterConsumption() {
    const navigate = useNavigate();
    // State variables for storing user inputs
    const [waterConsumption, setWaterConsumption] = useState('');
    const [totalWaterConsumed, setTotalWaterConsumed] = useState(0);


    // Function to handle water consumption tracking
    const handleWaterConsumption = () => {
        if (waterConsumption) {
            const consumedWater = parseInt(waterConsumption);
            setTotalWaterConsumed(totalWaterConsumed + consumedWater);
            setWaterConsumption('');
        }
    };

    const handleBack = () => {
        navigate("/tracking");
    };

    return (
        <>
            <Paper sx={{ width: 737, height: 300, m: 10, p: 2 }}>
                <Typography component="h6" variant="h6">
                    Record Your Water Consumption
                </Typography>
                <div style={{ marginTop: 20 }}>
                    <TextField
                        label="Water Consumption (ml)"
                        variant="outlined"
                        value={waterConsumption}
                        onChange={(e) => setWaterConsumption(e.target.value)}
                        type="number" />
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
                        onClick={handleWaterConsumption}
                        style={{ marginLeft: 20, marginTop: 8 }}
                    >
                        Add
                    </Button>
                </div>
                <Typography variant="h6" style={{ marginTop: 20 }}>
                    Total Water Consumed: {totalWaterConsumed} ml
                </Typography>
            </Paper>
        </>
    );
}
