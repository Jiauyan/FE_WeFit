import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useUser, UserContext } from "../../contexts/UseContext";
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    Modal,
    CircularProgress,
}from "@mui/material";

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

import { GradientButton } from '../../contexts/ThemeProvider';

export function DeleteAccount() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [deleteAccountStatus, setDeleteAccountStatus] = useState('');
  const { deleteAccount, user } = useUser();
  const [loading, setLoading] = useState(false); // Loading state

  const handleDelete = async () => { 
    setLoading(true); // Start loading

    try {
        const uid = user?.uid;
        const response = await deleteAccount(uid);
        setDeleteAccountStatus(response.data);
        navigate("/deleteAccountSuccess");
      } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setDeleteAccountStatus(error.response.data.message);
            } else {
                setDeleteAccountStatus('An error occurred');
            }
        } else {
            setDeleteAccountStatus('An unexpected error occurred');
        }
    }finally {
      setLoading(false); // Stop loading
    }
};



  return (
    <div>
      <Button onClick={handleOpen} edge="end" aria-label="delete">
        Delete Account
     </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        
        <Box sx={style}>
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
              Are you sure you wish to delete your account?
            </Typography>
            <GradientButton onClick={handleDelete} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
              </GradientButton>
        </Box>
      </Modal>
    </div>
  );
}