import React, { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
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
export function DeleteFitnessPlan({id}) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [deleteFitnessPlanStatus, setDeleteFitnessPlanStatus] = useState('');
    
  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
        const response = await axios.delete(`http://localhost:3000/fitnessPlan/deleteFitnessPlan/${id}`);
        console.log(response.data);
        setDeleteFitnessPlanStatus(response.data.message);
        handleClose();
        navigate("/fitnessPlan");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setDeleteFitnessPlanStatus(error.response.data.message);
            } else {
                setDeleteFitnessPlanStatus('An error occurred');
            }
        } else {
            setDeleteFitnessPlanStatus('An unexpected error occurred');
        }
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
        Delete
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
                Are you sure you wish to delete the fitness plan?
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