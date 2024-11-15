import React, { useEffect, useState } from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CheckCircle from '@mui/icons-material/CheckCircle';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [transactionId, setTransactionId] = useState('');
    const savedData = JSON.parse(localStorage.getItem('bookingData') || '{}');
    const sessionId = savedData.sessionId;
    
    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                if (!sessionId) {
                    console.error("No session ID available");
                    navigate("/errorPage"); // Redirect to an error page or handle this case as needed
                    return;
                }
                const response = await axios.post('https://be-um-fitness.vercel.app/checkout/completeCheckout', { sessionId : sessionId });
                setTransactionId(response.data.session.payment_intent);
            } catch (error) {
                console.error("Failed to fetch payment details:", error);
            }
        };
        fetchPaymentDetails();
    }, [sessionId, navigate]);

    const handleContinue = async () => {
        try {
            await Promise.all([
                axios.post('https://be-um-fitness.vercel.app/trainingClassBooking/addTrainingClassBooking', {
                    uid: savedData.uid,
                    name: savedData.name,
                    contactNum: savedData.contactNum,
                    slot: savedData.slot,
                    trainingClassID: savedData.trainingClassID,
                    status: savedData.status,
                    feeAmount: Number(savedData.feeAmount),
                    paymentStatus: true,
                    transactionId
                }),
                axios.post('https://be-um-fitness.vercel.app/payment/storePaymentStatus', {
                    uid: savedData.uid, 
                    paymentStatus: true, 
                    refundStatus: false, 
                    amount: Number(savedData.feeAmount), 
                    transactionId,
                    trainingProgramTitle: savedData.trainingProgram,
                    trainingProgramID: savedData.trainingClassID,
                })
            ]);
            localStorage.removeItem('bookingData');
            navigate("/myBooking");
        } catch (error) {
            console.error("Booking Error:", error);
            alert('Failed to add booking details. Please try again.');
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
                    Payment Successful
                </Typography>
                <Typography variant="subtitle1">
                Your Training Program Successfully Booked!
                </Typography>
                <Button variant="contained" color="primary" onClick={handleContinue}>
                    Continue
                </Button>
            </Paper>
        </Box>
    );
};

export default PaymentSuccess;
