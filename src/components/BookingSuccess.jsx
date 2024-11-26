import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Paper, CircularProgress} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircle from '@mui/icons-material/CheckCircle';

const BookingSuccess = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleContinue = async () => {
        
    setLoading(true);
        try {
            // Clear bookingData from localStorage after successful booking
            localStorage.removeItem('bookingData');
            navigate("/myBooking");
        } catch (error) {
            console.error("Booking Error:", error);
            alert('Failed to add booking details. Please try again.');
        } finally {
            setLoading(false)
           }
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
            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginTop: 10, borderRadius: 2 }}>
                <CheckCircle color="success" sx={{ fontSize: 80 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1A237E'}}>
                    Booking Successful
                </Typography>
                <Typography variant="subtitle1">
                Your Training Program Successfully Booked!
                </Typography>
                <Button variant="contained" color="primary" onClick={handleContinue}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Continue'}
                </Button>
            </Paper>
        </Box>
    );
};

export default BookingSuccess;
