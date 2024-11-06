import React from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import Cancel from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
    const navigate = useNavigate();

    const handleTryAgain = async () => {
        navigate(-1);
      };
      
    return (
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh', 
        }}
        >
            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 , marginTop:10, borderRadius:2}}>
            <Cancel color="error" sx={{ fontSize: 80 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1A237E'}}>
                    Payment Cancelled
                </Typography>
                <Typography variant="subtitle1">
                    Your Training Program Unsuccessfully Booked!
                </Typography>
                <Button variant="contained" color="primary" onClick={handleTryAgain}>
                    Try Again
                </Button>
            </Paper>
        </Box>
    );
};

export default PaymentCancel;
