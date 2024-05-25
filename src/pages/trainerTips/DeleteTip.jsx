import React, { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Button,
    Typography,
    Modal,
}from "@mui/material";

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
};

export function DeleteTip({id}) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [deleteTipStatus, setDeleteTipStatus] = useState('');
    
  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
        const response = await axios.delete(`http://localhost:3000/tips/deleteTip/${id}`);
        console.log(response.data);
        setDeleteTipStatus(response.data.message);
        handleClose();
        navigate("/trainerTips");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setDeleteTipStatus(error.response.data.message);
            } else {
                setDeleteTipStatus('An error occurred');
            }
        } else {
            setDeleteTipStatus('An unexpected error occurred');
        }
    }
};



  return (
    <div>
      <Button variant="contained" fullWidth sx={{ mt: 3, mb: 3 }} onClick={handleOpen} aria-label="delete">
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

            <Typography id="modal-modal-title" variant="h6" component="h2">
                Confirm
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Are you sure you wish to delete your sharing tip?
            </Typography>
            <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
            >
                Confirm
            </Button>
        </Box>
      </Modal>
    </div>
  );
}