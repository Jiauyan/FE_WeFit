import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from "../../contexts/UseContext";
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    Modal,
    TextField,
    IconButton,
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


export function DeleteTrainerAccount() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [deleteAccountStatus, setDeleteAccountStatus] = useState('');
  const { user , setUser} = useUser();
  const uid = user.uid;

  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
        const response = await axios.delete(`http://localhost:3000/auth/deleteAccount/${uid}`);
        console.log(response.data);
        setDeleteAccountStatus(response.data.message);
        //handleClose();
        navigate("/login");
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
    }
};



  return (
    <div>
      <Button onClick={handleOpen} edge="end" aria-label="delete">
        Delete
     </Button>
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
                Are you sure you wish to delete your account?
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