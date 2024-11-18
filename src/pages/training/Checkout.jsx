import React, { useState, useEffect } from 'react';
import { useUser } from "../../contexts/UseContext";
import axios from 'axios';
import { 
    Typography, 
    Paper, 
    Button, 
    Grid, 
    Box, 
    IconButton, 
    Radio, 
    RadioGroup, 
    FormControlLabel, 
    FormControl, 
    FormLabel, 
    TextField, 
    InputLabel, 
    Select, 
    MenuItem,
    Modal,
} from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import { GradientButton } from '../../contexts/ThemeProvider';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import { loadStripe } from '@stripe/stripe-js';


export function Checkout() {
    const [addCheckoutStatus, setAddCheckoutStatus] = useState('');
    const { user, updateUser, setUser } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const { id, pathPrev, name, contactNum, slot, trainingClassID, status, feeAmount, trainingProgram} = location.state;
    const [bookingDetails, setBookingDetails] = useState('');
  
  useEffect(() => {
      window.scrollTo(0, 0); // Scroll to the top of the page when the component loads
  }, []);

  useEffect(() => {
    const storedUid = localStorage.getItem('uid');
    if (storedUid) {
      setUser({ ...user, uid: storedUid });
    }
  }, []);

  const handleBack = async () => {
    navigate("/bookingDetails", { state: { id, pathName:"/screeningForm" , pathPrev}});
  };

  const handlePayment = async () => {
    // Save state before Stripe redirect
    localStorage.setItem('bookingData', JSON.stringify({
        uid: user.uid, name, contactNum, slot, trainingClassID, status, feeAmount, trainingProgram
    }));

    const savedData = JSON.parse(localStorage.getItem('bookingData'));

    if(feeAmount == 0 ){
        try {
            const bookingResponse = await axios.post('https://be-um-fitness.vercel.app/trainingClassBooking/addTrainingClassBooking', {
                uid: savedData.uid,
                name: savedData.name,
                contactNum: savedData.contactNum,
                slot: savedData.slot,
                trainingClassID: savedData.trainingClassID,
                status: savedData.status,
                feeAmount: savedData.feeAmount,
                paymentStatus: true,
                transactionId: ""
            }); 
            
            navigate("/bookingSuccess");
        } catch (error) {
            console.error("Booking Error:", error);
            alert('Failed to add booking details. Please try again.');
        }
    }else{
          // Payment required, proceed with Stripe
          try {
            const stripe = await loadStripe("pk_test_51QFrsIKymqYnhuBpBlgyp9gsHn2m5zvPXV8MvP3u6IYv6WTKmwKbEztxX0O9CXJDpnEdSE9rCJVLe4yx0P0avHCT00IJacHbeN");
            const response = await axios.post('https://be-um-fitness.vercel.app/checkout/createCheckoutSession', {
                trainingProgram, 
                feeAmount,
                customerName : savedData.name,
                customerEmail : user.email
            });
            const sessionId = response.data.sessionId;
            const transactionId = response.data.session;

            // Save sessionId to localStorage
            const bookingData = JSON.parse(localStorage.getItem('bookingData'));
            bookingData.sessionId = sessionId;
            bookingData.transactionId = transactionId;
            localStorage.setItem('bookingData', JSON.stringify(bookingData));

            // Redirect to Stripe checkout
            await stripe.redirectToCheckout({ sessionId });

        } catch (error) {
            console.error("Stripe Error:", error);
            alert('Failed to initiate payment process. Please try again.');
        }
        }
};

  return (
    <Grid
    container
    component="main"
    sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
        width: '100%' 
    }}
>
    <Paper sx={{
        width: { xs: '100%', sm: '90%', md: '80%', lg: '737px' }, // Responsive width
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '1px 1px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
        padding: 2,
        margin: 'auto' // Centers the paper in the viewport
    }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
              <IconButton onClick={handleBack}>
                <ArrowBackIos />
              </IconButton>
              <Typography>
                Step 4 of 4
              </Typography>
            </Box>

            <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
              Checkout
              </Typography>
              
              <Box
                  component="form"
                  sx={{ 
                    mt: 1, 
                    width: '100%', 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center', // Center align horizontally
                  }}
                >
                <Box sx={{ width: '90%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      Name:
                    </Typography>
                    <Typography variant="body1">
                      {name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      Contact Number:
                    </Typography>
                    <Typography variant="body1">
                      {contactNum}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      Training Program:
                    </Typography>
                    <Typography variant="body1">
                      {trainingProgram}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      Slot:
                    </Typography>
                    <Typography variant="body1">
                      {slot.time}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      Fee Amount:
                    </Typography>
                    <Typography variant="body1">
                      RM{feeAmount}
                    </Typography>
                  </Box>
                  <GradientButton
                        onClick={handlePayment}
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                    Checkout
                  </GradientButton>
              </Box> 
              
              </Box>
          </Paper>
        </Grid>
       
  );
}
