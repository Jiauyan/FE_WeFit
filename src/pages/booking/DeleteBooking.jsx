import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    Modal,
    TextField,
    IconButton,
}from "@mui/material";
import {Delete, Edit} from '@mui/icons-material';
import { GradientButton } from '../../contexts/ThemeProvider';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height : 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 20,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
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
        await axios.post('http://localhost:3000/checkout/refundPayment', {
          paymentIntentId: transactionId
        });
        alert('Refund processed successfully.');
      }
      await axios.delete(`http://localhost:3000/trainingClassBooking/deleteTrainingClassBooking/${id}`);
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

            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb:2, mt:10}} margin={1} >
                Confirm
            </Typography>
            <Typography component="h6" variant="h6" sx={{ fontWeight: 300 }} margin={1}>
                Are you sure you wish to delete the booking?
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