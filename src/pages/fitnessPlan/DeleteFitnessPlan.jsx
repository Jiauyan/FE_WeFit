import React, { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Button,
    Typography,
    Modal,
    MenuItem
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
      <MenuItem
      onClick={handleOpen} 
      aria-label="delete">
        Delete
     </MenuItem>
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