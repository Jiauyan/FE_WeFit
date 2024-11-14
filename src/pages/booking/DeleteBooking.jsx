import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    Modal,
}from "@mui/material";
import { GradientButton } from '../../contexts/ThemeProvider';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '90%', // full width on extra small devices
    sm: '80%', // slightly smaller on small devices
    md: '70%', // and even smaller on medium devices
    lg: 500,   // fixed size on large devices and up
  },
  height: 'auto', // makes height dynamic
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 20,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflowY: 'auto', // add scroll on Y-axis if content is too long
};

export function DeleteBooking({id, transactionId, feeAmount}) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [deleteBookingStatus, setDeleteBookingStatus] = useState('');
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (Number(feeAmount) > 0) {
        await axios.post('https://be-um-fitness.vercel.app/checkout/refundPayment', {
          paymentIntentId: transactionId
        });
        alert('Refund processed successfully.');
      }
      await axios.delete(`https://be-um-fitness.vercel.app/trainingClassBooking/deleteTrainingClassBooking/${id}`);
      setDeleteBookingStatus('Booking cancelled successfully');
      alert('Booking cancelled successfully.');
      handleClose();
      navigate("/myBooking");
    } catch (error) {
      const message = axios.isAxiosError(error) && error.response ? error.response.data.message : 'An unexpected error occurred';
      setDeleteBookingStatus(message);
      handleClose();
    }
  };

  return (
    <div>
      <GradientButton
      fullWidth
      variant="contained"
      color="primary"
      sx={{ mt: 3, mb: 2, mr: 1 }} 
      onClick={handleOpen} 
      aria-label="delete">
       Cancel Booking
     </GradientButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        
        <Box sx={style} component="form" noValidate onSubmit={handleSubmit}>
            <Button 
                onClick={handleClose}
                sx={{ position: 'absolute', top: 10, right: 10 }}
            >
                X
            </Button>

            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb:2, mt:5 }}>
                Confirm
            </Typography>
            <Typography component="h6" variant="h6" sx={{ fontWeight: 300 , textAlign: 'center'}}>
                Are you sure you wish to delete this booking?
            </Typography>
            <GradientButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
            >
                Confirm
            </GradientButton>
        </Box>
      </Modal>
    </div>
  );
}